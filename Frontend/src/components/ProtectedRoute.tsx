import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin }) => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (requireAdmin && role !== 'admin') {
    return <section className="container" style={{ padding: '2rem 0' }}>
      <h2>Acesso não autorizado</h2>
      <p>Esta área é restrita para administradores.</p>
    </section>;
  }
  return <>{children}</>;
};

export default ProtectedRoute;