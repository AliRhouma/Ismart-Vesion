import React from 'react';
import { C, HOME, AWAY } from '../../constants/theme';

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
