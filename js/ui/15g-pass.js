/* ===================== THE KITCHEN (Cooking Trial and the Egg Retrieval after it; the Golden Banquet): the path of every dish ===================== */
// Three columns joined by bands: what was served, the examiner's verdict, and, for the rejected, the ravine. The colours are
// the reasons. Verdicts, reasons and who went out are the real ones; only the order of the tasting is drawn from a hash.
const PASS = {
  cooking: {first: 'The kitchen', served: 'dishes served', ok: 'Approved', bad: 'Rejected', verb: 'tastes', what: 'The pass', item: 'dish', doing: 'Tasting', notYet: 'Not tasted yet'},
  banquet: {first: 'The high table', served: 'guests at the table', ok: 'Passed', bad: 'Sent away', verb: 'watches the table', what: 'The banquet', item: 'guest', doing: 'At the table', notYet: 'Not judged yet'}
};
const PASS_RC = ['#e07a5f', '#c9a227', '#9b6bc2', '#5fa8d3'];
// the trial this page belongs to: the Egg Retrieval shows the kitchen it came from
function passOf(i){ const ph = PHASES[i]; if(!ph) return null;
  if(ph.id === 'egg' && PHASES[i - 1] && PHASES[i - 1].id === 'cooking') i = i - 1;
  const p = PHASES[i]; return p && PASS[p.id] && S.stats.find(s => s.p === i) ? i : null; }
const PASS_C = {};
function passRun(i0){
  const i = passOf(i0); if(i == null) return null; const key = S.edition + ':' + i + ':' + S.log.length; if(PASS_C[i] && PASS_C[i].key === key) return PASS_C[i];
  const ph = PHASES[i], K = PASS[ph.id], eg = PHASES[i + 1] && PHASES[i + 1].id === 'egg' ? PHASES[i + 1] : null, egDone = eg && S.stats.find(s => s.p === i + 1), H = s => nhashUI(S.seed + ':ps:' + i + ':' + s);
  const P = S.candidates.filter(c => (c.out == null || c.out >= i) && typeof c.scores[ph.id] === 'number');
  const R1 = Object.values(ph.fail || {}), R2 = eg ? Object.values(eg.fail || {}) : [], cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const why1 = c => Math.max(0, R1.indexOf(ph.fail[weakest(c, ph.w)]));
  const why2 = c => { const r = clean(c.reason || '').replace(/^[^:]+:\s*/, '').replace(/, missing the cut by a hair$/, ''), k = R2.findIndex(x => r.startsWith(x)); return k >= 0 ? k : Math.max(0, R2.indexOf(eg.fail[weakest(c, eg.w)])); };
  const rows = P.map(c => { const rej = eg ? (typeof c.scores[eg.id] === 'number' || (c.notes || []).some(n => n.p === i && /Dish rejected/.test(n.text)) || c.out === i) : c.out === i;
    const jumped = rej && eg && egDone && typeof c.scores[eg.id] === 'number', outE = jumped && c.out === i + 1;
    return {c, rej, r1: rej ? why1(c) : -1, t1: 0.04 + (H(c.id) % 1000) / 1000 * 0.92, t2: jumped ? 1.1 + (H(c.id + 'e') % 1000) / 1000 * 0.85 : null, outE, r2: outE ? why2(c) : -1}; });
  const cast = new Set(typeof chCastAt === 'function' ? chCastAt(i) : []), F = [];
  rows.filter(r => isFav(r.c.id) || (!MENTOR.off && mtOf(r.c.id))).concat(rows.filter(r => cast.has(r.c.id))).forEach(r => { if(F.length < 12 && !F.includes(r)) F.push(r); });
  const lost = rows.filter(r => r.outE || (!eg && r.rej)); if(!F.some(r => lost.includes(r))){ const s = lost.slice().sort((a, b) => b.c.scores[ph.id] - a.c.scores[ph.id])[0]; if(s) F.push(s); }
  const COL = ['#72b58d', '#d9a640', '#e3889f', '#7fa6c9', '#c49ad6', '#9fc7c0', '#e0a072', '#b8c26a', '#8fb3ff', '#f0c4d8', '#d4d4d4', '#a0d0a0', '#e8b4b4'];
  const fits = e => typeof phFits !== 'function' || ['elim', 'major'].includes(e.type) || phFits(PHASES[e.p].id, e.text, S.theme || 'classic');
  const EV = S.log.filter(e => (e.p === i || (egDone && e.p === i + 1)) && ['rescue', 'event', 'story', 'arc', 'bond', 'major', 'elim'].includes(e.type) && fits(e) && ((e.ids || []).length || /intervenes/.test(e.text)))
    .map(e => { const b = e.p - i, start = /goes pale|at the start|before the|stands at the edge|ties a second|looks at the/i.test(e.text), end = /first|scrapes|easy|watching|finishes|by almost nothing|name for|waking up/i.test(e.text);
      return {t: /intervenes/.test(e.text) ? 1 : b + (start ? 0.05 : end ? 0.95 : 0.1 + (H(e.text) % 1000) / 1000 * 0.8), e}; }).sort((a, b) => a.t - b.t);
  return PASS_C[i] = {key, i, K, ph, eg: egDone ? eg : null, egNext: eg && !egDone, rows, R1: R1.map(cap), R2: R2.map(cap), F: F.map((r, j) => ({r, col: COL[j % COL.length]})), EV, ex: ph.ex ? ph.ex.name : 'The examiner', end: egDone ? 2 : 1};
}
function passHtml(i){
  const X = passRun(i); if(!X) return ''; const mx = X.end * 100;
  const ticks = X.eg ? '<span>First dish</span><span>Last dish</span><span>The ravine</span><span>Done</span>' : `<span>First ${X.K.item}</span><span></span><span>Last ${X.K.item}</span>`;
  return `<div class="rc-box ps-box" data-ps="${X.i}"><div class="tv-top"><div class="section-h" style="margin:0">${esc(X.K.what)}</div></div>
    <div class="tv-time"><button type="button" class="btn small" data-psplay>▶ Play</button><div class="tv-rng"><input type="range" data-psh min="0" max="${mx}" value="${mx}" aria-label="Progress"><div class="tv-ticks">${ticks}</div></div><b data-pslab></b></div>
    <p class="tv-take" data-pstake></p><div data-pssvg></div><div class="pass-legend" data-psleg></div><div class="pass-who" data-pswho></div>
    <div class="rc-low"><div class="section-h" style="margin:0 0 6px">As it happened</div><ul class="rc-tick" data-pstick></ul></div>
    <p class="muted" style="font-size:12.5px;margin:8px 0 0">Every ${X.K.item} goes from ${esc(X.K.first.toLowerCase())} to the examiner’s verdict${X.eg ? '; the rejected go on to the ravine for a second chance' : ''}. The colours are the reasons. Press Play${X.eg ? ': first the tasting, then the Chairman steps in, then the jumps' : ''}. Click a name to open their page.</p></div>`;
}
function passDraw(box){
  const X = passRun(+box.dataset.ps); if(!X) return; const t = +box.querySelector('[data-psh]').value / 100, n = X.rows.length, W = 1000, Hh = 300;
  let tasted = 0, ok = 0, jumped = 0, egg = 0; const rej = X.R1.map(() => 0), lost = X.R2.map(() => 0);
  X.rows.forEach(r => { if(r.t1 <= t){ tasted++; if(r.rej) rej[r.r1]++; else ok++; } if(r.t2 != null && r.t2 <= t){ jumped++; if(r.outE) lost[r.r2]++; else egg++; } });
  const rejN = rej.reduce((a, b) => a + b, 0), lostN = lost.reduce((a, b) => a + b, 0), allRej = X.rows.filter(r => r.rej).length;
  box.querySelector('[data-pslab]').textContent = t < 1 ? `${X.K.doing} · ${X.K.item} ${Math.max(1, Math.min(n, Math.round(t * n)))} of ${fmt(n)}` : t < 1.08 && X.eg ? 'The Chairman steps in' : X.eg ? `The ravine · ${Math.min(100, Math.round((t - 1) / 0.95 * 100))}% have jumped` : 'Done';
  const y = v => v / Math.max(1, n) * (Hh - 40), c1 = {x: 20, w: 150}, c2 = {x: X.eg || X.egNext ? 410 : 560, w: 170}, c3 = {x: 820, w: 160}, okH = y(ok), rejH = y(rejN), egH = y(egg), loH = y(lostN);
  const band = (x1, y1, h1, x2, y2, cl) => h1 > 0.5 ? `<path d="M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2} L${x2},${y2 + h1} C${(x1 + x2) / 2},${y2 + h1} ${(x1 + x2) / 2},${y1 + h1} ${x1},${y1 + h1} Z" fill="${cl}" opacity=".28"/>` : '';
  let s = `<svg viewBox="0 0 ${W} ${Hh + 40}" class="pass-svg" role="img" aria-label="${esc(X.K.what)}">`;
  s += `<rect x="${c1.x}" y="20" width="${c1.w}" height="${y(n)}" class="blk"/><text x="${c1.x + 8}" y="40" class="bl">${esc(X.K.first)}</text><text x="${c1.x + 8}" y="66" class="bn">${fmt(n)}</text><text x="${c1.x + 8}" y="84" class="bs">${esc(X.K.served)}</text>`;
  s += band(c1.x + c1.w, 20, okH, c2.x, 20, 'var(--green)') + band(c1.x + c1.w, 20 + okH, rejH, c2.x, 40 + okH, 'var(--red)');
  s += `<rect x="${c2.x}" y="20" width="${c2.w}" height="${Math.max(1, okH)}" class="ok"/><text x="${c2.x + 8}" y="38" class="bl">${esc(X.K.ok)}</text><text x="${c2.x + c2.w - 8}" y="38" class="bn2" text-anchor="end">${fmt(ok)}</text>`;
  let yy = 40 + okH; rej.forEach((v, k) => { const h = y(v); if(h > 0) s += `<rect x="${c2.x}" y="${yy}" width="${c2.w}" height="${h}" fill="${PASS_RC[k % 4]}" opacity=".85"/>`; yy += h; });
  const ry = rejH >= 20 ? 56 + okH : 40 + okH + Math.max(1, rejH) + 15;   // a thin band: the label goes under it
  s += `<text x="${c2.x + 8}" y="${ry}" class="bl">${esc(X.K.bad)}</text><text x="${c2.x + c2.w - 8}" y="${ry}" class="${rejH >= 20 ? 'bn2' : 'bn2l'}" text-anchor="end">${fmt(rejN)}</text>`;
  if(X.eg){
    s += band(c2.x + c2.w, 40 + okH, egH, c3.x, 20, 'var(--green)') + band(c2.x + c2.w, 40 + okH + egH, loH, c3.x, 40 + egH, 'var(--red)');
    s += `<rect x="${c3.x}" y="20" width="${c3.w}" height="${Math.max(1, egH)}" class="ok"/><text x="${c3.x + 8}" y="38" class="bl">Got an egg</text><text x="${c3.x + c3.w - 8}" y="38" class="bn2" text-anchor="end">${fmt(egg)}</text>`;
    yy = 40 + egH; lost.forEach((v, k) => { const h = y(v); if(h > 0) s += `<rect x="${c3.x}" y="${yy}" width="${c3.w}" height="${h}" fill="${PASS_RC[k % 4]}" opacity=".85"/>`; yy += h; });
    const oy = loH >= 20 ? 56 + egH : 40 + egH + Math.max(1, loH) + 15;
    s += `<text x="${c3.x + 8}" y="${oy}" class="bl">Out</text><text x="${c3.x + c3.w - 8}" y="${oy}" class="${loH >= 20 ? 'bn2' : 'bn2l'}" text-anchor="end">${fmt(lostN)}</text>`;
    s += `<text x="${(c2.x + c2.w + c3.x) / 2}" y="${Hh + 30}" class="cap" text-anchor="middle">the rejected jump for an egg</text>`;
  } else if(X.egNext) s += `<text x="${c3.x}" y="${60 + okH}" class="bs">the ravine is next</text>`;
  s += `<text x="${(c1.x + c1.w + c2.x) / 2}" y="${Hh + 30}" class="cap" text-anchor="middle">${esc(X.ex)} ${esc(X.K.verb)}</text></svg>`;
  box.querySelector('[data-pssvg]').innerHTML = s;
  const why = (L, arr) => L.map((l, k) => arr[k] ? `<span><i style="background:${PASS_RC[k % 4]}"></i>${fmt(arr[k])} ${esc(l.toLowerCase())}</span>` : '').join('');
  box.querySelector('[data-psleg]').innerHTML = `<div><b>Why ${X.eg || X.egNext ? 'the dishes were rejected' : 'they were sent away'}</b>${why(X.R1, rej) || '<span class="muted">nothing yet</span>'}</div>${X.eg ? `<div><b>Why the jumps failed</b>${why(X.R2, lost) || '<span class="muted">nobody has jumped yet</span>'}</div>` : ''}`;
  const chips = f => X.F.filter(x => f(x.r)).map(x => `<a class="rc-tk${x.r.outE || (!X.eg && x.r.rej && x.r.t1 <= t) ? ' down' : ''}" style="--c:${x.col}" data-id="${x.r.c.id}">${esc(x.r.c.first || x.r.c.name)}</a>`).join('');
  const G = [[X.K.ok, r => r.t1 <= t && !r.rej]].concat(X.eg ? [['Rejected, waiting for the ravine', r => r.t1 <= t && r.rej && !(r.t2 != null && r.t2 <= t)], ['Got an egg', r => r.rej && r.t2 != null && r.t2 <= t && !r.outE], ['Out', r => r.outE && r.t2 <= t]] : [[X.K.bad, r => r.t1 <= t && r.rej]]).concat([[X.K.notYet, r => r.t1 > t]]);
  box.querySelector('[data-pswho]').innerHTML = G.map(([l, f]) => { const x = chips(f); return x ? `<div><small>${esc(l)}</small>${x}</div>` : ''; }).join('');
  box.querySelector('[data-pstake]').innerHTML = t >= X.end ? (X.eg ? `<b>${fmt(ok + egg)}</b> go on: <b>${fmt(ok)}</b> on their cooking, <b>${fmt(egg)}</b> on an egg. <b>${fmt(lostN)}</b> out.` : `<b>${fmt(ok)}</b> ${esc(X.K.ok.toLowerCase())}, <b>${fmt(rejN)}</b> ${esc(X.K.bad.toLowerCase())}.${X.egNext ? ' The rejected will get one more chance.' : ''}`)
    : t < 1 ? `<b>${fmt(tasted)}</b> of ${fmt(n)} · <b>${fmt(ok)}</b> ${esc(X.K.ok.toLowerCase())} · <b>${fmt(rejN)}</b> ${esc(X.K.bad.toLowerCase())}` : `The Chairman: the rejected get a second chance. <b>${fmt(jumped)}</b> of ${fmt(allRej)} have jumped · <b>${fmt(egg)}</b> came back with an egg`;
  const past = X.EV.filter(x => x.t <= t), last = past.slice(-5).reverse();
  box.querySelector('[data-pstick]').innerHTML = last.length ? last.map((x, j) => `<li class="k-${x.e.type}${j === 0 ? ' new' : ''}"><span>${x.t < 1 ? (X.ph.id === 'banquet' ? 'the table' : 'kitchen') : 'ravine'}</span><p>${linkNames(chTidy(x.e.text, PHASES[x.e.p]), x.e.ids || [])}</p></li>`).join('') + (past.length > 5 ? `<li class="more">${past.length - 5} earlier</li>` : '') : `<li class="more">${esc(X.ex)} lifts the lid on the first ${X.K.item}.</li>`;
}
const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);
document.addEventListener('input', e => { const r = e.target.closest && e.target.closest('[data-psh]'); if(r) passDraw(r.closest('[data-ps]')); });
document.addEventListener('click', e => { const pl = e.target.closest && e.target.closest('[data-psplay]'); if(!pl) return; const box = pl.closest('[data-ps]'), r = box.querySelector('[data-psh]'), mx = +r.max;
  if(box._tm){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; return; }
  if(+r.value >= mx) r.value = 0; pl.textContent = '❚❚ Pause';
  box._tm = setInterval(() => { if(!box.isConnected){ clearInterval(box._tm); return; } r.value = Math.min(mx, +r.value + 2); passDraw(box); if(+r.value >= mx){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; } }, 90); });
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if(n.nodeType !== 1) return; (n.matches && n.matches('[data-ps]') ? [n] : [...(n.querySelectorAll ? n.querySelectorAll('[data-ps]') : [])]).forEach(b => { if(!b.dataset.drawn){ b.dataset.drawn = 1; passDraw(b); } }); }))).observe(document.body, {childList: true, subtree: true});
