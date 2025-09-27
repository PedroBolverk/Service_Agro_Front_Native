import { API_HOST } from '../config';

let AUTH_TOKEN: string | null = null;
export function setAuthToken(token: string | null) {
  AUTH_TOKEN = token;
}

function withTimeout<T>(p: Promise<T>, ms = 10000): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(`Timeout após ${ms}ms`)), ms);
    p.then((v) => { clearTimeout(id); resolve(v); })
     .catch((e) => { clearTimeout(id); reject(e); });
  });
}

export async function api(
  path: string,
  opts?: { method?: string; body?: any; token?: string | null }
) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = opts?.token ?? AUTH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `${API_HOST}${path}`;
  try {
    const res = await withTimeout(fetch(url, {
      method: opts?.method ?? 'GET',
      headers,
      body: opts?.body ? JSON.stringify(opts.body) : undefined,
    }), 10000);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (err: any) {
  const msg = err?.message?.includes('Timeout') ? 'Tempo esgotado ao conectar no servidor' : (err?.message || String(err));
  console.log('[API ERROR]', url, msg);
  throw new Error(msg);
}
}
