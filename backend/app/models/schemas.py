from typing import List, Literal, Optional

from pydantic import BaseModel, Field


PastorStyle = Literal[
    "spurgeon", "lloyd-jones", "tozer", "piper", "keller", "biblical", "simple"
]
Tone = Literal["reverent", "tender", "solemn", "hopeful", "urgent"]
Length = Literal["short", "medium", "long"]


class GenerateRequest(BaseModel):
    user_input: str = Field(..., min_length=8)
    selected_styles: List[PastorStyle] = Field(default_factory=list)
    tone: Tone = "reverent"
    length: Length = "medium"
    language: Literal["es", "en"] = "en"


class ScriptureItem(BaseModel):
    reference: str
    text: str
    relevance_note: str


class GenerationResponse(BaseModel):
    scripture: List[ScriptureItem]
    sermon: str
    prayer: str
    retrieval_debug: Optional[dict] = None


class MaterialIngestTextRequest(BaseModel):
    title: str
    source_type: Literal["scripture"] = "scripture"
    tags: List[str] = Field(default_factory=list)
    raw_text: str = Field(..., min_length=10)


class MaterialSourceOut(BaseModel):
    id: int
    title: str
    source_type: str
    tags: List[str]
    filename: str | None = None


class StyleOption(BaseModel):
    id: str
    label: str
    description: str
