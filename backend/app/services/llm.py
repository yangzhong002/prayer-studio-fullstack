import json
from textwrap import dedent

from openai import OpenAI

from app.core.config import get_settings
from app.models.schemas import GenerationResponse

# Schema for LLM output — excludes retrieval_debug which is set after generation
_LLM_OUTPUT_SCHEMA = {
    "type": "json_schema",
    "name": "generation_output",
    "strict": True,
    "schema": {
        "type": "object",
        "properties": {
            "scripture": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "reference": {"type": "string"},
                        "text": {"type": "string"},
                        "relevance_note": {"type": "string"},
                    },
                    "required": ["reference", "text", "relevance_note"],
                    "additionalProperties": False,
                },
            },
            "sermon": {"type": "string"},
            "prayer": {"type": "string"},
        },
        "required": ["scripture", "sermon", "prayer"],
        "additionalProperties": False,
    },
}


class LLMService:
    def __init__(self) -> None:
        settings = get_settings()
        self.client = (
            OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None
        )
        self.model = settings.openai_model

    def generate_structured_output(self, prompt: str) -> GenerationResponse:
        if not self.client:
            return self._fallback(prompt)

        system = dedent(
            """
            You produce JSON only.
            Return an object with keys: scripture, sermon, prayer.
            scripture must be a list of {reference, text, relevance_note}.
            sermon and prayer must be plain strings.
            """
        ).strip()

        response = self.client.responses.create(
            model=self.model,
            input=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
            text={"format": _LLM_OUTPUT_SCHEMA},
        )
        data = json.loads(response.output_text)
        return GenerationResponse.model_validate(data)

    def _fallback(self, prompt: str) -> GenerationResponse:
        teaser = prompt[:400]
        return GenerationResponse(
            scripture=[
                {
                    "reference": "Sample Reference",
                    "text": "Configure OPENAI_API_KEY to enable full generation.",
                    "relevance_note": "Fallback mode only.",
                }
            ],
            sermon=f"[Fallback sermon draft]\n\n{teaser}",
            prayer="[Fallback prayer draft]\n\nLord, guide us in Your truth and sustain us by Your grace. Amen.",
        )
