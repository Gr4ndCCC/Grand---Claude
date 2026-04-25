import { useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '../lib/cn';

type Status = 'yes' | 'maybe' | 'no';
const OPTIONS: { id: Status; label: string }[] = [
  { id: 'yes',   label: "I'm in" },
  { id: 'maybe', label: 'Maybe'  },
  { id: 'no',    label: "Can't"  },
];

interface Props {
  value?: Status;
  onChange?: (s: Status) => void;
  disabled?: boolean;
  className?: string;
}

export function RSVPPill({ value, onChange, disabled, className }: Props) {
  const [wisp, setWisp] = useState<{ id: number; x: number } | null>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  const select = (id: Status, x?: number) => {
    onChange?.(id);
    if (id === 'yes' && x !== undefined) {
      const wid = Date.now();
      setWisp({ id: wid, x });
      setTimeout(() => setWisp(w => (w?.id === wid ? null : w)), 1500);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!groupRef.current || disabled) return;
    const idx = OPTIONS.findIndex(o => o.id === value);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      const next = OPTIONS[(idx + 1 + OPTIONS.length) % OPTIONS.length];
      select(next.id);
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      const next = OPTIONS[(idx - 1 + OPTIONS.length) % OPTIONS.length];
      select(next.id);
      e.preventDefault();
    }
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label="RSVP"
      onKeyDown={onKey}
      className={cn('relative inline-flex p-1 rounded-pill bg-surface-sunk border border-line', className)}
    >
      {OPTIONS.map(o => {
        const on = value === o.id;
        return (
          <button
            key={o.id}
            role="radio"
            aria-checked={on}
            disabled={disabled}
            tabIndex={on || (!value && o.id === 'yes') ? 0 : -1}
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              select(o.id, r.left + r.width / 2 - (groupRef.current?.getBoundingClientRect().left ?? 0));
            }}
            className={cn(
              'ember-focus relative px-4 h-9 rounded-pill text-sm font-medium transition-colors',
              on ? 'bg-ember text-ink-inverse shadow-ember' : 'text-ink-mid hover:text-ink',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            {o.label}
          </button>
        );
      })}
      {wisp && (
        <span
          key={wisp.id}
          className="smoke-wisp"
          style={{ left: wisp.x, bottom: -4 }}
          aria-hidden
        />
      )}
    </div>
  );
}
