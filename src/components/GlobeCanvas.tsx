import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

const MARKERS = [
  { location: [40.7128, -74.006] as [number, number],   size: 0.07 },
  { location: [41.8827, -87.6233] as [number, number],  size: 0.05 },
  { location: [51.5074, -0.1278] as [number, number],   size: 0.08 },
  { location: [52.3676, 4.9041] as [number, number],    size: 0.06 },
  { location: [52.52, 13.405] as [number, number],      size: 0.06 },
  { location: [41.9028, 12.4964] as [number, number],   size: 0.05 },
  { location: [38.7223, -9.1393] as [number, number],   size: 0.05 },
  { location: [48.8566, 2.3522] as [number, number],    size: 0.07 },
  { location: [35.6762, 139.6503] as [number, number],  size: 0.07 },
  { location: [31.2304, 121.4737] as [number, number],  size: 0.05 },
  { location: [19.076, 72.8777] as [number, number],    size: 0.05 },
  { location: [-26.2041, 28.0473] as [number, number],  size: 0.05 },
  { location: [-23.5505, -46.6333] as [number, number], size: 0.06 },
  { location: [-33.8688, 151.2093] as [number, number], size: 0.05 },
  { location: [52.2297, 21.0122] as [number, number],   size: 0.04 },
  { location: [41.0082, 28.9784] as [number, number],   size: 0.05 },
  { location: [55.7558, 37.6173] as [number, number],   size: 0.05 },
  { location: [1.3521, 103.8198] as [number, number],   size: 0.04 },
  { location: [-34.6037, -58.3816] as [number, number], size: 0.05 },
  { location: [30.0444, 31.2357] as [number, number],   size: 0.04 },
  { location: [41.3851, 2.1734] as [number, number],    size: 0.05 },
  { location: [37.9838, 23.7275] as [number, number],   size: 0.04 },
];

export function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = canvas.offsetWidth;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globe = (createGlobe as any)(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: width * 2,
      height: width * 2,
      phi: 0.6,
      theta: 0.15,
      dark: 1,
      diffuse: 2.2,
      mapSamples: 20000,
      mapBrightness: 3.5,
      baseColor: [0.06, 0.06, 0.06],
      markerColor: [0.88, 0.12, 0.04],
      glowColor: [0.45, 0.04, 0.04],
      markers: MARKERS,
      onRender: (state: Record<string, unknown>) => {
        state.phi = phiRef.current;
        phiRef.current += 0.0025;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    const ro = new ResizeObserver(() => {
      width = canvas.offsetWidth;
    });
    ro.observe(canvas);

    return () => {
      globe.destroy();
      ro.disconnect();
    };
  }, []);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(128,0,0,0.18)', border: '1px solid rgba(128,0,0,0.4)',
        borderRadius: '999px', padding: '6px 16px', whiteSpace: 'nowrap',
        zIndex: 2, backdropFilter: 'blur(4px)',
      }}>
        <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--maroon)', marginRight: 8, verticalAlign: 'middle', boxShadow: '0 0 6px rgba(180,0,0,0.8)' }} />
        <span className="mono" style={{ color: 'var(--maroon)', fontSize: '11px', letterSpacing: '0.14em' }}>
          {MARKERS.length} LIVE FIRES ACROSS THE WORLD
        </span>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', aspectRatio: '1', maxWidth: '560px', cursor: 'grab' }}
      />
    </div>
  );
}
