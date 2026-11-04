"""Auth unit tests (no database required)."""

from app.auth import create_token, decode_token, hash_password, verify_password


def test_password_hash_roundtrip():
    stored = hash_password("s3cret-pass")
    assert stored != "s3cret-pass"
    assert stored.startswith("pbkdf2_sha256$")
    assert verify_password("s3cret-pass", stored)
    assert not verify_password("wrong-pass", stored)


def test_password_hash_is_salted():
    first = hash_password("same")
    second = hash_password("same")
    assert first != second


def test_token_roundtrip():
    token, ttl = create_token("admin")
    assert ttl > 0
    assert "." in token
    assert decode_token(token) == "admin"


def test_token_rejects_tampering():
    token, _ = create_token("admin")
    assert decode_token(token + "x") is None
    assert decode_token("not-a-token") is None
    assert decode_token("") is None
