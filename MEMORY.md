# MEMORY — IA-Day-0 Assessment Engine V4

## Current state
- **v1 complete and verified** (backend + frontend + admin + PDF + ES/EN/IT).
- Git repo (`main`) pushed to
  <https://github.com/cloudautomate022-sys/Ai_Adoption>.
- **Dual theme**: dark is the default; a header toggle switches to a white/light
  theme. Choice persists in `localStorage["ia_day0_theme"]` and is applied by an
  inline pre-paint script in `app/layout.tsx` (no flash).
- Backend: FastAPI on `:8000` (`/api/health` and `/health`), SQLite at
  `backend/data/ia_day0.db` (gitignored, fresh DB with 0 leads + seeded admin).
- Frontend: Next.js 14.2.35 on `:3000`, production build passing.
- Tests: 11 pytest tests pass (engine, PDF in 3 languages, auth).
- E2E verified with Playwright: wizard → report → PDF, language switching, admin
  login/error, lead list/detail, admin PDF download, plus both themes on home,
  wizard, results and admin (toggle + persistence + radar colors).
- Local dev servers were started on demand; stop them when idle.

## Theme architecture (do not bypass)
- **Semantic CSS variables only**: `--canvas/surface/fg/muted/faint/line/accent/
  accent2/violet/success/warning/danger` (+ `--card-bg`, `--input-bg`,
  `--recessed`, `--track`, `--grid-line`, `--glow-*`) defined in `app/globals.css`
  for `:root` (dark) and `html.light`.
- Tailwind maps them in `tailwind.config.ts` as `bg-canvas`, `text-fg`,
  `border-line/10`, `text-muted`, etc. **Never** use `text-white`, `text-slate-*`,
  `border-white/*`, `bg-white/*` again — they break the light theme.
- `ink` stays fixed dark: it is the text colour on cyan→indigo gradient buttons.
- `lib/theme.tsx` = provider + `useTheme()`; `RadarChart` picks its SVG palette
  from `useTheme()` (SVG attributes cannot read CSS vars through Tailwind).

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
- **Theme via CSS variables, not `dark:` variants**: one token set per theme keeps every
  component single-source and avoids duplicating hundreds of utility classes.
- `<html suppressHydrationWarning>` is required because the pre-paint theme script adds
  `class`/`style` to `<html>` before React hydrates.

## Mistakes to avoid
- Do not use Pydantic `EmailStr` with `.test`/reserved domains in tests — validation rejects
  them; use a normal-looking domain.
- ReportLab `_p()` escapes text: never pass `<b>` through it; use `Paragraph` for markup.
- Do not hardcode English labels in PDF/UI; every string goes through ES/EN/IT catalogs.
- Do not reintroduce `text-white`/`text-slate-*`/`border-white/*`/`bg-white/*`; use the
  semantic tokens or the light theme silently degrades.
- `next build` must stay on a patched 14.2.x (14.2.35); older 14.2.21 has a CVE.
- Running `next build` while `next dev` is up corrupts `.next`; stop dev, build, restart.
- Next dev/build needs the backend running for API calls; CORS origins must include `:3000`.

## Next steps (if requested)
- Add optional LLM executive-summary enrichment (OpenAI/Anthropic) behind `ENABLE_LLM`.
- Rate limiting on login/assessment, HttpOnly cookie auth, Postgres migration.
- Email notification to Cloud Automate on new lead; optional contact form endpoint.
- Deploy: Vercel (frontend) + Render/Fly (backend) with HTTPS and env secrets.
