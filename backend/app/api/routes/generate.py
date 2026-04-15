from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from openai import RateLimitError
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
    try:
        pipeline = GenerationPipeline()
        return pipeline.run(body)
    except RateLimitError as e:
        if "insufficient_quota" in str(e) or "billing" in str(e).lower():
            return JSONResponse(
                status_code=503,
                content={"detail": "The AI service is temporarily unavailable due to usage limits. Please try again later."},
            )
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests to the AI service. Please wait a moment and try again."},
        )
