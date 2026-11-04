"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TOKEN_KEY } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import LeadDetailView from "@/components/admin/LeadDetailView";

export default function AdminLeadPage() {
  const params = useParams<{ id: string }>();
  const id = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const router = useRouter();
  const { t } = useI18n();
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      router.replace("/admin");
      return;
    }
    setToken(stored);
    setReady(true);
  }, [router]);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  if (!ready || !token || Number.isNaN(id)) {
    return (
      <div className="container-page py-24 text-center text-sm text-slate-400">
        {t("admin.loading")}
      </div>
    );
  }

  return <LeadDetailView token={token} id={id} onLogout={logout} />;
}
