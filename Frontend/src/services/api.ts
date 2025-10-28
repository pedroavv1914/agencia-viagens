export type UserRole = 'admin' | 'user';

export interface LoginResponse {
  token: string;
  role?: UserRole;
}

export interface TravelPackage {
  id?: number;
  nome: string;
  preco: string;
  descricao: string;
  imagem?: string;
  tipo: 'nacional' | 'internacional';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

function getAuthHeaders(token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Falha no login');
  return res.json();
}

export async function getPackages(tipo: 'nacional' | 'internacional', token: string): Promise<TravelPackage[]> {
  const url = `${API_BASE_URL}/packages?tipo=${encodeURIComponent(tipo)}`;
  const res = await fetch(url, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Falha ao carregar pacotes');
  return res.json();
}

export async function createPackage(pkg: TravelPackage, token: string): Promise<TravelPackage> {
  const res = await fetch(`${API_BASE_URL}/packages`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(pkg),
  });
  if (!res.ok) throw new Error('Falha ao criar pacote');
  return res.json();
}

export async function updatePackage(id: number, pkg: Partial<TravelPackage>, token: string): Promise<TravelPackage> {
  const res = await fetch(`${API_BASE_URL}/packages/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(pkg),
  });
  if (!res.ok) throw new Error('Falha ao atualizar pacote');
  return res.json();
}

export async function deletePackage(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/packages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Falha ao remover pacote');
}