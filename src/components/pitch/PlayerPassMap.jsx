import React, { useEffect, useMemo, useState } from 'react';
import { C, HOME, AWAY } from '../../constants/theme';
import { ROSTER_HOME, ROSTER_AWAY, PLAYER_PASSES } from '../../data/mockData';
import { Pitch } from './Pitch';
import { FloatTip } from './FloatTip';

const ERROR = "#FF4D4F";

const totalsFor = (id) => {
  const ps = PLAYER_PASSES[id] || [];
  return ps.reduce((acc, p) => ({ c: acc.c + p.c, m: acc.m + p.m }), { c: 0, m: 0 });
};

export function PlayerPassMap() {
  const [team, setTeam] = useState("home");
  const [selectedId, setSelectedId] = useState("home-6");
  const [tip, setTip] = useState(null);
  const [hoverTarget, setHoverTarget] = useState(null);

  /* keep selection consistent when the team toggle changes */
  useEffect(() => {
    if (!selectedId.startsWith(team)) setSelectedId(team + "-6");
  }, [team, selectedId]);

  const teamColor = team === "home" ? HOME : AWAY;
  const numColor = team === "home" ? "#0d2b1a" : "#fff";

  const teamPlayers = useMemo(() => {
    const roster = team === "home" ? ROSTER_HOME : ROSTER_AWAY;
    return roster.map((p) => ({ ...p, team, id: `${team}-${p.num}` }));
  }, [team]);

  const selected = teamPlayers.find((p) => p.id === selectedId);
  const passes = PLAYER_PASSES[selectedId] || [];
  const targetIds = useMemo(() => new Set(passes.map((p) => p.to)), [passes]);

  const totals = passes.reduce((acc, p) => ({ c: acc.c + p.c, m: acc.m + p.m }), { c: 0, m: 0 });
  const total = totals.c + totals.m;
  const acc = total > 0 ? Math.round(totals.c / total * 100) : 0;
  const topTarget = [...passes].sort((a, b) => (b.c + b.m) - (a.c + a.m))[0];
  const topTargetName = topTarget ? teamPlayers.find((p) => p.id === topTarget.to)?.name : "—";

  const moveTip = (e) => setTip((t) => (t ? { ...t, x: e.clientX, y: e.clientY } : t));

  return (
    <div className="pass-map-grid">
      {/* Pitch + lines */}
      <div className="pass-map-pitch">
        <div style={{ position: "relative" }}>
          <Pitch>
            {/* Pass lines from selected player */}
            {selected && passes.map((p) => {
              const target = teamPlayers.find((tp) => tp.id === p.to);
              if (!target) return null;
              const dx = target.x - selected.x;
              const dy = target.y - selected.y;
              const len = Math.hypot(dx, dy) || 1;
              const both = p.c > 0 && p.m > 0;
              const ox = both ? -dy / len * 2.8 : 0;
              const oy = both ? dx / len * 2.8 : 0;
              const cT = Math.max(1.5, Math.min(7.5, p.c * 0.85));
              const mT = Math.max(1.5, Math.min(5.5, p.m * 1.4));
              const isHover = hoverTarget === p.to;
              return (
                <g key={p.to} style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => { setTip({ x: e.clientX, y: e.clientY, p, target }); setHoverTarget(p.to); }}
                  onMouseMove={moveTip}
                  onMouseLeave={() => { setTip(null); setHoverTarget(null); }}>
                  {/* invisible thick hit area for easier hover */}
                  <line x1={selected.x} y1={selected.y} x2={target.x} y2={target.y}
                    stroke="transparent" strokeWidth="14" />
                  {p.c > 0 && (
                    <line x1={selected.x + ox} y1={selected.y + oy}
                      x2={target.x + ox} y2={target.y + oy}
                      stroke={teamColor} strokeWidth={cT}
                      opacity={isHover ? 1 : 0.78} strokeLinecap="round" />
                  )}
                  {p.m > 0 && (
                    <line x1={selected.x - ox} y1={selected.y - oy}
                      x2={target.x - ox} y2={target.y - oy}
                      stroke={ERROR} strokeWidth={mT}
                      strokeDasharray="5 4"
                      opacity={isHover ? 1 : 0.9} strokeLinecap="round" />
                  )}
                </g>
              );
            })}

            {/* Players */}
            {teamPlayers.map((p) => {
              const isSel = p.id === selectedId;
              const isTarget = targetIds.has(p.id);
              const isHover = hoverTarget === p.id;
              const dim = isSel ? 1 : isTarget ? 0.95 : 0.28;
              const r = isSel ? 14 : isTarget ? (isHover ? 13 : 11) : 8;
              return (
                <g key={p.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedId(p.id)}>
                  {isSel && (
                    <circle cx={p.x} cy={p.y} r={17} fill="none" stroke={teamColor} strokeWidth="1.5" opacity="0.5">
                      <animate attributeName="r" values="15;22;15" dur="2.1s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.55;0.05;0.55" dur="2.1s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={p.x} cy={p.y} r={r}
                    fill={teamColor} opacity={dim}
                    stroke={isSel ? "#fff" : "rgba(0,0,0,0.5)"}
                    strokeWidth={isSel ? 2 : 1} />
                  <text x={p.x} y={p.y + 3.6} textAnchor="middle"
                    fontSize={isSel ? 11 : 9.5} fontFamily="Syne" fontWeight="700"
                    fill={numColor} opacity={dim}
                    style={{ pointerEvents: "none" }}>
                    {p.num}
                  </text>
                </g>
              );
            })}
          </Pitch>

          <div className="pass-map-legend">
            <span className="pml-i">
              <span className="pml-line" style={{ background: teamColor }} />
              Completed pass
            </span>
            <span className="pml-i">
              <span className="pml-line pml-dashed" style={{ background: ERROR }} />
              Misplaced pass
            </span>
            <span className="pml-i pml-hint">Hover a line for details · click a player to switch</span>
          </div>
        </div>
      </div>

      {/* Player picker */}
      <div className="player-picker">
        <div className="team-tabs" style={{ marginBottom: ".55rem" }}>
          <button onClick={() => setTeam("home")}
            className={"team-tab" + (team === "home" ? " t-home" : "")}>Al Ahly</button>
          <button onClick={() => setTeam("away")}
            className={"team-tab" + (team === "away" ? " t-away" : "")}>Zamalek</button>
        </div>
        <div className="player-list">
          {teamPlayers.map((p) => {
            const isSel = p.id === selectedId;
            const t = totalsFor(p.id);
            const sum = t.c + t.m;
            return (
              <button key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={"pp-row" + (isSel ? " sel" : "")}
                style={isSel ? { borderLeftColor: teamColor, background: `${teamColor}10` } : {}}>
                <span className="pp-num" style={{ background: teamColor, color: numColor }}>{p.num}</span>
                <span className="pp-info">
                  <span className="pp-name">{p.name}</span>
                  <span className="pp-meta">{p.pos} · {sum} passes</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats row */}
      <div className="pass-map-stats">
        <div className="pms-pill" style={{ borderColor: `${teamColor}55`, color: teamColor }}>
          <span className="pms-pill-num" style={{ background: teamColor, color: numColor }}>{selected?.num}</span>
          <b>{selected?.name}</b>
          <span style={{ color: C.muted, fontWeight: 400 }}>· {selected?.pos}</span>
        </div>
        <div className="pms-stat"><span className="pms-v">{total}</span><span className="pms-l">Attempted</span></div>
        <div className="pms-stat"><span className="pms-v" style={{ color: teamColor }}>{totals.c}</span><span className="pms-l">Completed</span></div>
        <div className="pms-stat"><span className="pms-v" style={{ color: ERROR }}>{totals.m}</span><span className="pms-l">Misplaced</span></div>
        <div className="pms-stat"><span className="pms-v">{acc}%</span><span className="pms-l">Accuracy</span></div>
        <div className="pms-stat"><span className="pms-v" style={{ fontSize: "1rem" }}>{topTargetName}</span><span className="pms-l">Top target</span></div>
      </div>

      {tip && tip.target && (
        <FloatTip x={tip.x} y={tip.y}>
          <div style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
            <b>{selected?.name}</b>
            <span style={{ color: C.muted2 }}>→</span>
            <b>{tip.target.name}</b>
          </div>
          <div style={{ marginTop: ".3rem", fontSize: ".74rem", lineHeight: 1.45 }}>
            <span style={{ color: teamColor, fontWeight: 600 }}>{tip.p.c} completed</span>
            {tip.p.m > 0 && (
              <>
                <span style={{ color: C.muted2 }}> · </span>
                <span style={{ color: ERROR, fontWeight: 600 }}>{tip.p.m} misplaced</span>
              </>
            )}
          </div>
          {(tip.p.c + tip.p.m) > 0 && (
            <div style={{ fontSize: ".68rem", color: C.muted2, marginTop: ".15rem" }}>
              {Math.round(tip.p.c / (tip.p.c + tip.p.m) * 100)}% accuracy · {tip.p.c + tip.p.m} total
            </div>
          )}
        </FloatTip>
      )}
    </div>
  );
}
