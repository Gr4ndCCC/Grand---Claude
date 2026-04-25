import { type SVGProps } from 'react';
import { cn } from '../lib/cn';

interface Props extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  pinX?: number;
  pinY?: number;
}

export function SatelliteMap({
  width = 320,
  height = 200,
  pinX = 60,
  pinY = 50,
  className,
  ...rest
}: Props) {
  return (
    <svg
      role="img"
      aria-label="Map preview"
      viewBox="0 0 320 200"
      width={width}
      height={height}
      className={cn('block', className)}
      preserveAspectRatio="xMidYMid slice"
      {...rest}
    >
      <defs>
        <linearGradient id="sat-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#efe7dd" />
          <stop offset="100%" stopColor="#e8e2dc" />
        </linearGradient>
        <pattern id="sat-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(20,17,15,0.05)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="320" height="200" fill="url(#sat-bg)" />
      <rect width="320" height="200" fill="url(#sat-grid)" />

      <path
        d="M 0 130 C 60 110, 120 150, 200 120 S 320 100, 320 100"
        fill="none"
        stroke="rgba(20,17,15,0.15)"
        strokeWidth="22"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M 0 130 C 60 110, 120 150, 200 120 S 320 100, 320 100"
        fill="none"
        stroke="#b85332"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.7"
      />

      <path d="M 60 60 q 30 -20 70 0 t 80 30 v 50 q -50 -10 -90 5 t -60 -25 z"
        fill="rgba(20,17,15,0.06)" />

      <g transform={`translate(${pinX} ${pinY})`}>
        <circle r="14" fill="#b85332" opacity="0.18" />
        <circle r="6" fill="#b85332" />
        <circle r="2" fill="#f6f1ea" />
      </g>
    </svg>
  );
}
