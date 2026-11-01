/* ===================== HUNTS (Creature Capture, Beast Taming, Dangerous Wetlands, Night Forest Chase): how each one ended ===================== */
// One card per way it ended: the one way through, and each way the trial took people out (their elimination cause, as recorded).
// Play fills the cards hour by hour; the names are the people this chapter follows. When each thing happened comes from the
// results (the strongest catch their prey first; a crossing ends together, behind the examiner), so old saves draw too.
const HUNT = {
  capture: {what: 'The hunt', ok: 'Caught a Great Stamp', still: 'still hunting', start: 12, dur: 6, cross: false},
  beast: {what: 'The taming', ok: 'Tamed their beast', still: 'still trying', start: 9, dur: 6, cross: false},
  wetlands: {what: 'The swamp', ok: 'Made it across', still: 'still in the swamp', start: 6, dur: 5, cross: true},
  nighthunt: {what: 'The night forest', ok: 'Kept the lantern in sight', still: 'still in the forest', start: 20, dur: 8, cross: true},
  // the auction is counted in lots, not hours: twenty lots go under the hammer
  auction: {what: 'The auction', ok: 'Bought something real', still: 'still bidding', start: 0, dur: 20, cross: false, lots: true}
};
const huntOf = i => { const ph = PHASES[i]; return ph && HUNT[ph.id] && S.stats.find(s => s.p === i) ? HUNT[ph.id] : null; };
const HUNT_C = {};
function huntRun(i){
  const K = huntOf(i); if(!K) return null; const key = S.edition + ':' + i + ':' + S.log.length; if(HUNT_C[i] && HUNT_C[i].key === key) return HUNT_C[i];
  const ph = PHASES[i], H = s => nhashUI(S.seed + ':hu:' + i + ':' + s), sc = c => typeof c.scores[ph.id] === 'number' ? c.scores[ph.id] : -99;
  const P = S.candidates.filter(c => (c.out == null || c.out >= i) && (typeof c.scores[ph.id] === 'number' || c.out === i));
  const cause = c => clean(c.reason || '').replace(/^[^:]+:\s*/, '').replace(/, missing the cut by a hair$/, '').replace(/; .*$/, '').trim() || 'did not make it';
  const ok = P.filter(c => c.out !== i).sort((a, b) => sc(b) - sc(a)), out = P.filter(c => c.out === i);
  const T = new Map(), KIND = new Map();
  ok.forEach((c, j) => { const f = j / Math.max(1, ok.length - 1); T.set(c.id, K.cross ? K.dur * (0.86 + f * 0.13) : 0.5 + f * (K.dur - 1)); KIND.set(c.id, '_ok'); });
  out.forEach(c => { const k = c.status === 'Deceased' ? 'did not survive' : c.status === 'Disqualified' ? 'was disqualified' : cause(c); KIND.set(c.id, k); T.set(c.id, /empty|came back|lost it|walked away/i.test(k) ? K.dur * (0.9 + (H(c.id) % 80) / 1000) : 0.3 + (H(c.id) % 1000) / 1000 * K.dur * 0.88); });
  // the ways out, most common first, each with one real line from someone it happened to
  const ways = {}; out.forEach(c => { const k = KIND.get(c.id); (ways[k] = ways[k] || {k, n: 0, eg: ''}).n++; if(!ways[k].eg && c.fall){ ways[k].eg = c.fall.split(/(?<=[.!?])\s/)[0]; ways[k].egId = c.id; } });
  const cards = [{k: '_ok', l: K.ok, ok: true, n: ok.length}].concat(Object.values(ways).sort((a, b) => b.n - a.n).map(w => ({k: w.k, l: w.k.charAt(0).toUpperCase() + w.k.slice(1), n: w.n, eg: w.eg, egId: w.egId})));
  const cast = new Set(typeof chCastAt === 'function' ? chCastAt(i) : []), F = [];
  P.filter(c => isFav(c.id) || (!MENTOR.off && mtOf(c.id))).concat(P.filter(c => cast.has(c.id))).forEach(c => { if(F.length < 12 && !F.includes(c)) F.push(c); });
  if(!F.some(c => c.out === i)){ const s = out.slice().sort((a, b) => sc(b) - sc(a))[0]; if(s) F.push(s); }
  const COL = ['#72b58d', '#d9a640', '#e3889f', '#7fa6c9', '#c49ad6', '#9fc7c0', '#e0a072', '#b8c26a', '#8fb3ff', '#f0c4d8', '#d4d4d4', '#a0d0a0', '#e8b4b4'];
  const EV = S.log.filter(e => e.p === i && ['rescue', 'event', 'story', 'arc', 'bond', 'major', 'elim'].includes(e.type) && (typeof phFits !== 'function' || ['elim', 'major'].includes(e.type) || phFits(ph.id, e.text, S.theme || 'classic')) && (e.ids || []).length)
    .map(e => { const start = /instructions|at the start|before the|goes pale|sets off|looks at the/i.test(e.text), end = /finishes|first|barely|scrapes|after the|waking up|comes close|to the finish|across the line|over the line|limping/i.test(e.text);
      return {t: e.type === 'elim' && T.has(e.ids[0]) ? T.get(e.ids[0]) : start ? 0.1 + (H(e.text) % 30) / 100 : end ? K.dur * (0.9 + (H(e.text) % 9) / 100) : 0.4 + (H(e.text) % 1000) / 1000 * K.dur * 0.85, e}; }).sort((a, b) => a.t - b.t);
  return HUNT_C[i] = {key, K, P, T, KIND, cards, F: F.map((c, j) => ({c, col: COL[j % COL.length]})), EV, after: ok.length, ex: ph.ex ? ph.ex.name : 'The examiner'};
}
const huntClock = (K, h) => K.lots ? (h >= K.dur ? 'The last gavel' : `Lot ${Math.min(K.dur, Math.floor(h) + 1)} of ${K.dur}`) : huntClock0(K, h);
const huntClock0 = (K, h) => { const t = (K.start + h) % 24, hh = Math.floor(t), mm = Math.round((t % 1) * 60) % 60; return `${hh % 12 || 12}:${String(mm).padStart(2, '0')} ${hh >= 12 ? 'pm' : 'am'}`; };
function huntHtml(i){
  const X = huntRun(i); if(!X) return ''; const K = X.K, mx = K.dur * 10, tk = [0, .25, .5, .75, 1].map(f => `<span>${huntClock(K, K.dur * f)}</span>`).join('');
  return `<div class="rc-box hu-box" data-hu="${i}"><div class="tv-top"><div class="section-h" style="margin:0">${esc(K.what)}</div></div>
    <div class="tv-time"><button type="button" class="btn small" data-huplay>▶ Play</button><div class="tv-rng"><input type="range" data-huh min="0" max="${mx}" value="0" aria-label="Hour"><div class="tv-ticks">${tk}</div></div><b data-hulab></b></div>
    <p class="tv-take" data-hutake></p><div class="hb-cards" data-hucards></div>
    <div class="rc-low"><div class="section-h" style="margin:0 0 6px">As it happened</div><ul class="rc-tick" data-hutick></ul></div>
    <p class="muted" style="font-size:12.5px;margin:8px 0 0">One card for the way through and one for each way the ${esc(PHASES[i].name.replace(/^The /, ''))} took people out, with a line from someone it happened to. Press Play and the cards fill hour by hour. The names are the people this chapter follows: ✓ made it, ✕ did not; click one to open their page.</p></div>`;
}
function huntDraw(box){
  const i = +box.dataset.hu, X = huntRun(i); if(!X) return; const K = X.K, h = +box.querySelector('[data-huh]').value / 10, cnt = {};
  box.querySelector('[data-hulab]').textContent = huntClock(K, h);
  X.P.forEach(c => { if(X.T.get(c.id) <= h){ const k = X.KIND.get(c.id); cnt[k] = (cnt[k] || 0) + 1; } });
  const done = Object.values(cnt).reduce((s, v) => s + v, 0), still = X.P.length - done, mxBad = Math.max(1, ...X.cards.filter(c => !c.ok).map(c => c.n));
  const chips = k => X.F.filter(f => X.KIND.get(f.c.id) === k && X.T.get(f.c.id) <= h).map(f => `<a class="rc-tk${f.c.out === i ? ' down' : ''}" style="--c:${f.col}" data-id="${f.c.id}">${f.c.out === i ? '✕' : '✓'} ${esc(f.c.first || f.c.name)}</a>`).join('');
  const waiting = X.F.filter(f => X.T.get(f.c.id) > h).map(f => `<a class="rc-tk" style="--c:${f.col}" data-id="${f.c.id}">${esc(f.c.first || f.c.name)}</a>`).join('');
  box.querySelector('[data-hucards]').innerHTML = `<div class="hb-card still"><b>${fmt(still)}</b><span>${esc(K.still)}</span>${waiting ? `<div class="hb-f">${waiting}</div>` : ''}</div>`
    + X.cards.map(c => { const n = cnt[c.k] || 0; return `<div class="hb-card ${c.ok ? 'ok' : 'bad'}"><b>${fmt(n)}</b><span>${esc(c.l)}</span><i class="hb-bar"><i style="width:${n / (c.ok ? Math.max(1, c.n) : mxBad) * 100}%"></i></i>${c.eg ? `<small>${linkNames(c.eg, [c.egId])}</small>` : ''}${chips(c.k) ? `<div class="hb-f">${chips(c.k)}</div>` : ''}</div>`; }).join('');
  box.querySelector('[data-hutake]').innerHTML = h >= K.dur ? `<b>${fmt(X.after)}</b> through, <b>${fmt(X.P.length - X.after)}</b> out.` : `<b>${fmt(still)}</b> ${esc(K.still)} · <b>${fmt(cnt._ok || 0)}</b> ${esc(K.ok.toLowerCase())} · <b>${fmt(done - (cnt._ok || 0))}</b> out`;
  const past = X.EV.filter(x => x.t <= h), last = past.slice(-5).reverse();
  box.querySelector('[data-hutick]').innerHTML = last.length ? last.map((x, j) => `<li class="k-${x.e.type}${j === 0 ? ' new' : ''}"><span>${huntClock(K, x.t)}</span><p>${linkNames(chTidy(x.e.text, PHASES[i]), x.e.ids || [])}</p></li>`).join('') + (past.length > 5 ? `<li class="more">${past.length - 5} earlier</li>` : '') : `<li class="more">${esc(X.ex)} gives the signal.</li>`;
}
document.addEventListener('input', e => { const r = e.target.closest && e.target.closest('[data-huh]'); if(r) huntDraw(r.closest('[data-hu]')); });
document.addEventListener('click', e => { const pl = e.target.closest && e.target.closest('[data-huplay]'); if(!pl) return; const box = pl.closest('[data-hu]'), r = box.querySelector('[data-huh]'), mx = +r.max;
  if(box._tm){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; return; }
  if(+r.value >= mx) r.value = 0; pl.textContent = '❚❚ Pause';
  box._tm = setInterval(() => { if(!box.isConnected){ clearInterval(box._tm); return; } r.value = Math.min(mx, +r.value + 1); huntDraw(box); if(+r.value >= mx){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; } }, 120); });
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if(n.nodeType !== 1) return; (n.matches && n.matches('[data-hu]') ? [n] : [...(n.querySelectorAll ? n.querySelectorAll('[data-hu]') : [])]).forEach(b => { if(!b.dataset.drawn){ b.dataset.drawn = 1; huntDraw(b); } }); }))).observe(document.body, {childList: true, subtree: true});
