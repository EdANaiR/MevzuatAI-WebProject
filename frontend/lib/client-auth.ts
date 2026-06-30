/** Tarayicida kayitli JWT (auth-context ile ayni anahtar) */

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("mevzuat_user");
    if (!raw) return null;
    const data = JSON.parse(raw) as { token?: string };
    return data.token ?? null;
  } catch {
    return null;
  }
}

export function getAuthHeaders(
  options?: { json?: boolean; extra?: HeadersInit },
): Record<string, string> {
  const token = getStoredToken();
  const headers: Record<string, string> = {};

  if (options?.json !== false) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options?.extra) {
    const h = new Headers(options.extra);
    h.forEach((value, key) => {
      headers[key] = value;
    });
  }

  return headers;
}
