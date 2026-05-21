import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { C, HOME, AWAY, GRID, TICK } from '../constants/theme';
import { SHOTS_HOME, SHOTS_AWAY } from '../data/mockData';
import { CoachTooltip } from '../components/ui/CoachTooltip';
import { Panel, Leg, StatCard } from '../components/ui/Panel';
import { ShotMap } from '../components/pitch/ShotMap';

export function Shots() {
  const xgH = SHOTS_HOME.reduce((s, x) => s + x.xg, 0);
  const xgA = SHOTS_AWAY.reduce((s, x) => s + x.xg, 0);
  const step = (shots) => {
    let cum = 0; const out = [{ min: 0, xg: 0 }];
    [...shots].sort((a, b) => a.min - b.min).forEach((s) => { cum += s.xg; out.push({ min: s.min, xg: +cum.toFixed(2) }); });
    out.push({ min: 94, xg: +cum.toFixed(2) }); return out;
  };
  const xgData = useMemo(() => {
    const h = step(SHOTS_HOME), a = step(SHOTS_AWAY);
    const mins = [...new Set([...h, ...a].map((d) => d.min))].sort((x, y) => x - y);
    const lk = (arr, m) => { let v = 0; arr.forEach((d) => { if (d.min <= m) v = d.xg; }); return v; };
    return mins.map((m) => ({ min: m, home: lk(h, m), away: lk(a, m) }));
  }, []);
  const zones = [{ name: "Al Ahly", inside: 4, outside: 3 }, { name: "Zamalek", inside: 2, outside: 3 }];
  return (
    <>
      <div className="g4">
        <StatCard v={SHOTS_HOME.length + SHOTS_AWAY.length} l="Total Shots" home={SHOTS_HOME.length} away={SHOTS_AWAY.length} />
        <StatCard v={xgH.toFixed(2)} l="xG Al Ahly" color={C.green} />
        <StatCard v={xgA.toFixed(2)} l="xG Zamalek" color={C.blue} />
        <StatCard v="2" l="Goals" color={C.green} home={2} away={1} />
      </div>
      <div className="g2">
        <Panel title="Shot Map — Al Ahly" legend={<><Leg c={C.green} t="Goal" /><Leg c={C.amber} t="Saved" /><Leg c={C.softBlue} t="Missed" /></>}>
          <ShotMap shots={SHOTS_HOME} />
        </Panel>
        <Panel title="Shot Map — Zamalek"><ShotMap shots={SHOTS_AWAY} /></Panel>
      </div>
      <div className="g2">
        <Panel title="Cumulative xG" legend={<><Leg c={HOME} t="Al Ahly" /><Leg c={AWAY} t="Zamalek" /></>}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={xgData} margin={{ top: 10, right: 16, left: -14, bottom: 0 }}>
              <defs>
                <linearGradient id="xgH" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={HOME} stopOpacity={.3} /><stop offset="100%" stopColor={HOME} stopOpacity={0} /></linearGradient>
                <linearGradient id="xgA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={AWAY} stopOpacity={.3} /><stop offset="100%" stopColor={AWAY} stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="min" tick={TICK} axisLine={false} tickLine={false} tickFormatter={(v) => v + "'"} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip content={<CoachTooltip />} cursor={{ stroke: GRID }} />
              <Area type="stepAfter" dataKey="home" name="Al Ahly" stroke={HOME} strokeWidth={2.5} fill="url(#xgH)" />
              <Area type="stepAfter" dataKey="away" name="Zamalek" stroke={AWAY} strokeWidth={2} fill="url(#xgA)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Shot Zones" legend={<><Leg c={HOME} t="Inside box" /><Leg c={C.blue} t="Outside box" /></>}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={zones} layout="vertical" margin={{ top: 10, right: 16, left: 10, bottom: 0 }}>
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={TICK} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CoachTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="inside" name="Inside box" stackId="z" fill={HOME} radius={[4, 0, 0, 4]} maxBarSize={34} />
              <Bar dataKey="outside" name="Outside box" stackId="z" fill={C.blue} radius={[0, 4, 4, 0]} maxBarSize={34} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </>
  );
}
