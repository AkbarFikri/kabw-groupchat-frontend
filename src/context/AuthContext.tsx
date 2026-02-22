import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '@/api/auth';

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

  const login = async (u: string, p: string) => {
    await authApi.login(u, p);
    setUsername(u);
    localStorage.setItem('username', u);
  };

  const logout = async () => {
    await authApi.logout();
    setUsername(null);
    localStorage.removeItem('username');
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
