import React from 'react';
import { C } from '../../constants/theme';

export function FloatTip({ x, y, children }) {
  return (
    <div style={{
      position: "fixed", left: x + 12, top: y - 10, zIndex: 500, background: C.card,
      border: "1px solid rgba(0,255,135,0.25)", borderRadius: 8, padding: ".4rem .65rem",
      fontFamily: "DM Sans, sans-serif", fontSize: ".74rem", color: "#eee", pointerEvents: "none",
      boxShadow: "0 8px 24px rgba(0,0,0,.5)", whiteSpace: "nowrap",
    }}>{children}</div>
  );
}
