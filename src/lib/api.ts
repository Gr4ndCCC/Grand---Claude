const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export function getToken(): string | null {
  return localStorage.getItem('ember_token');
}

export function setToken(token: string): void {
  localStorage.setItem('ember_token', token);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem('ember_refresh_token', token);
}

export function clearTokens(): void {
  localStorage.removeItem('ember_token');
  localStorage.removeItem('ember_refresh_token');
}

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const token = getToken();
    const { body, method = 'GET', headers = {} } = options;

    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return { data: null, error: json.error ?? `HTTP ${res.status}` };
    }

    return { data: json as T, error: null };
  } catch {
    return { data: null, error: 'Network error' };
  }
}
