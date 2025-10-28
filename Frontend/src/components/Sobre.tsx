import React from 'react';
import './Sobre.css';

const Sobre: React.FC = () => (
  <section className="sobre" id="sobre">
    <div className="container">
      <h2>Sobre a Agência</h2>
      <div className="sobre-destaque">
        <p>
          Somos especialistas em transformar sonhos em viagens inesquecíveis!<br />
          Há mais de 10 anos no mercado, oferecemos pacotes nacionais e internacionais com atendimento personalizado, segurança e as melhores experiências para nossos clientes.
        </p>
      </div>
      <div className="sobre-vantagens-grid">
        <div className="sobre-vantagem-card">
          <span className="sobre-vantagem-icone" role="img" aria-label="Consultoria">🧭</span>
          <div>
            <strong>Consultoria Especializada</strong>
            <p>Atendimento para cada perfil de viajante</p>
          </div>
        </div>
        <div className="sobre-vantagem-card">
          <span className="sobre-vantagem-icone" role="img" aria-label="Parcerias">🏨</span>
          <div>
            <strong>Parcerias Premium</strong>
            <p>Hotéis e companhias aéreas renomadas</p>
          </div>
        </div>
        <div className="sobre-vantagem-card">
          <span className="sobre-vantagem-icone" role="img" aria-label="Suporte">🕑</span>
          <div>
            <strong>Suporte 24h</strong>
            <p>Acompanhamento durante toda a viagem</p>
          </div>
        </div>
        <div className="sobre-vantagem-card">
          <span className="sobre-vantagem-icone" role="img" aria-label="Preços">💳</span>
          <div>
            <strong>Preços Competitivos</strong>
            <p>Condições facilitadas para você viajar mais</p>
          </div>
        </div>
        <div className="sobre-vantagem-card">
          <span className="sobre-vantagem-icone" role="img" aria-label="Sustentabilidade">🌱</span>
          <div>
            <strong>Viagens Sustentáveis</strong>
            <p>Opções ecológicas e apoio ao turismo responsável</p>
          </div>
        </div>
        <div className="sobre-vantagem-card">
          <span className="sobre-vantagem-icone" role="img" aria-label="Experiência">🌎</span>
          <div>
            <strong>Experiência Global</strong>
            <p>Equipe com vivência internacional em roteiros exclusivos</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Sobre;
