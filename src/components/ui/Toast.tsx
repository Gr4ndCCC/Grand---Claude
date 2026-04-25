import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

type Tone = 'neutral' | 'ember' | 'positive';
interface Toast { id: string; tone: Tone; message: string }

interface Ctx { push: (message: string, tone?: Tone) => void }
const ToastCtx = createContext<Ctx | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

const TONES: Record<Tone, string> = {
  neutral:  'bg-char-0 text-ink-inverse border-char-3',
  ember:    'bg-ember text-ink-inverse border-ember-deep',
  positive: 'bg-paper text-ink border-line-strong',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((message: string, tone: Tone = 'neutral') => {
    const id = Math.random().toString(36).slice(2);
    setItems(prev => [...prev, { id, tone, message }]);
  }, []);

  const dismiss = (id: string) => setItems(prev => prev.filter(t => t.id !== id));

  useEffect(() => {
    if (items.length === 0) return;
    const id = items[items.length - 1].id;
    const timer = setTimeout(() => dismiss(id), 3500);
    return () => clearTimeout(timer);
  }, [items]);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
        {items.map(t => (
          <div
            key={t.id}
            role="status"
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-md border shadow-2 max-w-sm',
              TONES[t.tone],
            )}
          >
            <span className="text-sm">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="ember-focus opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
