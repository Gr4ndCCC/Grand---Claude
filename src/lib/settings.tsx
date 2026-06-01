import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light' | 'system';
export type FontSize  = 'small' | 'medium' | 'large';

interface Settings {
  theme:        ThemeMode;
  fontSize:     FontSize;
  reduceMotion: boolean;
  compact:      boolean;
}

interface SettingsCtx extends Settings {
  setTheme:        (t: ThemeMode) => void;
  setFontSize:     (f: FontSize)  => void;
  setReduceMotion: (v: boolean)   => void;
  setCompact:      (v: boolean)   => void;
}

const DEFAULTS: Settings = { theme: 'dark', fontSize: 'medium', reduceMotion: false, compact: false };

function load(): Settings {
  try {
    const raw = localStorage.getItem('ember_settings');
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULTS;
}

function applyToDOM(s: Settings) {
  const html = document.documentElement;
  let effective: 'dark' | 'light' = 'dark';
  if (s.theme === 'system') {
    effective = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } else {
    effective = s.theme;
  }
  html.setAttribute('data-ember-theme',         effective);
  html.setAttribute('data-ember-font',           s.fontSize);
  html.setAttribute('data-ember-reduce-motion',  String(s.reduceMotion));
  html.setAttribute('data-ember-compact',        String(s.compact));
}

const Ctx = createContext<SettingsCtx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Settings>(load);

  useEffect(() => {
    applyToDOM(s);
    try { localStorage.setItem('ember_settings', JSON.stringify(s)); } catch {}
  }, [s]);

  // react to OS light/dark changes when mode is 'system'
  useEffect(() => {
    if (s.theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => applyToDOM(s);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [s]);

  return (
    <Ctx.Provider value={{
      ...s,
      setTheme:        t => setS(p => ({ ...p, theme:        t })),
      setFontSize:     f => setS(p => ({ ...p, fontSize:     f })),
      setReduceMotion: v => setS(p => ({ ...p, reduceMotion: v })),
      setCompact:      v => setS(p => ({ ...p, compact:      v })),
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
