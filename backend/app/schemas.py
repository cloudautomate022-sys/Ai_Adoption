from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

Language = Literal["es", "en", "it"]
Sector = Literal[
    "manufacturing",
    "retail",
    "professional_services",
    "healthcare",
    "finance",
    "education",
    "logistics",
    "hospitality",
    "technology",
    "other",
]
Employees = Literal["1-10", "11-50", "51-200", "201-1000", "1000+"]
Budget = Literal["under_5k", "5k_25k", "25k_100k", "over_100k", "unknown"]
Confidentiality = Literal["public", "internal", "confidential", "regulated"]
Maturity = Literal["none", "exploring", "piloting", "scaling"]
Urgency = Literal["low", "medium", "high"]

TOOLS = {
    "email_suite",
    "google_workspace",
    "crm",
    "erp",
    "cloud_storage",
    "bi",
    "collaboration",
    "none",
}
PAINS = {
    "repetitive_admin",
    "knowledge_search",
    "email_writing",
    "meeting_notes",
    "slow_response",
    "sales_followup",
    "reporting",
    "document_processing",
    "data_entry",
    "scheduling",
    "other",
}


class AssessmentIn(BaseModel):
    language: Language = "es"

    company_name: str = Field(min_length=2, max_length=200)
    contact_name: str = Field(min_length=2, max_length=200)
    email: EmailStr
    phone: str = Field(default="", max_length=60)
    sector: Sector
    employees: Employees

    tools: list[str] = Field(default_factory=list)
    data_centralization: int = Field(ge=1, le=5)
    data_quality: int = Field(ge=1, le=5)

    pain_points: list[str] = Field(default_factory=list)
    pain_severity: int = Field(ge=1, le=5)
    notes: str = Field(default="", max_length=2000)

    budget: Budget = "unknown"
    confidentiality: Confidentiality = "internal"
    ai_maturity: Maturity = "none"
    digital_literacy: int = Field(ge=1, le=5)
    urgency: Urgency = "medium"

    @field_validator("tools")
    @classmethod
    def validate_tools(cls, value: list[str]) -> list[str]:
        clean = [item for item in dict.fromkeys(value) if item in TOOLS]
        return [item for item in clean if item != "none"] or ["none"]

    @field_validator("pain_points")
    @classmethod
    def validate_pains(cls, value: list[str]) -> list[str]:
        clean = [item for item in dict.fromkeys(value) if item in PAINS]
        return clean or ["other"]


class AssessmentCreated(BaseModel):
    public_id: str
    result: dict


class LoginIn(BaseModel):
    username: str = Field(min_length=1, max_length=64)
    password: str = Field(min_length=1, max_length=200)


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class LeadSummary(BaseModel):
    id: int
    public_id: str
    company_name: str
    contact_name: str
    email: str
    phone: str
    sector: str
    employees: str
    language: str
    strategy: str
    overall_score: int
    data_score: int
    created_at: datetime


class LeadDetail(LeadSummary):
    answers: dict
    result: dict
    notes: str


class LeadListOut(BaseModel):
    items: list[LeadSummary]
    total: int
    page: int
    page_size: int


class StatsOut(BaseModel):
    total_leads: int
    leads_7d: int
    avg_score: float
    avg_data_score: float
    strategy_counts: dict[str, int]
    sector_counts: dict[str, int]
    language_counts: dict[str, int]
