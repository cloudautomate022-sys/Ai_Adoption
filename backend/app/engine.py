"""IA-Day-0 decision engine.

Turns a validated intake form into a deterministic, localized assessment:
scores, strategy, data-health alert, tech stack, pilot, change plan and roadmap.

Design notes
------------
* No LLM dependency: results are reproducible and auditable.
* Rules encode the IA-Day-0 constraints (80% rule, privacy first, internal-first
  pilots, start small and measure).
* All prose comes from ``content.py`` so the report can be rebuilt in ES/EN/IT.
"""

from __future__ import annotations

from datetime import datetime, timezone

from . import content
from .content import t

PEOPLE_PAINS = {
    "repetitive_admin",
    "knowledge_search",
    "email_writing",
    "meeting_notes",
    "scheduling",
    "other",
}
SYSTEMS_PAINS = {
    "slow_response",
    "sales_followup",
    "reporting",
    "document_processing",
    "data_entry",
}

TOOL_WEIGHTS = {
    "email_suite": 15,
    "google_workspace": 15,
    "crm": 20,
    "erp": 20,
    "cloud_storage": 15,
    "bi": 20,
    "collaboration": 10,
}

BUDGET_SCORE = {
    "under_5k": 15,
    "5k_25k": 40,
    "25k_100k": 70,
    "over_100k": 90,
    "unknown": 35,
}

COMPLIANCE_SCORE = {
    "public": 10,
    "internal": 30,
    "confidential": 65,
    "regulated": 90,
}

MATURITY_SCORE = {
    "none": 10,
    "exploring": 35,
    "piloting": 62,
    "scaling": 85,
}

TOOL_NAMES = {
    "chatgpt_enterprise": "ChatGPT Enterprise / Team (OpenAI)",
    "m365_copilot": "Microsoft 365 Copilot",
    "gemini_workspace": "Google Gemini for Workspace",
    "notion_ai": "Notion AI",
    "openai_api": "OpenAI API (GPT-4o)",
    "azure_openai": "Azure OpenAI Service",
    "aws_bedrock": "Amazon Bedrock",
    "hubspot_breeze": "HubSpot Breeze",
    "zapier_make": "Zapier / Make",
    "rag_stack": "RAG with LlamaIndex + pgvector",
    "power_bi_copilot": "Power BI Copilot",
    "ollama_local": "Local open-source models (Llama 3.1 + Ollama)",
}


def _scale(value: int) -> float:
    """Map a 1–5 answer to 0–100."""
    return (max(1, min(5, value)) - 1) / 4 * 100


def _clamp(value: float, low: float = 0, high: float = 100) -> int:
    return int(round(max(low, min(high, value))))


def _score_data(answers: dict) -> int:
    return _clamp(
        0.55 * _scale(answers["data_centralization"])
        + 0.45 * _scale(answers["data_quality"])
    )


def _score_infrastructure(answers: dict) -> int:
    tools = set(answers.get("tools") or [])
    if not tools or tools == {"none"}:
        return 8
    return _clamp(sum(TOOL_WEIGHTS.get(tool, 0) for tool in tools))


def _score_ai_readiness(answers: dict) -> int:
    return _clamp(
        0.6 * MATURITY_SCORE.get(answers["ai_maturity"], 10)
        + 0.4 * _scale(answers["digital_literacy"])
    )


def _score_change_readiness(answers: dict) -> int:
    urgency_bonus = {"low": -5, "medium": 0, "high": 6}.get(answers["urgency"], 0)
    return _clamp(
        0.6 * _scale(answers["digital_literacy"])
        + 0.4 * MATURITY_SCORE.get(answers["ai_maturity"], 10)
        + urgency_bonus
    )


def _score_pain(answers: dict) -> int:
    pains = answers.get("pain_points") or []
    return _clamp(0.7 * _scale(answers["pain_severity"]) + 0.3 * min(100, len(pains) * 18))


def _strategy_fit(answers: dict, scores: dict) -> tuple[str, int, int]:
    pains = set(answers.get("pain_points") or [])
    people_count = len(pains & PEOPLE_PAINS)
    systems_count = len(pains & SYSTEMS_PAINS)

    people_fit = (
        50
        + 11 * (people_count - systems_count)
        + 0.30 * (scores["change_readiness"] - 50)
        + 0.20 * (55 - scores["budget_capacity"])
        + 0.15 * (55 - scores["digital_infrastructure"])
    )
    systems_fit = (
        50
        + 11 * (systems_count - people_count)
        + 0.30 * (scores["digital_infrastructure"] - 50)
        + 0.20 * (scores["budget_capacity"] - 50)
        + 0.15 * (scores["ai_readiness"] - 50)
    )
    people_fit, systems_fit = _clamp(people_fit), _clamp(systems_fit)

    if scores["data_maturity"] < 35:
        strategy = "foundation"
    elif abs(people_fit - systems_fit) <= 8:
        strategy = "hybrid"
    else:
        strategy = "people" if people_fit > systems_fit else "systems"
    return strategy, people_fit, systems_fit


def _pick_pilot_pain(answers: dict, strategy: str) -> str:
    pains = list(answers.get("pain_points") or [])
    if not pains:
        return "other"
    if strategy == "systems":
        preferred = SYSTEMS_PAINS
    elif strategy == "foundation":
        preferred = {"knowledge_search", "repetitive_admin", "other"}
    else:
        preferred = PEOPLE_PAINS
    for pain in pains:
        if pain in preferred:
            return pain
    return pains[0]


def _tech_stack(answers: dict, strategy: str) -> list[dict]:
    selected: list[str] = []

    def add(tool: str) -> None:
        if tool not in selected:
            selected.append(tool)

    tools = set(answers.get("tools") or [])
    pains = set(answers.get("pain_points") or [])
    office = "email_suite" in tools
    google = "google_workspace" in tools
    crm = "crm" in tools
    bi = "bi" in tools

    budget = answers["budget"]
    high_privacy = answers["confidentiality"] in {"confidential", "regulated"}
    low_budget = budget in {"under_5k", "unknown"}
    systems_count = len(pains & SYSTEMS_PAINS)

    if high_privacy:
        add("azure_openai" if office else "aws_bedrock")
        if "knowledge_search" in pains or strategy in {"systems", "hybrid"}:
            add("rag_stack")
        add("ollama_local")
        if crm:
            add("hubspot_breeze")
        if bi or "reporting" in pains:
            add("power_bi_copilot")
    else:
        if office:
            add("m365_copilot")
        elif google:
            add("gemini_workspace")
        else:
            add("chatgpt_enterprise")

        if strategy in {"systems", "hybrid"} or systems_count >= 2:
            add("openai_api")
            add("zapier_make")
        if "knowledge_search" in pains and not low_budget:
            add("rag_stack")
        if crm and "sales_followup" in pains:
            add("hubspot_breeze")
        if "reporting" in pains:
            add("power_bi_copilot")
        if low_budget:
            add("notion_ai")

        # Always give the client at least three concrete options.
        for fallback in (
            "chatgpt_enterprise",
            "zapier_make",
            "notion_ai",
            "power_bi_copilot",
        ):
            if len(selected) >= 3:
                break
            add(fallback)

    if not selected:
        add("chatgpt_enterprise")

    return [
        {
            "id": tool,
            "name": TOOL_NAMES.get(tool, tool),
            "why": t(answers["language"], f"tech.{tool}.why"),
        }
        for tool in selected[:6]
    ]


def _roadmap(answers: dict, strategy: str) -> list[dict]:
    lang = answers["language"]
    phase3 = {
        "systems": "systems",
        "foundation": "foundation",
    }.get(strategy, "people")

    return [
        {
            "title": t(lang, "roadmap.p1.title"),
            "actions": [t(lang, f"roadmap.p1.a{i}") for i in range(1, 5)],
        },
        {
            "title": t(lang, "roadmap.p2.title"),
            "actions": [t(lang, f"roadmap.p2.a{i}") for i in range(1, 5)],
        },
        {
            "title": t(lang, f"roadmap.p3_{phase3}.title"),
            "actions": [t(lang, f"roadmap.p3_{phase3}.a{i}") for i in range(1, 5)],
        },
    ]


def _data_health(score: int, lang: str) -> dict:
    level = "red" if score < 40 else "amber" if score < 70 else "green"
    return {
        "level": level,
        "score": score,
        "title": t(lang, f"data.{level}.title"),
        "message": t(lang, f"data.{level}.msg"),
        "quote": "Bad data in, bad data out.",
    }


def evaluate(answers: dict) -> dict:
    """Build the full localized assessment result from validated answers."""
    lang = answers.get("language", content.DEFAULT_LANGUAGE)
    if lang not in content.LANGUAGES:
        lang = content.DEFAULT_LANGUAGE

    data_maturity = _score_data(answers)
    scores = {
        "data_maturity": data_maturity,
        "digital_infrastructure": _score_infrastructure(answers),
        "ai_readiness": _score_ai_readiness(answers),
        "change_readiness": _score_change_readiness(answers),
        "pain_intensity": _score_pain(answers),
        "budget_capacity": BUDGET_SCORE.get(answers["budget"], 35),
        "compliance_risk": COMPLIANCE_SCORE.get(answers["confidentiality"], 30),
    }
    scores["overall"] = _clamp(
        0.20 * scores["data_maturity"]
        + 0.20 * scores["digital_infrastructure"]
        + 0.25 * scores["ai_readiness"]
        + 0.15 * scores["change_readiness"]
        + 0.10 * scores["pain_intensity"]
        + 0.10 * scores["budget_capacity"]
    )

    strategy, people_fit, systems_fit = _strategy_fit(answers, scores)
    pilot_pain = _pick_pilot_pain(answers, strategy)

    strategy_desc = t(lang, f"strategy.{strategy}.desc")
    summary = t(
        lang,
        "summary.template",
        company=answers["company_name"],
        sector=t(lang, f"sector.{answers['sector']}"),
        employees=answers["employees"],
        score=scores["overall"],
        strategy=t(lang, f"strategy.{strategy}.label"),
        strategy_desc=strategy_desc,
        pilot=t(lang, f"pilot.{pilot_pain}.title"),
    )

    return {
        "language": lang,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "scores": scores,
        "grade": "A" if scores["overall"] >= 80 else "B" if scores["overall"] >= 65 else "C" if scores["overall"] >= 45 else "D",
        "fit": {"people": people_fit, "systems": systems_fit},
        "strategy": strategy,
        "strategy_label": t(lang, f"strategy.{strategy}.label"),
        "strategy_desc": strategy_desc,
        "summary": summary,
        "data_health": _data_health(data_maturity, lang),
        "profile": {
            "company_name": answers["company_name"],
            "contact_name": answers["contact_name"],
            "email": answers["email"],
            "phone": answers.get("phone", ""),
            "sector": answers["sector"],
            "sector_label": t(lang, f"sector.{answers['sector']}"),
            "employees": answers["employees"],
            "budget": answers["budget"],
            "budget_label": t(lang, f"budget.{answers['budget']}"),
            "confidentiality": answers["confidentiality"],
            "confidentiality_label": t(
                lang, f"confidentiality.{answers['confidentiality']}"
            ),
            "ai_maturity": answers["ai_maturity"],
            "ai_maturity_label": t(lang, f"maturity.{answers['ai_maturity']}"),
            "urgency": answers["urgency"],
            "urgency_label": t(lang, f"urgency.{answers['urgency']}"),
            "digital_literacy": answers["digital_literacy"],
        },
        "tech_stack": _tech_stack(answers, strategy),
        "pilot": {
            "id": pilot_pain,
            "title": t(lang, f"pilot.{pilot_pain}.title"),
            "description": t(lang, f"pilot.{pilot_pain}.desc"),
            "metric": t(lang, "pilot.metric"),
            "baseline": t(lang, "pilot.baseline"),
            "target": t(lang, "pilot.target"),
            "duration": t(lang, "pilot.duration"),
            "risk": t(lang, "pilot.risk"),
            "note": t(lang, "pilot.internal_note"),
            "customer_facing": False,
        },
        "change_plan": [
            {
                "title": t(lang, f"change.{i}.title"),
                "description": t(lang, f"change.{i}.desc"),
            }
            for i in range(1, 6)
        ],
        "roadmap": _roadmap(answers, strategy),
        "quick_wins": [t(lang, f"quick.{i}") for i in range(1, 4)],
        "risks": [
            {
                "title": t(lang, f"risk.{i}.title"),
                "description": t(lang, f"risk.{i}.desc"),
            }
            for i in range(1, 4)
        ],
        "cta": {
            "title": t(lang, "cta.title"),
            "body": t(lang, "cta.body"),
            "button": t(lang, "cta.button"),
        },
    }
