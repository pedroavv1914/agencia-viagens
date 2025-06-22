import React from 'react';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="container">
      <p>&copy; {new Date().getFullYear()} Palazzo Travel. Todos os direitos reservados.</p>
    </div>
  </footer>
);

export default Footer;
