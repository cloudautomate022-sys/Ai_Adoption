"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  adminDelete,
  adminLead,
  downloadAdminPdf,
} from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import type { LeadDetail } from "@/lib/types";
import ReportView from "@/components/ReportView";

const ANSWER_LABELS: Record<string, string> = {
  company_name: "field.company",
  contact_name: "field.contact",
  email: "field.email",
  phone: "field.phone",
  sector: "field.sector",
  employees: "field.employees",
  tools: "field.tools",
  data_centralization: "field.centralization",
  data_quality: "field.quality",
  pain_points: "field.pains",
  pain_severity: "field.severity",
  notes: "field.notes",
  budget: "field.budget",
  confidentiality: "field.confidentiality",
  ai_maturity: "field.maturity",
  digital_literacy: "field.literacy",
  urgency: "field.urgency",
  language: "admin.language",
};

export default function LeadDetailView({
  token,
  id,
  onLogout,
}: {
  token: string;
  id: number;
  onLogout: () => void;
}) {
  const { t, lang } = useI18n();
  const router = useRouter();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    adminLead(token, id)
      .then((response) => {
        if (!active) return;
        setLead(response);
        setStatus("ready");
      })
      .catch((error: Error) => {
        if (!active) return;
        if (/401|credentials/i.test(error.message)) {
          onLogout();
          router.replace("/admin");
          return;
        }
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [token, id, onLogout, router]);

  const download = async () => {
    setBusy(true);
    try {
      await downloadAdminPdf(token, id, lang);
    } catch {
      window.alert(t("common.error"));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(t("admin.confirmDelete"))) return;
    setBusy(true);
    try {
      await adminDelete(token, id);
      router.push("/admin");
    } catch {
      window.alert(t("common.error"));
      setBusy(false);
    }
  };

  const formatAnswer = (key: string, value: unknown): string => {
    if (Array.isArray(value)) {
      if (value.length === 0) return "—";
      return value
        .map((item) =>
          key === "tools"
            ? t(`opt.tools.${item}`)
            : key === "pain_points"
              ? t(`opt.pains.${item}`)
              : String(item)
        )
        .join(" · ");
    }
    if (key === "sector") return t(`opt.sector.${value}`);
    if (key === "employees") return t(`opt.employees.${value}`);
    if (key === "budget") return t(`opt.budget.${value}`);
    if (key === "confidentiality") return t(`opt.confidentiality.${value}`);
    if (key === "ai_maturity") return t(`opt.maturity.${value}`);
    if (key === "urgency") return t(`opt.urgency.${value}`);
    if (key === "language") return String(value).toUpperCase();
    if (key === "data_centralization" || key === "data_quality" || key === "digital_literacy" || key === "pain_severity") {
      return `${value}/5`;
    }
    return value ? String(value) : "—";
  };

  if (status === "loading") {
    return (
      <div className="container-page py-24 text-center text-sm text-muted">
        {t("admin.loading")}
      </div>
    );
  }

  if (status === "error" || !lead) {
    return (
      <div className="container-page py-24">
        <div className="card mx-auto max-w-md p-8 text-center">
          <p className="text-sm text-fg/80">{t("common.error")}</p>
          <Link href="/admin" className="btn-ghost mt-4">
            {t("admin.backToDashboard")}
          </Link>
        </div>
      </div>
    );
  }

  const answers = Object.entries(lead.answers).filter(
    ([key]) => ANSWER_LABELS[key]
  );

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin"
          className="text-xs font-medium text-muted transition hover:text-fg"
        >
          ← {t("admin.backToDashboard")}
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-kicker">{t("admin.detail")}</p>
            <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
              {lead.company_name}
            </h1>
            <p className="mt-1 text-xs text-faint">
              #{lead.id} · {new Date(lead.created_at).toLocaleString()} ·{" "}
              {lead.language.toUpperCase()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={download}
              disabled={busy}
              className="btn-primary"
            >
              {t("results.download")} <span aria-hidden>↓</span>
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="btn-ghost border-rose-500/30 text-danger hover:border-rose-500/60"
            >
              {t("admin.delete")}
            </button>
          </div>
        </div>

        <div className="card mt-6 grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-faint">
              {t("admin.contact")}
            </p>
            <p className="mt-1 text-sm text-fg">{lead.contact_name}</p>
            <a
              href={`mailto:${lead.email}`}
              className="block text-xs text-accent hover:underline"
            >
              {lead.email}
            </a>
            {lead.phone && (
              <a
                href={`tel:${lead.phone.replace(/\s/g, "")}`}
                className="block text-xs text-muted"
              >
                {lead.phone}
              </a>
            )}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-faint">
              {t("admin.strategy")}
            </p>
            <p className="mt-1 text-sm text-fg">{lead.strategy}</p>
            <p className="text-xs text-muted">
              {t("admin.score")}: {lead.overall_score}/100
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-faint">
              {t("field.sector")}
            </p>
            <p className="mt-1 text-sm text-fg">
              {t(`opt.sector.${lead.sector}`)}
            </p>
            <p className="text-xs text-muted">
              {t(`opt.employees.${lead.employees}`)}
            </p>
          </div>
        </div>

        {lead.notes && (
          <div className="card mt-4 p-6">
            <p className="text-[11px] uppercase tracking-wide text-faint">
              {t("admin.notes")}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-fg/80">
              {lead.notes}
            </p>
          </div>
        )}

        <div className="card mt-4 p-6">
          <h2 className="text-sm font-semibold text-fg">
            {t("admin.answers")}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {answers.map(([key, value]) => (
              <div
                key={key}
                className="rounded-xl border border-line/10 bg-fg/[0.02] px-4 py-3"
              >
                <p className="text-[11px] uppercase tracking-wide text-faint">
                  {t(ANSWER_LABELS[key])}
                </p>
                <p className="mt-1 break-words text-sm text-fg">
                  {formatAnswer(key, value)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <ReportView result={lead.result} />
        </div>
      </div>
    </div>
  );
}
