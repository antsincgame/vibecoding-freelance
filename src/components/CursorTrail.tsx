import { useEffect, useRef, useCallback } from 'react';

const TRAIL_LENGTH = 20;
const RAINBOW = [
  '#00f5ff', '#00e0ff', '#40c0ff', '#6b8bfa',
  '#8b5cf6', '#a855f7', '#c026d3', '#e040a0',
  '#f953c6', '#ff60a0', '#ff70d0', '#c060ff',
  '#8b5cf6', '#5b7bfa', '#00c8ff', '#00f5ff',
  '#00ffbb', '#00ff88', '#40ffcc', '#00f5ff',
];

interface TrailDot {
  x: number;
  y: number;
  age: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailDot[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  const handleMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    trailRef.current.unshift({ x: e.clientX, y: e.clientY, age: 0 });
    if (trailRef.current.length > TRAIL_LENGTH) {
      trailRef.current.length = TRAIL_LENGTH;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const trail = trailRef.current;
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age += 1;

        const t = 1 - i / TRAIL_LENGTH;
        const radius = 3 + t * 6;
        const alpha = t * 0.7;
        const color = RAINBOW[i % RAINBOW.length];

        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha * 0.2;
        ctx.fill();

        if (trail[i].age > 30) {
          trail.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      if (mx > 0 && my > 0) {
        const time = Date.now() * 0.003;
        const hue1 = (time * 60) % 360;

        ctx.beginPath();
        ctx.arc(mx, my, 12, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue1}, 100%, 70%, 0.4)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue1}, 100%, 80%, 0.9)`;
        ctx.shadowColor = `hsla(${hue1}, 100%, 70%, 0.8)`;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        const petals = 6;
        for (let p = 0; p < petals; p++) {
          const angle = (Math.PI * 2 / petals) * p + time;
          const px = mx + Math.cos(angle) * 20;
          const py = my + Math.sin(angle) * 20;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${(hue1 + p * 60) % 360}, 100%, 70%, 0.35)`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMove]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
