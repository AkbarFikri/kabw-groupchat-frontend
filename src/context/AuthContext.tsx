import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi } from '@/api/auth';
import { AUTH_EXPIRED_EVENT } from '@/api/client';
import { disconnectSocket } from '@/hooks/useSocket';

interface AuthContextValue {
  username: string | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem('username')
  );

  const isLoggedIn = username !== null;

  const clearAuth = useCallback(() => {
    setUsername(null);
    localStorage.removeItem('username');
    disconnectSocket();
  }, []);

  // Listen for 401 responses from the API client
  useEffect(() => {
    const handler = () => clearAuth();
    window.addEventListener(AUTH_EXPIRED_EVENT, handler);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
  }, [clearAuth]);

  const login = async (u: string, p: string) => {
    await authApi.login(u, p);
    setUsername(u);
    localStorage.setItem('username', u);
  };

  const logout = async () => {
    await authApi.logout();
    clearAuth();
  };

  const register = async (u: string, p: string) => {
    await authApi.register(u, p);
  };

  return (
    <AuthContext.Provider value={{ username, isLoggedIn, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}