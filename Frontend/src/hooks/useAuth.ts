import { useAuthContext } from '../context/AuthContext';

function decodeEmailFromToken(tkn?: string): string | null {
  if (!tkn) return null;
  try {
    const parts = tkn.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = payload.length % 4 ? '='.repeat(4 - (payload.length % 4)) : '';
    const json = atob(payload + pad);
    const obj = JSON.parse(json) as { email?: string };
    return obj.email ?? null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const { token, role, login, logout } = useAuthContext();
  const MASTER_EMAIL = (import.meta.env.VITE_MASTER_EMAIL as string | undefined)?.toLowerCase();
  const email = decodeEmailFromToken(token ?? undefined)?.toLowerCase() || null;
  const effectiveRole = email && MASTER_EMAIL && email === MASTER_EMAIL ? 'master' : role;
  return { token, role: effectiveRole, login, logout, isAuthenticated: Boolean(token) };
}