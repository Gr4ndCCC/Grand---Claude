import { type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Size = 'xs' | 'sm' | 'md' | 'lg';
interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: Size;
  ring?: boolean;
}

const SIZES: Record<Size, { box: string; text: string }> = {
  xs: { box: 'w-6  h-6  text-[10px]', text: '' },
  sm: { box: 'w-8  h-8  text-xs',     text: '' },
  md: { box: 'w-10 h-10 text-sm',     text: '' },
  lg: { box: 'w-14 h-14 text-base',   text: '' },
};

const initials = (name: string) =>
  name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

const HUES = ['#b85332', '#993f24', '#550000', '#423a35', '#6b6258'];

export function Avatar({ name, src, size = 'md', ring, className, ...rest }: Props) {
  const bg = HUES[name.charCodeAt(0) % HUES.length];
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-pill text-ink-inverse font-medium select-none',
        SIZES[size].box,
        ring && 'ring-2 ring-paper ring-offset-2 ring-offset-surface',
        className,
      )}
      style={src ? undefined : { background: bg }}
      {...rest}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover rounded-pill" />
      ) : (
        initials(name)
      )}
    </div>
  );
}
