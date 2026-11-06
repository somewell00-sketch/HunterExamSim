/* ---------- Statistics: one compact row a year, and a page that reads it ----------
   WORLD.yearly keeps a few numbers per year (under 100 KB for 500 years); WORLD.tally counts things that never shrink.
   Everything else on the page is read live from the register, the schools, the cases and the relics. */
const ST_CAUSE = {f: 'In the field', h: 'Blacklist', c: 'Crisis', x: 'Dark Continent', u: 'Duel', e: 'As examiner', o: 'Old age', r: 'Relic'};
function deathCause(h, ed){
  const t = ((h.log || []).filter(x => x.ed === ed && x.k === 'death').pop() || {}).text || '';
  if(h.lostIn || /Dark Continent/.test(t)) return 'x';
  if(h.killedBy || /Blacklist|was last seen there/.test(t)) return 'h';
  if(/ during the (Grey Fever|Border War|Great Stampede|Year of Storms|Gold Rush|Long Famine|Syndicate Wars)/.test(t)) return 'c';
  if(/duel/.test(t)) return 'u';
  if(/as an examiner/.test(t)) return 'e';
  if(/jar|sleep, the same night/.test(t)) return 'r';
  if(/in retirement|peacefully|own bed|between two pages|outlived|answering letters|died at \d+/.test(t) || h.retire) return 'o';
  return 'f';
}
function statsYear(prev, ed, items){
  const Y = WORLD.yearly = WORLD.yearly || [], T = WORLD.tally = WORLD.tally || {exp: 0, expBack: 0, expLost: 0, back: 0, crisis: {}, disc: 0};
  if(Y.length && Y[Y.length - 1].ed === ed) return;
  const act = HUNTERS.filter(h => hActive(h) && !h.legacy), d = {};
  HUNTERS.filter(h => h.status === 'Deceased' && h.diedEd === ed && !h.legacy).forEach(h => { const k = deathCause(h, ed); d[k] = (d[k] || 0) + 1; });
  const s = [0, 1, 2, 3].map(n => act.filter(h => hStars(h) === n).length);
  Y.push({ed, a: act.length, s, d, ap: (prev.config || {}).applicants || 0, li: (prev.candidates || []).filter(c => c.status === 'Approved').length,
    age: act.length ? Math.round(act.reduce((x, h) => x + hunterAge(h), 0) / act.length) : 0});
  if(Y.length > 600) WORLD.yearly = Y.slice(-600);
  (items || []).forEach(it => {
    if(it.kind === 'exped'){ if(/^The Association sends|^A rescue expedition sets out/.test(it.text)) T.exp++; else if(/expedition returns/.test(it.text)) T.expBack++; else if(/declared lost/.test(it.text)) T.expLost++; }
    if(it.kind === 'missing' && /back|turns up|found alive|walks into|picks up|had been living/.test(it.text)) T.back++;
  });
  const C = WORLD.crisis; if(C && C.start === ed) T.crisis[C.k] = (T.crisis[C.k] || 0) + 1;
  if(WORLD.lastDisc === ed) T.disc++;
}
// small charts: one series each, so no legend; every mark carries a tooltip
function stLine(rows, key, label){
  const pts = rows.map(r => [r.ed, typeof key === 'function' ? key(r) : r[key]]).filter(p => p[1] != null);
  if(pts.length < 2) return '';
  const W = 640, H = 150, P = {l: 36, r: 10, t: 10, b: 22}, x0 = pts[0][0], x1 = pts[pts.length - 1][0], ymax = Math.max(...pts.map(p => p[1])) * 1.1 || 1;
  const X = e => P.l + (e - x0) / Math.max(1, x1 - x0) * (W - P.l - P.r), Yv = v => H - P.b - v / ymax * (H - P.t - P.b);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${X(p[0]).toFixed(1)},${Yv(p[1]).toFixed(1)}`).join('');
  const ticks = [0, 0.5, 1].map(f => Math.round(ymax / 1.1 * f));
  const step = Math.max(1, Math.ceil(pts.length / 60)), dots = pts.filter((p, i) => i % step === 0 || i === pts.length - 1);
  return `<figure class="st-fig"><figcaption>${esc(label)}</figcaption><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">
    ${ticks.map(t => `<line x1="${P.l}" x2="${W - P.r}" y1="${Yv(t)}" y2="${Yv(t)}" class="st-grid"/><text x="${P.l - 6}" y="${Yv(t) + 4}" class="st-ax" text-anchor="end">${t}</text>`).join('')}
    <text x="${P.l}" y="${H - 6}" class="st-ax">${ordinal(x0)}</text><text x="${W - P.r}" y="${H - 6}" class="st-ax" text-anchor="end">${ordinal(x1)}</text>
    <path d="${path}" class="st-line"/>${dots.map(p => `<circle cx="${X(p[0])}" cy="${Yv(p[1])}" r="6" class="st-hit"><title>${ordinal(p[0])}: ${p[1]}</title></circle>`).join('')}</svg></figure>`;
}
function stBars(title, list, fmtV){
  const L = list.filter(x => x[1] > 0); if(!L.length) return '';
  const max = Math.max(...L.map(x => x[1])), tot = L.reduce((a, x) => a + x[1], 0);
  return `<div class="st-bars"><div class="st-h">${esc(title)}</div>${L.map(([k, v]) => `<div class="st-b" title="${esc(k)}: ${v} (${Math.round(v / tot * 100)}%)"><span>${esc(k)}</span><i><b style="width:${(v / max * 100).toFixed(1)}%"></b></i><em>${fmtV ? fmtV(v, tot) : v}</em></div>`).join('')}</div>`;
}
const stList = (title, rows, all) => rows.length ? `<div class="mk"><div class="section-h">${esc(title)}${all ? `<a class="st-all" data-stall="${all}">See all ›</a>` : ''}</div>${rows.map(([a, b]) => `<div class="mk-r"><i>·</i><span><b>${a}</b><small>${b}</small></span></div>`).join('')}</div>` : '';
function statsHtml(){
  const Y = WORLD.yearly || [], T = WORLD.tally || {}, H = HUNTERS.filter(h => !h.legacy), act = H.filter(hActive);
  const hl = h => h ? `<a data-hunter="${esc(h.license)}">${esc(h.name)}</a>` : '—', pct = (v, t) => `${v} · ${Math.round(v / t * 100)}%`;
  // the same range as the editions chart above; long ranges are averaged by decade so the line keeps its shape
  const yr = typeof hiRange !== 'undefined' && hiRange ? Y.slice(-hiRange) : Y, recent = yr.length > 200 ? Object.values(yr.reduce((D, r) => { const d = Math.floor(r.ed / 10) * 10; (D[d] = D[d] || []).push(r); return D; }, {})).map(L => ({ed: L[0].ed, a: Math.round(L.reduce((s, r) => s + r.a, 0) / L.length), s: [0, 1, 2, 3].map(j => Math.round(L.reduce((s, r) => s + ((r.s || [])[j] || 0), 0) / L.length)), d: L.reduce((D2, r) => { Object.entries(r.d || {}).forEach(([k, v]) => D2[k] = (D2[k] || 0) + v / L.length); return D2; }, {})})) : yr;
  // deaths
  const D = {}; Y.forEach(r => Object.entries(r.d || {}).forEach(([k, v]) => D[k] = (D[k] || 0) + v)); const dTot = Object.values(D).reduce((a, b) => a + b, 0);
  const life = H.filter(h => h.status === 'Deceased' && h.diedEd != null && !h.pro), career = life.length ? (life.reduce((a, h) => a + (h.diedEd - h.edition), 0) / life.length).toFixed(1) : '—';
  // exam pass rate
  const ex = HISTORY.filter(r => r.applicants).slice(typeof hiRange !== 'undefined' && hiRange ? -hiRange : 0).map(r => ({ed: r.edition, p: Math.round(r.hunters.length / r.applicants * 1000) / 10}));
  // Nen and careers
  const nen = NEN_CATS.map(c => [c, act.filter(h => h.nen && h.nen.category === c).length]).sort((a, b) => b[1] - a[1]);
  const top3 = NEN_CATS.map(c => { const n = H.filter(h => h.nen && h.nen.category === c), t = n.filter(h => hStars(h) >= 3).length; return [c, n.length ? Math.round(t / n.length * 1000) / 10 : 0]; }).sort((a, b) => b[1] - a[1]);
  const car = {}; act.forEach(h => { const c = (h.career || '—').replace(' Hunter', ''); car[c] = (car[c] || 0) + 1; });
  // families: generations through the heirs, and surnames with the most Hunters
  const byCid = new Map(H.map(h => [h.cid, h])), kidC = new Map((WORLD.heirs || []).filter(x => x.cid).map(x => [x.cid, x])), gen = h => { let d = 1, cur = h, g = 0; while(cur && g++ < 12){ const k = kidC.get(cur.cid); const p = k && (k.grand || k.parents).map(l => hLic(l)).find(Boolean); if(!p) break; d += k.grand ? 2 : 1; cur = p; } return d; };
  const dyn = H.filter(h => h.heirOf || h.hParent || h.grandOf).map(h => [h, gen(h)]).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const PARS = new Set((WORLD.heirs || []).flatMap(k => k.parents || [])), fam = {}; H.filter(h => h.heirOf || h.hParent || h.grandOf || PARS.has(h.license)).forEach(h => { const s = h.name.split(' ').slice(-1)[0]; fam[s] = (fam[s] || 0) + 1; });
  // schools, cases, outlaws, relics, chairs
  const Sc = (WORLD.schools || []).map(s => ({s, all: H.filter(h => h.school === s.id).length})).sort((a, b) => b.all - a.all).slice(0, 5);
  const C = WORLD.cases || [], V = WORLD.caseV || {};
  const W = WORLD.wanted || [], dead = W.filter(w => w.kills).sort((a, b) => b.kills - a.kills).slice(0, 3);
  const R = Object.values(WORLD.relics || {}).filter(r => r.st !== 'hidden'), most = R.slice().sort((a, b) => (b.n || 0) - (a.n || 0)).slice(0, 3);
  const longHold = R.flatMap(r => (r.owners || []).map(o => ({r, o, y: (o.to ?? S.edition) - o.from}))).sort((a, b) => b.y - a.y)[0];
  const terms = {}; (WORLD.chairHist || []).forEach(x => { terms[x.lic] = (terms[x.lic] || 0) + ((x.to || S.edition) - x.from); }); const longChair = Object.entries(terms).sort((a, b) => b[1] - a[1])[0];
  const crisisN = Object.entries(T.crisis || {}).map(([k, v]) => [CRISES[k] ? capS(CRISES[k].name) : k, v]).sort((a, b) => b[1] - a[1]);
  if(!Y.length && !ex.length) return '';
  return `<div class="wstats"><div class="section-h">Statistics</div>
    ${Y.length ? `<p class="muted st-note">Counted from the ${ordinal(Y[0].ed)} exam on.</p>` : ''}
    <div class="hcard"><div><small>Active Hunters</small><b>${act.length}</b></div><div><small>Average age, active</small><b>${act.length ? Math.round(act.reduce((a, h) => a + hunterAge(h), 0) / act.length) : '—'}</b></div><div><small>Deaths a year</small><b>${Y.length ? (dTot / Y.length).toFixed(1) : '—'}</b></div><div><small>Average career, the dead</small><b>${career} yrs</b></div><div><small>Expeditions</small><b>${T.exp || 0}</b></div><div><small>Came back from missing</small><b>${T.back || 0}</b></div></div>
    <div class="st-two">${stLine(recent, 'a', 'Active Hunters')}${stLine(recent, r => r.s ? r.s[3] : null, '★★★ Hunters')}</div>
    <div class="st-two">${stLine(ex, 'p', 'Exam pass rate, % of applicants')}${stLine(recent, r => Object.values(r.d || {}).reduce((a, b) => a + b, 0), 'Deaths a year')}</div>
    <div class="st-three">${stBars('Causes of death', Object.entries(D).map(([k, v]) => [ST_CAUSE[k] || k, v]).sort((a, b) => b[1] - a[1]), pct)}${stBars('Nen, active Hunters', nen, pct)}${stBars('Reach ★★★ by Nen, %', top3, v => v + '%')}</div>
    <div class="st-three">${stBars('Specialties, active', Object.entries(car).sort((a, b) => b[1] - a[1]).slice(0, 8), pct)}${stBars('Crises by kind', crisisN)}${stBars('Cases', [['Guilty', V.guilty || 0], ['Cleared', V.cleared || 0], ['Reopened', C.filter(c => c.re).length], ['Licenses revoked', H.filter(h => h.revoked).length]])}</div>
    <div class="marks">
      ${stList('Longest lines', dyn.map(([h, g]) => [hl(h), `${g} generations${(WORLD.heirs || []).some(k => k.grand && k.cid === h.cid) ? ', one without a Hunter' : ''} · <a data-tree="${esc(h.license)}">the family tree</a>`]), 'lines')}
      ${stList('Families with the most Hunters', Object.entries(fam).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([s, n]) => { const best = H.filter(h => h.name.split(' ').slice(-1)[0] === s).sort((a, b) => (b.rp || 0) - (a.rp || 0))[0];
        return [`<a data-famq="${esc(s)}" title="The family tree of the ${esc(s)}s">${esc(s)}</a>`, `${n} Hunters${best ? ` · best known: ${hl(best)}` : ''}`]; }), 'families')}
      ${stList('Largest schools', Sc.map(({s, all}) => [`<a data-school="${s.id}">${esc(capS(s.name))}</a>`, `${all} students · ${s.heads.length} master${s.heads.length === 1 ? '' : 's'} · ${s.st}`]), 'schools')}
      ${stList('Deadliest outlaws', dead.map(w => [`<a data-outlaw="${esc(w.id)}">${esc(w.name)}</a>` + (w.nick ? ` “${esc(w.nick)}”` : ''), `${w.kills} Hunter${w.kills === 1 ? '' : 's'} killed · ${w.status}`]), 'outlaws')}
      ${stList('Relics', most.map(r => [`<a data-relic="${r.id}">${esc(capS(RDEF[r.id].name))}</a>`, `${r.n || 0} owners`]).concat(longHold ? [[hl(hLic(longHold.o.lic)) || esc(longHold.o.name), `held ${esc(RDEF[longHold.r.id].name)} for ${longHold.y} years`]] : []), 'relics')}
      ${stList('Records of the world', [longChair ? [hl(hLic(longChair[0])), `Chairman for ${longChair[1]} years`] : null, [`${T.expBack || 0} of ${T.exp || 0}`, 'expeditions came home'], [`${T.disc || 0}`, 'places discovered'], [`${W.filter(w => w.status === 'captured').length} / ${W.length}`, 'outlaws captured']].filter(Boolean))}
    </div>${statsMoreHtml(H)}</div>`;
}
// more from the same records: how long a specialty lasts, how long its stars take, the chair, the families, the outlaws
function statsMoreHtml(H){
  const NOW = S.edition, hl = h => h ? `<a data-hunter="${esc(h.license)}">${esc(h.name)}</a>` : '—', P = v => Math.round(v * 100) + '%', med = A => { const s = A.slice().sort((a, b) => a - b), m = s.length >> 1; return s.length ? Math.round(s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) : null; };
  const R = H.filter(h => !h.pro), endOf = h => { const E = [h.diedEd, h.missEd, h.retire && h.retire.ed].filter(v => v != null); return E.length ? Math.min(...E) : (hActive(h) ? null : NOW); };
  const cars = Object.entries(R.reduce((m, h) => (h.career && (m[h.career] = (m[h.career] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]).slice(0, 10).map(x => x[0]);
  const lbl = c => c.replace(' Hunter', ''), bars = (title, rows, note) => rows.length ? `<div class="st-bars"><div class="st-h">${esc(title)}</div>${rows.join('')}${note ? `<p class="muted st-sn">${note}</p>` : ''}</div>` : '';
  const bar = (k, w, v, t) => `<div class="st-b" title="${esc(t)}"><span>${esc(k)}</span><i><b style="width:${(w * 100).toFixed(1)}%"></b></i><em>${v}</em></div>`;
  // still active thirty years on
  const surv = G => { const o = G.filter(h => h.edition + 30 <= NOW); if(o.length < 15) return null; return o.filter(h => { const e = endOf(h); return e == null || e > h.edition + 30; }).length / o.length; };
  const s1 = cars.map(c => [c, surv(R.filter(h => h.career === c))]).filter(x => x[1] != null).sort((a, b) => b[1] - a[1]), all1 = surv(R);
  const b1 = bars('Still active 30 years on', s1.map(([c, v]) => bar(lbl(c), v, P(v), `${lbl(c)} Hunters: ${P(v)} still active 30 years after the license`)), all1 != null ? `All Hunters: ${P(all1)}` : '');
  // years to each star: three steps on one bar
  const F = WORLD.seFrom, SR = F == null ? [] : R.filter(h => h.edition >= F && h.se);
  const s2 = cars.map(c => { const G = SR.filter(h => h.career === c), ys = [0, 1, 2].map(k => med(G.filter(h => h.se[k] != null).map(h => h.se[k] - h.edition))); return {c, ys, n: G.filter(h => h.se[2] != null).length}; })
    .filter(r => r.ys[0] != null && r.n >= 3).sort((a, b) => (a.ys[2] ?? 99) - (b.ys[2] ?? 99));
  const mx2 = Math.max(1, ...s2.map(r => r.ys[2] || r.ys[1] || r.ys[0]));
  const seg = ys => { let o = '', prev = 0; ys.forEach((y, k) => { if(y == null || (k && ys[k - 1] == null)) return; o += `<b class="sy${k + 1}" style="left:${(prev / mx2 * 100).toFixed(1)}%;width:${Math.max(0.8, (y - prev) / mx2 * 100).toFixed(1)}%"></b>`; prev = y; }); return o; };
  const b2 = s2.length ? bars('Years to each star', s2.map(r => `<div class="st-b" title="${esc(lbl(r.c))} Hunters, typically: ★ after ${r.ys[0]} years${r.ys[1] != null ? `, ★★ after ${r.ys[1]}` : ''}${r.ys[2] != null ? `, ★★★ after ${r.ys[2]}` : ''}"><span>${esc(lbl(r.c))}</span><i class="st3">${seg(r.ys)}</i><em>${r.ys.map(y => y ?? '—').join(' · ')}</em></div>`),
    `<span class="sy-l"><span><i class="sy1"></i>★</span><span><i class="sy2"></i>★★</span><span><i class="sy3"></i>★★★</span></span> typical years after the license, counted from the ${ordinal(F)} exam on`) : '';
  // the chair
  const CH = WORLD.chairHist || [], yrsC = {}, nC = {}, per = {};
  CH.forEach(t => { const h = hLic(t.lic), c = h && h.career ? lbl(h.career) : '—', y = (t.to || NOW) - t.from; yrsC[c] = (yrsC[c] || 0) + y; nC[c] = (nC[c] || 0) + 1; const p = per[t.lic] = per[t.lic] || {h, y: 0, k: 0, c}; p.y += y; p.k++; });
  const c10 = Object.entries(yrsC).sort((a, b) => b[1] - a[1]).slice(0, 6), mx10 = c10.length ? c10[0][1] : 1;
  const b10 = c10.length ? bars('In the chair, by specialty', c10.map(([c, y]) => bar(c, y / mx10, `${y} yrs · ${nC[c]} term${nC[c] === 1 ? '' : 's'}`, `${c} Hunters held the chair ${y} years in all, over ${nC[c]} terms`)), `${Object.keys(per).length} Chairmen since the ${ordinal(Math.min(...CH.map(t => t.from)))} · <a data-stall="chairs">all of them ›</a>`) : '';
  const longest = Object.values(per).sort((a, b) => b.y - a.y).slice(0, 3);
  // families: the children of Hunters at the exam, against everyone
  const KE = (WORLD.heirs || []).filter(k => k.entered), byCid = new Set(HUNTERS.map(h => h.cid)), hp = KE.length ? KE.filter(k => k.cid && byCid.has(k.cid)).length / KE.length : null;
  const HI = HISTORY.filter(r => r.applicants), ap = HI.length ? HI.reduce((s, r) => s + r.hunters.length, 0) / HI.reduce((s, r) => s + r.applicants, 0) : null;
  const heir = h => !!(h.heirOf || h.hParent || h.grandOf), last = R.filter(h => h.edition > NOW - 50), share = last.length ? last.filter(heir).length / last.length : null;
  const dec = []; if(R.length){ const e0 = Math.min(...R.map(h => h.edition)); for(let a = Math.floor(e0 / 10) * 10; a <= NOW; a += 10){ const G = R.filter(h => h.edition >= a && h.edition < a + 10); if(G.length >= 5) dec.push({ed: a, p: Math.round(G.filter(heir).length / G.length * 100)}); } }
  // outlaws
  const WD = WORLD.wanted || [], wf = WD.filter(w => w.from != null), w0 = wf.length ? Math.min(...wf.map(w => w.from)) : null, at = [];
  if(w0 != null){ const ev = {}; wf.forEach(w => { ev[w.from] = (ev[w.from] || 0) + 1; const e = w.status === 'wanted' ? null : w.endEd; if(e != null) ev[e] = (ev[e] || 0) - 1; }); let n = 0; for(let e = w0; e <= NOW; e++){ n += ev[e] || 0; at.push({ed: e, v: Math.max(0, n)}); } }
  const cat = {}; WD.forEach(w => { if(w.byLic && (w.status === 'captured' || w.status === 'dead')) cat[w.byLic] = (cat[w.byLic] || 0) + 1; });
  const caught = WD.filter(w => w.status === 'captured' || w.status === 'dead').length, topC = Object.entries(cat).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const lines = [dec.length > 2 ? stLine(dec, 'p', 'New Hunters from a Hunter family, % by decade') : '', at.length > 2 ? stLine(at, 'v', 'Outlaws at large') : ''].filter(Boolean);
  return `${b1 || b2 || b10 ? `<div class="st-three">${b1}${b2}${b10}</div>` : ''}${lines.length ? `<div class="st-two">${lines.join('')}</div>` : ''}
    <div class="marks">${stList('Longest in the chair', longest.map(p => [hl(p.h), `${p.y} years · ${p.k} term${p.k === 1 ? '' : 's'} · ${esc(p.c)} Hunter`]), 'chairs')}
      ${stList('Hunter families', [hp != null ? [P(hp), `of the children of Hunters who sit the exam pass (${KE.length} tried)`] : null, ap != null ? [(ap * 100).toFixed(1) + '%', 'of all applicants pass'] : null, share != null ? [P(share), 'of new Hunters come from a Hunter family, over the last 50 exams'] : null].filter(Boolean))}
      ${WD.length ? stList('Outlaws', [[`${WD.length} on record`, `${P(caught / WD.length)} caught or killed, ${WD.filter(w => w.status === 'wanted').length} still at large`]].concat(topC.map(([l, k]) => [hl(hLic(l)), `brought in ${k} outlaw${k === 1 ? '' : 's'}`])), 'outlaws') : ''}</div>`;
}

// a family name opens its tree; from the tree, the register filtered to that name lists every Hunter of the family with all their data
document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('[data-famq]'); if(t){ e.preventDefault(); treeBySurname(t.dataset.famq); } });
document.addEventListener('click', e => { const f = e.target.closest && e.target.closest('[data-famreg]'); if(!f) return; e.preventDefault();
  haQ = f.dataset.famreg; haPage = 0; if(typeof closeModal === 'function') try { closeModal(); } catch(_){} showTab('hunters'); renderAssociation(); scrollTo(0, 0); });
