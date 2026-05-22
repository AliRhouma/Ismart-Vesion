import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, Crosshair, Download, FileText, Footprints, Pause, Play,
  Share2, SkipBack, SkipForward, Target, Users, UserPlus, X,
} from 'lucide-react';
import { C, HOME, AWAY } from '../constants/theme';
import { EVENTS, ROSTER_HOME, ROSTER_AWAY } from '../data/mockData';
import { Pitch } from '../components/pitch/Pitch';

/* Track Players tab — pitch with 22 numbered players, multi-select, tactical lines. */
const TOTAL = 5647;
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const teamColor = (t) => t === "home" ? HOME : t === "away" ? AWAY : C.softBlue;

/* Smoothly drift each player around their base position so the pitch feels alive
   while the video is "playing". Each player gets a unique phase so the group
   doesn't look like a synchronised swarm. */
const playerPos = (p, sec) => {
  const phase = p.num * 1.31 + (p.team === "away" ? 2.15 : 0);
  const dx = Math.sin(sec * 0.045 + phase) * 22 + Math.cos(sec * 0.018 + phase) * 6;
  const dy = Math.cos(sec * 0.032 + phase * 0.7) * 16 + Math.sin(sec * 0.022 + phase) * 5;
  return { x: p.x + dx, y: p.y + dy };
};

/* Pitch is ~105m × 68m mapped to a 620 × 400 play area */
const pxToMeters = (px) => Math.round(px * 105 / 620 * 10) / 10;

/* Ball drifts across the pitch on a lazy figure-8 so it feels alive. */
const ballPos = (sec) => ({
  x: 340 + Math.sin(sec * 0.038) * 210 + Math.cos(sec * 0.021) * 30,
  y: 220 + Math.cos(sec * 0.026) * 115 + Math.sin(sec * 0.046) * 22,
});

/* Same event filters as the Video tab */
const TYPE_CAT = {
  goal: "goals", shot: "shots", save: "saves", card: "cards", corner: "corners", foul: "fouls",
  sub: "subs", offside: "offsides", tackle: "tackles", interception: "interceptions",
  clearance: "clearances", cross: "crosses", block: "blocks",
};
const FILTERS = [
  ["all", "All"], ["goals", "Goals"], ["shots", "Shots"], ["saves", "Saves"], ["cards", "Cards"],
  ["corners", "Corners"], ["subs", "Subs"], ["fouls", "Fouls"], ["offsides", "Offsides"],
  ["tackles", "Tackles"], ["interceptions", "Interceptions"], ["clearances", "Clearances"],
  ["crosses", "Crosses"], ["blocks", "Blocks"],
];

export function TrackPlayers({ toast }) {
  const [sec, setSec] = useState(2160);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selected, setSelected] = useState(() => new Set(["home-9"]));
  const [teamF, setTeamF] = useState("all");
  const [typeF, setTypeF] = useState("all");
  const [showLines, setShowLines] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showFormation, setShowFormation] = useState(false);
  const [active, setActive] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => setSec((s) => {
      if (s >= TOTAL) { setPlaying(false); return s; }
      return s + speed;
    }), 100);
    return () => clearInterval(timer.current);
  }, [playing, speed]);

  const seek = (s) => setSec(Math.max(0, Math.min(TOTAL, s)));

  const allPlayers = useMemo(() => [
    ...ROSTER_HOME.map((p) => ({ ...p, team: "home", id: `home-${p.num}` })),
    ...ROSTER_AWAY.map((p) => ({ ...p, team: "away", id: `away-${p.num}` })),
  ], []);
  const playerById = (id) => allPlayers.find((p) => p.id === id);

  const togglePlayer = (id) => setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const clearSelection = () => setSelected(new Set());
  const selectTeam = (team) => setSelected(new Set(allPlayers.filter((p) => p.team === team).map((p) => p.id)));

  const selectedPlayers = useMemo(() => [...selected].map(playerById).filter(Boolean), [selected, allPlayers]);
  const homeSelected = selectedPlayers.filter((p) => p.team === "home");
  const awaySelected = selectedPlayers.filter((p) => p.team === "away");

  const filteredEvents = useMemo(() => {
    if (selectedPlayers.length === 0) return [];
    const names = selectedPlayers.map((p) => p.name);
    return EVENTS.filter((e) => e.player && names.some((n) => e.player.includes(n)));
  }, [selectedPlayers]);

  /* All events with team + type filters (mirrors Video tab) */
  const allFiltered = useMemo(() =>
    EVENTS.filter((e) =>
      (teamF === "all" || e.team === teamF) &&
      (typeF === "all" || TYPE_CAT[e.type] === typeF)
    ),
    [teamF, typeF]
  );

  const jumpToEvent = (ev) => { seek(ev.sec); setActive(ev.id); setPlaying(false); };

  /* Helper to render a fully-connected graph between players in a group */
  const renderGroupLines = (group, color) => {
    if (group.length < 2) return null;
    const segs = [];
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) segs.push([group[i], group[j]]);
    }
    return segs.map(([p1, p2], i) => {
      const a = playerPos(p1, sec); const b = playerPos(p2, sec);
      const mx = (a.x + b.x) / 2; const my = (a.y + b.y) / 2;
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      return (
        <g key={`${p1.id}-${p2.id}-${i}`}>
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={color} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.75" />
          {showLabels && (
            <g transform={`translate(${mx},${my})`}>
              <rect x={-15} y={-7} width={30} height={14} rx={3} fill="rgba(0,0,0,.78)" stroke={color} strokeOpacity=".35" />
              <text textAnchor="middle" dy="3.5" fontSize="9" fontFamily="DM Sans" fontWeight="600" fill={color}>
                {pxToMeters(dist)}m
              </text>
            </g>
          )}
        </g>
      );
    });
  };

  /* Faint formation lines: connect each player to their nearest 2 same-team neighbours */
  const formationLines = useMemo(() => {
    if (!showFormation) return null;
    const segs = [];
    ["home", "away"].forEach((team) => {
      const group = allPlayers.filter((p) => p.team === team);
      group.forEach((p) => {
        const pos = playerPos(p, sec);
        const others = group.filter((o) => o.id !== p.id)
          .map((o) => ({ o, d: Math.hypot(o.x - p.x, o.y - p.y) }))
          .sort((a, b) => a.d - b.d).slice(0, 2);
        others.forEach(({ o }) => {
          const key = [p.id, o.id].sort().join("|");
          if (segs.find((s) => s.key === key)) return;
          const op = playerPos(o, sec);
          segs.push({ key, x1: pos.x, y1: pos.y, x2: op.x, y2: op.y, color: team === "home" ? HOME : AWAY });
        });
      });
    });
    return segs;
  }, [showFormation, sec, allPlayers]);

  return (
    <div className="workspace">
      <div className="left-col">
        {/* Pitch / "video" */}
        <div className="video-wrap">
          <div className="video-area" onClick={() => setPlaying((p) => !p)}>
            <Pitch vb="0 0 680 440">
              {/* Faint formation skeleton */}
              {formationLines && formationLines.map((s) => (
                <line key={s.key} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                  stroke={s.color} strokeWidth="0.8" opacity="0.18" />
              ))}

              {/* Tactical lines for selected groups */}
              {showLines && (
                <>
                  <g>{renderGroupLines(homeSelected, HOME)}</g>
                  <g>{renderGroupLines(awaySelected, AWAY)}</g>
                </>
              )}

              {/* Player circles */}
              {allPlayers.map((p) => {
                const isSel = selected.has(p.id);
                const pos = playerPos(p, sec);
                const color = teamColor(p.team);
                const dim = selected.size > 0 && !isSel ? 0.4 : 1;
                return (
                  <g key={p.id} style={{ cursor: "pointer" }}
                    onClick={(e) => { e.stopPropagation(); togglePlayer(p.id); }}>
                    {isSel && (
                      <circle cx={pos.x} cy={pos.y} r={15} fill="none" stroke={color} strokeWidth="1.5" opacity="0.55">
                        <animate attributeName="r" values="14;20;14" dur="2.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0.05;0.6" dur="2.2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle cx={pos.x} cy={pos.y} r={isSel ? 13 : 11}
                      fill={color}
                      stroke={isSel ? "#fff" : "rgba(0,0,0,0.55)"}
                      strokeWidth={isSel ? 2 : 1}
                      opacity={dim} />
                    <text x={pos.x} y={pos.y + 3.6} textAnchor="middle"
                      fontSize="10.5" fontFamily="Syne" fontWeight="700"
                      fill={p.team === "home" ? "#0d2b1a" : "#fff"}
                      opacity={dim}
                      style={{ pointerEvents: "none" }}>
                      {p.num}
                    </text>
                  </g>
                );
              })}

              {/* Ball */}
              {(() => {
                const bp = ballPos(sec);
                return (
                  <g style={{ pointerEvents: "none" }}>
                    <ellipse cx={bp.x} cy={bp.y + 4} rx="5.5" ry="1.6" fill="rgba(0,0,0,0.45)" />
                    <circle cx={bp.x} cy={bp.y} r="9" fill="#fff" opacity="0.14" />
                    <circle cx={bp.x} cy={bp.y} r="5" fill="#fff" stroke="rgba(0,0,0,0.55)" strokeWidth="0.7" />
                    <circle cx={bp.x - 1.1} cy={bp.y - 1.1} r="1.6" fill="#0d2b1a" opacity="0.55" />
                  </g>
                );
              })()}
            </Pitch>

            {!playing && (
              <div className="play-overlay">
                <div className="play-btn-big"><Play size={22} fill={C.green} stroke="none" /></div>
              </div>
            )}
            <div className="video-badge-tl">
              <span className="dot" style={{ background: HOME }} /> Al Ahly
              <span style={{ color: C.muted2, padding: "0 .3rem" }}>vs</span>
              <span className="dot" style={{ background: AWAY }} /> Zamalek
            </div>
            <div className="video-time">{fmt(sec)} / 94:07</div>
            {selected.size > 0 && (
              <div className="track-overlay">
                <Footprints size={11} />
                Tracking <b>{selected.size}</b> player{selected.size !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          <div className="video-ctrl">
            <button className="ctrl-btn" onClick={() => seek(sec - 5)}><SkipBack size={15} /></button>
            <button className="ctrl-play" onClick={() => setPlaying((p) => !p)}>
              {playing ? <Pause size={13} fill={C.slate} stroke="none" /> : <Play size={13} fill={C.slate} stroke="none" />}
            </button>
            <button className="ctrl-btn" onClick={() => seek(sec + 5)}><SkipForward size={15} /></button>
            <div className="scrubber-wrap">
              <div className="scrubber-track" onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                seek(Math.round((e.clientX - r.left) / r.width * TOTAL));
              }}>
                <div className="scrubber-progress" style={{ width: sec / TOTAL * 100 + "%" }}>
                  <div className="scrubber-thumb" />
                </div>
                {filteredEvents.map((ev) => (
                  <div key={ev.id} title={`${ev.min} ${ev.player}`}
                    onClick={(e) => { e.stopPropagation(); seek(ev.sec); setActive(ev.id); }}
                    className="s-marker"
                    style={{ left: ev.sec / TOTAL * 100 + "%", background: teamColor(ev.team), boxShadow: `0 0 5px ${teamColor(ev.team)}` }} />
                ))}
              </div>
            </div>
            <div className="time-disp"><strong>{fmt(sec)}</strong> / 94:07</div>
            <div style={{ display: "flex", gap: ".25rem" }}>
              {[0.5, 1, 1.5, 2].map((s) => (
                <button key={s} className={"speed-btn" + (speed === s ? " active" : "")} onClick={() => setSpeed(s)}>{s}×</button>
              ))}
            </div>
          </div>
        </div>

        {/* Tactical bar */}
        <div className="track-bar">
          <div className="track-bar-left">
            <div className="pnl-t">Tracked Players</div>
            {selected.size === 0 ? (
              <div className="track-empty">Click any player on the pitch to start tracking.</div>
            ) : (
              <div className="track-chips">
                {selectedPlayers.map((p) => (
                  <span key={p.id} className="track-chip"
                    style={{ borderColor: `${teamColor(p.team)}55`, color: teamColor(p.team) }}>
                    <span className="track-chip-num"
                      style={{ background: teamColor(p.team), color: p.team === "home" ? "#0d2b1a" : "#fff" }}>{p.num}</span>
                    {p.name}
                    <button className="track-chip-x" onClick={(e) => { e.stopPropagation(); togglePlayer(p.id); }}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="track-bar-right">
            <button className="track-toggle" onClick={() => selectTeam("home")} title="Select all Al Ahly players"><UserPlus size={11} />Al Ahly</button>
            <button className="track-toggle" onClick={() => selectTeam("away")} title="Select all Zamalek players"><UserPlus size={11} />Zamalek</button>
            <span className="track-divider" />
            <button className={"track-toggle" + (showLines ? " on" : "")} onClick={() => setShowLines((v) => !v)}>Lines</button>
            <button className={"track-toggle" + (showLabels ? " on" : "")} onClick={() => setShowLabels((v) => !v)}>Distances</button>
            <button className={"track-toggle" + (showFormation ? " on" : "")} onClick={() => setShowFormation((v) => !v)}>Formation</button>
            {selected.size > 0 && <button className="track-toggle danger" onClick={clearSelection}>Clear</button>}
          </div>
        </div>

        {/* Events for selected players */}
        <div className="timeline-wrap">
          <div className="tl-hdr">
            <div className="pnl-t">
              Player Events
              {selected.size > 0 && <span className="ev-count" style={{ marginLeft: ".5rem" }}>{filteredEvents.length}</span>}
            </div>
            <div className="tl-hdr-r">
              {selected.size > 0 && (
                <span style={{ fontSize: ".66rem", color: C.muted2, fontFamily: "DM Sans" }}>
                  Filtered by {selectedPlayers.length} selected
                </span>
              )}
            </div>
          </div>
          {selected.size === 0 ? (
            <div className="track-empty" style={{ padding: "1.2rem .2rem" }}>
              Select players to see their events here.
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="track-empty" style={{ padding: "1.2rem .2rem" }}>
              No events recorded for the selected player{selectedPlayers.length !== 1 ? "s" : ""}.
            </div>
          ) : (
            <div className="track-events">
              {filteredEvents.map((ev) => (
                <div key={ev.id} className={"ev-row" + (active === ev.id ? " ev-active" : "")}
                  onClick={() => { seek(ev.sec); setActive(ev.id); }}>
                  <div className="ev-time" style={{ color: teamColor(ev.team) }}>{ev.min}</div>
                  <div className="ev-icon" style={{ background: `${teamColor(ev.team)}1a`, color: teamColor(ev.team) }}>
                    {ev.type === "goal" ? <Target size={14} />
                      : ev.type === "card" ? <span style={{ width: 8, height: 12, borderRadius: 2, background: ev.detail.startsWith("Red") ? C.softBlue : C.amber, display: "block" }} />
                      : ev.type === "corner" ? <Crosshair size={14} />
                      : ev.type === "sub" ? <Users size={14} />
                      : <Activity size={14} />}
                  </div>
                  <div className="ev-info">
                    <div className="ev-type" style={ev.type === "goal" ? { color: teamColor(ev.team) } : {}}>
                      {ev.type === "goal" ? <b>GOAL</b>
                        : ev.type === "card" ? "Card"
                        : ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}
                      <span className={"ev-tag " + (ev.team === "neutral" ? "neutral" : ev.team)}>
                        {ev.team === "neutral" ? "Neutral" : ev.team === "home" ? "Home" : "Away"}
                      </span>
                    </div>
                    {ev.player && <div className="ev-player">{ev.player}{ev.detail ? " · " + ev.detail : ""}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right panel: all events (click → seek video) */}
      <div className="events-panel">
        <div className="ep-top">
          <div className="ep-title-row">
            <div className="ep-title">Events</div>
            <div className="ev-count">{allFiltered.length} event{allFiltered.length !== 1 ? "s" : ""}</div>
          </div>
          <div className="team-tabs">
            {[["all", "All"], ["home", "Al Ahly"], ["away", "Zamalek"]].map(([k, l]) => (
              <button key={k} onClick={() => setTeamF(k)}
                className={"team-tab" + (teamF === k ? (k === "all" ? " t-all" : k === "home" ? " t-home" : " t-away") : "")}>{l}</button>
            ))}
          </div>
          <div className="filter-bar">
            {FILTERS.map(([k, l]) => (
              <button key={k} className={"chip" + (typeF === k ? " active" : "")} onClick={() => setTypeF(k)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="events-list">
          {allFiltered.length === 0 && (
            <div className="no-events"><p>No events found</p><span>Try changing the filters</span></div>
          )}
          {["1st Half", "2nd Half"].map((half, hi) => {
            const evs = allFiltered.filter((e) => hi === 0 ? e.sec <= 2700 : e.sec > 2700);
            if (!evs.length) return null;
            return (
              <div key={half}>
                <div className="half-sep"><div className="half-line" /><div className="half-lbl">{half}</div><div className="half-line" /></div>
                {evs.map((ev) => (
                  <div key={ev.id} className={"ev-row" + (active === ev.id ? " ev-active" : "")} onClick={() => jumpToEvent(ev)}>
                    <div className="ev-time" style={{ color: teamColor(ev.team) }}>{ev.min}</div>
                    <div className="ev-icon" style={{ background: `${teamColor(ev.team)}1a`, color: teamColor(ev.team) }}>
                      {ev.type === "goal" ? <Target size={14} />
                        : ev.type === "card" ? <span style={{ width: 8, height: 12, borderRadius: 2, background: ev.detail.startsWith("Red") ? C.softBlue : C.amber, display: "block" }} />
                        : ev.type === "corner" ? <Crosshair size={14} />
                        : ev.type === "sub" ? <Users size={14} />
                        : <Activity size={14} />}
                    </div>
                    <div className="ev-info">
                      <div className="ev-type" style={ev.type === "goal" ? { color: teamColor(ev.team) } : {}}>
                        {ev.type === "goal" ? <b>GOAL</b>
                          : ev.type === "card" ? "Card"
                          : ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}
                        <span className={"ev-tag " + (ev.team === "neutral" ? "neutral" : ev.team)}>
                          {ev.team === "neutral" ? "Neutral" : ev.team === "home" ? "Home" : "Away"}
                        </span>
                      </div>
                      {ev.player && <div className="ev-player">{ev.player}{ev.detail ? " · " + ev.detail : ""}</div>}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div className="ep-foot">
          <button className="btn-export" onClick={() => toast && toast("Exporting CSV…")}><Download size={12} /> CSV</button>
          <button className="btn-export" onClick={() => toast && toast("Exporting PDF…")}><FileText size={12} /> PDF</button>
          <button className="btn-export" onClick={() => toast && toast("Share link copied")}><Share2 size={12} /> Share</button>
        </div>
      </div>
    </div>
  );
}
