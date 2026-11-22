/* ===================== LAWS: what each Chairman promised, and what the exam is like under their decrees ===================== */
// A few levers the exam already has: how many licenses, how many come to the gate, how killing is punished in the duels,
// who examines, and the kind of road. The Jubilee and the Centenary keep their own rules for licenses, examiners and road.
const LAW = {
  'lic+': {k: 'lic', v: 15, txt: 'more licenses', law: '15 licenses a year', ann: 'up to fifteen licenses'},
  'lic-': {k: 'lic', v: 9, txt: 'fewer licenses', law: '9 licenses a year', ann: 'no more than nine licenses'},
  'gate+': {k: 'gate', v: 1.35, txt: 'open gates', law: 'Open gates: no entry fee', ann: 'the gates open to all, without a fee'},
  'gate-': {k: 'gate', v: 0.7, txt: 'an entry fee', law: 'An entry fee at the gate', ann: 'an entry fee that keeps the crowd smaller'},
  'kill-': {k: 'kill', v: 'ban', txt: 'a ban on killing', law: 'A ban on killing: fatal duels are rarer', ann: 'any candidate who kills is out before the body is cold'},
  'kill+': {k: 'kill', v: 'free', txt: 'the strong survive', law: 'The strong survive: fewer duels are stopped', ann: 'examiners who will not stop a duel early'},
  'vets': {k: 'ex', v: 'vets', txt: 'veteran examiners', law: 'Only veterans examine (★★ and up)', ann: 'only veterans as examiners'},
  'road': {k: 'road', v: 'hard', txt: 'harder roads', law: 'Harder roads: storms and wild country', ann: 'routes chosen to be hard'},
  'book': {k: 'road', v: 'book', txt: 'an exam by the book', law: 'An exam by the book', ann: 'an exam by the book, without games'}
};
// who promises what: a leaning by specialty, a little chance for anything
const LAW_LEAN = {Blacklist: ['lic-', 'kill+', 'vets'], Crime: ['lic-', 'vets', 'kill-'], Ruins: ['book', 'vets', 'lic-'], Head: ['lic+', 'kill-', 'book'], Jackpot: ['lic+', 'gate-', 'road'],
  Music: ['lic+', 'kill-', 'gate+'], Gourmet: ['gate+', 'kill-', 'lic+'], Lost: ['gate+', 'kill-', 'road'], Sea: ['road', 'gate+', 'kill+'], Beast: ['road', 'kill+', 'gate+'], Treasure: ['gate-', 'book', 'lic+'], Virus: ['kill-', 'book', 'gate-']};
const lawOpp = id => Object.keys(LAW).filter(x => x !== id && LAW[x].k === LAW[id].k);
function promisesOf(h){
  if(h.plat && h.plat.ed && S && S.edition - h.plat.ed < 20) return h.plat.p;
  const lean = LAW_LEAN[(h.career || '').replace(' Hunter', '')] || Object.keys(LAW), out = [];
  const n = Math.random() < 0.45 ? 2 : 1;
  for(let t = 0; t < 10 && out.length < n; t++){ const id = Math.random() < 0.75 ? pickR(lean) : pickR(Object.keys(LAW)); if(!out.some(x => x === id || LAW[x].k === LAW[id].k)) out.push(id); }
  h.plat = {ed: S ? S.edition : 0, p: out}; return out;
}
const laws = () => (WORLD.laws = WORLD.laws || {});
const lawOn = k => { const L = laws()[k]; return L ? LAW[L.id] : null; };
const lawLic = () => { const L = lawOn('lic'); return L ? L.v : MAX_LICENSES; };
// after a vote: the winner tries to keep the promises
function lawsAfterElection(E, winner, add){
  const fin = (E.rounds || []).filter(r => !r.void && r.top).pop(); if(!fin) return;
  E.plat = {}; fin.top.slice(0, 3).forEach(x => { const h = hLic(x.l); if(h) E.plat[x.l] = promisesOf(h).slice(); });
  (E.plat[winner.license] || promisesOf(winner)).forEach(id => {
    const cur = laws()[LAW[id].k]; if(cur && cur.id === id) return;
    if(Math.random() < 0.15){ add(winner, 'law', `Chairman ${winner.name} promised ${LAW[id].txt}. The Zodiac does not let it through.`, 5); return; }
    laws()[LAW[id].k] = {id, ed: E.ed, by: winner.license};
    add(winner, 'law', `Chairman ${winner.name} keeps a campaign promise: ${LAW[id].txt}${cur ? `, in place of ${LAW[cur.id].txt}` : ''}.`, 7);
  });
}
// between elections: an old decree lapses now and then, so the rules keep moving
function lawsYear(ed, add){
  const ch = WORLD.chair && hLic(WORLD.chair.lic); if(!ch) return;
  Object.entries(laws()).forEach(([k, L]) => { if(ed - L.ed < 8 || Math.random() > 0.03) return;
    delete laws()[k]; add(ch, 'law', `Chairman ${ch.name} lets an old decree lapse: ${LAW[L.id].txt}${L.by !== ch.license && hLic(L.by) ? `, from the time of ${hLic(L.by).name}` : ''}.`, 5); });
}
// what applies to a new exam; specials keep their own rules for licenses, examiners and road
function lawsFor(special){ const out = {}; Object.entries(laws()).forEach(([k, L]) => { if(special && ['lic', 'ex', 'road'].includes(k)) return; out[k] = L.id; }); return out; }
function lawsOpen(N){ const ids = Object.values(N.law || {}); if(!ids.length) return;
  const ch = WORLD.chair && hLic(WORLD.chair.lic), A = ids.map(id => LAW[id].ann), list = A.length > 1 ? A.slice(0, -1).join(', ') + ' and ' + A[A.length - 1] : A[0];
  log(N, 0, 'story', `By decree${ch ? ` of Chairman ${ch.name}` : ''}, this year's exam has ${list}.`, []); }
// the Council: the rules in force, in a few lines
function lawsHtml(){ const L = Object.values(laws()); if(!L.length) return '';
  return `<div class="laws"><div class="section-h">Laws in force</div>${L.map(x => { const h = hLic(x.by); return `<p class="h-fam"><span>¶</span> ${esc(LAW[x.id].law)} <span class="muted">· since the ${ordinal(x.ed)}${h ? `, ${esc(h.name)}` : ''}</span></p>`; }).join('')}<p class="muted" style="font-size:12px;margin:4px 0 0">The Jubilee and the Centenary keep their own rules for licenses, examiners and the road.</p></div>`; }
const platTxt = (E, l) => { const P = E.plat && E.plat[l]; return P && P.length ? `<small class="elx-p">promised ${P.map(id => LAW[id].txt).join(' and ')}</small>` : ''; };
