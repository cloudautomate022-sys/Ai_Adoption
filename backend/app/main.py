from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .auth import ensure_admin_user
from .config import ADMIN_PASSWORD, ADMIN_USERNAME, CORS_ORIGINS
from .database import Base, SessionLocal, engine
from .routers import admin, public


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        ensure_admin_user(db, ADMIN_USERNAME, ADMIN_PASSWORD)
    if ADMIN_PASSWORD == "CloudAutomate2026!":
        print(
            "[WARN] Using the default admin password. Set ADMIN_PASSWORD in backend/.env "
            "before deploying."
        )
    yield


app = FastAPI(
    title="IA-Day-0 Assessment Engine",
    description=(
        "Decoupled assessment API: intake, IA-Day-0 decision engine, localized "
        "reports (ES/EN/IT), PDF generation and an authenticated admin panel."
    ),
    version="4.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public.router)
app.include_router(admin.router)


@app.get("/api/health", tags=["system"])
@app.get("/health", include_in_schema=False)
def health() -> dict:
    return {"status": "ok", "service": "ia-day-0-assessment-engine", "version": "4.0.0"}


@app.get("/", include_in_schema=False)
def root() -> dict:
    return {
        "service": "IA-Day-0 Assessment Engine",
        "docs": "/docs",
        "health": "/api/health",
    }
