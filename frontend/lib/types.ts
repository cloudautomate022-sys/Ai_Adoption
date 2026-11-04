export type Lang = "es" | "en" | "it";

export type Scores = {
  data_maturity: number;
  digital_infrastructure: number;
  ai_readiness: number;
  change_readiness: number;
  pain_intensity: number;
  budget_capacity: number;
  compliance_risk: number;
  overall: number;
};

export type TechItem = {
  id: string;
  name: string;
  why: string;
};

export type Pilot = {
  id: string;
  title: string;
  description: string;
  metric: string;
  baseline: string;
  target: string;
  duration: string;
  risk: string;
  note: string;
  customer_facing: boolean;
};

export type RoadmapPhase = {
  title: string;
  actions: string[];
};

export type ChangeItem = {
  title: string;
  description: string;
};

export type Profile = {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  sector: string;
  sector_label: string;
  employees: string;
  budget: string;
  budget_label: string;
  confidentiality: string;
  confidentiality_label: string;
  ai_maturity: string;
  ai_maturity_label: string;
  urgency: string;
  urgency_label: string;
  digital_literacy: number;
};

export type Result = {
  language: Lang;
  generated_at: string;
  scores: Scores;
  grade: string;
  fit: { people: number; systems: number };
  strategy: "people" | "systems" | "hybrid" | "foundation";
  strategy_label: string;
  strategy_desc: string;
  summary: string;
  data_health: {
    level: "red" | "amber" | "green";
    score: number;
    title: string;
    message: string;
    quote: string;
  };
  profile: Profile;
  tech_stack: TechItem[];
  pilot: Pilot;
  change_plan: ChangeItem[];
  roadmap: RoadmapPhase[];
  quick_wins: string[];
  risks: ChangeItem[];
  cta: { title: string; body: string; button: string };
};

export type AssessmentResponse = {
  public_id: string;
  created_at: string;
  company_name: string;
  language: Lang;
  result: Result;
};

export type LeadSummary = {
  id: number;
  public_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  sector: string;
  employees: string;
  language: Lang;
  strategy: Result["strategy"];
  overall_score: number;
  data_score: number;
  created_at: string;
};

export type LeadDetail = LeadSummary & {
  answers: Record<string, unknown>;
  result: Result;
  notes: string;
};

export type LeadList = {
  items: LeadSummary[];
  total: number;
  page: number;
  page_size: number;
};

export type Stats = {
  total_leads: number;
  leads_7d: number;
  avg_score: number;
  avg_data_score: number;
  strategy_counts: Record<string, number>;
  sector_counts: Record<string, number>;
  language_counts: Record<string, number>;
};

export type AssessmentPayload = {
  language: Lang;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  sector: string;
  employees: string;
  tools: string[];
  data_centralization: number;
  data_quality: number;
  pain_points: string[];
  pain_severity: number;
  notes: string;
  budget: string;
  confidentiality: string;
  ai_maturity: string;
  digital_literacy: number;
  urgency: string;
};
