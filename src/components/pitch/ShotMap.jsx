import React, { useState } from 'react';
import { C } from '../../constants/theme';
import { Pitch } from './Pitch';
import { FloatTip } from './FloatTip';

const OUTCOME = { goal: C.green, saved: C.amber, wide: C.softBlue, blocked: C.muted2 };
export function ShotMap({ shots }) {
  const [tip, setTip] = useState(null);
  return (
    <div style={{ position: "relative" }}>
      <Pitch>
        {shots.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={6 + s.xg * 16} fill={OUTCOME[s.outcome]} opacity={0.8}
            stroke={OUTCOME[s.outcome]} strokeWidth="2" style={{ cursor: "pointer" }}
            onMouseEnter={(e) => setTip({ x: e.clientX, y: e.clientY, s })} onMouseLeave={() => setTip(null)} />
        ))}
      </Pitch>
      {tip && <FloatTip x={tip.x} y={tip.y}><b>{tip.s.player}</b> {tip.s.min}' · {tip.s.outcome} · xG {tip.s.xg}</FloatTip>}
    </div>
  );
}
