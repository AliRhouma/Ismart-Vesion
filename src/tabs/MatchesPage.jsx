import React, { useState } from 'react';
import { Calendar, Plus, MoreVertical, Pencil, Download, Trash2 } from 'lucide-react';
import { C, HOME, AWAY } from '../constants/theme';

/* Match thumbnails — assigned per card so each match shows a still. */
export const MATCH_IMAGES = [
  'https://c.veocdn.com/007e327c-e175-4964-b92a-f8de6877ed11/standard/machine/ba72913b/thumbnail.jpg',
  'https://c.veocdn.com/b180726c-a8fb-4bb3-a118-d93d0a001a1d/standard/machine/f9f9b843/thumbnail.jpg',
  'https://c.veocdn.com/78449c4f-83ff-4ed6-9938-1bd9deed0f16/standard/machine/44745fd8/thumbnail.jpg',
  'https://c.veocdn.com/937b21e0-ab04-452a-b9ad-6a00b0ab35d7/standard/machine/98445757/thumbnail.jpg',
  'https://c.veocdn.com/5d1d0bf1-a598-4792-8bf3-1eceacefca6d/standard/machine/baee7a52/thumbnail.jpg',
];
/* Deterministic-but-scattered pick so a card keeps the same image across renders. */
const pickImage = (m) => MATCH_IMAGES[(m.id * 7 + 3) % MATCH_IMAGES.length];

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

export function MatchesPage({ onSelect, onNew, toast }) {
  const [matches, setMatches] = useState(MOCK_MATCHES);
  const [openMenuId, setOpenMenuId] = useState(null);
  const notify = (msg) => (toast ? toast(msg) : undefined);

  const handleDelete = (m) => {
    setMatches((list) => list.filter((x) => x.id !== m.id));
    notify(`Deleted — Al Ahly vs ${m.opponent}`);
  };
  const handleDownload = (m) => notify(`Downloading report — Al Ahly vs ${m.opponent}`);
  const handleEdit = (m) => notify(`Editing match — Al Ahly vs ${m.opponent}`);

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
        {matches.map((m) => (
          <div key={m.id} className="match-card" role="button" tabIndex={0}
            onClick={() => onSelect(m)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(m); } }}>
            <div className="mc-media">
              <img className="mc-thumb" src={pickImage(m)} alt="" loading="lazy" />
              <div className="mc-media-grad" />
            </div>
            <div className="mc-menu-wrap">
              <button className="mc-menu-btn" aria-label="Match actions" aria-haspopup="menu"
                aria-expanded={openMenuId === m.id}
                onClick={(e) => { e.stopPropagation(); setOpenMenuId((id) => (id === m.id ? null : m.id)); }}>
                <MoreVertical size={16} />
              </button>
              {openMenuId === m.id && (
                <div className="mc-menu" role="menu" onClick={(e) => e.stopPropagation()}>
                  <button className="mc-menu-item" role="menuitem"
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); handleEdit(m); }}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button className="mc-menu-item" role="menuitem"
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); handleDownload(m); }}>
                    <Download size={13} /> Download
                  </button>
                  <button className="mc-menu-item danger" role="menuitem"
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); handleDelete(m); }}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              )}
            </div>
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
          </div>
        ))}
      </div>
      {openMenuId !== null && <div className="mc-menu-backdrop" onClick={() => setOpenMenuId(null)} />}
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
