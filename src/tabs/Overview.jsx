import React from 'react';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { C, HOME, AWAY, CHART_COLORS, GRID, TICK, LEGEND } from '../constants/theme';
import { PERIODS } from '../data/mockData';
import { CoachTooltip } from '../components/ui/CoachTooltip';
import { Panel, Leg, StatCard } from '../components/ui/Panel';

/* Tabs content */
export function Overview() {
  const dist = [{ label: "Shots", value: 8 }, { label: "Corners", value: 6 }, { label: "Fouls", value: 7 }, { label: "Cards", value: 3 }];
  const evDist = PERIODS.map((p, i) => ({ name: p, Shots: [2,3,1,2,2,2][i], Fouls: [1,2,1,2,1,0][i], Corners: [1,1,0,1,1,2][i] }));
  return (
    <>
      <div className="g4">
        <StatCard v="24" l="Total Events" color={C.green} home={14} away={10} />
        <StatCard v="57%" l="Possession" home="57%" away="43%" />
        <StatCard v="7" l="Shots on Target" home={5} away={2} />
        <StatCard v="3" l="Cards" color={C.amber} home={1} away={2} />
      </div>
      <div className="g2">
        <Panel title="Possession">
          <div style={{ position: "relative" }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={[{ label: "Al Ahly", value: 57 }, { label: "Zamalek", value: 43 }]} dataKey="value" nameKey="label"
                  cx="50%" cy="50%" innerRadius={64} outerRadius={94} paddingAngle={3} stroke="none">
                  <Cell fill={HOME} /><Cell fill={AWAY} />
                </Pie>
                <Tooltip content={<CoachTooltip unit="%" />} />
                <Legend wrapperStyle={LEGEND} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", pointerEvents: "none", transform: "translateY(-50%)" }}>
              <div style={{ fontFamily: "Bebas Neue", fontSize: "2.6rem", color: C.green, lineHeight: 1 }}>57%</div>
              <div style={{ fontFamily: "Syne", fontSize: ".6rem", letterSpacing: ".1em", textTransform: "uppercase", color: C.muted }}>Al Ahly</div>
            </div>
          </div>
        </Panel>
        <Panel title="Event Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={dist} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={58} outerRadius={92} paddingAngle={3} stroke="none">
                {dist.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CoachTooltip />} /><Legend wrapperStyle={LEGEND} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <Panel title="Event Frequency by Period" legend={<><Leg c={HOME} t="Shots" /><Leg c={C.amber} t="Fouls" /><Leg c={C.softBlue} t="Corners" /></>}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={evDist} margin={{ top: 10, right: 16, left: -14, bottom: 0 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="name" tick={TICK} axisLine={false} tickLine={false} />
            <YAxis tick={TICK} axisLine={false} tickLine={false} />
            <Tooltip content={<CoachTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="Shots" stackId="a" fill={HOME} radius={[0, 0, 0, 0]} maxBarSize={38} />
            <Bar dataKey="Fouls" stackId="a" fill={C.amber} maxBarSize={38} />
            <Bar dataKey="Corners" stackId="a" fill={C.softBlue} radius={[5, 5, 0, 0]} maxBarSize={38} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </>
  );
}
