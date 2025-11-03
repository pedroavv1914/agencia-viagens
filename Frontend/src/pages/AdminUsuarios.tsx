import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUsers, updateUserRole } from '../services/api';
import type { AdminUser, UserRole } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './AdminUsuarios.css';

const AdminUsuarios: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'todos' | 'admin' | 'user'>('todos');

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

  const adminCount = useMemo(() => users.filter(u => u.role === 'admin').length, [users]);
  const userCount = useMemo(() => users.filter(u => u.role === 'user').length, [users]);
  const filtered = useMemo(() => {
    if (filter === 'todos') return users;
    return users.filter(u => u.role === filter);
  }, [users, filter]);

  return (
    <section className="container admin-users-page">
      <div className="admin-header">
        <div className="header-top">
          <button className="back-btn ghost" onClick={() => navigate('/')}>
            <span className="btn-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M14 7l-5 5 5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 12H9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            Voltar para Home
          </button>
          <div className="admin-title">
            <h2>Admin Usuários</h2>
            <p className="admin-subtitle">
              Gerencie permissões com rapidez
              <span className="admin-counters"> • Admins: {adminCount} | Usuários: {userCount}</span>
            </p>
          </div>
          <div className="admin-actions">
            <button className="cta-btn" onClick={load}>
              <span className="btn-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v8l5 3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              Recarregar
            </button>
          </div>
        </div>
        <div className="header-tabs">
          <div className="admin-tabs">
            <button className={`segmented-btn ${filter === 'todos' ? 'active' : ''}`} onClick={() => setFilter('todos')}>Todos</button>
            <button className={`segmented-btn ${filter === 'admin' ? 'active' : ''}`} onClick={() => setFilter('admin')}>Admins</button>
            <button className={`segmented-btn ${filter === 'user' ? 'active' : ''}`} onClick={() => setFilter('user')}>Usuários</button>
          </div>
        </div>
      </div>

      {error && <p style={{ color: 'crimson', textAlign: 'center' }}>{error}</p>}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Carregando usuários...</p>
      ) : (
        <div className="admin-users-content">
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#5a6a7a' }}>Nenhum usuário nesta aba.</p>
          ) : (
            <div className="users-grid">
              {filtered.map((u) => (
                <div key={u.id} className="user-card">
                  <div className="user-top">
                    <div className="avatar" aria-hidden="true">{u.email.slice(0,1).toUpperCase()}</div>
                    <div className="user-info">
                      <div className="user-email">{u.email}</div>
                      <div className={`role-badge ${u.role === 'master' ? 'master' : u.role === 'admin' ? 'admin' : 'user'}`}>
                        {u.role === 'master' ? 'Master' : u.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </div>
                    </div>
                    <div className="user-id">#{u.id}</div>
                  </div>
                  <div className="user-actions">
                    <button
                      className="cta-btn"
                      disabled={updatingId === u.id || u.role === 'admin' || u.role === 'master'}
                      onClick={() => handleChangeRole(u.id, 'admin')}
                    >
                      {updatingId === u.id ? 'Aplicando...' : 'Promover a Admin'}
                    </button>
                    <button
                      className="cta-btn"
                      disabled={updatingId === u.id || u.role === 'user' || u.role === 'master'}
                      onClick={() => handleChangeRole(u.id, 'user')}
                      style={{ background: 'linear-gradient(90deg,#7f8c8d,#95a5a6)' }}
                    >
                      {updatingId === u.id ? 'Aplicando...' : 'Rebaixar a Usuário'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AdminUsuarios;