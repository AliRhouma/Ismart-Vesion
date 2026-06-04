import React, { useEffect, useRef, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { Plus, ExternalLink, Info, Pencil, ChevronDown, Calendar } from 'lucide-react';
import { C, GRID, TICK } from '../constants/theme';
import { CoachTooltip } from '../components/ui/CoachTooltip';

const TEAM = 'Montreuil Football Club';

const SECTIONS = [
  { k: 'key', label: 'Key metrics' },
  { k: 'shot', label: 'Shot map' },
  { k: 'pass', label: 'Passes' },
  { k: 'poss', label: 'Possession' },
  { k: 'comp', label: 'Comparison' },
];

const FILTERS = ['Last 10 recordings', 'Only with Analytics', 'All match types', 'All formations'];

const KEY_METRICS = [
  { label: 'Possession %', value: '54', unit: '%', sub: 'Average Possession %', featured: true },
  { label: 'Goals scored', value: '1.9', unit: 'goals', sub: 'Average Goals scored' },
  { label: 'Shots', value: '5.4', unit: 'shots', sub: 'Average Shots' },
];

const POSSESSION_SERIES = [
  { d: '25 Jan', v: 63 }, { d: '14 Feb', v: 62 }, { d: '14 Feb ', v: 58 },
  { d: '21 Feb', v: 44 }, { d: '15 Mar', v: 42 }, { d: '21 Mar', v: 62 },
  { d: '28 Mar', v: 53 }, { d: '11 Apr', v: 37 }, { d: '18 Apr', v: 51 },
  { d: '16 May', v: 66 },
];

const SHOT_SUMMARY = { goals: 19, shots: 54, attempts: 73, conversion: 26 };
/* Attacking shots near the right goal; mirrored for the defending view. */
const SHOTS = [
  { x: 612, y: 150, g: true }, { x: 560, y: 175, g: true }, { x: 540, y: 205, g: false },
  { x: 602, y: 215, g: true }, { x: 575, y: 235, g: true }, { x: 624, y: 250, g: false },
  { x: 545, y: 258, g: true }, { x: 592, y: 272, g: true }, { x: 560, y: 288, g: false },
  { x: 604, y: 300, g: true }, { x: 528, y: 300, g: true }, { x: 576, y: 316, g: true },
  { x: 560, y: 342, g: false }, { x: 612, y: 330, g: true }, { x: 505, y: 232, g: true },
  { x: 520, y: 332, g: true }, { x: 642, y: 198, g: false }, { x: 300, y: 300, g: true },
];

const PASS_THIRDS = { own: { def: 8, mid: 80, att: 12 }, opp: { def: 15, mid: 70, att: 15 } };
const POSS_THIRDS = { own: { def: 42, mid: 38, att: 20 }, opp: { def: 33, mid: 41, att: 26 } };

const COMPARE_METRICS = [
  { metric: 'Goals scored', value: '2.0', norm: 50 },
  { metric: 'Shots', value: '5.4', norm: 54 },
  { metric: 'Conversion rate', value: '26%', norm: 26 },
  { metric: 'Win ratio', value: '75%', norm: 75 },
  { metric: 'Passes completed', value: '82%', norm: 82 },
  { metric: 'Possession %', value: '54%', norm: 54 },
];

const Seg = ({ options, value, onChange }) => (
  <div className="am-seg">
    {options.map((o) => (
      <button key={o.k} className={'am-seg-btn' + (value === o.k ? ' on' : '')} onClick={() => onChange(o.k)}>{o.label}</button>
    ))}
  </div>
);

function ThirdsPitch({ values }) {
  const thirds = [
    { key: 'def', label: 'Defensive', cx: 133, v: values.def },
    { key: 'mid', label: 'Middle', cx: 340, v: values.mid },
    { key: 'att', label: 'Attacking', cx: 547, v: values.att },
  ];
  const radius = (v) => Math.min(90, Math.sqrt(v) * 9.6);
  const line = C.muted2;
  return (
    <div className="am-thirds">
      <svg viewBox="0 0 680 440">
        <rect x="30" y="20" width="620" height="400" rx="8" fill="none" stroke={line} strokeOpacity=".4" strokeWidth="1.5" />
        <rect x="30" y="120" width="95" height="200" fill="none" stroke={line} strokeOpacity=".4" strokeWidth="1.5" />
        <rect x="555" y="120" width="95" height="200" fill="none" stroke={line} strokeOpacity=".4" strokeWidth="1.5" />
        <line x1="236" y1="20" x2="236" y2="420" stroke={line} strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="6 9" />
        <line x1="443" y1="20" x2="443" y2="420" stroke={line} strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="6 9" />
        {thirds.map((t) => (
          <g key={t.key}>
            <circle cx={t.cx} cy={220} r={radius(t.v)} fill={C.green} fillOpacity={0.12} stroke={C.green} strokeOpacity={0.32} />
            <text x={t.cx} y={232} textAnchor="middle" fontFamily="Bebas Neue" fontSize="36" fill={C.green}>
              {t.v}<tspan fontSize="17" dy="-3">%</tspan>
            </text>
          </g>
        ))}
      </svg>
      <div className="am-thirds-lbls">{thirds.map((t) => <span key={t.key}>{t.label}</span>)}</div>
    </div>
  );
}

/* Two-line axis tick: "valueA · -" over the metric name (matches the compare layout). */
const radarTick = ({ x, y, textAnchor, payload }) => {
  const m = COMPARE_METRICS.find((c) => c.metric === payload.value);
  return (
    <g>
      <text x={x} y={y - 5} textAnchor={textAnchor} fontFamily="Syne" fontWeight="700" fontSize="11" fill={C.green}>
        {m ? m.value : '-'}<tspan fill={C.muted2}> · -</tspan>
      </text>
      <text x={x} y={y + 9} textAnchor={textAnchor} fontFamily="DM Sans" fontSize="10" fill={C.muted}>{payload.value}</text>
    </g>
  );
};

export function AnalyticsPage({ toast }) {
  const [mainTab, setMainTab] = useState('team');
  const [activeSection, setActiveSection] = useState('key');
  const [shotSide, setShotSide] = useState('attacking');
  const [passSide, setPassSide] = useState('own');
  const [possSide, setPossSide] = useState('own');
  const secRefs = useRef({});
  const notify = (m) => (toast ? toast(m) : undefined);

  useEffect(() => {
    if (mainTab !== 'team') return;
    const onScroll = () => {
      const offset = 168;
      let current = SECTIONS[0].k;
      for (const s of SECTIONS) {
        const el = secRefs.current[s.k];
        if (el && el.getBoundingClientRect().top - offset <= 0) current = s.k;
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mainTab]);

  const goSection = (k) => {
    setActiveSection(k);
    secRefs.current[k]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const passVals = PASS_THIRDS[passSide];
  const possVals = POSS_THIRDS[possSide];
  const defending = shotSide === 'defending';
  const shotColor = defending ? C.amber : C.green;

  return (
    <div className="analytics-page">
      <header className="am-hero">
        <div>
          <div className="am-eyebrow">Team</div>
          <h1 className="am-title">{TEAM}</h1>
        </div>
        <div className="am-hero-actions">
          <button className="btn-g" onClick={() => notify('Add a coach note')}><Plus size={13} /> Add Coach Note</button>
          <button className="btn-g" onClick={() => notify('Opening team management')}><ExternalLink size={13} /> Manage team</button>
        </div>
      </header>

      <div className="am-sticky">
        <div className="am-maintabs">
          <button className={'am-maintab' + (mainTab === 'team' ? ' on' : '')} onClick={() => setMainTab('team')}>Team stats</button>
          <button className={'am-maintab' + (mainTab === 'player' ? ' on' : '')} onClick={() => setMainTab('player')}>Player stats</button>
        </div>
        {mainTab === 'team' && (
          <div className="am-subtabs">
            {SECTIONS.map((s) => (
              <button key={s.k} className={'am-subtab' + (activeSection === s.k ? ' on' : '')} onClick={() => goSection(s.k)}>{s.label}</button>
            ))}
          </div>
        )}
      </div>

      {mainTab === 'player' ? (
        <div className="am-card am-empty">
          <div className="am-card-title">Player stats</div>
          <div className="am-card-sub">Individual player analytics for {TEAM} — coming soon.</div>
        </div>
      ) : (
        <>
          <div className="am-filters">
            {FILTERS.map((f) => (
              <button key={f} className="am-filter" onClick={() => notify(`Filter: ${f}`)}>{f}<ChevronDown size={13} /></button>
            ))}
          </div>

          {/* Key metrics */}
          <section className="am-section" ref={(el) => (secRefs.current.key = el)}>
            <div className="am-sec-head">
              <div className="am-sec-title">Key metrics <Info size={13} className="am-info" /></div>
              <button className="btn-g" onClick={() => notify('Edit key metrics')}><Pencil size={12} /> Edit key metrics</button>
            </div>
            <div className="am-metrics">
              {KEY_METRICS.map((m) => (
                <div key={m.label} className={'am-metric' + (m.featured ? ' featured' : '')}>
                  <div className="am-metric-label">{m.label}</div>
                  <div className="am-metric-val">{m.value}<span className="am-metric-unit">{m.unit}</span></div>
                  <div className="am-metric-sub">{m.sub}</div>
                </div>
              ))}
            </div>
            <div className="am-card">
              <div className="am-card-title">Possession %</div>
              <div className="am-card-sub">{TEAM} Possession % for the last 10 recordings</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={POSSESSION_SERIES} margin={{ top: 22, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="d" tick={TICK} axisLine={false} tickLine={false} interval={0} />
                  <YAxis domain={[0, 70]} ticks={[0, 10, 20, 30, 40, 50, 60, 70]} tickFormatter={(v) => v + '%'} tick={TICK} axisLine={false} tickLine={false} />
                  <Tooltip content={<CoachTooltip unit="%" />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="v" name="Possession" fill={C.green} fillOpacity={0.24} stroke={C.green} strokeOpacity={0.5} radius={[4, 4, 0, 0]} maxBarSize={56} background={{ fill: 'rgba(255,255,255,0.02)' }}>
                    <LabelList dataKey="v" position="top" formatter={(v) => `${v}%`} style={{ fill: C.green, fontFamily: 'Syne', fontWeight: 700, fontSize: 11 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Shot map */}
          <section className="am-section" ref={(el) => (secRefs.current.shot = el)}>
            <div className="am-sec-head">
              <div className="am-sec-title">Shot map</div>
              <Seg options={[{ k: 'attacking', label: 'Attacking' }, { k: 'defending', label: 'Defending' }]} value={shotSide} onChange={setShotSide} />
            </div>
            <div className="am-split">
              <div className="am-side">
                <div className="am-side-desc">{TEAM} shot map for the last 10 recordings</div>
                <div className="am-stat-row featured">
                  <span className="am-stat-k"><span className="dot-fill" />Goals</span><span className="am-stat-v">{SHOT_SUMMARY.goals}</span>
                </div>
                <div className="am-stat-row">
                  <span className="am-stat-k"><span className="dot-hollow" />Shots</span><span className="am-stat-v">{SHOT_SUMMARY.shots}</span>
                </div>
                <div className="am-stat-row">
                  <span className="am-stat-k">Total attempts</span><span className="am-stat-v">{SHOT_SUMMARY.attempts}</span>
                </div>
                <div className="am-divider" />
                <div className="am-stat-row">
                  <span className="am-stat-k">Conversion rate</span><span className="am-pill-pct">{SHOT_SUMMARY.conversion}%</span>
                </div>
              </div>
              <div className="am-pitch-panel">
                <svg viewBox="0 0 680 440">
                  <rect x="30" y="20" width="620" height="400" rx="8" fill="none" stroke={C.muted2} strokeOpacity=".4" strokeWidth="1.5" />
                  <line x1="340" y1="20" x2="340" y2="420" stroke={C.muted2} strokeOpacity=".25" strokeWidth="1.5" />
                  <circle cx="340" cy="220" r="56" fill="none" stroke={C.muted2} strokeOpacity=".3" strokeWidth="1.5" />
                  <rect x="30" y="120" width="95" height="200" fill="none" stroke={C.muted2} strokeOpacity=".4" strokeWidth="1.5" />
                  <rect x="555" y="120" width="95" height="200" fill="none" stroke={C.muted2} strokeOpacity=".4" strokeWidth="1.5" />
                  {SHOTS.map((s, i) => {
                    const cx = defending ? 680 - s.x : s.x;
                    return s.g
                      ? <circle key={i} cx={cx} cy={s.y} r={9} fill={shotColor} />
                      : <circle key={i} cx={cx} cy={s.y} r={8} fill="none" stroke={shotColor} strokeWidth={2.4} />;
                  })}
                </svg>
              </div>
            </div>
          </section>

          {/* Passes */}
          <section className="am-section" ref={(el) => (secRefs.current.pass = el)}>
            <div className="am-sec-head">
              <div className="am-sec-title">Pass location</div>
              <Seg options={[{ k: 'own', label: 'Own team' }, { k: 'opp', label: 'Opponent' }]} value={passSide} onChange={setPassSide} />
            </div>
            <div className="am-split">
              <div className="am-side">
                <div className="am-side-desc">{TEAM} pass location by thirds for the last 10 recordings</div>
                <div className="am-stat-row"><span className="am-stat-k">Defensive</span><span className="am-pct-num">{passVals.def}%</span></div>
                <div className="am-stat-row"><span className="am-stat-k">Middle</span><span className="am-pct-num">{passVals.mid}%</span></div>
                <div className="am-stat-row"><span className="am-stat-k">Attacking</span><span className="am-pct-num">{passVals.att}%</span></div>
              </div>
              <div className="am-pitch-panel"><ThirdsPitch values={passVals} /></div>
            </div>
          </section>

          {/* Possession */}
          <section className="am-section" ref={(el) => (secRefs.current.poss = el)}>
            <div className="am-sec-head">
              <div className="am-sec-title">Possession location</div>
              <Seg options={[{ k: 'own', label: 'Own team' }, { k: 'opp', label: 'Opponent' }]} value={possSide} onChange={setPossSide} />
            </div>
            <div className="am-split">
              <div className="am-side">
                <div className="am-side-desc">{TEAM} possession location by thirds for the last 10 recordings</div>
                <div className="am-stat-row"><span className="am-stat-k">Defensive</span><span className="am-pct-num">{possVals.def}%</span></div>
                <div className="am-stat-row"><span className="am-stat-k">Middle</span><span className="am-pct-num">{possVals.mid}%</span></div>
                <div className="am-stat-row"><span className="am-stat-k">Attacking</span><span className="am-pct-num">{possVals.att}%</span></div>
              </div>
              <div className="am-pitch-panel"><ThirdsPitch values={possVals} /></div>
            </div>
          </section>

          {/* Comparison */}
          <section className="am-section" ref={(el) => (secRefs.current.comp = el)}>
            <div className="am-sec-head">
              <div className="am-sec-title">Comparison radial <Info size={13} className="am-info" /></div>
              <button className="btn-g" onClick={() => notify('Edit comparison metrics')}><Pencil size={12} /> Edit metrics</button>
            </div>
            <div className="am-split">
              <div className="am-cmp">
                <div className="am-card-title">Select to compare</div>
                <div className="am-card-sub">Compare teams or periods to assess how your team is performing and progressing over time</div>
                <div className="am-cmp-block">
                  <div className="am-cmp-team"><span className="am-cmp-dot" style={{ background: C.green }} /> {TEAM}</div>
                  <button className="am-date"><Calendar size={12} /> 01/02/26 - 17/10/26</button>
                  <div className="am-cmp-results-lbl">Results</div>
                  <div className="am-results">
                    <span className="am-res w">W</span><span className="am-res w">W</span>
                    <span className="am-res d">D</span><span className="am-res w">W</span>
                    <span className="am-res more">+4</span>
                  </div>
                </div>
                <div className="am-cmp-block">
                  <button className="am-select-dd" onClick={() => notify('Select a team or period to compare')}>
                    <span className="am-cmp-dot" style={{ background: C.muted2 }} /> None <ChevronDown size={13} />
                  </button>
                  <button className="am-date"><Calendar size={12} /> 06/04/26 - 05/05/26</button>
                </div>
                <button className="am-cmp-btn" onClick={() => notify('Select to compare')}>Select to compare</button>
              </div>
              <div className="am-pitch-panel">
                <ResponsiveContainer width="100%" height={360}>
                  <RadarChart data={COMPARE_METRICS} outerRadius="66%">
                    <PolarGrid stroke={GRID} />
                    <PolarAngleAxis dataKey="metric" tick={radarTick} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name={TEAM} dataKey="norm" stroke={C.green} fill={C.green} fillOpacity={0.18} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
