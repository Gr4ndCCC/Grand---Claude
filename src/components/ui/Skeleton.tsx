import { cn } from '../../lib/cn';

interface Props {
  w?: string | number;
  h?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'pill';
  className?: string;
}

export function Skeleton({ w = '100%', h = 14, rounded = 'md', className }: Props) {
  return (
    <span
      aria-hidden
      className={cn('grill-mark inline-block', `rounded-${rounded}`, className)}
      style={{ width: w, height: h }}
    />
  );
}
