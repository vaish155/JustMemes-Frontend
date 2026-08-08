'use client';

import React, { useEffect, useRef } from 'react';

interface Piece {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
}

export const ConfettiCanvas: React.FC<{ trigger?: boolean }> = ({ trigger = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let pieces: Piece[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    if (trigger) {
      const colors = ['#a3e635', '#f472b6', '#a78bfa', '#fde047', '#fafafa'];
      for (let i = 0; i < 180; i++) {
        pieces.push({
          x: Math.random() * canvas.width,
          y: -20 - Math.random() * canvas.height * 0.5,
          w: 6 + Math.random() * 8,
          h: 8 + Math.random() * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 3,
          vy: 2 + Math.random() * 3.5,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.25,
        });
      }

      const tick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces = pieces.filter((p) => p.y < canvas.height + 40);
        pieces.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vr;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        });

        if (pieces.length > 0) {
          animId = requestAnimationFrame(tick);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      };

      tick();
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [trigger]);

  return <canvas ref={canvasRef} id="confetti-canvas" className="fixed inset-0 z-[120] pointer-events-none" />;
};
