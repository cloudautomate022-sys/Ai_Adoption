"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import type { Result, Scores } from "@/lib/types";
import RadarChart from "./RadarChart";

const CONTACT = {
  website: "https://cloudautomate022-sys.github.io/Cloudautomate/",
  phone: "+39 352 044 3750",
  email: "cloudautomate022@gmail.com",
};

const SCORE_KEYS: (keyof Scores)[] = [
  "data_maturity",
  "digital_infrastructure",
  "ai_readiness",
  "change_readiness",
  "pain_intensity",
  "budget_capacity",
  "compliance_risk",
];

const HEALTH_STYLES = {
  red: {
    box: "border-rose-500/30 bg-rose-500/[0.08]",
    dot: "bg-rose-400",
    text: "text-rose-200",
  },
  amber: {
    box: "border-amber-500/30 bg-amber-500/[0.08]",
    dot: "bg-amber-400",
    text: "text-amber-200",
  },
  green: {
    box: "border-emerald-500/30 bg-emerald-500/[0.08]",
    dot: "bg-emerald-400",
    text: "text-emerald-200",
  },
};

function barColor(value: number, invert = false): string {
  const effective = invert ? 100 - value : value;
  if (effective >= 70) return "from-emerald-400 to-teal-400";
  if (effective >= 40) return "from-amber-400 to-orange-400";
  return "from-rose-500 to-red-500";
}

export default function ReportView({
  result,
  actions,
}: {
  result: Result;
  actions?: ReactNode;
}) {
  const { t } = useI18n();
  const scores = result.scores;
  const health = HEALTH_STYLES[result.data_health.level];

  return (
    <div className="space-y-8">
      {/* Overall score */}
      <div className="card overflow-hidden">
        <div className="border-b border-white/10 bg-gradient-to-r from-cyan-500/[0.08] to-indigo-500/[0.08] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {t("results.overall")}
              </p>
              <div className="mt-1 flex items-end gap-3">
                <span className="text-6xl font-black leading-none text-white">
                  {scores.overall}
                </span>
                <span className="mb-1.5 text-lg text-slate-500">/100</span>
                <span className="mb-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-slate-200">
                  {t("results.grade")} {result.grade}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="chip">{result.strategy_label}</span>
              {actions}
            </div>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-300">
            {result.summary}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip">{result.profile.sector_label}</span>
            <span className="chip">
              {result.profile.employees} · {t("field.employees")}
            </span>
            <span className="chip">{result.profile.budget_label}</span>
            <span className="chip">{result.profile.confidentiality_label}</span>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_340px]">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">
              {t("results.scoresTitle")}
            </h3>
            <div className="space-y-4">
              {SCORE_KEYS.map((key) => {
                const value = scores[key];
                return (
                  <div key={key}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-slate-300">{t(`score.${key}`)}</span>
                      <span className="font-semibold text-slate-400">{value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${barColor(
                          value,
                          key === "compliance_risk"
                        )}`}
                        style={{ width: `${Math.max(2, value)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <RadarChart scores={scores} />
          </div>
        </div>
      </div>

      {/* Data health */}
      <div className={`rounded-2xl border p-6 ${health.box}`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${health.dot}`} />
          <h3 className={`text-base font-semibold ${health.text}`}>
            {result.data_health.title}
          </h3>
          <span className="ml-auto chip">
            {result.data_health.score}/100
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          {result.data_health.message}
        </p>
        <p className={`mt-3 text-sm font-medium italic ${health.text}`}>
          “{result.data_health.quote}”
        </p>
      </div>

      {/* Strategy */}
      <section>
        <h2 className="section-title text-xl">{t("results.strategy")}</h2>
        <div className="card mt-3 p-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-lg font-semibold text-white">
                {result.strategy_label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {result.strategy_desc}
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: t("results.fitPeople"), value: result.fit.people, color: "from-cyan-400 to-sky-400" },
                { label: t("results.fitSystems"), value: result.fit.systems, color: "from-indigo-400 to-violet-400" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-xs text-slate-400">
                    <span>{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                      style={{ width: `${Math.max(2, item.value)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section>
        <h2 className="section-title text-xl">{t("section.tech")}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {result.tech_stack.map((tool, index) => (
            <div key={tool.id} className="card card-hover p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-accent/25 bg-accent/10 text-xs font-bold text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{tool.name}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                    {tool.why}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pilot */}
      <section>
        <h2 className="section-title text-xl">{t("section.pilot")}</h2>
        <div className="card mt-3 overflow-hidden border-accent/20">
          <div className="border-b border-white/10 bg-accent/[0.06] p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip border-accent/30 text-accent">
                {result.pilot.duration}
              </span>
              <span className="chip">{result.pilot.risk}</span>
              <span className="chip border-emerald-400/30 text-emerald-300">
                {t("results.internal")}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              {result.pilot.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {result.pilot.description}
            </p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                {t("results.pilotMetric")}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-200">
                {result.pilot.metric}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                {t("results.baseline")}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-200">
                {result.pilot.baseline}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                {t("results.target")}
              </p>
              <p className="mt-1 text-sm font-medium text-emerald-300">
                {result.pilot.target}
              </p>
            </div>
          </div>
          <p className="border-t border-white/10 px-6 py-4 text-xs text-slate-500">
            {result.pilot.note}
          </p>
        </div>
      </section>

      {/* Change plan */}
      <section>
        <h2 className="section-title text-xl">{t("section.change")}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {result.change_plan.map((item, index) => (
            <div key={item.title} className="card p-5">
              <div className="flex items-start gap-3">
                <span className="text-sm font-black text-accent/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <h2 className="section-title text-xl">{t("section.roadmap")}</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {result.roadmap.map((phase, index) => (
            <div key={phase.title} className="card p-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-sm font-semibold text-white">
                {phase.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {phase.actions.map((action) => (
                  <li key={action} className="flex gap-2 text-xs leading-relaxed text-slate-400">
                    <span className="mt-0.5 text-accent">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Quick wins and risks */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-base font-semibold text-white">
            {t("results.quick")}
          </h2>
          <ul className="mt-4 space-y-3">
            {result.quick_wins.map((win) => (
              <li key={win} className="flex gap-2 text-sm text-slate-300">
                <span className="text-emerald-400">✓</span>
                <span>{win}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-base font-semibold text-white">
            {t("results.risks")}
          </h2>
          <ul className="mt-4 space-y-3">
            {result.risks.map((risk) => (
              <li key={risk.title}>
                <p className="text-sm font-medium text-amber-200">{risk.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                  {risk.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-indigo-500/10 to-transparent p-6 sm:p-8">
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {t("results.cta")}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {result.cta.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
            {result.cta.body}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(
                "IA-Day-0 · " + result.profile.company_name
              )}`}
              className="btn-primary"
            >
              {result.cta.button}
              <span aria-hidden>→</span>
            </a>
            <a
              href={CONTACT.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              {t("footer.website")}
            </a>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400">
            <span>Call: {CONTACT.phone}</span>
            <span>Email: {CONTACT.email}</span>
            <span className="break-all">{CONTACT.website}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
