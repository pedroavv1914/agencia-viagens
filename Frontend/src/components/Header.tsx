import React, { useState } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  // Bloqueia scroll do body quando menu está aberto
  React.useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Função para fechar com animação
  const handleCloseMenu = () => {
    setClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setClosing(false);
    }, 300); // tempo igual ao da animação CSS
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo-area">
          <span className="palazzo-logo">Palazzo <span>Travel</span></span>
          <span className="palazzo-tagline">Viagens que inspiram</span>
        </div>
        {/* Ícone hamburguer só no mobile, alinhado à direita */}
        <div className="menu-hamburguer-wrapper">
          {!menuOpen && (
            <button className="menu-hamburguer" aria-label="Abrir menu" onClick={() => setMenuOpen(true)}>
              <span />
              <span />
              <span />
            </button>
          )}
        </div>
        {/* Menu desktop */}
        <nav className="nav-desktop">
          <ul className="nav-list">
            <li><a href="#sobre">Sobre</a></li>
            <li><a href="#vantagens">Vantagens</a></li>
            <li><a href="#pacotes">Pacotes Nacionais</a></li>
            <li><a href="#pacotes-internacionais">Pacotes Internacionais</a></li>
            <li><a href="#depoimentos">Depoimentos</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </nav>
        <a href="#contato" className="cta-btn nav-desktop">Fale Conosco</a>
        {/* Menu lateral (drawer) */}
        {menuOpen && (
          <>
            <div className={`menu-overlay${closing ? ' closing' : ''}`} onClick={handleCloseMenu} />
            <nav className={`menu-drawer${closing ? ' closing' : ''}`}>
              <button className="menu-close" aria-label="Fechar menu" onClick={handleCloseMenu}>&times;</button>
              <ul>
                <li><a href="#sobre" onClick={handleCloseMenu}>Sobre</a></li>
                <li><a href="#vantagens" onClick={handleCloseMenu}>Vantagens</a></li>
                <li><a href="#pacotes" onClick={handleCloseMenu}>Pacotes Nacionais</a></li>
                <li><a href="#pacotes-internacionais" onClick={handleCloseMenu}>Pacotes Internacionais</a></li>
                <li><a href="#depoimentos" onClick={handleCloseMenu}>Depoimentos</a></li>
                <li><a href="#contato" onClick={handleCloseMenu}>Contato</a></li>
              </ul>
              <a href="#contato" className="cta-btn" style={{ marginTop: 24 }} onClick={handleCloseMenu}>Fale Conosco</a>
            </nav>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
