"use client";

import { useCallback, useEffect, useState } from "react";
import { TOKEN_KEY } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import LoginForm from "@/components/admin/LoginForm";
import Dashboard from "@/components/admin/Dashboard";

export default function AdminPage() {
  const { t } = useI18n();
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(window.localStorage.getItem(TOKEN_KEY));
    setReady(true);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const login = useCallback((next: string) => {
    window.localStorage.setItem(TOKEN_KEY, next);
    setToken(next);
  }, []);

  if (!ready) {
    return (
      <div className="container-page py-24 text-center text-sm text-slate-400">
        {t("admin.loading")}
      </div>
    );
  }

  return token ? (
    <Dashboard token={token} onLogout={logout} />
  ) : (
    <LoginForm onSuccess={login} />
  );
}
