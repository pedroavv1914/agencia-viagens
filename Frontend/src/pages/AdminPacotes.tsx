import React, { useEffect, useMemo, useState } from 'react';
import type { TravelPackage } from '../services/api';
import { createPackage, deletePackage, getPackages, updatePackage } from '../services/api';
import { useAuth } from '../hooks/useAuth';

type FormState = Omit<TravelPackage, 'id'>;

const emptyForm: FormState = {
  nome: '',
  preco: '',
  descricao: '',
  imagem: '',
  tipo: 'nacional',
};

const AdminPacotes: React.FC = () => {
  const { token } = useAuth();
  const [tipoFilter, setTipoFilter] = useState<'nacional' | 'internacional'>('nacional');
  const [items, setItems] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const canSubmit = useMemo(() => form.nome && form.preco && form.descricao, [form]);

  async function load() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPackages(tipoFilter, token);
      setItems(data);
    } catch (err) {
      setError('Falha ao carregar pacotes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [tipoFilter, token]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !canSubmit) return;
    try {
      const created = await createPackage({ ...form, tipo: form.tipo }, token);
      if (created.tipo === tipoFilter) setItems((prev) => [created, ...prev]);
      setForm(emptyForm);
    } catch (err) {
      alert('Erro ao criar pacote');
    }
  }

  async function handleUpdate(id: number) {
    if (!token) return;
    try {
      const updated = await updatePackage(id, form, token);
      setItems((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      alert('Erro ao atualizar pacote');
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    if (!confirm('Tem certeza que deseja remover este pacote?')) return;
    try {
      await deletePackage(id, token);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert('Erro ao remover pacote');
    }
  }

  function startEdit(pkg: TravelPackage) {
    setEditingId(pkg.id!);
    setForm({ nome: pkg.nome, preco: pkg.preco, descricao: pkg.descricao, imagem: pkg.imagem, tipo: pkg.tipo });
  }

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Administração de Pacotes</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="cta-btn" onClick={() => setTipoFilter('nacional')} style={{ opacity: tipoFilter === 'nacional' ? 1 : 0.8 }}>Nacionais</button>
        <button className="cta-btn" onClick={() => setTipoFilter('internacional')} style={{ opacity: tipoFilter === 'internacional' ? 1 : 0.8 }}>Internacionais</button>
      </div>
      {error && <p style={{ color: 'crimson', textAlign: 'center' }}>{error}</p>}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Carregando...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {items.map((p) => (
            <div key={p.id} className="pacote-card">
              {p.imagem ? (
                <img src={p.imagem} alt={p.nome} />
              ) : (
                <div className="pacote-img-placeholder" />
              )}
              <h3>{p.nome}</h3>
              <p className="preco">{p.preco}</p>
              <p style={{ color: '#444', marginTop: 8 }}>{p.descricao}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <button className="cta-btn" onClick={() => startEdit(p)}>Editar</button>
                <button className="cta-btn" onClick={() => handleDelete(p.id!)} style={{ background: 'linear-gradient(90deg,#c0392b,#e74c3c)' }}>Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId!); } : handleCreate} style={{ maxWidth: 700, margin: '0 auto', background: '#fff', padding: '1.5rem', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{editingId ? 'Editar Pacote' : 'Novo Pacote'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <div>
            <label>Nome</label>
            <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid #cce7ff', borderRadius: 8 }} />
          </div>
          <div>
            <label>Preço</label>
            <input value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid #cce7ff', borderRadius: 8 }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Descrição</label>
            <textarea rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid #cce7ff', borderRadius: 8 }} />
          </div>
          <div>
            <label>Imagem (URL)</label>
            <input value={form.imagem ?? ''} onChange={(e) => setForm({ ...form, imagem: e.target.value })} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cce7ff', borderRadius: 8 }} />
          </div>
          <div>
            <label>Tipo</label>
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as 'nacional' | 'internacional' })} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cce7ff', borderRadius: 8 }}>
              <option value="nacional">Nacional</option>
              <option value="internacional">Internacional</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginTop: '1rem' }}>
          <button type="submit" className="cta-btn" disabled={!canSubmit}>{editingId ? 'Salvar alterações' : 'Criar pacote'}</button>
          {editingId && (
            <button type="button" className="cta-btn" onClick={() => { setEditingId(null); setForm(emptyForm); }} style={{ background: 'linear-gradient(90deg,#7f8c8d,#95a5a6)' }}>Cancelar</button>
          )}
        </div>
      </form>
    </section>
  );
};

export default AdminPacotes;