import type {
  AssessmentPayload,
  AssessmentResponse,
  Lang,
  LeadDetail,
  LeadList,
  Stats,
} from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const TOKEN_KEY = "ia_day0_admin_token";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
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
  const response = await fetch(`${API_URL}/api/admin/leads/${id}`, {
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
  const response = await fetch(`${API_URL}${path}`, {
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
