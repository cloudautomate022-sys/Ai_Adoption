"""Trilingual report content for the IA-Day-0 assessment engine.

All user-facing report strings live here so the API can return a fully
localized result and the PDF can be regenerated in any language.
"""

from __future__ import annotations

LANGUAGES = ("es", "en", "it")
DEFAULT_LANGUAGE = "es"

ES: dict[str, str] = {
    # App / PDF chrome
    "app.title": "IA-Day-0 Assessment Engine",
    "app.brand": "By Cloud Automate",
    "pdf.title": "Informe de Evaluación de Adopción de IA",
    "pdf.subtitle": "Metodología IA-Day-0 · By Cloud Automate",
    "pdf.prepared_for": "Preparado para",
    "pdf.date": "Fecha",
    "pdf.contact": "Contacto",
    "pdf.website": "Sitio web",
    "pdf.phone": "Teléfono",
    "pdf.email": "Email",
    "pdf.confidential": "Documento confidencial",
    "pdf.page": "Página",
    "pdf.disclaimer": (
        "Este informe se genera a partir de la información declarada por la empresa. "
        "No sustituye una auditoría técnica ni asesoramiento legal."
    ),
    "pdf.footer_note": "Elaborado con la metodología IA-Day-0 · By Cloud Automate",
    # Sections
    "section.summary": "Resumen ejecutivo",
    "section.scores": "Diagnóstico por dimensiones",
    "section.data_health": "Salud de los datos",
    "section.strategy": "Estrategia recomendada",
    "section.tech": "Stack tecnológico recomendado",
    "section.pilot": "Diseño del piloto",
    "section.change": "Plan de gestión del cambio",
    "section.roadmap": "Roadmap de 90 días",
    "section.next_steps": "Siguiente paso",
    "section.profile": "Perfil de la empresa",
    "section.quick_wins": "Victorias rápidas",
    "section.risks": "Riesgos a vigilar",
    # Scores
    "score.data_maturity": "Madurez de datos",
    "score.digital_infrastructure": "Infraestructura digital",
    "score.ai_readiness": "Preparación en IA",
    "score.change_readiness": "Apertura al cambio",
    "score.pain_intensity": "Intensidad del dolor operativo",
    "score.budget_capacity": "Capacidad de inversión",
    "score.compliance_risk": "Exigencia de privacidad",
    "score.overall": "Índice IA-Day-0",
    # Strategy
    "strategy.people.label": "People · Workforce y Co-worker",
    "strategy.people.desc": (
        "Empodera a cada persona con un co-worker de IA de confianza: formación, "
        "gobernanza y victorias rápidas de productividad individual antes de tocar "
        "los sistemas críticos."
    ),
    "strategy.systems.label": "Systems · Integración de procesos",
    "strategy.systems.desc": (
        "Conecta CRM, ERP y fuentes de datos mediante APIs y automatización para "
        "eliminar trabajo repetitivo de punta a punta."
    ),
    "strategy.hybrid.label": "Híbrida · People primero, Systems después",
    "strategy.hybrid.desc": (
        "Empieza con un piloto interno de productividad para generar confianza y "
        "después integra el caso de uso ganador en tus sistemas."
    ),
    "strategy.foundation.label": "Foundation · Datos primero",
    "strategy.foundation.desc": (
        "Antes de escalar IA, ordena lo básico: centraliza fuentes, define "
        "responsables y mide calidad. Bad data in, bad data out."
    ),
    # Data health
    "data.red.title": "Salud de datos: crítica",
    "data.red.msg": (
        "Tus datos viven en silos y/o no son confiables. Cualquier piloto de IA "
        "heredará esas brechas. Dedica las primeras 2–4 semanas a centralizar el "
        "conjunto mínimo de datos y definir un responsable antes de comprar herramientas."
    ),
    "data.amber.title": "Salud de datos: en mejora",
    "data.amber.msg": (
        "Tienes una base usable, pero la calidad y la propiedad de los datos son "
        "inconsistentes. Ejecuta un piloto pequeño sobre un conjunto de datos limpio "
        "y acotado, y corrige los problemas sobre la marcha."
    ),
    "data.green.title": "Salud de datos: sólida",
    "data.green.msg": (
        "Tus datos están centralizados y son razonablemente confiables. Puedes ir más "
        "rápido: prioriza integraciones y casos de uso medibles."
    ),
    # Labels
    "employees.label": "Empleados",
    "profile.sector": "Sector",
    "profile.budget": "Presupuesto",
    "profile.privacy": "Privacidad",
    "profile.maturity": "Madurez en IA",
    "profile.urgency": "Urgencia",
    "score.grade": "Grado",
    "fit.people": "Encaje People",
    "fit.systems": "Encaje Systems",
    "sector.manufacturing": "Manufactura",
    "sector.retail": "Retail",
    "sector.professional_services": "Servicios profesionales",
    "sector.healthcare": "Salud",
    "sector.finance": "Finanzas",
    "sector.education": "Educación",
    "sector.logistics": "Logística",
    "sector.hospitality": "Hotelería y turismo",
    "sector.technology": "Tecnología",
    "sector.other": "Otro",
    "budget.under_5k": "Menos de 5.000 €",
    "budget.5k_25k": "5.000–25.000 €",
    "budget.25k_100k": "25.000–100.000 €",
    "budget.over_100k": "Más de 100.000 €",
    "budget.unknown": "Por definir",
    "confidentiality.public": "Datos públicos",
    "confidentiality.internal": "Uso interno",
    "confidentiality.confidential": "Confidencial",
    "confidentiality.regulated": "Regulado (GDPR, salud, finanzas)",
    "maturity.none": "Sin uso de IA",
    "maturity.exploring": "Explorando",
    "maturity.piloting": "Pilotos aislados",
    "maturity.scaling": "Escalando",
    "urgency.low": "Baja",
    "urgency.medium": "Media",
    "urgency.high": "Alta",
    # Executive summary
    "summary.template": (
        "{company} ({sector}, {employees} empleados) obtiene un Índice IA-Day-0 de "
        "{score}/100. La estrategia recomendada es {strategy}. {strategy_desc} "
        "El primer piloto debe ser interno y centrarse en: {pilot}."
    ),
    # Pilots
    "pilot.metric": "Horas ahorradas por persona y semana",
    "pilot.baseline": "Línea base estimada: 3 h/semana",
    "pilot.target": "Objetivo: −40% en 4 semanas",
    "pilot.duration": "Duración: 4 semanas",
    "pilot.risk": "Riesgo: bajo",
    "pilot.internal_note": (
        "Alcance interno únicamente: sin exposición directa al cliente final en esta fase."
    ),
    "pilot.repetitive_admin.title": "Co-worker de IA para administración rutinaria",
    "pilot.repetitive_admin.desc": (
        "Redacta correos, resúmenes y documentos internos desde una biblioteca de "
        "plantillas aprobadas, con revisión humana antes de enviar."
    ),
    "pilot.knowledge_search.title": "Asistente de conocimiento interno (RAG)",
    "pilot.knowledge_search.desc": (
        "Conecta políticas, manuales y procedimientos a un asistente privado que "
        "responde citando tus propios documentos."
    ),
    "pilot.email_writing.title": "Asistente de redacción de propuestas y correos",
    "pilot.email_writing.desc": (
        "Genera primeros borradores con tu tono de voz; el equipo edita y aprueba. "
        "Bajo riesgo y ahorro de tiempo inmediato."
    ),
    "pilot.meeting_notes.title": "Asistente de notas y tareas de reunión",
    "pilot.meeting_notes.desc": (
        "Transcribe reuniones internas y produce resúmenes con responsables y plazos. "
        "No requiere datos de clientes."
    ),
    "pilot.slow_response.title": "Asistente de borradores con revisión humana",
    "pilot.slow_response.desc": (
        "Sugiere respuestas a solicitudes entrantes para que el equipo responda más "
        "rápido, con aprobación humana de cada mensaje."
    ),
    "pilot.sales_followup.title": "Seguimiento comercial asistido por CRM",
    "pilot.sales_followup.desc": (
        "Usa el contexto del CRM para redactar seguimientos y próximos pasos; el "
        "comercial revisa y envía."
    ),
    "pilot.reporting.title": "Resumen semanal automatizado de reporting",
    "pilot.reporting.desc": (
        "Convierte datos exportados en un resumen semanal escrito con tendencias y "
        "anomalías para dirección."
    ),
    "pilot.document_processing.title": "Asistente de extracción de datos de documentos",
    "pilot.document_processing.desc": (
        "Extrae campos clave de facturas, contratos o formularios a una tabla "
        "estructurada para validación humana."
    ),
    "pilot.data_entry.title": "Captura de datos de formularios a sistemas",
    "pilot.data_entry.desc": (
        "Reduce la re-digitación extrayendo y pre-rellenando registros, con un paso "
        "de validación."
    ),
    "pilot.scheduling.title": "Asistente de agenda y coordinación",
    "pilot.scheduling.desc": (
        "Redacta agendas, busca huecos y prepara reuniones internas manteniendo a una "
        "persona en el circuito."
    ),
    "pilot.other.title": "Asistente de preguntas frecuentes internas",
    "pilot.other.desc": (
        "Empieza con un asistente privado sobre las preguntas y procedimientos "
        "internos más habituales."
    ),
    # Tech
    "tech.col_tool": "Herramienta",
    "tech.col_why": "Por qué encaja",
    "tech.chatgpt_enterprise.why": (
        "El camino más rápido a la productividad individual con controles de datos "
        "empresariales y sin entrenamiento con tu información."
    ),
    "tech.m365_copilot.why": (
        "IA nativa dentro de Word, Excel, Outlook y Teams: ideal si tu trabajo ya vive "
        "en Microsoft 365."
    ),
    "tech.gemini_workspace.why": (
        "IA nativa dentro de Google Workspace para redacción, resúmenes y reuniones."
    ),
    "tech.notion_ai.why": (
        "IA de bajo coste para documentación y conocimiento interno; buena opción para "
        "equipos pequeños."
    ),
    "tech.openai_api.why": (
        "API flexible para integrar IA en tus propias herramientas y automatizar flujos."
    ),
    "tech.azure_openai.why": (
        "Modelos OpenAI de nivel empresarial dentro de tu tenant de Microsoft, con red "
        "privada y controles de cumplimiento."
    ),
    "tech.aws_bedrock.why": (
        "Acceso gestionado a varios modelos fundacionales con seguridad empresarial y "
        "la gobernanza de tu AWS."
    ),
    "tech.hubspot_breeze.why": (
        "Agentes y redacción dentro de tu CRM para acelerar el seguimiento comercial y "
        "el servicio."
    ),
    "tech.zapier_make.why": (
        "Automatización no-code para conectar las herramientas que ya usas antes de "
        "escribir código."
    ),
    "tech.rag_stack.why": (
        "Generación aumentada privada para que las respuestas salgan de tus documentos, "
        "con citas."
    ),
    "tech.power_bi_copilot.why": (
        "Reporting en lenguaje natural sobre tus dashboards existentes."
    ),
    "tech.ollama_local.why": (
        "Modelos open source en tu propia infraestructura para máxima privacidad y sin "
        "coste por usuario."
    ),
    # Change plan
    "change.1.title": "Alinea primero al liderazgo",
    "change.1.desc": (
        "Acuerda una métrica, un responsable y una lista clara de 'lo que no haremos' "
        "antes de anunciar nada."
    ),
    "change.2.title": "Presenta la IA como co-worker",
    "change.2.desc": (
        "Comunica explícitamente que el piloto elimina trabajo repetitivo, no personas. "
        "Muestra las tareas que se retiran."
    ),
    "change.3.title": "Crea una red de champions",
    "change.3.desc": (
        "Elige 2–3 personas curiosas por equipo, fórmalas primero y deja que apoyen a "
        "sus compañeros."
    ),
    "change.4.title": "Forma por rol, no por herramienta",
    "change.4.desc": (
        "Sesiones cortas y prácticas con tareas reales de cada rol; evita la teoría "
        "genérica."
    ),
    "change.5.title": "Cierra el ciclo de feedback",
    "change.5.desc": (
        "Reuniones semanales de 15 minutos, victorias visibles y un canal simple para "
        "reportar errores o inquietudes."
    ),
    # Roadmap
    "roadmap.p1.title": "Días 0–30 · Base y victorias rápidas",
    "roadmap.p1.a1": "Definir la política de uso de IA y las reglas de datos",
    "roadmap.p1.a2": "Seleccionar el caso de uso piloto y la métrica de referencia",
    "roadmap.p1.a3": "Formar al grupo de champions",
    "roadmap.p1.a4": "Lanzar el piloto con 5–15 usuarios",
    "roadmap.p2.title": "Días 31–60 · Piloto y medición",
    "roadmap.p2.a1": "Revisar el piloto cada semana",
    "roadmap.p2.a2": "Refinar prompts y plantillas con ejemplos reales",
    "roadmap.p2.a3": "Medir frente a la línea base y documentar el ahorro",
    "roadmap.p2.a4": "Recoger inquietudes y resolver bloqueos de adopción",
    "roadmap.p3_people.title": "Días 61–90 · Escalar al equipo",
    "roadmap.p3_people.a1": "Publicar un playbook interno y una biblioteca de prompts",
    "roadmap.p3_people.a2": "Expandir a un segundo equipo",
    "roadmap.p3_people.a3": "Añadir un segundo caso de uso",
    "roadmap.p3_people.a4": "Decidir el presupuesto para el despliegue global",
    "roadmap.p3_systems.title": "Días 61–90 · Integrar y automatizar",
    "roadmap.p3_systems.a1": "Conectar el piloto a un sistema (CRM/ERP) vía API",
    "roadmap.p3_systems.a2": "Automatizar un flujo de trabajo de punta a punta",
    "roadmap.p3_systems.a3": "Añadir monitorización, logs y aprobación humana",
    "roadmap.p3_systems.a4": "Decidir el presupuesto de la siguiente integración",
    "roadmap.p3_foundation.title": "Días 61–90 · Estabilizar los datos",
    "roadmap.p3_foundation.a1": "Centralizar las fuentes de datos prioritarias",
    "roadmap.p3_foundation.a2": "Asignar responsables de datos y controles de calidad",
    "roadmap.p3_foundation.a3": "Repetir la evaluación",
    "roadmap.p3_foundation.a4": "Elegir el primer caso de uso de IA con datos limpios",
    # Quick wins / risks
    "quick.1": "Una biblioteca de prompts por rol, revisada cada mes.",
    "quick.2": "Una clínica de IA semanal de 30 minutos para dudas y demos.",
    "quick.3": "Una regla simple: nunca datos confidenciales en herramientas de consumo.",
    "risk.1.title": "Shadow AI",
    "risk.1.desc": (
        "Empleados usando herramientas no aprobadas. Mitígalo con una política clara y "
        "una alternativa aprobada."
    ),
    "risk.2.title": "Fuga de datos",
    "risk.2.desc": (
        "Datos sensibles pegados en herramientas de consumo. Restringe accesos y "
        "prioriza despliegues empresariales o privados."
    ),
    "risk.3.title": "Expectativas infladas",
    "risk.3.desc": (
        "La IA no es magia. Define un alcance acotado, una línea base y un objetivo "
        "realista."
    ),
    # CTA
    "cta.title": "Tu siguiente paso",
    "cta.body": (
        "Este informe es un punto de partida. Una sesión de trabajo de 45 minutos con "
        "Cloud Automate lo convertirá en un plan de 90 días con responsables, "
        "presupuesto y métricas de éxito."
    ),
    "cta.button": "Reservar mi sesión",
    "cta.contact": "Hablemos de tu roadmap",
    # Errors
    "error.generic": "No se pudo generar el informe. Inténtalo de nuevo.",
}

EN: dict[str, str] = {
    "app.title": "IA-Day-0 Assessment Engine",
    "app.brand": "By Cloud Automate",
    "pdf.title": "AI Adoption Assessment Report",
    "pdf.subtitle": "IA-Day-0 Methodology · By Cloud Automate",
    "pdf.prepared_for": "Prepared for",
    "pdf.date": "Date",
    "pdf.contact": "Contact",
    "pdf.website": "Website",
    "pdf.phone": "Phone",
    "pdf.email": "Email",
    "pdf.confidential": "Confidential document",
    "pdf.page": "Page",
    "pdf.disclaimer": (
        "This report is generated from information declared by the company. It does "
        "not replace a technical audit or legal advice."
    ),
    "pdf.footer_note": "Built with the IA-Day-0 methodology · By Cloud Automate",
    "section.summary": "Executive summary",
    "section.scores": "Diagnosis by dimension",
    "section.data_health": "Data health",
    "section.strategy": "Recommended strategy",
    "section.tech": "Recommended technology stack",
    "section.pilot": "Pilot design",
    "section.change": "Change management plan",
    "section.roadmap": "90-day roadmap",
    "section.next_steps": "Next step",
    "section.profile": "Company profile",
    "section.quick_wins": "Quick wins",
    "section.risks": "Risks to watch",
    "score.data_maturity": "Data maturity",
    "score.digital_infrastructure": "Digital infrastructure",
    "score.ai_readiness": "AI readiness",
    "score.change_readiness": "Change readiness",
    "score.pain_intensity": "Operational pain intensity",
    "score.budget_capacity": "Investment capacity",
    "score.compliance_risk": "Privacy requirements",
    "score.overall": "IA-Day-0 Index",
    "strategy.people.label": "People · Workforce & Co-worker",
    "strategy.people.desc": (
        "Empower every employee with a trusted AI co-worker: training, governance and "
        "quick individual productivity wins before touching core systems."
    ),
    "strategy.systems.label": "Systems · Process integration",
    "strategy.systems.desc": (
        "Connect your CRM, ERP and data sources through APIs and automation to remove "
        "repetitive work end to end."
    ),
    "strategy.hybrid.label": "Hybrid · People first, Systems next",
    "strategy.hybrid.desc": (
        "Start with an internal productivity pilot to build confidence, then integrate "
        "the winning use case into your systems."
    ),
    "strategy.foundation.label": "Foundation · Data first",
    "strategy.foundation.desc": (
        "Before scaling AI, fix the basics: centralize sources, assign owners and "
        "measure quality. Bad data in, bad data out."
    ),
    "data.red.title": "Data health: critical",
    "data.red.msg": (
        "Your data lives in silos and/or is not trusted. Any AI pilot will inherit "
        "those gaps. Spend the first 2–4 weeks centralizing the minimum data set and "
        "assigning an owner before buying tools."
    ),
    "data.amber.title": "Data health: improving",
    "data.amber.msg": (
        "You have a usable base, but quality and ownership are inconsistent. Run a "
        "small pilot on a clean, narrow data set and fix issues as you go."
    ),
    "data.green.title": "Data health: solid",
    "data.green.msg": (
        "Your data is centralized and reasonably trusted. You can move faster: "
        "prioritize integrations and measurable use cases."
    ),
    "employees.label": "Employees",
    "profile.sector": "Sector",
    "profile.budget": "Budget",
    "profile.privacy": "Privacy",
    "profile.maturity": "AI maturity",
    "profile.urgency": "Urgency",
    "score.grade": "Grade",
    "fit.people": "People fit",
    "fit.systems": "Systems fit",
    "sector.manufacturing": "Manufacturing",
    "sector.retail": "Retail",
    "sector.professional_services": "Professional services",
    "sector.healthcare": "Healthcare",
    "sector.finance": "Finance",
    "sector.education": "Education",
    "sector.logistics": "Logistics",
    "sector.hospitality": "Hospitality",
    "sector.technology": "Technology",
    "sector.other": "Other",
    "budget.under_5k": "Under €5,000",
    "budget.5k_25k": "€5,000–25,000",
    "budget.25k_100k": "€25,000–100,000",
    "budget.over_100k": "Over €100,000",
    "budget.unknown": "To be defined",
    "confidentiality.public": "Public data",
    "confidentiality.internal": "Internal use",
    "confidentiality.confidential": "Confidential",
    "confidentiality.regulated": "Regulated (GDPR, health, finance)",
    "maturity.none": "No AI usage",
    "maturity.exploring": "Exploring",
    "maturity.piloting": "Isolated pilots",
    "maturity.scaling": "Scaling",
    "urgency.low": "Low",
    "urgency.medium": "Medium",
    "urgency.high": "High",
    "summary.template": (
        "{company} ({sector}, {employees} employees) scores {score}/100 on the "
        "IA-Day-0 Index. The recommended strategy is {strategy}. {strategy_desc} The "
        "first pilot should stay internal and focus on: {pilot}."
    ),
    "pilot.metric": "Hours saved per person per week",
    "pilot.baseline": "Estimated baseline: 3 h/week",
    "pilot.target": "Target: −40% within 4 weeks",
    "pilot.duration": "Duration: 4 weeks",
    "pilot.risk": "Risk: low",
    "pilot.internal_note": (
        "Internal scope only: no direct exposure to end customers at this stage."
    ),
    "pilot.repetitive_admin.title": "AI co-worker for routine administration",
    "pilot.repetitive_admin.desc": (
        "Draft emails, summaries and internal documents from an approved template "
        "library, with a human reviewing before sending."
    ),
    "pilot.knowledge_search.title": "Internal knowledge assistant (RAG)",
    "pilot.knowledge_search.desc": (
        "Connect policies, manuals and procedures to a private assistant that answers "
        "with citations from your own documents."
    ),
    "pilot.email_writing.title": "Writing assistant for proposals and emails",
    "pilot.email_writing.desc": (
        "Generate first drafts in your tone of voice; the team edits and approves. Low "
        "risk and immediate time savings."
    ),
    "pilot.meeting_notes.title": "Meeting notes and action-item assistant",
    "pilot.meeting_notes.desc": (
        "Transcribe internal meetings and produce summaries with owners and deadlines. "
        "No customer data required."
    ),
    "pilot.slow_response.title": "Draft-response assistant with human review",
    "pilot.slow_response.desc": (
        "Suggest replies to incoming requests so the team answers faster, while a "
        "person approves every message."
    ),
    "pilot.sales_followup.title": "CRM-assisted follow-up drafting",
    "pilot.sales_followup.desc": (
        "Use CRM context to draft follow-ups and next steps; the salesperson reviews "
        "and sends."
    ),
    "pilot.reporting.title": "Automated weekly reporting digest",
    "pilot.reporting.desc": (
        "Turn exported data into a written weekly summary with trends and anomalies "
        "for managers."
    ),
    "pilot.document_processing.title": "Document data extraction assistant",
    "pilot.document_processing.desc": (
        "Extract key fields from invoices, contracts or forms into a structured table "
        "for human validation."
    ),
    "pilot.data_entry.title": "Form-to-system data capture",
    "pilot.data_entry.desc": (
        "Reduce manual re-typing by extracting and pre-filling records, with a "
        "validation step."
    ),
    "pilot.scheduling.title": "Scheduling and coordination assistant",
    "pilot.scheduling.desc": (
        "Draft agendas, find slots and prepare internal meetings while keeping a human "
        "in the loop."
    ),
    "pilot.other.title": "Internal FAQ assistant",
    "pilot.other.desc": (
        "Start with a private assistant over your most common internal questions and "
        "procedures."
    ),
    "tech.col_tool": "Tool",
    "tech.col_why": "Why it fits",
    "tech.chatgpt_enterprise.why": (
        "Fastest path to individual productivity with enterprise data controls and no "
        "training on your data."
    ),
    "tech.m365_copilot.why": (
        "Native AI inside Word, Excel, Outlook and Teams — ideal if your work already "
        "lives in Microsoft 365."
    ),
    "tech.gemini_workspace.why": (
        "Native AI inside Google Workspace for writing, summaries and meetings."
    ),
    "tech.notion_ai.why": (
        "Low-cost AI for internal documentation and knowledge, good for small teams."
    ),
    "tech.openai_api.why": (
        "Flexible API to embed AI in your own tools and automate workflows."
    ),
    "tech.azure_openai.why": (
        "Enterprise-grade OpenAI models inside your Microsoft tenant, with private "
        "networking and compliance controls."
    ),
    "tech.aws_bedrock.why": (
        "Managed access to multiple foundation models with enterprise security and "
        "your existing AWS governance."
    ),
    "tech.hubspot_breeze.why": (
        "AI agents and drafting inside your CRM to speed up sales follow-up and service."
    ),
    "tech.zapier_make.why": (
        "No-code automation to connect the tools you already use before writing any "
        "code."
    ),
    "tech.rag_stack.why": (
        "Private retrieval-augmented generation so answers come from your own "
        "documents, with citations."
    ),
    "tech.power_bi_copilot.why": (
        "Natural-language reporting on top of your existing dashboards."
    ),
    "tech.ollama_local.why": (
        "Open-source models running on your own infrastructure for maximum privacy and "
        "no per-seat cost."
    ),
    "change.1.title": "Align leadership first",
    "change.1.desc": (
        "Agree on one metric, one owner and a clear 'what we will not do' list before "
        "announcing anything."
    ),
    "change.2.title": "Frame AI as a co-worker",
    "change.2.desc": (
        "Communicate explicitly that the pilot removes repetitive work, not people. "
        "Show the tasks being removed."
    ),
    "change.3.title": "Build a champions network",
    "change.3.desc": (
        "Pick 2–3 curious employees per team, train them first and let them support "
        "peers."
    ),
    "change.4.title": "Train by role, not by tool",
    "change.4.desc": (
        "Short, hands-on sessions using real tasks from each role; avoid generic theory."
    ),
    "change.5.title": "Close the feedback loop",
    "change.5.desc": (
        "Weekly 15-minute check-ins, visible wins and a simple channel to report errors "
        "or concerns."
    ),
    "roadmap.p1.title": "Days 0–30 · Foundation & quick wins",
    "roadmap.p1.a1": "Define the AI usage policy and data rules",
    "roadmap.p1.a2": "Select the pilot use case and baseline metric",
    "roadmap.p1.a3": "Train the champion group",
    "roadmap.p1.a4": "Launch the pilot with 5–15 users",
    "roadmap.p2.title": "Days 31–60 · Pilot & measure",
    "roadmap.p2.a1": "Run weekly pilot reviews",
    "roadmap.p2.a2": "Refine prompts and templates with real examples",
    "roadmap.p2.a3": "Measure against the baseline and document savings",
    "roadmap.p2.a4": "Collect concerns and fix adoption blockers",
    "roadmap.p3_people.title": "Days 61–90 · Scale to the team",
    "roadmap.p3_people.a1": "Publish an internal playbook and prompt library",
    "roadmap.p3_people.a2": "Expand to a second team",
    "roadmap.p3_people.a3": "Add a second use case",
    "roadmap.p3_people.a4": "Decide the budget for company-wide rollout",
    "roadmap.p3_systems.title": "Days 61–90 · Integrate & automate",
    "roadmap.p3_systems.a1": "Connect the pilot to one system (CRM/ERP) via API",
    "roadmap.p3_systems.a2": "Automate one end-to-end workflow",
    "roadmap.p3_systems.a3": "Add monitoring, logging and human approval",
    "roadmap.p3_systems.a4": "Decide the budget for the next integration",
    "roadmap.p3_foundation.title": "Days 61–90 · Stabilize the data",
    "roadmap.p3_foundation.a1": "Centralize the priority data sources",
    "roadmap.p3_foundation.a2": "Assign data owners and quality checks",
    "roadmap.p3_foundation.a3": "Re-run the assessment",
    "roadmap.p3_foundation.a4": "Choose the first AI use case with clean data",
    "quick.1": "One prompt library per role, reviewed monthly.",
    "quick.2": "A 30-minute weekly AI clinic for questions and demos.",
    "quick.3": "A simple rule: no confidential data in consumer tools.",
    "risk.1.title": "Shadow AI",
    "risk.1.desc": (
        "Employees using unapproved tools. Mitigate with a clear policy and an "
        "approved alternative."
    ),
    "risk.2.title": "Data leakage",
    "risk.2.desc": (
        "Sensitive data pasted into consumer tools. Restrict access and prefer "
        "enterprise or private deployments."
    ),
    "risk.3.title": "Inflated expectations",
    "risk.3.desc": (
        "AI is not magic. Set a narrow scope, a baseline and a realistic target."
    ),
    "cta.title": "Your next step",
    "cta.body": (
        "This report is a starting point. A 45-minute working session with Cloud "
        "Automate will turn it into a concrete 90-day plan with owners, budget and "
        "success metrics."
    ),
    "cta.button": "Book my session",
    "cta.contact": "Let's talk about your roadmap",
    "error.generic": "The report could not be generated. Please try again.",
}

IT: dict[str, str] = {
    "app.title": "IA-Day-0 Assessment Engine",
    "app.brand": "By Cloud Automate",
    "pdf.title": "Report di Valutazione dell'Adozione dell'IA",
    "pdf.subtitle": "Metodologia IA-Day-0 · By Cloud Automate",
    "pdf.prepared_for": "Preparato per",
    "pdf.date": "Data",
    "pdf.contact": "Contatti",
    "pdf.website": "Sito web",
    "pdf.phone": "Telefono",
    "pdf.email": "Email",
    "pdf.confidential": "Documento riservato",
    "pdf.page": "Pagina",
    "pdf.disclaimer": (
        "Questo report è generato dalle informazioni dichiarate dall'azienda. Non "
        "sostituisce un audit tecnico né una consulenza legale."
    ),
    "pdf.footer_note": "Realizzato con la metodologia IA-Day-0 · By Cloud Automate",
    "section.summary": "Sintesi esecutiva",
    "section.scores": "Diagnosi per dimensione",
    "section.data_health": "Salute dei dati",
    "section.strategy": "Strategia consigliata",
    "section.tech": "Stack tecnologico consigliato",
    "section.pilot": "Disegno del pilota",
    "section.change": "Piano di gestione del cambiamento",
    "section.roadmap": "Roadmap di 90 giorni",
    "section.next_steps": "Prossimo passo",
    "section.profile": "Profilo aziendale",
    "section.quick_wins": "Vittorie rapide",
    "section.risks": "Rischi da monitorare",
    "score.data_maturity": "Maturità dei dati",
    "score.digital_infrastructure": "Infrastruttura digitale",
    "score.ai_readiness": "Prontezza all'IA",
    "score.change_readiness": "Apertura al cambiamento",
    "score.pain_intensity": "Intensità del dolore operativo",
    "score.budget_capacity": "Capacità di investimento",
    "score.compliance_risk": "Requisiti di privacy",
    "score.overall": "Indice IA-Day-0",
    "strategy.people.label": "People · Workforce e Co-worker",
    "strategy.people.desc": (
        "Dai a ogni persona un co-worker IA affidabile: formazione, governance e "
        "vittorie rapide di produttività individuale prima di toccare i sistemi critici."
    ),
    "strategy.systems.label": "Systems · Integrazione dei processi",
    "strategy.systems.desc": (
        "Collega CRM, ERP e fonti dati tramite API e automazione per eliminare il "
        "lavoro ripetitivo end-to-end."
    ),
    "strategy.hybrid.label": "Ibrida · Prima People, poi Systems",
    "strategy.hybrid.desc": (
        "Inizia con un pilota interno di produttività per creare fiducia, poi integra "
        "il caso d'uso vincente nei tuoi sistemi."
    ),
    "strategy.foundation.label": "Foundation · Prima i dati",
    "strategy.foundation.desc": (
        "Prima di scalare l'IA, sistema le basi: centralizza le fonti, assegna "
        "responsabili e misura la qualità. Bad data in, bad data out."
    ),
    "data.red.title": "Salute dei dati: critica",
    "data.red.msg": (
        "I tuoi dati vivono in silos e/o non sono affidabili. Qualsiasi pilota IA "
        "erediterà questi vuoti. Dedica le prime 2–4 settimane a centralizzare il set "
        "minimo di dati e a definire un responsabile prima di acquistare strumenti."
    ),
    "data.amber.title": "Salute dei dati: in miglioramento",
    "data.amber.msg": (
        "Hai una base utilizzabile, ma qualità e proprietà dei dati sono incoerenti. "
        "Esegui un piccolo pilota su un set di dati pulito e circoscritto, correggendo "
        "i problemi lungo il percorso."
    ),
    "data.green.title": "Salute dei dati: solida",
    "data.green.msg": (
        "I tuoi dati sono centralizzati e ragionevolmente affidabili. Puoi andare più "
        "veloce: privilegia integrazioni e casi d'uso misurabili."
    ),
    "employees.label": "Dipendenti",
    "profile.sector": "Settore",
    "profile.budget": "Budget",
    "profile.privacy": "Privacy",
    "profile.maturity": "Maturità IA",
    "profile.urgency": "Urgenza",
    "score.grade": "Grado",
    "fit.people": "Fit People",
    "fit.systems": "Fit Systems",
    "sector.manufacturing": "Manifattura",
    "sector.retail": "Retail",
    "sector.professional_services": "Servizi professionali",
    "sector.healthcare": "Sanità",
    "sector.finance": "Finanza",
    "sector.education": "Istruzione",
    "sector.logistics": "Logistica",
    "sector.hospitality": "Ospitalità",
    "sector.technology": "Tecnologia",
    "sector.other": "Altro",
    "budget.under_5k": "Meno di 5.000 €",
    "budget.5k_25k": "5.000–25.000 €",
    "budget.25k_100k": "25.000–100.000 €",
    "budget.over_100k": "Oltre 100.000 €",
    "budget.unknown": "Da definire",
    "confidentiality.public": "Dati pubblici",
    "confidentiality.internal": "Uso interno",
    "confidentiality.confidential": "Riservato",
    "confidentiality.regulated": "Regolamentato (GDPR, sanità, finanza)",
    "maturity.none": "Nessun uso di IA",
    "maturity.exploring": "In esplorazione",
    "maturity.piloting": "Piloti isolati",
    "maturity.scaling": "In scalata",
    "urgency.low": "Bassa",
    "urgency.medium": "Media",
    "urgency.high": "Alta",
    "summary.template": (
        "{company} ({sector}, {employees} dipendenti) ottiene un Indice IA-Day-0 di "
        "{score}/100. La strategia consigliata è {strategy}. {strategy_desc} Il primo "
        "pilota deve restare interno e concentrarsi su: {pilot}."
    ),
    "pilot.metric": "Ore risparmiate per persona a settimana",
    "pilot.baseline": "Baseline stimata: 3 h/settimana",
    "pilot.target": "Obiettivo: −40% in 4 settimane",
    "pilot.duration": "Durata: 4 settimane",
    "pilot.risk": "Rischio: basso",
    "pilot.internal_note": (
        "Ambito solo interno: nessuna esposizione diretta al cliente finale in questa fase."
    ),
    "pilot.repetitive_admin.title": "Co-worker IA per l'amministrazione quotidiana",
    "pilot.repetitive_admin.desc": (
        "Redige email, riassunti e documenti interni da una libreria di template "
        "approvati, con revisione umana prima dell'invio."
    ),
    "pilot.knowledge_search.title": "Assistente alla conoscenza interna (RAG)",
    "pilot.knowledge_search.desc": (
        "Collega policy, manuali e procedure a un assistente privato che risponde "
        "citando i tuoi documenti."
    ),
    "pilot.email_writing.title": "Assistente alla scrittura di proposte ed email",
    "pilot.email_writing.desc": (
        "Genera prime bozze con il tuo tono di voce; il team modifica e approva. Basso "
        "rischio e risparmio di tempo immediato."
    ),
    "pilot.meeting_notes.title": "Assistente per note e azioni delle riunioni",
    "pilot.meeting_notes.desc": (
        "Trascrive riunioni interne e produce riassunti con responsabili e scadenze. "
        "Nessun dato cliente richiesto."
    ),
    "pilot.slow_response.title": "Assistente alle bozze con revisione umana",
    "pilot.slow_response.desc": (
        "Suggerisce risposte alle richieste in arrivo per far rispondere il team più "
        "velocemente, con approvazione umana di ogni messaggio."
    ),
    "pilot.sales_followup.title": "Follow-up commerciale assistito dal CRM",
    "pilot.sales_followup.desc": (
        "Usa il contesto del CRM per redigere follow-up e prossimi passi; il venditore "
        "rivede e invia."
    ),
    "pilot.reporting.title": "Riepilogo settimanale automatizzato del reporting",
    "pilot.reporting.desc": (
        "Trasforma i dati esportati in un riepilogo settimanale scritto con trend e "
        "anomalie per la direzione."
    ),
    "pilot.document_processing.title": "Assistente all'estrazione dati dai documenti",
    "pilot.document_processing.desc": (
        "Estrae campi chiave da fatture, contratti o moduli in una tabella strutturata "
        "per la validazione umana."
    ),
    "pilot.data_entry.title": "Acquisizione dati da moduli ai sistemi",
    "pilot.data_entry.desc": (
        "Riduce la ridigitazione estraendo e precompilando i record, con un passaggio "
        "di validazione."
    ),
    "pilot.scheduling.title": "Assistente per agenda e coordinamento",
    "pilot.scheduling.desc": (
        "Redige agende, trova slot e prepara riunioni interne mantenendo una persona "
        "nel circuito."
    ),
    "pilot.other.title": "Assistente alle FAQ interne",
    "pilot.other.desc": (
        "Inizia con un assistente privato sulle domande e procedure interne più comuni."
    ),
    "tech.col_tool": "Strumento",
    "tech.col_why": "Perché è adatto",
    "tech.chatgpt_enterprise.why": (
        "La via più rapida alla produttività individuale con controlli sui dati "
        "aziendali e nessun addestramento sui tuoi dati."
    ),
    "tech.m365_copilot.why": (
        "IA nativa in Word, Excel, Outlook e Teams: ideale se il tuo lavoro è già in "
        "Microsoft 365."
    ),
    "tech.gemini_workspace.why": (
        "IA nativa in Google Workspace per scrittura, riassunti e riunioni."
    ),
    "tech.notion_ai.why": (
        "IA a basso costo per documentazione e conoscenza interna; buona per team "
        "piccoli."
    ),
    "tech.openai_api.why": (
        "API flessibile per integrare l'IA nei tuoi strumenti e automatizzare i flussi."
    ),
    "tech.azure_openai.why": (
        "Modelli OpenAI di livello enterprise nel tuo tenant Microsoft, con rete "
        "privata e controlli di conformità."
    ),
    "tech.aws_bedrock.why": (
        "Accesso gestito a diversi modelli fondazionali con sicurezza enterprise e la "
        "governance del tuo AWS."
    ),
    "tech.hubspot_breeze.why": (
        "Agenti e redazione dentro il tuo CRM per accelerare follow-up e assistenza."
    ),
    "tech.zapier_make.why": (
        "Automazione no-code per collegare gli strumenti che già usi prima di scrivere "
        "codice."
    ),
    "tech.rag_stack.why": (
        "Generazione aumentata privata così le risposte arrivano dai tuoi documenti, "
        "con citazioni."
    ),
    "tech.power_bi_copilot.why": (
        "Reporting in linguaggio naturale sopra le tue dashboard esistenti."
    ),
    "tech.ollama_local.why": (
        "Modelli open source sulla tua infrastruttura per massima privacy e nessun "
        "costo per utente."
    ),
    "change.1.title": "Allinea prima la leadership",
    "change.1.desc": (
        "Concorda una metrica, un responsabile e una lista chiara di 'cosa non faremo' "
        "prima di annunciare qualsiasi cosa."
    ),
    "change.2.title": "Presenta l'IA come co-worker",
    "change.2.desc": (
        "Comunica esplicitamente che il pilota elimina il lavoro ripetitivo, non le "
        "persone. Mostra le attività che vengono rimosse."
    ),
    "change.3.title": "Crea una rete di champion",
    "change.3.desc": (
        "Scegli 2–3 persone curiose per team, formale per prime e lascia che "
        "supportino i colleghi."
    ),
    "change.4.title": "Forma per ruolo, non per strumento",
    "change.4.desc": (
        "Sessioni brevi e pratiche con attività reali di ogni ruolo; evita la teoria "
        "generica."
    ),
    "change.5.title": "Chiudi il ciclo di feedback",
    "change.5.desc": (
        "Check-in settimanali di 15 minuti, vittorie visibili e un canale semplice per "
        "segnalare errori o dubbi."
    ),
    "roadmap.p1.title": "Giorni 0–30 · Basi e vittorie rapide",
    "roadmap.p1.a1": "Definire la policy d'uso dell'IA e le regole sui dati",
    "roadmap.p1.a2": "Selezionare il caso d'uso pilota e la metrica di riferimento",
    "roadmap.p1.a3": "Formare il gruppo di champion",
    "roadmap.p1.a4": "Lanciare il pilota con 5–15 utenti",
    "roadmap.p2.title": "Giorni 31–60 · Pilota e misurazione",
    "roadmap.p2.a1": "Rivedere il pilota ogni settimana",
    "roadmap.p2.a2": "Raffinare prompt e template con esempi reali",
    "roadmap.p2.a3": "Misurare rispetto alla baseline e documentare il risparmio",
    "roadmap.p2.a4": "Raccogliere dubbi e risolvere i blocchi all'adozione",
    "roadmap.p3_people.title": "Giorni 61–90 · Scalare al team",
    "roadmap.p3_people.a1": "Pubblicare un playbook interno e una libreria di prompt",
    "roadmap.p3_people.a2": "Espandere a un secondo team",
    "roadmap.p3_people.a3": "Aggiungere un secondo caso d'uso",
    "roadmap.p3_people.a4": "Decidere il budget per il rollout aziendale",
    "roadmap.p3_systems.title": "Giorni 61–90 · Integrare e automatizzare",
    "roadmap.p3_systems.a1": "Collegare il pilota a un sistema (CRM/ERP) via API",
    "roadmap.p3_systems.a2": "Automatizzare un flusso di lavoro end-to-end",
    "roadmap.p3_systems.a3": "Aggiungere monitoraggio, log e approvazione umana",
    "roadmap.p3_systems.a4": "Decidere il budget per la prossima integrazione",
    "roadmap.p3_foundation.title": "Giorni 61–90 · Stabilizzare i dati",
    "roadmap.p3_foundation.a1": "Centralizzare le fonti dati prioritarie",
    "roadmap.p3_foundation.a2": "Assegnare responsabili dei dati e controlli di qualità",
    "roadmap.p3_foundation.a3": "Ripetere la valutazione",
    "roadmap.p3_foundation.a4": "Scegliere il primo caso d'uso IA con dati puliti",
    "quick.1": "Una libreria di prompt per ruolo, rivista ogni mese.",
    "quick.2": "Una clinic IA settimanale di 30 minuti per dubbi e demo.",
    "quick.3": "Una regola semplice: mai dati riservati negli strumenti consumer.",
    "risk.1.title": "Shadow AI",
    "risk.1.desc": (
        "Dipendenti che usano strumenti non approvati. Mitiga con una policy chiara e "
        "un'alternativa approvata."
    ),
    "risk.2.title": "Fuga di dati",
    "risk.2.desc": (
        "Dati sensibili incollati in strumenti consumer. Limita gli accessi e privilegia "
        "deployment enterprise o privati."
    ),
    "risk.3.title": "Aspettative gonfiate",
    "risk.3.desc": (
        "L'IA non è magia. Definisci un ambito ristretto, una baseline e un obiettivo "
        "realistico."
    ),
    "cta.title": "Il tuo prossimo passo",
    "cta.body": (
        "Questo report è un punto di partenza. Una sessione di lavoro di 45 minuti con "
        "Cloud Automate lo trasformerà in un piano di 90 giorni con responsabili, "
        "budget e metriche di successo."
    ),
    "cta.button": "Prenota la mia sessione",
    "cta.contact": "Parliamo della tua roadmap",
    "error.generic": "Impossibile generare il report. Riprova.",
}

CATALOGS: dict[str, dict[str, str]] = {"es": ES, "en": EN, "it": IT}


def t(lang: str, key: str, **kwargs: object) -> str:
    """Translate a key, falling back to Spanish and then to the key itself."""
    lang = lang if lang in CATALOGS else DEFAULT_LANGUAGE
    value = CATALOGS[lang].get(key) or ES.get(key) or key
    if kwargs:
        try:
            return value.format(**kwargs)
        except (KeyError, IndexError):
            return value
    return value
