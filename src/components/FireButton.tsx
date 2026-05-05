import { useState, useRef } from 'react';

type Burst = { id: number; x: number; y: number; sparks: { id: number; sx: number }[] };

/**
 * FireButton — wraps a button and emits a fire-burst + rising sparks
 * on click. Used for primary CTAs like "Find events", "Host", "Join event".
 */
export function FireButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...rest
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>) {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const idRef = useRef(0);
  const wrapRef = useRef<HTMLSpanElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = ++idRef.current;
      const sparks = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        sx: (Math.random() - 0.5) * 80,
      }));
      setBursts(b => [...b, { id, x, y, sparks }]);
      window.setTimeout(() => {
        setBursts(b => b.filter(burst => burst.id !== id));
      }, 1000);
    }
    onClick?.();
  };

  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '13px' },
    md: { padding: '12px 24px', fontSize: '15px' },
    lg: { padding: '16px 36px', fontSize: '16px' },
  }[size];

  const variantStyles =
    variant === 'primary'
      ? {
          background: 'var(--maroon)',
          color: '#fff',
          border: 'none',
          fontWeight: 600,
        }
      : variant === 'outline'
      ? {
          background: 'transparent',
          color: 'var(--beige)',
          border: '1px solid rgba(228,207,179,0.25)',
          fontWeight: 500,
        }
      : {
          background: 'rgba(255,255,255,0.06)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.12)',
          fontWeight: 500,
        };

  return (
    <span
      ref={wrapRef}
      className="fire-burst-wrap"
      style={{ display: fullWidth ? 'block' : 'inline-block', width: fullWidth ? '100%' : undefined }}
    >
      {bursts.map(({ id, x, y, sparks }) => (
        <span key={id} style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none' }}>
          <span className="fire-burst" />
          {sparks.map(s => (
            <span
              key={s.id}
              className="fire-spark"
              style={{ left: 0, top: 0, ['--sx' as any]: `${s.sx}px`, animationDelay: `${s.id * 30}ms` }}
            />
          ))}
        </span>
      ))}
      <button
        {...rest}
        onClick={handleClick}
        className="ember-focus"
        style={{
          ...sizeStyles,
          ...variantStyles,
          borderRadius: '10px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'all 0.25s var(--ease-spark)',
          width: fullWidth ? '100%' : undefined,
          position: 'relative',
          zIndex: 1,
          // Idle ember halo for primary — always faintly glowing like a coal
          boxShadow: variant === 'primary' ? '0 0 0 1px rgba(228,207,179,0.04), 0 4px 18px rgba(128,0,0,0.18)' : undefined,
        }}
        onMouseEnter={e => {
          if (variant === 'primary') {
            e.currentTarget.style.background = 'var(--maroon-light)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(228,207,179,0.10), 0 8px 32px rgba(128,0,0,0.55)';
          } else if (variant === 'outline') {
            e.currentTarget.style.background = 'rgba(228,207,179,0.07)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = 'rgba(228,207,179,0.45)';
          } else {
            e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
          }
        }}
        onMouseLeave={e => {
          if (variant === 'primary') {
            e.currentTarget.style.background = 'var(--maroon)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(228,207,179,0.04), 0 4px 18px rgba(128,0,0,0.18)';
          } else if (variant === 'outline') {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(228,207,179,0.25)';
          } else {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          }
        }}
      >
        {children}
      </button>
    </span>
  );
}
