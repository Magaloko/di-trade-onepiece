import { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  demoLogin: () => void;
  adminLogin: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('diTradeUser');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('diTradeUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('diTradeUser');
  };

  const demoLogin = () => {
    const demoUser: User = {
      id: 'demo-001',
      name: 'TCG Sammler',
      email: 'demo@di-trade.de',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
      isAdmin: false
    };
    login(demoUser);
  };

  const adminLogin = () => {
    const adminUser: User = {
      id: 'admin-001',
      name: 'Admin',
      email: 'admin@di-trade.de',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`,
      isAdmin: true
    };
    login(adminUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, demoLogin, adminLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
