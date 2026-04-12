import { type ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'orange' | 'amber' | 'green' | 'blue' | 'ghost' | 'red';
  size?: 'sm' | 'md';
  icon?: ReactNode;
}

export function Badge({ children, variant = 'ghost', size = 'md', icon }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-medium rounded-full',
        size === 'sm' && 'text-xs px-2 py-0.5',
        size === 'md' && 'text-xs px-2.5 py-1',
        variant === 'orange' && 'bg-ember-orange/15 text-ember-orange border border-ember-orange/25',
        variant === 'amber' && 'bg-ember-amber/15 text-ember-amber border border-ember-amber/25',
        variant === 'green' && 'bg-ember-green/15 text-ember-green border border-ember-green/25',
        variant === 'blue' && 'bg-ember-blue/15 text-ember-blue border border-ember-blue/25',
        variant === 'red' && 'bg-red-500/15 text-red-400 border border-red-500/25',
        variant === 'ghost' && 'bg-ember-surface2 text-ember-muted border border-ember-border',
      )}
    >
      {icon && <span className="text-[10px]">{icon}</span>}
      {children}
    </span>
  );
}
