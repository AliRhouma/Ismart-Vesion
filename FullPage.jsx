import React, { useState } from "react";
import {
  LayoutGrid, Film, Target, Activity, Users, FileText, Shield, Play,
  Share2, Download, Crosshair, BarChart3,
} from "lucide-react";
import { C, HOME, AWAY } from "./src/constants/theme";
import { CSS } from "./src/styles/appStyles";
import { VideoTab } from "./src/tabs/VideoTab";
import { Overview } from "./src/tabs/Overview";
import { Shots } from "./src/tabs/Shots";
import { Momentum } from "./src/tabs/Momentum";
import { Heatmaps } from "./src/tabs/Heatmaps";
import { Passing } from "./src/tabs/Passing";
import { PlayersTab } from "./src/tabs/PlayersTab";

const TABS = [
  { k: "video", label: "Video", icon: Film },
  { k: "overview", label: "Overview", icon: LayoutGrid },
  { k: "shots", label: "Shot Map", icon: Target },
  { k: "momentum", label: "Momentum", icon: Activity },
  { k: "heatmaps", label: "Heatmaps", icon: Crosshair },
  { k: "passing", label: "Passing", icon: BarChart3 },
  { k: "players", label: "Players", icon: Users },
];

export default function App() {
  const [tab, setTab] = useState("video");
  const [toastMsg, setToastMsg] = useState(null);
  const toast = (m) => { setToastMsg(m); setTimeout(() => setToastMsg(null), 2400); };
  return (
    <div className="ic-app">
      <style>{CSS}</style>
      <header className="topbar">
        <div className="logo">iSmart<span>Coach</span></div>
        <div className="tb-div" />
        <nav className="breadcrumb">Matches  <b>Al Ahly vs Zamalek</b>  <span className="g">Analysis</span></nav>
        <div className="tb-r">
          <button className="btn-g" onClick={() => toast("Export started")}><Download size={12} />Export</button>
          <button className="btn-p" onClick={() => toast("Share link copied")}><Share2 size={12} />Share</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="ns">Workspace</div>
          {[["Dashboard", LayoutGrid], ["Matches", Film], ["Video Analysis", Play, true], ["Players", Users], ["Analytics", BarChart3]].map(([l, Ic, on]) => (
            <a key={l} className={"ni" + (on ? " a" : "")}><Ic size={14} />{l}</a>
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
          <div className="mh">
            <div className="tb"><div className="tbdg h">AH</div><div><div className="tn">Al Ahly SC</div><div className="ts">Home  Egypt</div></div></div>
            <div className="mh-center">
              <div style={{ textAlign: "center" }}><div className="ml">Match Day 14</div><div className="md">May 10, 2026  20:00</div></div>
              <div className="sc"><span className="sn" style={{ color: HOME }}>2</span><span style={{ color: C.muted2 }}></span><span className="sn" style={{ color: AWAY }}>1</span></div>
              <div style={{ textAlign: "center" }}><div className="ml">Premier League</div><div className="md">Full Time  94'</div></div>
            </div>
            <div className="tb" style={{ flexDirection: "row-reverse" }}><div className="tbdg aw">ZM</div><div style={{ textAlign: "right" }}><div className="tn">Zamalek SC</div><div className="ts">Away  Egypt</div></div></div>
            <div className="sb"><span className="pu" />Analysed</div>
          </div>

          <div className="sec-tabs">
            {TABS.map((t) => {
              const Ic = t.icon;
              return <button key={t.k} className={"sec-tab" + (tab === t.k ? " on" : "")} onClick={() => setTab(t.k)}><Ic size={12} />{t.label}</button>;
            })}
          </div>

          <div className="sec-content">
            {tab === "video" && <VideoTab toast={toast} />}
            {tab === "overview" && <Overview />}
            {tab === "shots" && <Shots />}
            {tab === "momentum" && <Momentum />}
            {tab === "heatmaps" && <Heatmaps />}
            {tab === "passing" && <Passing />}
            {tab === "players" && <PlayersTab />}
          </div>
        </main>
      </div>

      {toastMsg && <div className="toast show"><span className="toast-dot" />{toastMsg}</div>}
    </div>
  );
}
