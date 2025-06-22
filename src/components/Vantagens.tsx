import React from 'react';
import './Vantagens.css';

const Vantagens: React.FC = () => (
  <section className="vantagens" id="vantagens">
    <div className="container">
      <h2>Por que escolher a nossa agência?</h2>
      <div className="vantagens-grid">
        <div className="vantagem-card">
          <span className="vantagem-icone">🌎</span>
          <h4>Variedade de Destinos</h4>
          <p>Dos paraísos nacionais aos roteiros internacionais mais desejados.</p>
        </div>
        <div className="vantagem-card">
          <span className="vantagem-icone">💰</span>
          <h4>Preços Competitivos</h4>
          <p>Pacotes para todos os bolsos, com promoções exclusivas para clientes.</p>
        </div>
        <div className="vantagem-card">
          <span className="vantagem-icone">🛡️</span>
          <h4>Segurança e Suporte</h4>
          <p>Equipe pronta para ajudar antes, durante e depois da sua viagem.</p>
        </div>
        <div className="vantagem-card">
          <span className="vantagem-icone">⭐</span>
          <h4>Avaliação dos Clientes</h4>
          <p>Mais de 98% de satisfação em milhares de viagens realizadas.</p>
        </div>
      </div>
    </div>
  </section>
);

export default Vantagens;
