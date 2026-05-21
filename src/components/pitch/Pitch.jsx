import React from 'react';
import { C } from '../../constants/theme';

/* Pitch (SVG) */
export function Pitch({ children, vb = "0 0 680 440" }) {
  return (
    <div className="pitch-wrap">
      <svg viewBox={vb}>
        <rect width="680" height="440" rx="6" fill="#0d200d" />
        <g stroke={C.green} strokeWidth="1" fill="none" opacity=".18">
          <rect x="30" y="20" width="620" height="400" />
          <line x1="340" y1="20" x2="340" y2="420" /><circle cx="340" cy="220" r="58" />
          <circle cx="340" cy="220" r="2" fill={C.green} />
          <rect x="30" y="115" width="120" height="210" /><rect x="30" y="160" width="42" height="120" />
          <rect x="530" y="115" width="120" height="210" /><rect x="608" y="160" width="42" height="120" />
          <rect x="12" y="192" width="18" height="56" /><rect x="650" y="192" width="18" height="56" />
        </g>
        {children}
      </svg>
    </div>
  );
}
