import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUsers, updateUserRole } from '../services/api';
import type { AdminUser, UserRole } from '../services/api';

const AdminUsuarios: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function load() {
    if (!token) return;
    setError(null);
    setLoading(true);
    try {
      const list = await getUsers(token);
      setUsers(list);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao carregar usuários';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [token]);

  async function handleChangeRole(id: number, role: UserRole) {
    if (!token) return;
    setUpdatingId(id);
    try {
      const updated = await updateUserRole(id, role, token);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } catch (err) {
      alert('Erro ao atualizar role');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2>Admin Usuários</h2>
      <p>Gerencie permissões dos usuários cadastrados.</p>
      {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
      {loading ? (
        <p>Carregando usuários...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>ID</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Email</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Role</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{u.id}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{u.email}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{u.role === 'admin' ? 'Administrador' : 'Usuário'}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>
                    <button
                      disabled={updatingId === u.id || u.role === 'admin'}
                      onClick={() => handleChangeRole(u.id, 'admin')}
                      style={{ marginRight: '0.5rem' }}
                    >
                      Promover a Admin
                    </button>
                    <button
                      disabled={updatingId === u.id || u.role === 'user'}
                      onClick={() => handleChangeRole(u.id, 'user')}
                    >
                      Rebaixar a Usuário
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ marginTop: '1rem' }}>
        <button onClick={load}>Recarregar</button>
      </div>
    </section>
  );
};

export default AdminUsuarios;