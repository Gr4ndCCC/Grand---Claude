import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';

interface Props {
  to: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}

export function LiveCounter({ to, duration = 1400, format, className }: Props) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setVal(to); return; }

    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / duration);
      setVal(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return (
    <span ref={ref} className={cn('font-display tabular-nums', className)}>
      {format ? format(val) : val.toLocaleString()}
    </span>
  );
}
