/* ===================== TREASURE HUNT: the clue trail ===================== */
// Four steps in order: read the map, find the spot, dig, open the chest. Each searcher stops at the step they failed (their
// recorded cause), and a step only appears once somebody has reached it. The hours come from the results (better searchers
// are faster), so old saves draw too; who made it and how each one failed are the real ones.
const TRAIL_STG = [['Read the map', 'The riddle, the symbols, which way is north', 'could not read the map'], ['Find the spot', 'The landmark on the map, and the stone that marks the cache', 'walked past the cache'], ['Dig', 'A spade, and the hours before sunset', 'gave up digging at sunset'], ['Open the chest', 'A cache, and a token inside', '']];
// the same trail serves the Hall of Old Exams: three rooms in a row, and the way out
const TRAILS = {
  treasure: {stg: TRAIL_STG, stop: {intelligence: 0, perception: 1, determination: 2}, title: 'The clue trail', okW: 'found a cache', okT: 'found a cache', end: 'sunset', idle: 'hands out the maps.',
    note: 'Four steps, in order. Each searcher stops at the step they failed, with a line from someone it happened to; a step appears once somebody has got that far. The names are the people this chapter follows: ✓ found a cache, ✕ stopped there.'},
  hall: {stg: [['The room of old rules', 'Rules carved on the walls, in an old hand', 'could not read the old rules'], ['The old trial', 'A trial from thirty years ago, rebuilt stone by stone', 'repeated an old mistake'], ['The room of names', 'Every name that ever failed here', 'lost heart'], ['The way out', 'The door at the end of the hall', '']],
    stop: {intelligence: 0, strategy: 1, determination: 2}, title: 'The hall, room by room', okW: 'out of the hall', okT: 'walked out of the hall', stillW: 'still inside', end: 'dusk', idle: 'opens the first door.', vets: true,
    note: 'Three rooms in a row, then the way out. Each candidate stops in the room that beat them; a room appears once somebody has reached it. ↺ marks a veteran, who has seen some of this before. ✓ out of the hall, ✕ stopped there.'}
};
const trailOf = i => { const ph = PHASES[i]; return ph && TRAILS[ph.id] && S.stats.find(s => s.p === i) ? i : null; };
const TRAIL_C = {};
function trailRun(i){
  if(trailOf(i) == null) return null; const key = S.edition + ':' + i + ':' + S.log.length; if(TRAIL_C[i] && TRAIL_C[i].key === key) return TRAIL_C[i];
  const ph = PHASES[i], H = s => nhashUI(S.seed + ':tt:' + i + ':' + s), F0 = ph.fail || {};
  const P = S.candidates.filter(c => (c.out == null || c.out >= i) && (typeof c.scores[ph.id] === 'number' || c.out === i));
  const TK = TRAILS[ph.id], STOP = TK.stop;
  const stopOf = c => { if(c.out !== i) return 3; const r = clean(c.reason || '').replace(/^[^:]+:\s*/, ''), k = Object.keys(F0).find(a => r.startsWith(F0[a])); return STOP[k || weakest(c, ph.w)] ?? 0; };
  const R = P.map(c => { const h = H(c.id), sc = typeof c.scores[ph.id] === 'number' ? c.scores[ph.id] : 30, sp = Math.max(0.6, 1.6 - (sc - 30) / 60);
    const t0 = 0.3 + sp * (0.8 + (h % 100) / 200), t1 = t0 + sp * (1.2 + ((h >> 4) % 100) / 150), t2 = t1 + sp * (1.4 + ((h >> 8) % 100) / 120), stop = stopOf(c);
    return {c, stop, ts: [Math.min(9.6, t0), Math.min(9.6, t1), stop === 2 ? 9.8 : Math.min(9.6, t2)]}; });
  const egR = [0, 1, 2].map(s => R.find(x => x.stop === s && x.c.fall)), eg = egR.map(r => r ? r.c.fall.split(/(?<=[.!?])\s/)[0] : ''), egId = egR.map(r => r ? r.c.id : '');
  const cast = new Set(typeof chCastAt === 'function' ? chCastAt(i) : []), F = [];
  R.filter(r => isFav(r.c.id) || (!MENTOR.off && mtOf(r.c.id))).concat(R.filter(r => cast.has(r.c.id))).forEach(r => { if(F.length < 12 && !F.includes(r)) F.push(r); });
  if(!F.some(r => r.stop < 3)){ const s = R.filter(r => r.stop < 3).sort((a, b) => (b.c.scores[ph.id] || 0) - (a.c.scores[ph.id] || 0))[0]; if(s) F.push(s); }
  const COL = ['#72b58d', '#d9a640', '#e3889f', '#7fa6c9', '#c49ad6', '#9fc7c0', '#e0a072', '#b8c26a', '#8fb3ff', '#f0c4d8', '#d4d4d4', '#a0d0a0', '#e8b4b4'];
  const EV = S.log.filter(e => e.p === i && ['rescue', 'event', 'story', 'arc', 'bond', 'major', 'elim'].includes(e.type) && (typeof phFits !== 'function' || ['elim', 'major'].includes(e.type) || phFits(ph.id, e.text, S.theme || 'classic')) && (e.ids || []).length)
    .map(e => ({t: /first|scrapes|finishes|waking up|watching/i.test(e.text) ? 9.6 : /remembers|speech|goes pale|at the start/i.test(e.text) ? 0.3 : 0.8 + (H(e.text) % 1000) / 1000 * 8, e})).sort((a, b) => a.t - b.t);
  return TRAIL_C[i] = {key, i, TK, R, eg, egId, F: F.map((r, j) => ({r, col: COL[j % COL.length]})), EV, after: R.filter(r => r.stop === 3).length, ex: ph.ex ? ph.ex.name : 'The examiner'};
}
const trailAt = (r, h) => { for(let s = 0; s < 3; s++){ if(h < r.ts[s]) return {s, done: false}; if(r.stop === s) return {s, done: true}; } return {s: 3, done: true}; };
const trailClock = h => { const t = 9 + h, hh = Math.floor(t), m = Math.round((t % 1) * 60) % 60; return `${hh % 12 || 12}:${String(m).padStart(2, '0')} ${hh >= 12 ? 'pm' : 'am'}`; };
function trailHtml(i){
  const X = trailRun(i); if(!X) return '';
  return `<div class="rc-box tt-box" data-tt="${i}"><div class="tv-top"><div class="section-h" style="margin:0">${esc(X.TK.title)}</div></div>
    <div class="tv-time"><button type="button" class="btn small" data-ttplay>▶ Play</button><div class="tv-rng"><input type="range" data-tth min="0" max="100" value="0" aria-label="Hour"><div class="tv-ticks"><span>9 am</span><span>noon</span><span>3 pm</span><span>${X.TK.end}</span></div></div><b data-ttlab></b></div>
    <p class="tv-take" data-tttake></p><div class="trail" data-ttsteps></div>
    <div class="rc-low"><div class="section-h" style="margin:0 0 6px">As it happened</div><ul class="rc-tick" data-tttick></ul></div>
    <p class="muted" style="font-size:12.5px;margin:8px 0 0">${esc(X.TK.note)} Click a name to open their page.</p></div>`;
}
function trailDraw(box){
  const X = trailRun(+box.dataset.tt); if(!X) return; const h = +box.querySelector('[data-tth]').value / 10;
  box.querySelector('[data-ttlab]').textContent = trailClock(h);
  const now = [0, 0, 0, 0], stopped = [0, 0, 0, 0], top = Math.max(0, ...X.R.map(r => trailAt(r, h).s));
  X.R.forEach(r => { const a = trailAt(r, h); if(a.s === 3) now[3]++; else if(a.done) stopped[a.s]++; else now[a.s]++; });
  const mx = Math.max(1, ...now, ...stopped);
  box.querySelector('[data-ttsteps]').innerHTML = X.TK.stg.map(([n, d, fl], j) => { if(j > top) return '';   // a step nobody has reached does not exist yet
    const fs = X.F.filter(f => trailAt(f.r, h).s === j);
    return `<div class="tr-st${j === 3 ? ' end' : ''}"><span class="tr-i">${j + 1}</span><span class="tr-n"><b>${esc(n)}</b><small>${esc(d)}</small></span>
      <span class="tr-b"><i class="${j === 3 ? 'g' : 'y'}" style="width:${now[j] / mx * 100}%"></i>${j < 3 ? `<i class="r" style="width:${stopped[j] / mx * 100}%"></i>` : ''}</span>
      <span class="tr-c">${now[j] ? `<b class="${j === 3 ? 'g' : ''}">${fmt(now[j])}</b> ${j === 3 ? esc(X.TK.okW) : 'working on it'}` : ''}${j < 3 && stopped[j] ? ` <em>· ${fmt(stopped[j])} ${esc(fl)}</em>` : ''}${j < 3 && stopped[j] && X.eg[j] ? `<small class="tr-eg">${linkNames(X.eg[j], [X.egId[j]])}</small>` : ''}</span>
      <span class="tr-f">${fs.map(f => { const a = trailAt(f.r, h), down = a.done && j < 3; return `<a class="rc-tk${down ? ' down' : ''}" style="--c:${f.col}" data-id="${f.r.c.id}">${down ? '✕ ' : j === 3 ? '✓ ' : ''}${X.TK.vets && attemptsOf(f.r.c) > 1 ? '↺ ' : ''}${esc(f.r.c.first || f.r.c.name)}</a>`; }).join('')}</span></div>`; }).filter(Boolean).join('<i class="tr-arrow" aria-hidden="true">↓</i>');
  box.querySelector('[data-tttake]').innerHTML = h >= 10 ? `<b>${fmt(X.after)}</b> ${esc(X.TK.okT)}, <b>${fmt(X.R.length - X.after)}</b> out.` : `<b>${fmt(now[3])}</b> ${esc(X.TK.okW)} · <b>${fmt(now[0] + now[1] + now[2])}</b> ${esc(X.TK.stillW || 'still searching')} · <b>${fmt(stopped.reduce((a, b) => a + b, 0))}</b> out`;
  const past = X.EV.filter(x => x.t <= h), last = past.slice(-5).reverse();
  box.querySelector('[data-tttick]').innerHTML = last.length ? last.map((x, j) => `<li class="k-${x.e.type}${j === 0 ? ' new' : ''}"><span>${trailClock(x.t)}</span><p>${linkNames(chTidy(x.e.text, PHASES[X.i]), x.e.ids || [])}</p></li>`).join('') + (past.length > 5 ? `<li class="more">${past.length - 5} earlier</li>` : '') : `<li class="more">${esc(X.ex)} ${esc(X.TK.idle)}</li>`;
}
document.addEventListener('input', e => { const r = e.target.closest && e.target.closest('[data-tth]'); if(r) trailDraw(r.closest('[data-tt]')); });
document.addEventListener('click', e => { const pl = e.target.closest && e.target.closest('[data-ttplay]'); if(!pl) return; const box = pl.closest('[data-tt]'), r = box.querySelector('[data-tth]');
  if(box._tm){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; return; }
  if(+r.value >= 100) r.value = 0; pl.textContent = '❚❚ Pause';
  box._tm = setInterval(() => { if(!box.isConnected){ clearInterval(box._tm); return; } r.value = Math.min(100, +r.value + 1); trailDraw(box); if(+r.value >= 100){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; } }, 110); });
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if(n.nodeType !== 1) return; (n.matches && n.matches('[data-tt]') ? [n] : [...(n.querySelectorAll ? n.querySelectorAll('[data-tt]') : [])]).forEach(b => { if(!b.dataset.drawn){ b.dataset.drawn = 1; trailDraw(b); } }); }))).observe(document.body, {childList: true, subtree: true});
