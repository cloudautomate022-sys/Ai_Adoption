from __future__ import annotations

import base64
import hashlib
import hmac
import json
import secrets
import time

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import SECRET_KEY, TOKEN_TTL_HOURS
from .database import get_db
from .models import AdminUser

_ITERATIONS = 240_000
_bearer = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, _ITERATIONS)
    return f"pbkdf2_sha256${_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        algorithm, iterations, salt_hex, digest_hex = stored.split("$")
        if algorithm != "pbkdf2_sha256":
            return False
        digest = hashlib.pbkdf2_hmac(
            "sha256", password.encode(), bytes.fromhex(salt_hex), int(iterations)
        )
        return hmac.compare_digest(digest.hex(), digest_hex)
    except (ValueError, TypeError):
        return False


def _b64encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode().rstrip("=")


def _b64decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def create_token(username: str) -> tuple[str, int]:
    ttl_seconds = TOKEN_TTL_HOURS * 3600
    payload = {"sub": username, "exp": int(time.time()) + ttl_seconds}
    body = _b64encode(json.dumps(payload, separators=(",", ":")).encode())
    signature = _b64encode(
        hmac.new(SECRET_KEY.encode(), body.encode(), hashlib.sha256).digest()
    )
    return f"{body}.{signature}", ttl_seconds


def decode_token(token: str) -> str | None:
    try:
        body, signature = token.split(".", 1)
        expected = _b64encode(
            hmac.new(SECRET_KEY.encode(), body.encode(), hashlib.sha256).digest()
        )
        if not hmac.compare_digest(signature, expected):
            return None
        payload = json.loads(_b64decode(body))
        if int(payload.get("exp", 0)) < int(time.time()):
            return None
        return str(payload.get("sub") or "") or None
    except (ValueError, json.JSONDecodeError, TypeError):
        return None


def ensure_admin_user(db: Session, username: str, password: str) -> None:
    existing = db.scalar(select(AdminUser).where(AdminUser.username == username))
    if existing is None:
        db.add(AdminUser(username=username, password_hash=hash_password(password)))
        db.commit()


def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: Session = Depends(get_db),
) -> AdminUser:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None or not credentials.credentials:
        raise unauthorized

    username = decode_token(credentials.credentials)
    if not username:
        raise unauthorized

    user = db.scalar(select(AdminUser).where(AdminUser.username == username))
    if user is None:
        raise unauthorized
    return user
