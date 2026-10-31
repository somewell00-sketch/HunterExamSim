/* ===================== ENDURANCE TRIALS (Marathon, Staircase, Desert, Mountain, Cliff Path): the course, checkpoint by checkpoint ===================== */
// The examiner sets the pace and never changes it; whoever cannot keep up falls behind and is out. Where each one fell and how
// far behind the examiner each finisher ran come from their result in the trial (weakest fall first), so old saves draw too.
const RACE = {
  marathon: {len: 80, step: 10, speed: 10, what: 'The tunnel', start: 'Start', end: 'The exit', u: 'km', seg: c => `km ${c}–${c + 10}`, at: v => `km ${Math.round(v)}`,
    labels: [['The start', 'Km 40', 'The last stretch'], ['Km 0', 'Somewhere past km 30', 'The exit in sight']]},
  stairs: {len: 3000, step: 500, speed: 450, what: 'The staircase', start: 'The bottom', end: 'The top', u: 'steps', seg: c => `steps ${c}–${c + 500}`, at: v => `step ${Math.round(v / 10) * 10}`,
    labels: [['The first steps', 'Halfway up', 'The top'], ['The bottom', 'Step 1,500', 'The last flight']]},
  desert: {len: 120, step: 20, speed: 6, what: 'The desert', start: 'The edge of the sand', end: 'The far oasis', u: 'km', seg: c => `km ${c}–${c + 20}`, at: v => `km ${Math.round(v)}`,
    labels: [['The edge of the sand', 'The second day', 'The far oasis'], ['Km 0', 'The heat of the day', 'The oasis in sight']]},
  mountain: {len: 3000, step: 500, speed: 300, what: 'The mountain', start: 'Base camp', end: 'The summit', u: 'm', seg: c => `${c}–${c + 500} m`, at: v => `${Math.round(v / 10) * 10} m`,
    labels: [['Base camp', 'The ridge', 'The summit'], ['The foot of the mountain', '1,500 metres', 'The last rope']]},
  cliffpath: {len: 12, step: 2, speed: 1.5, what: 'The cliff path', start: 'The first ledge', end: 'The far side', u: 'km', seg: c => `km ${c}–${c + 2}`, at: v => `km ${Math.round(v * 10) / 10}`,
    labels: [['The first ledge', 'The narrow part', 'The far side'], ['The trailhead', 'Halfway along the wall', 'The last ledge']]}
};
const raceOf = i => { const ph = PHASES[i]; return ph && RACE[ph.id] && S.stats.find(s => s.p === i) ? RACE[ph.id] : null; };
const RACE_C = {};
function raceRun(i){
  const K = raceOf(i); if(!K) return null; const key = S.edition + ':' + i + ':' + S.log.length; if(RACE_C[i] && RACE_C[i].key === key) return RACE_C[i];
  const ph = PHASES[i], H = s => nhashUI(S.seed + ':rc:' + i + ':' + s);
  const P = S.candidates.filter(c => (c.out == null || c.out >= i) && (typeof c.scores[ph.id] === 'number' || c.out === i));
  const sc = c => typeof c.scores[ph.id] === 'number' ? c.scores[ph.id] : -99, outs = P.filter(c => c.out === i).sort((a, b) => sc(a) - sc(b) || H(a.id) - H(b.id)), stay = P.filter(c => c.out !== i);
  const mx = Math.max(...P.map(sc).filter(v => v > -99), ph.T + 1), R = new Map();
  outs.forEach((c, k) => { const f = Math.pow(k / Math.max(1, outs.length - 1), 0.85); R.set(c.id, {fall: Math.min(K.len * 0.98, Math.max(K.len * 0.02, K.len * (0.05 + 0.92 * f) + ((H(c.id) % 60) - 30) / 1000 * K.len)), lag: 0}); });
  stay.forEach(c => R.set(c.id, {fall: -1, lag: Math.max(0, (mx - sc(c)) / (mx - ph.T + 1) * K.step * 0.5 + (H(c.id + 'l') % 10) / 100 * K.step)}));
  // the people we follow: yours first, then the ones to watch; one strong runner who fell, if nobody we follow did
  const cast = new Set(typeof chCastAt === 'function' ? chCastAt(i) : []), cm = cmap(S), F = [];
  const why = c => isFav(c.id) ? '★ your favourite' : !MENTOR.off && mtOf(c.id) ? '◆ your apprentice' : cast.has(c.id) ? 'one to watch' : 'a surprise exit';
  P.filter(c => isFav(c.id) || (!MENTOR.off && mtOf(c.id))).concat(P.filter(c => cast.has(c.id))).forEach(c => { if(F.length < 10 && !F.includes(c)) F.push(c); });
  if(!F.some(c => c.out === i)){ const s = outs.slice().sort((a, b) => sc(b) - sc(a))[0]; if(s) F.push(s); }
  const COL = ['#72b58d', '#d9a640', '#e3889f', '#7fa6c9', '#c49ad6', '#9fc7c0', '#e0a072', '#b8c26a', '#8fb3ff', '#f0c4d8', '#d4d4d4'];
  // what happened on the way, where it happened
  const EV = S.log.filter(e => e.p === i && ['rescue', 'event', 'story', 'arc', 'bond', 'major', 'elim'].includes(e.type) && (typeof phFits !== 'function' || e.type === 'elim' || e.type === 'major' || phFits(ph.id, e.text, S.theme || 'classic')) && (e.ids || []).length)
    .map(e => { const r = R.get(e.ids[0]), start = /instructions|at the start|before the|goes pale|sets off|first step|calls .* in front of everyone|looks at the/i.test(e.text), end = /finishes|front of the pack|gets through|scrapes through|over the line|across the line|to the finish|limping/i.test(e.text);
      return {at: e.type === 'elim' && r && r.fall >= 0 ? r.fall : start ? K.len * (0.01 + (H(e.text) % 4) / 100) : end ? K.len * (0.95 + (H(e.text) % 5) / 100) : K.len * (0.06 + (H(e.text) % 85) / 100), e}; }).sort((a, b) => a.at - b.at);
  return RACE_C[i] = {key, K, P, R, F: F.map((c, j) => ({c, col: COL[j % COL.length], why: why(c), r: R.get(c.id)})), EV, dur: K.len / K.speed, after: stay.length, ex: ph.ex ? ph.ex.name : 'The examiner'};
}
const racePos = (r, h, K) => { const lead = Math.min(K.len, h * K.speed); return r.fall >= 0 ? Math.min(lead, r.fall) : Math.max(0, Math.min(K.len, lead - r.lag)); };
const raceFell = (r, h, K) => r.fall >= 0 && h * K.speed >= r.fall;
const fmtHr = h => `${Math.floor(h)}:${String(Math.round((h % 1) * 60) % 60).padStart(2, '0')}`;
function raceHtml(i){
  const X = raceRun(i); if(!X) return ''; const K = X.K, mxT = Math.ceil(X.dur * 10 + 4), tk = [0, .25, .5, .75, 1].map(f => `<span>${f ? Math.round(X.dur * f) + 'h' : K.start}</span>`).join('');
  const res = f => f.r.fall >= 0 ? ['bad', `Out at ${K.at(f.r.fall)}`] : f.r.lag < K.step * 0.08 ? ['ok', 'Through, at the front'] : ['ok', `Through, ${K.at(f.r.lag).replace(/^(km|step) /, '')}${K.u === 'm' ? '' : ' ' + K.u} behind`];
  const rows = X.F.map((f, j) => { const r = res(f); return `<div class="rc-row" style="--c:${f.col}"><b data-rcf="${j}" role="button" tabindex="0">${esc(f.c.name)}</b><span class="muted">${esc(f.why)}</span><span class="${r[0]}">${esc(r[1])}</span></div>`; }).join('');
  return `<div class="rc-box" data-rc="${i}"><div class="tv-top"><div class="section-h" style="margin:0">${esc(K.what)}</div></div>
    <div class="tv-time"><button type="button" class="btn small" data-rcplay>▶ Play</button><div class="tv-rng"><input type="range" data-rch min="0" max="${mxT}" value="${mxT}" aria-label="Hour"><div class="tv-ticks">${tk}</div></div><b data-rclab></b></div>
    <p class="tv-take" data-rctake></p><div class="rc-body"><div class="rc-cps" data-rccps></div><aside data-rcside></aside></div>
    <div class="rc-low"><div class="section-h" style="margin:0 0 6px">As it happened</div><ul class="rc-tick" data-rctick></ul></div>
    <p class="muted" style="font-size:12.5px;margin:8px 0 0">${esc(X.ex)} sets the pace and never changes it. One row per stretch: how many are on it now (gold) and how many fell there (red); the examiner’s row is marked. Click a name; drag the hours or press Play, and the events appear as the examiner passes them.</p></div>
    ${rows ? `<div class="rc-tab"><div class="section-h">The runners in this chapter</div>${rows}</div>` : ''}`;
}
const RC_SEL = {};
function raceDraw(box){
  const i = +box.dataset.rc, X = raceRun(i); if(!X) return; const K = X.K, h = +box.querySelector('[data-rch]').value / 10, lead = Math.min(K.len, h * K.speed), sel = RC_SEL[i] || 0;
  box.querySelector('[data-rclab]').textContent = `Hour ${fmtHr(h)} · ${lead >= K.len ? K.end.toLowerCase() : K.at(lead)}`;
  const N = Math.round(K.len / K.step), run = new Array(N + 1).fill(0), fell = new Array(N).fill(0); let out = 0, fallen = 0;
  X.P.forEach(c => { const r = X.R.get(c.id); if(raceFell(r, h, K)){ fell[Math.min(N - 1, Math.floor(r.fall / K.step))]++; fallen++; return; } const p = racePos(r, h, K); if(p >= K.len){ run[N]++; out++; } else run[Math.floor(p / K.step)]++; });
  const mx = Math.max(1, ...run, ...fell), ex = lead >= K.len ? -1 : Math.floor(lead / K.step);
  box.querySelector('[data-rccps]').innerHTML = run.map((n, j) => { const fs = X.F.map((f, k) => ({f, k})).filter(({f}) => { const p = racePos(f.r, h, K); return (p >= K.len ? N : Math.floor(p / K.step)) === j; });
    return `<div class="rc-cp${j === N ? ' out' : ''}${j === ex ? ' ex' : ''}"><span class="rc-n">${j === 0 ? esc(K.start) : j === N ? esc(K.end) : esc(K.seg(j * K.step))}</span>
      <span class="rc-b"><i class="r" style="width:${n / mx * 100}%"></i>${j < N ? `<i class="f" style="width:${fell[j] / mx * 100}%"></i>` : ''}</span>
      <span class="rc-c">${n ? `<b>${fmt(n)}</b> ${j === N ? 'out' : 'here'}` : ''}${j < N && fell[j] ? ` <em>· ${fell[j]} fell</em>` : ''}${j === ex ? ' <span class="rc-ex">examiner</span>' : ''}</span>
      <span class="rc-f">${fs.map(({f, k}) => { const down = raceFell(f.r, h, K); return `<button type="button" class="rc-tk${down ? ' down' : ''}${sel === k ? ' on' : ''}" style="--c:${f.col}" data-rcf="${k}">${down ? '✕ ' : ''}${esc(f.c.first || f.c.name)}</button>`; }).join('')}</span></div>`; }).join('');
  box.querySelector('[data-rctake]').innerHTML = lead >= K.len && h >= X.dur + 0.3 ? `<b>${fmt(out)}</b> made it to ${esc(K.end.toLowerCase())}. <b>${fmt(fallen)}</b> fell along the way.` : `<b>${fmt(X.P.length - fallen - out)}</b> still going · <b>${fmt(fallen)}</b> fallen · <b>${fmt(out)}</b> at ${esc(K.end.toLowerCase())}`;
  const past = X.EV.filter(x => x.at <= lead), last = past.slice(-5).reverse();
  box.querySelector('[data-rctick]').innerHTML = last.length ? last.map((x, j) => `<li class="k-${x.e.type}${j === 0 ? ' new' : ''}"><span>${esc(K.at(x.at))}</span><p>${linkNames(chTidy(x.e.text, PHASES[i]), x.e.ids || [])}</p></li>`).join('') + (past.length > 5 ? `<li class="more">${past.length - 5} earlier</li>` : '') : `<li class="more">${esc(X.ex)} sets off. Nobody knows how far it is.</li>`;
  const f = X.F[sel];
  box.querySelector('[data-rcside]').innerHTML = f ? (() => { const p = racePos(f.r, h, K), down = raceFell(f.r, h, K);
    return `<div class="tv-card" style="--c:${f.col}"><small>${esc(f.why)}</small><b>${esc(f.c.name)}</b>${f.c.nick ? `<em>“${esc(f.c.nick)}”</em>` : ''}
      <div class="tv-st"><span>At ${fmtHr(h)}</span><b>${down ? `fell at ${K.at(f.r.fall)}` : p >= K.len ? esc(K.end.toLowerCase()) : K.at(p)}</b></div>
      <div class="tv-st"><span>In the end</span><b class="${f.r.fall >= 0 ? 'bad' : 'ok'}">${f.r.fall >= 0 ? `Out at ${K.at(f.r.fall)}` : 'Through'}</b></div>${f.r.fall >= 0 && f.c.fall ? `<p>${linkNames(esc(f.c.fall), [])}</p>` : ''}<p><a data-id="${f.c.id}">Open ${esc(f.c.first || f.c.name)}’s page</a></p></div>`; })() : '';
}
document.addEventListener('input', e => { const r = e.target.closest && e.target.closest('[data-rch]'); if(r) raceDraw(r.closest('[data-rc]')); });
document.addEventListener('click', e => {
  const f = e.target.closest && e.target.closest('[data-rcf]'); if(f){ const box = f.closest('[data-rc]') || document.querySelector('[data-rc]'); if(!box) return; RC_SEL[+box.dataset.rc] = +f.dataset.rcf; raceDraw(box); if(!f.closest('[data-rc]')) box.scrollIntoView({behavior: 'smooth', block: 'start'}); return; }
  const pl = e.target.closest && e.target.closest('[data-rcplay]'); if(!pl) return; const box = pl.closest('[data-rc]'), r = box.querySelector('[data-rch]'), mx = +r.max;
  if(box._tm){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; return; }
  if(+r.value >= mx) r.value = 0; pl.textContent = '❚❚ Pause';
  box._tm = setInterval(() => { if(!box.isConnected){ clearInterval(box._tm); return; } r.value = Math.min(mx, +r.value + Math.max(1, Math.round(mx / 80))); raceDraw(box); if(+r.value >= mx){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; } }, 110);
});
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if(n.nodeType !== 1) return; (n.matches && n.matches('[data-rc]') ? [n] : [...(n.querySelectorAll ? n.querySelectorAll('[data-rc]') : [])]).forEach(b => { if(!b.dataset.drawn){ b.dataset.drawn = 1; raceDraw(b); } }); }))).observe(document.body, {childList: true, subtree: true});
