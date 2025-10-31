import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { UserRole } from '../services/api';
import { refreshToken } from '../services/api';

interface AuthContextValue {
  token: string | null;
  role: UserRole | null;
  login: (token: string, role?: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [role, setRole] = useState<UserRole | null>(() => {
    const r = localStorage.getItem('auth_role');
    return r ? (r as UserRole) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('auth_token', token);
    else localStorage.removeItem('auth_token');
  }, [token]);

  useEffect(() => {
    if (role) localStorage.setItem('auth_role', role);
    else localStorage.removeItem('auth_role');
  }, [role]);

  // Sincroniza role/token com o backend caso tenha mudado (ex.: promoção para admin)
  useEffect(() => {
    let active = true;
    async function sync() {
      if (!token) return;
      try {
        const res = await refreshToken(token);
        if (!active) return;
        if (res.role && res.role !== role) {
          setRole(res.role);
        }
        if (res.token && res.token !== token) {
          setToken(res.token);
        }
      } catch {
        // Se falhar, mantém estado atual
      }
    }
    sync();
    return () => { active = false; };
  }, [token]);

  const value = useMemo(() => ({
    token,
    role,
    login: (t: string, r?: UserRole) => {
      setToken(t);
      setRole(r ?? null);
    },
    logout: () => {
      setToken(null);
      setRole(null);
    },
  }), [token, role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
  return ctx;
}