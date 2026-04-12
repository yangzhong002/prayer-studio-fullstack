from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models.schemas import GenerateRequest, GenerationResponse
from app.services.pipeline import GenerationPipeline
from app.services.styles import STYLE_OPTIONS

router = APIRouter(prefix="/api", tags=["generation"])
limiter = Limiter(key_func=get_remote_address)


@router.get("/styles")
def list_styles():
    return STYLE_OPTIONS


@router.post("/generate", response_model=GenerationResponse)
@limiter.limit("10/minute")
def generate(request: Request, body: GenerateRequest) -> GenerationResponse:
    pipeline = GenerationPipeline()
    return pipeline.run(body)
