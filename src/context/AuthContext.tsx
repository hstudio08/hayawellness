"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, login: () => false, logout: () => {} });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const session = localStorage.getItem('haya_admin_session');
    if (session === 'true') {
      setUser({ email: 'admin@hayawellness.com', uid: 'admin' });
    }
    setLoading(false);
  }, []);

  const login = (password: string) => {
    if (password === "123demo123") {
      localStorage.setItem('haya_admin_session', 'true');
      setUser({ email: 'admin@hayawellness.com', uid: 'admin' });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('haya_admin_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
