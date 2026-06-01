import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from './supabase';

export type VerifyStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type SubPlan = 'monthly' | 'annual' | null;
export type Rank = 'Ember' | 'Iron' | 'Gold' | 'Platinum' | 'Legend';

export interface User {
  id: string;
  email: string;
  name: string;            // display_name
  tier: Rank;
  dob?: string;
  joinedAt: number;
  verifyStatus?: VerifyStatus;
  subPlan?: SubPlan;
  subActive?: boolean;
  subSince?: number;
}

interface SignUpArgs { email: string; password: string; name: string; dob: string }
interface AuthResult { error: string | null; needsConfirmation?: boolean }

interface AuthCtx {
  user: User | null;
  loading: boolean;
  openAuth: (reason?: string) => void;
  closeAuth: () => void;
  isOpen: boolean;
  pendingReason: string;
  signUp: (args: SignUpArgs) => Promise<AuthResult>;
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateUser: (patch: Partial<Omit<User, 'id'>>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
}

const Ctx = createContext<AuthCtx | null>(null);

interface ProfileRow {
  id: string;
  email: string | null;
  display_name: string;
  tier: Rank;
  dob: string | null;
  verify_status: VerifyStatus;
  sub_plan: SubPlan;
  sub_active: boolean;
  sub_since: string | null;
  created_at: string;
}

function rowToUser(row: ProfileRow, fallbackEmail: string): User {
  return {
    id: row.id,
    email: row.email ?? fallbackEmail,
    name: row.display_name,
    tier: row.tier,
    dob: row.dob ?? undefined,
    joinedAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    verifyStatus: row.verify_status,
    subPlan: row.sub_plan,
    subActive: row.sub_active,
    subSince: row.sub_since ? new Date(row.sub_since).getTime() : undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingReason, setPendingReason] = useState('');

  const openAuth = (reason = '') => { setPendingReason(reason); setIsOpen(true); };
  const closeAuth = () => setIsOpen(false);

  // Load the profile for the currently authenticated user (keyed by user id only).
  const loadProfile = useCallback(async (userId: string, email: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) { console.error('profile load', error); return; }
    if (data) setUser(rowToUser(data as ProfileRow, email));
  }, []);

  useEffect(() => {
    // Clear legacy localStorage from the old client-only auth, once.
    try {
      localStorage.removeItem('ember_user');
      localStorage.removeItem('ember_events_v1');
    } catch {}

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      if (!active) return;
      if (session?.user) {
        loadProfile(session.user.id, session.user.email ?? '').finally(() => active && setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        return;
      }
      // SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED → resync profile by id
      loadProfile(session.user.id, session.user.email ?? '');
      setIsOpen(false);
    });

    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [loadProfile]);

  const signUp = async ({ email, password, name, dob }: SignUpArgs): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name, dob },
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });
    if (error) return { error: error.message };
    if (!data.session) return { error: null, needsConfirmation: true };
    return { error: null };
  };

  const signInWithPassword = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  };

  const signInWithGoogle = async (): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/account` },
    });
    return { error: error ? error.message : null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    // Belt-and-braces: clear any app caches so no stale account data lingers.
    try {
      localStorage.removeItem('ember_user');
      localStorage.removeItem('ember_events_v1');
      sessionStorage.clear();
    } catch {}
  };

  const updateUser = async (patch: Partial<Omit<User, 'id'>>) => {
    if (!user) return;
    const dbPatch: Record<string, unknown> = {};
    if (patch.name        !== undefined) dbPatch.display_name = patch.name;
    if (patch.tier        !== undefined) dbPatch.tier         = patch.tier;
    if (patch.dob         !== undefined) dbPatch.dob          = patch.dob;
    if (patch.verifyStatus !== undefined) dbPatch.verify_status = patch.verifyStatus;
    if (patch.subPlan     !== undefined) dbPatch.sub_plan     = patch.subPlan;
    if (patch.subActive   !== undefined) dbPatch.sub_active   = patch.subActive;
    if (patch.subSince    !== undefined) dbPatch.sub_since    = new Date(patch.subSince).toISOString();

    // optimistic local update
    setUser(prev => (prev ? { ...prev, ...patch } : prev));

    const { error } = await supabase.from('profiles').update(dbPatch).eq('id', user.id);
    if (error) { console.error('profile update', error); await loadProfile(user.id, user.email); }
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id, user.email);
  };

  // Sends a Supabase password-reset email. The link returns the user to
  // /account with a recovery session so they can set a new password. We never
  // reveal whether the address is registered — the caller shows a neutral
  // "if this email exists…" message regardless of the result.
  const requestPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/account?recovery=1`,
    });
    return { error: error ? error.message : null };
  };

  return (
    <Ctx.Provider value={{
      user, loading, openAuth, closeAuth, isOpen, pendingReason,
      signUp, signInWithPassword, signInWithGoogle, signOut, updateUser, refreshProfile,
      requestPasswordReset,
    }}>
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
