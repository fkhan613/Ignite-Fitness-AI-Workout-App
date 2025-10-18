export function getToken(): string | null { return localStorage.getItem('token'); }
export function setToken(t: string | null) { if (t) localStorage.setItem('token', t); else localStorage.removeItem('token'); }
export function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
