import React, { useEffect, useRef, useState } from 'react';
import { Activity, ChevronDown, Crosshair, Download, FileText, Link2, Loader2, MessageSquare, Pause, Play, Plus, Repeat, Send, Share2, SkipBack, SkipForward, Sparkles, Target, Upload, Users } from 'lucide-react';
import { C, HOME, AWAY } from '../constants/theme';
import { EVENTS, ROSTER_HOME, ROSTER_AWAY } from '../data/mockData';
import { AnalysingSkeleton, Leg } from '../components/ui/Panel';
import { Pitch } from '../components/pitch/Pitch';

/* Video tab */
const DAILYMOTION_SRC = "https://geo.dailymotion.com/player.html?video=xaajou0&mute=true";
const TOTAL = 5647;
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const teamColor = (t) => t === "home" ? HOME : t === "away" ? AWAY : C.softBlue;
const TIMELINE_TYPES = ["goal", "shot", "save", "card", "corner", "foul", "sub", "offside", "tackle", "interception", "clearance", "cross", "block"];
/* Timeline shows only shots + goals on first load; the rest are enabled via the filter chips. */
const DEFAULT_TIMELINE_TYPES = ["goal", "shot"];
/* Events panel shows these 6 categories by default; "All" enables the rest. */
const DEFAULT_EVENT_TYPES = ["goals", "shots", "saves", "cards", "corners", "fouls"];
const ALL_EVENT_TYPES = ["goals", "shots", "saves", "cards", "corners", "fouls", "subs", "offsides", "tackles", "interceptions", "clearances", "crosses", "blocks"];
/* Live Commentary is hidden for now. */
const SHOW_COMMENTARY = false;

const playerPos = (p, sec) => {
  const phase = p.num * 1.31 + (p.team === "away" ? 2.15 : 0);
  const dx = Math.sin(sec * 0.045 + phase) * 22 + Math.cos(sec * 0.018 + phase) * 6;
  const dy = Math.cos(sec * 0.032 + phase * 0.7) * 16 + Math.sin(sec * 0.022 + phase) * 5;
  return { x: p.x + dx, y: p.y + dy };
};
const ballPos = (sec) => ({
  x: 340 + Math.sin(sec * 0.038) * 210 + Math.cos(sec * 0.021) * 30,
  y: 220 + Math.cos(sec * 0.026) * 115 + Math.sin(sec * 0.046) * 22,
});
const ALL_PLAYERS = [
  ...ROSTER_HOME.map((p) => ({ ...p, team: "home" })),
  ...ROSTER_AWAY.map((p) => ({ ...p, team: "away" })),
];

/* Live Commentary — showcase data so the panel feels alive on first load. */
const INITIAL_CHAT = [
  { id: 1, role: "system", text: "Live commentary mode — type what you see. Events are detected from your message." },
  { id: 2, role: "user", min: "12'", text: "Salah picks the ball up in midfield, switches it diagonally to El Shahat on the right" },
  { id: 3, role: "ai",   min: "12'", detected: { type: "cross", team: "home", player: "T. Salah", detail: "Diagonal switch → El Shahat" } },
  { id: 4, role: "user", min: "24'", text: "Mostafa whips in a great cross, Sherif's header is caught by the keeper!" },
  { id: 5, role: "ai",   min: "24'", detected: { type: "save", team: "away", player: "Zamalek GK", detail: "Header by M. Sherif · Comfortable catch" } },
  { id: 6, role: "user", min: "37'", text: "GOOOAAAL!! Mohamed Sherif fires it into the top corner from the edge of the box!!" },
  { id: 7, role: "ai",   min: "37'", detected: { type: "goal", team: "home", player: "M. Sherif", detail: "Right foot · Top-right corner · 18 yards" } },
  { id: 8, role: "user", min: "44'", text: "Sasi pulls down Hany near the touchline, that has to be a yellow" },
  { id: 9, role: "ai",   min: "44'", detected: { type: "card", team: "away", player: "F. Sasi", detail: "Yellow · Foul on M. Hany" } },
  { id: 10, role: "user", min: "58'", text: "Corner for Al Ahly, Mostafa swings it in from the left" },
  { id: 11, role: "ai",  min: "58'", detected: { type: "corner", team: "home", player: "O. Mostafa", detail: "Inswinger from the left" } },
  { id: 12, role: "user", min: "67'", text: "Kahraba breaks through but flagged offside again — third time tonight" },
  { id: 13, role: "ai",  min: "67'", detected: { type: "offside", team: "away", player: "A. Kahraba", detail: "Caught a yard behind the line" } },
];

const detectFromText = (text) => {
  const t = text.toLowerCase();
  const sideHome = /(ahly|sherif|salah|mostafa|el shahat|fathy|hany|dieng|kamal|ibrahim)/i.test(text);
  const sideAway = /(zamalek|sasi|kahraba|sharabini|emam|el said|magdy|abdelmonem|fawzi|abdelshafy)/i.test(text);
  const team = sideAway && !sideHome ? "away" : "home";
  if (/(goooal|gooal|goal|scor|finish|nets|net it|back of the net)/i.test(t))
    return { type: "goal", team, player: team === "home" ? "M. Sherif" : "A. Kahraba", detail: "Open play · Right foot" };
  if (/red card|sent off/i.test(t))
    return { type: "card", team, player: team === "home" ? "A. Hany" : "M. Abdelmonem", detail: "Red card · Serious foul play" };
  if (/(yellow|book|caution|card)/i.test(t))
    return { type: "card", team, player: team === "home" ? "A. Dieng" : "F. Sasi", detail: "Yellow · Tactical foul" };
  if (/corner|flag-kick|set piece/i.test(t))
    return { type: "corner", team, player: team === "home" ? "O. Mostafa" : "W. Sharabini", detail: "Whipped delivery" };
  if (/save|denied|keeper|stopped|reflex|tipped/i.test(t))
    return { type: "save", team: team === "home" ? "away" : "home", player: team === "home" ? "Zamalek GK" : "Al Ahly GK", detail: "Reflex save · Low" };
  if (/foul|tackle|trip|brought down/i.test(t))
    return { type: "foul", team, player: team === "home" ? "A. Dieng" : "O. El Said", detail: "Late challenge" };
  if (/offside|flagged/i.test(t))
    return { type: "offside", team, player: team === "home" ? "H. El Shahat" : "A. Kahraba", detail: "Caught behind the line" };
  if (/cross|whip|delivery|swung in/i.test(t))
    return { type: "cross", team, player: team === "home" ? "O. Mostafa" : "K. Fawzi", detail: "From the flank" };
  if (/interception|read it|cut out/i.test(t))
    return { type: "interception", team, player: team === "home" ? "O. Kamal" : "M. Abdelshafy", detail: "Read the pass" };
  if (/clearance|cleared|hoof/i.test(t))
    return { type: "clearance", team, player: team === "home" ? "A. Hany" : "M. Abdelmonem", detail: "Defensive clearance" };
  if (/block|charged down/i.test(t))
    return { type: "block", team, player: team === "home" ? "Y. Ibrahim" : "H. Magdy", detail: "Body in the way" };
  if (/sub|on for|comes on|comes off|replac/i.test(t))
    return { type: "sub", team, player: team === "home" ? "K. Fathy" : "S. Mustafa", detail: "Tactical change" };
  if (/shot|effort|strike|drive/i.test(t))
    return { type: "shot", team, player: team === "home" ? "T. Salah" : "Z. Emam", detail: "Long-range effort" };
  return { type: "shot", team, player: team === "home" ? "K. Fathy" : "F. Sasi", detail: "Half-chance" };
};
export function VideoTab({ toast, match, onUpload }) {
  const hasVideo = match?.hasVideo !== false;
  const analysing = match?.analysing === true;
  const [viewMode, setViewMode] = useState("video");
  const iframeRef = useRef(null);
  const [sec, setSec] = useState(2160);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [events, setEvents] = useState(EVENTS);
  const [teamF, setTeamF] = useState("all");
  const [typeSel, setTypeSel] = useState(DEFAULT_EVENT_TYPES); // multi-select event categories
  const [showEventFilters, setShowEventFilters] = useState(false);
  const [playerF, setPlayerF] = useState("all");
  const [timelineTypes, setTimelineTypes] = useState(DEFAULT_TIMELINE_TYPES);
  const [timelineTeam, setTimelineTeam] = useState("all");
  const [showTimelineFilters, setShowTimelineFilters] = useState(true);
  const [active, setActive] = useState(5);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ min: "", team: "home", type: "shot", player: "", detail: "" });
  const [uploadStep, setUploadStep] = useState("cta");
  const [urlInput, setUrlInput] = useState("");
  const [videoStart, setVideoStart] = useState(0);
  const timer = useRef(null);
  const uploadTimer = useRef(null);

  useEffect(() => () => clearTimeout(uploadTimer.current), []);

  const submitUrl = () => {
    if (!urlInput.trim()) return;
    setUploadStep("uploading");
    uploadTimer.current = setTimeout(() => {
      onUpload && onUpload();
      setUploadStep("cta");
      setUrlInput("");
    }, 5000);
  };

  const pickEvent = (ev) => {
    if (viewMode === "video") {
      const r = Math.floor(Math.random() * TOTAL);
      setSec(r);
      setVideoStart(r);
    } else {
      setSec(Math.max(0, Math.min(TOTAL, ev.sec)));
    }
    setActive(ev.id);
  };

  const sendDmCommand = (command, parameters) => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(parameters !== undefined ? { command, parameters } : { command }),
        "*"
      );
    } catch {}
  };

  const seekBy = (delta) => {
    const next = Math.max(0, Math.min(TOTAL, sec + delta));
    setSec(next);
    if (viewMode === "video") {
      setVideoStart(next);
      sendDmCommand("seek", [next]);
    }
  };

  const togglePlayCmd = () => {
    const next = !playing;
    setPlaying(next);
    if (viewMode === "video") sendDmCommand(next ? "play" : "pause");
  };

  const swapView = () => setViewMode((v) => (v === "video" ? "pitch" : "video"));

  const [panelTab, setPanelTab] = useState("events");
  const [chat, setChat] = useState(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    if (panelTab === "commentary" && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat, panelTab]);

  const sendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    const min = Math.floor(sec / 60) + "'";
    const baseId = Date.now();
    const userMsg = { id: baseId, role: "user", min, text };
    const aiMsg = { id: baseId + 1, role: "ai", min, pending: true };
    setChat((c) => [...c, userMsg, aiMsg]);
    setChatInput("");
    setTimeout(() => {
      const detected = detectFromText(text);
      setChat((c) => c.map((m) => m.id === baseId + 1 ? { ...m, pending: false, detected } : m));
    }, 1100);
  };

  const saveDetected = (detected, min) => {
    const m = parseInt(min) || Math.floor(sec / 60);
    const id = Date.now();
    setEvents((prev) => [...prev, {
      id, sec: m * 60, min: m + "'",
      type: detected.type, team: detected.team,
      player: detected.player, detail: detected.detail || "",
    }].sort((a, b) => a.sec - b.sec));
    setActive(id);
    toast(`Saved: ${detected.type} at ${m}'`);
  };

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
  const filtered = events.filter((e) =>
    (teamF === "all" || e.team === teamF) &&
    typeSel.includes(TYPE_CAT[e.type]) &&
    (playerF === "all" || (e.player && e.player.includes(playerF)))
  );
  const seek = (s) => setSec(Math.max(0, Math.min(TOTAL, s)));
  const counts = (pred) => events.filter(pred).length;
  /* Team and player are mutually exclusive: a player already implies a team. */
  const onTeam = (k) => { setTeamF(k); if (k !== "all") setPlayerF("all"); };
  const onPlayer = (name) => { setPlayerF(name); if (name !== "all") setTeamF("all"); };
  const toggleType = (k) => setTypeSel((prev) => prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]);

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

  const homeLabel = match?.home === false ? match?.opponent || "Al Ahly" : "Al Ahly";
  const awayLabel = match?.home === false ? "Al Ahly" : match?.opponent || "Zamalek";

  if (!hasVideo) {
    return (
      <div className="workspace empty-workspace">
        <div className="video-wrap">
          <div className="video-area upload-area">
            {uploadStep === "cta" && (
              <div className="upload-cta">
                <div className="upload-icon"><Upload size={32} /></div>
                <div className="upload-title">Upload Match Video</div>
                <div className="upload-sub">
                  Add a recording to start analysing<br />
                  <b>Al Ahly vs {match?.opponent || "your opponent"}</b>
                </div>
                <button className="btn-primary upload-btn" onClick={() => setUploadStep("url")}>
                  <Upload size={13} /> Upload Video
                </button>
                <div className="upload-hint">MP4, MOV or paste a Dailymotion / YouTube link</div>
              </div>
            )}

            {uploadStep === "url" && (
              <div className="upload-cta">
                <div className="upload-icon"><Link2 size={30} /></div>
                <div className="upload-title">Paste Video URL</div>
                <div className="upload-sub">Any URL works — this is a demo upload.</div>
                <div className="url-input-row">
                  <input
                    className="form-input"
                    type="text"
                    placeholder="https://dailymotion.com/video/..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") submitUrl(); }}
                    autoFocus
                  />
                  <button
                    className="btn-primary"
                    onClick={submitUrl}
                    disabled={!urlInput.trim()}
                    style={!urlInput.trim() ? { opacity: 0.45, cursor: "not-allowed" } : {}}
                  >Upload</button>
                </div>
                <button className="upload-cancel" onClick={() => { setUploadStep("cta"); setUrlInput(""); }}>
                  Cancel
                </button>
              </div>
            )}

            {uploadStep === "uploading" && (
              <div className="upload-cta">
                <Loader2 size={42} className="spin" style={{ color: C.green }} />
                <div className="upload-title" style={{ marginTop: ".4rem" }}>Uploading video…</div>
                <div className="upload-sub">Preparing your match for analysis</div>
                <div className="upload-progress"><div className="upload-progress-fill" /></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace">
      <div className="left-col">
        <div className="video-wrap">
          <div className="video-area" onClick={viewMode === "pitch" ? () => setPlaying((p) => !p) : undefined}>
            {/* Video layer — stays mounted (and playing) even when minimised to the corner */}
            <div className={"va-layer" + (viewMode === "video" ? " is-main" : " is-pip")}>
              <div className="dm-embed">
                <iframe
                  ref={iframeRef}
                  key={videoStart}
                  src={videoStart > 0
                    ? `${DAILYMOTION_SRC}&start=${videoStart}&autoplay=1`
                    : `${DAILYMOTION_SRC}&autoplay=1`}
                  title="Dailymotion Video Player"
                  allow="web-share; autoplay"
                  allowFullScreen
                />
              </div>
              {viewMode !== "video" && (
                <div className="pip-hit" role="button" tabIndex={0} title="Switch to video view"
                  onClick={(e) => { e.stopPropagation(); swapView(); }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); swapView(); } }}>
                  <span className="pip-label"><Repeat size={10} /> Video</span>
                </div>
              )}
            </div>

            {/* Tactical pitch layer — floats in the corner while the video plays */}
            <div className={"va-layer" + (viewMode === "pitch" ? " is-main" : " is-pip")}>
              <Pitch vb="0 0 680 440">
                {ALL_PLAYERS.map((p) => {
                  const pos = playerPos(p, sec);
                  const color = teamColor(p.team);
                  return (
                    <g key={`${p.team}-${p.num}`} style={{ pointerEvents: "none" }}>
                      <circle cx={pos.x} cy={pos.y} r={11}
                        fill={color} stroke="rgba(0,0,0,0.55)" strokeWidth="1" />
                      <text x={pos.x} y={pos.y + 3.6} textAnchor="middle"
                        fontSize="10.5" fontFamily="Syne" fontWeight="700"
                        fill={p.team === "home" ? "#0d2b1a" : "#fff"}>
                        {p.num}
                      </text>
                    </g>
                  );
                })}
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
              {viewMode === "pitch" && !playing && (
                <div className="play-overlay">
                  <div className="play-btn-big"><Play size={22} fill={C.green} stroke="none" /></div>
                </div>
              )}
              {viewMode !== "pitch" && (
                <div className="pip-hit" role="button" tabIndex={0} title="Switch to pitch view"
                  onClick={(e) => { e.stopPropagation(); swapView(); }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); swapView(); } }}>
                  <span className="pip-label"><Repeat size={10} /> Pitch</span>
                </div>
              )}
            </div>

            <div className="video-badge-tl">
              <span className="dot" style={{ background: HOME }} /> {homeLabel}
              <span style={{ color: C.muted2, padding: "0 .3rem" }}>vs</span>
              <span className="dot" style={{ background: AWAY }} /> {awayLabel}
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
                {!analysing && events.map((ev) => (
                  <div key={ev.id} title={`${ev.min} ${ev.player}`} onClick={(e) => { e.stopPropagation(); pickEvent(ev); }}
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

        {analysing ? (
          <div className="timeline-wrap">
            <AnalysingSkeleton label="Building match timeline…" sub="Detecting events and key moments" bars={4} />
          </div>
        ) : (
        <div className="timeline-wrap">
          <div className="tl-hdr">
            <div className="pnl-t">Match Timeline</div>
            <div className="tl-hdr-r">
              <div className="lgnd"><Leg c={HOME} t={homeLabel} /><Leg c={AWAY} t={awayLabel} /><Leg c={C.softBlue} t="Neutral" /></div>
              <button className="tl-toggle" onClick={() => setShowTimelineFilters((v) => !v)}>{showTimelineFilters ? "Hide Filters" : "Show Filters"}</button>
            </div>
          </div>
          {showTimelineFilters && (
            <div className="timeline-filter">
              <div className="tl-filter-row">
                <span className="tl-filter-lbl">Team</span>
                {[["all", "All"], ["home", homeLabel], ["away", awayLabel], ["neutral", "Neutral"]].map(([k, l]) => (
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
                      onClick={() => pickEvent(ev)}
                      style={{ left: ev.sec / TOTAL * 100 + "%", background: teamColor(ev.team), cursor: "pointer" }} />
                  ))}
                </div>
              </div>
            );
          })}
          <div className="time-axis">{["0'", "15'", "30'", "HT", "60'", "75'", "90'"].map((t) => <span key={t} className="time-tick">{t}</span>)}</div>
        </div>
        )}

        {!analysing && (
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
        )}
      </div>

      <div className="events-panel">
        {SHOW_COMMENTARY && (
          <div className="panel-subtabs">
            <button className={"panel-subtab" + (panelTab === "events" ? " on" : "")}
              onClick={() => setPanelTab("events")}>
              <Activity size={11} /> Events
            </button>
            <button className={"panel-subtab" + (panelTab === "commentary" ? " on" : "")}
              onClick={() => setPanelTab("commentary")}>
              <MessageSquare size={11} /> Live Commentary
            </button>
          </div>
        )}

        {panelTab === "events" ? (
          analysing ? (
            <AnalysingSkeleton label="Detecting events…" sub="Goals, cards, shots and more" bars={5} />
          ) : (
          <>
            <div className="ep-top">
              <div className="ep-title-row">
                <div className="ep-title">Events</div>
                <div className="ep-title-right">
                  <div className="ev-count">{filtered.length} event{filtered.length !== 1 ? "s" : ""}</div>
                  <button className="tl-toggle" onClick={() => setShowEventFilters((v) => !v)}>{showEventFilters ? "Hide Filters" : "Show Filters"}</button>
                </div>
              </div>
              {showEventFilters && (
                <div className="timeline-filter">
                  <div className="tl-filter-row">
                    <span className="tl-filter-lbl">Team</span>
                    {[["all", "All"], ["home", homeLabel], ["away", awayLabel]].map(([k, l]) => (
                      <button key={k} className={"tl-chip" + (teamF === k ? " active" : "")} onClick={() => onTeam(k)}>{l}</button>
                    ))}
                  </div>
                  <div className="tl-filter-row">
                    <span className="tl-filter-lbl">Events</span>
                    <button className={"tl-chip" + (typeSel.length === ALL_EVENT_TYPES.length ? " active" : "")} onClick={() => setTypeSel(ALL_EVENT_TYPES)}>All</button>
                    {FILTERS.filter(([k]) => k !== "all").map(([k, l]) => (
                      <button key={k} className={"tl-chip" + (typeSel.includes(k) ? " active" : "")} onClick={() => toggleType(k)}>{l}</button>
                    ))}
                  </div>
                  <div className="tl-filter-row">
                    <span className="tl-filter-lbl">Player</span>
                    <div className="ev-sel-wrap" style={{ flex: 1 }}>
                      <select className="ev-select" value={playerF} onChange={(e) => onPlayer(e.target.value)} aria-label="Filter by player">
                        <option value="all">All players</option>
                        <optgroup label={homeLabel}>
                          {ROSTER_HOME.map((p) => <option key={`h-${p.num}`} value={p.name}>#{p.num} · {p.name}</option>)}
                        </optgroup>
                        <optgroup label={awayLabel}>
                          {ROSTER_AWAY.map((p) => <option key={`a-${p.num}`} value={p.name}>#{p.num} · {p.name}</option>)}
                        </optgroup>
                      </select>
                      <ChevronDown size={12} className="ev-sel-icon" />
                    </div>
                  </div>
                </div>
              )}
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
                      <div key={ev.id} className={"ev-row" + (active === ev.id ? " ev-active" : "")} onClick={() => pickEvent(ev)}>
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
          </>
          )
        ) : (
          <div className="commentary">
            <div className="comm-hint">
              <Sparkles size={11} /> AI reads your commentary and turns it into events.
            </div>
            <div className="chat-stream" ref={chatRef}>
              {chat.map((m) => {
                if (m.role === "system") {
                  return <div key={m.id} className="chat-msg system">{m.text}</div>;
                }
                if (m.role === "user") {
                  return (
                    <div key={m.id} className="chat-msg user">
                      <div className="chat-min">You · {m.min}</div>
                      <div className="chat-bubble">{m.text}</div>
                    </div>
                  );
                }
                return (
                  <div key={m.id} className="chat-msg ai">
                    <div className="chat-min">Scout AI · {m.min}</div>
                    <div className="chat-bubble">
                      <div className="ai-icon"><Sparkles size={12} /></div>
                      {m.pending ? (
                        <span className="chat-pending">Reading commentary…</span>
                      ) : (
                        <DetectedCard d={m.detected} min={m.min} onSave={saveDetected} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="chat-controls">
              <button className="chat-ctrl" onClick={() => seekBy(-5)} title="Back 5 seconds">
                <SkipBack size={13} /><span>5s</span>
              </button>
              <button className={"chat-ctrl primary" + (playing ? " on" : "")} onClick={togglePlayCmd} title={playing ? "Pause" : "Play"}>
                {playing ? <Pause size={14} fill="currentColor" stroke="none" /> : <Play size={14} fill="currentColor" stroke="none" />}
              </button>
              <button className="chat-ctrl" onClick={() => seekBy(5)} title="Forward 5 seconds">
                <span>5s</span><SkipForward size={13} />
              </button>
              <div className="chat-time"><strong>{fmt(sec)}</strong> / 94:07</div>
            </div>
            <div className="chat-input-row">
              <input
                className="chat-input"
                placeholder="Type what you see… (e.g. 'Sherif scores from 20 yards')"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendChat(); }}
              />
              <button className="chat-send" onClick={sendChat} disabled={!chatInput.trim()} title="Send">
                <Send size={14} />
              </button>
            </div>
          </div>
        )}

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
                  <option value="home">{homeLabel} (Home)</option><option value="away">{awayLabel} (Away)</option><option value="neutral">Neutral</option>
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

function DetectedCard({ d, min, onSave }) {
  if (!d) return null;
  const color = d.team === "home" ? HOME : d.team === "away" ? AWAY : C.softBlue;
  const teamLabel = d.team === "home" ? "Home" : d.team === "away" ? "Away" : "Neutral";
  return (
    <div className="detected">
      <div className="detected-head">
        <span className="detected-type" style={{ color }}>
          ✓ {d.type.toUpperCase()}
        </span>
        <span className="detected-tag" style={{ background: `${color}22`, color }}>{teamLabel}</span>
      </div>
      <div className="detected-player">{d.player}</div>
      {d.detail && <div className="detected-detail">{d.detail}</div>}
      <div className="detected-actions">
        <button className="detected-btn" onClick={() => onSave(d, min)}>
          <Plus size={10} /> Save to events
        </button>
      </div>
    </div>
  );
}
