import React from 'react';
import { Loader2 } from 'lucide-react';
import { C, HOME, AWAY } from '../../constants/theme';

export function AnalysingSkeleton({ label = "Analysing data…", sub = "Detecting events, players and stats", bars = 5 }) {
  return (
    <div className="analysing-skel">
      <div className="as-head">
        <Loader2 size={22} className="spin" style={{ color: C.green }} />
        <div className="as-label">{label}</div>
        {sub && <div className="as-sub">{sub}</div>}
      </div>
      <div className="as-bars">
        {Array.from({ length: bars }).map((_, i) => (
          <div key={i} className="as-bar" style={{ width: `${50 + ((i * 37) % 50)}%` }} />
        ))}
      </div>
    </div>
  );
}

/* Panel + stat card */
export function Panel({ title, legend, children }) {
  return (
    <div className="pnl">
      <div className="pnl-h">
        <div className="pnl-t">{title}</div>
        {legend && <div className="lgnd">{legend}</div>}
      </div>
      <div className="pnl-b">{children}</div>
    </div>
  );
}
export const Leg = ({ c, t }) => (
  <span className="lgnd-i"><span className="lgnd-d" style={{ background: c }} />{t}</span>
);
export function StatCard({ v, l, color, home, away }) {
  return (
    <div className="stc">
      <div className="stv" style={{ color: color || C.white }}>{v}</div>
      <div className="stl">{l}</div>
      {home !== undefined && (
        <div className="sts">
          <span className="stt"><span className="std" style={{ background: HOME }} />{home}</span>
          <span className="stt"><span className="std" style={{ background: AWAY }} />{away}</span>
        </div>
      )}
    </div>
  );
}
