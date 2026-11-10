import type {
  AssessmentPayload,
  AssessmentResponse,
  Lang,
  LeadDetail,
  LeadList,
  Stats,
} from "./types";

declare global {
  interface Window {
    __IA_DAY0_CONFIG__?: { apiUrl?: string };
  }
}

export const TOKEN_KEY = "ia_day0_admin_token";
export const API_URL_STORAGE_KEY = "ia_day0_api_url";

/** Add a scheme when the host comes without one and strip trailing slashes. */
export function normalizeApiUrl(value: string): string {
  const clean = value.trim().replace(/\/+$/, "");
  if (!clean) return "";
  if (/^https?:\/\//i.test(clean)) return clean;
  return /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(clean)
    ? `http://${clean}`
    : `https://${clean}`;
}

export function isValidApiUrl(value: string): boolean {
  try {
    const parsed = new URL(normalizeApiUrl(value));
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      Boolean(parsed.hostname)
    );
  } catch {
    return false;
  }
}

/** URL saved graphically from the browser settings panel (no secrets). */
export function getStoredApiUrl(): string {
  if (typeof window === "undefined") return "";
  try {
    const stored = window.localStorage.getItem(API_URL_STORAGE_KEY) ?? "";
    return isValidApiUrl(stored) ? normalizeApiUrl(stored) : "";
  } catch {
    return "";
  }
}

export function setStoredApiUrl(value: string): string {
  if (!isValidApiUrl(value)) throw new Error("Invalid backend URL");
  const normalized = normalizeApiUrl(value);
  window.localStorage.setItem(API_URL_STORAGE_KEY, normalized);
  return normalized;
}

export function clearStoredApiUrl(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(API_URL_STORAGE_KEY);
  } catch {
    /* ignore unavailable storage */
  }
}

/**
 * Backend URL configured by the deployment (runtime injection or build env),
 * ignoring any browser override. Useful for showing the automatic value.
 */
export function getAutomaticApiUrl(): string {
  const runtimeUrl =
    typeof window !== "undefined" ? window.__IA_DAY0_CONFIG__?.apiUrl : undefined;
  const configured =
    runtimeUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const clean = normalizeApiUrl(configured);
  return clean || "http://localhost:8000";
}

/**
 * Resolve the backend URL at runtime.
 *
 * Priority:
 * 1. Browser override saved from the graphical settings panel (localStorage).
 * 2. `window.__IA_DAY0_CONFIG__.apiUrl` injected by the server layout
 *    (`API_URL` environment variable, read at runtime — no rebuild needed).
 * 3. `NEXT_PUBLIC_API_URL` (baked in at build time, useful for static hosts).
 * 4. Local development default.
 *
 * Render/Vercel sometimes expose only a hostname (`my-api.onrender.com`), so
 * we add the right scheme automatically and strip trailing slashes.
 */
export function getApiUrl(): string {
  const storedUrl = getStoredApiUrl();
  return storedUrl || getAutomaticApiUrl();
}

/** Ping `/api/health` on an arbitrary backend URL. */
export async function testApiConnection(
  value: string
): Promise<{ service?: string; version?: string; status?: string }> {
  const base = normalizeApiUrl(value);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${base}/api/health`, {
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()) as {
      service?: string;
      version?: string;
      status?: string;
    };
  } finally {
    clearTimeout(timer);
  }
}


async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      detail =
        typeof body.detail === "string"
          ? body.detail
          : JSON.stringify(body.detail ?? body);
    } catch {
      /* keep the status message */
    }
    throw new Error(detail);
  }
  return (await response.json()) as T;
}

export async function createAssessment(
  payload: AssessmentPayload
): Promise<{ public_id: string; result: AssessmentResponse["result"] }> {
  return request("/api/assessments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAssessment(
  publicId: string,
  lang?: Lang
): Promise<AssessmentResponse> {
  const query = lang ? `?lang=${lang}` : "";
  return request(
    `/api/assessments/${encodeURIComponent(publicId)}${query}`
  );
}

export async function adminLogin(
  username: string,
  password: string
): Promise<{ access_token: string; expires_in: number }> {
  return request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function adminStats(token: string): Promise<Stats> {
  return request("/api/admin/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminLeads(
  token: string,
  params: { search?: string; strategy?: string; language?: string; page?: number }
): Promise<LeadList> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.strategy) query.set("strategy", params.strategy);
  if (params.language) query.set("language", params.language);
  query.set("page", String(params.page ?? 1));
  query.set("page_size", "20");
  return request(`/api/admin/leads?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminLead(token: string, id: number): Promise<LeadDetail> {
  return request(`/api/admin/leads/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminDelete(token: string, id: number): Promise<void> {
  const response = await fetch(`${getApiUrl()}/api/admin/leads/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function fetchBlob(path: string, token?: string): Promise<Blob> {
  const response = await fetch(`${getApiUrl()}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.blob();
}

export async function downloadPublicPdf(publicId: string, lang: Lang) {
  const blob = await fetchBlob(
    `/api/assessments/${encodeURIComponent(publicId)}/pdf?lang=${lang}`
  );
  saveBlob(blob, `IA-Day-0-report-${lang}.pdf`);
}

export async function downloadAdminPdf(
  token: string,
  id: number,
  lang: Lang
) {
  const blob = await fetchBlob(`/api/admin/leads/${id}/pdf?lang=${lang}`, token);
  saveBlob(blob, `IA-Day-0-lead-${id}-${lang}.pdf`);
}

export async function downloadCsv(token: string) {
  const blob = await fetchBlob("/api/admin/export.csv", token);
  saveBlob(blob, "ia-day-0-leads.csv");
}
