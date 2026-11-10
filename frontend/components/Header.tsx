"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAutomaticApiUrl, getStoredApiUrl } from "@/lib/api";
import { LANGS, useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import BackendSettings from "./BackendSettings";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="6" rx="2" />
      <rect x="3" y="14" width="18" height="6" rx="2" />
      <path d="M7 7h.01M7 17h.01" />
    </svg>
  );
}

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const themeLabel = theme === "dark" ? t("theme.light") : t("theme.dark");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hasCustomApi, setHasCustomApi] = useState(false);
  const [showBackendHint, setShowBackendHint] = useState(false);

  useEffect(() => {
    setHasCustomApi(Boolean(getStoredApiUrl()));
    const apiUrl = getStoredApiUrl() || getAutomaticApiUrl();
    const apiIsLocal = /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(apiUrl);
    const pageIsLocal = /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
    setShowBackendHint(apiIsLocal && !pageIsLocal);
  }, [settingsOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line/10 bg-canvas/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-black text-ink shadow-lg shadow-cyan-500/20">
            IA
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight text-fg">
              IA-Day-0
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
              {t("brand.tagline")}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-fg/80 md:flex">
          <a href="/#assessment" className="transition hover:text-fg">
            {t("nav.assessment")}
          </a>
          <a href="/#method" className="transition hover:text-fg">
            {t("nav.method")}
          </a>
          <Link href="/admin" className="transition hover:text-fg">
            {t("nav.admin")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-line/10 bg-fg/[0.04] p-1">
            {LANGS.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setLang(item.code)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                  lang === item.code
                    ? "bg-fg text-canvas"
                    : "text-muted hover:text-fg"
                }`}
                aria-label={item.label}
              >
                {item.short}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="flex h-8 items-center gap-1.5 rounded-full border border-line/10 bg-fg/[0.04] px-2.5 text-fg/70 transition hover:border-line/25 hover:text-fg"
            aria-label={t("api.settings")}
            title={t("api.settings")}
          >
            <ServerIcon />
            <span className="hidden text-[10px] font-bold uppercase tracking-wider sm:inline">
              API
            </span>
            {hasCustomApi && (
              <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
            )}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-8 w-8 place-items-center rounded-full border border-line/10 bg-fg/[0.04] text-fg/70 transition hover:border-line/25 hover:text-fg"
            aria-label={themeLabel}
            title={themeLabel}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>

      {showBackendHint && (
        <div className="border-t border-warning/20 bg-warning/10">
          <div className="container-page flex flex-wrap items-center justify-center gap-2 py-2 text-center text-xs text-warning">
            <span>{t("api.notConnected")}</span>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="font-semibold underline underline-offset-4"
            >
              {t("api.configureNow")}
            </button>
          </div>
        </div>
      )}
      </header>

      <BackendSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
