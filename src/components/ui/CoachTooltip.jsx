import React from 'react';
import { C } from '../../constants/theme';

/* Branded tooltip (skill §16) */
export function CoachTooltip({ active, payload, label, unit = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.card, border: "1px solid rgba(0,255,135,0.25)", borderRadius: 10,
      padding: "0.6rem 0.8rem", boxShadow: "0 12px 40px rgba(0,0,0,0.4)", fontFamily: "DM Sans, sans-serif",
    }}>
      {label != null && (
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 11, color: "#fff", marginBottom: 5 }}>{label}</div>
      )}
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: C.muted, marginTop: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color || p.payload?.fill, boxShadow: `0 0 8px ${p.color || p.payload?.fill}` }} />
          {p.name}: <strong style={{ color: "#fff" }}>{p.value}{unit}</strong>
        </div>
      ))}
    </div>
  );
}
