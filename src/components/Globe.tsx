import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const EVENT_PINS = [
  { name: 'Amsterdam',    lat: 52.36,  lng:   4.89 },
  { name: 'London',       lat: 51.51,  lng:  -0.12 },
  { name: 'Paris',        lat: 48.86,  lng:   2.35 },
  { name: 'New York',     lat: 40.71,  lng: -74.00 },
  { name: 'Los Angeles',  lat: 34.05,  lng:-118.24 },
  { name: 'Sydney',       lat:-33.87,  lng: 151.21 },
  { name: 'Tokyo',        lat: 35.68,  lng: 139.69 },
  { name: 'São Paulo',    lat:-23.55,  lng: -46.63 },
  { name: 'Moscow',       lat: 55.75,  lng:  37.62 },
  { name: 'Singapore',    lat:  1.35,  lng: 103.82 },
  { name: 'Mexico City',  lat: 19.43,  lng: -99.13 },
  { name: 'Johannesburg', lat:-26.20,  lng:  28.04 },
  { name: 'Stockholm',    lat: 59.33,  lng:  18.07 },
  { name: 'Barcelona',    lat: 41.38,  lng:   2.17 },
  { name: 'Prague',       lat: 50.08,  lng:  14.43 },
];

function latLngToVec3(lat: number, lng: number, r = 1.02): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

function buildEarthTexture(): HTMLCanvasElement {
  const W = 2048, H = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Deep ocean
  const ocean = ctx.createLinearGradient(0, 0, 0, H);
  ocean.addColorStop(0,   '#091f35');
  ocean.addColorStop(0.4, '#0d2d4e');
  ocean.addColorStop(0.6, '#0d2d4e');
  ocean.addColorStop(1,   '#091f35');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, W, H);

  // Helper: draw continent blob
  const blob = (x: number, y: number, rx: number, ry: number, rot = 0, color = '#1e5c1e') => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(rx, ry);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // North America
  blob(410, 300, 215, 155, -0.15, '#1a5c1a');
  blob(355, 390, 110, 130,  0.10, '#1a5c1a');
  blob(340, 530,  80,  80,  0,    '#1a5c1a');

  // South America
  blob(500, 595, 105, 170,  0.10, '#1a5c1a');
  blob(460, 740,  80,  80,  0,    '#1a5c1a');

  // Europe
  blob(1040, 305, 120,  90, -0.10, '#1e621e');
  blob(1100, 250,  60,  50,  0,    '#1e621e');

  // Africa
  blob(1075, 510, 150, 200,  0.05, '#1e621e');
  blob(1040, 700,  90,  90,  0,    '#1e621e');

  // Asia (main)
  blob(1440, 305, 330, 160, -0.08, '#1e621e');
  blob(1360, 460,  90, 120,  0.10, '#1e621e');
  blob(1640, 420,  60,  80, -0.20, '#1e621e');
  blob(1700, 310,  80,  60,  0,    '#1e621e');

  // Australia
  blob(1620, 690, 130,  84,  0.05, '#1e621e');

  // Greenland
  blob(620, 170,  80, 100,  0,    '#2a7a2a');

  // Land highlights
  ctx.globalAlpha = 0.4;
  blob(400, 285, 130,  90, -0.15, '#2d8c2d');
  blob(1400, 295, 200,  95, -0.08, '#2d8c2d');
  blob(1070, 495,  90, 120,  0.05, '#2d8c2d');

  // Desert tones
  ctx.globalAlpha = 0.55;
  blob(980, 375,  110,  70,  0,    '#c8a04a');  // Sahara
  blob(1290, 370, 110,  60,  0,    '#c8a04a');  // Arabia
  blob(1620, 695,  80,  50,  0,    '#c4975a');  // Australia interior
  ctx.globalAlpha = 1;

  // Polar caps
  const capN = ctx.createLinearGradient(0, 0, 0, 80);
  capN.addColorStop(0, '#d8edf5');
  capN.addColorStop(1, 'rgba(216,237,245,0)');
  ctx.fillStyle = capN;
  ctx.fillRect(0, 0, W, 80);

  const capS = ctx.createLinearGradient(0, H - 80, 0, H);
  capS.addColorStop(0, 'rgba(216,237,245,0)');
  capS.addColorStop(1, '#d8edf5');
  ctx.fillStyle = capS;
  ctx.fillRect(0, H - 80, W, 80);

  // Cloud wisps
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#ffffff';
  blob(600, 240,  180,  36, 0.30);
  blob(1200, 400, 220,  30, -0.20);
  blob(900, 620,  200,  28,  0.10);
  blob(1500, 560, 160,  32, -0.10);
  blob(300, 480,  140,  26,  0.20);
  ctx.globalAlpha = 1;

  return canvas;
}

function buildPinTexture(color: string): HTMLCanvasElement {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d')!;
  const cx = size / 2, cy = size / 2;

  // Outer glow
  const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, size / 2);
  grad.addColorStop(0,   color.replace('rgb', 'rgba').replace(')', ', 0.6)'));
  grad.addColorStop(0.5, color.replace('rgb', 'rgba').replace(')', ', 0.2)'));
  grad.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Inner dot
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // White center
  ctx.beginPath();
  ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  return c;
}

interface GlobeProps {
  /** 'hero'=full viewport | 'sidebar'=fixed size panel */
  mode?: 'hero' | 'sidebar';
  width?: number;
  height?: number;
  className?: string;
}

export function Globe({ mode = 'hero', width = 600, height = 600, className = '' }: GlobeProps) {
  const mountRef  = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tipPos,  setTipPos]  = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth  || width;
    const H = el.clientHeight || height;

    // ── Scene ────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 1000);
    camera.position.z = mode === 'hero' ? 2.8 : 2.6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Stars ────────────────────────────────────────────────
    const starCount = 2500;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 200;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, sizeAttenuation: true })
    );
    scene.add(stars);

    // ── Earth ────────────────────────────────────────────────
    const earthGeo = new THREE.SphereGeometry(1, 72, 72);
    const canvasTex = new THREE.CanvasTexture(buildEarthTexture());
    const earthMat = new THREE.MeshPhongMaterial({
      map:       canvasTex,
      specular:  new THREE.Color(0x112244),
      shininess: 12,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // ── Atmosphere ───────────────────────────────────────────
    const atmosMat = new THREE.MeshPhongMaterial({
      color: 0x3366cc, transparent: true, opacity: 0.08, side: THREE.FrontSide,
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.05, 72, 72), atmosMat));

    // Thin rim glow
    const rimMat = new THREE.MeshPhongMaterial({
      color: 0x4488ff, transparent: true, opacity: 0.06, side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.08, 72, 72), rimMat));

    // ── Event pins ───────────────────────────────────────────
    const pinTexture = new THREE.CanvasTexture(buildPinTexture('#800000'));
    const pinMat = new THREE.SpriteMaterial({
      map: pinTexture, transparent: true, depthTest: false,
    });

    const pinObjects: Array<{ sprite: THREE.Sprite; name: string }> = [];
    EVENT_PINS.forEach(({ name, lat, lng }) => {
      const pos    = latLngToVec3(lat, lng, 1.04);
      const sprite = new THREE.Sprite(pinMat.clone());
      sprite.position.copy(pos);
      sprite.scale.set(0.09, 0.09, 1);
      scene.add(sprite);
      pinObjects.push({ sprite, name });
    });

    // ── Lighting ─────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x334455, 1.0));
    const sun = new THREE.DirectionalLight(0xfff8e0, 1.6);
    sun.position.set(5, 3, 5);
    scene.add(sun);

    // ── Interaction ──────────────────────────────────────────
    let isDragging     = false;
    let prevX          = 0;
    let prevY          = 0;
    let autoRotate     = true;
    let rotY           = 0;
    let rotX           = 0;
    let velocityX      = 0;
    let velocityY      = 0;
    const DAMP         = 0.92;

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      autoRotate = false;
      const pt = 'touches' in e ? e.touches[0] : e;
      prevX = pt.clientX; prevY = pt.clientY;
    };
    const onUp = () => { isDragging = false; };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const pt = 'touches' in e ? e.touches[0] : e;
      const dx = pt.clientX - prevX;
      const dy = pt.clientY - prevY;
      velocityX = dx * 0.004;
      velocityY = dy * 0.004;
      rotY += velocityX;
      rotX += velocityY;
      rotX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotX));
      prevX = pt.clientX; prevY = pt.clientY;
    };

    // Raycaster for hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width)  *  2 - 1;
      mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(pinObjects.map(p => p.sprite));
      if (hits.length > 0) {
        const hit = pinObjects.find(p => p.sprite === hits[0].object);
        if (hit) {
          setHovered(hit.name);
          setTipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top - 20 });
        }
      } else {
        setHovered(null);
      }
    };

    renderer.domElement.addEventListener('mousedown',  onDown);
    renderer.domElement.addEventListener('touchstart', onDown);
    window.addEventListener('mouseup',   onUp);
    window.addEventListener('touchend',  onUp);
    renderer.domElement.addEventListener('mousemove',  onMove);
    renderer.domElement.addEventListener('touchmove',  onMove);
    renderer.domElement.addEventListener('mousemove',  onMouseMove);

    // ── Resize ───────────────────────────────────────────────
    const onResize = () => {
      const nW = el.clientWidth, nH = el.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    // ── Animate ──────────────────────────────────────────────
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);

      if (!isDragging) {
        velocityX *= DAMP;
        velocityY *= DAMP;
        if (autoRotate) velocityX = 0.0018;
        rotY += velocityX;
        rotX += velocityY;
        rotX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotX));
      }

      earth.rotation.y = rotY;
      earth.rotation.x = rotX;
      // Keep atmosphere aligned
      scene.children.forEach(c => {
        if (c instanceof THREE.Mesh && c !== earth) {
          c.rotation.copy(earth.rotation);
        }
      });
      // Pins follow earth
      pinObjects.forEach(({ sprite }, i) => {
        const { lat, lng } = EVENT_PINS[i];
        const base = latLngToVec3(lat, lng, 1.04);
        base.applyEuler(earth.rotation);
        sprite.position.copy(base);
        // Hide pins on back side
        const camDir = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
        sprite.material.opacity = sprite.position.dot(camDir) > 0 ? 1 : 0;
      });

      stars.rotation.y += 0.00005;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener('mousedown',  onDown);
      renderer.domElement.removeEventListener('touchstart', onDown);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('touchend',  onUp);
      renderer.domElement.removeEventListener('mousemove',  onMove);
      renderer.domElement.removeEventListener('touchmove',  onMove);
      renderer.domElement.removeEventListener('mousemove',  onMouseMove);
      renderer.dispose();
      earthMat.dispose();
      canvasTex.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [mode, width, height]);

  return (
    <div className={`relative ${className}`} style={mode === 'hero' ? { width: '100%', height: '100%' } : { width, height }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      {hovered && (
        <div
          className="pointer-events-none absolute z-10 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            left: tipPos.x,
            top:  tipPos.y,
            background: 'rgba(17,17,17,0.95)',
            border: '1px solid rgba(228,207,179,0.3)',
            color: '#E4CFB3',
            transform: 'translate(-50%, -100%)',
            whiteSpace: 'nowrap',
          }}
        >
          🔥 {hovered}
        </div>
      )}
    </div>
  );
}
