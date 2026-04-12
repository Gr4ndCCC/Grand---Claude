import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { getMe } from '../services/auth';
import { CURRENT_USER } from '../data/mock';

interface AuthContextValue {
  user: User;
  setUser: (u: User) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: CURRENT_USER,
  setUser: () => {},
  loading: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(CURRENT_USER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to hydrate from a live session token; fall back to mock silently
    getMe()
      .then(apiUser => { if (apiUser) setUser(apiUser); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
