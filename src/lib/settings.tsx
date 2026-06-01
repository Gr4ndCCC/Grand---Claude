import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { supabase } from './supabase';

export type ThemeMode = 'dark' | 'light' | 'system';
export type FontSize  = 'small' | 'medium' | 'large';

/**
 * All user preferences. Persisted to profiles.settings (jsonb) so they follow
 * the account across devices and survive logout/login. localStorage is only a
 * fast local cache to avoid a flash before the backend value loads — the
 * backend is always the source of truth once signed in.
 */
export interface Settings {
  // appearance
  theme:        ThemeMode;
  fontSize:     FontSize;
  reduceMotion: boolean;
  compact:      boolean;
  // personalization
  accent:          string;
  defaultView:     'grid' | 'list';
  emojiReactions:  boolean;
  recommendations: boolean;
  // general
  language:   string;
  timezone:   string;
  tempUnit:   'C' | 'F';
  dateFormat: string;
  // speech
  voiceCommands: boolean;
  speechLang:    string;
  speechToText:  boolean;
}

export const DEFAULT_ACCENT = '#800000';

const DEFAULTS: Settings = {
  theme: 'dark', fontSize: 'medium', reduceMotion: false, compact: false,
  accent: DEFAULT_ACCENT, defaultView: 'grid', emojiReactions: true, recommendations: true,
  language: 'English', timezone: 'UTC+0 London', tempUnit: 'C', dateFormat: 'DD/MM/YYYY',
  voiceCommands: false, speechLang: 'English', speechToText: false,
};

interface SettingsCtx extends Settings {
  set:             (patch: Partial<Settings>) => void;
  // convenience setters kept for existing callers
  setTheme:        (t: ThemeMode) => void;
  setFontSize:     (f: FontSize)  => void;
  setReduceMotion: (v: boolean)   => void;
  setCompact:      (v: boolean)   => void;
}

const STORAGE_KEY = 'ember_settings';

function loadCache(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULTS;
}

/** Only keep known keys with the right shape when merging an untrusted blob. */
function sanitize(blob: unknown): Partial<Settings> {
  if (!blob || typeof blob !== 'object') return {};
  const out: Partial<Settings> = {};
  const b = blob as Record<string, unknown>;
  for (const key of Object.keys(DEFAULTS) as (keyof Settings)[]) {
    const v = b[key];
    if (v !== undefined && typeof v === typeof DEFAULTS[key]) {
      (out as Record<string, unknown>)[key] = v;
    }
  }
  return out;
}

function lighten(hex: string, amt = 0.18): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) + 255 * amt));
  const g = Math.min(255, Math.round(((n >> 8) & 255) + 255 * amt));
  const b = Math.min(255, Math.round((n & 255) + 255 * amt));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function applyToDOM(s: Settings) {
  const html = document.documentElement;
  let effective: 'dark' | 'light' = 'dark';
  if (s.theme === 'system') {
    effective = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } else {
    effective = s.theme;
  }
  html.setAttribute('data-ember-theme',        effective);
  html.setAttribute('data-ember-font',          s.fontSize);
  html.setAttribute('data-ember-reduce-motion', String(s.reduceMotion));
  html.setAttribute('data-ember-compact',       String(s.compact));

  // Accent: override the burgundy family so buttons, toggles, focus rings and
  // highlights that use var(--maroon)/var(--burgundy) pick up the chosen colour.
  // Burgundy is the default — clear the overrides so the brand tokens win.
  const accentVars = ['--maroon', '--maroon-light', '--burgundy', '--rank-ember', '--accent'];
  if (s.accent && s.accent.toLowerCase() !== DEFAULT_ACCENT.toLowerCase()) {
    html.style.setProperty('--maroon', s.accent);
    html.style.setProperty('--maroon-light', lighten(s.accent));
    html.style.setProperty('--burgundy', s.accent);
    html.style.setProperty('--rank-ember', s.accent);
    html.style.setProperty('--accent', s.accent);
  } else {
    accentVars.forEach(v => html.style.removeProperty(v));
  }
}

const Ctx = createContext<SettingsCtx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Settings>(loadCache);
  const userIdRef = useRef<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Apply current settings to the DOM whenever they change.
  useEffect(() => { applyToDOM(s); }, [s]);

  // React to OS light/dark changes while in 'system' mode.
  useEffect(() => {
    if (s.theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => applyToDOM(s);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [s]);

  // Load backend settings on sign-in (source of truth); cache locally too.
  useEffect(() => {
    let active = true;

    const hydrateFromBackend = async (userId: string) => {
      userIdRef.current = userId;
      const { data, error } = await supabase
        .from('profiles').select('settings').eq('id', userId).maybeSingle();
      if (!active || error || !data) return;
      const merged = { ...DEFAULTS, ...loadCache(), ...sanitize(data.settings) };
      setS(merged);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)); } catch { /* ignore */ }
    };

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) hydrateFromBackend(data.session.user.id);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) { userIdRef.current = null; return; }
      hydrateFromBackend(session.user.id);
    });

    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  // User-driven change: update state, cache, and debounce a backend save.
  const set = (patch: Partial<Settings>) => {
    setS(prev => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      const userId = userIdRef.current;
      if (userId) {
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => {
          supabase.from('profiles').update({ settings: next }).eq('id', userId)
            .then(({ error }) => { if (error) console.error('settings save', error); });
        }, 500);
      }
      return next;
    });
  };

  return (
    <Ctx.Provider value={{
      ...s,
      set,
      setTheme:        t => set({ theme: t }),
      setFontSize:     f => set({ fontSize: f }),
      setReduceMotion: v => set({ reduceMotion: v }),
      setCompact:      v => set({ compact: v }),
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider');
  return ctx;
}
