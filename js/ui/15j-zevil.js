/* ===================== ZEVIL ISLAND: the week, morning, afternoon and night ===================== */
// Below the day tabs (the text view, unchanged), a Play view of the week: the people this chapter follows, their points and the
// badges in their hands, part by part. Who held which badge at the end of each day is the real record (Z.days); a move is put
// in the part of the day of the event that names the badge (an ambush at night, an ally's handover in the morning), or a seeded one.
const ZW_PART = ['Morning', 'Afternoon', 'Night'], ZW_N = 21, ZW_C = {};
let ZW_POS = null;   // where the slider was, so a day tab above does not rewind the week below
const zwOf = i => { const ph = PHASES[i], Z = S.zevil; return ph && ph.zevil && Z && Z.days && Z.days.length > 1 && Z.targets && S.stats.find(s => s.p === i) && LIVE_CAP == null ? Z : null; };
const zwLab = s => s === 0 ? 'Arrival' : `Day ${Math.floor((s - 1) / 3) + 1} · ${ZW_PART[(s - 1) % 3]}`;
function zwPartOf(e){ const t = e.text;
  if(e.type === 'ally' || e.type === 'family') return 0;
  if(/dark|night|sleep|asleep|camp|fire|moon|ambush/i.test(t)) return 2;
  if(/dawn|morning|stream|drinks|breakfast/i.test(t)) return 0;
  if(e.type === 'help') return 1;
  return e.type === 'duel' ? 1 + nhashUI(S.seed + ':zw:' + t) % 2 : nhashUI(S.seed + ':zw:' + t) % 3; }
function zwRun(i){
  const Z = zwOf(i); if(!Z) return null; const key = S.edition + ':' + i + ':' + Z.ev.length; if(ZW_C.key === key) return ZW_C.v; if(ZW_C.key && ZW_C.key.split(':')[0] !== String(S.edition)) ZW_POS = null;
  const cm = cmap(S), reg = id => cm[id] ? cm[id].reg : '?';
  const EV = Z.ev.filter(e => e.day > 0).map(e => ({s: (e.day - 1) * 3 + zwPartOf(e) + 1, e}));
  // the moves: whoever holds a badge at the end of a day, against the end of the day before
  const MOVES = [];
  for(let d = 1; d < Z.days.length; d++){
    const wa = {}, wb = {}; Object.entries(Z.days[d - 1].hold).forEach(([h, L]) => L.forEach(b => wa[b] = h)); Object.entries(Z.days[d].hold).forEach(([h, L]) => L.forEach(b => wb[b] = h));
    Object.entries(wb).forEach(([b, h]) => { if(wa[b] === h) return; const tag = '#' + reg(b), ev = EV.find(x => x.e.day === d && x.e.text.includes(tag));
      MOVES.push({s: ev ? ev.s : (d - 1) * 3 + 1 + nhashUI(S.seed + ':zwm:' + b + d) % 3, b, fr: wa[b] || null, to: h}); });
  }
  const cast = new Set(typeof chCastAt === 'function' ? chCastAt(i) : []), P = Z.ids.map(id => cm[id]).filter(Boolean), F = [];
  P.filter(c => isFav(c.id) || (!MENTOR.off && mtOf(c.id))).concat(P.filter(c => cast.has(c.id))).forEach(c => { if(F.length < 10 && !F.includes(c)) F.push(c); });
  if(!F.some(c => c.out === i)){ const s = P.filter(c => c.out === i).sort((a, b) => (b.points || 0) - (a.points || 0))[0]; if(s) F.push(s); }
  const COL = ['#72b58d', '#d9a640', '#e3889f', '#7fa6c9', '#c49ad6', '#9fc7c0', '#e0a072', '#b8c26a', '#8fb3ff', '#f0c4d8', '#d4d4d4'];
  const st = S.stats.find(s => s.p === i), ph = PHASES[i];
  ZW_C.key = key; return ZW_C.v = {i, Z, cm, reg, EV, MOVES, P, F: F.map((c, j) => ({c, col: COL[j % COL.length]})), after: st.after, n: st.before, ex: ph.ex ? ph.ex.name : 'The examiner'};
}
function zwHold(X, s){ const H = {}; Object.entries(X.Z.days[0].hold).forEach(([id, L]) => H[id] = L.slice());
  X.MOVES.filter(m => m.s <= s).forEach(m => { if(m.fr && H[m.fr]) H[m.fr] = H[m.fr].filter(b => b !== m.b); (H[m.to] = H[m.to] || []).push(m.b); }); return H; }
function zwHtml(i){
  const X = zwRun(i); if(!X) return '';
  return `<div class="tw-full"><div class="rc-box zw-box" data-zw="${i}"><div class="tv-top"><div class="section-h" style="margin:0">The week on the island</div></div>
    <div class="tv-time"><button type="button" class="btn small" data-zwplay>▶ Play</button><div class="tv-rng"><input type="range" data-zwh min="0" max="${ZW_N}" step="1" value="${ZW_POS == null ? 0 : ZW_POS}" aria-label="Day and time of day"><div class="tv-ticks zw-ticks"><span>⚓</span>${[1, 2, 3, 4, 5, 6, 7].map(d => `<span>Day ${d}</span>`).join('')}</div></div><b data-zwlab></b></div>
    <p class="tv-take" data-zwtake></p><div class="zw-rows" data-zwrows></div>
    <div class="rc-low"><div class="section-h" style="margin:0 0 6px">As it happened</div><ul class="rc-tick" data-zwtick></ul></div>
    <p class="muted" style="font-size:12.5px;margin:8px 0 0">The people this chapter follows, and the badges each one carries: <span class="bdg own">#</span> own and <span class="bdg tgt">#</span> target are worth 3, <span class="bdg any">#</span> any other 1; a faded one is not in their hands. Press Play and the week runs morning, afternoon and night; the day tabs above stay as they are.</p></div></div>`;
}
function zwDraw(box){
  const X = zwRun(+box.dataset.zw); if(!X) return; const s = +box.querySelector('[data-zwh]').value, H = zwHold(X, s), end = s === ZW_N, now = X.MOVES.filter(m => m.s === s), T = X.Z.targets, cm = X.cm;
  ZW_POS = s; box.querySelector('[data-zwlab]').textContent = zwLab(s);
  const val = (id, b) => b === id || b === T[id] ? 3 : 1, pts = id => (H[id] || []).reduce((a, b) => a + val(id, b), 0);
  const fol = new Set(X.F.map(f => f.c.id)), others = X.P.filter(c => !fol.has(c.id)), safe = X.P.filter(c => pts(c.id) >= 6).length;
  box.querySelector('[data-zwtake]').innerHTML = end ? `<b>${fmt(X.after)}</b> left the island with 6 points or more, <b>${fmt(X.n - X.after)}</b> did not.`
    : `<b>${fmt(safe)}</b> of ${fmt(X.P.length)} on 6 points or more · <b>${fmt(X.MOVES.filter(m => m.s <= s).length)}</b> badges have changed hands${others.length ? ` · everyone you do not follow: <b>${fmt(others.filter(c => pts(c.id) >= 6).length)}</b> on 6+, <b>${fmt(others.filter(c => pts(c.id) < 6).length)}</b> short` : ''}`;
  const tok = (id, b, miss) => { const k = b === id ? 'own' : b === T[id] ? 'tgt' : 'any', g = now.some(m => m.b === b && m.to === id);
    return `<span class="bdg ${k}${miss ? ' miss' : ''}${g ? ' gain' : ''}" title="${k === 'own' ? 'Own badge' : k === 'tgt' ? 'Target' : 'Badge'} #${X.reg(b)}">${X.reg(b)}</span>`; };
  const moved = id => { const m = now.find(m => m.to === id || m.fr === id); if(!m) return ''; const t = cm[m.to], f = m.fr && cm[m.fr];
    return m.to === id ? `<small class="zw-g">+ #${X.reg(m.b)} from ${f ? `<a data-id="${f.id}">${esc(f.first)}</a>` : 'the sand'}</small>` : `<small class="zw-l">− #${X.reg(m.b)} to <a data-id="${t.id}">${esc(t.first)}</a></small>`; };
  // one short row per person: the name with the points under it, the badges in hand with what just changed under them
  box.querySelector('[data-zwrows]').innerHTML = X.F.map(f => ({f, v: pts(f.c.id), b: H[f.c.id] || []})).sort((a, b) => b.v - a.v).map(({f, v, b}) => {
    const id = f.c.id, tg = T[id], gone = (X.Z.days[Math.min(X.Z.days.length - 1, Math.ceil(s / 3))].gone || {})[id], st = gone ? 'bad' : v >= 6 ? 'ok' : end || !v ? 'bad' : '';
    return `<div class="zw-r ${st}" style="--c:${f.col}"><span class="zw-w"><a class="zw-n" data-id="${id}">${esc(f.c.first || f.c.name)}</a><b class="zw-p">${v}<small>/6</small>${gone ? ' <small class="zw-l">✕</small>' : end ? (v >= 6 ? ' <small class="zw-g">✓</small>' : ' <small class="zw-l">✕</small>') : ''}</b></span>
      <span class="zw-bx"><span class="zw-b">${tok(id, id, !b.includes(id))}${tg ? tok(id, tg, !b.includes(tg)) : ''}${b.filter(x => x !== id && x !== tg).map(x => tok(id, x)).join('')}</span>${moved(id)}</span></div>`; }).join('');
  const past = X.EV.filter(x => x.s <= s).sort((a, b) => a.s - b.s), last = past.slice(-5).reverse();
  box.querySelector('[data-zwtick]').innerHTML = last.length ? last.map((x, j) => `<li class="k-${x.e.type}${j === 0 ? ' new' : ''}"><span>${zwLab(x.s)}</span><p>${linkNames(x.e.text.replace(/^(Day \d+|Arrival): /, ''), x.e.ids || [])}</p></li>`).join('') + (past.length > 5 ? `<li class="more">${past.length - 5} earlier</li>` : '') : `<li class="more">${esc(X.ex)} hands out the target numbers.</li>`;
}
document.addEventListener('input', e => { const r = e.target.closest && e.target.closest('[data-zwh]'); if(r) zwDraw(r.closest('[data-zw]')); });
document.addEventListener('click', e => { const pl = e.target.closest && e.target.closest('[data-zwplay]'); if(!pl) return; const box = pl.closest('[data-zw]'), r = box.querySelector('[data-zwh]');
  if(box._tm){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; return; }
  if(+r.value >= ZW_N) r.value = 0; pl.textContent = '❚❚ Pause';
  box._tm = setInterval(() => { if(!box.isConnected){ clearInterval(box._tm); return; } r.value = Math.min(ZW_N, +r.value + 1); zwDraw(box); if(+r.value >= ZW_N){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; } }, 1100); });
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if(n.nodeType !== 1) return; (n.matches && n.matches('[data-zw]') ? [n] : [...(n.querySelectorAll ? n.querySelectorAll('[data-zw]') : [])]).forEach(b => { if(!b.dataset.drawn){ b.dataset.drawn = 1; zwDraw(b); } }); }))).observe(document.body, {childList: true, subtree: true});
