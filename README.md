# IA-Day-0 Assessment Engine V4

**By Cloud Automate**

Sistema experto de evaluación de adopción de IA: convierte los datos operativos de una
empresa en un roadmap de 90 días, un stack tecnológico recomendado, un piloto interno de
bajo riesgo y un plan de gestión del cambio. Disponible en **español, inglés e italiano**.

> Filosofía: *la IA no reemplaza al talento humano; lo empodera*.
> Empezar pequeño, medir y escalar. Sin sobredesarrollo.

---

## Qué incluye

- **Wizard interactivo de 5 pasos** (empresa, infraestructura, dolores, contexto, revisión).
- **Motor de decisión determinista** basado en la matriz IA-Day-0: People, Systems, Hybrid o
  Foundation, con puntuaciones por dimensión y alerta de salud de datos.
- **Informe trilingüe** generado en servidor y almacenado con la evaluación.
- **Tema oscuro y tema claro** conmutables desde la cabecera (por defecto oscuro), con la
  preferencia guardada en el navegador.
- **PDF con gráficos** (barras por dimensión, fit People/Systems, roadmap y piloto).
- **Panel de administración** con login, leads guardados, datos de contacto, respuestas,
  resultados, descarga de PDF por lead, exportación CSV y borrado.
- **API REST** documentada automáticamente en `/docs`.

## Stack

| Capa | Tecnología |
| --- | --- |
| Backend | Python 3.11+ · FastAPI · SQLAlchemy 2 · SQLite (Postgres-ready) · ReportLab |
| Frontend | Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS |
| Auth admin | PBKDF2-SHA256 + token HMAC firmado (sin dependencias pesadas) |

## Estructura

```
AIA4/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI, CORS, seed del admin
│   │   ├── config.py        # variables de entorno y contacto
│   │   ├── database.py      # engine + sesión SQLAlchemy
│   │   ├── models.py        # AdminUser, Assessment
│   │   ├── schemas.py       # validación Pydantic
│   │   ├── auth.py          # hash de contraseña + token firmado
│   │   ├── engine.py        # motor de decisión IA-Day-0
│   │   ├── content.py       # textos ES/EN/IT del informe
│   │   ├── pdf_report.py    # generación del PDF con gráficos
│   │   └── routers/         # endpoints públicos y de admin
│   ├── tests/               # pytest (motor, PDF, auth)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/                 # /, /results/[id], /admin, /admin/leads/[id]
│   ├── components/          # wizard, informe, radar, admin
│   ├── lib/                 # API client, i18n, tipos
│   └── .env.local.example
├── render.yaml              # Blueprint Render (backend + frontend + Postgres)
├── AGENTS.md
└── MEMORY.md
```

## Puesta en marcha

Requisitos: **Python 3.11+** y **Node 20+**.

### 1. Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

En macOS/Linux: `source .venv/bin/activate` y `cp .env.example .env`.

- API: <http://localhost:8000>
- Swagger: <http://localhost:8000/docs>
- Health: <http://localhost:8000/api/health>

### 2. Frontend

```powershell
cd frontend
npm install
Copy-Item .env.local.example .env.local
npm run dev
```

Abrir <http://localhost:3000>.

### 3. Acceso al panel admin

- URL: <http://localhost:3000/admin>
- Usuario por defecto: `admin`
- Contraseña por defecto: `CloudAutomate2026!`

> **Cambia `ADMIN_PASSWORD` y `SECRET_KEY` en `backend/.env` antes de desplegar.**
> El backend avisa por consola si sigue usando la contraseña por defecto.

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Por defecto | Descripción |
| --- | --- | --- |
| `ENVIRONMENT` | `development` | Etiqueta del entorno (`production` en Render). |
| `HOST` / `PORT` | `0.0.0.0` / `8000` | Bind de `python -m app`; Render inyecta `PORT`. |
| `PUBLIC_API_URL` | `http://localhost:8000` | URL pública del backend. Si no se define, usa `RENDER_EXTERNAL_URL`. |
| `ROOT_PATH` | vacío | Prefijo opcional si el backend vive tras un proxy (ej. `/ia-day-0`). |
| `SECRET_KEY` | valor de desarrollo | Firma de tokens admin. Obligatorio en producción. |
| `ADMIN_USERNAME` | `admin` | Usuario administrador inicial. |
| `ADMIN_PASSWORD` | `CloudAutomate2026!` | Contraseña inicial. |
| `TOKEN_TTL_HOURS` | `12` | Duración del token admin. |
| `DATABASE_URL` | `sqlite:///./data/ia_day0.db` | Cambiar a Postgres en producción. |
| `CORS_ORIGINS` | `http://localhost:3000,...` | Orígenes permitidos, separados por coma. Sin esquema se asume HTTPS. |
| `FRONTEND_URL` | `http://localhost:3000` | URL pública del frontend; se añade a CORS automáticamente. |
| `CORS_ORIGIN_REGEX` | vacío | Regex opcional para previews de Vercel/Render. |

### Frontend (`frontend/.env.local`)

| Variable | Por defecto | Descripción |
| --- | --- | --- |
| `API_URL` | `http://localhost:8000` | **Recomendada.** El servidor Next.js la lee en runtime; cambiarla y reiniciar basta, sin rebuild. |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Fallback de build para hosting estático; queda embebida en el bundle. |

## API principal

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| `POST` | `/api/assessments` | — | Crea evaluación, devuelve `public_id` + informe. |
| `GET` | `/api/assessments/{public_id}?lang=es` | — | Informe público (regenerable en ES/EN/IT). |
| `GET` | `/api/assessments/{public_id}/pdf?lang=it` | — | PDF del informe. |
| `GET` | `/api/config` | — | Descubrimiento público: URL activa del backend, CORS e idiomas. |
| `POST` | `/api/admin/login` | — | Devuelve bearer token. |
| `GET` | `/api/admin/stats` | Bearer | Métricas del panel. |
| `GET` | `/api/admin/leads` | Bearer | Lista paginada con búsqueda y filtros. |
| `GET` | `/api/admin/leads/{id}` | Bearer | Detalle + respuestas + resultado. |
| `GET` | `/api/admin/leads/{id}/pdf` | Bearer | PDF del lead. |
| `GET` | `/api/admin/export.csv` | Bearer | Exportación CSV. |
| `DELETE` | `/api/admin/leads/{id}` | Bearer | Borra evaluación y contacto. |

## Motor de decisión

Puntuaciones 0–100: madurez de datos, infraestructura digital, preparación en IA, apertura
al cambio, dolor operativo, capacidad de inversión y exigencia de privacidad. El índice
global pondera datos, infraestructura, preparación y cambio.

- **People**: productividad individual y formación masiva (equipos, poca infraestructura).
- **Systems**: APIs, automatización e integración con CRM/ERP (mayor madurez y presupuesto).
- **Hybrid**: People primero, Systems después.
- **Foundation**: si la madurez de datos es crítica, se prioriza ordenar los datos antes de
  comprar herramientas (*Bad data in, bad data out*).

Reglas permanentes aplicadas por el motor:

1. **80% rule**: herramientas comerciales antes que desarrollo a medida.
2. **Privacidad primero**: datos confidenciales/regulados ⇒ Azure OpenAI, Bedrock o modelos
   locales; nunca herramientas de consumo.
3. **Enfoque interno**: el primer piloto siempre es de productividad interna y con revisión
   humana; nunca cara al cliente final.
4. **Conversión comercial**: el informe cierra con una sesión de 45 minutos y los canales
   directos de Cloud Automate.

## PDF

El informe PDF se genera con ReportLab (sin dependencias del sistema como GTK) e incluye:
portada con datos de contacto, perfil, resumen ejecutivo, barras por dimensión, radar de
fit People/Systems, salud de datos, stack, piloto, plan de cambio, roadmap, victorias
rápidas, riesgos y CTA. El idioma del PDF puede cambiarse con `?lang=es|en|it`.

## Tests

```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest -q
```

Cubren el motor (estrategias, privacidad, idiomas), la generación de PDF en los tres
idiomas y el hashing/tokens de autenticación.

## Despliegue: backend en otra ubicación (Render, Fly, VPS…)

El frontend **no tiene la URL del backend hardcodeada**. La resolución ocurre en dos
niveles:

1. `app/layout.tsx` lee `API_URL` en el servidor de Next.js y la inyecta como
   `window.__IA_DAY0_CONFIG__.apiUrl` en cada página.
2. `lib/api.ts` usa ese valor en runtime; si no existe, cae a `NEXT_PUBLIC_API_URL` y,
   por último, a `http://localhost:8000`.

Esto permite mover el backend a `https://ia-day-0-api.onrender.com` (o cualquier otro
dominio) cambiando solo variables de entorno y reiniciando el servicio, **sin rebuild**.

### Configurar la URL desde la interfaz (sin variables de entorno)

La web incluye un panel gráfico de conexión:

1. Abre la aplicación y pulsa el botón **API** de la cabecera (icono de servidor).
2. Escribe la URL del backend, por ejemplo
   `https://ai-adoption-l6on.onrender.com`.
3. Pulsa **Probar conexión** para validar `/api/health`.
4. Pulsa **Guardar y recargar**.

La URL se guarda en `localStorage` del navegador (`ia_day0_api_url`) y tiene prioridad
sobre `API_URL`/`NEXT_PUBLIC_API_URL`. No se guardan claves ni secretos. Para volver a la
configuración del despliegue, usa **Restaurar automática**.

> Es una preferencia por navegador: cada visitante puede apuntar a un backend distinto.
> Para cambiar la URL de todos los usuarios, define `API_URL` en el hosting del frontend.

**CORS:** el backend permite por defecto los dominios de Render, Vercel y Netlify
(`*.onrender.com`, `*.vercel.app`, `*.netlify.app`) además de `localhost`. Si usas un
dominio propio, añade `CORS_ORIGINS=https://tu-dominio.com` o define
`CORS_ORIGIN_REGEX` en el backend.

### Opción A — Blueprint completo en Render

El repositorio incluye [`render.yaml`](./render.yaml) con:

- Backend FastAPI (`ia-day-0-api`) + Postgres gestionado.
- Frontend Next.js (`ia-day-0-web`) con `API_URL` enlazada automáticamente al backend.
- `CORS_ORIGINS` y `FRONTEND_URL` enlazadas al frontend.

Pasos: **Render → New → Blueprint → seleccionar el repositorio**. Render pedirá
`ADMIN_PASSWORD`; `SECRET_KEY` se genera solo. Tras el primer deploy, comprueba:

```text
https://<backend>.onrender.com/api/health
https://<backend>.onrender.com/api/config
```

### Opción B — Backend en Render y frontend en otro proveedor

En Render crea un **Web Service** con:

- Root Directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health check: `/api/health`
- Variables: `SECRET_KEY`, `ADMIN_PASSWORD`, `DATABASE_URL`, `ENVIRONMENT=production`,
  `FRONTEND_URL=https://tu-frontend.com` y `CORS_ORIGINS=https://tu-frontend.com`.

En el proveedor del frontend configura:

```bash
API_URL=https://ia-day-0-api.onrender.com
# Opcional si el host solo permite variables de build:
NEXT_PUBLIC_API_URL=https://ia-day-0-api.onrender.com
```

Notas:

- Sin barra final en las URLs.
- Si el proveedor entrega solo el host (`miapi.onrender.com`), el backend y el frontend
  añaden `https://` automáticamente (localhost se queda en `http://`).
- Para dominios personalizados actualiza `API_URL`, `FRONTEND_URL` y `CORS_ORIGINS`.
- Con el plan gratuito de Render el disco es efímero: usa el Postgres del blueprint para
  no perder leads. SQLite sigue siendo válido en local o con un disco persistente.
- También puedes arrancar el backend con `python -m app`: respeta `HOST` y `PORT`.

## Checklist de producción

- [ ] `SECRET_KEY` largo y aleatorio; `ADMIN_PASSWORD` propio.
- [ ] `DATABASE_URL` apuntando a Postgres y backups programados.
- [ ] `CORS_ORIGINS` y `FRONTEND_URL` con el dominio real (HTTPS).
- [ ] `API_URL` del frontend apuntando al backend desplegado (sin barra final).
- [ ] Reverse proxy (Nginx/Caddy) para API y frontend.
- [ ] Rate limiting en login y en `POST /api/assessments`.
- [ ] Política de retención/borrado de datos personales (GDPR).
- [ ] No subir `.env`, `data/` ni `node_modules/` al repositorio.

## Limitaciones conocidas

- El motor es determinista y basado en reglas: no llama a un LLM. Se puede añadir
  enriquecimiento opcional con OpenAI/Anthropic sin cambiar el contrato del informe.
- SQLite es suficiente para una demo o un piloto; usar Postgres para concurrencia real.
- El token admin se guarda en `localStorage`; para máxima seguridad, migrar a cookies
  `HttpOnly` + CSRF.
- El CTA usa `mailto:`/teléfono/web; no hay envío de emails desde el servidor.

---

**Contacto**

- Web: <https://cloudautomate022-sys.github.io/Cloudautomate/>
- Call: **+39 352 044 3750**
- Email: **cloudautomate022@gmail.com**

© Cloud Automate · IA-Day-0 Assessment Engine · By Cloud Automate
