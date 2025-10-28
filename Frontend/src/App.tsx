import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VerTodos from './pages/VerTodos';
import GlobalStyle from './styles/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPacotes from './pages/AdminPacotes';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPacotes />
              </ProtectedRoute>
            }
          />
          <Route path="/vertodos" element={<VerTodos />} />
          <Route path="/vertodos/nacionais" element={<VerTodos />} />
          <Route path="/vertodos/internacionais" element={<VerTodos />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
