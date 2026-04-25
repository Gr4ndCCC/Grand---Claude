import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

interface Option { value: string; label: string }
interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, options, error, className, id, ...rest },
  ref,
) {
  const fid = id ?? `s-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <label htmlFor={fid} className="block">
      {label && <span className="mono text-ink-soft mb-1.5 block">{label}</span>}
      <span
        className={cn(
          'relative flex items-center px-3 h-10 rounded-md bg-surface-raised border transition-colors',
          'focus-within:border-ember focus-within:shadow-focus',
          error ? 'border-ember-deep' : 'border-line-strong hover:border-ink-soft',
        )}
      >
        <select
          ref={ref}
          id={fid}
          className={cn(
            'ember-focus appearance-none flex-1 bg-transparent text-ink text-base outline-none pr-6',
            className,
          )}
          {...rest}
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={16} strokeWidth={1.75} className="absolute right-3 text-ink-soft pointer-events-none" />
      </span>
      {error && <span className="mono mt-1.5 block text-ember-deep">{error}</span>}
    </label>
  );
});
