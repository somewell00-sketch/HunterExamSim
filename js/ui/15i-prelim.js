/* ===================== PRELIMINARIES: the voyage, the night line, the old woman's question, the two forks ===================== */
// One drawing for each preliminary, with Play, cards for each way out and the people this chapter follows.
// Who made it and how each one failed are the real ones (the recorded cause); when it happened and where comes from the results
// and a seeded hash, so old saves draw too and the save does not grow.
const PREL = {
  sea: {title: 'The voyage', dur: 72, start: 6, day: true, ride: true, ok: 'Reached Dolle Harbor', still: 'still aboard',
    ways: {endurance: ['seasick', 'Left at the first port', 14], teamwork: ['crew', 'Left on the dock', 14], courage: ['storm', 'Put ashore after the storm', 44]},
    ticks: ['Day 1', 'Day 2', 'Day 3', 'Dolle'], idle: X => `${X.ex} rings the ship’s bell.`,
    note: 'The route of the ship: people go ashore at the port that matches how they failed. Press Play and the ship sails.'},
  nighttrain: {title: 'The night line', dur: 10, start: 21, ride: true, ok: 'Off at the terminus', still: 'still on the train',
    ways: {perception: ['cond', 'Put off at Marrow Halt', 2.6], strategy: ['cards', 'Put off at Ashby Junction', 5.0], courage: ['bandit', 'Jumped off in the dark', 7.0]},
    ticks: ['9 pm', 'midnight', '3 am', 'dawn'], idle: X => `${X.ex} punches the first ticket.`,
    note: 'One carriage for each test, in the order they happen. The lit carriage is the one happening now; the stations show who was put off there.'},
  quiz: {title: 'The old woman’s question', dur: 10, start: 8, ok: 'Kept silent', still: 'still in line',
    ways: {intelligence: ['answer', 'Gave an answer'], perception: ['spoke', 'Broke the silence']},
    ticks: ['8 am', 'noon', '3 pm', 'dusk'], idle: () => 'The old woman waits at the fork in the road.',
    note: 'One question at the door, and the only right answer is silence. The cards count the answers as the line goes through.'},
  disguise: {title: 'Two guides, one face', dur: 10, start: 9, ok: 'Reached the exam site', still: 'still in the forest',
    ways: {perception: ['kiriko', 'Trusted the fake guide'], intelligence: ['twins', 'Led astray by a twin']},
    ticks: ['9 am', 'noon', '3 pm', 'dusk'], idle: () => 'Two guides wait at the forest edge, wearing the same face.',
    note: 'Two forks in the forest. The thicker the path, the more people took it. The dots are the people this chapter follows.'}
};
const prelOf = i => { const ph = PHASES[i]; return ph && PREL[ph.id] && S.stats.find(s => s.p === i) ? PREL[ph.id] : null; };
const PREL_C = {};
function prelRun(i){
  const K = prelOf(i); if(!K) return null; const key = S.edition + ':' + i + ':' + S.log.length; if(PREL_C[i] && PREL_C[i].key === key) return PREL_C[i];
  const ph = PHASES[i], F0 = ph.fail || {}, H = s => nhashUI(S.seed + ':pr:' + i + ':' + s), dur = K.dur;
  const P = S.candidates.filter(c => (c.out == null || c.out >= i) && (typeof c.scores[ph.id] === 'number' || c.out === i));
  // the way out: the recorded cause, matched against this trial's own failures; anything else (disqualified, died) gets its own card
  const kindOf = c => { if(c.out !== i) return '_ok'; if(c.status === 'Disqualified') return '_dq'; if(c.status === 'Deceased') return '_dead';
    const r = clean(c.reason || '').replace(/^[^:]+:\s*/, ''), a = Object.keys(F0).find(a => r.startsWith(String(F0[a]).split('{')[0].trim())) || (K.ways[weakest(c, ph.w)] ? weakest(c, ph.w) : Object.keys(K.ways)[0]);
    return (K.ways[a] || Object.values(K.ways)[0])[0]; };
  const R = new Map();
  P.forEach(c => { const h = H(c.id), k = kindOf(c), w = Object.values(K.ways).find(w => w[0] === k), r = {c, k};
    if(K.ride) r.t = k === '_ok' ? dur * 0.97 : (w ? w[2] : dur * 0.8) + (h % 100) / 100 * (k === 'bandit' ? 1.4 : 0.3);
    else if(ph.id === 'quiz') r.t = 0.4 + (h % 1000) / 1000 * (dur - 1.2);   // in line in waves; the answer is given at the door
    else { r.t1 = 0.6 + (h % 1000) / 1000 * 3.6; r.t2 = r.t1 + 1.4 + ((h >> 6) % 1000) / 1000 * 3.2; r.t = k === 'kiriko' ? r.t1 : Math.min(dur * 0.98, r.t2 + (k === '_ok' ? 1.2 : 0)); }
    R.set(c.id, r); });
  const rows = [...R.values()], ways = Object.values(K.ways).map(w => ({k: w[0], l: w[1]})).concat([{k: '_dq', l: 'Disqualified'}, {k: '_dead', l: 'Did not survive'}]);
  const cards = [{k: '_ok', l: K.ok, ok: true, n: rows.filter(r => r.k === '_ok').length}].concat(ways.map(w => { const of = rows.filter(r => r.k === w.k), e = of.find(r => r.c.fall);
    return {k: w.k, l: w.l, n: of.length, eg: e ? e.c.fall.split(/(?<=[.!?])\s/)[0] : '', egId: e ? e.c.id : ''}; }).filter(c => c.n));
  const cast = new Set(typeof chCastAt === 'function' ? chCastAt(i) : []), F = [];
  P.filter(c => isFav(c.id) || (!MENTOR.off && mtOf(c.id))).concat(P.filter(c => cast.has(c.id))).forEach(c => { if(F.length < 10 && !F.includes(c)) F.push(c); });
  if(!F.some(c => c.out === i)){ const s = P.filter(c => c.out === i).sort((a, b) => (b.scores[ph.id] || 0) - (a.scores[ph.id] || 0))[0]; if(s) F.push(s); }
  const COL = ['#72b58d', '#d9a640', '#e3889f', '#7fa6c9', '#c49ad6', '#9fc7c0', '#e0a072', '#b8c26a', '#8fb3ff', '#f0c4d8', '#d4d4d4'];
  const EV = S.log.filter(e => e.p === i && ['rescue', 'help', 'event', 'story', 'arc', 'bond', 'major', 'elim'].includes(e.type) && (typeof phFits !== 'function' || ['elim', 'major'].includes(e.type) || phFits(ph.id, e.text, S.theme || 'classic')) && (e.ids || []).length)
    .map(e => ({t: e.type === 'elim' && R.has(e.ids[0]) ? R.get(e.ids[0]).t : /^First through|finishes|scrapes through/.test(e.text) ? dur * (0.9 + (H(e.text) % 6) / 100)
      : /goes pale|at the start|instructions|introduces|counts the/.test(e.text) ? 0.1 + (H(e.text) % 30) / 100 : /feels like home|designed for/.test(e.text) ? dur * 0.25 + (H(e.text) % 100) / 100 : 0.5 + (H(e.text) % 1000) / 1000 * dur * 0.9, e})).sort((a, b) => a.t - b.t);
  return PREL_C[i] = {key, i, K, R, rows, cards, F: F.map((c, j) => ({c, col: COL[j % COL.length]})), EV, n: P.length, after: rows.filter(r => r.k === '_ok').length, ex: ph.ex ? ph.ex.name : 'The examiner'};
}
const prelClock = (X, h) => { const t = X.K.start + h; if(X.K.day){ const d = Math.floor(t / 24) + 1, hh = Math.floor(t % 24); return `Day ${d} · ${hh % 12 || 12} ${hh >= 12 ? 'pm' : 'am'}`; }
  const tt = t % 24, hh = Math.floor(tt), m = Math.round((tt % 1) * 60) % 60; return `${hh % 12 || 12}:${String(m).padStart(2, '0')} ${hh >= 12 ? 'pm' : 'am'}`; };
const prelChip = (f, mark) => `<a class="rc-tk${mark === '✕' ? ' down' : ''}" style="--c:${f.col}" data-id="${f.c.id}">${mark ? mark + ' ' : ''}${esc(f.c.first || f.c.name)}</a>`;
function prelCards(X, h){
  const cnt = {}; X.rows.forEach(r => { if(r.t <= h) cnt[r.k] = (cnt[r.k] || 0) + 1; });
  const done = Object.values(cnt).reduce((a, b) => a + b, 0), still = X.n - done, mxBad = Math.max(1, ...X.cards.filter(c => !c.ok).map(c => c.n));
  const ch = k => X.F.filter(f => X.R.get(f.c.id).k === k && X.R.get(f.c.id).t <= h).map(f => prelChip(f, k === '_ok' ? '✓' : '✕')).join('');
  const bad = c => { const n = cnt[c.k] || 0; return `<div class="hb-card bad"><b>${fmt(n)}</b><span>${esc(c.l)}</span><i class="hb-bar"><i style="width:${n / mxBad * 100}%"></i></i>${c.eg ? `<small>${linkNames(c.eg, [c.egId])}</small>` : ''}${ch(c.k) ? `<div class="hb-f">${ch(c.k)}</div>` : ''}</div>`; };
  let first;
  if(X.K.ride){   // a journey has two states only: still aboard (which becomes "arrived" at the end of the line) or left on the way
    const on = X.n - (done - (cnt._ok || 0)), end = (cnt._ok || 0) > 0, mine = X.F.filter(f => { const r = X.R.get(f.c.id); return !(r.k !== '_ok' && r.t <= h); }).map(f => prelChip(f, end ? '✓' : '')).join('');
    first = `<div class="hb-card ${end ? 'ok' : 'still'}"><b>${fmt(on)}</b><span>${esc(end ? X.K.ok : X.K.still)}</span><i class="hb-bar"><i style="width:${on / Math.max(1, X.n) * 100}%"></i></i>${mine ? `<div class="hb-f">${mine}</div>` : ''}</div>`;
  } else {
    const wait = X.F.filter(f => X.R.get(f.c.id).t > h).map(f => prelChip(f)).join(''), okc = X.cards[0], n = cnt._ok || 0;
    first = (X.K.ride || X.i == null || PHASES[X.i].id === 'quiz' ? '' : `<div class="hb-card still"><b>${fmt(still)}</b><span>${esc(X.K.still)}</span>${wait ? `<div class="hb-f">${wait}</div>` : ''}</div>`)
      + `<div class="hb-card ok"><b>${fmt(n)}</b><span>${esc(okc.l)}</span><i class="hb-bar"><i style="width:${n / Math.max(1, okc.n) * 100}%"></i></i>${ch('_ok') ? `<div class="hb-f">${ch('_ok')}</div>` : ''}</div>`;
  }
  return {cnt, done, still, html: first + X.cards.filter(c => !c.ok).map(bad).join('')};
}
// on a phone the drawing scrolls inside its frame, and keeps the ship (or the train) in view
const prelFollow = (box, x) => { const v = box.querySelector('.pv-art'); if(v && v.scrollWidth > v.clientWidth + 4) v.scrollLeft = x / 1000 * v.scrollWidth - v.clientWidth / 2; };

/* ---------- the drawings ---------- */
const PV_SEA = 'M70,250 C170,250 210,150 300,140 S420,170 470,210 S600,300 690,250 S820,120 930,140';
const PV_TR = [['Departure', 0], ['Marrow Halt', 2.6], ['Ashby Junction', 5.0], ['Terminus', 9.7]], pvTx = t => 60 + 880 * Math.min(1, t / 9.7);
const PV_ART = {
  sea: () => `<svg class="pv-chart pv-sea" viewBox="0 0 1000 330" role="img" aria-label="The route of the ship">
    <rect class="paper" width="1000" height="330"/><g class="waves">${Array.from({length: 14}, (_, i) => `<path d="M${(i * 83) % 1000},${40 + (i * 57) % 260} q10,-7 20,0 t20,0"/>`).join('')}</g>
    <g class="land"><path d="M0,200 C30,190 50,230 40,330 L0,330 Z"/><path d="M270,95 C300,70 350,80 360,105 C345,120 300,125 270,95 Z"/><path d="M640,290 C680,270 740,285 760,330 L630,330 Z"/><path d="M960,80 C940,120 950,170 1000,190 L1000,60 Z"/></g>
    <path data-route class="route" d="${PV_SEA}"/>
    <g data-storm class="storm"><path d="M500,95 c-30,0 -40,-35 -10,-40 c5,-25 45,-30 55,-8 c25,-10 45,10 35,30 c20,5 15,25 -5,25 Z"/><path class="bolt" d="M515,98 l-12,28 h12 l-10,26"/><path class="bolt" d="M548,98 l-8,22 h10 l-8,20"/><text x="520" y="40">The storm</text></g>
    <g class="port"><circle cx="70" cy="250" r="7"/><text x="62" y="282">Whale Island</text><text class="sub" x="62" y="298">Day 1, dawn</text></g>
    <g class="port"><circle cx="300" cy="140" r="7"/><text x="282" y="72">First port</text><text data-n="1" class="cnt" x="300" y="186" text-anchor="middle"></text></g>
    <g class="port"><circle cx="690" cy="250" r="7"/><text x="660" y="234">Storm Cove</text><text data-n="2" class="cnt" x="700" y="275"></text></g>
    <g class="port end"><circle cx="930" cy="140" r="8"/><text x="880" y="118">Dolle Harbor</text><text data-n="3" class="cnt" x="870" y="172"></text></g>
    <path data-wake class="wake" d="${PV_SEA}"/>
    <g data-ship class="ship"><path d="M-22,-2 L22,-2 L14,10 L-14,10 Z"/><path class="sail" d="M0,-4 L0,-34 L18,-8 Z"/><path class="sail" d="M-3,-4 L-3,-28 L-18,-8 Z"/></g>
    <text data-deck class="deck" x="500" y="318"></text>
    <g class="rose" transform="translate(940,275)"><circle r="22"/><path d="M0,-28 L5,0 L0,28 L-5,0 Z"/><text y="-32" text-anchor="middle">N</text></g></svg>`,
  nighttrain: () => `<svg class="pv-chart pv-rail" viewBox="0 110 1000 180" role="img" aria-label="The line of the night train">
    <rect class="sky" y="110" width="1000" height="180"/><g class="stars">${Array.from({length: 30}, (_, i) => `<circle cx="${(i * 97) % 1000}" cy="${(i * 53) % 60 + 118}" r="${i % 3 ? 1 : 1.6}"/>`).join('')}</g>
    <path class="hills" d="M0,200 C120,150 200,180 300,160 S480,120 560,170 S760,140 840,165 S960,150 1000,160 L1000,290 L0,290 Z"/>
    <line class="rails" x1="60" y1="216" x2="940" y2="216"/><line class="ties" x1="60" y1="220" x2="940" y2="220"/>
    ${PV_TR.map(([n, t], j) => `<g class="stn${j === 3 ? ' end' : ''}"><rect x="${pvTx(t) - 4}" y="196" width="8" height="24"/><text x="${pvTx(t)}" y="250" text-anchor="middle">${n}</text>${j ? `<text data-n="${j}" class="cnt" x="${pvTx(t)}" y="268" text-anchor="middle"></text>` : ''}</g>`).join('')}
    <g data-jumps class="jumps"></g><g data-bandits class="bnd"><text x="${pvTx(7.3)}" y="160" text-anchor="middle">bandits on the roof</text></g>
    <g data-train>
      ${[['1', -60], ['2', -118], ['↑', -176]].map(([l, x]) => `<g class="car" transform="translate(${x},0)"><rect x="-26" y="180" width="52" height="30" rx="3"/><text x="0" y="200" text-anchor="middle">${l}</text></g>`).join('')}
      <g class="eng"><path d="M-30,180 h34 l14,12 v18 h-48 Z"/><rect x="-24" y="166" width="10" height="14"/><circle class="lamp" cx="18" cy="198" r="3"/></g>
      <g class="wheels">${[-196, -156, -138, -98, -80, -40, -22, 6].map(x => `<circle cx="${x}" cy="212" r="4"/>`).join('')}</g></g></svg>`,
  quiz: X => `<div class="pv-qz"><div class="pv-qw"><svg viewBox="0 0 90 110" aria-hidden="true"><circle cx="45" cy="30" r="18"/><path d="M15,108 C15,70 30,55 45,55 C60,55 75,70 75,108 Z"/><path class="cane" d="M78,50 V108"/></svg><small>${esc(X.ex)}<br>as the old woman</small></div>
    <div class="pv-qb"><p>“Bandits have taken your mother and the one you love. You can save only one. Answer <b>1</b> for your mother, <b>2</b> for the one you love.”</p><div class="pv-qt" data-tally></div></div></div><div class="pv-line" data-line></div>`,
  disguise: () => `<svg class="pv-chart pv-wood" viewBox="0 0 1000 330" role="img" aria-label="The forest paths">
    <rect class="paper" width="1000" height="330"/><g class="trees">${Array.from({length: 46}, (_, i) => { const x = (i * 211) % 1000, y = (i * 89) % 330; return (Math.abs(y - 170) < 30 && x < 600) || (y < 90 && x > 300 && x < 520) ? '' : `<path d="M${x},${y} l-9,18 h18 Z"/>`; }).join('')}</g>
    <path data-p="0" class="pth" d="M60,170 L300,170"/><path data-p="K" class="pth bad" d="M300,170 C340,120 380,62 480,60"/><path data-p="A" class="pth" d="M300,170 C400,175 480,195 560,200"/>
    <path data-p="T" class="pth bad" d="M560,200 C640,230 700,290 780,290"/><path data-p="S" class="pth" d="M560,200 C680,190 800,160 920,150"/>
    <g class="node"><circle cx="60" cy="170" r="9"/><text x="40" y="200">Forest edge</text><text data-n="1" class="cnt" x="40" y="216"></text></g>
    <g class="fork"><circle cx="300" cy="170" r="13"/><text x="250" y="210">Fork 1 · the guide</text><text class="sub" x="250" y="226">human, or a Kiriko?</text></g>
    <g class="fork"><circle cx="560" cy="200" r="13"/><text x="520" y="240">Fork 2 · the twins</text><text class="sub" x="520" y="256">which one is real?</text><text data-n="2" class="cnt" x="410" y="262" text-anchor="middle"></text></g>
    <g class="node bad"><circle cx="480" cy="60" r="9"/><text x="500" y="56">The Kiriko’s nest</text><text data-n="K" class="cnt" x="500" y="74"></text></g>
    <g class="node bad"><circle cx="780" cy="290" r="9"/><text x="800" y="288">Walking in circles</text><text data-n="T" class="cnt" x="800" y="306"></text></g>
    <g class="node end"><circle cx="920" cy="150" r="11"/><text x="850" y="125">Exam site</text><text data-n="S" class="cnt" x="850" y="185"></text></g>
    <g class="masks"><g transform="translate(300,128)"><ellipse rx="11" ry="13"/><circle cx="-4" cy="-2" r="2"/><circle cx="4" cy="-2" r="2"/></g><g transform="translate(560,160)"><ellipse cx="-9" rx="9" ry="11"/><ellipse cx="11" rx="9" ry="11"/></g></g>
    <g data-who class="who"></g></svg>`
};
function prelHtml(i){
  const X = prelRun(i); if(!X) return ''; const K = X.K;
  return `<div class="rc-box pv-box" data-pv="${i}"><div class="tv-top"><div class="section-h" style="margin:0">${esc(K.title)}</div></div>
    <div class="tv-time"><button type="button" class="btn small" data-pvplay>▶ Play</button><div class="tv-rng"><input type="range" data-pvh min="0" max="200" value="0" aria-label="Time"><div class="tv-ticks">${K.ticks.map(t => `<span>${t}</span>`).join('')}</div></div><b data-pvlab></b></div>
    <p class="tv-take" data-pvtake></p>${PHASES[i].id === 'nighttrain' ? '<p class="pv-now" data-pvnow></p>' : ''}<div class="pv-art">${PV_ART[PHASES[i].id](X)}</div><div class="hb-cards pv-cards" data-pvcards></div>
    <div class="rc-low"><div class="section-h" style="margin:0 0 6px">As it happened</div><ul class="rc-tick" data-pvtick></ul></div>
    <p class="muted" style="font-size:12.5px;margin:8px 0 0">${esc(K.note)} The names are the people this chapter follows: ✓ made it, ✕ did not; click one to open their page.</p></div>`;
}
function prelDraw(box){
  const X = prelRun(+box.dataset.pv); if(!X) return; const id = PHASES[X.i].id, h = +box.querySelector('[data-pvh]').value / 200 * X.K.dur, svg = box.querySelector('svg'), C = prelCards(X, h);
  const n = k => C.cnt[k] || 0, txt = (sel, t) => { const e = box.querySelector(sel); if(e) e.textContent = t; }, end = h >= X.K.dur * 0.97;
  box.querySelector('[data-pvlab]').textContent = prelClock(X, h); box.querySelector('[data-pvcards]').innerHTML = C.html;
  let take = '';
  if(id === 'sea'){ const p = svg.querySelector('[data-route]'), L = p.getTotalLength(), f = Math.min(1, h / (X.K.dur * 0.97)), pt = p.getPointAtLength(L * f), p2 = p.getPointAtLength(Math.min(L, L * f + 2));
    svg.querySelector('[data-ship]').setAttribute('transform', `translate(${pt.x},${pt.y}) rotate(${Math.max(-25, Math.min(25, Math.atan2(p2.y - pt.y, p2.x - pt.x) * 180 / Math.PI))})`);
    svg.querySelector('[data-wake]').setAttribute('stroke-dasharray', `${L * f} ${L}`); prelFollow(box, pt.x);
    svg.querySelector('[data-storm]').style.opacity = h >= 30 && h <= 44 ? 1 : h > 44 ? .25 : .45;
    txt('[data-n="1"]', n('seasick') + n('crew') ? `${fmt(n('seasick') + n('crew'))} went ashore` : ''); txt('[data-n="2"]', n('storm') ? `${fmt(n('storm'))} went ashore` : ''); txt('[data-n="3"]', n('_ok') ? `${fmt(n('_ok'))} arrived` : '');
    txt('[data-deck]', end ? '' : `${fmt(C.still)} aboard`);
    take = end ? `<b>${fmt(X.after)}</b> reached Dolle Harbor, <b>${fmt(X.n - X.after)}</b> went ashore on the way.` : `<b>${fmt(C.still)}</b> aboard · <b>${fmt(C.done)}</b> ashore`; }
  else if(id === 'nighttrain'){ svg.querySelector('[data-train]').setAttribute('transform', `translate(${pvTx(h)},0)`); prelFollow(box, pvTx(h) - 60);
    txt('[data-n="1"]', n('cond') ? `${fmt(n('cond'))} put off` : ''); txt('[data-n="2"]', n('cards') ? `${fmt(n('cards'))} put off` : ''); txt('[data-n="3"]', n('_ok') ? `${fmt(n('_ok'))} step off` : '');
    // the bandits ride between the junction and the terminus; each one who jumped leaves a mark on the line
    const J = X.rows.filter(r => r.k === 'bandit' && r.t <= h); svg.querySelector('[data-jumps]').innerHTML = J.slice(0, 120).map((r, j) => `<circle cx="${pvTx(r.t) - 40 + (j * 37) % 30}" cy="${232 + (j * 13) % 22}" r="2.6"/>`).join('') + (J.length ? `<text x="${pvTx(7.6)}" y="282">${fmt(J.length)} jumped</text>` : '');
    svg.querySelector('[data-bandits]').style.opacity = h >= 6.3 && h <= 8.6 ? 1 : 0;
    const now = h < 1.4 ? -1 : h < 3 ? 0 : h < 6.2 ? 1 : h < 8.6 ? 2 : -1; svg.querySelectorAll('.car').forEach((c, j) => c.classList.toggle('lit', j === now));
    box.querySelector('[data-pvnow]').innerHTML = now === 0 ? `<b>Car 1 · the ticket check.</b> The conductor walks the train. He is ${esc(X.ex)}, and he is counting who notices.` : now === 1 ? '<b>Car 2 · the dining car.</b> A card game, and the stake is your ticket.' : now === 2 ? '<b>The roof · bandits.</b> Men come over the roof at full speed. Some candidates jump.' : h >= 8.6 ? '<b>The terminus.</b> Whoever still has a ticket steps off.' : '<b>Night falls.</b> The train leaves with every candidate aboard.';
    take = end ? `<b>${fmt(X.after)}</b> stepped off at the terminus, <b>${fmt(X.n - X.after)}</b> left the train on the way.` : `<b>${fmt(C.still)}</b> on the train · <b>${fmt(C.done)}</b> off`; }
  else if(id === 'quiz'){ const at = X.rows.filter(r => Math.abs(r.t - h) < 0.12).length, cnt = Math.floor((h * 7) % 6);
    box.querySelector('[data-line]').innerHTML = `<b>${fmt(C.still)}</b> still in line${C.still ? ` · <span class="at">${Math.max(1, Math.min(9, at))} at the door now</span>` : ''}<span class="ql">${'<i></i>'.repeat(Math.min(60, Math.ceil(C.still / Math.max(1, X.n / 60))))}</span>`;
    box.querySelector('[data-tally]').innerHTML = `<span class="sec">${C.still ? '●'.repeat(cnt) + '○'.repeat(5 - Math.min(5, cnt)) : '●●●●●'}</span><small>the examiner counts five seconds of silence</small>`;
    take = !C.still ? `<b>${fmt(X.after)}</b> kept silent and walked on, <b>${fmt(X.n - X.after)}</b> were turned away.` : `<b>${fmt(n('_ok'))}</b> kept silent · <b>${fmt(C.done - n('_ok'))}</b> turned away · <b>${fmt(C.still)}</b> still in line`; }
  else { const R = X.rows, p1 = R.filter(r => r.t1 <= h).length, kir = R.filter(r => r.k === 'kiriko' && r.t1 <= h).length, f2 = R.filter(r => r.k !== 'kiriko' && r.t2 <= h);
    const tw = f2.filter(r => r.k !== '_ok').length, site = n('_ok'), W = v => v ? Math.max(2, Math.sqrt(v / X.n) * 34) : 0;
    const set = (k, v) => { const e = svg.querySelector(`[data-p="${k}"]`); e.style.strokeWidth = W(v); e.style.opacity = v ? 1 : 0; };
    set('0', X.n); set('K', kir); set('A', p1 - kir); set('T', tw); set('S', R.filter(r => r.k === '_ok' && r.t2 <= h).length);
    txt('[data-n="1"]', R.length - p1 ? `${fmt(R.length - p1)} not there yet` : ''); txt('[data-n="2"]', p1 - kir - f2.length ? `${fmt(p1 - kir - f2.length)} between the forks` : '');
    txt('[data-n="K"]', kir ? `${fmt(kir)} followed the fake` : ''); txt('[data-n="T"]', tw ? `${fmt(tw)} led astray` : ''); txt('[data-n="S"]', site ? `${fmt(site)} arrived` : '');
    svg.querySelectorAll('.fork').forEach((g, j) => g.classList.toggle('busy', j === 0 ? p1 > 0 && p1 < R.length : f2.length > 0 && f2.length < R.length - kir));
    svg.querySelector('[data-who]').innerHTML = X.F.map((f, j) => { const r = X.R.get(f.c.id); let x, y, dn = false;
      if(h < r.t1){ x = 90 + (h / r.t1) * 150; y = 170; } else if(r.k === 'kiriko'){ dn = h >= r.t1 + 0.6; x = dn ? 380 : 330 + (h - r.t1) / 0.6 * 60; y = dn ? 50 : 100; }
      else if(h < r.t2){ const q = (h - r.t1) / (r.t2 - r.t1); x = 300 + q * 240; y = 170 + q * 30; } else if(r.k !== '_ok'){ x = 690; y = 300; dn = true; } else { const q = Math.min(1, (h - r.t2) / 1.2); x = 600 + q * 300; y = 200 - q * 50; }
      const yy = y + (j % 4) * 13 - 18, xx = x + (j % 3) * 8; return `<g style="--c:${f.col}" class="${dn ? 'dn' : ''}"><circle cx="${xx}" cy="${yy}" r="5"/><text x="${xx + 8}" y="${yy + 4}">${dn ? '✕ ' : ''}${esc(f.c.first || f.c.name)}</text></g>`; }).join('');
    take = h >= X.K.dur * 0.99 ? `<b>${fmt(X.after)}</b> reached the exam site, <b>${fmt(X.n - X.after)}</b> were led away.` : `<b>${fmt(site)}</b> arrived · <b>${fmt(C.still)}</b> in the forest · <b>${fmt(C.done - site)}</b> led away`; }
  box.querySelector('[data-pvtake]').innerHTML = take;
  const past = X.EV.filter(x => x.t <= h), last = past.slice(-5).reverse();
  box.querySelector('[data-pvtick]').innerHTML = last.length ? last.map((x, j) => `<li class="k-${x.e.type}${j === 0 ? ' new' : ''}"><span>${prelClock(X, x.t)}</span><p>${linkNames(chTidy(x.e.text, PHASES[X.i]), x.e.ids || [])}</p></li>`).join('') + (past.length > 5 ? `<li class="more">${past.length - 5} earlier</li>` : '') : `<li class="more">${esc(X.K.idle(X))}</li>`;
}
document.addEventListener('input', e => { const r = e.target.closest && e.target.closest('[data-pvh]'); if(r) prelDraw(r.closest('[data-pv]')); });
document.addEventListener('click', e => { const pl = e.target.closest && e.target.closest('[data-pvplay]'); if(!pl) return; const box = pl.closest('[data-pv]'), r = box.querySelector('[data-pvh]'), mx = +r.max;
  if(box._tm){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; return; }
  if(+r.value >= mx) r.value = 0; pl.textContent = '❚❚ Pause';
  box._tm = setInterval(() => { if(!box.isConnected){ clearInterval(box._tm); return; } r.value = Math.min(mx, +r.value + 1); prelDraw(box); if(+r.value >= mx){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; } }, 60); });
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if(n.nodeType !== 1) return; (n.matches && n.matches('[data-pv]') ? [n] : [...(n.querySelectorAll ? n.querySelectorAll('[data-pv]') : [])]).forEach(b => { if(!b.dataset.drawn){ b.dataset.drawn = 1; prelDraw(b); } }); }))).observe(document.body, {childList: true, subtree: true});
