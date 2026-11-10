# AGENTS.md — Permanent project rules

These rules outlive `MEMORY.md`. Read both at the start of any task.

## Product invariants (do not change)

1. **Footer contact data must stay exact**:
   - `https://cloudautomate022-sys.github.io/Cloudautomate/`
   - `Call: +39 352 044 3750`
   - `Email: cloudautomate022@gmail.com`
2. **The title must include the exact text** `By Cloud Automate` (header, metadata, PDF, footer).
3. **Trilingual parity**: every user-facing string must exist in **ES, EN and IT** — in
   `frontend/lib/i18n.tsx` for UI and `backend/app/content.py` for report/PDF text.
   Adding a key to one language without the other two is a bug.
4. **IA-Day-0 constraints** enforced by `backend/app/engine.py`:
   - 80% rule: commercial tools before custom development for low maturity/budget.
   - Privacy first: confidential/regulated data ⇒ enterprise/private models only
     (Azure OpenAI, Bedrock, local open source). Never consumer tools.
   - Internal-first pilots only; no customer-facing exposure in early stages.
   - Always end with a soft commercial CTA (45-min session / direct contact channels).
5. **Admin area is private**: every `/api/admin/*` route except `/login` requires a bearer
   token. Never expose contact data or assessment answers publicly.

## Engineering conventions

- Backend: Python 3.11+, FastAPI, SQLAlchemy 2, Pydantic v2. Type hints everywhere.
- Frontend: Next.js 14 App Router, TypeScript strict, Tailwind. No extra UI libraries.
- Keep the engine deterministic; any LLM enrichment must be optional and behind a flag.
- Never commit `.env`, `backend/data/`, tokens, database files or real personal data.
- Store only what the assessment needs. Do not log PII.
- Backend URL must stay runtime-configurable (`API_URL` injected by `app/layout.tsx`); never
  hardcode `localhost:8000` in components. Keep `render.yaml` and `.env.example` in sync.
- PDF must be generated with ReportLab only (no GTK/WeasyPrint system dependencies).
- Run `python -m pytest -q` in `backend/` and `npm run build` in `frontend/` before finishing.

## Commands

```powershell
# Backend
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
.\.venv\Scripts\python.exe -m pytest -q

# Frontend
cd frontend
npm run dev        # development
npm run build      # production build
npm start          # serve production build
```

## Memory

- Read `MEMORY.md` first; update it at the end of every task.
- Keep it under ~50 lines: current state, decisions + why, mistakes to avoid.
- Promote anything permanent into this file instead of leaving it in memory.
