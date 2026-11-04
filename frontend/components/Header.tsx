"use client";

import Link from "next/link";
import { LANGS, useI18n } from "@/lib/i18n";

export default function Header() {
  const { t, lang, setLang } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-black text-ink shadow-lg shadow-cyan-500/20">
            IA
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight text-white">
              IA-Day-0
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
              {t("brand.tagline")}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="/#assessment" className="transition hover:text-white">
            {t("nav.assessment")}
          </a>
          <a href="/#method" className="transition hover:text-white">
            {t("nav.method")}
          </a>
          <Link href="/admin" className="transition hover:text-white">
            {t("nav.admin")}
          </Link>
        </nav>

        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
          {LANGS.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => setLang(item.code)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                lang === item.code
                  ? "bg-white text-ink"
                  : "text-slate-400 hover:text-white"
              }`}
              aria-label={item.label}
            >
              {item.short}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
