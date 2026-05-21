import React, { useEffect, useRef, useState } from 'react';
import { Activity, Crosshair, Download, FileText, Pause, Play, Plus, Share2, SkipBack, SkipForward, Target, Users } from 'lucide-react';
import { C, HOME, AWAY } from '../constants/theme';
import { EVENTS } from '../data/mockData';
import { Leg } from '../components/ui/Panel';
import { Pitch } from '../components/pitch/Pitch';

/* Video tab */
const TOTAL = 5647;
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const teamColor = (t) => t === "home" ? HOME : t === "away" ? AWAY : C.softBlue;
const TIMELINE_TYPES = ["goal", "shot", "save", "card", "corner", "foul", "sub", "offside", "tackle", "interception", "clearance", "cross", "block"];
export function VideoTab({ toast }) {
  const [sec, setSec] = useState(2160);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [events, setEvents] = useState(EVENTS);
  const [teamF, setTeamF] = useState("all");
  const [typeF, setTypeF] = useState("all");
  const [timelineTypes, setTimelineTypes] = useState(TIMELINE_TYPES);
  const [timelineTeam, setTimelineTeam] = useState("all");
  const [showTimelineFilters, setShowTimelineFilters] = useState(true);
  const [active, setActive] = useState(5);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ min: "", team: "home", type: "shot", player: "", detail: "" });
  const timer = useRef(null);

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => setSec((s) => { if (s >= TOTAL) { setPlaying(false); return s; } return s + speed; }), 100);
      return () => clearInterval(timer.current);
    }
  }, [playing, speed]);

  const TYPE_CAT = {
    goal: "goals", shot: "shots", save: "saves", card: "cards", corner: "corners", foul: "fouls",
    sub: "subs", offside: "offsides", tackle: "tackles", interception: "interceptions",
    clearance: "clearances", cross: "crosses", block: "blocks",
  };
  const filtered = events.filter((e) => (teamF === "all" || e.team === teamF) && (typeF === "all" || TYPE_CAT[e.type] === typeF));
  const seek = (s) => setSec(Math.max(0, Math.min(TOTAL, s)));
  const counts = (pred) => events.filter(pred).length;

  const addEvent = () => {
    const m = parseInt(form.min) || 0, id = Date.now();
    const ev = { id, sec: m * 60, min: m + "'", type: form.type, team: form.team, player: form.player.trim() || "Unknown", detail: form.detail.trim() };
    setEvents((prev) => [...prev, ev].sort((a, b) => a.sec - b.sec));
    setModal(false); seek(m * 60); setActive(id);
    toast(`Event added: ${form.type} at ${m}'`);
    setForm({ min: "", team: "home", type: "shot", player: "", detail: "" });
  };

  const stats = [
    { l: "Total Events", v: events.length, c: C.green, h: counts((e) => e.team === "home"), a: counts((e) => e.team === "away") },
    { l: "Shots", v: counts((e) => e.type === "shot" || e.type === "goal"), h: counts((e) => (e.type === "shot" || e.type === "goal") && e.team === "home"), a: counts((e) => (e.type === "shot" || e.type === "goal") && e.team === "away") },
    { l: "Cards", v: counts((e) => e.type === "card"), c: C.amber, h: counts((e) => e.type === "card" && e.team === "home"), a: counts((e) => e.type === "card" && e.team === "away") },
    { l: "Corners", v: counts((e) => e.type === "corner"), h: counts((e) => e.type === "corner" && e.team === "home"), a: counts((e) => e.type === "corner" && e.team === "away") },
  ];
  const tlRows = [
    { label: "Goals", types: ["goal"] }, { label: "Shots", types: ["shot"] }, { label: "Saves", types: ["save"] },
    { label: "Cards", types: ["card"] }, { label: "Corners", types: ["corner"] }, { label: "Fouls", types: ["foul"] },
    { label: "Subs", types: ["sub"] }, { label: "Offsides", types: ["offside"] }, { label: "Tackles", types: ["tackle"] },
    { label: "Interceptions", types: ["interception"] }, { label: "Clearances", types: ["clearance"] },
    { label: "Crosses", types: ["cross"] }, { label: "Blocks", types: ["block"] },
  ];
  const FILTERS = [
    ["all", "All"], ["goals", "Goals"], ["shots", "Shots"], ["saves", "Saves"], ["cards", "Cards"],
    ["corners", "Corners"], ["subs", "Subs"], ["fouls", "Fouls"], ["offsides", "Offsides"],
    ["tackles", "Tackles"], ["interceptions", "Interceptions"], ["clearances", "Clearances"],
    ["crosses", "Crosses"], ["blocks", "Blocks"],
  ];
  const timelineEvents = events.filter((e) => timelineTeam === "all" || e.team === timelineTeam);
  const visibleTlRows = tlRows.filter((r) => r.types.some((type) => timelineTypes.includes(type)));
  const toggleTimelineType = (type) => {
    setTimelineTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]);
  };

  return (
    <div className="workspace">
      <div className="left-col">
        <div className="video-wrap">
          <div className="video-area" onClick={() => setPlaying((p) => !p)}>
            <Pitch vb="0 0 800 450" />
            <div className="playhead-ball" style={{
              left: 30 + Math.abs(Math.sin(sec * .04) * 40) + "%",
              top: 30 + Math.abs(Math.cos(sec * .028) * 40) + "%",
            }} />
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
                {events.map((ev) => (
                  <div key={ev.id} title={`${ev.min} ${ev.player}`} onClick={(e) => { e.stopPropagation(); seek(ev.sec); setActive(ev.id); }}
                    className="s-marker" style={{ left: ev.sec / TOTAL * 100 + "%", background: teamColor(ev.team), boxShadow: `0 0 5px ${teamColor(ev.team)}` }} />
                ))}
              </div>
            </div>
            <div className="time-disp"><strong>{fmt(sec)}</strong> / 94:07</div>
            <div style={{ display: "flex", gap: ".25rem" }}>
              {[0.5, 1, 1.5, 2].map((s) => (
                <button key={s} className={"speed-btn" + (speed === s ? " active" : "")} onClick={() => setSpeed(s)}>{s}Ã—</button>
              ))}
            </div>
          </div>
        </div>

        <div className="timeline-wrap">
          <div className="tl-hdr">
            <div className="pnl-t">Match Timeline</div>
            <div className="tl-hdr-r">
              <div className="lgnd"><Leg c={HOME} t="Al Ahly" /><Leg c={AWAY} t="Zamalek" /><Leg c={C.softBlue} t="Neutral" /></div>
              <button className="tl-toggle" onClick={() => setShowTimelineFilters((v) => !v)}>{showTimelineFilters ? "Hide Filters" : "Show Filters"}</button>
            </div>
          </div>
          {showTimelineFilters && (
            <div className="timeline-filter">
              <div className="tl-filter-row">
                <span className="tl-filter-lbl">Team</span>
                {[["all", "All"], ["home", "Al Ahly"], ["away", "Zamalek"], ["neutral", "Neutral"]].map(([k, l]) => (
                  <button key={k} className={"tl-chip" + (timelineTeam === k ? " active" : "")} onClick={() => setTimelineTeam(k)}>{l}</button>
                ))}
              </div>
              <div className="tl-filter-row">
                <span className="tl-filter-lbl">Events</span>
                <button className={"tl-chip" + (timelineTypes.length === TIMELINE_TYPES.length ? " active" : "")} onClick={() => setTimelineTypes(TIMELINE_TYPES)}>All</button>
                {tlRows.map((r) => {
                  const type = r.types[0];
                  return <button key={type} className={"tl-chip" + (timelineTypes.includes(type) ? " active" : "")} onClick={() => toggleTimelineType(type)}>{r.label}</button>;
                })}
              </div>
            </div>
          )}
          {visibleTlRows.map((r) => {
            const evs = timelineEvents.filter((e) => r.types.includes(e.type)); if (!evs.length) return null;
            return (
              <div className="trow" key={r.label}>
                <div className="trow-lbl">{r.label}</div>
                <div className="trow-track">
                  {evs.map((ev) => (
                    <div key={ev.id} className="trow-m" title={`${ev.min} ${ev.player}`}
                      onClick={() => { seek(ev.sec); setActive(ev.id); }}
                      style={{ left: ev.sec / TOTAL * 100 + "%", background: teamColor(ev.team), cursor: "pointer" }} />
                  ))}
                </div>
              </div>
            );
          })}
          <div className="time-axis">{["0'", "15'", "30'", "HT", "60'", "75'", "90'"].map((t) => <span key={t} className="time-tick">{t}</span>)}</div>
        </div>

        <div className="stats-strip">
          {stats.map((s) => (
            <div className="stat-card" key={s.l}>
              <div className="stat-val" style={{ color: s.c || C.white }}>{s.v}</div>
              <div className="stat-lbl">{s.l}</div>
              <div className="stat-sub">
                <span className="stat-team"><span className="std" style={{ background: HOME }} />{s.h}</span>
                <span className="stat-team"><span className="std" style={{ background: AWAY }} />{s.a}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="events-panel">
        <div className="ep-top">
          <div className="ep-title-row">
            <div className="ep-title">Events</div>
            <div className="ev-count">{filtered.length} event{filtered.length !== 1 ? "s" : ""}</div>
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
          {filtered.length === 0 && <div className="no-events"><p>No events found</p><span>Try changing the filters</span></div>}
          {["1st Half", "2nd Half"].map((half, hi) => {
            const evs = filtered.filter((e) => hi === 0 ? e.sec <= 2700 : e.sec > 2700);
            if (!evs.length) return null;
            return (
              <div key={half}>
                <div className="half-sep"><div className="half-line" /><div className="half-lbl">{half}</div><div className="half-line" /></div>
                {evs.map((ev) => (
                  <div key={ev.id} className={"ev-row" + (active === ev.id ? " ev-active" : "")} onClick={() => { seek(ev.sec); setActive(ev.id); }}>
                    <div className="ev-time" style={{ color: teamColor(ev.team) }}>{ev.min}</div>
                    <div className="ev-icon" style={{ background: `${teamColor(ev.team)}1a`, color: teamColor(ev.team) }}>
                      {ev.type === "goal" ? <Target size={14} /> : ev.type === "card" ? <span style={{ width: 8, height: 12, borderRadius: 2, background: ev.detail.startsWith("Red") ? C.softBlue : C.amber, display: "block" }} /> : ev.type === "corner" ? <Crosshair size={14} /> : ev.type === "sub" ? <Users size={14} /> : <Activity size={14} />}
                    </div>
                    <div className="ev-info">
                      <div className="ev-type" style={ev.type === "goal" ? { color: teamColor(ev.team) } : {}}>
                        {ev.type === "goal" ? <b>GOAL</b> : ev.type === "card" ? "Card" : ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}
                        <span className={"ev-tag " + (ev.team === "neutral" ? "neutral" : ev.team)}>{ev.team === "neutral" ? "Neutral" : ev.team === "home" ? "Home" : "Away"}</span>
                      </div>
                      {ev.player && <div className="ev-player">{ev.player}{ev.detail ? " · " + ev.detail : ""}</div>}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <button className="add-ev-btn" onClick={() => { setForm((f) => ({ ...f, min: Math.floor(sec / 60) })); setModal(true); }}>
          <Plus size={12} /> Add event at current time
        </button>
        <div className="ep-foot">
          <button className="btn-export" onClick={() => toast("Exporting CSV…")}><Download size={12} /> CSV</button>
          <button className="btn-export" onClick={() => toast("Exporting PDF…")}><FileText size={12} /> PDF</button>
          <button className="btn-export" onClick={() => toast("Share link copied")}><Share2 size={12} /> Share</button>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="modal">
            <div className="modal-hdr"><div className="modal-title">Add New Event</div>
              <button className="modal-close" onClick={() => setModal(false)}>×</button></div>
            <div className="form-row">
              <div className="form-group"><label className="form-lbl">Minute</label>
                <input className="form-input" type="number" value={form.min} onChange={(e) => setForm({ ...form, min: e.target.value })} placeholder="34" /></div>
              <div className="form-group"><label className="form-lbl">Team</label>
                <select className="form-input" value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })}>
                  <option value="home">Al Ahly (Home)</option><option value="away">Zamalek (Away)</option><option value="neutral">Neutral</option>
                </select></div>
            </div>
            <div className="form-group"><label className="form-lbl">Event Type</label>
              <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {["goal", "shot", "save", "card", "corner", "foul", "sub", "offside", "tackle", "interception", "clearance", "cross", "block"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select></div>
            <div className="form-group"><label className="form-lbl">Player</label>
              <input className="form-input" value={form.player} onChange={(e) => setForm({ ...form, player: e.target.value })} placeholder="Player name" /></div>
            <div className="form-group"><label className="form-lbl">Notes</label>
              <input className="form-input" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} placeholder="Right foot · Top corner…" /></div>
            <div className="modal-foot">
              <button className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={addEvent}>Save Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
