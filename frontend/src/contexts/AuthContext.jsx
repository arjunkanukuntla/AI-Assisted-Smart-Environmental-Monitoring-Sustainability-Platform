import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ecosphere_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('ecosphere_token') || null;
  });

  // 'citizen' (Public Portal) or 'admin' (Operator Command Center)
  const [portalMode, setPortalMode] = useState(() => {
    return localStorage.getItem('ecosphere_portal') || 'citizen';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ecosphere_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ecosphere_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('ecosphere_token', token);
    } else {
      localStorage.removeItem('ecosphere_token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('ecosphere_portal', portalMode);
  }, [portalMode]);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await api.login({ email, password });
      const { access_token, user: userData } = res.data;
      setUser(userData);
      setToken(access_token);
      setIsAuthModalOpen(false);
      
      // Auto-switch to admin panel if administrator
      if (userData.role === 'admin' || userData.role === 'operator') {
        setPortalMode('admin');
      }
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Login failed';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await api.register(userData);
      const { access_token, user: newUserData } = res.data;
      setUser(newUserData);
      setToken(access_token);
      setIsAuthModalOpen(false);
      if (newUserData.role === 'admin' || newUserData.role === 'operator') {
        setPortalMode('admin');
      }
      return { success: true, user: newUserData };
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Registration failed';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPortalMode('citizen');
  };

  // 1-Click quick login presets for effortless client evaluation
  const loginQuick = async (role = 'admin') => {
    if (role === 'admin') {
      return await login('admin@ecosphere.gov', 'admin123');
    } else {
      return await login('citizen@ecosphere.org', 'citizen123');
    }
  };

  const openAuthModal = () => {
    setAuthError('');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError('');
  };

  const switchPortal = (mode) => {
    if (mode === 'admin' && (!user || (user.role !== 'admin' && user.role !== 'operator'))) {
      openAuthModal();
      return;
    }
    setPortalMode(mode);
  };

  const value = {
    user,
    token,
    portalMode,
    setPortalMode,
    switchPortal,
    isAdmin: user?.role === 'admin' || user?.role === 'operator',
    isCitizen: !user || user?.role === 'citizen',
    login,
    register,
    logout,
    loginQuick,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    authError,
    setAuthError,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
