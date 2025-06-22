import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Sobre from '../components/Sobre';
import Vantagens from '../components/Vantagens';
import PacotesNacionais from '../components/PacotesNacionais';
import PacotesInternacionais from '../components/PacotesInternacionais';
import Depoimentos from '../components/Depoimentos';
import Contato from '../components/Contato';
import Footer from '../components/Footer';

const Home: React.FC = () => (
  <>
    <Header />
    <Hero />
    <Sobre />
    <Vantagens />
    <PacotesNacionais />
    <PacotesInternacionais />
    <Depoimentos />
    <Contato />
    <Footer />
  </>
);

export default Home;
