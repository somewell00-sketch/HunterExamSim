/* ===================== MORE WORLD: discoveries, crews, family feuds, Heaven's Arena, the year at a glance ===================== */
// Each of these lives beside what was already there: a line in a Hunter's year, a row on their profile, a part of the World.
// Nothing here changes how the exam itself is decided.
const MW_ON = () => WORLD && !WORLD.mwOff;

/* ---------- 1. discoveries: what a Hunter leaves behind, by specialty ---------- */
const DISC_K = {species: 'Species', dish: 'Dish', work: 'Work', treasure: 'Treasure', cure: 'Cure', find: 'Find'};
const DISC_OF = {Beast: 'species', Sea: 'species', Gourmet: 'dish', Music: 'work', Treasure: 'treasure', Jackpot: 'treasure', Virus: 'cure', Ruins: 'find', Lost: 'find'};
const DSC = {
  adjS: ['Glasswing', 'Ember-backed', 'Hollow-eyed', 'Ninefold', 'Moonscale', 'Ashen', 'Whistling', 'Thousand-legged', 'Velvet', 'Ironhorn', 'Sleepless', 'Lantern', 'Saltbone', 'Shadow-tailed', 'Rainbow-throated', 'Bellmouth', 'Mirror', 'Thornback', 'Paper-winged', 'Two-headed'],
  land: ['Heron', 'Lynx', 'Moth', 'Toad', 'Stag', 'Viper', 'Owl', 'Boar', 'Ibis', 'Fox', 'Beetle', 'Ape', 'Hare', 'Condor', 'Tortoise', 'Mantis'],
  sea: ['Eel', 'Ray', 'Octopus', 'Nautilus', 'Crab', 'Shark', 'Jellyfish', 'Whale', 'Seahorse', 'Squid', 'Turtle'],
  adjD: ['Ashen', 'Seven-Day', 'Midnight', 'Smoked', 'Thunder', 'Velvet', 'Honeyed', 'Black Pepper', 'Frozen', 'Crackling', "Hermit's", 'Drowned', 'Golden', 'Burnt-Sugar', 'Three-Fire', 'Quiet'],
  ingr: ['Salt', 'Ginger', 'Plum', 'Eel', 'Mushroom', 'Chestnut', 'Lotus', 'Squid', 'Pumpkin', 'Duck', 'Sesame', 'Yuzu', 'Boar', 'Seaweed'],
  base: ['Broth', 'Dumplings', 'Rice Bowl', 'Stew', 'Tart', 'Noodles', 'Skewers', 'Curry', 'Bread', 'Omelette', 'Soufflé', 'Pie', 'Hotpot', 'Buns'],
  form: ['Nocturne', 'Requiem', 'Suite', 'Ballad', 'Sonata', 'Lullaby', 'Elegy', 'Fugue', 'Hymn', 'Overture', 'Song'],
  adjW: ['Sunken', 'Burning', 'Last', 'Broken', 'Silent', 'Distant', 'Hollow', 'Northern', 'Small', 'Drowned', 'Sleeping'],
  noun: ['Bell', 'Harbor', 'Lantern', 'River', 'Gate', 'Tower', 'Moon', 'Orchard', 'Storm', 'Road', 'Garden', 'Ferry'],
  metal: ['Gold', 'Silver', 'Jade', 'Obsidian', 'Ivory', 'Amber', 'Bronze', 'Crystal', 'Coral'],
  obj: ['Crown', 'Mask', 'Chalice', 'Mirror', 'Compass', 'Throne', 'Lute', 'Dagger', 'Seal', 'Astrolabe', 'Music Box'],
  ill: ['Rot Lung', 'Glass Sickness', 'the Sleeping Pox', 'Marsh Fever', 'Red Tremor', 'Bone Chill', 'Hollow Cough', 'Night Blindness of the Saherta'],
  find: [p => `the Codex of ${p}`, p => `the lost library of ${p}`, p => `the Tomb of the ${pickR(DSC.adjW)} King`, p => `the star charts of ${p}`, p => `the first map of ${p}`, p => `the bell foundry under ${p}`]
};
const placeShort = () => { const p = String(pickR(PLACES)).replace(/^the /, ''); return p.includes(' of ') ? p.split(' of ').pop() : p; };
function discName(k, h){
  const last = h.last || h.name.split(' ').slice(-1)[0];
  if(k === 'species'){ const a = (h.career || '').startsWith('Sea') ? DSC.sea : DSC.land; return Math.random() < 0.22 ? `${last}'s ${pickR(a)}` : `the ${pickR(DSC.adjS)} ${pickR(a)}`; }
  if(k === 'dish') return Math.random() < 0.15 ? `${last}-style ${pickR(DSC.ingr)} ${pickR(DSC.base)}` : `${pickR(DSC.adjD)} ${pickR(DSC.ingr)} ${pickR(DSC.base)}`;
  if(k === 'work') return pickR([`${pickR(DSC.form)} for a ${pickR(DSC.adjW)} ${pickR(DSC.noun)}`, `${pickR(DSC.form)} of the ${pickR(DSC.noun)}`, `${pickR(DSC.form)} in ${placeShort()}`]);
  if(k === 'treasure') return `the ${pickR(DSC.metal)} ${pickR(DSC.obj)} of ${placeShort()}`;
  if(k === 'cure'){ const C = WORLD.crisis && CRISES[WORLD.crisis.k]; return C && C.areas.includes('Virus') && WORLD.crisis.until >= S.edition ? `the cure for ${C.name}` : `a vaccine against ${pickR(DSC.ill)}`; }
  return pickR(DSC.find)(placeShort());
}
const DISC_TXT = {
  species: (h, n) => pickR([`${h.name} describes a creature no book has: ${n}.`, `A new species goes into the Beast Registry: ${n}, found by ${h.name}.`]),
  dish: (h, n) => pickR([`${h.name} serves ${n} for the first time. The Gourmet list adds it within the year.`, `${n}, a dish by ${h.name}, is the talk of every kitchen in the Association.`]),
  work: (h, n) => pickR([`${h.name} finishes ${n}. It is played at the Association's winter gathering.`, `${n}, by ${h.name}, is heard for the first time.`]),
  treasure: (h, n) => pickR([`${h.name} brings ${n} back into the light.`, `After years on the trail, ${h.name} recovers ${n}.`]),
  cure: (h, n) => pickR([`${h.name} finds ${n}.`, `The Association announces ${n}, the work of ${h.name}.`]),
  find: (h, n) => pickR([`${h.name} uncovers ${n}.`, `Digging where nobody thought to dig, ${h.name} finds ${n}.`])
};
function discYear(ed, add){
  const D = WORLD.disc = WORLD.disc || [];
  HUNTERS.filter(h => usable(h) && h.edition < ed && DISC_OF[(h.career || '').replace(' Hunter', '')]).forEach(h => {
    if(Math.random() > 0.0035 * (1 + hStars(h) * 0.6)) return;
    const k = DISC_OF[h.career.replace(' Hunter', '')], name = discName(k, h);
    if(D.some(x => x.name === name)) return;
    D.push({id: 'D' + (++WORLD.seq), k, name, lic: h.license, by: h.name, ed});
    h.rp = (h.rp || 0) + 25;
    add(h, 'disc', capS(DISC_TXT[k](h, name)), 5);
  });
}
let DISC_F = '';
function discHtml(){
  const D = (WORLD.disc || []).slice().reverse(); if(!D.length) return '';
  const n = k => D.filter(x => x.k === k).length, L = D.filter(x => !DISC_F || x.k === DISC_F).slice(0, 10);
  const who = x => { const h = hLic(x.lic); return h ? `<a data-hunter="${esc(h.license)}">${esc(h.name)}</a>` : esc(x.by); };
  return `<div class="dsc"><div class="section-h">Discoveries${D.length > 10 ? '<a class="st-all" data-stall="disc">See all ›</a>' : ''}</div>
    <div class="dsc-f"><button type="button" class="chip" data-dscf="" aria-pressed="${!DISC_F}">All ${D.length}</button>${Object.keys(DISC_K).filter(n).map(k => `<button type="button" class="chip" data-dscf="${k}" aria-pressed="${DISC_F === k}">${DISC_K[k]} ${n(k)}</button>`).join('')}</div>
    ${L.map(x => `<div class="dsc-r"><span class="dsc-k">${DISC_K[x.k]}</span><span><b>${esc(capS(x.name))}</b><small class="muted">${who(x)} · ${ordinal(x.ed)}</small></span></div>`).join('')}</div>`;
}
// a Hunter's own discoveries, at the foot of the Chronicle
function worksHtml(h){ const D = (WORLD.disc || []).filter(x => x.lic === h.license); if(!D.length) return '';
  return `<div class="works"><div class="section-h">Works</div>${D.map(x => `<div class="dsc-r"><span class="dsc-k">${DISC_K[x.k]}</span><span><b>${esc(capS(x.name))}</b><small class="muted">${ordinal(x.ed)}</small></span></div>`).join('')}</div>`; }
document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-dscf]'); if(b){ DISC_F = b.dataset.dscf; renderWorld(); } });

/* ---------- 3. crews: Hunters who work together, for a while ---------- */
const CREW_A = ['Lantern', 'Salt', 'Iron', 'Ninth', 'Paper', 'Black Tide', 'Long Road', 'Quiet', 'Copper', 'Red Kite', 'Ember', 'Glass', 'Thistle', 'Night Ferry', 'Ash', 'Morning', 'Stray', 'Cinder', 'Hollow Moon', 'Last Light'];
const CREW_N = ['Company', 'Crew', 'Hands', 'Wardens', 'Lanterns', 'Ravens', 'Pilgrims', 'Knives', 'Lot', 'Table', 'Circle'];
const CREW_NUM = ['', '', 'Two', 'Three', 'Four'];
const CREW_ROLES = [['leader', a => (a.charisma || 0) + (a.strategy || 0)], ['the muscle', a => (a.combat || 0) + (a.endurance || 0)], ['the scout', a => (a.perception || 0) + (a.agility || 0)], ['the brain', a => (a.intelligence || 0) + (a.strategy || 0)]];
const CREW_JOB = ['clear a bandit road through {pl}', 'bring a stolen shipment back from {pl}', 'escort a scholar across {pl}', 'take a contract in {pl} that two crews before them gave up', 'spend the season tracking a smuggling ring out of {pl}', 'pull a family out of {pl} before the floods'];
const crewsOn = () => (WORLD.crews || []).filter(c => c.end == null);
const crewOf = h => crewsOn().find(c => c.m.includes(h.license));
const crewNames = (c, but) => { const n = c.m.filter(l => l !== but).map(l => (hLic(l) || {}).name).filter(Boolean); return n.length > 1 ? n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1] : n[0] || ''; };
function crewRoles(c){ const left = CREW_ROLES.slice(); c.r = {};
  c.m.map(hLic).filter(Boolean).sort((a, b) => Math.max(...CREW_ROLES.map(([, f]) => f(b.attrs || {}))) - Math.max(...CREW_ROLES.map(([, f]) => f(a.attrs || {})))).forEach(h => {
    if(!left.length) return; left.sort((x, y) => y[1](h.attrs || {}) - x[1](h.attrs || {})); c.r[h.license] = left.shift()[0]; }); }
function crewLog(c, ed, text, add, rank){ c.log = (c.log || []).concat({ed, t: text}).slice(-12); const L = c.m.map(hLic).filter(Boolean);
  if(L[0]) add(L[0], 'crew', text, rank || 3, L[1]);
  L.slice(2).forEach(h => (h.log = h.log || []).push({ed, text, k: 'crew'})); }
function crewsYear(ed, add){
  const C = WORLD.crews = WORLD.crews || [];
  // the gone leave; a crew of one is no crew
  crewsOn().forEach(c => {
    const gone = c.m.filter(l => { const h = hLic(l); return !h || !hActive(h); });
    if(gone.length){ c.m = c.m.filter(l => !gone.includes(l)); (c.past = c.past || []).push(...gone.map(l => ({lic: l, to: ed}))); }
    if(c.m.length < 2){ c.end = ed; const h = hLic(c.m[0]) || hLic(gone[0]); if(h){ const t = `${c.name} is no more: ${hActive(h) ? `${h.name} is the last of it, and works alone now` : 'nobody is left to carry the name'}.`; c.log = (c.log || []).concat({ed, t}); if(hActive(h)) add(h, 'crew', t, 3); } return; }
    if(c.m.some(l => !usable(hLic(l)))) return;   // half of them away: no news this year
    const r = Math.random(), L = c.m.map(hLic);
    if(r < 0.35){ L.forEach(h => { h.rp = (h.rp || 0) + 12; }); L.forEach((a, i) => L.slice(i + 1).forEach(b => tieUp(a, b))); crewLog(c, ed, `${c.name} (${crewNames(c)}) ${fillH(pickR(CREW_JOB), L[0], {pl: pickR(PLACES)})}.`, add, 3); }
    else if(r < 0.41){ const q = pickR(L), stay = Math.random() < 0.6;
      if(stay || c.m.length < 3) crewLog(c, ed, `${c.name} nearly splits over ${pickR(['money', 'a relic', 'who gave the order', 'a contract nobody wanted', 'something said at a funeral'])}. ${q.name} stays, for now.`, add, 3);
      else { c.m = c.m.filter(l => l !== q.license); (c.past = c.past || []).push({lic: q.license, to: ed}); crewLog(c, ed, `${q.name} walks out of ${c.name} after a quarrel over ${pickR(['money', 'a relic', 'who gave the order'])}.`, add, 4); (q.log = q.log || []).push({ed, text: `${q.name} leaves ${c.name}.`, k: 'crew'}); } }
    else if(r < 0.46 && c.m.length < 4){ const ties = L.flatMap(h => Object.keys(h.ties || {})).map(hLic).filter(x => usable(x) && !crewOf(x) && x.edition < ed);
      const n = ties[0]; if(n){ c.m.push(n.license); crewRoles(c); crewLog(c, ed, `${n.name} joins ${c.name}.`, add, 3); } }
    else if(r < 0.475 && ed - c.from >= 6){ c.end = ed; crewLog(c, ed, `After ${ed - c.from} years, ${c.name} goes separate ways, on good terms.`, add, 4); }
  });
  // a new crew now and then, out of people who already trust each other
  const want = Math.max(2, Math.round(HUNTERS.filter(h => usable(h)).length / 70));
  if(crewsOn().length >= want || Math.random() > 0.55) return;
  const free = h => usable(h) && !crewOf(h) && h.edition < ed;
  const seeds = HUNTERS.filter(h => free(h) && Object.keys(h.ties || {}).some(l => free(hLic(l)))); if(!seeds.length) return;
  const s = pickR(seeds), m = [s];
  Object.entries(s.ties || {}).sort((a, b) => b[1] - a[1]).map(([l]) => hLic(l)).filter(free).forEach(x => { if(m.length < 2 + Math.floor(Math.random() * 3)) m.push(x); });
  if(m.length < 3 && s.school) HUNTERS.filter(x => free(x) && x !== s && x.school === s.school && !m.includes(x)).slice(0, 1).forEach(x => m.push(x));
  if(m.length < 2) return;
  const taken = new Set(C.map(c => c.name)); let name;
  for(let t = 0; t < 20 && (!name || taken.has(name)); t++) name = `The ${pickR(CREW_A)} ${Math.random() < 0.3 ? CREW_NUM[m.length] : pickR(CREW_N)}`;
  if(taken.has(name)) return;
  const c = {id: 'C' + (++WORLD.seq), name, m: m.map(h => h.license), from: ed}; crewRoles(c); C.push(c);
  crewLog(c, ed, `${crewNames(c)} form a crew: ${name}.`, add, 4);
}
function crewRowHtml(h){
  const C = (WORLD.crews || []).filter(c => c.m.includes(h.license) || (c.past || []).some(p => p.lic === h.license)); if(!C.length) return '';
  const hl = l => { const x = hLic(l); return x ? `<a data-hunter="${esc(x.license)}">${esc(x.name)}</a>` : ''; };
  return C.slice(-2).map(c => { const now = c.end == null && c.m.includes(h.license), role = (c.r || {})[h.license];
    const to = now ? 'today' : ordinal(((c.past || []).find(p => p.lic === h.license) || {}).to ?? c.end);
    return `<p class="h-fam"><span>⚑</span> ${now ? 'In' : 'Once in'} <b>${esc(c.name)}</b>${role && now ? ` <span class="muted">as ${esc(role)}</span>` : ''}${now ? `, with ${c.m.filter(l => l !== h.license).map(hl).filter(Boolean).join(', ')}` : ''} <span class="muted">${ordinal(c.from)}–${to}</span></p>`; }).join('');
}

/* ---------- 2. feuds: two families at odds, sometimes for generations ---------- */
const famKey = (lic, G) => { const F = famOf(lic, G); if(!F) return null; let k = null; F.blood.forEach(id => { const n = G.N.get(id); if(n.h && !n.h.legacy && (!k || n.h.edition < k.edition || (n.h.edition === k.edition && n.h.license < k.license))) k = n.h; }); return k ? {k: k.license, name: surOf(k), n: [...F.blood].filter(id => G.N.get(id).h).length} : null; };
const feudsOn = () => (WORLD.feuds || []).filter(f => f.end == null);
function feudsYear(ed, add){
  const F = WORLD.feuds = WORLD.feuds || [];
  const R = HUNTERS.filter(h => usable(h) && (h.rivals || []).length); if(!R.length && !feudsOn().length) return;
  const G = famGraph(), cand = R.filter(h => (famOf(h.license, G) || {blood: new Set()}).blood.size >= 2);
  // a rivalry between two people from Hunter families can become their families' quarrel
  cand.forEach(h => { if(Math.random() > 0.03) return;
    const o = (h.rivals || []).map(cid => HUNTERS.find(x => x.cid === cid)).find(x => x && x.license !== h.license); if(!o) return;
    const a = famKey(h.license, G), b = famKey(o.license, G); if(!a || !b || a.k === b.k || a.n < 2 || b.n < 2) return;
    if(F.some(f => (f.a === a.k && f.b === b.k) || (f.a === b.k && f.b === a.k))) return;
    const f = {id: 'F' + (++WORLD.seq), a: a.k, b: b.k, an: a.name, bn: b.name, ed, why: `the rivalry between ${h.name} and ${o.name}`, by: [h.license, o.license]}; F.push(f);
    add(h, 'feud', `What started between ${h.name} and ${o.name} is now between their families: the ${a.name}s and the ${b.name}s are at odds.`, 5, o);
  });
  feudsOn().forEach(f => {
    const A = [...(famOf(f.a, G) || {blood: new Set()}).blood].map(id => G.N.get(id).h).filter(x => x && usable(x)), B = [...(famOf(f.b, G) || {blood: new Set()}).blood].map(id => G.N.get(id).h).filter(x => x && usable(x));
    if(!A.length || !B.length){ if(ed - f.ed > 30){ f.end = ed; f.how = 'nobody is left to carry it'; } return; }
    // a marriage across the line ends it
    const wed = A.find(x => x.spouse && B.some(y => y.license === x.spouse));
    if(wed){ f.end = ed; f.how = 'a marriage'; add(wed, 'feud', `The quarrel between the ${f.an}s and the ${f.bn}s ends at a wedding: ${wed.name} marries into the other side.`, 5, hLic(wed.spouse)); return; }
    const r = Math.random();
    if(r < 0.12){ const a = pickR(A), b = pickR(B); f.n = (f.n || 0) + 1;
      add(a, 'feud', pickR([`${a.name} and ${b.name} refuse to work the same contract. The ${f.an}s and the ${f.bn}s have not forgotten.`, `A ${f.an} and a ${f.bn} meet in ${pickR(PLACES)}: ${a.name} and ${b.name} come to blows before anyone can stop them.`, `${a.name} blocks ${b.name}'s candidacy for an Association post. Everyone knows why.`]), 4, b); }
    else if(r < 0.135 && ed - f.ed > 8){ f.end = ed; f.how = 'time'; add(pickR(A), 'feud', `After ${ed - f.ed} years, the ${f.an}s and the ${f.bn}s quietly let the old quarrel go.`, 4); }
  });
}
function feudsOf(lic){ if(!(WORLD.feuds || []).length) return []; const G = famGraph(), k = famKey(lic, G); if(!k) return []; return WORLD.feuds.filter(f => f.a === k.k || f.b === k.k).map(f => ({f, other: f.a === k.k ? f.bn : f.an, mine: f.a === k.k ? f.an : f.bn})); }
function feudRowHtml(h){ return feudsOf(h.license).slice(-2).map(({f, other, mine}) => `<p class="h-fam"><span>⚔</span> ${f.end == null ? `The ${esc(mine)}s have been at odds with the ${esc(other)}s since the ${ordinal(f.ed)}` : `An old quarrel with the ${esc(other)}s, ${ordinal(f.ed)}–${ordinal(f.end)}${f.how ? ', ended by ' + esc(f.how) : ''}`} <span class="muted">· ${esc(f.why)}</span></p>`).join(''); }
const feudNote = lic => { const L = feudsOf(lic).filter(x => x.f.end == null); return L.length ? ` · at odds with the ${L.map(x => esc(x.other) + 's').join(' and the ')}` : ''; };
// in the exam: children of two feuding families in the same year
function feudsEnter(N){
  const on = feudsOn(); if(!on.length || !N.candidates) return;
  const G = famGraph(), kin = N.candidates.filter(c => c.hParent).map(c => ({c, k: famKey(c.hParent, G)})).filter(x => x.k);
  on.forEach(f => { const a = kin.find(x => x.k.k === f.a), b = kin.find(x => x.k.k === f.b); if(!a || !b) return;
    log(N, 0, 'story', `${a.c.name} and ${b.c.name} sit the same exam. A ${f.an} and a ${f.bn}: their families have been at odds since the ${ordinal(f.ed)}.`, [a.c.id, b.c.id]); });
}

/* ---------- 4. Heaven's Arena: a tower of fighters, a few of them Hunters ---------- */
const AR_FL = [251, 248, 243, 240, 236, 230, 224, 219, 212, 205];
const arFighter = () => { const g = Math.random() < 0.5 ? 'Male' : 'Female', n = mkName(Math.random, g); return {name: n.name, g}; };
const arStrong = h => usable(h) && h.attrs && (h.attrs.combat || 0) >= 70;
function arenaYear(prev, ed, add){
  const A = WORLD.arena = WORLD.arena || {fm: AR_FL.map(fl => ({fl, ...arFighter(), since: ed - 1 - Math.floor(Math.random() * 6)})), cl: [], log: [], dead: 0};
  const note = t => { A.log.push({ed, t}); if(A.log.length > 40) A.log = A.log.slice(-40); };
  A.fm.forEach(s => {
    const h = s.lic && hLic(s.lic);
    if(s.lic && !(h && hActive(h))){ const n = arFighter(); note(`${s.name} no longer holds the ${ordinal(s.fl)} floor; ${n.name} takes it.`); Object.assign(s, {lic: null, ...n, since: ed}); return; }
    // a fighter who has held a floor a long time steps down sooner or later
    if(!s.lic && ed - s.since > 10 && Math.random() < 0.12){ const n = arFighter(); note(`${s.name} steps down from the ${ordinal(s.fl)} floor after ${ed - s.since} years; ${n.name} wins it in the open bout.`); Object.assign(s, {lic: null, ...n, since: ed}); return; }
    if(Math.random() > 0.11) return;
    const pool = HUNTERS.filter(x => arStrong(x) && !A.fm.some(y => y.lic === x.license)), hw = pool.length && Math.random() < 0.3 ? pickR(pool) : null;
    const loser = s.name, died = !s.lic && Math.random() < 0.08;
    if(hw){ note(`${hw.name} beats ${loser} for the ${ordinal(s.fl)} floor.`); add(hw, 'arena', `${hw.name} climbs Heaven's Arena to the ${ordinal(s.fl)} floor and takes it from ${loser}, its Floor Master of ${ed - s.since || 1} year${ed - s.since === 1 ? '' : 's'}.`, 5); Object.assign(s, {lic: hw.license, name: hw.name, since: ed}); }
    else { const n = arFighter(); note(`${n.name} beats ${loser} for the ${ordinal(s.fl)} floor${died ? `; ${loser} does not leave the ring alive` : ''}.`); if(died) A.dead = (A.dead || 0) + 1; if(h) add(h, 'arena', `${h.name} loses the ${ordinal(s.fl)} floor of Heaven's Arena to ${n.name}, an unknown.`, 4); Object.assign(s, {lic: null, ...n, since: ed}); }
  });
  // some who failed the exam go to the arena to get stronger
  ((prev && prev.candidates) || []).filter(c => c.status === 'Eliminated' && c.a && (c.a.combat || 0) >= 55 && Math.random() < 0.04).slice(0, 3).forEach(c => {
    const fl = Math.min(199, 40 + Math.floor(((c.a.combat || 0) - 50) * 3 + Math.random() * 90));
    A.cl.push({cid: c.id, name: c.name, ed, fl}); if(A.cl.length > 300) A.cl = A.cl.slice(-300); note(`${c.name}, who failed the ${ordinal(prev.edition)} exam, goes to Heaven's Arena and reaches the ${ordinal(fl)} floor.`); });
}
// back at the exam: the ones who trained in the tower say so
function arenaEnter(N){ const A = WORLD.arena; if(!A || !N.candidates) return; const by = new Map(A.cl.map(x => [x.cid, x]));
  N.candidates.forEach(c => { const x = by.get(c.id); if(!x || x.seen === N.edition) return; x.seen = N.edition; A.back = (A.back || 0) + 1; (c.notes = c.notes || []).push({p: 0, text: `Trained at Heaven's Arena after the ${ordinal(x.ed)} exam, up to the ${ordinal(x.fl)} floor`});
    log(N, 0, 'story', `${c.name} comes back from Heaven's Arena, where ${PR(c).they} fought up to the ${ordinal(x.fl)} floor.`, [c.id]); }); }
function arenaHtml(){
  const A = WORLD.arena; if(!A) return '';
  const hl = s => { const h = s.lic && hLic(s.lic); return h ? `<a data-hunter="${esc(h.license)}">${esc(h.name)}</a>` : esc(s.name); };
  const yrs = s => { const n = S.edition - s.since; return n <= 0 ? 'new this year' : `Floor Master, ${n} year${n === 1 ? '' : 's'}`; };
  return `<div><div class="section-h">Heaven's Arena</div><p class="muted" style="margin:0 0 10px">A tower of 251 floors where fighters climb for money and then for glory. From the 200th floor up, ten Floor Masters hold their floors against all comers.</p>
    <div class="hcard"><div><small>Floor Masters</small><b>${A.fm.length}</b></div><div><small>Hunters among them</small><b>${A.fm.filter(s => s.lic).length}</b></div><div><small>Came to the exam from here</small><b>${A.back || 0}</b></div><div><small>Died in the ring</small><b>${A.dead || 0}</b></div></div>
    <div class="ar-fl">${A.fm.map(s => `<div class="${s.lic ? 'hun' : ''}"><small>${ordinal(s.fl)} floor</small>${hl(s)}<span class="muted">${yrs(s)}${s.lic ? ' · Hunter' : ''}</span></div>`).join('')}</div>
    ${A.log.length ? `<div class="section-h" style="margin-top:14px">Lately</div><div class="bulletin">${A.log.slice(-8).reverse().map(x => `<div class="bl arena"><i>◈</i><span><span class="muted">${ordinal(x.ed)}</span> ${esc(x.t)}</span></div>`).join('')}</div>` : ''}</div>`;
}

/* ---------- 9. the year at a glance, on top of each issue of the Herald ---------- */
function glanceHtml(b){
  const ed = b.edition, I = b.items || [], hl = it => it.lic ? `<a data-hunter="${esc(it.lic)}">${esc(it.name)}</a>` : esc(it.name || '');
  const dead = I.filter(it => it.kind === 'death' && !(hLic(it.lic) && hActive(hLic(it.lic)))).sort((x, y) => y.rank - x.rank);
  const promo = I.filter(it => it.kind === 'promo').map(it => ({it, s: hLic(it.lic) ? hStars(hLic(it.lic)) : 1})).sort((x, y) => y.s - x.s);
  const disc = (WORLD.disc || []).filter(x => x.ed === ed), crews = (WORLD.crews || []).filter(c => c.from === ed), feuds = (WORLD.feuds || []).filter(f => f.ed === ed || f.end === ed);
  const rows = [];
  if(dead.length) rows.push(['Losses', `${hl(dead[0])}${dead.length > 1 ? ` <span class="muted">and ${dead.length - 1} other${dead.length > 2 ? 's' : ''}</span>` : ''}`]);
  if(promo.length) rows.push(['Promotions', `${hl(promo[0].it)} <span class="stars">${starStr(promo[0].s)}</span>${promo.length > 1 ? ` <span class="muted">and ${promo.length - 1} more</span>` : ''}`]);
  if(disc.length) rows.push(['Found', disc.slice(0, 2).map(x => `<i>${esc(capS(x.name))}</i>`).join(', ') + (disc.length > 2 ? ` <span class="muted">and ${disc.length - 2} more</span>` : '')]);
  if(crews.length) rows.push(['Crews', crews.map(c => `${esc(c.name)} <span class="muted">formed</span>`).join(', ')]);
  if(feuds.length) rows.push(['Families', feuds.map(f => f.end === ed ? `the ${esc(f.an)}s and the ${esc(f.bn)}s <span class="muted">make peace</span>` : `the ${esc(f.an)}s and the ${esc(f.bn)}s <span class="muted">at odds</span>`).join(', ')]);
  return rows.length >= 2 ? `<div class="glance">${rows.map(([k, v]) => `<div><span>${k}</span><span>${v}</span></div>`).join('')}</div>` : '';
}

function worldMoreYear(prev, ed, add){
  if(!MW_ON()) return;
  try { discYear(ed, add); } catch(e){ console.error(e); }
  try { crewsYear(ed, add); } catch(e){ console.error(e); }
  try { feudsYear(ed, add); } catch(e){ console.error(e); }
  try { arenaYear(prev, ed, add); } catch(e){ console.error(e); }
}
function worldMoreEnter(N){ try { feudsEnter(N); } catch(e){ console.error(e); } try { arenaEnter(N); } catch(e){ console.error(e); } }
