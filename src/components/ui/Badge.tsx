import { type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'neutral' | 'ember' | 'maroon' | 'positive';
interface Props extends HTMLAttributes<HTMLSpanElement> { tone?: Tone }

const TONES: Record<Tone, string> = {
  neutral:  'bg-surface-sunk text-ink border-line',
  ember:    'bg-ember/12 text-ember-deep border-ember/30',
  maroon:   'bg-maroon/8 text-maroon border-maroon/30',
  positive: 'bg-ash-2 text-ink border-line',
};

export function Badge({ tone = 'neutral', className, ...rest }: Props) {
  return (
    <span
      className={cn(
        'mono inline-flex items-center px-2 h-5 rounded-sm border',
        TONES[tone],
        className,
      )}
      {...rest}
    />
  );
}
