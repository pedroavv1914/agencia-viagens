import React from 'react';
import './Depoimentos.css';

const depoimentos = [
  {
    nome: 'Ana Paula',
    texto: 'Viagem incrível! Atendimento nota 10 e destinos maravilhosos.',
    foto: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    nome: 'Carlos Silva',
    texto: 'Tudo perfeito, desde a compra até o retorno. Recomendo muito!',
    foto: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    nome: 'Juliana Souza',
    texto: 'Experiência inesquecível, já quero viajar de novo!',
    foto: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
];

const Depoimentos: React.FC = () => (
  <section className="depoimentos" id="depoimentos">
    <div className="container">
      <h2>Depoimentos de Clientes</h2>
      <div className="depoimentos-grid">
        {depoimentos.map((d) => (
          <div className="depoimento-card" key={d.nome}>
            <img src={d.foto} alt={`Foto de ${d.nome}`} className="foto-cliente" />
            <blockquote>{d.texto}</blockquote>
            <span className="nome-cliente">{d.nome}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Depoimentos;
