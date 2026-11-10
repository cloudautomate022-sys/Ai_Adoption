# MEMORY — IA-Day-0 Assessment Engine V4

## Current state
- **v1 complete and verified** (backend + frontend + admin + PDF + ES/EN/IT).
- Git repo (`main`) pushed to
  <https://github.com/cloudautomate022-sys/Ai_Adoption>.
- **Deployment-ready**: `render.yaml` (API + web + Postgres), runtime backend URL
  resolution, `/api/config`, `HOST`/`PORT` support. 16 pytest tests pass and
  `npm run build` passes (all routes dynamic).
- **Dual theme**: dark default, light toggle persisted in
  `localStorage["ia_day0_theme"]`; pre-paint script in `app/layout.tsx`.
- Backend: FastAPI on `:8000` (`/api/health`, `/health`, `/api/config`), SQLite at
  `backend/data/ia_day0.db` (gitignored).
- Frontend: Next.js 14.2.35 on `:3000`, production build passing.
- E2E verified: wizard → report → PDF, language switching, admin login/list/detail/PDF,
  both themes on all pages, and runtime `API_URL` injection (`RUNTIME_CONFIG_OK`).

## Deployment / backend URL (do not break)
- Frontend resolves API at runtime: `app/layout.tsx` reads **`API_URL`** and injects
  `window.__IA_DAY0_CONFIG__.apiUrl`; `lib/api.ts::getApiUrl()` also accepts
  `NEXT_PUBLIC_API_URL` (build-time) and falls back to `http://localhost:8000`.
- **Graphical backend switch**: header "API" button opens `components/BackendSettings.tsx`;
  saves `localStorage["ia_day0_api_url"]` (no secrets) and reloads. Priority:
  localStorage > runtime injection > build env > localhost. Read-only visitors can point
  to any backend without touching Render env vars. A warning bar appears when a deployed
  page still points to localhost.
- `layout.tsx` exports `dynamic = "force-dynamic"` — without it Next bakes `API_URL`
  at build time and changing it on Render has no effect.
- Backend strips trailing slashes and adds `https://` to scheme-less hosts
  (`localhost`/`127.0.0.1` keep `http://`). Same for `CORS_ORIGINS`.
- CORS default regex allows `*.onrender.com`, `*.vercel.app`, `*.netlify.app`;
  `allow_credentials=False` (admin uses bearer tokens, not cookies).
- `PUBLIC_API_URL` falls back to Render's `RENDER_EXTERNAL_URL`.
- `render.yaml` uses `rootDir: backend` + `pip install -r requirements.txt`, so
  Render does **not** use the root `pyproject.toml`/Poetry lock.
- `psycopg2-binary` added for Render Postgres; SQLite remains the local default.

## Theme architecture (do not bypass)
- **Semantic CSS variables only**, defined in `app/globals.css` for `:root` (dark) and
  `html.light`; mapped in `tailwind.config.ts`.
- **Never** use `text-white`, `text-slate-*`, `border-white/*`, `bg-white/*` again.
- `ink` stays fixed dark (text on gradient buttons).
- `RadarChart` picks SVG colours from `useTheme()`; CSS vars do not reach SVG attrs.

## Key decisions (and why)
- Deterministic rules engine (no LLM): reproducible, auditable, offline, no per-run cost.
- SQLite + SQLAlchemy for demo; `DATABASE_URL` switches to Postgres.
- stdlib auth (PBKDF2 + HMAC token): fewer deps, same guarantees.
- ReportLab PDF: pure Python, no GTK/WeasyPrint; charts drawn on canvas.
- Server-side localization; stored report language + `?lang=es|en|it` regeneration.
- Unguessable `public_id` for shareable results; admin routes are bearer-protected.
- Theme via CSS variables, not `dark:` variants, so components are single-source.

## Mistakes to avoid
- Do not remove `force-dynamic` from the root layout while deploying.
- Do not recommend custom development to low-maturity/low-budget companies.
- Do not expose consumer AI tools to regulated data (engine enforces this).
- ReportLab `_p()` escapes text: never pass `<b>` through it; use `Paragraph`.
- Do not hardcode English labels; every string goes through ES/EN/IT catalogs.
- `next build` must stay on patched 14.2.35; stop `next dev` before building.
- Do not commit `.env`, `backend/data/`, tokens or real personal data.
