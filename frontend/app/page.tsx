"use client";

import { useI18n } from "@/lib/i18n";
import Wizard from "@/components/Wizard";

const FEATURES = [
  { icon: "◎", title: "f1.title", desc: "f1.desc" },
  { icon: "◇", title: "f2.title", desc: "f2.desc" },
  { icon: "◈", title: "f3.title", desc: "f3.desc" },
  { icon: "◉", title: "f4.title", desc: "f4.desc" },
];

const METHOD = [
  { step: "01", title: "m1.title", desc: "m1.desc" },
  { step: "02", title: "m2.title", desc: "m2.desc" },
  { step: "03", title: "m3.title", desc: "m3.desc" },
  { step: "04", title: "m4.title", desc: "m4.desc" },
];

const PREVIEW = [
  { label: "Data", value: 72 },
  { label: "Infra", value: 64 },
  { label: "AI", value: 58 },
  { label: "Change", value: 70 },
];

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="animate-fade-up">
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t("hero.kicker")}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">
              {t("hero.title1")}{" "}
              <span className="text-gradient">{t("hero.title2")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#assessment" className="btn-primary">
                {t("hero.cta")}
                <span aria-hidden>→</span>
              </a>
              <a href="#method" className="btn-ghost">
                {t("hero.secondary")}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="chip">{t("hero.stat1")}</span>
              <span className="chip">{t("hero.stat2")}</span>
              <span className="chip">{t("hero.stat3")}</span>
            </div>
            <p className="mt-3 text-xs text-faint">{t("hero.note")}</p>
          </div>

          <div className="relative animate-float">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 blur-2xl" />
            <div className="card grid-lines rounded-3xl p-6 shadow-2xl shadow-black/40">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">
                    IA-Day-0 Index
                  </p>
                  <p className="mt-1 text-5xl font-black text-fg">
                    72<span className="text-lg font-medium text-faint">/100</span>
                  </p>
                </div>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-success">
                  Grade B
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {PREVIEW.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-[11px] text-muted">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-fg/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-line/10 bg-recessed p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                  Strategy
                </p>
                <p className="mt-1 text-sm font-semibold text-fg">
                  Hybrid · People first, Systems next
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Internal productivity pilot in 4 weeks. No customer-facing exposure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="max-w-2xl">
          <p className="section-kicker">IA-Day-0</p>
          <h2 className="section-title">{t("features.title")}</h2>
          <p className="mt-3 prose-muted">{t("features.subtitle")}</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="card card-hover p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-line/10 bg-fg/[0.04] text-lg text-accent">
                {feature.icon}
              </span>
              <h3 className="mt-4 text-sm font-semibold text-fg">
                {t(feature.title)}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {t(feature.desc)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="method" className="container-page scroll-mt-24 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="section-kicker">Method</p>
            <h2 className="section-title">{t("method.title")}</h2>
            <p className="mt-3 prose-muted">{t("method.subtitle")}</p>

            <div className="mt-6 rounded-2xl border border-line/10 bg-gradient-to-br from-fg/[0.05] to-transparent p-5">
              <h3 className="text-base font-semibold text-fg">
                {t("why.title")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t("why.body")}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-fg/80">
                {["why.p1", "why.p2", "why.p3"].map((key) => (
                  <li key={key} className="flex gap-2">
                    <span className="mt-0.5 text-accent">✓</span>
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="absolute bottom-2 left-5 top-2 w-px bg-gradient-to-b from-cyan-400/60 via-indigo-400/40 to-transparent" />
            <div className="space-y-4">
              {METHOD.map((item) => (
                <div key={item.step} className="relative flex gap-4 pl-0">
                  <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line/15 bg-surface text-xs font-bold text-accent">
                    {item.step}
                  </span>
                  <div className="card card-hover flex-1 p-5">
                    <h3 className="text-sm font-semibold text-fg">
                      {t(item.title)}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {t(item.desc)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Wizard />
    </>
  );
}
