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
    forks: {k1: 'kiriko', k2: 'twins', start: 'Forest edge', f1: ['Fork 1 · the guide', 'human, or a Kiriko?'], f2: ['Fork 2 · the twins', 'which one is real?'], A: ['The Kiriko’s nest', 'followed the fake'], B: ['Walking in circles', 'led astray'], end: ['Exam site', 'arrived'], cls: 'pv-wood', masks: true},
    ticks: ['9 am', 'noon', '3 pm', 'dusk'], idle: () => 'Two guides wait at the forest edge, wearing the same face.',
    note: 'Two forks in the forest. The thicker the path, the more people took it. The dots are the people this chapter follows.'},
  // the themed trials drawn the same way

  // courses where each way out has its own place: the ones still going move along the line, the ones out stay where it happened
  centennial: {title: 'The hundred stairs', dur: 10, start: 9, ride: true, ok: 'Reached the hundredth stair', still: 'still climbing',
    ways: {courage: ['gate', 'Turned back at the gate of names', 0.05], strategy: ['fork', 'Took the wrong road at the fork', 0.28], determination: ['stone', 'Sat down by the old stone', 0.5], endurance: ['legs', 'Ran out of legs on the stairs', 0.74], perception: ['exit', 'Never saw the hidden exit', 0.94]},
    route: {cls: 'pv-stairs', d: 'M60,300 L200,300 L200,252 L340,252 L340,204 L480,204 L480,156 L620,156 L620,108 L760,108 L760,60 L940,60', start: ['', 40, 286], end: ['The hundredth stair', 860, 40],
      at: {gate: ['The gate of names', 'turned back', -26], fork: ['The fork', 'took the wrong road', 30], stone: ['The old stone', 'sat down', -26], legs: ['Stair 91', 'ran out of legs', 30], exit: ['The hidden exit', 'never saw it', 30]}, marker: 'lamp'},
    ticks: ['9 am', 'noon', '3 pm', 'dusk'], idle: X => `${X.ex} opens the gate of names.`,
    note: 'One stair for every exam since the last centenary. Each way out has its own place on the climb; the ones still climbing move up, the ones out stay where it happened.'},
  mute: {title: 'The silent tunnel', dur: 8, start: 8, ride: true, ok: 'Came out the far mouth', still: 'still in the dark',
    ways: {perception: ['trap', 'Missed the hand signal', 0.3], strategy: ['spoke', 'Spoke, and was sent back', 0.55], courage: ['shout', 'Shouted in the dark', 0.78]},
    route: {cls: 'pv-tunnel', d: 'M60,170 C250,140 400,210 560,170 S820,140 940,170', start: ['The last word', 70, 214], end: ['The far mouth', 880, 214],
      at: {trap: ['The hand signal', 'missed it', -34], spoke: ['A word', 'spoke', 40], shout: ['The panic', 'shouted', -34]}, marker: 'hush'},
    ticks: ['8 am', 'noon', '2 pm', 'out'], idle: X => `${X.ex} raises one finger to the lips. Nobody speaks again.`,
    note: 'Not a word from start to finish. Each way out has its own place in the tunnel; a word breaks the silence there.'},
  ridge: {title: 'The ridge in the storm', dur: 8, start: 10, ride: true, ok: 'Reached the far peak', still: 'still on the ridge',
    ways: {endurance: ['hail', 'Turned back in the hail', 0.35], courage: ['strike', 'Froze when the lightning hit', 0.6], agility: ['slip', 'Slid back on the wet rock', 0.82]},
    route: {cls: 'pv-ridge', d: 'M60,290 C200,250 300,200 420,175 S650,112 760,92 S880,62 940,52', start: ['The foot of the ridge', 70, 318], end: ['The far peak', 860, 32],
      at: {hail: ['The hail', 'turned back', 34], strike: ['The strike', 'froze', -34], slip: ['The wet rock', 'slid back', 34]}, marker: 'lamp', bolts: true},
    ticks: ['10 am', 'noon', '3 pm', 'dusk'], idle: X => `${X.ex} waits for the first thunder, then starts walking.`,
    note: 'Up the ridge while the lightning walks along it. Each way out has its own place; a bolt falls where people froze.'},
  feeding: {title: 'Across the grazing grounds', dur: 6, start: 7, ride: true, ok: 'Reached the far fence', still: 'still among the herds',
    ways: {courage: ['tree', 'Climbed a tree and stayed there', 0.28], agility: ['herd', 'Run down by the herd', 0.5], perception: ['mother', 'Walked between a mother and her young', 0.72]},
    route: {cls: 'pv-meadow', d: 'M60,210 C300,196 600,224 940,200', start: ['The tree line', 70, 244], end: ['The far fence', 880, 244],
      at: {tree: ['The lone tree', 'up a tree', -40], herd: ['The herd', 'run down', 40], mother: ['A mother and her young', 'too close', -40]}, marker: 'lamp', herd: true},
    ticks: ['7 am', '9 am', '11 am', 'noon'], idle: () => 'The herds come down to graze. The fence is on the far side.',
    note: 'The herds cross the grounds while the candidates do. Each way out has its own place; the ones still going move along the line.'},
  wetlands: {title: 'The swamp', dur: 5, start: 6, ride: true, ok: 'Made it across', still: 'still in the swamp',
    ways: {perception: ['fake', 'Followed a fake examiner into the mist', 0.38], agility: ['mud', 'Dragged under by the mud', 0.6], courage: ['pred', 'Froze when the predators came', 0.8]},
    route: {cls: 'pv-swamp', d: 'M60,220 C220,180 380,250 540,200 S800,160 940,190', start: ['The edge of the swamp', 70, 260], end: ['Dry land', 880, 240],
      at: {fake: ['The fake examiner', 'followed him', -48], mud: ['The deep mud', 'dragged under', 40], pred: ['The predators', 'froze', -40]}, marker: 'lamp', fake: true},
    ticks: ['6 am', '7 am', '9 am', '11 am'], idle: X => `${X.ex} walks into the mist. Stay close.`,
    note: 'Follow the examiner through the mist. Each way out has its own place; one of the examiners in the mist is not the examiner.'},
  nighthunt: {title: 'The night forest', dur: 8, start: 20, ride: true, ok: 'Kept the lantern in sight', still: 'still following the lantern',
    ways: {speed: ['slow', 'Fell behind in the trees', 0.3], perception: ['lost', 'Lost the lantern in the dark', 0.55], courage: ['howl', 'Stopped when the forest howled', 0.75]},
    route: {cls: 'pv-night', d: 'M60,250 C250,220 380,260 520,200 S760,150 940,140', start: ['The edge of the forest', 70, 290], end: ['The clearing', 870, 116],
      at: {slow: ['The thick trees', 'fell behind', 36], lost: ['Where the lantern vanished', 'lost it', -36], howl: ['The howling', 'stopped', 36]}, marker: 'lantern'},
    ticks: ['8 pm', 'midnight', '2 am', 'dawn'], idle: X => `${X.ex} lifts the lantern. Follow the light.`,
    note: 'All night behind one lantern. Each way out has its own place in the forest; the light is the examiner.'},
  mirror: {title: 'The hall of mirrors', dur: 10, start: 10, ok: 'Found the real door', still: 'still among the mirrors',
    ways: {perception: ['reflect', 'Out through the wrong glass'], intelligence: ['impostor', 'Followed the impostor'], courage: ['broke', 'Broke a mirror']},
    forks: {k1: 'reflect', k2: 'impostor', k3: 'broke', start: 'The first mirror', f1: ['Mirror 1 · the reflections', 'which one moves first?'], f2: ['Mirror 2 · the examiners', 'which one is real?'], A: ['The wrong glass', 'walked out the wrong way'], B: ['The impostor’s door', 'followed the impostor'], C: ['Broken glass', 'broke a mirror'], end: ['The real door', 'found it'], cls: 'pv-glass'},
    ticks: ['10 am', 'noon', '3 pm', 'dusk'], idle: () => 'A hundred examiners look back from a hundred mirrors.',
    note: 'Two choices in the hall: the right reflection, then the real examiner. The thicker the path, the more people took it; the dots are the people this chapter follows.'},
  blankmap: {title: 'The blank map', dur: 10, start: 7, ok: 'Reached the far side', still: 'still out there',
    ways: {intelligence: ['oldmap', 'Trusted the old map'], determination: ['gaveup', 'Turned back where the path ran out'], perception: ['circles', 'Walked in circles']},
    forks: {k1: 'oldmap', k2: 'gaveup', k3: 'circles', start: 'The edge of the map', f1: ['The old map', 'trust it, or the land?'], f2: ['Where the path ends', 'go on with no path?'], A: ['Where the old map led', 'trusted the old map'], B: ['The way back', 'turned back'], C: ['The same tree, again', 'walked in circles'], end: ['The far side', 'got there'], cls: 'pv-blank', draw: true},
    ticks: ['7 am', 'noon', '3 pm', 'dusk'], idle: () => 'Nobody has walked this land before. The paper is empty.',
    note: 'The map is drawn as they walk: a path appears only once somebody has taken it. The thicker the path, the more people took it; the dots are the people this chapter follows.'},
  pit: {title: 'Three nights in the pit', dur: 72, start: 18, ride: true, ok: 'Still standing at the bell', still: 'still in the pit',
    ways: {combat: ['thrown', 'Thrown out of the pit', 3, 62], determination: ['climbed', 'Climbed out before the bell', 8, 56], endurance: ['collapsed', 'Collapsed on the second night', 26, 20]},
    clock: h => h >= 69.8 ? 'The bell' : `Night ${Math.min(3, Math.floor(h / 24) + 1)} · ${((18 + Math.floor(h)) % 24) % 12 || 12} ${((18 + Math.floor(h)) % 24) >= 12 ? 'pm' : 'am'}`,
    ticks: ['Night 1', 'Night 2', 'Night 3', 'The bell'], idle: X => `${X.ex} pushes the first of them into the mud.`,
    note: 'Everyone still in the pit is a dot in the mud; the ones this chapter follows have names. When someone is out, they land on the rim on the side of how it happened.'},
  pairs: {title: 'Tied two by two', dur: 10, start: 8, ride: true, pairs: true, ok: 'Crossed together', still: 'still on the rope',
    ways: {teamwork: ['snapped', 'The rope snapped', 2, 6], endurance: ['pace', 'Could not keep the pace for two', 5, 4], charisma: ['trust', 'A stranger would not trust them', 0.6, 1.6]},
    ticks: ['8 am', 'noon', '3 pm', 'dusk'], idle: () => 'The ropes are tied. Nobody chose their partner, unless they were allies.',
    note: 'A pair crosses or falls together. Each lane is a pair with someone this chapter follows; a red rope is the moment they fell. Pairs are rebuilt from who passed and who fell together.'}
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
    if(K.route && w) r.t = w[2] * dur * 0.97 + ((h % 100) / 100 - 0.5) * dur * 0.04;
    else if(K.ride || K.timed) r.t = k === '_ok' ? dur * 0.97 : (w ? w[2] : dur * 0.8) + (h % 100) / 100 * (w && w[3] != null ? w[3] : k === 'bandit' ? 1.4 : k === '_dead' ? dur * 0.15 : 0.3);
    else if(ph.id === 'quiz') r.t = 0.4 + (h % 1000) / 1000 * (dur - 1.2);   // in line in waves; the answer is given at the door
    else { r.t1 = 0.6 + (h % 1000) / 1000 * 3.6; r.t2 = r.t1 + 1.4 + ((h >> 6) % 1000) / 1000 * 3.2; r.t = K.forks && (k === K.forks.k1 || k === K.forks.k3) ? r.t1 : Math.min(dur * 0.98, r.t2 + (k === '_ok' ? 1.2 : 0)); }
    R.set(c.id, r); });
  let pairs = null;
  if(K.pairs){ pairs = []; const used = new Set(), al = c => new Set(typeof alliesOf === 'function' ? alliesOf(S, c).map(o => o.id) : []);
    [P.filter(c => c.out !== i), P.filter(c => c.out === i)].forEach(G => { const g = G.slice().sort((a, b) => H(a.id + 'pr') - H(b.id + 'pr'));
      g.forEach(c => { if(used.has(c.id)) return; used.add(c.id); const A = al(c), m = g.find(o => !used.has(o.id) && A.has(o.id)) || g.find(o => !used.has(o.id) && (o.out === i) === (c.out === i) && (c.out !== i || R.get(o.id).k === R.get(c.id).k)) || g.find(o => !used.has(o.id));
        if(m){ used.add(m.id); const t = Math.min(R.get(c.id).t, R.get(m.id).t); R.get(c.id).t = t; R.get(m.id).t = t; } pairs.push([c, m || null]); }); }); }
  // on a route or a rope, the ones who get through do not all walk at the same speed: the stronger, the sooner
  if(K.route || K.pairs){ const sc = c => typeof c.scores[ph.id] === 'number' ? c.scores[ph.id] : 0, oks = P.filter(c => c.out !== i).sort((a, b) => sc(b) - sc(a));
    oks.forEach((c, j) => { R.get(c.id).pace = 0.8 + 0.2 * j / Math.max(1, oks.length - 1); }); P.forEach(c => { if(!R.get(c.id).pace) R.get(c.id).pace = 1; }); }
  if(K.pairs && pairs) pairs.forEach(([a, b]) => { if(b){ const p = Math.max(R.get(a.id).pace, R.get(b.id).pace); R.get(a.id).pace = p; R.get(b.id).pace = p; } });
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
  return PREL_C[i] = {key, i, K, R, rows, pairs, cards, F: F.map((c, j) => ({c, col: COL[j % COL.length]})), EV, n: P.length, after: rows.filter(r => r.k === '_ok').length, ex: ph.ex ? ph.ex.name : 'The examiner'};
}
const prelClock = (X, h) => { if(X.K.clock) return X.K.clock(h); const t = X.K.start + h; if(X.K.day){ const d = Math.floor(t / 24) + 1, hh = Math.floor(t % 24); return `Day ${d} · ${hh % 12 || 12} ${hh >= 12 ? 'pm' : 'am'}`; }
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
  disguise: X => pvForks(X), mirror: X => pvForks(X), blankmap: X => pvForks(X),
  centennial: X => pvRoute(X), mute: X => pvRoute(X), ridge: X => pvRoute(X), feeding: X => pvRoute(X), wetlands: X => pvRoute(X), nighthunt: X => pvRoute(X),
  pit: X => `<svg class="pv-chart pv-pit" viewBox="0 0 1000 300" role="img" aria-label="The mud pit">
    <rect class="sky" width="1000" height="300"/><g data-moons class="moons">${[0, 1, 2].map(j => `<g transform="translate(${400 + j * 100},40)"><circle r="14"/><text y="34" text-anchor="middle">night ${j + 1}</text></g>`).join('')}</g>
    <ellipse class="rim" cx="500" cy="200" rx="330" ry="84"/><ellipse class="mud" cx="500" cy="204" rx="300" ry="68"/>
    <text class="side" x="80" y="140">Thrown out</text><text data-n="thrown" class="cnt" x="80" y="158"></text>
    <text class="side" x="860" y="140">Climbed out</text><text data-n="climbed" class="cnt" x="860" y="158"></text>
    <text class="side" x="500" y="296" text-anchor="middle" data-n="collapsed"></text>
    <g data-dots class="dots"></g><g data-who class="who"></g></svg>`,
  pairs: X => `<svg class="pv-chart pv-pairs" viewBox="0 0 1000 ${60 + Math.min(6, pvLanes(X).length) * 40}" role="img" aria-label="The pairs on the rope">
    <rect class="paper" width="1000" height="100%"/><line class="ln" x1="90" y1="16" x2="90" y2="100%"/><line class="ln fin" x1="910" y1="16" x2="910" y2="100%"/><text x="90" y="14" text-anchor="middle">start</text><text x="910" y="14" text-anchor="middle">the line</text>
    <g data-who></g></svg><div class="pv-strip" data-strip></div>`
};
// a course drawn as a line, with a place for each way out
function pvRoute(X){ const RT = X.K.route, c = RT.cls;
  const deco = c === 'pv-stairs' ? `<g class="wall">${Array.from({length: 6}, (_, i) => `<text x="${120 + i * 140}" y="${330 - i * 48}">${['I', 'XX', 'XL', 'LX', 'LXXX', 'C'][i]}</text>`).join('')}</g>`
    : c === 'pv-tunnel' ? '<path class="rock" d="M0,0 H1000 V95 C800,120 600,80 400,110 S100,90 0,100 Z"/><path class="rock" d="M0,330 H1000 V245 C800,220 600,262 400,236 S100,250 0,240 Z"/>'
    : c === 'pv-ridge' ? '<path class="mtn" d="M0,330 L60,300 C200,260 300,210 420,185 S650,122 760,102 S880,72 940,62 L1000,80 V330 Z"/><g class="rain">' + Array.from({length: 40}, (_, i) => `<line x1="${(i * 53) % 1000}" y1="${(i * 31) % 200}" x2="${(i * 53) % 1000 - 6}" y2="${(i * 31) % 200 + 14}"/>`).join('') + '</g>'
    : c === 'pv-meadow' ? '<g class="grass">' + Array.from({length: 60}, (_, i) => `<path d="M${(i * 67) % 1000},${(i * 43) % 330} l3,-9 l3,9"/>`).join('') + '</g><g data-herd class="herd">' + Array.from({length: 9}, (_, i) => `<ellipse cx="${460 + (i % 3) * 34}" cy="${(i / 3 | 0) * 22}" rx="15" ry="9"/>`).join('') + '</g>'
    : c === 'pv-swamp' ? '<g class="reeds">' + Array.from({length: 50}, (_, i) => `<path d="M${(i * 71) % 1000},${(i * 37) % 330 + 10} v-16"/>`).join('') + '</g><path class="fog" d="M0,90 C200,60 400,120 600,80 S900,100 1000,70 V140 C800,150 600,110 400,150 S150,120 0,140 Z"/>'
    : '<g class="trees">' + Array.from({length: 40}, (_, i) => { const x = (i * 197) % 1000, y = (i * 83) % 330; return `<path d="M${x},${y} l-10,26 h20 Z"/>`; }).join('') + '</g>';
  return `<svg class="pv-chart pv-route ${c}" viewBox="0 0 1000 330" role="img" aria-label="${esc(X.K.title)}"><rect class="paper" width="1000" height="330"/>${deco}
    <path data-route class="line" d="${RT.d}"/><path data-done class="done" d="${RT.d}"/>${RT.fake ? '<path data-fake class="fake" d=""/>' : ''}
    <g data-st class="st"></g>
    <text class="end-l" x="${RT.start[1]}" y="${RT.start[2]}">${esc(RT.start[0])}</text><text class="end-l" x="${RT.end[1]}" y="${RT.end[2]}">${esc(RT.end[0])}</text><text data-n="ok" class="cnt ok" x="${RT.end[1]}" y="${RT.end[2] + 16}"></text>
    <g data-mark class="mark"></g><g data-who class="who"></g></svg>`; }
// the pairs we draw: those with someone this chapter follows (a lane each, at most six)
const pvLanes = X => { const fol = new Set(X.F.map(f => f.c.id)); return (X.pairs || []).filter(([a, b]) => fol.has(a.id) || (b && fol.has(b.id))).slice(0, 6); };
function pvForks(X){ const FK = X.K.forks, deco = FK.cls === 'pv-wood' ? `<g class="trees">${Array.from({length: 46}, (_, i) => { const x = (i * 211) % 1000, y = (i * 89) % 330; return (Math.abs(y - 170) < 30 && x < 600) || (y < 90 && x > 300 && x < 520) ? '' : `<path d="M${x},${y} l-9,18 h18 Z"/>`; }).join('')}</g>`
    : FK.cls === 'pv-glass' ? `<g class="glass">${Array.from({length: 14}, (_, i) => `<rect x="${(i * 173) % 960 + 10}" y="${(i * 97) % 250 + 20}" width="26" height="54" rx="12"/>`).join('')}</g>` : `<g class="grid">${Array.from({length: 9}, (_, i) => `<line x1="${i * 125}" y1="0" x2="${i * 125}" y2="330"/>`).join('')}</g>`;
  return `<svg class="pv-chart pv-forks ${FK.cls}" viewBox="0 0 1000 330" role="img" aria-label="The paths"><rect class="paper" width="1000" height="330"/>${deco}
    <path data-p="0" class="pth" d="M60,170 L300,170"/><path data-p="K" class="pth bad" d="M300,170 C340,120 380,62 480,60"/><path data-p="A" class="pth" d="M300,170 C400,175 480,195 560,200"/>
    <path data-p="T" class="pth bad" d="M560,200 C640,230 700,290 780,290"/><path data-p="S" class="pth" d="M560,200 C680,190 800,160 920,150"/>${FK.k3 ? '<path data-p="C" class="pth bad" d="M300,170 C300,240 330,290 400,300"/>' : ''}
    <g class="node"><circle cx="60" cy="170" r="9"/><text x="40" y="200">${esc(FK.start)}</text><text data-n="1" class="cnt" x="40" y="216"></text></g>
    <g class="fork"><circle cx="300" cy="170" r="13"/><text x="${FK.k3 ? 280 : 250}" y="${FK.k3 ? 122 : 210}" text-anchor="${FK.k3 ? 'end' : 'start'}">${esc(FK.f1[0])}</text><text class="sub" x="${FK.k3 ? 280 : 250}" y="${FK.k3 ? 138 : 226}" text-anchor="${FK.k3 ? 'end' : 'start'}">${esc(FK.f1[1])}</text></g>
    <g class="fork"><circle cx="560" cy="200" r="13"/><text x="520" y="240">${esc(FK.f2[0])}</text><text class="sub" x="520" y="256">${esc(FK.f2[1])}</text><text data-n="2" class="cnt" x="${FK.k3 ? 470 : 410}" y="${FK.k3 ? 282 : 262}" text-anchor="middle"></text></g>
    <g class="node bad"><circle cx="480" cy="60" r="9"/><text x="500" y="56">${esc(FK.A[0])}</text><text data-n="K" class="cnt" x="500" y="74"></text></g>
    <g class="node bad"><circle cx="780" cy="290" r="9"/><text x="800" y="288">${esc(FK.B[0])}</text><text data-n="T" class="cnt" x="800" y="306"></text></g>
    ${FK.k3 ? `<g class="node bad"><circle cx="400" cy="300" r="9"/><text x="250" y="304" text-anchor="end">${esc(FK.C[0])}</text><text data-n="C" class="cnt" x="250" y="320" text-anchor="end"></text></g>` : ''}
    <g class="node end"><circle cx="920" cy="150" r="11"/><text x="850" y="125">${esc(FK.end[0])}</text><text data-n="S" class="cnt" x="850" y="185"></text></g>
    ${FK.masks ? '<g class="masks"><g transform="translate(300,128)"><ellipse rx="11" ry="13"/><circle cx="-4" cy="-2" r="2"/><circle cx="4" cy="-2" r="2"/></g><g transform="translate(560,160)"><ellipse cx="-9" rx="9" ry="11"/><ellipse cx="11" rx="9" ry="11"/></g></g>' : ''}
    <g data-who class="who"></g></svg>`; }
function prelHtml(i){
  const X = prelRun(i); if(!X) return ''; const K = X.K;
  return `<div class="rc-box pv-box" data-pv="${i}" data-pvid="${PHASES[i].id}"><div class="tv-top"><div class="section-h" style="margin:0">${esc(K.title)}</div></div>
    <div class="tv-time"><button type="button" class="btn small" data-pvplay>▶ Play</button><div class="tv-rng"><input type="range" data-pvh min="0" max="200" value="0" aria-label="Time"><div class="tv-ticks">${K.ticks.map(t => `<span>${t}</span>`).join('')}</div></div><b data-pvlab></b></div>
    <p class="tv-take" data-pvtake></p>${PHASES[i].id === 'nighttrain' ? '<p class="pv-now" data-pvnow></p>' : ''}<div class="pv-art">${PV_ART[PHASES[i].id](X)}</div><div class="hb-cards pv-cards" data-pvcards></div>
    <div class="rc-low"><div class="section-h" style="margin:0 0 6px">As it happened</div><ul class="rc-tick" data-pvtick></ul></div>
    <p class="muted" style="font-size:12.5px;margin:8px 0 0">${esc(K.note)} The names are the people this chapter follows: ✓ made it, ✕ did not; click one to open their page.</p></div>`;
}
function prelDraw(box){
  const X = prelRun(+box.dataset.pv); if(!X || (box.dataset.pvid && box.dataset.pvid !== PHASES[X.i].id)) return; const id = PHASES[X.i].id, h = +box.querySelector('[data-pvh]').value / 200 * X.K.dur, svg = box.querySelector('svg'), C = prelCards(X, h);
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
  else if(X.K.forks){ const FK = X.K.forks, R = X.rows, at = (k, h0) => R.filter(r => r.k === k && r.t1 <= h0).length, p1 = R.filter(r => r.t1 <= h).length, a1 = at(FK.k1, h), a3 = FK.k3 ? at(FK.k3, h) : 0;
    const f2 = R.filter(r => r.k !== FK.k1 && r.k !== FK.k3 && r.t2 <= h), tw = f2.filter(r => r.k !== '_ok').length, site = n('_ok'), W = v => v ? Math.max(2, Math.sqrt(v / X.n) * 34) : 0;
    const set = (k, v) => { const e = svg.querySelector(`[data-p="${k}"]`); if(!e) return; e.style.strokeWidth = W(v); e.style.opacity = v ? 1 : 0; };
    set('0', X.n); set('K', a1); set('C', a3); set('A', p1 - a1 - a3); set('T', tw); set('S', R.filter(r => r.k === '_ok' && r.t2 <= h).length);
    // the blank map: a path is drawn only as far as somebody has walked it
    if(FK.draw){ const first = (f, g) => { const v = R.filter(f).map(g); return v.length ? Math.min(...v) : Infinity; }, grow = (k, t0, t1) => { const e = svg.querySelector(`[data-p="${k}"]`); if(!e) return; const L = e.getTotalLength(), q = t0 === Infinity ? 0 : Math.max(0, Math.min(1, (h - t0) / Math.max(0.2, t1 - t0))); e.style.strokeDasharray = `${L * q} ${L}`; e.style.opacity = q ? 1 : 0; };
      const f1 = first(() => true, r => r.t1), f2 = first(r => r.k !== FK.k1 && r.k !== FK.k3, r => r.t2);
      grow('0', 0, f1); grow('K', first(r => r.k === FK.k1, r => r.t1), first(r => r.k === FK.k1, r => r.t1) + 0.8); grow('C', first(r => r.k === FK.k3, r => r.t1), first(r => r.k === FK.k3, r => r.t1) + 0.8);
      grow('A', f1, f2); grow('T', first(r => r.k !== FK.k1 && r.k !== FK.k3 && r.k !== '_ok', r => r.t2), first(r => r.k !== FK.k1 && r.k !== FK.k3 && r.k !== '_ok', r => r.t2) + 0.8); grow('S', f2, f2 + 1.2); }
    txt('[data-n="1"]', R.length - p1 ? `${fmt(R.length - p1)} not there yet` : ''); txt('[data-n="2"]', p1 - a1 - a3 - f2.length ? `${fmt(p1 - a1 - a3 - f2.length)} between the two` : '');
    txt('[data-n="K"]', a1 ? `${fmt(a1)} ${FK.A[1]}` : ''); txt('[data-n="T"]', tw ? `${fmt(tw)} ${FK.B[1]}` : ''); if(FK.k3) txt('[data-n="C"]', a3 ? `${fmt(a3)} ${FK.C[1]}` : ''); txt('[data-n="S"]', site ? `${fmt(site)} ${FK.end[1]}` : '');
    svg.querySelectorAll('.fork').forEach((g, j) => g.classList.toggle('busy', j === 0 ? p1 > 0 && p1 < R.length : f2.length > 0 && f2.length < R.length - a1 - a3));
    svg.querySelector('[data-who]').innerHTML = X.F.map((f, j) => { const r = X.R.get(f.c.id); let x, y, dn = false;
      if(h < r.t1){ x = 90 + (h / r.t1) * 150; y = 170; } else if(r.k === FK.k1){ dn = h >= r.t1 + 0.6; x = dn ? 380 : 330 + (h - r.t1) / 0.6 * 60; y = dn ? 50 : 100; }
      else if(FK.k3 && r.k === FK.k3){ dn = h >= r.t1 + 0.6; x = dn ? 330 : 305; y = dn ? 290 : 220; }
      else if(h < r.t2){ const q = (h - r.t1) / (r.t2 - r.t1); x = 300 + q * 240; y = 170 + q * 30; } else if(r.k !== '_ok'){ x = 690; y = 300; dn = true; } else { const q = Math.min(1, (h - r.t2) / 1.2); x = 600 + q * 300; y = 200 - q * 50; }
      const yy = y + (j % 4) * 13 - 18, xx = x + (j % 3) * 8; return `<g style="--c:${f.col}" class="${dn ? 'dn' : ''}"><circle cx="${xx}" cy="${yy}" r="5"/><text x="${xx + 8}" y="${yy + 4}">${dn ? '✕ ' : ''}${esc(f.c.first || f.c.name)}</text></g>`; }).join('');
    take = h >= X.K.dur * 0.99 ? `<b>${fmt(X.after)}</b> ${esc(X.K.ok.toLowerCase())}, <b>${fmt(X.n - X.after)}</b> did not.` : `<b>${fmt(site)}</b> ${esc(FK.end[1])} · <b>${fmt(C.still)}</b> ${esc(X.K.still)} · <b>${fmt(C.done - site)}</b> out`; }
  else if(X.K.route){ const RT = X.K.route, p = svg.querySelector('[data-route]'), L = p.getTotalLength(), T = X.K.dur * 0.97, at = f => p.getPointAtLength(L * Math.max(0, Math.min(1, f)));
    const lead = Math.min(1, h / (T * 0.8)), lp = at(lead); svg.querySelector('[data-done]').setAttribute('stroke-dasharray', `${L * lead} ${L}`); prelFollow(box, lp.x);
    svg.querySelector('[data-mark]').innerHTML = RT.marker === 'lantern' ? `<circle class="glow" cx="${lp.x}" cy="${lp.y - 14}" r="34"/><circle class="lamp" cx="${lp.x}" cy="${lp.y - 14}" r="6"/>` : RT.marker === 'hush' ? `<text x="${lp.x}" y="${lp.y - 16}" text-anchor="middle">shh</text><circle class="lamp" cx="${lp.x}" cy="${lp.y}" r="5"/>` : `<circle class="lamp" cx="${lp.x}" cy="${lp.y}" r="6"/>`;
    // each way out at its own place; a bolt over the ridge where people froze; the fake examiner's path into the mist
    svg.querySelector('[data-st]').innerHTML = Object.values(X.K.ways).map(([k]) => { const A = RT.at[k], w = X.K.ways, fr = Object.values(w).find(x => x[0] === k)[2], q = at(fr), v = n(k), dy0 = Math.max(30, Math.abs(A[2])), up = q.y + dy0 + 20 > 325, dy = up ? -dy0 + 6 : dy0;
      return `<g class="${v ? 'hit' : ''}"><circle cx="${q.x}" cy="${q.y}" r="${v ? 7 : 5}"/><text x="${q.x}" y="${q.y + dy}" text-anchor="middle">${esc(A[0])}</text><text class="cnt" x="${q.x}" y="${q.y + dy + (up ? -16 : 16)}" text-anchor="middle">${v ? `${fmt(v)} ${esc(A[1])}` : ''}</text>
        ${RT.bolts && k === 'strike' ? `<path class="bolt" style="opacity:${v ? 1 : .15}" d="M${q.x + 4},${q.y - 70} l-14,30 h12 l-10,28"/>` : ''}</g>`; }).join('');
    if(RT.fake){ const q = at(X.K.ways.perception[2]); svg.querySelector('[data-fake]').setAttribute('d', `M${q.x},${q.y} C${q.x - 20},${q.y - 60} ${q.x + 40},${q.y - 90} ${q.x + 10},${q.y - 120}`); svg.querySelector('[data-fake]').style.opacity = n('fake') ? 1 : .25; }
    if(RT.herd) svg.querySelector('[data-herd]').setAttribute('transform', `translate(0,${-60 + 380 * h / X.K.dur})`);
    txt('[data-n="ok"]', end ? `${fmt(X.after)} made it` : '');
    svg.querySelector('[data-who]').innerHTML = X.F.map((f, j) => { const r = X.R.get(f.c.id), out = r.k !== '_ok' && r.t <= h, w = Object.values(X.K.ways).find(x => x[0] === r.k);
      const fr = out ? w ? w[2] : 0.9 : Math.min(r.k === '_ok' ? 1 : (w ? w[2] : 1), h / (T * r.pace)), q = at(fr);
      // out: a small mark on the line where it happened (the name is on its card); still going: a dot with the name, above the line
      if(out) return `<g style="--c:${f.col}" class="dn"><circle cx="${q.x - 12 + (j % 5) * 6}" cy="${q.y + 11}" r="3.5"/></g>`;
      const yy = q.y - 12 - (j % 4) * 13, xx = q.x + (j % 2) * 6; return `<g style="--c:${f.col}"><circle cx="${xx}" cy="${yy}" r="5"/><text x="${xx + 8}" y="${yy + 4}">${end ? '✓ ' : ''}${esc(f.c.first || f.c.name)}</text></g>`; }).join('');
    take = end ? `<b>${fmt(X.after)}</b> ${esc(X.K.ok.toLowerCase())}, <b>${fmt(X.n - X.after)}</b> did not.` : `<b>${fmt(C.still)}</b> ${esc(X.K.still)} · <b>${fmt(C.done)}</b> out`; }
  else if(id === 'pit'){ const H = s0 => nhashUI(S.seed + ':pit:' + s0), inPit = X.rows.filter(r => r.t > h), fol = new Set(X.F.map(f => f.c.id));
    svg.querySelectorAll('[data-moons] g').forEach((g, j) => g.classList.toggle('lit', h >= j * 24));
    // everyone still in the pit is a dot in the mud (a sample, if there are many)
    const step = Math.max(1, Math.ceil(inPit.length / 160)), spot = id0 => { const a = (H(id0) % 6283) / 1000, rr = Math.sqrt((H(id0 + 'r') % 1000) / 1000); return [500 + Math.cos(a) * rr * 280, 204 + Math.sin(a) * rr * 58]; };
    svg.querySelector('[data-dots]').innerHTML = inPit.filter((r, j) => j % step === 0 && !fol.has(r.c.id)).map(r => { const [x, y] = spot(r.c.id); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2"/>`; }).join('');
    txt('[data-n="thrown"]', n('thrown') ? fmt(n('thrown')) : ''); txt('[data-n="climbed"]', n('climbed') ? fmt(n('climbed')) : '');
    txt('[data-n="collapsed"]', n('collapsed') + n('_dead') ? `${fmt(n('collapsed'))} collapsed in the mud${n('_dead') ? ` · ${fmt(n('_dead'))} never climbed out` : ''}` : '');
    svg.querySelector('[data-who]').innerHTML = X.F.map((f, j) => { const r = X.R.get(f.c.id), out = r.t <= h && r.k !== '_ok'; let [x, y] = spot(f.c.id);
      if(out){ if(r.k === 'thrown'){ x = 70 + (j % 3) * 30; y = 180 + (j % 4) * 16; } else if(r.k === 'climbed'){ x = 850 + (j % 3) * 30; y = 180 + (j % 4) * 16; } else { y = 250 + (j % 2) * 10; } }
      return `<g style="--c:${f.col}" class="${out ? 'dn' : ''}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"/><text x="${(x + 8).toFixed(1)}" y="${(y + 4).toFixed(1)}">${out ? '✕ ' : end ? '✓ ' : ''}${esc(f.c.first || f.c.name)}</text></g>`; }).join('');
    take = end ? `<b>${fmt(X.after)}</b> were still standing at the bell, <b>${fmt(X.n - X.after)}</b> were not.` : `<b>${fmt(inPit.length)}</b> still in the pit · <b>${fmt(C.done)}</b> out`; }
  else if(id === 'pairs'){ const L = pvLanes(X), fol = new Map(X.F.map(f => [f.c.id, f.col])), px = (t0) => 90 + 820 * Math.min(1, h / Math.max(0.01, t0));
    svg.querySelector('[data-who]').innerHTML = L.map(([a, b], j) => { const r = X.R.get(a.id), fell = r.k !== '_ok' && r.t <= h, y = 50 + j * 40, x = 136 + 774 * Math.min(1, fell ? r.t / (X.K.dur * 0.97) : h / (X.K.dur * 0.97 * r.pace)), x2 = x - 46;
      const nm = c => c ? `<tspan style="fill:${fol.get(c.id) || 'var(--fg)'}">${esc(c.first || c.name)}</tspan>` : '';
      return `<g class="lane${fell ? ' fell' : r.k === '_ok' && h >= X.K.dur * 0.97 ? ' ok' : ''}"><line class="rope" x1="${x2}" y1="${y}" x2="${x}" y2="${y}"/><circle cx="${x2}" cy="${y}" r="6"/>${b ? `<circle cx="${x}" cy="${y}" r="6"/>` : ''}
        <text x="${Math.min(x + 12, 760)}" y="${y + 4}">${fell ? '✕ ' : r.k === '_ok' && h >= X.K.dur * 0.97 ? '✓ ' : ''}${nm(a)}${b ? ' &amp; ' + nm(b) : ' (alone)'}</text></g>`; }).join('');
    // every pair at once, small: gold on the rope, red fell together, green across
    const pr0 = X.pairs || [], foll = new Set(X.F.map(f => f.c.id)); box.querySelector('[data-strip]').innerHTML = `<small>All ${fmt(pr0.length)} pairs</small><div>` + pr0.map(([a, b]) => { const r = X.R.get(a.id), st = r.k !== '_ok' && r.t <= h ? 'f' : end || (r.k === '_ok' && h >= X.K.dur * 0.97 * r.pace) ? 'o' : '';
      return `<i class="${st}${foll.has(a.id) || (b && foll.has(b.id)) ? ' me' : ''}${b ? '' : ' one'}"></i>`; }).join('') + '</div>';
    const pr = X.pairs || [], acrossP = pr.filter(([a]) => X.R.get(a.id).k === '_ok' && h >= X.K.dur * 0.97 * X.R.get(a.id).pace).length, fellP = pr.filter(([a]) => X.R.get(a.id).k !== '_ok' && X.R.get(a.id).t <= h).length;
    take = end ? `<b>${fmt(acrossP)}</b> pairs crossed together, <b>${fmt(fellP)}</b> fell together (<b>${fmt(X.n - X.after)}</b> people out).` : `<b>${fmt(pr.length - fellP)}</b> pairs still on the rope · <b>${fmt(fellP)}</b> fell together`; }
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
