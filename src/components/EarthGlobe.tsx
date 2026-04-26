import { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ── Event pins ─────────────────────────────────────────── */
const EVENT_PINS = [
  { lat: 52.4,  lon: 4.9,   city: 'Amsterdam',    title: 'Sunset Grill',        guests: 8,  max: 12 },
  { lat: 35.7,  lon: 139.7, city: 'Tokyo',         title: 'Yakitori Night',      guests: 6,  max: 10 },
  { lat: 40.7,  lon: -74.0, city: 'New York',      title: 'Brooklyn Smoke',      guests: 14, max: 20 },
  { lat: 38.7,  lon: -9.1,  city: 'Lisbon',        title: 'Riverside Fire',      guests: 7,  max: 10 },
  { lat: 41.9,  lon: 12.5,  city: 'Rome',          title: 'Terrace Embers',      guests: 9,  max: 12 },
  { lat: -23.5, lon: -46.6, city: 'São Paulo',     title: 'Churrasco Night',     guests: 18, max: 25 },
  { lat: 51.5,  lon: -0.1,  city: 'London',        title: 'Thames Smokehouse',   guests: 11, max: 15 },
  { lat: 52.5,  lon: 13.4,  city: 'Berlin',        title: 'Fire & Rye',          guests: 5,  max: 8  },
  { lat: -33.9, lon: 151.2, city: 'Sydney',        title: 'Harbour Grill',       guests: 12, max: 16 },
  { lat: 19.1,  lon: 72.9,  city: 'Mumbai',        title: 'Tandoor & Coal',      guests: 8,  max: 12 },
  { lat: -26.2, lon: 28.0,  city: 'Johannesburg',  title: 'Braai Night',         guests: 20, max: 24 },
  { lat: 41.0,  lon: 28.9,  city: 'Istanbul',      title: 'Bosphorus Grill',     guests: 7,  max: 10 },
  { lat: 31.2,  lon: 121.5, city: 'Shanghai',      title: 'Fire & Wok',          guests: 10, max: 14 },
  { lat: 52.2,  lon: 21.0,  city: 'Warsaw',        title: 'Old Town Smoke',      guests: 6,  max: 8  },
  { lat: 41.4,  lon: 2.2,   city: 'Barcelona',     title: 'Rooftop Embers',      guests: 13, max: 18 },
];

function latLonToVec3(lat: number, lon: number, r = 1.02): THREE.Vector3 {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

/* ── Canvas Earth texture (procedural) ─────────────────── */
function makeEarthTexture(): THREE.CanvasTexture {
  const W = 1024, H = 512;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d')!;

  /* ocean */
  const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
  g.addColorStop(0, '#030F1C');
  g.addColorStop(1, '#010810');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  /* continent-ish land masses via ellipses + blob fills (mercator projection) */
  const land: [number, number, number, number][] = [
    /* lon-center, lat-center, w, h  — rough elliptical approximations */
    [-100, 50, 80, 30],  // N America
    [-60,  -15, 40, 35], // S America
    [20,   15, 45, 45],  // Africa
    [15,   52, 30, 18],  // Europe
    [75,   45, 55, 30],  // Asia (W)
    [120,  35, 35, 25],  // Asia (E)
    [35,   25, 20, 15],  // Middle East
    [133, -25, 25, 20],  // Australia
    [30,   -5, 10, 10],  // Horn of Africa
  ];

  for (const [lonC, latC, dLon, dLat] of land) {
    const cx = ((lonC + 180) / 360) * W;
    const cy = ((90 - latC) / 180) * H;
    const rx = (dLon / 360) * W;
    const ry = (dLat / 180) * H;

    const lg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
    lg.addColorStop(0, 'rgba(15,32,20,0.95)');
    lg.addColorStop(0.5, 'rgba(10,22,14,0.75)');
    lg.addColorStop(1, 'rgba(5,12,8,0)');
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 1.2, ry * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /* city light dots — sparse warm points */
  const cityLights: [number, number][] = [
    [-74, 40.7], [2, 48.8], [139.7, 35.7], [151.2, -33.9],
    [-0.1, 51.5], [13.4, 52.5], [12.5, 41.9], [28, -26.2],
    [72.9, 19.1], [121.5, 31.2], [-46.6, -23.5], [28.9, 41],
    [-9.1, 38.7], [2.2, 41.4], [21, 52.2], [4.9, 52.4],
    [37.6, 55.7], [126.9, 37.6], [77.2, 28.6], [103.8, 1.3],
    [-87.6, 41.8], [-118, 34], [-43.2, -22.9], [144.9, -37.8],
  ];

  for (const [lon, lat] of cityLights) {
    const x = ((lon + 180) / 360) * W;
    const y = ((90 - lat) / 180) * H;
    const r = Math.random() * 3 + 1.5;
    const cg = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
    cg.addColorStop(0, 'rgba(255,240,180,0.85)');
    cg.addColorStop(1, 'rgba(255,200,100,0)');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 3, r * 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /* graticule lines — very faint */
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 0.5;
  for (let lon = -180; lon <= 180; lon += 30) {
    const x = ((lon + 180) / 360) * W;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let lat = -90; lat <= 90; lat += 30) {
    const y = ((90 - lat) / 180) * H;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  return new THREE.CanvasTexture(cv);
}

/* ── Atmosphere shader ─────────────────────────────────── */
const atmVert = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const atmFrag = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0,0.0,1.0)), 3.0);
    gl_FragColor = vec4(0.05, 0.2, 0.8, 1.0) * intensity * 0.7;
  }
`;

/* ── Fire pin (instanced) ─────────────────────────────── */
function FirePins({ onHover }: { onHover: (pin: typeof EVENT_PINS[0] | null) => void }) {
  const pinsRef = useRef<THREE.InstancedMesh>(null!);
  const glowRef = useRef<THREE.InstancedMesh>(null!);
  const mat = useMemo(() => new THREE.Matrix4(), []);
  const positions = useMemo(() => EVENT_PINS.map(p => latLonToVec3(p.lat, p.lon)), []);
  const count = EVENT_PINS.length;

  useMemo(() => {
    positions.forEach((pos, i) => {
      mat.setPosition(pos);
      pinsRef.current?.setMatrixAt(i, mat);
      glowRef.current?.setMatrixAt(i, mat);
    });
    if (pinsRef.current) pinsRef.current.instanceMatrix.needsUpdate = true;
    if (glowRef.current) glowRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, mat]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = 1 + Math.sin(t * 2.2) * 0.3;
    positions.forEach((pos, i) => {
      mat.makeScale(s, s, s);
      mat.setPosition(pos.clone().multiplyScalar(1));
      glowRef.current?.setMatrixAt(i, mat);
    });
    if (glowRef.current) glowRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* core dot */}
      <instancedMesh ref={pinsRef} args={[undefined, undefined, count]} onClick={e => {
        e.stopPropagation();
        const idx = e.instanceId ?? 0;
        onHover(EVENT_PINS[idx]);
      }}>
        <sphereGeometry args={[0.013, 8, 8]} />
        <meshBasicMaterial color="#cc1100" toneMapped={false} />
      </instancedMesh>
      {/* glow ring */}
      <instancedMesh ref={glowRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshBasicMaterial color="#800000" transparent opacity={0.35} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

/* ── Earth mesh ─────────────────────────────────────────── */
function Earth({ onPinHover }: { onPinHover: (p: typeof EVENT_PINS[0] | null) => void }) {
  const earthRef = useRef<THREE.Mesh>(null!);
  const texture = useMemo(() => makeEarthTexture(), []);

  useFrame((_, delta) => {
    earthRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group>
      {/* planet */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 80, 80]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.9}
          metalness={0.05}
          emissive={new THREE.Color('#010508')}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* atmosphere */}
      <mesh>
        <sphereGeometry args={[1.07, 64, 64]} />
        <shaderMaterial
          vertexShader={atmVert}
          fragmentShader={atmFrag}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
          transparent
          depthWrite={false}
        />
      </mesh>

      <FirePins onHover={onPinHover} />
    </group>
  );
}

/* ── Scene ─────────────────────────────────────────────── */
function Scene({ onPinHover }: { onPinHover: (p: typeof EVENT_PINS[0] | null) => void }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#d4c0a0" />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#3050ff" />
      <Stars radius={120} depth={60} count={2500} factor={4} saturation={0} fade speed={0.5} />
      <Earth onPinHover={onPinHover} />
      <OrbitControls
        enablePan={false}
        minDistance={1.6}
        maxDistance={3.5}
        autoRotate={false}
        rotateSpeed={0.5}
        zoomSpeed={0.6}
      />
    </>
  );
}

/* ── Public component ─────────────────────────────────── */
export function EarthGlobe() {
  const [hovered, setHovered] = useState<typeof EVENT_PINS[0] | null>(null);

  return (
    <div style={{ position: 'relative', width: '100%', height: '520px', borderRadius: '16px', overflow: 'hidden', background: '#020408', border: '1px solid rgba(228,207,179,0.08)' }}>

      {/* live fires badge */}
      <div style={{ position: 'absolute', top: '18px', left: '18px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          background: 'rgba(128,0,0,0.30)', border: '1px solid rgba(128,0,0,0.60)',
          borderRadius: '8px', padding: '6px 14px',
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#cc2200', boxShadow: '0 0 6px #cc2200', animation: 'ember-pulse 1.6s infinite' }} />
          <span className="mono" style={{ color: '#fff', fontSize: '11px', letterSpacing: '0.12em' }}>
            LIVE FIRES · {EVENT_PINS.length}
          </span>
        </span>
      </div>

      {/* hint */}
      <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <span className="mono" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>drag to rotate · scroll to zoom · click a fire to see event</span>
      </div>

      {/* tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute', top: '18px', right: '18px', zIndex: 10,
          background: '#111', border: '1px solid rgba(128,0,0,0.50)',
          borderRadius: '12px', padding: '16px 20px', minWidth: '200px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
        }}>
          <p className="mono" style={{ color: 'var(--maroon)', fontSize: '10px', marginBottom: '4px' }}>LIVE EVENT</p>
          <p style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#fff', fontSize: '17px', marginBottom: '4px' }}>{hovered.title}</p>
          <p className="mono" style={{ color: '#A0A0A0', fontSize: '12px', marginBottom: '8px' }}>{hovered.city}</p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="mono" style={{ color: 'var(--beige)', fontSize: '11px' }}>{hovered.guests}/{hovered.max} going</span>
            <span style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
              <span style={{ display: 'block', height: '100%', width: `${(hovered.guests / hovered.max) * 100}%`, background: 'var(--maroon)', borderRadius: '99px' }} />
            </span>
          </div>
          <button onClick={() => setHovered(null)} style={{ position: 'absolute', top: '8px', right: '10px', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>×</button>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: false, powerPreference: 'default' }}
      >
        <Suspense fallback={null}>
          <Scene onPinHover={setHovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}
