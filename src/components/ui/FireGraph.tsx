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
  'Istanbul','Sydney','Chicago','Mumbai','Warsaw','Amsterdam',
  'Tokyo','New York','Rome','Lisbon','Johannesburg','São Paulo',
  'Berlin','Seoul','Mexico City','Lagos','Bangkok','Toronto',
  'Dubai','Buenos Aires','Cairo','Melbourne','London','Austin',
  'Nashville','Oakland','Athens','Madrid','Cape Town','Nairobi',
  'Osaka','Paris','Houston','Karachi','Bogotá','Jakarta',
  'Kinshasa','Lima','Santiago','Riyadh','Casablanca','Accra',
  'Taipei','Kuala Lumpur','Stockholm','Barcelona','Vienna','Zürich',
  'Helsinki','Prague','Budapest','Beirut','Tel Aviv','Abidjan',
  'Montréal','Vancouver','Denver','Miami','Phoenix','Seattle',
  'Addis Ababa','Dar es Salaam','Kampala','Dakar','Tunis','Algiers',
  'Tashkent','Baku','Tbilisi','Yerevan','Almaty','Bishkek',
  'Yangon','Hanoi','Ho Chi Minh City','Colombo','Dhaka','Kathmandu',
  'Ulaanbaatar','Vladivostok','Novosibirsk','Minsk','Kyiv','Bucharest',
  'Sofia','Zagreb','Sarajevo','Tirana','Skopje','Nicosia',
  'Reykjavik','Dublin','Porto','Seville','Valencia',
  'Marseille','Lyon','Brussels','Rotterdam','Copenhagen','Oslo',
  'Riga','Tallinn','Vilnius','Gdańsk','Kraków','Wrocław',
  'Guadalajara','Monterrey','San José','Havana','San Juan','Quito',
  'La Paz','Asunción','Montevideo','Recife','Fortaleza','Manaus',
  'Kumasi','Luanda','Maputo','Harare','Lusaka',
  'Kigali','Lomé','Cotonou','Niamey','Bamako','Ouagadougou',
  'Antananarivo','Port Louis','Djibouti','Mogadishu',
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function heatColor(t: number, alpha: number) {
  const r = Math.round(lerp(85,  255, t));
  const g = Math.round(lerp(0,   140, Math.pow(t, 1.6)));
  const b = Math.round(lerp(0,    60, Math.pow(t, 3)));
  return `rgba(${r},${g},${b},${alpha})`;
}

interface Node {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  heat: number;
  radius: number;
  label: string;
  ignited: boolean;
  igniteTimer: number;
}

interface Edge {
  a: number; b: number;
  heat: number;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; size: number; heat: number;
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
        x: w * 0.15 + Math.random() * w * 0.7,
        y: h * 0.15 + Math.random() * h * 0.7,
        vx: 0, vy: 0,
        heat: Math.random() * 0.3 + 0.05,
        radius: 4 + Math.random() * 5,
        label: shuffled[i % shuffled.length],
        ignited: false,
        igniteTimer: 0,
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

    /* mouse */
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

    /* touch */
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

    /* edge passive cooldown every 100ms */
    cooldownId = setInterval(() => {
      edges.forEach(e => { e.heat = e.heat * 0.98 + 0.002; });
    }, 100);

    /* draw loop */
    function draw(ts: number) {
      const time = ts - startTime;
      const { w: W, h: H } = getDims();
      const cx = W / 2, cy = H / 2;

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
        const count = n.ignited ? 6 : Math.floor(n.heat * 2.5);
        for (let k = 0; k < count; k++) {
          particles.push({
            x: n.x + (Math.random() - 0.5) * n.radius,
            y: n.y + (Math.random() - 0.5) * n.radius,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(Math.random() * 1.5 + 0.5),
            life: 1.0, size: Math.random() * 2 + 1, heat: n.heat,
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

      /* ── 2. soft warm hearth glow (transparent at edges, no rectangle) ── */
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.6);
      bg.addColorStop(0,    'rgba(40,22,14,0.28)');
      bg.addColorStop(0.55, 'rgba(20,10,6,0.10)');
      bg.addColorStop(1,    'rgba(9,5,4,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      /* ── 3. edges ── */
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
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
        ctx.strokeStyle = heatColor(t, 0.55);
        ctx.lineWidth = 0.8 + t * 1.6;
        ctx.stroke();

        if (t > 0.5) {
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.quadraticCurveTo(mx, my, nb.x, nb.y);
          ctx.strokeStyle = heatColor(t, (t - 0.5) * 0.18);
          ctx.lineWidth = 4 + t * 8;
          ctx.stroke();
        }
      });
      ctx.restore();

      /* ── 4. particles ── */
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, p.size), 0, Math.PI * 2);
        ctx.fillStyle = heatColor(p.heat, p.life * 0.7);
        ctx.fill();
      });
      ctx.restore();

      /* ── 5. nodes ── */
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      nodes.forEach(n => {
        const t = n.heat;
        const r = n.radius;
        const glowR = n.ignited ? r * 7 : r * 3.5;

        const outerG = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        outerG.addColorStop(0, heatColor(t, 0.35));
        outerG.addColorStop(1, heatColor(t, 0));
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = outerG;
        ctx.fill();

        const hotX = n.x - r * 0.25, hotY = n.y - r * 0.25;
        const coreG = ctx.createRadialGradient(hotX, hotY, 0, n.x, n.y, r);
        coreG.addColorStop(0,   heatColor(1.0,       0.95));
        coreG.addColorStop(0.5, heatColor(t,         0.85));
        coreG.addColorStop(1,   heatColor(t * 0.6,   0.6));
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
        let fontSize: number, opacity: number;
        if (n.ignited) {
          fontSize = 13; opacity = 1.0;
          ctx.font = `italic ${fontSize}px Newsreader, Georgia, serif`;
        } else if (r <= 7) {
          fontSize = 10; opacity = 0.38 + t * 0.3;
          ctx.font = `${fontSize}px Newsreader, Georgia, serif`;
        } else {
          fontSize = 12; opacity = 0.55 + t * 0.4;
          ctx.font = `${fontSize}px Newsreader, Georgia, serif`;
        }
        ctx.globalAlpha = Math.min(1, opacity);
        ctx.fillStyle = heatColor(t, 1.0);
        ctx.fillText(n.label, n.x, n.y - r - 5);
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
