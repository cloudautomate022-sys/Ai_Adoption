from __future__ import annotations

import csv
import io
import unicodedata
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response, StreamingResponse
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from ..auth import create_token, get_current_admin, verify_password
from ..content import DEFAULT_LANGUAGE, LANGUAGES
from ..database import get_db
from ..engine import evaluate
from ..models import AdminUser, Assessment
from ..pdf_report import render_pdf
from ..schemas import (
    LeadDetail,
    LeadListOut,
    LeadSummary,
    LoginIn,
    StatsOut,
    TokenOut,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])


def _slug(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode()
    cleaned = "".join(ch if ch.isalnum() else "-" for ch in ascii_value)
    return "-".join(part for part in cleaned.split("-") if part)[:50] or "report"


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)) -> TokenOut:
    user = db.scalar(select(AdminUser).where(AdminUser.username == payload.username))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token, expires_in = create_token(user.username)
    return TokenOut(access_token=token, expires_in=expires_in)


@router.get("/me")
def me(admin: AdminUser = Depends(get_current_admin)) -> dict:
    return {"username": admin.username}


@router.get("/stats", response_model=StatsOut)
def stats(
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> StatsOut:
    total = db.scalar(select(func.count(Assessment.id))) or 0
    since = datetime.now(timezone.utc) - timedelta(days=7)
    recent = (
        db.scalar(select(func.count(Assessment.id)).where(Assessment.created_at >= since)) or 0
    )
    avg_score = db.scalar(select(func.avg(Assessment.overall_score))) or 0
    avg_data = db.scalar(select(func.avg(Assessment.data_score))) or 0

    def group(column) -> dict[str, int]:
        rows = db.execute(select(column, func.count(Assessment.id)).group_by(column)).all()
        return {str(key): int(count) for key, count in rows}

    return StatsOut(
        total_leads=int(total),
        leads_7d=int(recent),
        avg_score=round(float(avg_score), 1),
        avg_data_score=round(float(avg_data), 1),
        strategy_counts=group(Assessment.strategy),
        sector_counts=group(Assessment.sector),
        language_counts=group(Assessment.language),
    )


@router.get("/leads", response_model=LeadListOut)
def list_leads(
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
    search: str = Query(default="", max_length=120),
    strategy: str = Query(default=""),
    language: str = Query(default=""),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
) -> LeadListOut:
    query = select(Assessment)
    count_query = select(func.count(Assessment.id))

    filters = []
    if search.strip():
        pattern = f"%{search.strip()}%"
        filters.append(
            or_(
                Assessment.company_name.ilike(pattern),
                Assessment.contact_name.ilike(pattern),
                Assessment.email.ilike(pattern),
            )
        )
    if strategy:
        filters.append(Assessment.strategy == strategy)
    if language:
        filters.append(Assessment.language == language)
    for condition in filters:
        query = query.where(condition)
        count_query = count_query.where(condition)

    total = db.scalar(count_query) or 0
    rows = db.scalars(
        query.order_by(Assessment.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()

    items = [
        LeadSummary(
            id=row.id,
            public_id=row.public_id,
            company_name=row.company_name,
            contact_name=row.contact_name,
            email=row.email,
            phone=row.phone,
            sector=row.sector,
            employees=row.employees,
            language=row.language,
            strategy=row.strategy,
            overall_score=row.overall_score,
            data_score=row.data_score,
            created_at=row.created_at,
        )
        for row in rows
    ]
    return LeadListOut(items=items, total=int(total), page=page, page_size=page_size)


@router.get("/leads/{lead_id}", response_model=LeadDetail)
def get_lead(
    lead_id: int,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> LeadDetail:
    row = db.get(Assessment, lead_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    return LeadDetail(
        id=row.id,
        public_id=row.public_id,
        company_name=row.company_name,
        contact_name=row.contact_name,
        email=row.email,
        phone=row.phone,
        sector=row.sector,
        employees=row.employees,
        language=row.language,
        strategy=row.strategy,
        overall_score=row.overall_score,
        data_score=row.data_score,
        created_at=row.created_at,
        answers=row.answers or {},
        result=row.result or {},
        notes=row.notes or "",
    )


@router.delete("/leads/{lead_id}", status_code=204)
def delete_lead(
    lead_id: int,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Response:
    row = db.get(Assessment, lead_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    db.delete(row)
    db.commit()
    return Response(status_code=204)


@router.get("/leads/{lead_id}/pdf")
def lead_pdf(
    lead_id: int,
    lang: str = Query(default=""),
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Response:
    row = db.get(Assessment, lead_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Lead not found")

    answers = dict(row.answers or {})
    language = lang if lang in LANGUAGES else row.language
    answers["language"] = language if language in LANGUAGES else DEFAULT_LANGUAGE
    result = evaluate(answers)
    pdf_bytes = render_pdf(answers, result)

    filename = f"IA-Day-0_{_slug(row.company_name)}_{answers['language']}.pdf"
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/export.csv")
def export_csv(
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Response:
    rows = db.scalars(select(Assessment).order_by(Assessment.created_at.desc())).all()
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(
        [
            "id",
            "created_at",
            "company",
            "contact",
            "email",
            "phone",
            "sector",
            "employees",
            "language",
            "strategy",
            "overall_score",
            "data_score",
            "budget",
            "confidentiality",
            "notes",
        ]
    )
    for row in rows:
        answers = row.answers or {}
        writer.writerow(
            [
                row.id,
                row.created_at.isoformat() if row.created_at else "",
                row.company_name,
                row.contact_name,
                row.email,
                row.phone,
                row.sector,
                row.employees,
                row.language,
                row.strategy,
                row.overall_score,
                row.data_score,
                answers.get("budget", ""),
                answers.get("confidentiality", ""),
                row.notes,
            ]
        )

    return StreamingResponse(
        io.BytesIO(buffer.getvalue().encode("utf-8-sig")),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="ia-day-0-leads.csv"'},
    )
