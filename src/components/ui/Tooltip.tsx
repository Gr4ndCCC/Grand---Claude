import { useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface Props { label: string; children: ReactNode; className?: string }

export function Tooltip({ label, children, className }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            'mono absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap',
            'bg-char-0 text-ink-inverse px-2 py-1 rounded-sm shadow-2 z-50',
            className,
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}
