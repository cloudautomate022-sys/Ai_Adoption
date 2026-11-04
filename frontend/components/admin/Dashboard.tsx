"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  adminDelete,
  adminLeads,
  adminStats,
  downloadAdminPdf,
  downloadCsv,
} from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import type { Lang, LeadList, Stats } from "@/lib/types";

const STRATEGIES = ["people", "systems", "hybrid", "foundation"] as const;
const LANGUAGES: Lang[] = ["es", "en", "it"];

const STRATEGY_STYLES: Record<string, string> = {
  people: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  systems: "border-indigo-400/30 bg-indigo-400/10 text-indigo-200",
  hybrid: "border-violet-400/30 bg-violet-400/10 text-violet-200",
  foundation: "border-amber-400/30 bg-amber-400/10 text-amber-200",
};

function scoreColor(score: number): string {
  if (score >= 70) return "text-emerald-300";
  if (score >= 40) return "text-amber-300";
  return "text-rose-300";
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

export default function Dashboard({
  token,
  onLogout,
}: {
  token: string;
  onLogout: () => void;
}) {
  const { t, lang } = useI18n();

  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<LeadList | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [strategy, setStrategy] = useState("");
  const [language, setLanguage] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    adminStats(token)
      .then((response) => {
        if (active) setStats(response);
      })
      .catch((err: Error) => {
        if (active && /401|credentials/i.test(err.message)) onLogout();
      });
    return () => {
      active = false;
    };
  }, [token, refreshKey, onLogout]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    adminLeads(token, { search, strategy, language, page })
      .then((response) => {
        if (!active) return;
        setLeads(response);
        setError("");
      })
      .catch((err: Error) => {
        if (!active) return;
        if (/401|credentials/i.test(err.message)) {
          onLogout();
          return;
        }
        setError(t("common.error"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token, search, strategy, language, page, refreshKey, onLogout, t]);

  const refresh = () => setRefreshKey((value) => value + 1);

  const remove = async (id: number) => {
    if (!window.confirm(t("admin.confirmDelete"))) return;
    setBusyId(id);
    try {
      await adminDelete(token, id);
      refresh();
    } catch {
      window.alert(t("common.error"));
    } finally {
      setBusyId(null);
    }
  };

  const downloadPdf = async (id: number) => {
    setBusyId(id);
    try {
      await downloadAdminPdf(token, id, lang);
    } catch {
      window.alert(t("common.error"));
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = async () => {
    try {
      await downloadCsv(token);
    } catch {
      window.alert(t("common.error"));
    }
  };

  const totalPages = leads ? Math.max(1, Math.ceil(leads.total / leads.page_size)) : 1;

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Admin</p>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t("admin.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-400">{t("admin.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={refresh} className="btn-ghost">
            {t("admin.refresh")}
          </button>
          <button type="button" onClick={onLogout} className="btn-ghost">
            {t("admin.logout")}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("admin.total")} value={stats?.total_leads ?? "—"} />
        <StatCard label={t("admin.last7")} value={stats?.leads_7d ?? "—"} />
        <StatCard label={t("admin.avg")} value={stats ? `${stats.avg_score}/100` : "—"} />
        <StatCard
          label={t("admin.avgData")}
          value={stats ? `${stats.avg_data_score}/100` : "—"}
        />
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 p-4">
          <input
            className="input h-10 max-w-xs flex-1 py-2"
            placeholder={t("admin.search")}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <select
            className="input h-10 w-auto py-2"
            value={strategy}
            onChange={(event) => {
              setStrategy(event.target.value);
              setPage(1);
            }}
            aria-label={t("admin.strategy")}
          >
            <option value="">{t("admin.all")} · {t("admin.strategy")}</option>
            {STRATEGIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className="input h-10 w-auto py-2"
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value);
              setPage(1);
            }}
            aria-label={t("admin.language")}
          >
            <option value="">{t("admin.all")} · {t("admin.language")}</option>
            {LANGUAGES.map((item) => (
              <option key={item} value={item}>
                {item.toUpperCase()}
              </option>
            ))}
          </select>
          <button type="button" onClick={exportCsv} className="btn-ghost ml-auto h-10 py-2">
            {t("admin.export")}
          </button>
        </div>

        {error && (
          <div className="border-b border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-white/[0.03] text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">{t("admin.company")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.contact")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.score")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.strategy")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.data")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.language")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.date")}</th>
                <th className="px-4 py-3 text-right font-semibold">
                  {t("admin.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && !leads && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                    {t("admin.loading")}
                  </td>
                </tr>
              )}
              {!loading && leads && leads.items.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                    {t("admin.noLeads")}
                  </td>
                </tr>
              )}
              {leads?.items.map((lead) => (
                <tr key={lead.id} className="transition hover:bg-white/[0.025]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium text-white hover:text-accent"
                    >
                      {lead.company_name}
                    </Link>
                    <p className="text-[11px] text-slate-500">
                      {t(`opt.sector.${lead.sector}`)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-300">{lead.contact_name}</p>
                    <p className="text-[11px] text-slate-500">{lead.email}</p>
                  </td>
                  <td className={`px-4 py-3 font-bold ${scoreColor(lead.overall_score)}`}>
                    {lead.overall_score}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                        STRATEGY_STYLES[lead.strategy] ?? "border-white/10 text-slate-300"
                      }`}
                    >
                      {lead.strategy}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{lead.data_score}</td>
                  <td className="px-4 py-3 uppercase text-slate-400">
                    {lead.language}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-white/30 hover:text-white"
                      >
                        {t("admin.view")}
                      </Link>
                      <button
                        type="button"
                        onClick={() => downloadPdf(lead.id)}
                        disabled={busyId === lead.id}
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-white/30 hover:text-white disabled:opacity-50"
                      >
                        {t("admin.pdf")}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(lead.id)}
                        disabled={busyId === lead.id}
                        className="rounded-lg border border-rose-500/20 px-2.5 py-1 text-[11px] text-rose-300 transition hover:border-rose-500/50 disabled:opacity-50"
                      >
                        {t("admin.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-xs text-slate-400">
          <span>
            {t("admin.page")} {page} / {totalPages} · {leads?.total ?? 0}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-white/10 px-3 py-1.5 transition hover:border-white/30 disabled:opacity-40"
            >
              {t("admin.prev")}
            </button>
            <button
              type="button"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-white/10 px-3 py-1.5 transition hover:border-white/30 disabled:opacity-40"
            >
              {t("admin.next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
