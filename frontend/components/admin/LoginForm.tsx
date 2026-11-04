"use client";

import { useState } from "react";
import Link from "next/link";
import { adminLogin } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

export default function LoginForm({
  onSuccess,
}: {
  onSuccess: (token: string) => void;
}) {
  const { t } = useI18n();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await adminLogin(username.trim(), password);
      onSuccess(response.access_token);
    } catch {
      setError(t("err.login"));
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-black text-ink">
              IA
            </span>
            <div>
              <h1 className="text-lg font-bold text-white">
                {t("admin.login.title")}
              </h1>
              <p className="text-xs text-slate-400">
                {t("admin.login.subtitle")}
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label" htmlFor="username">
                {t("admin.user")}
              </label>
              <input
                id="username"
                className="input"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                {t("admin.password")}
              </label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full"
            >
              {submitting ? t("admin.submitting") : t("admin.submit")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 transition hover:text-white"
            >
              ← {t("admin.back")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
