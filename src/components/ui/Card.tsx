import { type ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, glow = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'glass-card transition-all duration-300',
        hover && 'hover:border-ember-border hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
        glow && 'animate-pulse-ember',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
}
