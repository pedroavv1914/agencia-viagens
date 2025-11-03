export type UserRole = 'admin' | 'user';

export interface LoginResponse {
  token: string;
  role?: UserRole;
}

export interface UserInfo {
  email: string;
  role: UserRole;
  name?: string;
}

export interface AdminUser {
  id: number;
  email: string;
  role: UserRole;
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
  if (!res.ok) {
    let message = 'Falha no login';
    try {
      const err = await res.json();
      if (err && typeof err.message === 'string') message = err.message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function register(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    let message = 'Falha no cadastro';
    try {
      const err = await res.json();
      if (err && typeof err.message === 'string') message = err.message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function getPackages(tipo: 'nacional' | 'internacional', token?: string): Promise<TravelPackage[]> {
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

export async function getUserInfo(token: string): Promise<UserInfo> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Falha ao obter informações do usuário');
  return res.json();
}

export async function refreshToken(token: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Falha ao atualizar token');
  return res.json();
}

// Admin: listar usuários
export async function getUsers(token: string): Promise<AdminUser[]> {
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Falha ao carregar usuários');
  return res.json();
}

// Admin: atualizar role de um usuário
export async function updateUserRole(id: number, role: UserRole, token: string): Promise<AdminUser> {
  const res = await fetch(`${API_BASE_URL}/admin/users/${id}/role`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error('Falha ao atualizar role');
  return res.json();
}

// Upload de imagem de pacote: envia arquivo como base64 e retorna URL pública
export async function uploadPackageImage(file: File, token: string): Promise<string> {
  const toDataUrl = (f: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(f);
  });

  const dataUrl = await toDataUrl(file);
  const res = await fetch(`${API_BASE_URL}/packages/upload`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ filename: file.name, data: dataUrl }),
  });
  if (!res.ok) throw new Error('Falha ao enviar imagem');
  const json = await res.json();
  return json.url as string;
}