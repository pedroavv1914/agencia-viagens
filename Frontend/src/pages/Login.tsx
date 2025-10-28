import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiLogin(email, password);
      login(res.token, res.role);
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas ou erro no servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420, width: '100%', background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Entrar</h2>
        {error && <p style={{ color: 'crimson', marginBottom: '1rem' }}>{error}</p>}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 6 }}>E-mail</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.7rem 1rem', border: '1px solid #cce7ff', borderRadius: 8 }} />
        </div>
        <div style={{ marginBottom: '1.2rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 6 }}>Senha</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.7rem 1rem', border: '1px solid #cce7ff', borderRadius: 8 }} />
        </div>
        <button type="submit" className="cta-btn" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </section>
  );
};

export default Login;