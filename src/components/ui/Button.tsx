import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'relative inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-orange/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ember-bg',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        // Sizes
        size === 'sm' && 'text-xs px-3 py-1.5 rounded-lg',
        size === 'md' && 'text-sm px-5 py-2.5 rounded-xl',
        size === 'lg' && 'text-base px-7 py-3.5 rounded-xl',
        // Variants
        variant === 'primary' && [
          'bg-fire-gradient text-white',
          'hover:opacity-90 active:scale-[0.98]',
          'shadow-ember hover:shadow-ember-lg',
        ],
        variant === 'secondary' && [
          'bg-ember-surface2 text-ember-cream border border-ember-border',
          'hover:bg-ember-surface3 active:scale-[0.98]',
          'shadow-inset-border',
        ],
        variant === 'ghost' && [
          'bg-transparent text-ember-muted',
          'hover:bg-ember-surface2 hover:text-ember-cream active:scale-[0.98]',
        ],
        variant === 'outline' && [
          'bg-transparent text-ember-orange border border-ember-orange/50',
          'hover:bg-ember-orange/10 active:scale-[0.98]',
        ],
        variant === 'danger' && [
          'bg-red-600/20 text-red-400 border border-red-500/30',
          'hover:bg-red-600/30 active:scale-[0.98]',
        ],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}
