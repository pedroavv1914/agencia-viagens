import React from 'react';
import './PacoteModal.css';

interface PacoteModalProps {
  open: boolean;
  onClose: () => void;
  nome: string;
  imagem: string;
  preco: string;
  descricao?: string;
}

const PacoteModal: React.FC<PacoteModalProps> = ({ open, onClose, nome, imagem, preco, descricao }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <img src={imagem} alt={nome} className="modal-img" />
        <h2>{nome}</h2>
        <p className="modal-preco">{preco}</p>
        <div className="modal-info">
          <h4>Informações do pacote</h4>
          <ul>
            <li><strong>Hospedagem:</strong> Hotéis 4 estrelas ou superior</li>
            <li><strong>Transporte:</strong> Aéreo ida e volta incluso</li>
            <li><strong>Passeios:</strong> City tour, passeios guiados e tempo livre</li>
            <li><strong>Café da manhã:</strong> Incluso todos os dias</li>
            <li><strong>Suporte:</strong> Equipe disponível 24h durante a viagem</li>
          </ul>
        </div>
        <p className="modal-desc">{descricao || 'Embarque nessa viagem inesquecível com todo conforto e segurança!'}</p>
        <button className="modal-comprar-btn" onClick={() => alert('Em breve você poderá comprar este pacote!')}>Comprar pacote</button>
      </div>
    </div>
  );
};

export default PacoteModal;
