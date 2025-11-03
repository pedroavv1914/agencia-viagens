import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireMaster?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin, requireMaster }) => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (requireMaster && role !== 'master') {
    return <section className="container" style={{ padding: '2rem 0' }}>
      <h2>Acesso não autorizado</h2>
      <p>Esta área é restrita para o usuário master.</p>
    </section>;
  }
  if (requireAdmin && role !== 'admin' && role !== 'master') {
    return <section className="container" style={{ padding: '2rem 0' }}>
      <h2>Acesso não autorizado</h2>
      <p>Esta área é restrita para administradores.</p>
    </section>;
  }
  return <>{children}</>;
};

export default ProtectedRoute;