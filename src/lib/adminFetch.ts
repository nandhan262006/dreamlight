export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_auth");
}

export async function adminFetch(url: string, init?: RequestInit): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("x-admin-token", token);
  return fetch(url, { ...init, headers });
}
