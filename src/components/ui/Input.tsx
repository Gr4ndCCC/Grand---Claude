import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, hint, error, iconLeft, className, id, ...rest },
  ref,
) {
  const fid = id ?? `i-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <label htmlFor={fid} className="block">
      {label && (
        <span className="mono text-ink-soft mb-1.5 block">{label}</span>
      )}
      <span
        className={cn(
          'flex items-center gap-2 px-3 h-10 rounded-md bg-surface-raised border transition-colors',
          'focus-within:border-ember focus-within:shadow-focus',
          error ? 'border-ember-deep' : 'border-line-strong hover:border-ink-soft',
        )}
      >
        {iconLeft && <span className="text-ink-soft shrink-0">{iconLeft}</span>}
        <input
          ref={ref}
          id={fid}
          className={cn(
            'ember-focus flex-1 bg-transparent text-ink text-base placeholder:text-ink-soft ' +
              'outline-none border-0',
            className,
          )}
          {...rest}
        />
      </span>
      {(hint || error) && (
        <span className={cn('mono mt-1.5 block', error ? 'text-ember-deep' : 'text-ink-soft')}>
          {error ?? hint}
        </span>
      )}
    </label>
  );
});
