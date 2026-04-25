import { cn } from '../lib/cn';

interface Props {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { box: 'w-12 h-12', num: 'text-base' },
  md: { box: 'w-16 h-16', num: 'text-xl'   },
  lg: { box: 'w-24 h-24', num: 'text-3xl'  },
};

export function EmberScore({ score, label, size = 'md', className }: Props) {
  const clamped = Math.max(0, Math.min(100, score));
  const r = 22;
  const c = 2 * Math.PI * r;
  const dash = c * (clamped / 100);

  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <div className={cn('relative grid place-items-center', SIZES[size].box)}>
        <svg viewBox="0 0 50 50" className="absolute inset-0 -rotate-90">
          <circle cx="25" cy="25" r={r} fill="none" stroke="var(--line)" strokeWidth="3" />
          <circle
            cx="25" cy="25" r={r}
            fill="none"
            stroke="var(--ember)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
          />
        </svg>
        <span className={cn('font-display font-medium text-ink', SIZES[size].num)}>
          {clamped}
        </span>
      </div>
      {label && (
        <div className="leading-tight">
          <p className="mono text-ink-soft">Ember score</p>
          <p className="text-base text-ink">{label}</p>
        </div>
      )}
    </div>
  );
}
