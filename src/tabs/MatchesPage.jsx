import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { C, HOME, AWAY } from '../constants/theme';

/* Mock matches — every card opens the same Ahly vs Zamalek analysis;
   only opponent name + final score vary per card. */
export const MOCK_MATCHES = [
  { id: 1, opponent: 'Zamalek SC',  opponentCode: 'ZM', date: 'May 10, 2026', competition: 'Premier League', home: true,  scoreH: 2, scoreA: 1, status: 'Analysed', hasVideo: true },
  { id: 2, opponent: 'Pyramids FC', opponentCode: 'PY', date: 'May 4, 2026',  competition: 'Premier League', home: true,  scoreH: 3, scoreA: 0, status: 'Analysed', hasVideo: true },
  { id: 3, opponent: 'Ismaily SC',  opponentCode: 'IS', date: 'Apr 27, 2026', competition: 'Egypt Cup',      home: false, scoreH: 1, scoreA: 1, status: 'Analysed', hasVideo: true },
  { id: 4, opponent: 'Al Masry',    opponentCode: 'AM', date: 'Apr 20, 2026', competition: 'Premier League', home: true,  scoreH: 2, scoreA: 2, status: 'Analysed', hasVideo: true },
  { id: 5, opponent: 'Future FC',   opponentCode: 'FU', date: 'Apr 13, 2026', competition: 'Premier League', home: false, scoreH: 0, scoreA: 1, status: 'Analysed', hasVideo: true },
  { id: 6, opponent: 'ENPPI',       opponentCode: 'EN', date: 'Apr 6, 2026',  competition: 'Premier League', home: true,  scoreH: 4, scoreA: 1, status: 'Analysed', hasVideo: true },
];

export function MatchesPage({ onSelect, onNew }) {
  return (
    <div className="matches-page">
      <div className="matches-hdr">
        <div>
          <div className="matches-title">Matches</div>
          <div className="matches-sub">Select a match to open its analysis</div>
        </div>
        <button className="btn-p" onClick={onNew}><Plus size={14} /> New Match</button>
      </div>
      <div className="matches-grid">
        {MOCK_MATCHES.map((m) => (
          <button key={m.id} className="match-card" onClick={() => onSelect(m)}>
            <div className="mc-top">
              <span className="mc-comp">{m.competition}</span>
              <span className="mc-status"><span className="pu" />{m.status}</span>
            </div>
            <div className="mc-teams">
              <div className="mc-team">
                <div className="tbdg h">AH</div>
                <div className="mc-tinfo">
                  <div className="tn">Al Ahly SC</div>
                  <div className="ts">{m.home ? 'Home' : 'Away'}</div>
                </div>
              </div>
              <div className="mc-score">
                <span style={{ color: m.home ? HOME : C.muted }}>{m.scoreH}</span>
                <span className="mc-dash">—</span>
                <span style={{ color: m.home ? C.muted : AWAY }}>{m.scoreA}</span>
              </div>
              <div className="mc-team rev">
                <div className="mc-tinfo right">
                  <div className="tn">{m.opponent}</div>
                  <div className="ts">{m.home ? 'Away' : 'Home'}</div>
                </div>
                <div className="tbdg aw">{m.opponentCode}</div>
              </div>
            </div>
            <div className="mc-foot">
              <Calendar size={11} /> {m.date}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function NewMatchModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    opponent: '', opponentCode: '', date: '',
    competition: 'Premier League', venue: 'home',
  });
  const submit = () => {
    if (!form.opponent.trim()) return;
    const code = (form.opponentCode || form.opponent.replace(/[^A-Za-z]/g, '').slice(0, 2)).toUpperCase();
    const dateLabel = form.date
      ? new Date(form.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    onCreate({
      id: Date.now(),
      opponent: form.opponent.trim(),
      opponentCode: code,
      date: dateLabel,
      competition: form.competition.trim() || 'Friendly',
      home: form.venue === 'home',
      scoreH: null, scoreA: null,
      status: 'Pending',
      hasVideo: false,
    });
  };
  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-hdr">
          <div className="modal-title">New Match</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-lbl">Opponent</label>
            <input className="form-input" value={form.opponent}
              onChange={(e) => setForm({ ...form, opponent: e.target.value })}
              placeholder="e.g. Pyramids FC" />
          </div>
          <div className="form-group">
            <label className="form-lbl">Code</label>
            <input className="form-input" value={form.opponentCode}
              onChange={(e) => setForm({ ...form, opponentCode: e.target.value })}
              placeholder="PY" maxLength={3} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-lbl">Date</label>
            <input className="form-input" type="date" value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-lbl">Venue</label>
            <select className="form-input" value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}>
              <option value="home">Home</option>
              <option value="away">Away</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-lbl">Competition</label>
          <input className="form-input" value={form.competition}
            onChange={(e) => setForm({ ...form, competition: e.target.value })}
            placeholder="Premier League" />
        </div>
        <div className="modal-foot">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit} disabled={!form.opponent.trim()}
            style={!form.opponent.trim() ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>
            Create Match
          </button>
        </div>
      </div>
    </div>
  );
}
