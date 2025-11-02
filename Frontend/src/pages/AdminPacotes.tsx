import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPacotes.css';
import '../components/PacoteModal.css';
import type { TravelPackage } from '../services/api';
import { createPackage, deletePackage, getPackages, updatePackage } from '../services/api';
import { pacotesNacionais } from '../components/PacotesNacionais';
import { pacotesInternacionais } from '../components/PacotesInternacionais';
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
  const navigate = useNavigate();
  // Volta ao filtro por aba e uma única lista
  const [tipoFilter, setTipoFilter] = useState<'nacional' | 'internacional'>('nacional');
  const [items, setItems] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const canSubmit = useMemo(() => form.nome && form.preco && form.descricao, [form]);

  async function load() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      // Busca pelo filtro selecionado
      let data = await getPackages(tipoFilter, token);
      // Se não há dados no backend, semeia a partir dos pacotes da Home
      if (!Array.isArray(data) || data.length === 0) {
        const source = tipoFilter === 'nacional' ? pacotesNacionais : pacotesInternacionais;
        for (const p of source) {
          try {
            await createPackage({
              nome: p.nome,
              preco: p.preco,
              descricao: p.descricao,
              imagem: p.imagem,
              tipo: tipoFilter,
            }, token);
          } catch {
            // ignora falhas individuais de seed
          }
        }
        data = await getPackages(tipoFilter, token);
      }
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
      setItems((prev) => prev.filter((p) => p.id !== id));
      if (updated.tipo === tipoFilter) {
        setItems((prev) => [updated, ...prev]);
      }
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
    setShowFormModal(true);
  }

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setShowFormModal(true);
  }

  function closeFormModal() {
    setShowFormModal(false);
  }

  return (
    <section className="container admin-page">
      <div className="admin-header">
        <button className="cta-btn" onClick={() => navigate('/')}>Voltar para Home</button>
        <h2>Administração de Pacotes</h2>
      </div>

      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
          <button className="cta-btn" onClick={openCreateModal}>Novo pacote</button>
        </div>
        <div className="admin-tabs">
          <button
            className={`segmented-btn ${tipoFilter === 'nacional' ? 'active' : ''}`}
            onClick={() => setTipoFilter('nacional')}
          >
            Nacionais
          </button>
          <button
            className={`segmented-btn ${tipoFilter === 'internacional' ? 'active' : ''}`}
            onClick={() => setTipoFilter('internacional')}
          >
            Internacionais
          </button>
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

        {showFormModal && (
          <div className="modal-overlay" onClick={closeFormModal}>
            <div className="modal-content" style={{ maxWidth: 720, width: '92%' }} onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeFormModal}>&times;</button>
              <h3 className="admin-form-title" style={{ marginTop: 0 }}>{editingId ? 'Editar Pacote' : 'Novo Pacote'}</h3>
              <form
                className="admin-form"
                onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId!); closeFormModal(); } : (e) => { handleCreate(e); closeFormModal(); }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Nome</label>
                    <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required style={{ width: '100%', padding: '0.7rem', border: '1px solid #cce7ff', borderRadius: 10 }} />
                  </div>
                  <div>
                    <label className="admin-label">Preço</label>
                    <input value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required style={{ width: '100%', padding: '0.7rem', border: '1px solid #cce7ff', borderRadius: 10 }} />
                  </div>
                  <div>
                    <label className="admin-label">Descrição</label>
                    <textarea rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} required style={{ width: '100%', padding: '0.7rem', border: '1px solid #cce7ff', borderRadius: 10 }} />
                  </div>
                  <div>
                    <label className="admin-label">Imagem (URL)</label>
                    <input value={form.imagem ?? ''} onChange={(e) => setForm({ ...form, imagem: e.target.value })} style={{ width: '100%', padding: '0.7rem', border: '1px solid #cce7ff', borderRadius: 10 }} />
                  </div>
                  <div>
                    <label className="admin-label">Tipo</label>
                    <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as 'nacional' | 'internacional' })} style={{ width: '100%', padding: '0.7rem', border: '1px solid #cce7ff', borderRadius: 10 }}>
                      <option value="nacional">Nacional</option>
                      <option value="internacional">Internacional</option>
                    </select>
                  </div>
                </div>
                <div className="admin-form-actions" style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginTop: '1rem' }}>
                  <button type="submit" className="cta-btn" disabled={!canSubmit}>{editingId ? 'Salvar alterações' : 'Criar pacote'}</button>
                  <button type="button" className="cta-btn" onClick={closeFormModal} style={{ background: 'linear-gradient(90deg,#7f8c8d,#95a5a6)' }}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminPacotes;