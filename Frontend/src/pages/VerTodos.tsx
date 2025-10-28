import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PacoteModal from '../components/PacoteModal';
import '../components/Pacotes.css';
import { pacotesNacionais } from '../components/PacotesNacionais';
import { pacotesInternacionais } from '../components/PacotesInternacionais';

// Pacotes EXTRAS exclusivos da tela VerTodos
const pacotesNacionaisExtras = [
  { nome: 'Serra do Cipó', preco: 'R$ 2.100', descricao: 'Natureza, cachoeiras e trilhas em Minas Gerais.' },
  { nome: 'Ilha do Mel', preco: 'R$ 2.350', descricao: 'Refúgio paradisíaco no litoral do Paraná.' },
  { nome: 'Alter do Chão', preco: 'R$ 2.650', descricao: 'O Caribe Amazônico, praias de rio e cultura paraense.' },
];
const pacotesInternacionaisExtras = [
  { nome: 'Patagônia', preco: 'US$ 1.950', descricao: 'Aventura e paisagens glaciais entre Argentina e Chile.' },
  { nome: 'Egito Clássico', preco: 'US$ 2.700', descricao: 'Pirâmides, templos e cruzeiro pelo Nilo.' },
  { nome: 'Tailândia', preco: 'US$ 2.400', descricao: 'Templos, praias paradisíacas e cultura oriental.' },
];

export default function VerTodos() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [pacoteSelecionado, setPacoteSelecionado] = React.useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar o filtro pela rota
  let mostrarNacionais = true;
  let mostrarInternacionais = true;
  let titulo = 'Todos os Pacotes';
  if (location.pathname.endsWith('/nacionais')) {
    mostrarInternacionais = false;
    titulo = 'Pacotes Nacionais';
  } else if (location.pathname.endsWith('/internacionais')) {
    mostrarNacionais = false;
    titulo = 'Pacotes Internacionais';
  }

  function handleOpenModal(pacote: any) {
    setPacoteSelecionado(pacote);
    setModalOpen(true);
  }
  function handleCloseModal() {
    setModalOpen(false);
    setPacoteSelecionado(null);
  }

  return (
    <section className="ver-todos-pacotes" style={{ minHeight: '70vh', padding: '2rem 0' }}>
      <div className="container">
        <button className="ver-tudo-btn" style={{ margin: '0 0 2rem 0', display: 'block' }} onClick={() => navigate('/')}>Voltar para Home</button>
        <h2 style={{ textAlign: 'center', marginBottom: 40 }}>{titulo}</h2>

        {mostrarNacionais && (
          <>
            {titulo === 'Todos os Pacotes' && (
              <h3 style={{ textAlign: 'center', margin: '2.5rem 0 1.5rem 0', fontWeight: 700, fontSize: '1.45rem', color: '#0099ff' }}>Pacotes Nacionais</h3>
            )}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
              justifyItems: 'center',
              marginBottom: '3.5rem',
            }}>
              {[...pacotesNacionais, ...pacotesNacionaisExtras].map((p: any) => (
                <div className="pacote-card" key={p.nome + (p.preco || '')} style={{ width: 260, minWidth: 220, maxWidth: 300 }}>
                  {p.imagem ? (
                    <img src={p.imagem} alt={p.nome} />
                  ) : (
                    <div className="pacote-img-placeholder" />
                  )}
                  <h3>{p.nome}</h3>
                  <p className="preco">{p.preco}</p>
                  <p style={{ color: '#444', marginTop: 8 }}>{p.descricao}</p>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <button className="cta-btn" onClick={() => handleOpenModal(p)}>
                      Ver detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Separador sempre entre nacionais e internacionais, se ambas as seções estiverem visíveis */}
        {mostrarNacionais && mostrarInternacionais && titulo === 'Todos os Pacotes' && (
          <hr style={{
            border: 0,
            borderTop: '2px dashed #00c6ff',
            margin: '2.5rem auto 2.5rem auto',
            width: '60%',
            maxWidth: 420,
            opacity: 0.35
          }} />
        )}

        {mostrarInternacionais && (
          <>
            {titulo === 'Todos os Pacotes' && (
              <h3 style={{ textAlign: 'center', margin: '2.5rem 0 1.5rem 0', fontWeight: 700, fontSize: '1.45rem', color: '#0099ff' }}>Pacotes Internacionais</h3>
            )}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
              justifyItems: 'center',
            }}>
              {[...pacotesInternacionais, ...pacotesInternacionaisExtras].map((p: any) => (
                <div className="pacote-card" key={p.nome + (p.preco || '')} style={{ width: 260, minWidth: 220, maxWidth: 300 }}>
                  {p.imagem ? (
                    <img src={p.imagem} alt={p.nome} />
                  ) : (
                    <div className="pacote-img-placeholder" />
                  )}
                  <h3>{p.nome}</h3>
                  <p className="preco">{p.preco}</p>
                  <p style={{ color: '#444', marginTop: 8 }}>{p.descricao}</p>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <button className="cta-btn" onClick={() => handleOpenModal(p)}>
                      Ver detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <PacoteModal
        open={modalOpen}
        onClose={handleCloseModal}
        nome={pacoteSelecionado?.nome || ''}
        imagem={pacoteSelecionado?.imagem || ''}
        preco={pacoteSelecionado?.preco || ''}
        descricao={pacoteSelecionado?.descricao}
      />
    </section>
  );
}

