import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';

interface Props {
  position?: 'top' | 'bottom';
  appearAt?: number;
  children: ReactNode;
  className?: string;
}

export function StickyBar({ position = 'top', appearAt = 0, children, className }: Props) {
  const [visible, setVisible] = useState(appearAt === 0);

  useEffect(() => {
    if (appearAt === 0) return;
    const onScroll = () => setVisible(window.scrollY > appearAt);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [appearAt]);

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-40 transition-transform duration-300 ease-flame',
        position === 'top' ? 'top-0' : 'bottom-0',
        visible ? 'translate-y-0' : position === 'top' ? '-translate-y-full' : 'translate-y-full',
        className,
      )}
    >
      {children}
    </div>
  );
}
