import { type HTMLAttributes } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  removable?: boolean;
  onRemove?: () => void;
}

export function Tag({ removable, onRemove, className, children, ...rest }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 h-7 px-2.5 rounded-pill bg-surface-sunk',
        'border border-line text-ink text-sm',
        className,
      )}
      {...rest}
    >
      {children}
      {removable && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          className="ember-focus text-ink-soft hover:text-ink rounded-sm"
          aria-label="Remove tag"
        >
          <X size={12} strokeWidth={2} />
        </button>
      )}
    </span>
  );
}
