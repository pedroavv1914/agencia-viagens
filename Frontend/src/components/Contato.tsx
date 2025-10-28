import React from 'react';
import './Contato.css';

const Contato: React.FC = () => (
  <section className="contato" id="contato">
    <div className="container">
      <h2>Fale Conosco</h2>
      <form className="contato-form">
        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input type="text" id="nome" name="nome" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="mensagem">Mensagem</label>
          <textarea id="mensagem" name="mensagem" rows={4} required />
        </div>
        <button type="submit" className="cta-btn">Enviar</button>
      </form>
      <div className="contato-info">
        <p><strong>E-mail:</strong> contato@palazzotravel.com</p>
        <p><strong>Telefone:</strong> (11) 99999-9999</p>
        <p><strong>Endereço:</strong> Av. das Viagens, 123 - São Paulo/SP</p>
      </div>
    </div>
  </section>
);

export default Contato;
