import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { C, HOME, AWAY, GRID, TICK } from '../constants/theme';
import { NET_HOME, LINKS_HOME, NET_AWAY, LINKS_AWAY } from '../data/mockData';
import { CoachTooltip } from '../components/ui/CoachTooltip';
import { Panel, Leg, StatCard } from '../components/ui/Panel';
import { PassNetwork } from '../components/pitch/PassNetwork';
import { PlayerPassMap } from '../components/pitch/PlayerPassMap';

export function Passing() {
  const dir = [{ name: "Backward", home: 35, away: 28 }, { name: "Sideways", home: 120, away: 95 }, { name: "Forward", home: 82, away: 55 }, { name: "Long", home: 41, away: 26 }];
  const prog = [{ name: "Def → Mid", home: 5, away: 3 }, { name: "Mid → Att", home: 8, away: 4 }, { name: "Wing → Center", home: 6, away: 4 }, { name: "Through balls", home: 3, away: 2 }, { name: "Into box", home: 2, away: 1 }];
  return (
    <>
      <div className="g4">
        <StatCard v="482" l="Total Passes" home={278} away={204} />
        <StatCard v="83%" l="Pass Accuracy" home="86%" away="79%" />
        <StatCard v="38" l="Progressive Passes" color={C.green} home={24} away={14} />
        <StatCard v="52" l="Long Balls" home={28} away={24} />
      </div>
      <div className="g2">
        <Panel title="Pass Network — Al Ahly"><PassNetwork nodes={NET_HOME} links={LINKS_HOME} color={HOME} /></Panel>
        <Panel title="Pass Network — Zamalek"><PassNetwork nodes={NET_AWAY} links={LINKS_AWAY} color={AWAY} /></Panel>
      </div>
      <Panel title="Player Pass Map"
        legend={<><Leg c={HOME} t="Completed" /><span className="lgnd-i"><span className="lgnd-d" style={{ background: "#FF4D4F" }} />Misplaced</span></>}>
        <PlayerPassMap />
      </Panel>
      <div className="g2">
        <Panel title="Pass Direction" legend={<><Leg c={HOME} t="Al Ahly" /><Leg c={AWAY} t="Zamalek" /></>}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dir} margin={{ top: 10, right: 16, left: -14, bottom: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip content={<CoachTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="home" name="Al Ahly" fill={HOME} radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Bar dataKey="away" name="Zamalek" fill={AWAY} radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Progressive Passes" legend={<><Leg c={HOME} t="Al Ahly" /><Leg c={AWAY} t="Zamalek" /></>}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={prog} layout="vertical" margin={{ top: 10, right: 16, left: 30, bottom: 0 }}>
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={TICK} axisLine={false} tickLine={false} width={92} />
              <Tooltip content={<CoachTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="home" name="Al Ahly" fill={HOME} radius={[0, 3, 3, 0]} maxBarSize={14} />
              <Bar dataKey="away" name="Zamalek" fill={AWAY} radius={[0, 3, 3, 0]} maxBarSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </>
  );
}
