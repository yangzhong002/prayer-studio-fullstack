from app.core.config import get_settings
from app.models.schemas import GenerateRequest, GenerationResponse
from app.services.llm import LLMService
from app.services.prompt_builder import build_generation_prompt
from app.services.rag import RAGService


class GenerationPipeline:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.rag = RAGService()
        self.llm = LLMService()

    def run(self, request: GenerateRequest) -> GenerationResponse:
        scripture_chunks = self.rag.retrieve(
            request.user_input,
            top_k=self.settings.top_k_scripture,
            filters={"source_type": "scripture"},
        )

        prompt = build_generation_prompt(request, scripture_chunks)
        result = self.llm.generate_structured_output(prompt)
        result.retrieval_debug = {
            "scripture_chunks": [item["metadata"] for item in scripture_chunks],
        }
        return result
