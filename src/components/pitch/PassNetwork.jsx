import React, { useState } from 'react';
import { C } from '../../constants/theme';
import { Pitch } from './Pitch';
import { FloatTip } from './FloatTip';

export function PassNetwork({ nodes, links, color }) {
  const [tip, setTip] = useState(null);
  const find = (id) => nodes.find((n) => n.id === id);
  return (
    <div style={{ position: "relative" }}>
      <Pitch>
        {links.map(([a, b, w], i) => {
          const na = find(a), nb = find(b); if (!na || !nb) return null;
          return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke={color} strokeWidth={Math.max(1, w / 4)}
            strokeLinecap="round" opacity={0.45} />;
        })}
        {nodes.map((n) => (
          <g key={n.id} style={{ cursor: "pointer" }}
            onMouseEnter={(e) => setTip({ x: e.clientX, y: e.clientY, n })} onMouseLeave={() => setTip(null)}>
            <circle cx={n.x} cy={n.y} r={8 + n.passes / 6} fill={color} opacity={0.85} stroke={C.dark} strokeWidth="2" />
            <text x={n.x} y={n.y + 3} textAnchor="middle" fontFamily="Syne" fontSize="9" fontWeight="700" fill={C.dark}>
              {n.name.substring(0, 3).toUpperCase()}
            </text>
          </g>
        ))}
      </Pitch>
      {tip && <FloatTip x={tip.x} y={tip.y}><b>{tip.n.name}</b> · {tip.n.passes} passes</FloatTip>}
    </div>
  );
}
