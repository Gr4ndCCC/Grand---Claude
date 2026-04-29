import { createContext, useContext, useState, ReactNode } from 'react';

export type VerifyStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface User {
  email: string;
  name: string;
  dob: string;
  joinedAt: number;
  verifyStatus?: VerifyStatus;
  verifySubmittedAt?: number;
}

interface AuthCtx {
  user: User | null;
  openAuth: (reason?: string) => void;
  closeAuth: () => void;
  isOpen: boolean;
  pendingReason: string;
  signIn: (u: User) => void;
  signOut: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem('ember_user');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [pendingReason, setPendingReason] = useState('');

  const openAuth = (reason = '') => { setPendingReason(reason); setIsOpen(true); };
  const closeAuth = () => setIsOpen(false);

  const signIn = (u: User) => {
    setUser(u);
    localStorage.setItem('ember_user', JSON.stringify(u));
    setIsOpen(false);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('ember_user');
  };

  const updateUser = (patch: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem('ember_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <Ctx.Provider value={{ user, openAuth, closeAuth, isOpen, pendingReason, signIn, signOut, updateUser }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export function useGated(action: () => void, reason = '') {
  const { user, openAuth } = useAuth();
  return () => {
    if (user) action();
    else openAuth(reason);
  };
}
