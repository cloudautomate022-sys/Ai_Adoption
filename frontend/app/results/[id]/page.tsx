"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { downloadPublicPdf, getAssessment } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import type { Lang, Result } from "@/lib/types";
import ReportView from "@/components/ReportView";

type Meta = {
  company_name: string;
  created_at: string;
  language: Lang;
};

export default function ResultsPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { t, lang } = useI18n();

  const [result, setResult] = useState<Result | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    let cached: Result | null = null;

    try {
      const raw = sessionStorage.getItem(`ia_day0_result_${id}`);
      if (raw) {
        cached = JSON.parse(raw) as Result;
        setResult(cached);
        setStatus("ready");
      }
    } catch {
      /* ignore malformed cache */
    }

    getAssessment(id, lang)
      .then((response) => {
        if (!active) return;
        setResult(response.result);
        setMeta({
          company_name: response.company_name,
          created_at: response.created_at,
          language: response.language,
        });
        setStatus("ready");
      })
      .catch(() => {
        if (active && !cached) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [id, lang]);

  const download = async () => {
    if (!id) return;
    setDownloading(true);
    try {
      await downloadPublicPdf(id, lang);
    } catch {
      window.alert(t("common.error"));
    } finally {
      setDownloading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-3xl">
          <div className="card animate-pulse p-10">
            <div className="h-4 w-40 rounded bg-fg/10" />
            <div className="mt-6 h-16 w-64 rounded bg-fg/10" />
            <div className="mt-8 space-y-3">
              <div className="h-3 w-full rounded bg-fg/5" />
              <div className="h-3 w-5/6 rounded bg-fg/5" />
              <div className="h-3 w-4/6 rounded bg-fg/5" />
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            {t("results.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (status === "error" || !result) {
    return (
      <div className="container-page py-24">
        <div className="card mx-auto max-w-xl p-10 text-center">
          <p className="text-3xl">◎</p>
          <h1 className="mt-4 text-xl font-bold text-fg">
            {t("results.notfound")}
          </h1>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/" className="btn-primary">
              {t("results.home")}
            </Link>
            <Link href="/#assessment" className="btn-ghost">
              {t("results.new")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const reportLang = meta?.language ?? result.language;

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/"
              className="text-xs font-medium text-muted transition hover:text-fg"
            >
              ← {t("results.home")}
            </Link>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
              {result.profile.company_name}
            </h1>
            <p className="mt-1 text-xs text-faint">
              IA-Day-0 · {t("results.grade")} {result.grade} ·{" "}
              {meta
                ? new Date(meta.created_at).toLocaleDateString()
                : new Date(result.generated_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="chip uppercase">{reportLang}</span>
            <button
              type="button"
              onClick={download}
              disabled={downloading}
              className="btn-primary"
            >
              {downloading ? t("admin.loading") : t("results.download")}
              {!downloading && <span aria-hidden>↓</span>}
            </button>
            <Link href="/#assessment" className="btn-ghost">
              {t("results.new")}
            </Link>
          </div>
        </div>

        <ReportView result={result} />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line/10 pt-6 text-xs text-faint">
          <span>IA-Day-0 Assessment Engine · By Cloud Automate</span>
          <Link href="/" className="transition hover:text-fg">
            {t("results.home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
