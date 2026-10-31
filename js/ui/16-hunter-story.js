/* ===================== A HUNTER'S LIFE: the story on their page, who they are, and the arcs that close over the years ===================== */
// Everything a candidate was (where they come from, what they did, why they came, what they fear and dream of) is
// rebuilt from their candidate id, so Hunters licensed long ago get it back too. The exam is told only when it matters.

// the person behind a license: the same seeds the candidate had
function hPerson(h){
  if(h._p && h._p.k === h.cid) return h._p;
  const p = {id: h.cid || h.license, a: h.attrs0 || h.attrs || {}, trait: h.trait, motive: h.motive, quirk: h.quirk, gender: h.gender, name: h.name, first: h.name.split(' ')[0], avenge: h.avenge};
  try { persona(p); background(p); } catch(e){ return null; }
  p.k = h.cid; Object.defineProperty(h, '_p', {value: p, enumerable: false, configurable: true, writable: true});   // never saved
  return p;
}
const hsCap = t => t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
const hsH = (h, k) => nhashUI((h.cid || h.license) + ':hs:' + k);
const hsPick = (h, arr, k) => arr[hsH(h, k) % arr.length];
const hsLog = (h, re) => (h.log || []).filter(x => re.test(x.text || ''));

/* ---------- arcs: what they came for, what they dream of, what they fear, who they become ---------- */
// one closing line per motive (same order as MOTIVES); {n} the name, {pl} a place
const ARC_MOTIVE = [
  "{n} finds the man who took {their} brother, in {pl}. The bounty is paid at last, and it is enough.",
  "{n} pays the last of the family debt. {They} frame the receipt.",
  "{n} finds {their} parent in {pl}, alive, old, and very sorry.",
  "{n} walks into the sealed ruins at {pl}, the first in a generation, and comes out with notebooks full.",
  "{n}'s family come to {pl} to see {them} receive a commendation. They say nothing, but they came.",
  "The medicine reaches {n}'s sister. She writes {them} a letter every month now.",
  "{n} goes back to the village a Hunter once saved, and saves it again.",
  "{n}'s face is on a billboard in {pl}. {They} {are} less happy about it than expected.",
  "{n} tracks down the beast that destroyed the family farm, in {pl}. It is over.",
  "{n} is finally invited to cook at a Gourmet table in {pl}.",
  "{n} recovers the stolen family heirloom from a collector in {pl}.",
  "{n} is, for the first time in {their} life, not bored.",
  "The old friend from the bet comes to {pl} to pay up. They laugh about it all night.",
  "{n} goes back home to {pl} on {their} own terms. Nobody plans {their} life now.",
  "{n}'s younger sibling passes the exam with {n} watching from the stands.",
  "{n}'s fighting style finally has a name, and two students.",
  "{n} opens the forbidden archive in {pl} and reads until the lamps run out.",
  "{n} meets the old partner again, in {pl}. The score is settled, quietly.",
  "{n} visits the dead mentor's grave in {pl} with a star on the license.",
  "{n}'s money keeps the orphanage open. The children call {them} by the wrong name and {they} let them.",
  "{n} crosses the closed border at {pl}, and keeps going.",
  "{n} finds the treasure everyone called a myth, in {pl}. It is smaller than the stories, and real.",
  "The court in {pl} clears {n}'s family name.",
  "The gang that burned {n}'s home is broken up in {pl}. {n} was there.",
  "{n} goes further than {they} ever thought, and still wants to see how far.",
  "{n} goes back to the fortune teller in {pl}. She only says: 'I told you.'",
  "{n}'s famous parent shakes {their} hand in front of everyone in {pl}.",
  "{n} finds what is left of the lost expedition in {pl}, and brings the names home.",
  "{n} finds a new city, {pl}, that remembers nothing about {them}. {They} stay.",
  "{n}'s beast sanctuary opens near {pl}.",
  "{n} finds the Hunter who saved {their} life, in {pl}, and says thank you.",
  "{n} buys back the family sword from the collector in {pl}.",
  "{n} reads the file on {their} village in the Hunter archives, and finally knows.",
  "{n} keeps the promise made to {their} late mother, in {pl}.",
  "No poacher has set foot on {n}'s island in years.",
  "Nobody pushes {n} around anymore.",
  "The person {n} wanted to impress finally notices, in {pl}. It matters less than {they} thought.",
  "The burned-down school in {pl} reopens, paid for by {n}.",
  "{n} finishes {their} grandfather's map of the coast.",
  "{n} finds the stranger who paid the entry fee, in {pl}, and pays it back.",
  "{n} earns the star {their} older sibling never got.",
  "{n} buys the cure only Hunters can buy, and takes it home."
];
// a few traits soften or harden over a career
const ARC_GROW = {'Hot-headed': ['Patient', 'has learned to count to ten'], 'Lone Wolf': ['Team Player', 'works with a partner now, and admits it helps'], 'Coward': ['Survivor', 'still feels the fear, and goes anyway'],
  'Quitter': ['Workhorse', 'has stopped giving up'], 'Show-off': ['Stoic', 'no longer needs anyone to watch'], 'Schemer': ['Diplomat', 'asks now, instead of arranging things'], 'Brute': ['Tactician', 'thinks first these days'],
  'Berserker': ['Guardian', 'fights for someone now, not just for the fight'], 'Klutz': ['Acrobat', 'trips far less than {they} used to'], 'Underdog': ['Born Leader', 'is the one others follow now'], 'Hermit': ['Charmer', 'goes to the parties now, and enjoys them'],
  'Daredevil': ['Watcher', 'looks before leaping these days'], 'Glass Cannon': ['Ironhide', 'can take a hit now'], 'Dreamer': ['Mastermind', 'turns the dreams into plans']};
function hunterArcs(ed, add){
  HUNTERS.forEach(h => {
    if(!hActive(h) || h.legacy || !h.cid) return;
    const yrs = ed - h.edition; if(yrs < 2) return;
    const p = hPerson(h); if(!p || !p.bg) return;
    const A = h.arc = h.arc || {}, P = PR(h), pl = pickR(PLACES), r = () => Math.random();
    const say = t => pro(t.replace(/\{n\}/g, h.name).replace(/\{pl\}/g, pl), h);
    // what they came for
    if(A.mo == null && p.motive != null && ARC_MOTIVE[p.motive] && !((p.motive === 40 || p.motive === 18) && hStars(h) < 1) && r() < 0.012 + Math.min(0.012, hStars(h) * 0.004)){ A.mo = ed; add(h, 'epilogue', say(ARC_MOTIVE[p.motive]), 5); return; }
    // what they dream of
    const D = BG.dream[p.bg.dream] || '';
    if(A.dr == null && D){ const ok = /three-star/.test(D) ? hStars(h) >= 3 && hunterAge(h) < 30 : /Dark Continent/.test(D) ? (h.log || []).some(x => /Dark Continent/.test(x.text)) : yrs >= 3 && r() < 0.01;
      if(ok){ A.dr = ed; add(h, 'epilogue', say(hsPick(h, [`{n} finally gets to ${D}.`, `For years {n} said {they} would ${D}. Now {they} {have}.`], 'dr')), 4); return; } }
    // what they fear
    if(A.fe == null && p.bg.fear != null && BG.fear[p.bg.fear] && r() < 0.008){ const F = BG.fear[p.bg.fear][0]; A.fe = ed;
      add(h, 'epilogue', say(hsPick(h, [`On a job near {pl}, {n} has to face ${F} for a whole night, and comes out the other side. {They} never mention it again.`, `{n} has been afraid of ${F} since childhood. In {pl}, {they} walk${P.s} straight into it to pull a partner out.`, `Nobody in {pl} knows {n} is afraid of ${F}. After this job, {they} {are} not.`], 'fe')), 4); return; }
    // who they become
    const G = ARC_GROW[h.trait];
    if(!h.grew && G && yrs >= 8 && r() < 0.02){ h.grew = {to: G[0], ed}; add(h, 'epilogue', say(`{n}, the ${traitNoun(h.trait)} of the ${ordinal(h.edition)} exam, ${G[1]}.`), 3); }
  });
}
// ordinary work now and then says something about the person doing it
const TRAIT_TAG = {'Hot-headed': ['{They} lose{s} {their} temper twice, and win anyway.'], 'Stoic': ['{They} do{es} not comment.'], 'Show-off': ['{They} make{s} sure someone takes a photo.'], 'Lone Wolf': ['Alone, as usual.'],
  'Schemer': ['Nobody is quite sure how.'], 'Charmer': ['The client sends flowers afterwards.'], 'Bookworm': ['{They} write{s} the report before the job is done.'], 'Coward': ['{Their} hands shake the whole time.'], 'Diplomat': ['Without a single fight.'],
  'Brute': ['The door does not survive.'], 'Klutz': ['{They} trip{s} twice on the way out.'], 'Dreamer': ['{They} spend{s} the evening sketching the place.'], 'Gentle Giant': ['{They} carr{ies} the client\'s bags.'], 'Watcher': ['{They} saw it coming a week before.'],
  'Hermit': ['{They} leave{s} before anyone can thank {them}.'], 'Daredevil': ['{They} take{s} the shortest way, which is also the most dangerous.'], 'Born Leader': ['Three others end up following {their} lead.'], 'Workhorse': ['{They} take{s} the next job the same night.'],
  'Survivor': ['{They} come{s} back with nothing but the job done.'], 'Tactician': ['Exactly as planned.'], 'Prodigy': ['{They} make{s} it look easy.'], 'Mastermind': ['Every step was planned months ago.'], 'Guardian': ['Nobody on {their} side gets hurt.']};
function traitTag(h, text){
  const T = TRAIT_TAG[(h.grew && h.grew.to) || h.trait]; if(!T || Math.random() > 0.25 || /[!?]$/.test(text)) return text;
  return text.replace(/\.?$/, '.') + ' ' + pro(pickR(T).replace(/\{(\w+)\}/g, (m, k) => PR(h)[k] !== undefined ? PR(h)[k] : m).replace(/\{s\}/g, PR(h).s), h);
}

/* ---------- the story on a Hunter's page ---------- */
function hunterStoryHtml(h){
  const p = hPerson(h); if(!p) return '';
  const P = PR(h), F = p.first, b = p.bg, say = t => pro(t, h), paras = [];
  // before
  const before = [];
  if(BG.origin[b.origin]) before.push(`${F} ${BG.origin[b.origin][0]}.`);
  if(BG.job[b.job]) before.push(hsPick(h, [`Before the license, ${F} ${BG.job[b.job]}.`, `For a while ${F} ${BG.job[b.job]}.`], 'job'));
  const mo = MOTIVES[p.motive];
  if(h.avenge) before.push(`{They} came to the exam to avenge ${h.avenge.hunter}${h.avenge.relH ? `, {their} ${h.avenge.relH}` : ''}.`);
  else if(mo && !h.pro && !h.regional) before.push(`{They} came to the exam ${mo.m}.`);
  if(before.length) paras.push(before.join(' '));
  // the exam, only when it is worth telling
  const n = h.attempts || 1, ex = []; let plainLic = '';
  if(h.pro) ex.push(`${F} was licensed before the exam records began.`);
  else if(h.regional) ex.push(`${F} was licensed by the regional office in ${h.regional}, at ${h.age}.`);
  else {
    const notable = n >= 3 || h.catTag || h.starCup || h.special || h.prodigy || h.mentored;
    const lic = `the ${ordinal(h.edition)} Hunter Exam`;
    if(n >= 3) ex.push(`It took ${F} ${n} attempts: ${n - 1} exams ended without a license before ${lic}, at ${h.age}.`);
    else if(h.catTag) ex.push(`${F} was licensed in ${lic}, the year it ended in ${h.catName || 'catastrophe'}, for what {they} did when it struck.`);
    else if(h.special === 'centenary') ex.push(`${F} was licensed in the Centenary, ${lic}, at ${h.age}.`);
    else if(h.special === 'jubilee') ex.push(`${F} was one of the many licensed in the Jubilee, ${lic}, at ${h.age}.`);
    else if(h.prodigy) ex.push(`${F} was licensed at only ${h.age}, in ${lic}.`);
    else plainLic = `Licensed in the ${ordinal(h.edition)}, at ${h.age}, `;
    if(h.starCup === 'champion') ex.push(`{They} won the Centennial Star that year, and started {their} career with a star.`);
    if(h.mentored) ex.push(`You trained {them} in your lodge.`);
    if(notable && h.nick && h.nickEd === h.edition) ex.push(`The exam gave {them} a name that stuck: "${h.nick}".`);
  }
  // after: the work, the biggest moments
  const after = [];
  const st = hStars(h);
  const alive = hActive(h);
  after.push(`${plainLic}${plainLic ? F.charAt(0) + F.slice(1) : F} ${alive ? 'works' : 'worked'} as ${aN(h.career || 'Hunter')}${st ? ` (${starStr(st)})` : ''}${h.home ? `, mostly out of ${h.home}` : ''}.`);
  const KIND_W = {chair: 9, zodiac: 8, elder: 7, exped: 6, epilogue: 6, award: 5, relic: 5, case: 5, hunt: 4, school: 4, promo: 3, nen: 3, bond: 3, wed: 3};
  const big = (h.log || []).map(x => ({x, k: careerKind(x)})).filter(o => KIND_W[o.k] && !/\b(dies|died|is killed|missing)\b/.test(o.x.text)).sort((a, c) => KIND_W[c.k] - KIND_W[a.k] || c.x.ed - a.x.ed);
  const seenK = {}, picks = []; big.forEach(o => { if(picks.length < 3 && (seenK[o.k] || 0) < (o.k === 'epilogue' ? 2 : 1)){ seenK[o.k] = (seenK[o.k] || 0) + 1; picks.push(o.x); } });
  picks.sort((a, c) => a.ed - c.ed).forEach(x => { const t = x.text.startsWith(h.name + ' ') && !x.text.startsWith(h.name + ' and ') ? x.text.slice(h.name.length + 1) : null;
    after.push(t ? `After the ${ordinal(x.ed)}, {they} ${t.replace(/^(is|was) /, (m, v) => v === 'is' ? (P.pl ? 'were ' : 'was ') : m)}` : x.text.split(h.name).join(F)); });
  // now
  const now = [];
  const kids = (WORLD.heirs || []).filter(k => (k.parents || []).includes(h.license)).length, sp = h.spouse && hLic(h.spouse);
  if(sp || kids) now.push(`${sp ? `${hsCap(P.they)} married ${sp.name}` : ''}${sp && kids ? ', and' : ''}${kids ? `${sp ? '' : hsCap(P.they)} ${h.status === 'Deceased' ? 'had' : P.have} ${kids === 1 ? 'a child' : fcNumS(kids) + ' children'}` : ''}.`);
  if(h.status === 'Deceased'){ const d = hsLog(h, /\b(dies|died|is killed|was killed)\b/).slice(-1)[0]; now.push(d ? d.text : `${F} died at ${hunterAge(h)}.`); }
  else if(h.status === 'Missing') now.push(`${F} has not been seen since the ${ordinal(h.missEd || h.diedEd || S.edition)}.`);
  else if(h.status === 'Retired') now.push(`${F} retired${h.retire && h.retire.age ? ` at ${h.retire.age}` : ''}${h.retire && h.retire.ed ? `, after the ${ordinal(h.retire.ed)}` : ''}.`);
  else now.push(hsPick(h, [`Today ${F} is ${hunterAge(h)}, and still working.`, `At ${hunterAge(h)}, ${F} is still out there.`], 'now'));
  const all = [paras.join(' '), ex.join(' '), after.join(' '), now.join(' ')].filter(Boolean).map(t => `<p class="hs-p">${autoLink(esc(say(t)), h.cid)}</p>`);
  return `<div class="hs"><div class="section-h">Story</div>${all.join('')}</div>`;
}
const fcNumS = n => (['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][n] || String(n));
// who they are, under the license
function whoHtml(h){
  const p = hPerson(h); if(!p || !p.bg) return '';
  const b = p.bg, A = h.arc || {}, say = t => esc(pro(t, h)), cell = (k, v, note, cls) => v ? `<div class="${cls || ''}"><small>${k}</small><span>${v}${note ? `<em>${note}</em>` : ''}</span></div>` : '';
  const tr = h.trait ? `${esc(hsCap(traitNoun(h.trait)))}: ${say(traitDesc(h.trait, p))}` : '';
  const grew = h.grew && ARC_GROW[h.trait] ? esc(pro(`${ARC_GROW[h.trait][1]}, since the ${ordinal(h.grew.ed)}`, h)) : '';
  const fear = b.fear != null && BG.fear[b.fear] ? hsCap(BG.fear[b.fear][0]) : '';
  const dream = BG.dream[b.dream] ? hsCap(say(BG.dream[b.dream])) : '';
  const mo = h.avenge ? `To avenge ${esc(h.avenge.hunter)}` : MOTIVES[p.motive] ? hsCap(say(MOTIVES[p.motive].m)) : '';
  return `<div class="hw"><div class="section-h">Who they are</div><div class="hw-g">
    ${cell('Temperament', tr, grew, 'wide')}
    ${cell(h.pro || h.regional ? 'Why a license' : 'Came to the exam', mo, A.mo != null ? `done, after the ${ordinal(A.mo)}` : '')}
    ${cell('Dream', dream, A.dr != null ? `came true after the ${ordinal(A.dr)}` : '')}
    ${cell('Afraid of', fear, A.fe != null ? `faced it after the ${ordinal(A.fe)}` : '', fear ? 'bad' : '')}
    ${QUIRKS[p.quirk] ? cell('Habit', hsCap(say(QUIRKS[p.quirk]))) : ''}
    ${BG.keep[b.keep] ? cell('Carries', hsCap(say(BG.keep[b.keep]))) : ''}
    ${BG.wait[b.wait] ? cell('Back home', say(BG.wait[b.wait])) : ''}
  </div></div>`;
}
