import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserInfo } from '../services/api';
import type { UserInfo } from '../services/api';
import './UserMenu.css';

const UserMenu: React.FC = () => {
  const { token, logout, role } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUserInfo() {
      if (!token) return;
      try {
        const info = await getUserInfo(token);
        setUserInfo(info);
      } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);
        // Fallback: extrai email do token JWT
        const emailFromToken = decodeEmailFromToken(token);
        if (emailFromToken) {
          setUserInfo({ email: emailFromToken, role: role || 'user' });
        } else {
          setUserInfo({ email: 'email desconhecido', role: role || 'user' });
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUserInfo();
  }, [token, role]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="user-menu-loading">
        <div className="user-avatar">
          <span>...</span>
        </div>
      </div>
    );
  }

  if (!userInfo) return null;

  function decodeEmailFromToken(tkn?: string): string | null {
    if (!tkn) return null;
    try {
      const parts = tkn.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const pad = payload.length % 4 ? '='.repeat(4 - (payload.length % 4)) : '';
      const json = atob(payload + pad);
      const obj = JSON.parse(json) as { email?: string };
      return obj.email ?? null;
    } catch {
      return null;
    }
  }

  const getInitialFromEmail = (email: string) => {
    const local = email.split('@')[0];
    return local.charAt(0).toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    return role === 'admin' ? 'Administrador' : 'Usuário';
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button 
        className="user-menu-trigger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu do usuário"
      >
        <div className="user-avatar">
          <span>{getInitialFromEmail(userInfo.email)}</span>
        </div>
        <div className="user-info">
          <span className="user-email">{userInfo.email}</span>
          <span className="user-role">{getRoleLabel(userInfo.role)}</span>
        </div>
        <svg 
          className={`chevron ${menuOpen ? 'open' : ''}`} 
          width="16" 
          height="16" 
          viewBox="0 0 16 16"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </button>

      {menuOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <div className="user-avatar large">
              <span>{getInitialFromEmail(userInfo.email)}</span>
            </div>
            <div>
              <div className="user-email-large">{userInfo.email}</div>
              <div className="user-role-large">{getRoleLabel(userInfo.role)}</div>
            </div>
          </div>
          
          <div className="user-menu-divider"></div>
          
          <div className="user-menu-items">
            {userInfo.role === 'admin' && (
              <a href="/admin" className="user-menu-item">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M8 1l2.5 5h5.5l-4.5 3.5 1.5 5.5-4.5-3.5-4.5 3.5 1.5-5.5-4.5-3.5h5.5z" fill="currentColor"/>
                </svg>
                Painel Admin
              </a>
            )}
            {userInfo.role === 'admin' && (
              <a href="/admin/users" className="user-menu-item">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zm-6 6c0-3 3-5 6-5s6 2 6 5H2z" fill="currentColor"/>
                </svg>
                Admin Usuários
              </a>
            )}
            
            <button className="user-menu-item" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M6 2h8v12h-8M10 8h-8m6-2l2 2-2 2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;