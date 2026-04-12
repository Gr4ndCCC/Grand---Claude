import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SpinningEarthProps {
  size?: number;
  className?: string;
}

/** Draw a recognisable Earth onto a canvas — no network required as base layer */
function buildEarthCanvas(): HTMLCanvasElement {
  const W = 1024, H = 512;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Ocean
  const ocean = ctx.createLinearGradient(0, 0, 0, H);
  ocean.addColorStop(0,   '#0d2d4a');
  ocean.addColorStop(0.5, '#1a4a72');
  ocean.addColorStop(1,   '#0d2d4a');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, W, H);

  // Continent helper
  const land = (x: number, y: number, rx: number, ry: number, rot = 0) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(1, ry / rx);
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  ctx.fillStyle = '#2d6b2d';

  // North America
  land(210, 150, 105, 78, -0.15);
  land(180, 195, 55, 65,  0.1);

  // South America
  land(250, 295, 52, 85,  0.1);
  land(230, 370, 40, 40,  0);

  // Europe
  land(520, 155, 60, 45, -0.1);

  // Africa
  land(535, 255, 75, 100, 0.05);

  // Asia (main)
  land(720, 155, 165, 80, -0.08);
  // Indian sub-continent
  land(680, 230, 45, 60,  0.1);
  // Japan/SE Asia
  land(820, 210, 30, 40, -0.2);

  // Australia
  land(810, 345, 65, 42,  0.05);

  // Greenland
  land(310,  85, 40, 50,  0);

  // Land highlight (lighter green patches)
  ctx.fillStyle = '#3a8a3a';
  land(200, 140, 60, 40, -0.15);
  land(700, 148, 100, 50, -0.08);
  land(535, 245,  45,  60, 0.05);

  // Deserts (sandy tint)
  ctx.fillStyle = '#c8a04a';
  land(490, 190, 55, 35,  0);     // Sahara
  land(645, 185, 55, 30,  0);     // Arabian peninsula
  land(810, 350, 40, 25,  0);     // Australian interior

  // Polar ice caps
  const capGrad = ctx.createLinearGradient(0, 0, 0, 45);
  capGrad.addColorStop(0, '#e8f4f8');
  capGrad.addColorStop(1, 'rgba(232,244,248,0)');
  ctx.fillStyle = capGrad;
  ctx.fillRect(0, 0, W, 45);

  const capGrad2 = ctx.createLinearGradient(0, H - 45, 0, H);
  capGrad2.addColorStop(0, 'rgba(232,244,248,0)');
  capGrad2.addColorStop(1, '#e8f4f8');
  ctx.fillStyle = capGrad2;
  ctx.fillRect(0, H - 45, W, 45);

  // Subtle cloud wisps
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#ffffff';
  land(300, 120, 90, 18, 0.3);
  land(600, 200, 110, 15, -0.2);
  land(450, 310, 100, 14, 0.1);
  land(750, 280, 80,  16, -0.1);
  ctx.globalAlpha = 1;

  return canvas;
}

export function SpinningEarth({ size = 260, className = '' }: SpinningEarthProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Scene ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Camera ───────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
    camera.position.z = 2.6;

    // ── Renderer ─────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Stars ────────────────────────────────────────────────────────
    const STAR_COUNT = 1800;
    const starPos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 120;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, sizeAttenuation: true })
    );
    scene.add(stars);

    // ── Earth ────────────────────────────────────────────────────────
    const earthGeo = new THREE.SphereGeometry(1, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: new THREE.Color(0x224466),
      shininess: 8,
    });

    // Base texture from canvas (instant, network-free)
    const canvasTex = new THREE.CanvasTexture(buildEarthCanvas());
    earthMat.map = canvasTex;

    // Attempt to upgrade with real satellite photo
    new THREE.TextureLoader().load(
      'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg',
      tex => {
        earthMat.map = tex;
        earthMat.needsUpdate = true;
        canvasTex.dispose();
      }
    );

    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // ── Atmosphere glow ──────────────────────────────────────────────
    const atmosGeo = new THREE.SphereGeometry(1.04, 64, 64);
    const atmosMat = new THREE.MeshPhongMaterial({
      color: 0x5599ff,
      transparent: true,
      opacity: 0.10,
      side: THREE.FrontSide,
    });
    scene.add(new THREE.Mesh(atmosGeo, atmosMat));

    // ── Lighting ─────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x333344, 0.9));

    const sun = new THREE.DirectionalLight(0xfff5e0, 1.4);
    sun.position.set(5, 3, 5);
    scene.add(sun);

    // ── Animate ──────────────────────────────────────────────────────
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      earth.rotation.y  += 0.0028;
      stars.rotation.y  += 0.00008;
      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ──────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      earthMat.dispose();
      atmosMat.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden' }}
    />
  );
}
