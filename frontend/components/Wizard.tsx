"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { createAssessment } from "@/lib/api";
import type { AssessmentPayload } from "@/lib/types";

const SECTORS = [
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
];
const EMPLOYEES = ["1-10", "11-50", "51-200", "201-1000", "1000+"];
const TOOLS = [
  "email_suite",
  "google_workspace",
  "crm",
  "erp",
  "cloud_storage",
  "bi",
  "collaboration",
  "none",
];
const PAINS = [
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
];
const BUDGETS = ["under_5k", "5k_25k", "25k_100k", "over_100k", "unknown"];
const CONFIDENTIALITY = ["public", "internal", "confidential", "regulated"];
const MATURITY = ["none", "exploring", "piloting", "scaling"];
const URGENCIES = ["low", "medium", "high"];

type FormState = Omit<AssessmentPayload, "language">;

const INITIAL: FormState = {
  company_name: "",
  contact_name: "",
  email: "",
  phone: "",
  sector: "",
  employees: "",
  tools: [],
  data_centralization: 3,
  data_quality: 3,
  pain_points: [],
  pain_severity: 3,
  notes: "",
  budget: "unknown",
  confidentiality: "internal",
  ai_maturity: "none",
  digital_literacy: 3,
  urgency: "medium",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Scale({
  value,
  onChange,
  low,
  high,
}: {
  value: number;
  onChange: (value: number) => void;
  low: string;
  high: string;
}) {
  return (
    <div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => onChange(number)}
            className={`h-11 flex-1 rounded-xl border text-sm font-semibold transition ${
              value === number
                ? "border-accent/70 bg-accent/15 text-white shadow-[0_0_20px_-6px_rgba(34,211,238,0.6)]"
                : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:text-white"
            }`}
            aria-pressed={value === number}
          >
            {number}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-slate-500">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

export default function Wizard() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const validate = (current: number): boolean => {
    const next: Record<string, string> = {};
    if (current === 1) {
      if (form.company_name.trim().length < 2) next.company_name = t("err.company");
      if (form.contact_name.trim().length < 2) next.contact_name = t("err.contact");
      if (!EMAIL_RE.test(form.email.trim())) next.email = t("err.email");
      if (!form.sector) next.sector = t("err.sector");
      if (!form.employees) next.employees = t("err.employees");
    }
    if (current === 3 && form.pain_points.length === 0) {
      next.pain_points = t("err.pains");
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goTo = (target: number) => {
    setStep(target);
    requestAnimationFrame(() =>
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  const next = () => {
    if (validate(step)) goTo(Math.min(5, step + 1));
  };
  const back = () => goTo(Math.max(1, step - 1));

  const toggleTool = (id: string) => {
    if (id === "none") {
      update("tools", form.tools.includes("none") ? [] : ["none"]);
      return;
    }
    const withoutNone = form.tools.filter((tool) => tool !== "none");
    update(
      "tools",
      withoutNone.includes(id)
        ? withoutNone.filter((tool) => tool !== id)
        : [...withoutNone, id]
    );
  };

  const togglePain = (id: string) => {
    if (form.pain_points.includes(id)) {
      update(
        "pain_points",
        form.pain_points.filter((pain) => pain !== id)
      );
      return;
    }
    if (form.pain_points.length >= 3) return;
    update("pain_points", [...form.pain_points, id]);
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await createAssessment({ ...form, language: lang });
      try {
        sessionStorage.setItem(
          `ia_day0_result_${response.public_id}`,
          JSON.stringify(response.result)
        );
      } catch {
        /* sessionStorage may be unavailable; the results page refetches */
      }
      router.push(`/results/${response.public_id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t("err.generic"));
      setSubmitting(false);
    }
  };

  const summary = useMemo(
    () => [
      { step: 1, label: t("field.company"), value: form.company_name },
      { step: 1, label: t("field.contact"), value: form.contact_name },
      { step: 1, label: t("field.email"), value: form.email },
      {
        step: 1,
        label: t("field.sector"),
        value: form.sector ? t(`opt.sector.${form.sector}`) : "—",
      },
      {
        step: 1,
        label: t("field.employees"),
        value: form.employees ? t(`opt.employees.${form.employees}`) : "—",
      },
      {
        step: 2,
        label: t("field.tools"),
        value:
          form.tools.length > 0
            ? form.tools.map((tool) => t(`opt.tools.${tool}`)).join(" · ")
            : "—",
      },
      {
        step: 2,
        label: t("field.centralization"),
        value: `${form.data_centralization}/5`,
      },
      { step: 2, label: t("field.quality"), value: `${form.data_quality}/5` },
      {
        step: 3,
        label: t("field.pains"),
        value:
          form.pain_points.length > 0
            ? form.pain_points.map((pain) => t(`opt.pains.${pain}`)).join(" · ")
            : "—",
      },
      { step: 3, label: t("field.severity"), value: `${form.pain_severity}/5` },
      {
        step: 4,
        label: t("field.budget"),
        value: t(`opt.budget.${form.budget}`),
      },
      {
        step: 4,
        label: t("field.confidentiality"),
        value: t(`opt.confidentiality.${form.confidentiality}`),
      },
      {
        step: 4,
        label: t("field.maturity"),
        value: t(`opt.maturity.${form.ai_maturity}`),
      },
      {
        step: 4,
        label: t("field.literacy"),
        value: `${form.digital_literacy}/5`,
      },
      {
        step: 4,
        label: t("field.urgency"),
        value: t(`opt.urgency.${form.urgency}`),
      },
    ],
    [form, t]
  );

  const steps = [t("step.1"), t("step.2"), t("step.3"), t("step.4"), t("step.5")];

  return (
    <section id="assessment" className="container-page scroll-mt-24 py-16">
      <div ref={topRef} className="scroll-mt-24" />
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <p className="section-kicker">{t("hero.kicker")}</p>
          <h2 className="section-title">{t("wizard.title")}</h2>
          <p className="mt-2 text-sm text-slate-400">{t("wizard.subtitle")}</p>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-white/10 px-6 pt-6 sm:px-8">
            <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
              <span>
                {t("wizard.step")} {step} {t("wizard.of")} 5
              </span>
              <span className="hidden sm:block">{steps[step - 1]}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
            <div className="mt-4 flex justify-between gap-1 pb-4">
              {steps.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => index + 1 < step && goTo(index + 1)}
                  className={`hidden flex-1 text-left text-[11px] transition sm:block ${
                    index + 1 === step
                      ? "font-semibold text-accent"
                      : index + 1 < step
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-600"
                  }`}
                >
                  {index + 1}. {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {step === 1 && (
              <div className="space-y-5 animate-fade-up">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="company_name">
                      {t("field.company")}
                    </label>
                    <input
                      id="company_name"
                      className="input"
                      value={form.company_name}
                      onChange={(event) =>
                        update("company_name", event.target.value)
                      }
                      placeholder="Acme S.r.l."
                      autoComplete="organization"
                    />
                    {errors.company_name && (
                      <p className="mt-1.5 text-xs text-rose-400">
                        {errors.company_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label" htmlFor="contact_name">
                      {t("field.contact")}
                    </label>
                    <input
                      id="contact_name"
                      className="input"
                      value={form.contact_name}
                      onChange={(event) =>
                        update("contact_name", event.target.value)
                      }
                      placeholder="Laura Gómez"
                      autoComplete="name"
                    />
                    {errors.contact_name && (
                      <p className="mt-1.5 text-xs text-rose-400">
                        {errors.contact_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label" htmlFor="email">
                      {t("field.email")}
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="input"
                      value={form.email}
                      onChange={(event) => update("email", event.target.value)}
                      placeholder="laura@acme.com"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="label" htmlFor="phone">
                      {t("field.phone")}
                    </label>
                    <input
                      id="phone"
                      className="input"
                      value={form.phone}
                      onChange={(event) => update("phone", event.target.value)}
                      placeholder="+39 352 000 0000"
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="sector">
                      {t("field.sector")}
                    </label>
                    <select
                      id="sector"
                      className="input"
                      value={form.sector}
                      onChange={(event) => update("sector", event.target.value)}
                    >
                      <option value="">—</option>
                      {SECTORS.map((sector) => (
                        <option key={sector} value={sector}>
                          {t(`opt.sector.${sector}`)}
                        </option>
                      ))}
                    </select>
                    {errors.sector && (
                      <p className="mt-1.5 text-xs text-rose-400">{errors.sector}</p>
                    )}
                  </div>
                  <div>
                    <label className="label" htmlFor="employees">
                      {t("field.employees")}
                    </label>
                    <select
                      id="employees"
                      className="input"
                      value={form.employees}
                      onChange={(event) => update("employees", event.target.value)}
                    >
                      <option value="">—</option>
                      {EMPLOYEES.map((size) => (
                        <option key={size} value={size}>
                          {t(`opt.employees.${size}`)}
                        </option>
                      ))}
                    </select>
                    {errors.employees && (
                      <p className="mt-1.5 text-xs text-rose-400">
                        {errors.employees}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-7 animate-fade-up">
                <div>
                  <p className="label">{t("field.tools")}</p>
                  <p className="mb-3 text-xs text-slate-500">{t("hint.tools")}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {TOOLS.map((tool) => {
                      const active = form.tools.includes(tool);
                      return (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => toggleTool(tool)}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                            active
                              ? "border-accent/60 bg-accent/10 text-white"
                              : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/25"
                          }`}
                          aria-pressed={active}
                        >
                          <span
                            className={`grid h-4 w-4 place-items-center rounded border text-[10px] ${
                              active
                                ? "border-accent bg-accent text-ink"
                                : "border-white/25"
                            }`}
                          >
                            {active ? "✓" : ""}
                          </span>
                          {t(`opt.tools.${tool}`)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="label">{t("field.centralization")}</p>
                  <Scale
                    value={form.data_centralization}
                    onChange={(value) => update("data_centralization", value)}
                    low={t("scale.silos")}
                    high={t("scale.unified")}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    {t("hint.centralization")}
                  </p>
                </div>

                <div>
                  <p className="label">{t("field.quality")}</p>
                  <Scale
                    value={form.data_quality}
                    onChange={(value) => update("data_quality", value)}
                    low={t("scale.poor")}
                    high={t("scale.excellent")}
                  />
                  <p className="mt-2 text-xs text-slate-500">{t("hint.quality")}</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-7 animate-fade-up">
                <div>
                  <div className="flex items-baseline justify-between">
                    <p className="label">{t("field.pains")}</p>
                    <span className="text-xs text-slate-500">
                      {form.pain_points.length}/3
                    </span>
                  </div>
                  <p className="mb-3 text-xs text-slate-500">{t("hint.pains")}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {PAINS.map((pain) => {
                      const active = form.pain_points.includes(pain);
                      const disabled =
                        !active && form.pain_points.length >= 3;
                      return (
                        <button
                          key={pain}
                          type="button"
                          disabled={disabled}
                          onClick={() => togglePain(pain)}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                            active
                              ? "border-accent/60 bg-accent/10 text-white"
                              : disabled
                                ? "cursor-not-allowed border-white/5 bg-white/[0.01] text-slate-600"
                                : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/25"
                          }`}
                          aria-pressed={active}
                        >
                          <span
                            className={`grid h-4 w-4 place-items-center rounded border text-[10px] ${
                              active
                                ? "border-accent bg-accent text-ink"
                                : "border-white/25"
                            }`}
                          >
                            {active ? "✓" : ""}
                          </span>
                          {t(`opt.pains.${pain}`)}
                        </button>
                      );
                    })}
                  </div>
                  {errors.pain_points && (
                    <p className="mt-2 text-xs text-rose-400">
                      {errors.pain_points}
                    </p>
                  )}
                </div>

                <div>
                  <p className="label">
                    {t("field.severity")}: {form.pain_severity}/5
                  </p>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={form.pain_severity}
                    onChange={(event) =>
                      update("pain_severity", Number(event.target.value))
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                    <span>{t("scale.low")}</span>
                    <span>{t("scale.high")}</span>
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="notes">
                    {t("field.notes")}
                  </label>
                  <textarea
                    id="notes"
                    className="input min-h-24 resize-y"
                    value={form.notes}
                    onChange={(event) => update("notes", event.target.value)}
                    placeholder={t("hint.notes")}
                    maxLength={2000}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="grid gap-6 animate-fade-up sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="budget">
                    {t("field.budget")}
                  </label>
                  <select
                    id="budget"
                    className="input"
                    value={form.budget}
                    onChange={(event) => update("budget", event.target.value)}
                  >
                    {BUDGETS.map((budget) => (
                      <option key={budget} value={budget}>
                        {t(`opt.budget.${budget}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="confidentiality">
                    {t("field.confidentiality")}
                  </label>
                  <select
                    id="confidentiality"
                    className="input"
                    value={form.confidentiality}
                    onChange={(event) =>
                      update("confidentiality", event.target.value)
                    }
                  >
                    {CONFIDENTIALITY.map((item) => (
                      <option key={item} value={item}>
                        {t(`opt.confidentiality.${item}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="ai_maturity">
                    {t("field.maturity")}
                  </label>
                  <select
                    id="ai_maturity"
                    className="input"
                    value={form.ai_maturity}
                    onChange={(event) =>
                      update("ai_maturity", event.target.value)
                    }
                  >
                    {MATURITY.map((item) => (
                      <option key={item} value={item}>
                        {t(`opt.maturity.${item}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="urgency">
                    {t("field.urgency")}
                  </label>
                  <select
                    id="urgency"
                    className="input"
                    value={form.urgency}
                    onChange={(event) => update("urgency", event.target.value)}
                  >
                    {URGENCIES.map((item) => (
                      <option key={item} value={item}>
                        {t(`opt.urgency.${item}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <p className="label">{t("field.literacy")}</p>
                  <Scale
                    value={form.digital_literacy}
                    onChange={(value) => update("digital_literacy", value)}
                    low={t("scale.basic")}
                    high={t("scale.advanced")}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    {t("hint.literacy")}
                  </p>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="animate-fade-up">
                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-white">
                    {t("review.title")}
                  </h3>
                  <p className="text-sm text-slate-400">{t("review.subtitle")}</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {summary.map((item) => (
                    <div
                      key={`${item.step}-${item.label}`}
                      className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                          {item.label}
                        </p>
                        <button
                          type="button"
                          onClick={() => goTo(item.step)}
                          className="text-[11px] font-medium text-accent hover:underline"
                        >
                          {t("review.edit")}
                        </button>
                      </div>
                      <p className="mt-1 break-words text-sm text-slate-200">
                        {item.value || "—"}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-xs leading-relaxed text-slate-500">
                  {t("review.consent")}
                </p>
                {submitError && (
                  <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                    {submitError}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={back}
                disabled={step === 1 || submitting}
                className="btn-ghost disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t("wizard.back")}
              </button>

              {step < 5 ? (
                <button type="button" onClick={next} className="btn-primary">
                  {t("wizard.next")}
                  <span aria-hidden>→</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={submitting}
                  className="btn-primary"
                >
                  {submitting ? t("wizard.submitting") : t("wizard.submit")}
                  {!submitting && <span aria-hidden>→</span>}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">{t("hero.note")}</p>
      </div>
    </section>
  );
}
