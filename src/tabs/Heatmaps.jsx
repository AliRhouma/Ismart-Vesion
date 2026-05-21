import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, Cell, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip } from 'recharts';
import { C, GRID, TICK } from '../constants/theme';
import { CoachTooltip } from '../components/ui/CoachTooltip';
import { Panel } from '../components/ui/Panel';
import { HeatPitch, genHeat } from '../components/pitch/HeatPitch';

export function Heatmaps() {
  const [hView, setHView] = useState("full"), [aView, setAView] = useState("full");
  const baseH = useMemo(() => [...genHeat(400, 200, 180, 60), ...genHeat(500, 220, 120, 50), ...genHeat(300, 180, 100, 30), ...genHeat(550, 210, 80, 25)], []);
  const baseA = useMemo(() => [...genHeat(280, 220, 180, 55), ...genHeat(180, 240, 120, 45), ...genHeat(350, 260, 100, 25), ...genHeat(130, 220, 80, 20)], []);
  const slice = (b, v) => v === "1h" ? b.slice(0, Math.floor(b.length * .55)) : v === "2h" ? b.slice(Math.floor(b.length * .45)) : b;
  const Toggle = ({ v, set }) => (
    <div className="tog">{["full", "1h", "2h"].map((k) => (
      <button key={k} className={v === k ? "on" : ""} onClick={() => set(k)}>{k === "full" ? "Full" : k === "1h" ? "1st Half" : "2nd Half"}</button>
    ))}</div>
  );
  const ramp = [["Low", C.greenDim], ["", C.green], ["", C.teal], ["High", C.amber]];
  return (
    <>
      <div className="g2">
        <Panel title="Team Heatmap — Al Ahly" legend={<Toggle v={hView} set={setHView} />}>
          <HeatPitch points={slice(baseH, hView)} />
          <div className="heat-lgnd"><span className="heat-t">Low</span><div className="heat-bar" /><span className="heat-t">High</span></div>
        </Panel>
        <Panel title="Team Heatmap — Zamalek" legend={<Toggle v={aView} set={setAView} />}>
          <HeatPitch points={slice(baseA, aView)} />
          <div className="heat-lgnd"><span className="heat-t">Low</span><div className="heat-bar" /><span className="heat-t">High</span></div>
        </Panel>
      </div>
      <Panel title="Defensive Actions by Zone">
        <ResponsiveContainer width="100%" height={220}>
          <ScatterChart margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
            <CartesianGrid stroke={GRID} />
            <XAxis type="category" dataKey="x" name="Channel" tick={TICK} axisLine={false} tickLine={false}
              allowDuplicatedCategory={false} />
            <YAxis type="category" dataKey="y" name="Third" tick={TICK} axisLine={false} tickLine={false} width={80} />
            <ZAxis type="number" dataKey="v" range={[60, 600]} />
            <Tooltip content={<CoachTooltip />} cursor={{ strokeDasharray: "3 3", stroke: GRID }} />
            <Scatter data={["Def Third", "Mid Third", "Att Third"].flatMap((third) =>
              ["Left", "C-Left", "Center", "C-Right", "Right"].map((ch) => ({ x: ch, y: third, v: Math.floor(Math.random() * 15) + 3 })))}>
              {Array.from({ length: 15 }).map((_, i) => <Cell key={i} fill={i % 3 === 0 ? C.green : i % 3 === 1 ? C.teal : C.greenDim} />)}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </Panel>
    </>
  );
}
