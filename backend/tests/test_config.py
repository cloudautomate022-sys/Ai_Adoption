"""Deployment configuration tests (URL/host normalization)."""

import re

from app.config import DEFAULT_CORS_ORIGIN_REGEX, _normalize_origin, _normalize_url


def test_render_host_gets_https_scheme():
    assert (
        _normalize_url("ia-day-0-api.onrender.com")
        == "https://ia-day-0-api.onrender.com"
    )


def test_local_hosts_keep_http():
    assert _normalize_url("localhost:8000") == "http://localhost:8000"
    assert _normalize_url("127.0.0.1:8000") == "http://127.0.0.1:8000"


def test_absolute_urls_are_preserved_and_trailing_slash_removed():
    assert (
        _normalize_url("https://api.example.com/")
        == "https://api.example.com"
    )


def test_origin_normalization_matches_url_rules():
    assert (
        _normalize_origin("my-frontend.vercel.app")
        == "https://my-frontend.vercel.app"
    )
    assert _normalize_origin("http://localhost:3000/") == "http://localhost:3000"


def test_default_cors_regex_allows_common_hosting_domains():
    assert re.match(
        DEFAULT_CORS_ORIGIN_REGEX, "https://ai-adoption-l6on.onrender.com"
    )
    assert re.match(DEFAULT_CORS_ORIGIN_REGEX, "https://my-app.vercel.app")
    assert not re.match(DEFAULT_CORS_ORIGIN_REGEX, "https://evil.example.com")
