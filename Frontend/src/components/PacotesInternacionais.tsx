import React, { useState, useEffect } from 'react';
import './Pacotes.css';
import PacoteModal from './PacoteModal';

import parisImg from '../assets/images/paris.jpg';
import orlandoImg from '../assets/images/orlando.jpg';
import buenosAiresImg from '../assets/images/buenos-aires.jpeg';
import lisboaImg from '../assets/images/lisboa.jpg';
import dubaiImg from '../assets/images/dubai.jpg';
import santiagoImg from '../assets/images/santiago.jpg';
import cancunImg from '../assets/images/cancun.jpg';
import romaImg from '../assets/images/roma.jpg';
import barcelonaImg from '../assets/images/barcelona-carrossel.jpg';

const initialPacotes = [
  { nome: 'Paris', imagem: parisImg, preco: 'R$ 5.800', descricao: 'Encante-se com a Torre Eiffel, museus e gastronomia francesa.' },
  { nome: 'Orlando', imagem: orlandoImg, preco: 'R$ 7.200', descricao: 'Diversão garantida nos parques temáticos mais famosos do mundo.' },
  { nome: 'Buenos Aires', imagem: buenosAiresImg, preco: 'R$ 4.100', descricao: 'Tango, cultura e culinária argentina em uma cidade vibrante.' },
  { nome: 'Lisboa', imagem: lisboaImg, preco: 'R$ 6.300', descricao: 'História, fado e belas paisagens à beira do Atlântico.' },
  { nome: 'Dubai', imagem: dubaiImg, preco: 'R$ 10.500', descricao: 'Luxo, arquitetura futurista e experiências no deserto.' },
  { nome: 'Santiago', imagem: santiagoImg, preco: 'R$ 3.900', descricao: 'Cultura, vinhos e montanhas na charmosa capital chilena.' },
  { nome: 'Cancún', imagem: cancunImg, preco: 'R$ 8.200', descricao: 'Praias paradisíacas, resorts all inclusive e vida noturna agitada.' },
  { nome: 'Roma', imagem: romaImg, preco: 'R$ 7.900', descricao: 'História milenar, Coliseu e gastronomia italiana inesquecível.' },
  { nome: 'Barcelona', imagem: barcelonaImg, preco: 'R$ 7.500', descricao: 'Arte, arquitetura de Gaudí e praias no Mediterrâneo.' },
  { nome: 'Istambul', preco: 'R$ 7.100', descricao: 'Cultura milenar, mesquitas e o encontro entre Europa e Ásia.' },
  { nome: 'Ilhas Maldivas', preco: 'R$ 13.500', descricao: 'Bangalôs sobre o mar, águas cristalinas e luxo no paraíso.' },
  { nome: 'Tóquio', preco: 'R$ 11.800', descricao: 'Tecnologia, tradição, templos e cultura pop japonesa.' },
  { nome: 'Cidade do Cabo', preco: 'R$ 9.200', descricao: 'Paisagens deslumbrantes, vinhos e safáris na África do Sul.' },
];

import { useNavigate } from 'react-router-dom';
import { getPackages } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const PacotesInternacionais: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [pacoteSelecionado, setPacoteSelecionado] = useState<typeof initialPacotes[0] | null>(null);

  const [windowSize, setWindowSize] = React.useState(window.innerWidth <= 700 ? 1 : 5);
  const [pacotes, setPacotes] = useState(initialPacotes);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth <= 700 ? 1 : 5);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPackages('internacional', token ?? undefined);
        if (Array.isArray(data)) {
          const normalized = data.map((p) => ({
            nome: p.nome,
            preco: p.preco,
            descricao: p.descricao,
            imagem: p.imagem,
          }));
          // Só substitui os defaults se o backend tiver conteúdo
          if (normalized.length > 0) {
            setPacotes(normalized);
          }
        }
      } catch {
        // mantém dados locais
      }
    }
    fetchData();
  }, [token]);

  const handleOpenModal = (pacote: typeof initialPacotes[0]) => {
    setPacoteSelecionado(pacote);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setPacoteSelecionado(null);
  };

  // Carrossel: 5 pacotes por vez, efeito suave
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);

  function getWindowedPacotes() {
    if (pacotes.length <= windowSize) return pacotes;
    if (startIndex + windowSize <= pacotes.length) {
      return pacotes.slice(startIndex, startIndex + windowSize);
    }
    // Se passar do fim, junta o começo
    return pacotes.slice(startIndex).concat(pacotes.slice(0, (startIndex + windowSize) % pacotes.length));
  }

  function handlePrev() {
    setDirection('prev');
    setStartIndex((prev) => (prev - 1 + pacotes.length) % pacotes.length);
  }
  function handleNext() {
    setDirection('next');
    setStartIndex((prev) => (prev + 1) % pacotes.length);
  }

  return (
    <section className="pacotes" id="pacotes-internacionais">
      <div className="container">
        <div className="pacotes-header">
          <h2>Pacotes Internacionais</h2>
          <button className="ver-tudo-btn" style={{ marginLeft: '1rem' }} onClick={() => navigate('/vertodos/internacionais')}>
            Ver todos os pacotes
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <button className="carousel-btn" onClick={handlePrev}>
            &lt;
          </button>
          <div className={`pacotes-carousel carousel-anim-${direction ?? 'none'}`}>
            {getWindowedPacotes().map((p) => (
              <div
                className="pacote-card"
                key={p.nome}
                style={{
                  transition: 'transform 0.7s cubic-bezier(.4,1.3,.6,1)',
                  minWidth: 0,
                  flex: 1,
                }}
              >
                {p.imagem ? (
                  <img src={p.imagem} alt={p.nome} />
                ) : (
                  <div className="pacote-img-placeholder" />
                )}
                <h3>{p.nome}</h3>
                <p className="preco">{p.preco}</p>
                <p style={{ color: '#444', marginTop: 8 }}>{p.descricao}</p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '1rem',
                  }}
                >
                  <button className="cta-btn" onClick={() => handleOpenModal(p)}>
                    Ver detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-btn" onClick={handleNext}>
            &gt;
          </button>
        </div>
        {/* Modal e outros elementos seguem aqui normalmente */}
        <PacoteModal
          open={modalOpen}
          onClose={handleCloseModal}
          nome={pacoteSelecionado?.nome || ''}
          imagem={pacoteSelecionado?.imagem || ''}
          preco={pacoteSelecionado?.preco || ''}
          descricao={pacoteSelecionado?.descricao}
        />
      </div>
    </section>
  );
};

export default PacotesInternacionais;
export const pacotesInternacionais = initialPacotes;
