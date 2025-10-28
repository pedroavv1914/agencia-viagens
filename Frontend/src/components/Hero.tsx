import React from 'react';
import './Hero.css';

const Hero: React.FC = () => (
  <section className="hero">
    <div className="container">
      <h1 className="hero-title">
        <span className="palazzo-hero">Palazzo <span>Travel</span></span>
        <br />
        <span className="hero-frase">Seu próximo destino começa aqui</span>
      </h1>
      <p className="hero-desc">Especialistas em experiências inesquecíveis pelo mundo. Viva o luxo, o conforto e a segurança de viajar com a melhor agência.</p>
      <a href="#pacotes" className="cta-btn">Explorar Pacotes</a>
    </div>
  </section>
);

export default Hero;
