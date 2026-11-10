"use client";

import { useEffect, useMemo, useState } from "react";
import {
  clearStoredApiUrl,
  getAutomaticApiUrl,
  getStoredApiUrl,
  isValidApiUrl,
  normalizeApiUrl,
  setStoredApiUrl,
  testApiConnection,
} from "@/lib/api";
import { useI18n } from "@/lib/i18n";

type Status = "idle" | "testing" | "ok" | "error";
type Mode = "automatic" | "custom";

export default function BackendSettings({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<Mode>("automatic");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const automaticUrl = useMemo(() => getAutomaticApiUrl(), [open]);

  useEffect(() => {
    if (!open) return;
    const stored = getStoredApiUrl();
    setMode(stored ? "custom" : "automatic");
    setUrl(stored || getAutomaticApiUrl());
    setStatus("idle");
    setMessage("");
    setSaving(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const validate = (): boolean => {
    if (!isValidApiUrl(url)) {
      setStatus("error");
      setMessage(t("api.invalid"));
      return false;
    }
    return true;
  };

  const test = async () => {
    if (!validate()) return;
    setStatus("testing");
    setMessage(t("api.testing"));
    try {
      const info = await testApiConnection(url);
      setStatus("ok");
      setMessage(
        `${t("api.success")}${info.service ? ` · ${info.service}` : ""}${
          info.version ? ` ${info.version}` : ""
        }`
      );
    } catch {
      setStatus("error");
      setMessage(t("api.error"));
    }
  };

  const save = () => {
    if (!validate()) return;
    setSaving(true);
    try {
      setStoredApiUrl(url);
      setMessage(t("api.saved"));
      window.setTimeout(() => window.location.reload(), 500);
    } catch {
      setSaving(false);
      setStatus("error");
      setMessage(t("api.invalid"));
    }
  };

  const reset = () => {
    clearStoredApiUrl();
    setStatus("idle");
    setMessage(t("api.saved"));
    window.setTimeout(() => window.location.reload(), 400);
  };

  const statusColor =
    status === "ok"
      ? "border-success/30 bg-success/10 text-success"
      : status === "error"
        ? "border-danger/30 bg-danger/10 text-danger"
        : "border-line/10 bg-recessed text-muted";

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="backend-settings-title"
        className="w-full max-w-lg rounded-2xl border border-line/10 bg-surface p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="backend-settings-title" className="text-lg font-bold text-fg">
              {t("api.title")}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {t("api.subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line/10 text-muted transition hover:border-line/30 hover:text-fg"
            aria-label={t("common.close")}
            title={t("common.close")}
          >
            ✕
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-line/10 bg-recessed px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">
            {t("api.current")}
          </p>
          <p className="mt-1 break-all font-mono text-xs text-fg">
            {mode === "custom" ? normalizeApiUrl(url) : automaticUrl}
          </p>
          <p className="mt-1 text-[11px] text-muted">
            {mode === "custom" ? t("api.customActive") : t("api.automatic")}
          </p>
        </div>

        <div className="mt-5">
          <label className="label" htmlFor="backend-url">
            {t("api.url")}
          </label>
          <input
            id="backend-url"
            className="input font-mono text-sm"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setMode("custom");
              setStatus("idle");
              setMessage("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void test();
              }
            }}
            placeholder={t("api.placeholder")}
            inputMode="url"
            spellCheck={false}
            autoComplete="off"
          />
          <p className="mt-1.5 text-[11px] text-muted">{t("api.hint")}</p>
        </div>

        {message && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-xs leading-relaxed ${statusColor}`}
            role="status"
          >
            {message}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={test}
            className="btn-ghost !px-4 !py-2.5"
            disabled={status === "testing" || saving}
          >
            {status === "testing" ? t("api.testing") : t("api.test")}
          </button>
          <button
            type="button"
            onClick={save}
            className="btn-primary !px-4 !py-2.5"
            disabled={saving}
          >
            {saving ? t("api.saving") : t("api.save")}
          </button>
          {mode === "custom" && (
            <button
              type="button"
              onClick={reset}
              className="ml-auto text-xs font-semibold text-muted underline-offset-4 transition hover:text-fg hover:underline"
            >
              {t("api.reset")}
            </button>
          )}
        </div>

        <p className="mt-4 text-[10px] leading-relaxed text-faint">
          {t("api.localOnly")}
        </p>
      </div>
    </div>
  );
}
