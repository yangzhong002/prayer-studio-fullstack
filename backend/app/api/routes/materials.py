from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db import get_db
from app.models.db_models import MaterialSource
from app.models.schemas import MaterialIngestTextRequest, MaterialSourceOut
from app.services.rag import RAGService
from app.utils.text_extractor import extract_text_from_file

router = APIRouter(prefix="/api/materials", tags=["materials"])
settings = get_settings()


@router.get("/sources", response_model=list[MaterialSourceOut])
def list_sources(db: Session = Depends(get_db)):
    rows = (
        db.execute(select(MaterialSource).order_by(MaterialSource.id.desc()))
        .scalars()
        .all()
    )
    return [
        MaterialSourceOut(
            id=row.id,
            title=row.title,
            source_type=row.source_type,
            tags=[tag for tag in row.tags.split(",") if tag],
            filename=row.filename,
        )
        for row in rows
    ]


@router.post("/ingest-text", response_model=MaterialSourceOut)
def ingest_text(payload: MaterialIngestTextRequest, db: Session = Depends(get_db)):
    source = MaterialSource(
        title=payload.title,
        source_type=payload.source_type,
        tags=",".join(payload.tags),
        raw_text=payload.raw_text,
    )
    db.add(source)
    db.commit()
    db.refresh(source)
    RAGService().build_or_update_index_for_source(source)
    return MaterialSourceOut(
        id=source.id,
        title=source.title,
        source_type=source.source_type,
        tags=payload.tags,
        filename=source.filename,
    )


@router.post("/upload", response_model=MaterialSourceOut)
def upload_material(
    title: str = Form(...),
    tags: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    target = upload_dir / file.filename
    content = file.file.read()
    max_bytes = settings.max_upload_mb * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(status_code=413, detail="File too large")
    target.write_bytes(content)
    try:
        raw_text = extract_text_from_file(target)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    source = MaterialSource(
        title=title,
        source_type="scripture",
        tags=tags,
        raw_text=raw_text,
    )
    db.add(source)
    db.commit()
    db.refresh(source)
    RAGService().build_or_update_index_for_source(source)

    return MaterialSourceOut(
        id=source.id,
        title=source.title,
        source_type=source.source_type,
        tags=[tag for tag in tags.split(",") if tag],
        filename=source.filename,
    )
