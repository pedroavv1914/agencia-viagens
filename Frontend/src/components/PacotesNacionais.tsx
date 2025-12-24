import React, { useState, useEffect } from 'react';
import './Pacotes.css';
import PacoteModal from './PacoteModal';

import noronhaImg from '../assets/images/fernando-de-noronha.jpeg';
import camposImg from '../assets/images/campos-do-jordao.jpg';
import jalapaoImg from '../assets/images/jalapao.jpg';
import chapadaImg from '../assets/images/chapada-dos-veadeiros.jpg';
import portoImg from '../assets/images/porto-de-galinhas.jpg';
import arraialImg from '../assets/images/arraial-do-cabo.jpg';
import gramadoImg from '../assets/images/gramado.jpg';
import salvadorImg from '../assets/images/salvador.jpeg';

const initialPacotes = [
  { nome: 'Fernando de Noronha', imagem: noronhaImg, preco: 'R$ 3.200', descricao: 'Descubra as belezas naturais de Noronha com tudo incluso.' },
  { nome: 'Campos do Jordão', imagem: camposImg, preco: 'R$ 1.800', descricao: 'Aproveite o friozinho e o charme da serra paulista.' },
  { nome: 'Jalapão', imagem: jalapaoImg, preco: 'R$ 2.200', descricao: 'Ecoturismo, cachoeiras e aventura no coração do Brasil.' },
  { nome: 'Chapada dos Veadeiros', imagem: chapadaImg, preco: 'R$ 2.500', descricao: 'Trilhas, cachoeiras e energia mística no Cerrado.' },
  { nome: 'Porto de Galinhas', imagem: portoImg, preco: 'R$ 2.900', descricao: 'Piscinas naturais e praias paradisíacas em Pernambuco.' },
  { nome: 'Arraial do Cabo', imagem: arraialImg, preco: 'R$ 2.100', descricao: 'O Caribe brasileiro espera por você no RJ.' },
  { nome: 'Gramado', imagem: gramadoImg, preco: 'R$ 2.700', descricao: 'Clima europeu, chocolates e Natal Luz na Serra Gaúcha.' },
  { nome: 'Salvador', imagem: salvadorImg, preco: 'R$ 2.350', descricao: 'História, cultura afro-brasileira e praias incríveis na Bahia.' },
  { nome: 'Lençóis Maranhenses', preco: 'R$ 2.800', descricao: 'Dunas, lagoas cristalinas e paisagens únicas no Maranhão.' },
  { nome: 'Pantanal', preco: 'R$ 2.600', descricao: 'Safári brasileiro, fauna exuberante e natureza selvagem.' },
  { nome: 'Ouro Preto', preco: 'R$ 1.950', descricao: 'História colonial, igrejas barrocas e cultura mineira.' },
  { nome: 'Foz do Iguaçu', preco: 'R$ 2.400', descricao: 'As maiores cataratas do mundo e turismo de aventura.' },
];

import { useNavigate } from 'react-router-dom';
import { getPackages } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const PacotesNacionais: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [pacoteSelecionado, setPacoteSelecionado] = useState<typeof initialPacotes[0] | null>(null);
  const [pacotes, setPacotes] = useState(initialPacotes);

  const [windowSize, setWindowSize] = React.useState(window.innerWidth <= 700 ? 1 : 5);

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
        const data = await getPackages('nacional', token ?? undefined);
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
    <section className="pacotes" id="pacotes">
      <div className="container">
        <div className="pacotes-header">
          <h2>Pacotes Nacionais</h2>
          <button className="ver-tudo-btn" style={{ marginLeft: 'auto' }} onClick={() => navigate('/vertodos/nacionais')}>
            Ver todos os pacotes
          </button>
        </div>


        {/* Carrossel */}
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
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
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
};

export default PacotesNacionais;
export const pacotesNacionais = initialPacotes;
