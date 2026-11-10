from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

APP_VERSION = "4.0.0"
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").strip().lower()

DATA_DIR = Path(os.getenv("DATA_DIR", BASE_DIR / "data"))
DATA_DIR.mkdir(parents=True, exist_ok=True)


def _normalize_url(value: str, default_scheme: str = "https") -> str:
    """Return a clean absolute URL.

    Deployments such as Render often expose only a host (for example
    ``ia-day-0-api.onrender.com``).  We add ``https://`` automatically while
    keeping ``http://`` for local development hosts.
    """
    clean = value.strip().rstrip("/")
    if not clean:
        return ""
    if "://" in clean:
        return clean

    host = clean.split("/", 1)[0].split(":", 1)[0].strip("[]").lower()
    scheme = "http" if host in {"localhost", "127.0.0.1", "0.0.0.0", "::1"} else default_scheme
    return f"{scheme}://{clean}"


def _normalize_origin(value: str) -> str:
    return _normalize_url(value, default_scheme="https")


def _split_csv(raw: str) -> list[str]:
    return [item.strip() for item in raw.split(",") if item.strip()]


# Port/host used by ``python -m app`` and by local scripts. Render injects PORT.
HOST = os.getenv("HOST", "0.0.0.0").strip() or "0.0.0.0"
PORT = int(os.getenv("PORT", "8000"))

# Public URL where this backend can be reached. Render exposes
# RENDER_EXTERNAL_URL automatically; locally we fall back to localhost.
PUBLIC_API_URL = _normalize_url(
    os.getenv("PUBLIC_API_URL") or os.getenv("RENDER_EXTERNAL_URL") or f"http://localhost:{PORT}"
)

# Optional reverse-proxy prefix (for example "/ia-day-0"). Empty by default.
ROOT_PATH = os.getenv("ROOT_PATH", "").strip()
if ROOT_PATH:
    ROOT_PATH = "/" + ROOT_PATH.strip("/")

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DATA_DIR / 'ia_day0.db'}")
# Render/Heroku hand out ``postgres://``; SQLAlchemy expects ``postgresql://``.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = "postgresql://" + DATABASE_URL[len("postgres://") :]

# Auth. In production ALWAYS set SECRET_KEY and ADMIN_PASSWORD.
SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-change-me-in-production")
TOKEN_TTL_HOURS = int(os.getenv("TOKEN_TTL_HOURS", "12"))
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "CloudAutomate2026!")

# Public frontend URL. Setting just this is enough for CORS.
FRONTEND_URL = _normalize_url(os.getenv("FRONTEND_URL", "http://localhost:3000"))

# Comma-separated list of allowed origins. Entries without a scheme are treated
# as HTTPS production hosts, except localhost/127.0.0.1 which stay on HTTP.
CORS_ORIGINS = list(
    dict.fromkeys(
        _normalize_origin(origin)
        for origin in _split_csv(
            os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
        )
    )
)
if FRONTEND_URL and FRONTEND_URL not in CORS_ORIGINS:
    CORS_ORIGINS.append(FRONTEND_URL)

# Default regex so typical Render / Vercel / Netlify preview domains work
# without extra configuration. Custom domains should be added explicitly.
DEFAULT_CORS_ORIGIN_REGEX = (
    r"https://([a-z0-9-]+\.)*(onrender\.com|vercel\.app|netlify\.app)$"
)
CORS_ORIGIN_REGEX = (
    os.getenv("CORS_ORIGIN_REGEX", "").strip() or DEFAULT_CORS_ORIGIN_REGEX
)

CONTACT = {
    "website": "https://cloudautomate022-sys.github.io/Cloudautomate/",
    "phone": "+39 352 044 3750",
    "email": "cloudautomate022@gmail.com",
    "brand": "Cloud Automate",
}
