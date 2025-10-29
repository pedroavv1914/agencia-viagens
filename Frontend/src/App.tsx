import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import VerTodos from './pages/VerTodos';
import GlobalStyle from './styles/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPacotes from './pages/AdminPacotes';
import { AuthProvider, useAuthContext } from './context/AuthContext';

const AppRoutes: React.FC = () => {
  const { token } = useAuthContext();

  // Se não está autenticado, redireciona para registro
  if (!token) {
    return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    );
  }

  // Se está autenticado, permite acesso às rotas protegidas
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vertodos" element={<VerTodos />} />
      <Route path="/vertodos/nacionais" element={<VerTodos />} />
      <Route path="/vertodos/internacionais" element={<VerTodos />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminPacotes />
          </ProtectedRoute>
        }
      />
      <Route path="/register" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
