"""Engine smoke tests. Run with: python -m pytest (from backend/)."""

from app.engine import evaluate


BASE = {
    "language": "es",
    "company_name": "Acme Manufacturing",
    "contact_name": "Laura Gomez",
    "email": "laura@acme.test",
    "phone": "+34 600 000 000",
    "sector": "manufacturing",
    "employees": "51-200",
    "tools": ["email_suite", "erp", "cloud_storage"],
    "data_centralization": 2,
    "data_quality": 2,
    "pain_points": ["repetitive_admin", "reporting", "knowledge_search"],
    "pain_severity": 4,
    "notes": "",
    "budget": "5k_25k",
    "confidentiality": "internal",
    "ai_maturity": "exploring",
    "digital_literacy": 3,
    "urgency": "medium",
}


def _run(**overrides):
    answers = {**BASE, **overrides}
    return evaluate(answers)


def test_result_is_localized_and_complete():
    result = _run()
    for key in ("scores", "strategy", "tech_stack", "pilot", "change_plan", "roadmap"):
        assert key in result
    assert result["scores"]["overall"] > 0
    assert result["pilot"]["customer_facing"] is False
    assert len(result["tech_stack"]) >= 1
    assert len(result["roadmap"]) == 3


def test_low_data_maturity_forces_foundation():
    result = _run(data_centralization=1, data_quality=1)
    assert result["strategy"] == "foundation"
    assert result["data_health"]["level"] == "red"


def test_regulated_data_prefers_private_enterprise_tools():
    result = _run(confidentiality="regulated", budget="25k_100k", tools=["email_suite", "crm"])
    ids = {item["id"] for item in result["tech_stack"]}
    assert "azure_openai" in ids or "aws_bedrock" in ids
    assert "chatgpt_enterprise" not in ids


def test_systems_profile_gets_api_and_automation():
    result = _run(
        tools=["email_suite", "crm", "erp", "cloud_storage", "bi"],
        data_centralization=5,
        data_quality=4,
        ai_maturity="piloting",
        digital_literacy=4,
        budget="25k_100k",
        pain_points=["sales_followup", "reporting", "document_processing"],
        pain_severity=5,
    )
    ids = {item["id"] for item in result["tech_stack"]}
    assert result["strategy"] in {"systems", "hybrid"}
    assert "openai_api" in ids
    assert result["pilot"]["customer_facing"] is False


def test_languages_are_supported():
    for lang in ("es", "en", "it"):
        result = _run(language=lang)
        assert result["language"] == lang
        assert result["strategy_label"]
        assert result["summary"]


def test_pdf_renders_for_every_language():
    from app.pdf_report import render_pdf

    for lang in ("es", "en", "it"):
        answers = {**BASE, "language": lang}
        result = evaluate(answers)
        payload = render_pdf(answers, result)
        assert payload.startswith(b"%PDF")
        assert len(payload) > 5000


def test_privacy_axis_does_not_leak_consumer_tools():
    result = _run(confidentiality="regulated", budget="over_100k")
    ids = {item["id"] for item in result["tech_stack"]}
    assert "chatgpt_enterprise" not in ids
    assert "notion_ai" not in ids
