# MEMORY — IA-Day-0 Assessment Engine V4

## Current state
- **v1 complete and verified** (backend + frontend + admin + PDF + ES/EN/IT).
- Backend: FastAPI on `:8000` (`/api/health` and `/health`), SQLite at
  `backend/data/ia_day0.db` (gitignored, fresh DB with 0 leads + seeded admin).
- Frontend: Next.js 14.2.35 on `:3000`, production build passing.
- Tests: 11 pytest tests pass (engine, PDF in 3 languages, auth).
- E2E verified with Playwright: wizard → report → PDF, language switching, admin
  login/error, lead list/detail, admin PDF download.
- Both dev servers stopped; no QA scripts, screenshots or test DBs left in the repo.

## Key decisions (and why)
- **Deterministic rules engine** (no LLM): reproducible, auditable, works offline; LLM
  enrichment can be added later behind a flag.
- **SQLite + SQLAlchemy**: zero-setup demo; `DATABASE_URL` switches to Postgres.
- **stdlib auth** (PBKDF2 240k + HMAC token): fewer deps than JWT/passlib, same guarantees.
- **ReportLab** for PDF: pure Python, no GTK/WeasyPrint on Windows; charts drawn on canvas.
- **Server-side localization**: reports stored in the assessment language; public GET and
  PDF accept `?lang=es|en|it` to regenerate, so the UI and report never mix languages.
- **Unguessable `public_id`** for shareable results; admin endpoints are bearer-protected.
- **Admin seeded from env** (`ADMIN_USERNAME`/`ADMIN_PASSWORD`), warning if default is used.

## Mistakes to avoid
- Do not use Pydantic `EmailStr` with `.test`/reserved domains in tests — validation rejects
  them; use a normal-looking domain.
- ReportLab `_p()` escapes text: never pass `<b>` through it; use `Paragraph` for markup.
- Do not hardcode English labels in PDF/UI; every string goes through ES/EN/IT catalogs.
- `next build` must stay on a patched 14.2.x (14.2.35); older 14.2.21 has a CVE.
- Next dev/build needs the backend running for API calls; CORS origins must include `:3000`.

## Next steps (if requested)
- Add optional LLM executive-summary enrichment (OpenAI/Anthropic) behind `ENABLE_LLM`.
- Rate limiting on login/assessment, HttpOnly cookie auth, Postgres migration.
- Email notification to Cloud Automate on new lead; optional contact form endpoint.
- Deploy: Vercel (frontend) + Render/Fly (backend) with HTTPS and env secrets.
