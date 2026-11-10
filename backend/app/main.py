from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from .auth import ensure_admin_user
from .config import (
    ADMIN_PASSWORD,
    ADMIN_USERNAME,
    APP_VERSION,
    CONTACT,
    CORS_ORIGIN_REGEX,
    CORS_ORIGINS,
    ENVIRONMENT,
    FRONTEND_URL,
    PUBLIC_API_URL,
    ROOT_PATH,
)
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
    version=APP_VERSION,
    root_path=ROOT_PATH or "",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=CORS_ORIGIN_REGEX,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public.router)
app.include_router(admin.router)


@app.get("/api/health", tags=["system"])
@app.get("/health", include_in_schema=False)
def health() -> dict:
    return {
        "status": "ok",
        "service": "ia-day-0-assessment-engine",
        "version": APP_VERSION,
        "environment": ENVIRONMENT,
    }


@app.get("/api/config", tags=["system"])
def runtime_config(request: Request) -> dict:
    """Public discovery endpoint for deployed frontends.

    A frontend hosted on Render/Vercel (or any other domain) can call this
    endpoint to confirm which backend URL and CORS origins are active.  It
    never exposes secrets or assessment data.
    """
    return {
        "service": "ia-day-0-assessment-engine",
        "version": APP_VERSION,
        "environment": ENVIRONMENT,
        "api_base_url": PUBLIC_API_URL,
        "frontend_url": FRONTEND_URL,
        "cors_origins": CORS_ORIGINS,
        "languages": ["es", "en", "it"],
        "contact": CONTACT,
        "request_origin": request.headers.get("origin"),
    }


@app.get("/", include_in_schema=False)
def root() -> dict:
    return {
        "service": "IA-Day-0 Assessment Engine",
        "version": APP_VERSION,
        "docs": "/docs",
        "health": "/api/health",
        "config": "/api/config",
    }
