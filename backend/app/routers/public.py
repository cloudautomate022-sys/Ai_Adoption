from __future__ import annotations

import io
import secrets
import unicodedata

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import Response, StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..engine import evaluate
from ..models import Assessment
from ..pdf_report import render_pdf
from ..schemas import AssessmentCreated, AssessmentIn
from ..content import LANGUAGES, DEFAULT_LANGUAGE

router = APIRouter(prefix="/api/assessments", tags=["assessments"])


def _slug(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode()
    cleaned = "".join(ch if ch.isalnum() else "-" for ch in ascii_value)
    return "-".join(part for part in cleaned.split("-") if part)[:50] or "report"


@router.post("", response_model=AssessmentCreated, status_code=201)
def create_assessment(payload: AssessmentIn, db: Session = Depends(get_db)) -> AssessmentCreated:
    answers = payload.model_dump(mode="json")
    result = evaluate(answers)

    assessment = Assessment(
        public_id=secrets.token_urlsafe(18),
        company_name=payload.company_name,
        contact_name=payload.contact_name,
        email=str(payload.email),
        phone=payload.phone,
        sector=payload.sector,
        employees=payload.employees,
        language=payload.language,
        strategy=result["strategy"],
        overall_score=result["scores"]["overall"],
        data_score=result["scores"]["data_maturity"],
        answers=answers,
        result=result,
        notes=payload.notes,
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return AssessmentCreated(public_id=assessment.public_id, result=result)


@router.get("/{public_id}")
def get_assessment(
    public_id: str,
    lang: str = Query(default=""),
    db: Session = Depends(get_db),
) -> dict:
    assessment = db.scalar(select(Assessment).where(Assessment.public_id == public_id))
    if assessment is None:
        raise HTTPException(status_code=404, detail="Assessment not found")

    language = assessment.language
    result = assessment.result
    if lang in LANGUAGES:
        answers = dict(assessment.answers or {})
        answers["language"] = lang
        result = evaluate(answers)
        language = lang

    return {
        "public_id": assessment.public_id,
        "created_at": assessment.created_at,
        "company_name": assessment.company_name,
        "language": language,
        "result": result,
    }


@router.get("/{public_id}/pdf")
def download_pdf(
    public_id: str,
    lang: str = Query(default=""),
    db: Session = Depends(get_db),
) -> Response:
    assessment = db.scalar(select(Assessment).where(Assessment.public_id == public_id))
    if assessment is None:
        raise HTTPException(status_code=404, detail="Assessment not found")

    answers = dict(assessment.answers or {})
    language = lang if lang in LANGUAGES else assessment.language
    answers["language"] = language if language in LANGUAGES else DEFAULT_LANGUAGE
    result = evaluate(answers)
    pdf_bytes = render_pdf(answers, result)

    filename = f"IA-Day-0_{_slug(assessment.company_name)}_{answers['language']}.pdf"
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
