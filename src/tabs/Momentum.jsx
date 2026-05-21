import React from 'react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { C, HOME, AWAY, GRID, TICK } from '../constants/theme';
import { PERIODS } from '../data/mockData';
import { CoachTooltip } from '../components/ui/CoachTooltip';
import { Panel, Leg } from '../components/ui/Panel';

export function Momentum() {
  const mins = Array.from({ length: 19 }, (_, i) => i * 5);
  const data = mins.map((m, i) => ({
    min: m + "'",
    home: +(([7, 11].includes(i) ? [.18, .21][[7, 11].indexOf(i)] : Math.random() * .1 + .03)).toFixed(3),
    away: +((i === 12 ? .17 : Math.random() * .09 + .02)).toFixed(3),
  }));
  const poss = PERIODS.map((p, i) => ({ name: p, home: [58, 55, 62, 53, 59, 50][i], away: [42, 45, 38, 47, 41, 50][i] }));
  const ppda = PERIODS.map((p, i) => ({ name: p, home: [8.2, 7.5, 9.1, 6.8, 8.0, 10.2][i], away: [11.5, 10.8, 12.1, 9.5, 11.0, 13.2][i] }));
  return (
    <>
      <Panel title="Match Momentum (xT)" legend={<><Leg c={HOME} t="Al Ahly" /><Leg c={AWAY} t="Zamalek" /></>}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 16, left: -14, bottom: 0 }}>
            <defs>
              <linearGradient id="mH" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={HOME} stopOpacity={.4} /><stop offset="100%" stopColor={HOME} stopOpacity={.04} /></linearGradient>
              <linearGradient id="mA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={AWAY} stopOpacity={.3} /><stop offset="100%" stopColor={AWAY} stopOpacity={.04} /></linearGradient>
            </defs>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="min" tick={TICK} axisLine={false} tickLine={false} interval={1} />
            <YAxis tick={TICK} axisLine={false} tickLine={false} />
            <Tooltip content={<CoachTooltip />} cursor={{ stroke: GRID }} />
            <ReferenceLine x="35'" stroke={HOME} strokeDasharray="3 3" label={{ value: "š½", position: "top" }} />
            <ReferenceLine x="55'" stroke={HOME} strokeDasharray="3 3" />
            <ReferenceLine x="60'" stroke={AWAY} strokeDasharray="3 3" />
            <Area type="monotone" dataKey="home" name="Al Ahly" stroke={HOME} strokeWidth={2.5} fill="url(#mH)" />
            <Area type="monotone" dataKey="away" name="Zamalek" stroke={AWAY} strokeWidth={2} fill="url(#mA)" />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>
      <div className="g2">
        <Panel title="Possession by Period" legend={<><Leg c={HOME} t="Al Ahly" /><Leg c={AWAY} t="Zamalek" /></>}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={poss} margin={{ top: 10, right: 16, left: -14, bottom: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip content={<CoachTooltip unit="%" />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="home" name="Al Ahly" fill={HOME} radius={[4, 4, 0, 0]} maxBarSize={26} />
              <Bar dataKey="away" name="Zamalek" fill={AWAY} radius={[4, 4, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Pressing Intensity (PPDA)" legend={<><Leg c={HOME} t="Al Ahly" /><Leg c={AWAY} t="Zamalek" /></>}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={ppda} margin={{ top: 10, right: 16, left: -14, bottom: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip content={<CoachTooltip />} cursor={{ stroke: GRID }} />
              <Line type="monotone" dataKey="home" name="Al Ahly" stroke={HOME} strokeWidth={2.5} dot={{ r: 3, fill: HOME }} />
              <Line type="monotone" dataKey="away" name="Zamalek" stroke={AWAY} strokeWidth={2} dot={{ r: 3, fill: AWAY }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </>
  );
}
