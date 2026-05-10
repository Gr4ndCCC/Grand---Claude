import { useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';

/* ── City data — approximate equirectangular positions in a 1000×420 grid ── */
interface CityDef {
  name: string;
  x: number;
  y: number;
  size: 'sm' | 'md' | 'lg';
  labelSide: 'right' | 'left';
  delay: number;
  pulseDur: number; /* pre-computed so no Math.random on re-render */
}

const CITIES: CityDef[] = [
  { name: 'New York',   x: 188, y: 162, size: 'lg', labelSide: 'right', delay: 0,    pulseDur: 3.2 },
  { name: 'Chicago',    x: 148, y: 152, size: 'md', labelSide: 'right', delay: 0.1,  pulseDur: 2.8 },
  { name: 'São Paulo',  x: 238, y: 338, size: 'md', labelSide: 'right', delay: 0.3,  pulseDur: 3.6 },
  { name: 'Lisbon',     x: 430, y: 162, size: 'sm', labelSide: 'left',  delay: 0.4,  pulseDur: 2.6 },
  { name: 'London',     x: 460, y: 128, size: 'lg', labelSide: 'right', delay: 0.05, pulseDur: 3.4 },
  { name: 'Amsterdam',  x: 482, y: 114, size: 'md', labelSide: 'right', delay: 0.15, pulseDur: 2.9 },
  { name: 'Paris',      x: 471, y: 144, size: 'md', labelSide: 'right', delay: 0.2,  pulseDur: 3.1 },
  { name: 'Berlin',     x: 512, y: 110, size: 'md', labelSide: 'right', delay: 0.25, pulseDur: 2.7 },
  { name: 'Warsaw',     x: 534, y: 114, size: 'sm', labelSide: 'right', delay: 0.35, pulseDur: 3.0 },
  { name: 'Rome',       x: 504, y: 164, size: 'md', labelSide: 'right', delay: 0.45, pulseDur: 3.3 },
  { name: 'Athens',     x: 545, y: 176, size: 'sm', labelSide: 'right', delay: 0.5,  pulseDur: 2.5 },
  { name: 'Istanbul',   x: 564, y: 156, size: 'md', labelSide: 'right', delay: 0.55, pulseDur: 3.5 },
  { name: 'Moscow',     x: 606, y: 92,  size: 'md', labelSide: 'right', delay: 0.6,  pulseDur: 2.9 },
  { name: 'Dubai',      x: 634, y: 208, size: 'md', labelSide: 'right', delay: 0.65, pulseDur: 3.2 },
  { name: 'Singapore',  x: 784, y: 258, size: 'lg', labelSide: 'left',  delay: 0.7,  pulseDur: 3.8 },
  { name: 'Shanghai',   x: 844, y: 174, size: 'md', labelSide: 'left',  delay: 0.75, pulseDur: 2.8 },
  { name: 'Tokyo',      x: 882, y: 160, size: 'lg', labelSide: 'left',  delay: 0.8,  pulseDur: 3.0 },
  { name: 'Sydney',     x: 916, y: 354, size: 'md', labelSide: 'left',  delay: 0.85, pulseDur: 3.4 },
  { name: 'Cape Town',  x: 540, y: 368, size: 'sm', labelSide: 'right', delay: 0.9,  pulseDur: 2.6 },
];

/* Connections: pairs of city names forming the brotherhood network */
const CONNECTIONS: [string, string][] = [
  ['New York',  'London'],
  ['New York',  'Chicago'],
  ['New York',  'São Paulo'],
  ['London',    'Amsterdam'],
  ['London',    'Paris'],
  ['London',    'Lisbon'],
  ['Amsterdam', 'Berlin'],
  ['Berlin',    'Warsaw'],
  ['Warsaw',    'Moscow'],
  ['Lisbon',    'Rome'],
  ['Rome',      'Athens'],
  ['Athens',    'Istanbul'],
  ['Istanbul',  'Moscow'],
  ['Istanbul',  'Dubai'],
  ['Dubai',     'Singapore'],
  ['Singapore', 'Shanghai'],
  ['Singapore', 'Sydney'],
  ['Shanghai',  'Tokyo'],
  ['Tokyo',     'Sydney'],
  ['Cape Town', 'Dubai'],
];

const DOT_R:   Record<CityDef['size'], number> = { sm: 2.5, md: 3.5, lg: 5   };
const HALO_R:  Record<CityDef['size'], number> = { sm: 7,   md: 10,  lg: 16  };
const PULSE_R: Record<CityDef['size'], number> = { sm: 11,  md: 16,  lg: 24  };

export function CityNetwork() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const cityMap = useMemo(
    () => Object.fromEntries(CITIES.map(c => [c.name, c])),
    []
  );

  return (
    /* Outer wrapper — no border, no background.
       Left/right edges fade to transparent so the map bleeds into the page. */
    <div style={{
      position: 'relative',
      width: '100%',
      overflow: 'visible',
      maskImage:
        'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%), ' +
        'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
      maskComposite: 'intersect',
      WebkitMaskImage:
        'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%), ' +
        'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
      WebkitMaskComposite: 'source-in',
    }}>
      <svg
        ref={ref}
        viewBox="0 0 1000 420"
        width="100%"
        style={{ display: 'block', overflow: 'visible' }}
        aria-hidden
      >
        <defs>
          {/* Ember glow filter — soft, atmospheric */}
          <filter id="cn-glow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cn-glow-sm" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Ember core gradient — orange-white center to deep maroon edge */}
          <radialGradient id="cn-ember-core" cx="35%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="rgba(255, 215, 120, 0.95)" />
            <stop offset="35%"  stopColor="rgba(210, 70, 15, 0.9)" />
            <stop offset="100%" stopColor="rgba(100, 0, 0, 0.75)" />
          </radialGradient>

          {/* Halo gradient — deep maroon with transparency */}
          <radialGradient id="cn-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(180, 0, 0, 0.22)" />
            <stop offset="100%" stopColor="rgba(100, 0, 0, 0)" />
          </radialGradient>
        </defs>

        {/* ── Subtle latitude/longitude grid lines ────────────── */}
        {[0.2, 0.4, 0.6, 0.8].map(t => (
          <line key={`v${t}`} x1={t * 1000} y1={0} x2={t * 1000} y2={420}
            stroke="rgba(245,237,224,0.025)" strokeWidth="0.5" />
        ))}
        {[0.25, 0.5, 0.75].map(t => (
          <line key={`h${t}`} x1={0} y1={t * 420} x2={1000} y2={t * 420}
            stroke="rgba(245,237,224,0.025)" strokeWidth="0.5" />
        ))}

        {/* ── Network connection lines ─────────────────────────── */}
        {CONNECTIONS.map(([aName, bName]) => {
          const a = cityMap[aName];
          const b = cityMap[bName];
          if (!a || !b) return null;
          return (
            <motion.line
              key={`${aName}–${bName}`}
              x1={a.x} y1={a.y}
              x2={b.x} y2={b.y}
              stroke="rgba(128, 0, 0, 0.15)"
              strokeWidth="0.7"
              strokeDasharray="3 6"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 2, delay: 0.6, ease: 'easeOut' }}
            />
          );
        })}

        {/* ── City markers + labels ────────────────────────────── */}
        {CITIES.map(({ name, x, y, size, labelSide, delay, pulseDur }) => {
          const dot   = DOT_R[size];
          const halo  = HALO_R[size];
          const pulse = PULSE_R[size];
          const labelX = labelSide === 'right' ? x + dot + 7 : x - dot - 7;
          const fontSize = size === 'lg' ? 9 : size === 'md' ? 8 : 7;

          return (
            <motion.g
              key={name}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
              style={{ originX: `${x}px`, originY: `${y}px` }}
              transition={{
                duration: 0.7,
                delay: delay + 0.3,
                ease: [0.34, 1.56, 0.64, 1], /* spring overshoot */
              }}
            >
              {/* Outer atmospheric halo */}
              <circle cx={x} cy={y} r={halo} fill="url(#cn-halo)" />

              {/* Pulsing ring — animates via SVG animate, matching ember pulse */}
              <circle
                cx={x} cy={y}
                r={dot + 4}
                fill="none"
                stroke="rgba(180, 0, 0, 0.35)"
                strokeWidth="0.6"
              >
                <animate
                  attributeName="r"
                  values={`${dot + 2};${pulse};${dot + 2}`}
                  dur={`${pulseDur}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.55;0;0.55"
                  dur={`${pulseDur}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Main ember dot with gradient + glow */}
              <circle
                cx={x} cy={y} r={dot}
                fill="url(#cn-ember-core)"
                filter="url(#cn-glow-sm)"
              />

              {/* Bright specular highlight — top-left corner of ember */}
              <circle
                cx={x - dot * 0.28}
                cy={y - dot * 0.28}
                r={dot * 0.38}
                fill="rgba(255, 230, 160, 0.65)"
              />

              {/* City label — white-space never clips */}
              <text
                x={labelX}
                y={y + fontSize * 0.38}
                textAnchor={labelSide === 'right' ? 'start' : 'end'}
                fontSize={fontSize}
                fontFamily="'JetBrains Mono', 'Courier New', monospace"
                letterSpacing="0.09em"
                fill="rgba(245, 237, 224, 0.5)"
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                {name.toUpperCase()}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
