type Props = {
  size?: number;
  className?: string;
  withWord?: boolean;
};

export function Logo({ size = 28, className = '', withWord = false }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="emberFlame" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%"  stopColor="#550000" />
            <stop offset="55%" stopColor="#993f24" />
            <stop offset="100%" stopColor="#b85332" />
          </linearGradient>
        </defs>
        {/* outer flame */}
        <path
          d="M16 3.5c0 0 -7.5 6.2 -7.5 13.4 c0 4.7 3.4 8.6 7.5 8.6 s7.5 -3.9 7.5 -8.6 c0 -3.6 -2.1 -6.7 -4 -8.5 c-1.7 1.5 -2.5 3 -2.5 5.5 c0 2 -1 3 -2 3 c-1.5 0 -2 -2.5 -1 -4.5 c1 -2 1.5 -5.5 2 -8.9 z"
          fill="url(#emberFlame)"
        />
        {/* inner highlight (paper warm) */}
        <path
          d="M16 14.5 c-1.6 1.6 -2.6 3.6 -2.6 5.4 c0 1.7 1.2 3.1 2.6 3.1 s2.6 -1.4 2.6 -3.1 c0 -1.8 -1 -3.8 -2.6 -5.4 z"
          fill="#f6f1ea"
          opacity="0.65"
        />
        {/* glowing core */}
        <ellipse cx="16" cy="20.5" rx="1.4" ry="2" fill="#f6f1ea" opacity="0.9" />
      </svg>
      {withWord && (
        <span className="font-display text-xl text-ink tracking-tight">Ember</span>
      )}
    </span>
  );
}
