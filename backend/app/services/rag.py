from llama_index.core import Document, Settings, StorageContext, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.postgres import PGVectorStore
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.db_models import MaterialSource


class RAGService:
    def __init__(self) -> None:
        self.settings = get_settings()
        if self.settings.openai_api_key:
            Settings.embed_model = OpenAIEmbedding(
                model=self.settings.embedding_model,
                api_key=self.settings.openai_api_key,
            )
        self.splitter = SentenceSplitter(
            chunk_size=self.settings.chunk_size,
            chunk_overlap=self.settings.chunk_overlap,
        )
        self.vector_store = PGVectorStore.from_params(
            database="prayer_studio",
            host=self._host_from_conn(),
            password=self._password_from_conn(),
            port=self._port_from_conn(),
            user=self._user_from_conn(),
            table_name="prayer_chunks",
            embed_dim=1536,
            hybrid_search=False,
        )
        self.storage_context = StorageContext.from_defaults(vector_store=self.vector_store)

    def _host_from_conn(self) -> str:
        return self.settings.pgvector_connection_string.split("@")[1].split(":")[0]

    def _port_from_conn(self) -> int:
        return int(self.settings.pgvector_connection_string.rsplit(":", 1)[1].split("/")[0])

    def _user_from_conn(self) -> str:
        return self.settings.pgvector_connection_string.split("//")[1].split(":")[0]

    def _password_from_conn(self) -> str:
        return self.settings.pgvector_connection_string.split(":", 2)[2].split("@")[0]

    def build_or_update_index_for_source(self, source: MaterialSource) -> None:
        documents = [
            Document(
                text=source.raw_text,
                metadata={
                    "source_id": source.id,
                    "title": source.title,
                    "source_type": source.source_type,
                    "tags": source.tags,
                },
            )
        ]
        nodes = self.splitter.get_nodes_from_documents(documents)
        VectorStoreIndex(nodes, storage_context=self.storage_context)

    def retrieve(self, query: str, top_k: int = 5, filters: dict | None = None) -> list[dict]:
        index = VectorStoreIndex.from_vector_store(self.vector_store)
        retriever = index.as_retriever(similarity_top_k=top_k)
        nodes = retriever.retrieve(query)
        results: list[dict] = []
        for node in nodes:
            metadata = node.metadata or {}
            if filters:
                if any(metadata.get(k) != v for k, v in filters.items()):
                    continue
            results.append(
                {
                    "text": node.text,
                    "metadata": metadata,
                    "score": getattr(node, "score", None),
                }
            )
        return results

    def reindex_all_sources(self, db: Session) -> None:
        sources = db.execute(select(MaterialSource)).scalars().all()
        for source in sources:
            self.build_or_update_index_for_source(source)
