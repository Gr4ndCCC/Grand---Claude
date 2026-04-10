interface EmberLogoProps {
  size?: number;
  withText?: boolean;
  className?: string;
}

export function EmberLogo({ size = 32, withText = true, className = '' }: EmberLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="logoFire" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8341A" />
            <stop offset="50%" stopColor="#FF5C1A" />
            <stop offset="100%" stopColor="#FFAA33" />
          </linearGradient>
          <linearGradient id="logoCore" x1="0%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#FF5C1A" />
            <stop offset="100%" stopColor="#FFD166" />
          </linearGradient>
        </defs>
        {/* Outer flame */}
        <path
          d="M16 2C16 2 9 9 9 15.5C9 19.642 12.134 23 16 23C19.866 23 23 19.642 23 15.5C23 9 16 2 16 2Z"
          fill="url(#logoFire)"
        />
        {/* Inner bright core */}
        <path
          d="M16 11C16 11 12.5 15 12.5 18C12.5 20.209 14.015 22 16 22C17.985 22 19.5 20.209 19.5 18C19.5 15 16 11 16 11Z"
          fill="url(#logoCore)"
          opacity="0.9"
        />
        {/* Glow dot */}
        <circle cx="16" cy="17" r="2" fill="#FFD166" opacity="0.7" />
        {/* Base grate shadow */}
        <ellipse cx="16" cy="28" rx="7" ry="2" fill="#FF5C1A" opacity="0.2" />
        {/* Grate bars */}
        <rect x="9" y="25" width="14" height="1.5" rx="0.75" fill="#FF5C1A" opacity="0.4" />
        <rect x="11" y="27.5" width="10" height="1.5" rx="0.75" fill="#FF5C1A" opacity="0.25" />
      </svg>
      {withText && (
        <span
          className="font-black text-xl tracking-tight leading-none"
          style={{
            background: 'linear-gradient(135deg, #FF5C1A 0%, #FFAA33 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ember
        </span>
      )}
    </div>
  );
}
