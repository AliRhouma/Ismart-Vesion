import React from 'react';
import { ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { C, HOME, AWAY, GRID, TICK, LEGEND } from '../constants/theme';
import { PLAYERS } from '../data/mockData';
import { CoachTooltip } from '../components/ui/CoachTooltip';
import { Panel, Leg } from '../components/ui/Panel';

export function PlayersTab() {
  const radarAxes = ["Goals", "Shots", "Pass Acc", "Tackles", "Duels", "Distance"];
  const rd = (p) => [{ k: "Goals", v: p.goals * 20 }, { k: "Shots", v: p.shots * 12 }, { k: "Pass Acc", v: p.passAcc }, { k: "Tackles", v: p.tackles * 15 }, { k: "Duels", v: p.duelsW * 8 }, { k: "Distance", v: Math.round(p.dist * 8) }];
  const sherif = PLAYERS.find((p) => p.name === "M. Sherif"), kahraba = PLAYERS.find((p) => p.name === "A. Kahraba");
  const radarData = radarAxes.map((ax, i) => ({ skill: ax, sherif: rd(sherif)[i].v, kahraba: rd(kahraba)[i].v }));
  const top5 = [...PLAYERS].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const sorted = [...PLAYERS].sort((a, b) => b.rating - a.rating);
  return (
    <>
      <div className="g2">
        <Panel title="Player Comparison — Radar" legend={<><Leg c={HOME} t="M. Sherif" /><Leg c={AWAY} t="A. Kahraba" /></>}>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid stroke={GRID} />
              <PolarAngleAxis dataKey="skill" tick={TICK} />
              <Tooltip content={<CoachTooltip />} />
              <Radar name="M. Sherif" dataKey="sherif" stroke={HOME} fill={HOME} fillOpacity={0.22} strokeWidth={2} />
              <Radar name="A. Kahraba" dataKey="kahraba" stroke={AWAY} fill={AWAY} fillOpacity={0.12} strokeWidth={1.5} />
              <Legend wrapperStyle={LEGEND} iconType="circle" />
            </RadarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Top Performers (Rating)">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={top5} layout="vertical" margin={{ top: 10, right: 24, left: 30, bottom: 0 }}>
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" domain={[0, 10]} tick={TICK} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={TICK} axisLine={false} tickLine={false} width={92} />
              <Tooltip content={<CoachTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="rating" name="Rating" radius={[0, 5, 5, 0]} maxBarSize={26}
                label={{ position: "right", fill: C.white, fontFamily: "Syne", fontSize: 11 }}>
                {top5.map((p, i) => <Cell key={i} fill={p.team === "home" ? HOME : AWAY} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <Panel title="Player Stats">
        <div style={{ overflowX: "auto" }}>
          <table className="ptable">
            <thead><tr>
              <th>Player</th><th>Pos</th><th>Team</th><th className="num">Goals</th><th className="num">Shots</th>
              <th className="num">Passes</th><th className="num">Pass%</th><th className="num">Tackles</th>
              <th className="num">Duels W</th><th className="num">Dist (km)</th><th className="num">Rating</th>
            </tr></thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.name}>
                  <td style={{ fontWeight: 500 }}>{p.name}</td><td>{p.pos}</td>
                  <td><span style={{ color: p.team === "home" ? C.green : C.blue }}>{p.team === "home" ? "AH" : "ZM"}</span></td>
                  <td className={"num " + (p.goals ? "hi" : "")}>{p.goals}</td><td className="num">{p.shots}</td>
                  <td className="num">{p.passes}</td><td className="num">{p.passAcc}%</td><td className="num">{p.tackles}</td>
                  <td className="num">{p.duelsW}/{p.duels}</td><td className="num">{p.dist}</td>
                  <td className="num"><b style={{ color: p.rating >= 7 ? C.green : p.rating < 6 ? C.softBlue : C.white }}>{p.rating}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <div className="g2">
        <Panel title="Distance Covered (km)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={PLAYERS} margin={{ top: 10, right: 10, left: -14, bottom: 30 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={{ ...TICK, fontSize: 9 }} angle={-40} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip content={<CoachTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="dist" name="Distance" radius={[4, 4, 0, 0]} maxBarSize={26}>
                {PLAYERS.map((p, i) => <Cell key={i} fill={p.team === "home" ? HOME : AWAY} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Duels Won %">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={PLAYERS.map((p) => ({ ...p, pct: Math.round(p.duelsW / p.duels * 100) }))} margin={{ top: 10, right: 10, left: -14, bottom: 30 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={{ ...TICK, fontSize: 9 }} angle={-40} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={TICK} axisLine={false} tickLine={false} tickFormatter={(v) => v + "%"} />
              <Tooltip content={<CoachTooltip unit="%" />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="pct" name="Duels won" radius={[4, 4, 0, 0]} maxBarSize={26}>
                {PLAYERS.map((p, i) => <Cell key={i} fill={p.team === "home" ? HOME : AWAY} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </>
  );
}
