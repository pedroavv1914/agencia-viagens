import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VerTodos from './pages/VerTodos';
import GlobalStyle from './styles/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vertodos" element={<VerTodos />} />
        <Route path="/vertodos/nacionais" element={<VerTodos />} />
        <Route path="/vertodos/internacionais" element={<VerTodos />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
