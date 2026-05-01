import { useRef, useEffect } from 'react';

export interface FireGraphProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

const NODE_COUNT = 30;
const SPRING_LEN = 140;
const SPRING_K   = 0.025;
const REPULSION  = 6500;
const DAMPING    = 0.82;
const CENTER_K   = 0.004;
const EDGE_PROB  = 0.22;

const CITIES = [
  'New York', 'London', 'Tokyo', 'Paris', 'Dubai', 'Singapore',
  'Mumbai', 'Sydney', 'Lagos', 'Istanbul', 'São Paulo', 'Los Angeles',
  'Beijing', 'Shanghai', 'Hong Kong', 'Seoul', 'Mexico City', 'Cairo',
  'Jakarta', 'Bangkok', 'Nairobi', 'Toronto', 'Amsterdam', 'Berlin',
  'Madrid', 'Rome', 'Johannesburg', 'Buenos Aires', 'Moscow', 'Karachi',
  'Chicago', 'Miami', 'Barcelona', 'Athens', 'Casablanca',
];

const DOT_COLORS = ['#bf4a14', '#f69742', '#951902', '#fba24b'];
const LINE_COLOR = { r: 67, g: 34, b: 16 }; // #432210

const DOT_RGB = DOT_COLORS.map(hex => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
}));

// Flame variant per color: glowMult controls halo size, particleMult controls spark density
const FLAME_VARIANTS = [
  { glowMult: 3.8, glowAlpha: 0.42, particleMult: 1.0 }, // #bf4a14 orange-red, medium
  { glowMult: 4.5, glowAlpha: 0.36, particleMult: 1.3 }, // #f69742 bright orange, wide
  { glowMult: 2.8, glowAlpha: 0.54, particleMult: 0.7 }, // #951902 deep crimson, tight
  { glowMult: 5.0, glowAlpha: 0.30, particleMult: 1.6 }, // #fba24b warm gold, softest
];

interface Node {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  heat: number;
  radius: number;
  label: string;
  ignited: boolean;
  igniteTimer: number;
  colorIdx: number;
}

interface Edge {
  a: number; b: number;
  heat: number;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; size: number; heat: number;
  colorIdx: number;
}

export function FireGraph({ width, height, className, style }: FireGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const maybeCtx = canvas.getContext('2d');
    if (!maybeCtx) return;
    const ctx: CanvasRenderingContext2D = maybeCtx;

    let rafId = 0;
    let cooldownId: ReturnType<typeof setInterval>;
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let particles: Particle[] = [];
    let dragNode: number | null = null;
    let dragOffX = 0, dragOffY = 0;
    let lastMX = 0, lastMY = 0;
    let releaseVX = 0, releaseVY = 0;
    const startTime = performance.now();

    function initGraph(w: number, h: number) {
      const shuffled = [...CITIES].sort(() => Math.random() - 0.5);
      nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
        id: i,
        x: w * 0.35 + Math.random() * w * 0.60,
        y: h * 0.15 + Math.random() * h * 0.70,
        vx: 0, vy: 0,
        heat: Math.random() * 0.3 + 0.05,
        radius: 6 + Math.random() * 12,
        label: shuffled[i % shuffled.length],
        ignited: false,
        igniteTimer: 0,
        colorIdx: Math.floor(Math.random() * 4),
      }));
      edges = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          if (Math.random() < EDGE_PROB) {
            edges.push({ a: i, b: j, heat: Math.random() * 0.3 + 0.05 });
          }
        }
      }
    }

    function getDims() {
      if (width && height) return { w: width, h: height };
      return { w: canvas.offsetWidth || 500, h: canvas.offsetHeight || 400 };
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const { w, h } = getDims();
      if (w === 0 || h === 0) return;
      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initGraph(w, h);
      particles = [];
    }

    resize();

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas.parentElement ?? canvas);

    function canvasXY(e: MouseEvent | Touch) {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function nodeAt(x: number, y: number) {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const dx = n.x - x, dy = n.y - y;
        if (dx * dx + dy * dy <= (n.radius + 8) ** 2) return i;
      }
      return null;
    }

    function heatEdgesOf(idx: number, amount: number) {
      edges.forEach(e => {
        if (e.a === idx || e.b === idx)
          e.heat = Math.min(1.0, e.heat + amount);
      });
    }

    function onMouseDown(e: MouseEvent) {
      const { x, y } = canvasXY(e);
      const i = nodeAt(x, y);
      if (i !== null) {
        dragNode = i; dragOffX = nodes[i].x - x; dragOffY = nodes[i].y - y;
        lastMX = x; lastMY = y;
        canvas.style.cursor = 'grabbing';
      }
    }
    function onMouseMove(e: MouseEvent) {
      const { x, y } = canvasXY(e);
      if (dragNode !== null) {
        releaseVX = x - lastMX; releaseVY = y - lastMY;
        lastMX = x; lastMY = y;
        nodes[dragNode].x  = x + dragOffX;
        nodes[dragNode].y  = y + dragOffY;
        nodes[dragNode].vx = 0; nodes[dragNode].vy = 0;
        nodes[dragNode].heat = 1.0;
        heatEdgesOf(dragNode, 0.04);
      } else {
        canvas.style.cursor = nodeAt(x, y) !== null ? 'grab' : 'default';
      }
    }
    function onMouseUp() {
      if (dragNode !== null) {
        nodes[dragNode].vx = releaseVX;
        nodes[dragNode].vy = releaseVY;
        dragNode = null;
      }
      canvas.style.cursor = 'default';
    }
    function onDblClick(e: MouseEvent) {
      const { x, y } = canvasXY(e);
      const i = nodeAt(x, y);
      if (i === null) return;
      const n = nodes[i];
      n.ignited = true; n.igniteTimer = 3000; n.heat = 1.0;
      n.radius = Math.max(n.radius, 10);
      edges.forEach(ed => {
        if (ed.a === i) { nodes[ed.b].heat = Math.min(1.0, nodes[ed.b].heat + 0.3); ed.heat = Math.min(1.0, ed.heat * 1.8); }
        if (ed.b === i) { nodes[ed.a].heat = Math.min(1.0, nodes[ed.a].heat + 0.3); ed.heat = Math.min(1.0, ed.heat * 1.8); }
      });
    }

    function onTouchStart(e: TouchEvent) {
      e.preventDefault();
      const { x, y } = canvasXY(e.touches[0]);
      const i = nodeAt(x, y);
      if (i !== null) {
        dragNode = i; dragOffX = nodes[i].x - x; dragOffY = nodes[i].y - y;
        lastMX = x; lastMY = y; nodes[i].heat = 1.0;
      }
    }
    function onTouchMove(e: TouchEvent) {
      e.preventDefault();
      if (dragNode === null) return;
      const { x, y } = canvasXY(e.touches[0]);
      releaseVX = x - lastMX; releaseVY = y - lastMY;
      lastMX = x; lastMY = y;
      nodes[dragNode].x  = x + dragOffX;
      nodes[dragNode].y  = y + dragOffY;
      nodes[dragNode].vx = 0; nodes[dragNode].vy = 0;
      nodes[dragNode].heat = 1.0;
      heatEdgesOf(dragNode, 0.04);
    }
    function onTouchEnd() {
      if (dragNode !== null) {
        nodes[dragNode].vx = releaseVX; nodes[dragNode].vy = releaseVY;
        dragNode = null;
      }
    }

    canvas.addEventListener('mousedown',  onMouseDown);
    canvas.addEventListener('mousemove',  onMouseMove);
    canvas.addEventListener('mouseup',    onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
    canvas.addEventListener('dblclick',   onDblClick);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: false });
    canvas.addEventListener('touchend',   onTouchEnd);

    cooldownId = setInterval(() => {
      edges.forEach(e => { e.heat = e.heat * 0.98 + 0.002; });
    }, 100);

    function draw(ts: number) {
      const time = ts - startTime;
      const { w: W, h: H } = getDims();
      // Center of gravity shifted right so the network clusters on the right side
      const cx = W * 0.65, cy = H / 2;

      /* ── physics ── */
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (i === dragNode) { n.heat = 1.0; continue; }
        let fx = 0, fy = 0;

        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const m = nodes[j];
          const dx = n.x - m.x, dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
          const f = REPULSION / (dist * dist);
          fx += (dx / dist) * f;
          fy += (dy / dist) * f;
        }
        edges.forEach(ed => {
          const other = ed.a === i ? ed.b : ed.b === i ? ed.a : -1;
          if (other < 0) return;
          const m = nodes[other];
          const dx = m.x - n.x, dy = m.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
          const f = SPRING_K * (dist - SPRING_LEN);
          fx += (dx / dist) * f;
          fy += (dy / dist) * f;
        });
        fx += (cx - n.x) * CENTER_K;
        fy += (cy - n.y) * CENTER_K;

        n.vx = (n.vx + fx) * DAMPING;
        n.vy = (n.vy + fy) * DAMPING;
        n.x += n.vx; n.y += n.vy;

        if (n.ignited) {
          n.heat = 1.0;
          n.igniteTimer -= 16;
          if (n.igniteTimer <= 0) { n.ignited = false; n.igniteTimer = 0; }
        } else {
          n.heat = Math.max(0.05, n.heat * 0.995);
        }
      }

      /* ── spawn particles ── */
      nodes.forEach(n => {
        const variant = FLAME_VARIANTS[n.colorIdx];
        const count = n.ignited ? 6 : Math.floor(n.heat * 2.5 * variant.particleMult);
        for (let k = 0; k < count; k++) {
          particles.push({
            x: n.x + (Math.random() - 0.5) * n.radius,
            y: n.y + (Math.random() - 0.5) * n.radius,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(Math.random() * 1.5 + 0.5),
            life: 1.0, size: Math.random() * 2 + 1, heat: n.heat,
            colorIdx: n.colorIdx,
          });
        }
      });
      if (particles.length > 900) particles.splice(0, particles.length - 900);

      /* ── update particles ── */
      particles = particles.filter(p => p.life > 0.05);
      particles.forEach(p => {
        p.vy -= 0.05;
        p.life *= 0.91;
        p.size *= 0.97;
        p.vx += (Math.random() - 0.5) * 0.36;
        p.x += p.vx; p.y += p.vy;
      });

      /* ── 1. clear ── */
      ctx.clearRect(0, 0, W, H);

      /* ── 2. soft warm hearth glow centered on right cluster ── */
      const bg = ctx.createRadialGradient(W * 0.65, H / 2, 0, W * 0.65, H / 2, Math.max(W, H) * 0.6);
      bg.addColorStop(0,    'rgba(40,22,14,0.28)');
      bg.addColorStop(0.55, 'rgba(20,10,6,0.10)');
      bg.addColorStop(1,    'rgba(9,5,4,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      /* ── 3. edges — source-over so #432210 renders visibly on dark bg ── */
      ctx.save();
      edges.forEach(ed => {
        const na = nodes[ed.a], nb = nodes[ed.b];
        if (!na || !nb) return;
        const t = ed.heat;
        const midX = (na.x + nb.x) / 2;
        const midY = (na.y + nb.y) / 2;
        const mx = midX + Math.sin(time * 0.0008 + na.id) * 6;
        const my = midY + Math.cos(time * 0.0008 + nb.id) * 6;

        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.quadraticCurveTo(mx, my, nb.x, nb.y);
        ctx.strokeStyle = `rgba(${LINE_COLOR.r},${LINE_COLOR.g},${LINE_COLOR.b},${0.55 + t * 0.35})`;
        ctx.lineWidth = 0.8 + t * 1.6;
        ctx.stroke();
      });
      ctx.restore();

      /* ── 4. particles ── */
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      particles.forEach(p => {
        const col = DOT_RGB[p.colorIdx];
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, p.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${p.life * 0.7})`;
        ctx.fill();
      });
      ctx.restore();

      /* ── 5. nodes ── */
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      nodes.forEach(n => {
        const t = n.heat;
        const r = n.radius;
        const col = DOT_RGB[n.colorIdx];
        const variant = FLAME_VARIANTS[n.colorIdx];
        const glowR = n.ignited ? r * 7 : r * variant.glowMult;

        const outerG = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        outerG.addColorStop(0, `rgba(${col.r},${col.g},${col.b},${variant.glowAlpha * t + 0.05})`);
        outerG.addColorStop(1, `rgba(${col.r},${col.g},${col.b},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = outerG;
        ctx.fill();

        const hotX = n.x - r * 0.25, hotY = n.y - r * 0.25;
        const coreG = ctx.createRadialGradient(hotX, hotY, 0, n.x, n.y, r);
        coreG.addColorStop(0,    'rgba(255,250,235,1.0)');
        coreG.addColorStop(0.18, 'rgba(255,225,170,0.98)');
        coreG.addColorStop(0.45, `rgba(${col.r},${col.g},${col.b},0.95)`);
        coreG.addColorStop(0.75, `rgba(${col.r},${col.g},${col.b},0.80)`);
        coreG.addColorStop(1,    `rgba(${Math.round(col.r * 0.6)},${Math.round(col.g * 0.6)},${Math.round(col.b * 0.6)},0.5)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = coreG;
        ctx.fill();
      });
      ctx.restore();

      /* ── labels ── */
      ctx.save();
      ctx.textAlign = 'center';
      nodes.forEach(n => {
        const t = n.heat;
        const r = n.radius;
        const col = DOT_RGB[n.colorIdx];
        let fontSize: number, opacity: number, weight = '400';
        if (n.ignited) {
          fontSize = 18; opacity = 1.0; weight = '600';
          ctx.font = `italic ${weight} ${fontSize}px Newsreader, Georgia, serif`;
        } else if (r <= 10) {
          fontSize = 13; opacity = 0.5 + t * 0.35;
          ctx.font = `${weight} ${fontSize}px Newsreader, Georgia, serif`;
        } else {
          fontSize = 16; weight = '500'; opacity = 0.7 + t * 0.3;
          ctx.font = `${weight} ${fontSize}px Newsreader, Georgia, serif`;
        }
        ctx.globalAlpha = Math.min(1, opacity);
        ctx.fillStyle = t > 0.6
          ? 'rgba(255,240,220,1)'
          : `rgba(${col.r},${col.g},${col.b},1)`;
        ctx.fillText(n.label, n.x, n.y - r - 6);
      });
      ctx.restore();

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(cooldownId);
      ro.disconnect();
      canvas.removeEventListener('mousedown',  onMouseDown);
      canvas.removeEventListener('mousemove',  onMouseMove);
      canvas.removeEventListener('mouseup',    onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseUp);
      canvas.removeEventListener('dblclick',   onDblClick);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove',  onTouchMove);
      canvas.removeEventListener('touchend',   onTouchEnd);
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  );
}
