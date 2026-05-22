import { C } from '../constants/theme';

/* Styles (iSmart Coach design system) */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
.ic-app *{box-sizing:border-box;margin:0;padding:0}
.ic-app{position:relative;min-height:100vh;background:${C.dark};color:${C.white};font-family:'DM Sans',sans-serif}
.ic-app::before{content:'';position:fixed;inset:0;z-index:9999;pointer-events:none;opacity:.4;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")}
.ic-app button{cursor:pointer;font-family:inherit}
.ic-app a{text-decoration:none}

.topbar{height:48px;background:${C.dark3};border-bottom:1px solid ${C.border};display:flex;align-items:center;padding:0 1.2rem;gap:.75rem;position:sticky;top:0;z-index:200}
.logo{font-family:'Bebas Neue';font-size:1.3rem;color:${C.green};letter-spacing:.05em}
.logo span{color:#fff}
.tb-div{width:1px;height:20px;background:${C.border}}
.breadcrumb{font-family:'Syne';font-size:.72rem;font-weight:600;color:${C.muted}}
.breadcrumb b{color:#fff}.breadcrumb .g{color:${C.green}}
.tb-r{margin-left:auto;display:flex;gap:.4rem}
.btn-g{color:${C.muted};padding:.38rem .8rem;border-radius:6px;font-family:'Syne';font-weight:600;font-size:.72rem;border:1px solid ${C.border};background:none;display:flex;align-items:center;gap:.3rem}
.btn-g:hover{border-color:rgba(255,255,255,.15);color:#fff}
.btn-p{background:${C.green};color:${C.slate};padding:.38rem .8rem;border-radius:6px;font-family:'Syne';font-weight:700;font-size:.72rem;border:none;display:flex;align-items:center;gap:.3rem;box-shadow:0 0 18px rgba(0,255,135,.2);transition:all .2s}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,255,135,.3)}

.layout{display:flex}
.sidebar{width:210px;background:${C.dark3};border-right:1px solid ${C.border};display:flex;flex-direction:column;padding:.7rem 0;position:sticky;top:48px;height:calc(100vh - 48px)}
.ns{padding:.55rem .9rem .2rem;font-family:'Syne';font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${C.muted2}}
.ni{display:flex;align-items:center;gap:.6rem;padding:.5rem .9rem;color:${C.muted};font-family:'Syne';font-size:.78rem;font-weight:600;border-left:2px solid transparent;cursor:pointer;transition:all .15s}
.ni:hover{color:#fff;background:rgba(255,255,255,.03)}
.ni.a{color:${C.green};border-left-color:${C.green};background:rgba(0,255,135,.04)}
.si-foot{margin-top:auto;padding:.7rem .9rem;border-top:1px solid ${C.border}}
.av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#00FF87,#00a856);display:flex;align-items:center;justify-content:center;font-family:'Syne';font-size:.65rem;font-weight:700;color:${C.slate}}

.main{flex:1;min-width:0;padding:1.1rem;display:flex;flex-direction:column;gap:.9rem}
.mh{background:${C.panel};border:1px solid ${C.border};border-radius:10px;padding:.8rem 1.1rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
.tb{display:flex;align-items:center;gap:.55rem}
.tbdg{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue';font-size:.9rem}
.tbdg.h{background:rgba(0,255,135,.1);color:${C.green};border:1px solid rgba(0,255,135,.2)}
.tbdg.aw{background:rgba(59,130,246,.12);color:${C.softBlue};border:1px solid rgba(59,130,246,.25)}
.tn{font-family:'Syne';font-size:.85rem;font-weight:700}
.ts{font-size:.68rem;color:${C.muted}}
.mh-center{margin:0 auto;display:flex;align-items:center;gap:1rem}
.sc{display:flex;align-items:center;gap:.4rem}
.sn{font-family:'Bebas Neue';font-size:2rem;line-height:1}
.ml{font-family:'Syne';font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${C.green}}
.md{font-size:.68rem;color:${C.muted}}
.sb{padding:.15rem .5rem;border-radius:100px;font-family:'Syne';font-weight:700;font-size:.6rem;text-transform:uppercase;letter-spacing:.08em;background:rgba(0,255,135,.08);color:${C.green};border:1px solid rgba(0,255,135,.2);display:inline-flex;align-items:center;gap:.25rem}
.pu{width:5px;height:5px;border-radius:50%;background:${C.green};box-shadow:0 0 8px rgba(0,255,135,.7);animation:pu 2s infinite}
@keyframes pu{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.35)}}

.sec-tabs{display:flex;gap:.3rem;background:${C.panel};border:1px solid ${C.border};border-radius:10px;padding:.3rem;overflow-x:auto}
.sec-tab{padding:.5rem 1rem;border-radius:7px;border:none;background:none;font-family:'Syne';font-size:.72rem;font-weight:700;color:${C.muted};white-space:nowrap;transition:all .15s;display:flex;align-items:center;gap:.35rem}
.sec-tab:hover{color:#fff;background:rgba(255,255,255,.03)}
.sec-tab.on{color:${C.green};background:rgba(0,255,135,.06)}
.sec-content{display:flex;flex-direction:column;gap:.9rem}

.pnl{background:${C.panel};border:1px solid ${C.border};border-radius:10px;overflow:hidden;transition:border-color .3s,box-shadow .3s}
.pnl:hover{border-color:rgba(0,255,135,.18);box-shadow:0 12px 40px rgba(0,255,135,.05)}
.pnl-h{padding:.7rem 1rem;border-bottom:1px solid ${C.border};display:flex;align-items:center;justify-content:space-between;gap:.5rem;flex-wrap:wrap}
.pnl-t{font-family:'Syne';font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${C.muted};display:flex;align-items:center;gap:.4rem}
.pnl-t::before{content:'';width:10px;height:2px;background:${C.green}}
.pnl-b{padding:1rem}
.lgnd{display:flex;gap:.6rem;flex-wrap:wrap}
.lgnd-i{display:flex;align-items:center;gap:.25rem;font-size:.65rem;color:${C.muted}}
.lgnd-d{width:7px;height:7px;border-radius:50%}

.g2{display:grid;grid-template-columns:1fr 1fr;gap:.9rem}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:.7rem}
.stc{background:${C.card};border:1px solid ${C.border};border-radius:10px;padding:.9rem 1rem}
.stv{font-family:'Bebas Neue';font-size:1.8rem;line-height:1}
.stl{font-family:'Syne';font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${C.muted2};margin-top:.12rem}
.sts{display:flex;gap:.5rem;margin-top:.35rem}
.stt{display:flex;align-items:center;gap:.22rem;font-size:.68rem;color:${C.muted}}
.std{width:5px;height:5px;border-radius:50%}

.pitch-wrap{width:100%;max-width:560px;margin:0 auto}
.pitch-wrap svg{width:100%;height:auto;display:block}
.heat-lgnd{display:flex;align-items:center;gap:.5rem;margin-top:.5rem}
.heat-bar{height:6px;flex:1;border-radius:3px;background:linear-gradient(to right,${C.greenDim},${C.green},${C.teal},${C.amber})}
.heat-t{font-size:.62rem;color:${C.muted2}}
.tog{display:inline-flex;gap:.25rem;padding:.2rem;background:rgba(255,255,255,.03);border:1px solid ${C.border};border-radius:6px}
.tog button{padding:.3rem .6rem;border:none;border-radius:5px;font-family:'Syne';font-size:.62rem;font-weight:700;color:${C.muted};background:none}
.tog button.on{color:${C.green};background:rgba(0,255,135,.08)}

.ptable{width:100%;border-collapse:collapse}
.ptable th{font-family:'Syne';font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${C.muted2};padding:.45rem .6rem;text-align:left;border-bottom:1px solid ${C.border};white-space:nowrap}
.ptable td{font-size:.82rem;color:#e3e6ea;padding:.45rem .6rem;border-bottom:1px solid rgba(255,255,255,.03)}
.ptable tr:hover td{background:rgba(255,255,255,.02)}
.ptable .num{text-align:right;font-variant-numeric:tabular-nums}
.ptable .hi{color:${C.green}}

/* video */
.workspace{display:grid;grid-template-columns:1fr 360px;gap:.9rem}
.left-col{display:flex;flex-direction:column;gap:.9rem;min-width:0}
.video-wrap{background:${C.panel};border:1px solid ${C.border};border-radius:10px;overflow:hidden}
.video-area{aspect-ratio:16/9;background:#000;position:relative;display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none}
.video-area .pitch-wrap{max-width:none;width:100%;height:100%;position:absolute;inset:0}
.video-area .pitch-wrap svg{height:100%;object-fit:cover}
.play-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.play-btn-big{width:58px;height:58px;border-radius:50%;background:rgba(0,255,135,.15);border:2px solid rgba(0,255,135,.4);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)}
.video-badge-tl{position:absolute;top:10px;left:10px;background:rgba(0,0,0,.65);border:1px solid ${C.border};border-radius:6px;padding:.22rem .55rem;font-family:'Syne';font-size:.68rem;font-weight:700;display:flex;align-items:center;gap:.4rem}
.dot{width:6px;height:6px;border-radius:50%}
.video-time{position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.7);border:1px solid ${C.border};border-radius:6px;padding:.18rem .5rem;font-size:.75rem;font-variant-numeric:tabular-nums}
.playhead-ball{position:absolute;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 0 12px rgba(255,255,255,.8);transition:left .3s,top .3s;pointer-events:none;transform:translate(-50%,-50%)}
.video-ctrl{padding:.6rem 1rem;display:flex;align-items:center;gap:.55rem;border-top:1px solid ${C.border}}
.ctrl-btn{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:6px;border:none;background:none;color:${C.muted}}
.ctrl-btn:hover{color:#fff}
.ctrl-play{width:34px;height:34px;border-radius:50%;background:${C.green};display:flex;align-items:center;justify-content:center;border:none;box-shadow:0 0 14px rgba(0,255,135,.3);transition:transform .2s}
.ctrl-play:hover{transform:scale(1.08)}
.speed-btn{padding:.18rem .45rem;border-radius:4px;border:1px solid ${C.border};background:rgba(255,255,255,.04);color:${C.muted};font-family:'Syne';font-size:.65rem;font-weight:700}
.speed-btn.active{border-color:rgba(0,255,135,.25);color:${C.green};background:rgba(0,255,135,.06)}
.time-disp{font-size:.75rem;color:${C.muted};font-variant-numeric:tabular-nums;white-space:nowrap}
.time-disp strong{color:#fff}
.scrubber-wrap{flex:1;min-width:80px}
.scrubber-track{position:relative;height:5px;background:rgba(255,255,255,.07);border-radius:3px;cursor:pointer}
.scrubber-progress{height:100%;background:linear-gradient(to right,rgba(0,255,135,.5),${C.green});border-radius:3px;position:relative;pointer-events:none}
.scrubber-thumb{position:absolute;right:-6px;top:50%;transform:translateY(-50%);width:12px;height:12px;border-radius:50%;background:${C.green};box-shadow:0 0 8px rgba(0,255,135,.5)}
.s-marker{position:absolute;top:50%;transform:translate(-50%,-50%);width:9px;height:9px;border-radius:50%;border:1.5px solid ${C.dark};cursor:pointer;z-index:2;transition:transform .15s}
.s-marker:hover{transform:translate(-50%,-50%) scale(1.5)}
.timeline-wrap{background:${C.panel};border:1px solid ${C.border};border-radius:10px;padding:.8rem 1rem}
.tl-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:.6rem;flex-wrap:wrap;gap:.4rem}
.tl-hdr-r{display:flex;align-items:center;gap:.45rem;flex-wrap:wrap;justify-content:flex-end}
.tl-toggle{padding:.22rem .55rem;border-radius:6px;border:1px solid ${C.border};background:rgba(255,255,255,.03);font-family:'Syne';font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${C.muted};transition:all .15s}
.tl-toggle:hover{border-color:rgba(0,255,135,.25);color:${C.green};background:rgba(0,255,135,.06)}
.timeline-filter{display:flex;flex-wrap:wrap;gap:.3rem;margin-bottom:.65rem;padding-bottom:.65rem;border-bottom:1px solid ${C.border}}
.tl-filter-row{display:flex;align-items:center;flex-wrap:wrap;gap:.3rem;width:100%}
.tl-filter-lbl{width:46px;font-family:'Syne';font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${C.muted2};text-align:right;margin-right:.15rem}
.tl-chip{padding:.2rem .5rem;border-radius:100px;border:1px solid ${C.border};background:none;font-family:'Syne';font-size:.56rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:${C.muted};white-space:nowrap;transition:all .15s}
.tl-chip:hover{border-color:rgba(255,255,255,.15);color:#fff}
.tl-chip.active{border-color:rgba(0,255,135,.25);background:rgba(0,255,135,.08);color:${C.green};box-shadow:0 0 8px rgba(0,255,135,.12)}
.trow{display:flex;align-items:center;gap:.6rem;margin:.28rem 0}
.trow-lbl{font-family:'Syne';font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${C.muted2};width:60px;text-align:right}
.trow-track{flex:1;height:4px;background:rgba(255,255,255,.04);border-radius:2px;position:relative}
.trow-m{position:absolute;top:50%;transform:translate(-50%,-50%);width:7px;height:7px;border-radius:50%;border:1.5px solid ${C.dark}}
.time-axis{display:flex;justify-content:space-between;padding-left:calc(60px + .6rem);margin-top:.35rem}
.time-tick{font-size:.62rem;color:${C.muted2}}
.stats-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:.7rem}
.stat-card{background:${C.panel};border:1px solid ${C.border};border-radius:10px;padding:.9rem 1rem}
.stat-val{font-family:'Bebas Neue';font-size:1.8rem;line-height:1}
.stat-lbl{font-family:'Syne';font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${C.muted2};margin-top:.15rem}
.stat-sub{display:flex;gap:.5rem;margin-top:.4rem}
.stat-team{display:flex;align-items:center;gap:.22rem;font-size:.68rem;color:${C.muted}}

.events-panel{background:${C.panel};border:1px solid ${C.border};border-radius:10px;display:flex;flex-direction:column;overflow:hidden;align-self:start;position:sticky;top:calc(48px + 1.1rem);max-height:calc(100vh - 48px - 2.2rem)}
.ep-top{padding:.75rem .85rem;border-bottom:1px solid ${C.border}}
.ep-title-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:.6rem}
.ep-title{font-family:'Syne';font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${C.muted}}
.ev-count{background:rgba(0,255,135,.08);border:1px solid rgba(0,255,135,.15);border-radius:100px;padding:.08rem .45rem;font-family:'Syne';font-size:.62rem;color:${C.green}}
.team-tabs{display:flex;gap:.3rem;margin-bottom:.55rem}
.team-tab{flex:1;padding:.35rem .4rem;border-radius:6px;border:1px solid ${C.border};background:none;font-family:'Syne';font-size:.68rem;font-weight:700;color:${C.muted};text-align:center;transition:all .15s}
.team-tab.t-all{border-color:rgba(255,255,255,.15);color:#fff;background:rgba(255,255,255,.04)}
.team-tab.t-home{border-color:rgba(0,255,135,.3);color:${C.green};background:rgba(0,255,135,.06)}
.team-tab.t-away{border-color:rgba(59,130,246,.3);color:${C.softBlue};background:rgba(59,130,246,.08)}
.filter-bar{display:flex;flex-wrap:wrap;gap:.3rem}
.chip{padding:.2rem .55rem;border-radius:100px;border:1px solid ${C.border};background:none;font-family:'Syne';font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:${C.muted};white-space:nowrap;transition:all .15s}
.chip:hover{border-color:rgba(255,255,255,.15);color:#fff}
.chip.active{border-color:rgba(0,255,135,.25);background:rgba(0,255,135,.08);color:${C.green};box-shadow:0 0 8px rgba(0,255,135,.12)}
.events-list{flex:1;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(0,255,135,.45) rgba(255,255,255,.035)}
.events-list::-webkit-scrollbar{width:8px}
.events-list::-webkit-scrollbar-track{background:rgba(255,255,255,.025);border-left:1px solid ${C.border}}
.events-list::-webkit-scrollbar-thumb{background:linear-gradient(180deg,rgba(0,255,135,.7),rgba(0,204,106,.35));border-radius:999px;border:2px solid ${C.panel};box-shadow:0 0 12px rgba(0,255,135,.18)}
.events-list::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,${C.green},rgba(0,204,106,.55));box-shadow:0 0 16px rgba(0,255,135,.28)}
.half-sep{display:flex;align-items:center;gap:.4rem;padding:.45rem .85rem;position:sticky;top:0;background:${C.panel};z-index:5}
.half-line{flex:1;height:1px;background:${C.border}}
.half-lbl{font-family:'Syne';font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${C.muted2}}
.ev-row{display:flex;align-items:center;gap:.55rem;padding:.5rem .85rem;cursor:pointer;border-left:2px solid transparent;transition:background .1s,border-color .1s}
.ev-row:hover{background:rgba(255,255,255,.025)}
.ev-row.ev-active{background:rgba(0,255,135,.04);border-left-color:${C.green}}
.ev-time{font-size:.74rem;font-weight:500;font-variant-numeric:tabular-nums;width:30px;text-align:right}
.ev-icon{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ev-info{flex:1;min-width:0}
.ev-type{font-family:'Syne';font-size:.72rem;font-weight:700;display:flex;align-items:center;gap:.35rem;color:#fff}
.ev-player{font-size:.7rem;color:${C.muted};margin-top:.08rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ev-tag{padding:.12rem .4rem;border-radius:4px;font-family:'Syne';font-size:.56rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
.ev-tag.home{background:rgba(0,255,135,.08);border:1px solid rgba(0,255,135,.2);color:${C.green}}
.ev-tag.away{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);color:${C.softBlue}}
.ev-tag.neutral{background:rgba(96,165,250,.08);border:1px solid rgba(96,165,250,.2);color:${C.softBlue}}
.no-events{text-align:center;padding:2rem 1rem}
.no-events p{font-family:'Syne';font-size:.78rem;font-weight:700;color:${C.muted};margin-bottom:.3rem}
.no-events span{font-size:.72rem;color:${C.muted2}}
.add-ev-btn{margin:.55rem .85rem;padding:.5rem;border-radius:8px;border:1px dashed rgba(0,255,135,.2);background:rgba(0,255,135,.03);color:${C.green};font-family:'Syne';font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;justify-content:center;gap:.35rem}
.add-ev-btn:hover{background:rgba(0,255,135,.07);border-color:rgba(0,255,135,.35)}
.ep-foot{padding:.6rem .85rem;border-top:1px solid ${C.border};display:flex;gap:.4rem}
.btn-export{flex:1;padding:.45rem;border-radius:6px;border:1px solid ${C.border};background:none;font-family:'Syne';font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:${C.muted};display:flex;align-items:center;justify-content:center;gap:.3rem}
.btn-export:hover{border-color:rgba(255,255,255,.15);color:#fff}

.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center}
.modal{background:${C.card};border:1px solid ${C.border};border-radius:14px;padding:1.5rem;width:min(460px,90vw);animation:slideUp .25s cubic-bezier(.16,1,.3,1)}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.modal-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.1rem}
.modal-title{font-family:'Syne';font-size:.9rem;font-weight:700}
.modal-close{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:6px;border:1px solid ${C.border};background:none;color:${C.muted}}
.modal-close:hover{border-color:rgba(255,255,255,.15);color:#fff}
.form-group{margin-bottom:.85rem}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:.7rem}
.form-lbl{font-family:'Syne';font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${C.muted};margin-bottom:.35rem;display:block}
.form-input{width:100%;padding:.6rem .75rem;background:rgba(255,255,255,.04);border:1px solid ${C.border};border-radius:8px;color:#fff;font-family:'DM Sans';font-size:.84rem;outline:none}
.form-input:focus{border-color:${C.green};box-shadow:0 0 0 3px rgba(0,255,135,.08)}
.modal-foot{display:flex;gap:.5rem;justify-content:flex-end;margin-top:1.25rem;padding-top:.9rem;border-top:1px solid ${C.border}}
.btn-ghost{color:#fff;padding:.5rem 1rem;border-radius:6px;font-family:'Syne';font-weight:600;font-size:.78rem;border:1px solid ${C.border};background:none}
.btn-primary{background:${C.green};color:${C.slate};padding:.5rem 1.1rem;border-radius:6px;font-family:'Syne';font-weight:700;font-size:.78rem;border:none;box-shadow:0 0 18px rgba(0,255,135,.2)}

.toast{position:fixed;bottom:1.5rem;right:1.5rem;z-index:2000;display:flex;align-items:center;gap:.6rem;padding:.6rem 1rem;background:#1f1f1f;border:1px solid rgba(0,255,135,.25);border-radius:8px;font-family:'Syne';font-size:.74rem;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.4)}
.toast-dot{width:7px;height:7px;border-radius:50%;background:${C.green}}

/* Track Players tab */
.track-overlay{position:absolute;top:10px;right:10px;background:rgba(0,0,0,.7);border:1px solid rgba(0,255,135,.25);border-radius:6px;padding:.22rem .55rem;font-family:'Syne';font-size:.66rem;font-weight:700;color:${C.green};display:flex;align-items:center;gap:.35rem}
.track-overlay b{color:#fff;font-weight:700}
.track-bar{background:${C.panel};border:1px solid ${C.border};border-radius:10px;padding:.7rem .9rem;display:flex;gap:.7rem;flex-wrap:wrap;align-items:flex-start;justify-content:space-between}
.track-bar-left{display:flex;flex-direction:column;gap:.45rem;flex:1;min-width:220px}
.track-bar-right{display:flex;gap:.3rem;flex-wrap:wrap;align-items:center}
.track-empty{font-size:.72rem;color:${C.muted2};font-family:'DM Sans'}
.track-chips{display:flex;flex-wrap:wrap;gap:.3rem}
.track-chip{display:inline-flex;align-items:center;gap:.35rem;padding:.18rem .35rem .18rem .18rem;border-radius:100px;border:1px solid;background:rgba(255,255,255,.03);font-family:'Syne';font-size:.66rem;font-weight:700;transition:transform .15s}
.track-chip:hover{transform:translateY(-1px)}
.track-chip-num{width:18px;height:18px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:700}
.track-chip-x{border:none;background:none;color:inherit;display:inline-flex;align-items:center;cursor:pointer;padding:0;opacity:.65;transition:opacity .12s}
.track-chip-x:hover{opacity:1}
.track-toggle{padding:.32rem .65rem;border-radius:6px;border:1px solid ${C.border};background:rgba(255,255,255,.03);font-family:'Syne';font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${C.muted};transition:all .15s}
.track-toggle:hover{color:#fff;border-color:rgba(255,255,255,.15)}
.track-toggle.on{border-color:rgba(0,255,135,.3);color:${C.green};background:rgba(0,255,135,.08);box-shadow:0 0 8px rgba(0,255,135,.12)}
.track-toggle.danger{border-color:rgba(230,168,23,.25);color:${C.amber}}
.track-toggle.danger:hover{border-color:rgba(230,168,23,.5);background:rgba(230,168,23,.06)}
.track-toggle svg{margin-right:.18rem}
.track-divider{width:1px;align-self:stretch;background:${C.border};margin:0 .15rem}
.track-events{padding:.15rem 0;max-height:340px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(0,255,135,.45) rgba(255,255,255,.035)}
.track-events::-webkit-scrollbar{width:8px}
.track-events::-webkit-scrollbar-track{background:rgba(255,255,255,.025)}
.track-events::-webkit-scrollbar-thumb{background:linear-gradient(180deg,rgba(0,255,135,.7),rgba(0,204,106,.35));border-radius:999px;border:2px solid ${C.panel}}
.roster-row{display:flex;align-items:center;gap:.6rem;padding:.5rem .85rem;cursor:pointer;border-left:2px solid transparent;transition:background .12s,border-color .12s}
.roster-row:hover{background:rgba(255,255,255,.025)}
.roster-num{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue';font-size:1rem;flex-shrink:0;letter-spacing:.02em}
.roster-info{flex:1;min-width:0}
.roster-name{font-family:'Syne';font-size:.78rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.roster-pos{font-size:.66rem;color:${C.muted};margin-top:.08rem}
.roster-check{width:18px;height:18px;border:1.5px solid rgba(255,255,255,.18);border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.7rem;font-weight:700;transition:all .12s}

/* Player Pass Map */
.pass-map-grid{display:grid;grid-template-columns:minmax(0,1fr) 230px;grid-template-areas:"pitch picker" "stats stats";gap:1rem;align-items:start}
.pass-map-pitch{grid-area:pitch;min-width:0}
.player-picker{grid-area:picker;background:rgba(255,255,255,.02);border:1px solid ${C.border};border-radius:10px;padding:.6rem .55rem;display:flex;flex-direction:column;max-height:520px}
.player-list{display:flex;flex-direction:column;gap:.18rem;overflow-y:auto;padding-right:.15rem;scrollbar-width:thin;scrollbar-color:rgba(0,255,135,.4) rgba(255,255,255,.04)}
.player-list::-webkit-scrollbar{width:6px}
.player-list::-webkit-scrollbar-thumb{background:linear-gradient(180deg,rgba(0,255,135,.6),rgba(0,204,106,.3));border-radius:999px}
.pp-row{display:flex;align-items:center;gap:.5rem;padding:.4rem .5rem;border:none;background:none;border-left:2px solid transparent;border-radius:6px;cursor:pointer;text-align:left;color:#fff;transition:background .12s,border-color .12s}
.pp-row:hover{background:rgba(255,255,255,.03)}
.pp-num{width:26px;height:26px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;font-family:'Bebas Neue';font-size:.85rem;flex-shrink:0}
.pp-info{display:flex;flex-direction:column;gap:.05rem;min-width:0}
.pp-name{font-family:'Syne';font-size:.74rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pp-meta{font-size:.62rem;color:${C.muted}}
.pass-map-legend{display:flex;flex-wrap:wrap;gap:.7rem;align-items:center;margin-top:.55rem;padding:.4rem .55rem;background:rgba(255,255,255,.02);border:1px solid ${C.border};border-radius:8px}
.pml-i{display:inline-flex;align-items:center;gap:.35rem;font-size:.66rem;color:${C.muted};font-family:'DM Sans'}
.pml-line{width:22px;height:3px;border-radius:2px;display:inline-block}
.pml-line.pml-dashed{background:none!important;border-top:2.5px dashed #FF4D4F;height:0}
.pml-hint{margin-left:auto;color:${C.muted2};font-size:.62rem;font-style:italic}
.pass-map-stats{grid-area:stats;display:flex;flex-wrap:wrap;gap:.55rem;align-items:center;padding:.65rem .8rem;background:${C.card};border:1px solid ${C.border};border-radius:10px}
.pms-pill{display:inline-flex;align-items:center;gap:.4rem;padding:.25rem .55rem .25rem .25rem;border-radius:100px;border:1px solid;font-family:'Syne';font-size:.74rem;font-weight:700;margin-right:.2rem}
.pms-pill-num{width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:.66rem;font-weight:700}
.pms-stat{display:flex;flex-direction:column;align-items:flex-start;padding:.05rem .65rem;border-left:1px solid ${C.border}}
.pms-stat:first-of-type{border-left:none}
.pms-v{font-family:'Bebas Neue';font-size:1.2rem;line-height:1;color:#fff}
.pms-l{font-family:'Syne';font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${C.muted2};margin-top:.12rem}
@media(max-width:1000px){.pass-map-grid{grid-template-columns:1fr;grid-template-areas:"pitch" "picker" "stats"}.player-picker{max-height:240px}.pms-stat{border-left:none}}

@media(max-width:1000px){.g2,.g4{grid-template-columns:1fr}.workspace{grid-template-columns:1fr}.events-panel{position:static;max-height:none}.stats-strip{grid-template-columns:1fr 1fr}.sidebar{display:none}}

/* Matches landing page */
.bc-link{cursor:pointer;transition:color .15s}
.bc-link:hover{color:#fff}
.back-btn{width:34px;height:34px;border-radius:8px;border:1px solid ${C.border};background:rgba(255,255,255,.03);color:${C.muted};display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;flex-shrink:0}
.back-btn:hover{border-color:rgba(0,255,135,.35);color:${C.green};background:rgba(0,255,135,.06);transform:translateX(-2px)}
.matches-page{display:flex;flex-direction:column;gap:.9rem}
.matches-hdr{display:flex;align-items:center;justify-content:space-between;gap:.7rem;background:${C.panel};border:1px solid ${C.border};border-radius:10px;padding:.9rem 1.1rem;flex-wrap:wrap}
.matches-title{font-family:'Syne';font-size:1.05rem;font-weight:700;color:#fff;letter-spacing:.02em}
.matches-sub{font-family:'DM Sans';font-size:.72rem;color:${C.muted};margin-top:.15rem}
.matches-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:.8rem}
.match-card{background:${C.panel};border:1px solid ${C.border};border-radius:10px;padding:.85rem 1rem;display:flex;flex-direction:column;gap:.7rem;text-align:left;cursor:pointer;transition:transform .18s,border-color .18s,box-shadow .18s;color:inherit;font-family:'DM Sans'}
.match-card:hover{border-color:rgba(0,255,135,.28);transform:translateY(-2px);box-shadow:0 14px 32px rgba(0,255,135,.07)}
.mc-top{display:flex;align-items:center;justify-content:space-between;gap:.5rem}
.mc-comp{font-family:'Syne';font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${C.muted2}}
.mc-status{display:inline-flex;align-items:center;gap:.3rem;font-family:'Syne';font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${C.green}}
.mc-teams{display:flex;align-items:center;justify-content:space-between;gap:.5rem}
.mc-team{display:flex;align-items:center;gap:.5rem;flex:1;min-width:0}
.mc-team.rev{flex-direction:row-reverse}
.mc-tinfo{min-width:0}
.mc-tinfo.right{text-align:right}
.mc-team .tn{font-family:'Syne';font-size:.8rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mc-team .ts{font-size:.6rem;color:${C.muted2};margin-top:.05rem}
.mc-score{display:flex;align-items:center;gap:.35rem;font-family:'Bebas Neue';font-size:1.55rem;letter-spacing:.04em;line-height:1}
.mc-dash{color:${C.muted2};font-size:1.1rem}
.mc-foot{display:flex;align-items:center;gap:.35rem;font-size:.66rem;color:${C.muted};border-top:1px solid ${C.border};padding-top:.55rem}

/* Upload CTA (empty match) */
.workspace.empty-workspace{grid-template-columns:1fr}
.video-area.upload-area{cursor:default;background:radial-gradient(circle at 50% 35%,rgba(0,255,135,.06),#000 65%)}
.upload-cta{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.55rem;text-align:center;padding:1.5rem}
.upload-icon{width:64px;height:64px;border-radius:50%;background:rgba(0,255,135,.08);border:1px solid rgba(0,255,135,.25);display:flex;align-items:center;justify-content:center;color:${C.green};margin-bottom:.3rem}
.upload-title{font-family:'Syne';font-size:1.05rem;font-weight:700;color:#fff;letter-spacing:.02em}
.upload-sub{font-family:'DM Sans';font-size:.78rem;color:${C.muted};line-height:1.5}
.upload-sub b{color:#fff;font-weight:700}
.upload-btn{margin-top:.4rem;display:inline-flex;align-items:center;gap:.35rem}
.upload-hint{font-family:'DM Sans';font-size:.62rem;color:${C.muted2};margin-top:.2rem}

/* Switch view toggle (top-right of video-area) */
.view-toggle{position:absolute;top:10px;right:10px;background:rgba(0,0,0,.72);border:1px solid ${C.border};color:#fff;border-radius:6px;padding:.3rem .55rem;font-family:'Syne';font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;display:inline-flex;align-items:center;gap:.3rem;z-index:6;cursor:pointer;transition:all .15s}
.view-toggle:hover{border-color:rgba(0,255,135,.35);color:${C.green};background:rgba(0,0,0,.85)}

/* Dailymotion embed */
.dm-embed{position:absolute;inset:0;background:#000}
.dm-embed iframe{width:100%;height:100%;border:none;display:block}

/* Upload flow extras */
.url-input-row{display:flex;gap:.5rem;align-items:center;width:min(440px,82vw);margin-top:.45rem}
.url-input-row .form-input{flex:1}
.upload-cancel{margin-top:.5rem;background:none;border:none;color:${C.muted2};font-family:'Syne';font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;padding:.2rem .4rem}
.upload-cancel:hover{color:#fff}
.spin{animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.upload-progress{width:min(280px,72vw);height:4px;border-radius:2px;background:rgba(255,255,255,.06);overflow:hidden;margin-top:.65rem}
.upload-progress-fill{height:100%;width:0%;background:linear-gradient(90deg,${C.green},${C.softBlue});animation:fillUpload 5s linear forwards;border-radius:2px}
@keyframes fillUpload{to{width:100%}}

/* Analysing state — banner + page-wide indicator */
.analysing-banner{display:flex;align-items:center;gap:.7rem;background:linear-gradient(90deg,rgba(0,255,135,.07),rgba(59,130,246,.06));border:1px solid rgba(0,255,135,.3);border-radius:10px;padding:.6rem .95rem;box-shadow:0 0 24px rgba(0,255,135,.06)}
.ab-text{font-family:'Syne';font-size:.78rem;font-weight:700;color:#fff;letter-spacing:.02em;white-space:nowrap}
.ab-bar{flex:1;height:5px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;min-width:80px}
.ab-bar-fill{height:100%;width:0%;background:linear-gradient(90deg,${C.green},${C.softBlue},${C.green});background-size:200% 100%;animation:fillAnalyse 20s linear forwards,shimmerBg 1.6s linear infinite}
@keyframes fillAnalyse{to{width:100%}}
@keyframes shimmerBg{to{background-position:200% 0}}
.ab-eta{font-family:'Syne';font-size:.66rem;font-weight:700;color:${C.muted};white-space:nowrap}

.sb-analysing{background:rgba(59,130,246,.1)!important;color:${C.softBlue}!important;border-color:rgba(59,130,246,.3)!important}
.sb-analysing .pu{background:${C.softBlue}!important;box-shadow:0 0 8px rgba(59,130,246,.7)!important}

.sec-content.analysing .timeline-wrap,
.sec-content.analysing .events-panel,
.sec-content.analysing .video-wrap{position:relative;animation:analyseGlow 2.4s ease-in-out infinite}
@keyframes analyseGlow{0%,100%{box-shadow:0 0 0 1px ${C.border}}50%{box-shadow:0 0 18px rgba(0,255,135,.16),0 0 0 1px rgba(0,255,135,.35)}}

/* Skeleton placeholder shown in place of hidden data */
.analysing-skel{padding:1.6rem 1rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.1rem;min-height:200px;width:100%}
.as-head{display:flex;flex-direction:column;align-items:center;gap:.4rem;text-align:center}
.as-label{font-family:'Syne';font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#fff}
.as-sub{font-family:'DM Sans';font-size:.7rem;color:${C.muted};margin-top:.05rem}
.as-bars{width:100%;display:flex;flex-direction:column;gap:.55rem;max-width:320px}
.as-bar{height:10px;border-radius:5px;background:linear-gradient(90deg,rgba(255,255,255,.035) 0%,rgba(0,255,135,.18) 50%,rgba(255,255,255,.035) 100%);background-size:200% 100%;animation:skelShift 1.6s linear infinite}
@keyframes skelShift{0%{background-position:200% 0}100%{background-position:-100% 0}}

/* Chat playback controls */
.chat-controls{padding:.5rem .65rem;border-top:1px solid ${C.border};display:flex;align-items:center;gap:.35rem;background:rgba(255,255,255,.015)}
.chat-ctrl{display:inline-flex;align-items:center;gap:.25rem;padding:.32rem .55rem;border-radius:7px;border:1px solid ${C.border};background:rgba(255,255,255,.03);color:${C.muted};font-family:'Syne';font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;cursor:pointer;transition:all .15s;flex-shrink:0}
.chat-ctrl:hover{border-color:rgba(0,255,135,.3);color:${C.green};background:rgba(0,255,135,.06)}
.chat-ctrl.primary{width:34px;height:30px;padding:0;justify-content:center;background:${C.green};color:${C.slate};border-color:transparent;box-shadow:0 0 12px rgba(0,255,135,.25)}
.chat-ctrl.primary:hover{transform:scale(1.04);background:${C.green};color:${C.slate}}
.chat-ctrl.primary.on{background:${C.amber};box-shadow:0 0 12px rgba(230,168,23,.3)}
.chat-time{margin-left:auto;font-family:'Syne';font-size:.66rem;color:${C.muted};font-variant-numeric:tabular-nums;white-space:nowrap}
.chat-time strong{color:#fff}

/* Events panel sub-tabs (Events / Live Commentary) */
.panel-subtabs{display:flex;gap:.25rem;padding:.3rem;margin:.55rem .55rem 0;background:rgba(255,255,255,.025);border:1px solid ${C.border};border-radius:8px}
.panel-subtab{flex:1;padding:.42rem .55rem;border-radius:6px;border:none;background:none;font-family:'Syne';font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${C.muted};display:inline-flex;align-items:center;justify-content:center;gap:.35rem;cursor:pointer;transition:all .15s}
.panel-subtab:hover{color:#fff}
.panel-subtab.on{color:${C.green};background:rgba(0,255,135,.08);box-shadow:0 0 10px rgba(0,255,135,.12)}

/* Live Commentary (chat) */
.commentary{display:flex;flex-direction:column;flex:1;min-height:0}
.comm-hint{display:flex;align-items:center;gap:.35rem;padding:.5rem .85rem;border-bottom:1px solid ${C.border};font-family:'DM Sans';font-size:.66rem;color:${C.muted}}
.comm-hint svg{color:${C.green}}
.chat-stream{flex:1;overflow-y:auto;padding:.65rem .75rem;display:flex;flex-direction:column;gap:.55rem;scrollbar-width:thin;scrollbar-color:rgba(0,255,135,.45) rgba(255,255,255,.035)}
.chat-stream::-webkit-scrollbar{width:8px}
.chat-stream::-webkit-scrollbar-track{background:rgba(255,255,255,.025)}
.chat-stream::-webkit-scrollbar-thumb{background:linear-gradient(180deg,rgba(0,255,135,.7),rgba(0,204,106,.35));border-radius:999px;border:2px solid ${C.panel}}
.chat-msg{display:flex;flex-direction:column;gap:.15rem;max-width:90%}
.chat-msg.user{align-self:flex-end;align-items:flex-end}
.chat-msg.ai{align-self:flex-start;align-items:flex-start}
.chat-msg.system{align-self:center;font-family:'DM Sans';font-size:.66rem;color:${C.muted2};font-style:italic;padding:.32rem .6rem;border:1px dashed ${C.border};border-radius:8px;max-width:95%;text-align:center}
.chat-min{font-family:'Syne';font-size:.55rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${C.muted2};padding:0 .3rem}
.chat-bubble{padding:.55rem .75rem;border-radius:11px;font-family:'DM Sans';font-size:.78rem;line-height:1.45;color:#fff;word-wrap:break-word}
.chat-msg.user .chat-bubble{background:rgba(0,255,135,.08);border:1px solid rgba(0,255,135,.22);border-bottom-right-radius:3px}
.chat-msg.ai .chat-bubble{background:rgba(59,130,246,.07);border:1px solid rgba(59,130,246,.22);border-bottom-left-radius:3px;display:flex;gap:.5rem;align-items:flex-start}
.ai-icon{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,${C.softBlue},${C.green});display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${C.slate};box-shadow:0 0 10px rgba(59,130,246,.3)}
.chat-pending{display:inline-flex;align-items:center;gap:.4rem;color:${C.muted};font-style:italic;padding:.2rem 0}
.chat-pending::after{content:'';width:6px;height:6px;border-radius:50%;background:${C.green};animation:pu 1s infinite}
.detected{display:flex;flex-direction:column;gap:.2rem;flex:1;min-width:0}
.detected-head{display:flex;align-items:center;gap:.4rem}
.detected-type{font-family:'Syne';font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.detected-tag{font-family:'Syne';font-size:.52rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:.05rem .35rem;border-radius:3px}
.detected-player{font-family:'Syne';font-size:.78rem;font-weight:700;color:#fff;margin-top:.05rem}
.detected-detail{font-family:'DM Sans';font-size:.66rem;color:${C.muted};margin-top:.05rem}
.detected-actions{margin-top:.35rem;display:flex;gap:.3rem}
.detected-btn{display:inline-flex;align-items:center;gap:.25rem;padding:.22rem .5rem;border-radius:5px;border:1px solid rgba(0,255,135,.25);background:rgba(0,255,135,.06);color:${C.green};font-family:'Syne';font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;transition:all .15s}
.detected-btn:hover{border-color:${C.green};background:rgba(0,255,135,.12)}
.chat-input-row{padding:.55rem .65rem;border-top:1px solid ${C.border};display:flex;gap:.4rem;align-items:center}
.chat-input{flex:1;padding:.55rem .7rem;background:rgba(255,255,255,.04);border:1px solid ${C.border};border-radius:8px;color:#fff;font-family:'DM Sans';font-size:.78rem;outline:none;transition:border-color .15s,box-shadow .15s}
.chat-input::placeholder{color:${C.muted2}}
.chat-input:focus{border-color:${C.green};box-shadow:0 0 0 3px rgba(0,255,135,.1)}
.chat-send{width:36px;height:36px;border-radius:8px;border:none;background:${C.green};color:${C.slate};display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;box-shadow:0 0 14px rgba(0,255,135,.25);transition:transform .15s}
.chat-send:hover:not(:disabled){transform:scale(1.06)}
.chat-send:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}
`;
