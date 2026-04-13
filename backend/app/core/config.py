from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = "dev"
    database_url: str
    pgvector_connection_string: str

    openai_api_key: str = ""
    openai_model: str = "gpt-4.1-mini"
    embedding_model: str = "text-embedding-3-small"

    backend_cors_origins: str = "http://localhost:3000"
    chunk_size: int = 800
    chunk_overlap: int = 120
    top_k_scripture: int = 6
    upload_dir: str = "/app/uploads"
    max_upload_mb: int = 20

    def cors_origins(self) -> List[str]:
        return [
            origin.strip()
            for origin in self.backend_cors_origins.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
