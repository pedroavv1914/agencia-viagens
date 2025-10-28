import { useAuthContext } from '../context/AuthContext';

export function useAuth() {
  const { token, role, login, logout } = useAuthContext();
  return { token, role, login, logout, isAuthenticated: Boolean(token) };
}