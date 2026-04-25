import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'link';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-ember text-ink-inverse hover:bg-ember-hot active:bg-ember-deep ' +
    'shadow-ember disabled:bg-char-4 disabled:shadow-none',
  secondary:
    'bg-transparent text-ink border border-line-strong hover:bg-surface-sunk ' +
    'active:bg-ash-2 disabled:text-ink-soft disabled:border-line',
  ghost:
    'bg-transparent text-ink hover:bg-surface-sunk active:bg-ash-2 ' +
    'disabled:text-ink-soft',
  link:
    'bg-transparent text-ember hover:text-ember-hot underline underline-offset-4 ' +
    'decoration-line-strong hover:decoration-ember p-0 h-auto',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-base gap-2',
  lg: 'h-12 px-6 text-lg gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', loading, iconLeft, iconRight, children, className, disabled, onMouseMove, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--spark-x', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--spark-y', `${e.clientY - r.top}px`);
        onMouseMove?.(e);
      }}
      className={cn(
        'spark ember-focus inline-flex items-center justify-center rounded-md font-medium ' +
          'transition-colors duration-150 ease-flame disabled:cursor-not-allowed',
        variant !== 'link' && SIZES[size],
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span className="grill-mark h-2 w-12 rounded-pill" aria-label="loading" />
      ) : (
        <>
          {iconLeft}
          {children}
          {iconRight}
        </>
      )}
    </button>
  );
});
