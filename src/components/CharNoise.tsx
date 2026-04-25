import { useEffect, useState } from 'react';

export function CharNoise() {
  const [opacity, setOpacity] = useState(0.04);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max <= 0 ? 0 : Math.min(1, window.scrollY / max);
      setOpacity(reduced ? 0.04 : 0.04 + ratio * 0.05);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div className="char-noise" style={{ ['--noise-opacity' as string]: opacity }} aria-hidden />;
}
