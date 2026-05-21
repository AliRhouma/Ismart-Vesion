import React, { useEffect, useRef } from 'react';
import { C } from '../../constants/theme';
import { Pitch } from './Pitch';

/* Canvas heatmap (green-forward ramp, skill-aligned) */
export function genHeat(cx, cy, spread, n) {
  const p = []; for (let i = 0; i < n; i++) p.push({ x: cx + (Math.random() - .5) * spread * 2, y: cy + (Math.random() - .5) * spread * 1.2 });
  return p;
}
export function HeatPitch({ points }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"), w = c.width, h = c.height;
    ctx.clearRect(0, 0, w, h);
    const off = document.createElement("canvas"); off.width = w; off.height = h;
    const o = off.getContext("2d");
    points.forEach((p) => {
      const g = o.createRadialGradient(p.x, p.y, 0, p.x, p.y, 55);
      g.addColorStop(0, "rgba(255,255,255,0.25)"); g.addColorStop(1, "rgba(255,255,255,0)");
      o.fillStyle = g; o.beginPath(); o.arc(p.x, p.y, 55, 0, Math.PI * 2); o.fill();
    });
    const img = o.getImageData(0, 0, w, h), d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = d[i + 3] / 255;
      if (v < 0.05) { d[i + 3] = 0; continue; }
      if (v < 0.3) { d[i] = 0; d[i + 1] = 204; d[i + 2] = 106; d[i + 3] = Math.floor(v * 200); }       // green-dim
      else if (v < 0.6) { d[i] = 0; d[i + 1] = 255; d[i + 2] = 135; d[i + 3] = Math.floor(v * 230); }   // green
      else if (v < 0.8) { d[i] = 45; d[i + 1] = 212; d[i + 2] = 191; d[i + 3] = Math.floor(v * 240); }  // teal
      else { d[i] = 230; d[i + 1] = 168; d[i + 2] = 23; d[i + 3] = Math.floor(v * 255); }                // amber (hottest)
    }
    ctx.putImageData(img, 0, 0);
  }, [points]);
  return (
    <div className="pitch-wrap" style={{ position: "relative" }}>
      <Pitch />
      <canvas ref={ref} width={680} height={440}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", borderRadius: 6 }} />
    </div>
  );
}
