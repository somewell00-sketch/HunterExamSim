/* ===================== THE FINAL TOURNAMENT: bout by bout ===================== */
// Reverse elimination: win once and you pass; lose and you fight again. Play runs the real bouts in the order they were fought:
// the bout on the mat with its last exchanges, and every finalist in one of three places: passed, still fighting, out.
const FP_C = {};
// not while the final is being lived (the mentor's live bouts) or replayed: that would give the results away
const fpOf = () => S.bracket && S.bracket.order && S.bracket.order.length && S.stats.find(s => s.p === FINAL_P) && !RP.active && !(S.live && S.live.kind === 'final') ? S.bracket : null;
function fpRun(){
  const B = fpOf(); if(!B) return null; const key = S.edition + ':' + B.order.length + ':' + S.log.length; if(FP_C.key === key) return FP_C.v;
  const M = bracketMatches().filter(m => !m.bye && m.a && m.b).sort((a, b) => a.seq - b.seq), cm = cmap(S);
  const ids = [...new Set(bracketMatches().flatMap(m => [m.a, m.b]).filter(id => id && id !== 'examiner' && cm[id]))];
  // when each finalist passed (their first win) or went out (their last bout, if the final is where they fell)
  const at = {}; ids.forEach(id => { const c = cm[id], won = M.findIndex(m => m.w === id && !m.id.startsWith('P')),   // a preliminary win only gets you into the bracket
    last = M.map((m, k) => (m.a === id || m.b === id) ? k : -1).filter(k => k >= 0).pop();
    at[id] = c.status === 'Approved' ? {pass: won >= 0 ? won : (last != null ? last : 0)} : {out: last != null ? last : 0, how: c.status === 'Deceased' ? 'killed' : c.status === 'Disqualified' ? 'DQ' : ''}; });
  const cast = new Set(typeof chCastAt === 'function' ? chCastAt(FINAL_P) : []), fol = new Set(ids.filter(id => isFav(id) || (!MENTOR.off && mtOf(id)) || cast.has(id)));
  const grpOf = {}, gOfId = {}; (B.groups || []).forEach(g => { g.rounds.flat().concat(g.solo ? [g.solo] : []).forEach(m => grpOf[m.id] = g.name); (g.ids || []).forEach(id => gOfId[id] = g.name); });
  ids.forEach(id => { if(!gOfId[id]){ const m = M.find(m => (m.a === id || m.b === id) && grpOf[m.id]); if(m) gOfId[id] = grpOf[m.id]; } });
  return FP_C.key = key, FP_C.v = {B, M, ids, at, cm, fol, grpOf, gOfId};
}
const fpName = (X, id) => id === 'examiner' ? 'the examiner' : X.cm[id] ? X.cm[id].name : '?';
const fpRound = (m, X) => (X && X.grpOf[m.id] ? X.grpOf[m.id] + ' · ' : '') + (m.id.startsWith('P') ? 'Preliminary' : m.examiner || m.a === 'examiner' || m.b === 'examiner' ? 'License bout' : `Round ${m.round || m.id.split('-')[0].replace(/\D/g, '')}`);
// how Play steps: a small final blow by blow (each exchange of each bout), a big one bout by bout
const FP_BLOW = 12;
function fpSteps(X){ if(X.steps) return X.steps; const blow = X.M.length <= FP_BLOW, st = [];
  X.M.forEach((m, b) => { const n = blow ? Math.max(1, (m.ex || []).length) : 1; for(let e = 0; e < n; e++) st.push({b, e: blow ? e : Math.max(0, (m.ex || []).length - 1), last: e === n - 1}); });
  X.blow = blow; return X.steps = st; }
// the stages of the night, in order, for the strip of bouts (a Jubilee's four brackets each keep their own)
const fpStage = (m, X) => X.B.groups ? (X.grpOf[m.id] || 'Preliminary') : fpRound(m, X);
function fpHtml(){
  const X = fpRun(); if(!X) return '';
  // edge cases with nothing to play: say what happened instead of drawing an empty mat
  if(!X.M.length){ const c = X.ids.map(id => X.cm[id]).filter(Boolean), ok = c.filter(x => x.status === 'Approved');
    if(!c.length) return '';
    return `<div class="rc-box fp-box fp-none"><div class="tv-top"><div class="section-h" style="margin:0">The tournament</div></div><p class="tv-take">${c.length === 1 ? `Only <a data-id="${c[0].id}">${esc(c[0].name)}</a> reached the Final. With nobody to fight, ${PR(c[0]).they} ${ok.length ? `${PR(c[0]).are === 'are' ? 'pass' : 'passes'} without a bout` : 'does not pass'}.` : `${c.length} finalists, and not one bout was fought.`}</p></div>`; }
  const S0 = fpSteps(X), N = S0.length, stages = [...new Set(X.M.map(m => fpStage(m, X)))];
  return `<div class="rc-box fp-box" data-fp><div class="tv-top"><div class="section-h" style="margin:0">${X.blow ? 'The tournament, blow by blow' : 'The tournament, bout by bout'}</div></div>
    <div class="tv-time"><button type="button" class="btn small" data-fpplay>▶ Play</button><div class="tv-rng"><input type="range" data-fph min="0" max="${N}" step="1" value="0" aria-label="${X.blow ? 'Exchange' : 'Bout'}"><div class="tv-ticks"><span>The draw</span><span>${X.M.length} bout${X.M.length === 1 ? '' : 's'}</span><span>The end</span></div></div><b data-fplab></b></div>
    <p class="tv-take" data-fptake></p><div class="fp-mat" data-fpmat></div>
    <div class="fp-strip${X.M.length > 40 ? ' tiny' : X.M.length > FP_BLOW ? ' small' : ''}" data-fpstrip>${stages.map(sg => `<div class="fp-sg"><small>${esc(sg)}</small><span>${X.M.map((m, b) => fpStage(m, X) === sg ? `<i data-fpb="${b}" title="${esc(fpName(X, m.a))} vs ${esc(fpName(X, m.b))}"></i>` : '').join('')}</span></div>`).join('')}</div>
    <div class="fp-roster" data-fpcols></div>
    <div class="rc-low"><div class="section-h" style="margin:0 0 6px">As it happened</div><ul class="rc-tick" data-fptick></ul></div>
    <p class="muted" style="font-size:12.5px;margin:8px 0 0">Win once and you pass; lose and you fight again. ${X.blow ? 'A small final plays blow by blow.' : `${X.M.length} bouts, played one at a time.`} Each square is a bout: green fought, red someone died, gold the one on the mat, empty still to come; click one to jump to it. Names: green passed, gold still fighting, red out.</p></div>`;
}
function fpDraw(box){
  const X = fpRun(); if(!X || !X.M.length) return; const S0 = fpSteps(X), N = S0.length, k = +box.querySelector('[data-fph]').value, end = k >= N, cm = X.cm;
  const cur = k ? S0[k - 1] : null, done = cur ? cur.b + (cur.last ? 1 : 0) : 0;   // bouts finished so far
  box.querySelector('[data-fplab]').textContent = !k ? 'The draw' : end ? 'The end' : X.blow ? `Bout ${cur.b + 1} of ${X.M.length}` : `Bout ${cur.b + 1} of ${X.M.length}`;
  const st = id => { const a = X.at[id]; if(end) return a.pass != null ? 'pass' : 'out'; return a.pass != null && a.pass < done ? 'pass' : a.out != null && a.out < done ? 'out' : 'in'; };
  const G = {pass: [], in: [], out: []}; X.ids.forEach(id => G[st(id)].push(id));
  // the roster: every finalist as a name (by bracket in a Jubilee)
  const ord = {pass: 0, in: 1, out: 2}, pl = X.ids.slice().sort((a, b) => ord[st(a)] - ord[st(b)]);
  const row = L => L.map(id => `<a class="fp-c ${st(id)}" data-id="${id}">${esc(cm[id].first || cm[id].name)}${X.at[id].how && st(id) === 'out' ? ` <i>${X.at[id].how}</i>` : ''}</a>`).join('');
  const groups = X.B.groups ? X.B.groups.map(g => [g.name, pl.filter(id => X.gOfId[id] === g.name)]).concat([['The preliminary', pl.filter(id => !X.gOfId[id])]]).filter(([, L]) => L.length) : [['', pl]];
  box.querySelector('[data-fpcols]').innerHTML = groups.map(([n, L]) => `<div>${n ? `<small>${esc(n)}</small>` : ''}${row(L)}</div>`).join('');
  // the strip: one square per bout, filled as it is fought
  box.querySelectorAll('[data-fpb]').forEach(t => { const b = +t.dataset.fpb, m = X.M[b]; t.className = (b < done ? 'd' + (m.fatal ? ' x' : '') : '') + (cur && b === cur.b && !end ? ' now' : ''); });
  // the mat: the bout being fought (blow by blow in a small final), or the last one
  const m = cur ? X.M[cur.b] : null;
  box.querySelector('[data-fpmat]').innerHTML = m ? (() => { const E = m.ex || [], ei = Math.min(E.length - 1, cur.e), xe = E[ei] || {ha: 100, hb: 100}, over = cur.last;
    const side = (s, hp) => { const id = m[s], nm = id === 'examiner' ? (m.examiner || 'The examiner') : cm[id] ? cm[id].name : '?', res = !over ? '' : m.dq === id ? 'disqualified' : m.fatal && m.l === id ? 'killed' : m.w === id ? 'wins' : 'loses';
      return `<div class="fp-f ${over ? (m.w === id && m.dq !== id ? 'w' : 'l') : ''}">${id !== 'examiner' && cm[id] ? `<a data-id="${id}">${esc(nm)}</a>` : `<b>${esc(nm)}</b>`}<i class="fp-hp"><i style="width:${Math.max(0, hp)}%"></i></i><small>${res || '&nbsp;'}</small></div>`; };
    const line = !over ? esc(xe.text || '') : m.fatal ? `<b>${esc(fpName(X, m.l))} does not get up. ${esc(fpName(X, m.dq || m.w))} is disqualified for it.</b>` : `${X.blow ? '' : E.slice(-2).map(e => esc(e.text)).join(' ')}${m.how ? ` <b>By ${esc(m.how)}.</b>` : ''}`;
    return `<div class="fp-r">${esc(fpRound(m, X))}${X.blow && E.length > 1 && !over ? ` · exchange ${ei + 1}` : ''}</div><div class="fp-vs">${side('a', xe.ha)}<span class="fp-x">vs</span>${side('b', xe.hb)}</div><p class="fp-how">${line}</p>`; })()
    : `<p class="fp-how">${X.ids.length} finalists. Nobody has fought yet.</p>`;
  box.querySelector('[data-fptake]').innerHTML = end ? (G.pass.length ? `<b>${G.pass.length}</b> new Hunter${G.pass.length === 1 ? '' : 's'}, <b>${G.out.length}</b> out.` : `No new Hunters this year. <b>${G.out.length}</b> out.`) : `<b>${G.pass.length}</b> passed · <b>${G.in.length}</b> still fighting · <b>${G.out.length}</b> out`;
  const past = X.M.slice(0, done).slice(-5).reverse();
  box.querySelector('[data-fptick]').innerHTML = past.length ? past.map((b, j) => `<li class="k-${b.fatal ? 'elim' : 'duel'}${j === 0 ? ' new' : ''}"><span>${esc(fpRound(b, X))}</span><p>${linkNames(b.fatal ? `${fpName(X, b.dq || b.w)} killed ${fpName(X, b.l)} and was disqualified.` : `${fpName(X, b.w)} beat ${fpName(X, b.l)}${b.how ? ' by ' + b.how : ''}.`, [b.w, b.l, b.dq].filter(id => id && id !== 'examiner'))}</p></li>`).join('') + (done > 5 ? `<li class="more">${done - 5} earlier</li>` : '') : `<li class="more">The finalists are drawn into the bracket.</li>`;
}
// a square in the strip jumps to the end of that bout
document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('[data-fpb]'); if(!t) return; const box = t.closest('[data-fp]'), X = fpRun(); if(!X) return; const S0 = fpSteps(X), b = +t.dataset.fpb, k = S0.findIndex(s => s.b === b && s.last); if(k < 0) return; box.querySelector('[data-fph]').value = k + 1; fpDraw(box); });
document.addEventListener('input', e => { const r = e.target.closest && e.target.closest('[data-fph]'); if(r) fpDraw(r.closest('[data-fp]')); });
document.addEventListener('click', e => { const pl = e.target.closest && e.target.closest('[data-fpplay]'); if(!pl) return; const box = pl.closest('[data-fp]'), r = box.querySelector('[data-fph]'), mx = +r.max;
  if(box._tm){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; return; }
  if(+r.value >= mx) r.value = 0; pl.textContent = '❚❚ Pause';
  const X = fpRun(), ms = X && X.blow ? 450 : X && X.M.length > 40 ? 380 : 900;
  box._tm = setInterval(() => { if(!box.isConnected){ clearInterval(box._tm); return; } r.value = Math.min(mx, +r.value + 1); fpDraw(box); if(+r.value >= mx){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; } }, ms); });
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if(n.nodeType !== 1) return; (n.matches && n.matches('[data-fp]') ? [n] : [...(n.querySelectorAll ? n.querySelectorAll('[data-fp]') : [])]).forEach(b => { if(!b.dataset.drawn){ b.dataset.drawn = 1; fpDraw(b); } }); }))).observe(document.body, {childList: true, subtree: true});
