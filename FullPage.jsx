import React, { useEffect, useRef, useState } from "react";
import {
  LayoutGrid, Film, Target, Activity, Users, FileText, Shield, Play,
  Share2, Download, Crosshair, BarChart3, Footprints, ChevronRight, ArrowLeft, Loader2,
} from "lucide-react";
import { C, HOME, AWAY } from "./src/constants/theme";
import { CSS } from "./src/styles/appStyles";
import { VideoTab } from "./src/tabs/VideoTab";
import { TrackPlayers } from "./src/tabs/TrackPlayers";
import { Overview } from "./src/tabs/Overview";
import { Shots } from "./src/tabs/Shots";
import { Momentum } from "./src/tabs/Momentum";
import { Heatmaps } from "./src/tabs/Heatmaps";
import { Passing } from "./src/tabs/Passing";
import { PlayersTab } from "./src/tabs/PlayersTab";
import { MatchesPage, NewMatchModal, MOCK_MATCHES } from "./src/tabs/MatchesPage";
import { AnalysingSkeleton } from "./src/components/ui/Panel";

const TABS = [
  { k: "video", label: "Video", icon: Film },
  { k: "track", label: "Track Players", icon: Footprints },
  { k: "overview", label: "Overview", icon: LayoutGrid },
  { k: "shots", label: "Shot Map", icon: Target },
  { k: "momentum", label: "Momentum", icon: Activity },
  { k: "heatmaps", label: "Heatmaps", icon: Crosshair },
  { k: "passing", label: "Passing", icon: BarChart3 },
  { k: "players", label: "Players", icon: Users },
];

export default function App() {
  const [view, setView] = useState("matches");
  const [match, setMatch] = useState(MOCK_MATCHES[0]);
  const [tab, setTab] = useState("video");
  const [newOpen, setNewOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const analyseTimer = useRef(null);
  const toast = (m) => { setToastMsg(m); setTimeout(() => setToastMsg(null), 2400); };

  useEffect(() => () => clearTimeout(analyseTimer.current), []);

  const openMatch = (m) => { clearTimeout(analyseTimer.current); setMatch(m); setView("match"); setTab("video"); };
  const goMatches = () => { clearTimeout(analyseTimer.current); setView("matches"); };
  const handleUpload = () => {
    setMatch((m) => ({ ...m, hasVideo: true, analysing: true, status: "Analysing" }));
    toast("Video uploaded — analysing match…");
    const targetId = match.id;
    clearTimeout(analyseTimer.current);
    analyseTimer.current = setTimeout(() => {
      setMatch((m) => m.id === targetId ? { ...m, analysing: false, status: "Analysed" } : m);
      toast("Analysis complete");
    }, 20000);
  };

  const isMatchesView = view === "matches";
  const homeTeam = match.home ? "Al Ahly SC" : match.opponent;
  const awayTeam = match.home ? match.opponent : "Al Ahly SC";
  const homeCode = match.home ? "AH" : match.opponentCode;
  const awayCode = match.home ? match.opponentCode : "AH";
  const homeScore = match.home ? match.scoreH : match.scoreA;
  const awayScore = match.home ? match.scoreA : match.scoreH;
  const visibleTabs = match.hasVideo ? TABS : TABS.filter((t) => t.k === "video");

  return (
    <div className="ic-app">
      <style>{CSS}</style>
      <header className="topbar">
        <div className="logo">iSmart<span>Coach</span></div>
        <div className="tb-div" />
        <nav className="breadcrumb">
          <span className="bc-link" onClick={goMatches}>Matches</span>
          {!isMatchesView && (
            <>
              <ChevronRight size={11} style={{ verticalAlign: "middle", margin: "0 .15rem", color: C.muted2 }} />
              <b>Al Ahly vs {match.opponent}</b>
              <ChevronRight size={11} style={{ verticalAlign: "middle", margin: "0 .15rem", color: C.muted2 }} />
              <span className="g">{match.hasVideo ? "Analysis" : "New Match"}</span>
            </>
          )}
        </nav>
        <div className="tb-r">
          <button className="btn-g" onClick={() => toast("Export started")}><Download size={12} />Export</button>
          <button className="btn-p" onClick={() => toast("Share link copied")}><Share2 size={12} />Share</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="ns">Workspace</div>
          {[
            ["Dashboard", LayoutGrid, false, null],
            ["Matches", Film, isMatchesView, goMatches],
            ["Video Analysis", Play, !isMatchesView, null],
            ["Players", Users, false, null],
            ["Analytics", BarChart3, false, null],
          ].map(([l, Ic, on, click]) => (
            <a key={l} className={"ni" + (on ? " a" : "")} onClick={click || undefined}
              style={click ? { cursor: "pointer" } : {}}>
              <Ic size={14} />{l}
            </a>
          ))}
          <div className="ns" style={{ marginTop: ".4rem" }}>Reports</div>
          {[["Reports", FileText], ["Scouting", Shield]].map(([l, Ic]) => (<a key={l} className="ni"><Ic size={14} />{l}</a>))}
          <div className="si-foot">
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <div className="av">BA</div>
              <div><div style={{ fontFamily: "Syne", fontSize: ".72rem", fontWeight: 700 }}>Bilel Analyst</div>
                <div style={{ fontFamily: "DM Sans", fontSize: ".62rem", color: C.muted2 }}>Head Analyst</div></div>
            </div>
          </div>
        </aside>

        <main className="main">
          {isMatchesView ? (
            <MatchesPage onSelect={openMatch} onNew={() => setNewOpen(true)} />
          ) : (
            <>
              <div className="mh">
                <button className="back-btn" onClick={goMatches} title="Back to matches" aria-label="Back to matches">
                  <ArrowLeft size={15} />
                </button>
                <div className="tb">
                  <div className={"tbdg " + (match.home ? "h" : "aw")}>{homeCode}</div>
                  <div><div className="tn">{homeTeam}</div><div className="ts">Home · Egypt</div></div>
                </div>
                <div className="mh-center">
                  <div style={{ textAlign: "center" }}>
                    <div className="ml">{match.competition}</div>
                    <div className="md">{match.date}</div>
                  </div>
                  <div className="sc">
                    <span className="sn" style={{ color: match.home ? HOME : AWAY }}>
                      {homeScore == null ? "—" : homeScore}
                    </span>
                    <span style={{ color: C.muted2 }}>·</span>
                    <span className="sn" style={{ color: match.home ? AWAY : HOME }}>
                      {awayScore == null ? "—" : awayScore}
                    </span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div className="ml">{match.hasVideo ? "Full Time · 94'" : "Awaiting video"}</div>
                    <div className="md">{match.status}</div>
                  </div>
                </div>
                <div className="tb" style={{ flexDirection: "row-reverse" }}>
                  <div className={"tbdg " + (match.home ? "aw" : "h")}>{awayCode}</div>
                  <div style={{ textAlign: "right" }}><div className="tn">{awayTeam}</div><div className="ts">Away · Egypt</div></div>
                </div>
                <div className={"sb" + (match.analysing ? " sb-analysing" : "")}><span className="pu" />{match.status}</div>
              </div>

              <div className="sec-tabs">
                {visibleTabs.map((t) => {
                  const Ic = t.icon;
                  return <button key={t.k} className={"sec-tab" + (tab === t.k ? " on" : "")} onClick={() => setTab(t.k)}><Ic size={12} />{t.label}</button>;
                })}
              </div>

              {match.analysing && (
                <div className="analysing-banner">
                  <Loader2 size={16} className="spin" style={{ color: C.green, flexShrink: 0 }} />
                  <div className="ab-text">Analysing match data…</div>
                  <div className="ab-bar"><div className="ab-bar-fill" /></div>
                  <div className="ab-eta">~20s</div>
                </div>
              )}

              <div className={"sec-content" + (match.analysing ? " analysing" : "")}>
                {match.analysing && tab !== "video" ? (
                  <AnalysingSkeleton
                    label={`Analysing ${TABS.find((t) => t.k === tab)?.label || tab}…`}
                    bars={6}
                  />
                ) : (
                  <>
                    {tab === "video" && <VideoTab toast={toast} match={match} onUpload={handleUpload} />}
                    {tab === "track" && <TrackPlayers toast={toast} />}
                    {tab === "overview" && <Overview />}
                    {tab === "shots" && <Shots />}
                    {tab === "momentum" && <Momentum />}
                    {tab === "heatmaps" && <Heatmaps />}
                    {tab === "passing" && <Passing />}
                    {tab === "players" && <PlayersTab />}
                  </>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {newOpen && (
        <NewMatchModal
          onClose={() => setNewOpen(false)}
          onCreate={(m) => { setNewOpen(false); openMatch(m); }}
        />
      )}

      {toastMsg && <div className="toast show"><span className="toast-dot" />{toastMsg}</div>}
    </div>
  );
}
