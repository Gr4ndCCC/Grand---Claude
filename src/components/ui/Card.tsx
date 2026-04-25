import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'plain' | 'raised' | 'sunk';
interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  interactive?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  plain:  'bg-surface border border-line',
  raised: 'bg-surface-raised border border-line shadow-1',
  sunk:   'bg-surface-sunk border border-line',
};

export const Card = forwardRef<HTMLDivElement, Props>(function Card(
  { variant = 'raised', interactive, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg p-5',
        VARIANTS[variant],
        interactive &&
          'transition ease-flame duration-200 hover:-translate-y-0.5 hover:shadow-2 cursor-pointer',
        className,
      )}
      {...rest}
    />
  );
});
