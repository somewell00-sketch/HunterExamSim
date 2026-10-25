/* ===================== THE FINAL, TOLD IN CHAPTERS: one per round, above the bracket ===================== */
// Before the bell, then each round (the preliminary and the license bout when there is one), the last match and an
// epilogue. The bracket stays as it is: the round being read lights up in it. During the live replay a chapter only
// shows the bouts already fought, and it follows the round being played until the reader picks another one.

const FCH = {ed: null, k: null, manual: false};
const fcFP = () => { const i = PHASES.findIndex(x => x.final); return i < 0 ? PHASES.length - 1 : i; };
// a legendary examiner, named the way people say it: Chairman X, Vice-Chairman X, X of the Zodiac (the Rabbit)
const legendName = (ex, leg) => /^Zodiac · /.test(leg) ? `${ex}, the Zodiac's ${leg.replace(/^Zodiac · /, '')},` : /^Former/.test(leg) ? `former Chairman ${ex}` : `${leg} ${ex}`;
const FC_H = s => nhashUI(S.seed + ':fc:' + s);
const fcPick = (arr, k) => arr[FC_H(k) % arr.length];
const FC_NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const fcNum = n => n <= 20 ? FC_NUM[n] : n < 100 && n % 10 === 0 ? ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'][n / 10] : n < 100 ? ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'][Math.floor(n / 10)] + '-' + FC_NUM[n % 10] : String(n);
const fcCap = t => t.charAt(0).toUpperCase() + t.slice(1);
const fcA = c => `<a data-id="${c.id}">${esc(c.name)}</a>`, fcF = c => `<a data-id="${c.id}">${esc(c.first || c.name)}</a>`;

/* ---------- the chapters this final has ---------- */
function fcRounds(){
  const B = S.bracket; if(!B) return [];
  const G = B.groups || [B], R = Math.max(0, ...G.map(g => g.rounds.length)), out = [];
  const real = m => m && !(m.bye && !m.examiner);
  if(B.prelim.length) out.push({k: 'P', lab: 'Preliminary', ms: B.prelim.filter(real)});
  const solo = [B.solo].concat(G.map(g => g.solo)).filter(real);
  for(let r = 0; r < R; r++){ const ms = G.map(g => g.rounds[r] || []).flat().filter(real); if(ms.length) out.push({k: 'r' + r, r, lab: r === R - 1 ? 'Last match' : 'Round ' + (r + 1), last: r === R - 1, ms}); }
  if(solo.length) out.push({k: 'EX', lab: 'License bout', ms: solo});
  return out.sort((a, b) => Math.min(...a.ms.map(m => m.seq)) - Math.min(...b.ms.map(m => m.seq)));
}
const fcSeen = m => revealed(m);
function fcChapters(){
  const rs = fcRounds().map(x => Object.assign({}, x, {shown: x.ms.filter(fcSeen)}));
  const L = [{k: 'pre', lab: 'Before the bell'}].concat(rs.filter(x => x.shown.length || (RP.active && x.ms.some(m => m.seq === RP.idx))));
  if(S.finished && !RP.active && S.starCup && !S.starCup.solo) L.push({k: 'SC', lab: '★ Centennial Star'});
  if(S.finished && !RP.active) L.push({k: 'ep', lab: 'Epilogue'});
  return {L, rs};
}

/* ---------- what each bout is made of ---------- */
let FCLOG = {key: null, map: {}};
function fcLog(id){
  const key = S.edition + ':' + S.log.length;
  if(FCLOG.key !== key){ const map = {}; S.log.forEach(e => { if(e.mt) (map[e.mt] = map[e.mt] || []).push(e); }); FCLOG = {key, map}; }
  return (FCLOG.map[id] || []).filter(e => !/^(Preliminary: there is no second chance here|.+ meet in the preliminary\. One of them goes home tonight)/.test(e.text));
}
const fcClean = t => t.replace(/\s{2,}/g, ' ').replace(/^(Round \d+|Preliminary|Last match|Fatal Duel): /, '').replace(/ \(#\d+\)/g, '').replace(/, after .+? vs .+?: /, ': ').replace(/ \S+ is out of the exam\.$/, '');
function fcBout(m){
  const ev = fcLog(m.id), RES = /concede|surrender|passes|is a Hunter|license goes|does not pass|disqualif|kill|dies|beats|wins|knocks out|gives up/i;
  let ki = -1; for(let k = ev.length - 1; k >= 0; k--) if(RES.test(ev[k].text) && ev[k].type !== 'story'){ ki = k; break; }
  const res = ki >= 0 ? ev[ki] : null;
  const story = ev.filter(e => e.type === 'story' && e !== res && !/^Everything comes down to this/.test(e.text)).sort((x, y) => y.text.length - x.text.length)[0], exq = ev.find(e => e.type === 'examiner');
  const sent = story ? story.text.match(/[^.!?]+[.!?]+["”]?/g) || [story.text] : [];
  const mi = sent.findIndex(s => /moment everyone remembers/i.test(s));
  const moment = mi >= 0 ? sent[mi].trim().replace(/^\s*The moment everyone remembers: /i, '').trim() : null;
  return {res, story, sent: sent.map(s => s.replace(/\s{2,}/g, ' ').trim()), mi, moment: moment ? fcCap(moment) : null, exq, ids: [...new Set(ev.flatMap(e => e.ids || []))]};
}

/* ---------- why a bout matters: what the two of them already share ---------- */
const fcNotes = c => (c.notes || []).map(n => n.text || '');
function fcDay(t){ const d = t.match(/^Day (\d+)/); return d ? `on day ${fcNum(+d[1])}` : 'on the island'; }
function fcHook(a, b, k){
  if(!a || !b) return null;
  const A = a.first || a.name, Bn = b.first || b.name, has = (x, y) => (x.bonds || []).some(o => o.id === y.id);
  const nA = fcNotes(a), nB = fcNotes(b), about = (n, y) => n.find(t => t.includes(y.name));
  if(has(a, b) || has(b, a)) return {w: 9, t: fcPick([`${fcF(a)} and ${fcF(b)} swore to see each other through. Now one of them has to beat the other.`, `Of everyone in the final, ${fcF(a)} had to draw ${fcF(b)}.`], 'bd' + k)};
  if(a.family && b.family && a.family.key === b.family.key) return {w: 9, t: fcPick([`Family against family: ${fcF(a)} and ${fcF(b)} came to the exam together.`, `${fcF(a)} and ${fcF(b)} share a name, and today they share a ring.`], 'fm' + k)};
  if((a.grudges || []).some(g => g.id === b.id) || (b.grudges || []).some(g => g.id === a.id)) return {w: 8, t: fcPick([`${fcF(a)} and ${fcF(b)} have been waiting for this.`, `Old grudge, new ring: ${fcF(a)} against ${fcF(b)}.`], 'gr' + k)};
  for(const [x, y, n] of [[a, b, nA], [b, a, nB]]){
    const t = about(n, y); if(!t) continue;
    const X = fcF(x), Y = fcF(y);
    if(/took badge/.test(t)) return {w: 8, t: `${X} took ${Y}'s badge ${fcDay(t)}. ${Y} has not forgotten.`};
    if(/traded/.test(t)) return {w: 7, t: `${X} and ${Y} traded badges ${fcDay(t)}. Now they have to fight each other.`};
    if(/gave a spare badge/.test(t)) return {w: 7, t: `${X} gave ${Y} a spare badge ${fcDay(t)}. It may not buy any mercy today.`};
    if(/side on Zevil|went back out to hunt for/.test(t)) return {w: 8, t: `${X} looked after ${Y} on Zevil Island. Today ${X} cannot.`};
    if(/team \d+ with/.test(t)) return {w: 6, t: `${X} and ${Y} came down the Trick Tower on the same team.`};
  }
  // someone one of them took a badge from, and the other stood beside
  for(const [x, y, n, ny] of [[a, b, nA, nB], [b, a, nB, nA]]){
    for(const t of n){ const mm = t.match(/took badge #\d+ from (.+?)(?: \(target\))?$/); if(!mm) continue; const v = mm[1];
      if(ny.some(u => u.includes(v) && /side|hunt for|helped by|gave a spare/.test(u)) || (y.bonds || []).some(o => (S.candidates.find(c => c.id === o.id) || {}).name === v))
        return {w: 8, t: `${fcF(x)} took ${esc(v)}'s badge ${fcDay(t)}. ${esc(v.split(' ')[0])} is the one ${fcF(y)} stood beside all week.`};
    }
  }
  const al = (S.alliances || []).find(A => (A.ever || []).includes(a.id) && (A.ever || []).includes(b.id));
  if(al) return {w: 6, t: fcPick([`${fcF(a)} and ${fcF(b)} were allies once, in ${esc(al.name)}.`, `${esc(al.name)} got them both this far. Only one of them goes through this door first.`], 'al' + k)};
  const gap = Math.abs(a.age - b.age); if(gap >= 18){ const o = a.age > b.age ? a : b, y = o === a ? b : a; return {w: 4, t: `${fcCap(fcNum(gap))} years between them. ${fcF(o)} was fighting before ${fcF(y)} could walk.`}; }
  return null;
}
// one thing about a single fighter, when the two of them share nothing
function fcSolo(c, k, m){
  if(!c) return null;
  if(m){ const first = bracketMatches().filter(x => (x.a === c.id || x.b === c.id) && !(x.bye && !x.examiner)).sort((x, y) => x.seq - y.seq)[0]; if(first && first !== m) return null; }   // told once, the first time they fight
  const n = fcNotes(c), A = fcF(c), at = (c.attempts || []).length + 1;
  const tt = n.find(t => /beat .+\(Combat\)/.test(t)); if(tt && FC_H('pc' + c.id + k) % 2) return {w: 2, t: `${A} has already beaten ${fcNum(Math.min((tt.match(/\(Combat\)/g) || []).length, 20))} of the Association's prisoners in a straight fight.`};
  if(at >= 3) return {w: 4, t: `This is ${A}'s ${ordinal(at)} attempt. ${fcCap(fcNum(at - 1))} times, ${PR(c).they} went home.`};
  if(c.hParent && c.hParentName) return {w: 4, t: `${A}'s parent, ${esc(c.hParentName)}, was a Hunter. ${A} has heard the stories all ${PR(c).their} life.`};
  const hz = n.find(t => /^Finished with (\d+) badges/.test(t)); if(hz && +hz.match(/\d+/)[0] >= 5) return {w: 3, t: `${A} left Zevil Island with ${fcNum(+hz.match(/\d+/)[0])} badges.`};
  return null;
}
const fcFollowed = c => c && (isFav(c.id) || (!MENTOR.off && mtOf(c.id)) || (typeof chCastAt === 'function' && chCastAt(fcFP()).includes(c.id)));
function fcBeat(m, k){
  const cm = cmap(S), a = cm[m.a], b = m.examiner ? null : cm[m.b], bo = fcBout(m), h = fcHook(a, b, k + m.id) || (a && b ? [fcSolo(a, k, m), fcSolo(b, k, m)].filter(Boolean).sort((x, y) => y.w - x.w)[0] : fcSolo(a, k, m));
  const score = (h ? h.w : 0) + (m.fatal ? 9 : 0) + (m.root ? 5 : 0) + (m.examiner ? 3 : 0) + ([a, b].some(fcFollowed) ? 5 : 0) + (bo.moment ? 1 : 0);
  return {m, a, b, bo, h, score};
}
// the bout as two or three sentences: why it matters, how it went, how it ended
function fcBeatHtml(x, useMoment){
  const L = linkNames, ids = x.bo.ids, parts = [];
  if(x.h) parts.push(x.h.t);
  if(x.bo.sent.length){ const s = x.bo.sent.filter((_, i) => useMoment ? true : i < x.bo.mi || x.bo.mi < 0).filter(s => !/^\d+ years between them/.test(s) || !x.h || !/years between/.test(x.h.t)).slice(0, 2).join(' '); if(s) parts.push(L(s, ids)); }
  if(x.bo.res) parts.push(L(fcClean(x.bo.res.text), ids));
  return parts.join(' ');
}

/* ---------- the chapters ---------- */
function fcArticle(kicker, title, prev, scenes, splash, nxt, more){
  let h = `<article class="wt2 fch"><div class="wt2-h"><span>${kicker}</span><h3>${esc(title)}</h3></div>`;
  if(prev) h += `<p class="wt-prev">${prev}</p>`;
  const fig = splash ? `<figure class="wt-splash fin"><span class="sfx" aria-hidden="true">${splash.sfx}</span><span class="mo-k">${esc(splash.k)}</span><blockquote>${splash.t}</blockquote></figure>` : '';
  scenes.forEach((s, i) => { if(splash && i === splash.at) h += fig; h += `<div class="wt-scene"><span class="wt-time">${esc(s.l)}</span>${s.ps.map((p, j) => `<p${i === 0 && j === 0 ? ' class="drop"' : ''}>${p}</p>`).join('')}</div>`; });
  if(splash && splash.at >= scenes.length) h += fig;
  if(more) h += more;
  if(nxt) h += `<div class="next"><span>${esc(nxt.k)}</span><p>${nxt.t}</p></div>`;
  return h + '</article>';
}
function fcPre(rs){
  const cm = cmap(S), B = S.bracket, ph = PHASES[fcFP()], ex = ph.ex ? ph.ex.name : 'The examiner';
  const fin = S.candidates.filter(c => c.out === fcFP() || c.status === 'Approved' || (c.status === 'Active' && S.phase >= fcFP())).filter(c => bracketMatches().some(m => m.a === c.id || m.b === c.id));
  const n = fin.length, k = 'pre';
  const haul = c => { const t = fcNotes(c).find(x => /^Finished with \d+ badges/.test(x)); return t ? +t.match(/\d+/)[0] : (c.badges || []).length; }, pts = c => { const t = fcNotes(c).find(x => /^Finished with \d+ badges, \d+ points/.test(x)); return t ? +t.match(/(\d+) points/)[1] : 0; };
  const top = fin.slice().sort((a, b) => pts(b) - pts(a) || haul(b) - haul(a))[0];
  const prev = top && haul(top) >= 3 ? `Previously: ${fcA(top)} left Zevil Island with ${fcNum(haul(top))} badges, and more points than anyone in this room.` : null;
  const rule = (B.groups ? 'Four brackets run side by side, each with its own last match. ' : '') + (B.prelim.length ? 'The weakest records fight first, in a preliminary with no second chances. After that: win one fight and you are a Hunter.' : B.groups ? 'Win once and you are a Hunter.' : B.solo && !B.rounds.length ? 'One finalist, one examiner, one bout.' : 'Win one fight and you are a Hunter. Lose every fight and you are the only one who goes home.');
  const open = ph.ex && ph.ex.legend ? `${fcCap(fcNum(n))} finalists, and ${esc(legendName(ex, ph.ex.legend)).replace(/,$/, '')} examines them in person. Nobody sits near anybody.`
    : fcPick([`${fcCap(fcNum(Math.min(n, 99)))} candidates, one room, and nobody sits near anybody. ${esc(ex)} reads the bracket out once and does not repeat it.`, `${esc(ex)} lets the ${fcNum(Math.min(n, 99))} finalists wait an hour before saying a word. Then ${esc(ex)} reads the bracket, once.`, `The room is too small for ${fcNum(Math.min(n, 99))} people who all want the same thing. ${esc(ex)} does not seem to mind.`], 'op');
  const s1 = {l: fcPick(['The waiting room', 'Before anyone moves', 'The last hour'], 'l1'), ps: [`${open} ${rule}`]};
  // the ties already running through the room
  const ties = []; for(let i = 0; i < fin.length; i++) for(let j = i + 1; j < fin.length; j++){ const h = fcHook(fin[i], fin[j], 'pre' + i + j); if(h && h.w >= 6) ties.push(Object.assign({x: fin[i], y: fin[j]}, h)); }
  ties.sort((a, b) => b.w - a.w || (fcFollowed(b.x) || fcFollowed(b.y) ? 1 : 0) - (fcFollowed(a.x) || fcFollowed(a.y) ? 1 : 0));
  const used = new Set(), tieL = []; ties.forEach(t => { if(tieL.length < 2 && !used.has(t.x.id) && !used.has(t.y.id)){ used.add(t.x.id); used.add(t.y.id); tieL.push(t.t.replace(/Now they have to fight each other\.|Today .+ cannot\.|It may not buy any mercy today\./, fcPick(['Now they keep glancing at each other across the room.', 'Neither of them knows yet whether that makes them friends.'], 'tg' + tieL.length))); } });
  // someone they came with, who is not here
  const gone = fin.map(c => { const o = (c.bonds || []).map(b => cm[b.id]).find(o => o && o.out != null && o.out < fcFP()); return o ? {c, o} : null; }).filter(Boolean).sort((a, b) => (fcFollowed(b.c) ? 1 : 0) - (fcFollowed(a.c) ? 1 : 0))[0];
  if(gone && !used.has(gone.c.id)) tieL.push(`${fcA(gone.c)} came this far with ${fcF(gone.o)}. ${fcF(gone.o)} fell ${PHASES[gone.o.out] ? (PHASES[gone.o.out].zevil ? 'on Zevil Island' : 'in the ' + esc(PHASES[gone.o.out].name)) : 'along the way'}. ${fcF(gone.c)} keeps looking at the door anyway.`);
  const scenes = [s1]; if(tieL.length) scenes.push({l: fcPick(['The last minutes', 'Across the room', 'Waiting'], 'l2'), ps: tieL});
  // the splash: the one the room keeps looking at
  const old = fin.slice().sort((a, b) => b.age - a.age), young = old[old.length - 1];
  let sp = null; const pick = fin.filter(c => !used.has(c.id));
  const back = pick.find(c => fcNotes(c).some(t => /went back out to hunt for/.test(t)));
  const vet = pick.slice().sort((a, b) => (b.attempts || []).length - (a.attempts || []).length)[0];
  if(old[0] && young && old[0].age - young.age >= 20 && !used.has(old[0].id)) sp = `${fcA(old[0])} is ${fcNum(old[0].age)}, the oldest finalist by ${fcNum(old[0].age - (old[1] || young).age)} year${old[0].age - (old[1] || young).age === 1 ? '' : 's'}. ${back === old[0] ? `${fcCap(PR(old[0]).they)} spent the last day on Zevil hunting somebody else's target. Today, nobody is hunting for ${PR(old[0]).them}.` : `${fcCap(fcNum(young.age))}-year-old ${fcF(young)} is in the same room.`}`;
  else if(back) sp = `${fcA(back)} spent the last day on Zevil hunting somebody else's target. Today, nobody is hunting for ${PR(back).them}.`;
  else if(vet && (vet.attempts || []).length >= 2) sp = `This is ${fcA(vet)}'s ${ordinal((vet.attempts || []).length + 1)} final room, or close to it. ${fcF(vet)} knows exactly how quiet it gets.`;
  else if(young) sp = `${fcA(young)} is ${fcNum(young.age)}, the youngest here. Nobody has told ${PR(young).them} to be afraid, so ${PR(young).they} ${PR(young).are} not.`;
  const first = rs.find(x => x.ms.length), fb = first ? first.ms.map(m => fcBeat(m, 'n')).sort((a, b) => b.score - a.score)[0] : null;
  const nxt = fb ? {k: 'Next · ' + first.lab, t: fb.h && fb.h.w >= 6 ? fb.h.t : fb.b ? `${fcF(fb.a)} draws ${fcF(fb.b)}.` : `${fcF(fb.a)} against the examiner.`} : null;
  const title = fcPick([`${fcCap(fcNum(Math.min(n, 20)))} Left`, 'Before the Bell', 'One Win Away', 'The Last Room'], 'tt' + n);
  return fcArticle('Final · Before the bell', title, prev, scenes, sp ? {at: scenes.length > 1 ? 1 : 1, k: 'Moment before the bell', t: sp, sfx: 'シン'} : null, nxt);
}
const FC_LAB = [['First bell', 'Across the floor', 'Last fight of the round'], ['The opening bout', 'Meanwhile', 'Before the dust settles'], ['Ring one', 'Ring two', 'Ring three'], ['Early', 'The middle of it', 'Late']];
const FC_TITLE = {
  r: ['Four Doors', 'First Blood', 'The Easy Way Out', 'Nobody Waits', 'Doors Open', 'One Win'],
  mid: ['Second Chances', 'Again', 'No Margin', 'The Ones Still Fighting', 'Back in the Ring'],
  last: ['One Chair Left', 'The Last Match', 'Nothing Left but This', 'Whoever Falls'],
  P: ['No Second Chance', 'Before the Bracket', 'Sudden Death'],
  EX: ['Against the Examiner', 'The License Bout']
};
function fcRound(x, i, all){
  const k = x.k, beats = x.shown.map(m => fcBeat(m, k)), ord = beats.slice().sort((a, b) => b.score - a.score);
  const star = ord[0], rest = beats.filter(b => b !== star), lab = fcPick(FC_LAB, 'lb' + k);
  const big = rest.slice().sort((a, b) => b.score - a.score).slice(0, 3), small = rest.filter(b => !big.includes(b));
  const scenes = big.sort((a, b) => a.m.seq - b.m.seq).map((b, j) => ({l: lab[j] || lab[2], ps: [fcBeatHtml(b)]}));
  // the moment of the round: the best bout, told with its sharpest line
  let sp = null;
  if(star){ const L = linkNames, ids = star.bo.ids, mo = star.bo.moment ? L(star.bo.moment, ids) : null;
    sp = [star.h ? star.h.t : '', mo || (star.bo.sent[0] ? L(star.bo.sent[0], ids) : ''), star.bo.res ? L(fcClean(star.bo.res.text), ids) : ''].filter(Boolean).join(' '); }
  if(x.last && star){   // the last match is the whole chapter: before the bell, the moment, after
    const loser = cmap(S)[star.m.l], q = star.bo.exq;
    const S0 = star.bo.sent, cutAt = star.bo.mi > 0 ? Math.min(star.bo.mi, 2) : Math.min(1, S0.length), bS = S0.slice(0, cutAt), aS = star.bo.mi >= 0 ? [] : S0.slice(cutAt, cutAt + 2);
    const before = [q ? `${linkNames(fcClean(q.text), q.ids || [])}` : `${esc(PHASES[fcFP()].ex ? PHASES[fcFP()].ex.name : 'The examiner')} says nothing at all. Nobody expects a speech.`].concat(bS.map(s => linkNames(s, star.bo.ids)));
    scenes.unshift({l: 'Before the bell', ps: before});
    const lic = S.candidates.filter(c => c.status === 'Approved').length;
    const others = S.candidates.filter(c => c.out === fcFP() && c.status !== 'Approved' && c !== loser).length;
    if(loser) scenes.push({l: 'After', ps: [`${fcF(loser)} ${others ? 'is the last finalist to walk' : `is the only one of the ${fcNum(Math.min(lic + 1, 99))} who walks`} out without a card. ${fcCap(fcNum(Math.min(lic, 99)))} new Hunters watch ${PR(loser).them} go. Nobody knows what to say, so nobody says anything.`]});
    sp = [star.bo.moment ? linkNames(star.bo.moment, star.bo.ids) : aS.map(s => linkNames(s, star.bo.ids)).join(' '), star.bo.res ? linkNames(fcClean(star.bo.res.text), star.bo.ids) : ''].filter(Boolean).join(' ');
  }
  const more = small.length ? `<details class="more"><summary>The other bouts · ${small.length}</summary>${small.map(b => `<p>${b.bo.res ? linkNames(fcClean(b.bo.res.text), b.bo.ids) : ''}</p>`).join('')}</details>` : '';
  // previously: the moment of the chapter before; next: the bout everyone is waiting for
  const pi = all.indexOf(x), px = pi > 0 ? all[pi - 1] : null;
  let prev = null;
  if(px){ const pb = px.shown.map(m => fcBeat(m, px.k)).sort((a, b) => b.score - a.score)[0]; if(pb && pb.bo.res) prev = 'Previously: ' + linkNames(fcClean(pb.bo.res.text), pb.bo.ids); }
  const nx = all[pi + 1];
  let nxt = null;
  if(nx && nx.ms.length && (!RP.active || x.shown.length === x.ms.length)){ const nb = nx.ms.map(m => fcBeat(m, nx.k)).sort((a, b) => b.score - a.score)[0];
    const known = nb && (!RP.active || [nb.m.a, nb.m.b].every(id => !id || id === 'examiner' || bracketMatches().some(m => m.seq < RP.idx && (m.l === id || m.a === id && nx.r === 0))));
    nxt = {k: 'Next · ' + nx.lab, t: nb && known ? (nb.h && nb.h.w >= 6 ? nb.h.t : nb.b ? `${fcF(nb.a)} draws ${fcF(nb.b)}.` : `${fcF(nb.a)} faces the examiner.`) : 'The draw is still being made.'}; }
  else if(!nx && x.shown.length === x.ms.length && S.finished && !RP.active && S.starCup && !S.starCup.solo) nxt = {k: 'Next · ★ Centennial Star', t: 'The best new Hunters of the hundredth exam fight once more, for a star.'};
  else if(!nx && x.shown.length === x.ms.length && S.finished && !RP.active) nxt = {k: 'Next · Epilogue', t: (n => `${fcCap(fcNum(Math.min(n, 99)))} new Hunter${n === 1 ? '' : 's'}, and what they leave with.`)(S.candidates.filter(c => c.status === 'Approved').length)};
  if(RP.active && x.shown.length < x.ms.length) nxt = {k: 'Live', t: `${fcCap(fcNum(x.ms.length - x.shown.length))} bout${x.ms.length - x.shown.length === 1 ? '' : 's'} still to fight in this round.`};
  const tk = x.k === 'P' ? 'P' : x.k === 'EX' ? 'EX' : x.last ? 'last' : x.r === 0 ? 'r' : 'mid';
  const title = fcPick(FC_TITLE[tk], 'tt' + k + S.edition);
  return fcArticle(`Final · ${esc(x.lab)}`, title, prev, scenes, sp ? {at: x.last ? 1 : Math.min(2, scenes.length), k: x.last ? 'Moment of the last match' : 'Moment of the round', t: sp, sfx: x.last ? 'ゴゴゴ' : fcPick(['ドン', 'バキ', 'ドゴッ', 'ズン'], 'sx' + k)} : null, nxt, more);
}
// the centenary's last word: the best new Hunters fight once more, for a star instead of a license
function fcStar(){
  const C = S.starCup, cm = cmap(S); if(!C) return '';
  const champ = cm[C.champ], sents = t => (t || '').match(/[^.!?]+[.!?]+["”]?/g) || [];
  const tale = (x, n) => sents(x.tale).map(s => s.trim()).filter(s => !/^(Nobody fails today|They fight for the right)/.test(s)).slice(0, n);
  const res = x => { const w = cm[x.w], l = cm[x.l]; return w && l ? `${fcA(w)} beats ${fcA(l)} by ${esc(x.how)}.` : ''; };
  const semis = C.matches.filter(x => x.round !== 'Final'), fin = C.matches.find(x => x.round === 'Final');
  const lic = S.candidates.filter(c => c.status === 'Approved').length;
  const scenes = [{l: 'The next morning', ps: [C.solo ? `${champ ? fcA(champ) : 'One new Hunter'} is the only new Hunter of the centenary. Nobody is left to fight.` : `${fcCap(fcNum(Math.min(lic, 99)))} new Hunters wake up with a license, and ${(n => n >= lic ? (n === 2 ? 'both' : 'all ' + fcNum(n)) + ' of them are' : fcNum(n) + ' of them are')((C.seeds || []).length || semis.length * 2)} asked to fight again. No license is at stake: only a star, and the hundredth exam's name next to theirs.`]}];
  semis.forEach((x, i) => { const a = cm[x.a], b = cm[x.b], h = fcHook(a, b, 'sc' + i); scenes.push({l: semis.length > 1 ? `Semi-final ${i + 1}` : 'The semi-final', ps: [[h ? h.t : '', autoLink(esc(tale(x, 3).join(' '))), res(x)].filter(Boolean).join(' ')]}); });
  const byeId = C.seeds && C.seeds.length === 3 ? C.seeds[0] : null;
  if(byeId && cm[byeId]) scenes.push({l: 'Waiting', ps: [`${fcA(cm[byeId])} was the best of the exam, and waits for the final with nothing to do but watch.`]});
  let sp = null;
  if(fin){ const ft = tale(fin, 99), hz = ft.findIndex(x => /Hatsu/.test(x)), cut = hz >= 0 && hz >= ft.length - 5 ? hz : Math.max(0, ft.length - 3);   // the splash starts where the fight turns (a Hatsu, when there is one)
    sp = {at: scenes.length, k: 'Moment of the Centennial Star', t: [autoLink(esc(ft.slice(cut).join(' '))), res(fin)].filter(Boolean).join(' '), sfx: '星'};
    if(cut > 0) scenes.push({l: 'The final', ps: [autoLink(esc(ft.slice(0, cut).join(' ')))]}); sp.at = scenes.length; }
  if(champ) scenes.push({l: 'After', ps: [`${fcA(champ)} starts ${PR(champ).their} career with a star already on the license. ${fcCap(PR(champ).they)} will be asked about this day for the rest of ${PR(champ).their} life.`]});
  const lastM = bracketMatches().filter(m => m.root).map(m => fcBout(m)).find(b => b.res);
  return fcArticle('Final · The Centennial Star', fcPick(['One Star', 'No License at Stake', 'The Best of the Hundredth', 'For the Star'], 'sct' + S.edition),
    lastM ? 'Previously: ' + linkNames(fcClean(lastM.res.text), lastM.ids) : null, scenes, sp, {k: 'Next · Epilogue', t: `${fcCap(fcNum(Math.min(lic, 99)))} new Hunter${lic === 1 ? '' : 's'}, and what they leave with.`});
}
function fcEpilogue(){
  const cm = cmap(S), passed = S.candidates.filter(c => c.status === 'Approved'), lostL = S.candidates.filter(c => c.out === fcFP() && c.status !== 'Approved');
  const nickOf = c => { const t = fcNotes(c).find(x => /^Earned the nickname/.test(x)); return t ? (t.match(/"([^"]+)"/) || [])[1] : null; };
  const finalists = passed.concat(lostL), lastM = bracketMatches().filter(m => m.root), inLast = c => lastM.some(m => m.a === c.id || m.b === c.id);
  // what each of them leaves with, from their own story: why they came, who waits at home, what they want next, what they chose
  const beats = c => {
    const b = background(c), mo = MOTIVES[c.motive] || null, P0 = PR(c), A = fcA(c), F = fcF(c), n = fcNotes(c), ok = c.status === 'Approved', out = [];
    const k = x => 'ep' + x + c.id, pk = (arr, x) => fcPick(arr, k(x)), say = t => pro(t, c);
    if(c.avenge) out.push({kind: 'motive', t: ok ? pk([`${A} came to avenge ${esc(c.avenge.hunter)}. ${c.avenge.killer ? `With a license, ${P0.they} can finally go looking for ${esc(c.avenge.killer)}.` : `With a license, ${P0.they} can finally ask the questions nobody would answer.`}`, `${A} never forgot why ${P0.they} came: ${esc(c.avenge.hunter)}, who never came home. Now ${P0.they} ${P0.have} a license to go and find out.`], 'av')
      : `${A} came to avenge ${esc(c.avenge.hunter)}, and goes home without a license. It will have to wait.`});
    else if(mo) out.push({kind: 'motive', t: ok ? pk([`${A} came ${say(mo.m)}. ${say(mo.pass)}`, `${A} came ${say(mo.m)}, and did it. ${say(mo.pass)}`], 'mo') : c.status === 'Deceased' ? `${A} came ${say(mo.m)}. ${P0.Their} last words: "${esc(say(mo.last))}"` : `${A} came ${say(mo.m)}. ${say(mo.fail)}`});
    if(b && BG.wait[b.wait]) out.push({kind: 'home', t: ok ? `${A} goes home a Hunter. ${say(BG.wait[b.wait])}` : `${A} goes home without a card. ${say(BG.wait[b.wait])}`});
    if(ok && b && BG.dream[b.dream]) out.push({kind: 'dream', t: pk([`${A} wants to ${say(BG.dream[b.dream])}. Nothing stands in the way now.`, `First on ${F}'s list, now that it is real: ${say(BG.dream[b.dream])}.`, `Ask ${F} what comes next and the answer is always the same: ${say(BG.dream[b.dream])}.`], 'dr')});
    const car = n.map(t => t.match(/^Chose a career as an? (.+)$/)).find(Boolean);
    if(car && b && BG.job[b.job]) out.push({kind: 'career', t: pk([`Before the exam, ${F} ${say(BG.job[b.job])}. Now ${P0.they} ${P0.are} a ${esc(car[1])}.`, `${A}, who ${say(BG.job[b.job])} not long ago, chooses to be a ${esc(car[1])}.`], 'cr')});
    const nen = n.map(t => t.match(/awakened Nen as an? (\w+) user\. Hatsu: ([^(]+?)\s*(?:\(|$)/)).find(Boolean);
    if(nen) out.push({kind: 'nen', t: pk([`Within days, ${A} awakens Nen. ${P0.Their} first Hatsu is called ${esc(nen[2])}.`, `${A} turns out to be a ${esc(nen[1])} user, and names ${P0.their} Hatsu ${esc(nen[2])}.`], 'nn')});
    if(ok && b && BG.keep[b.keep]) out.push({kind: 'keep', t: `${A} still carries ${say(BG.keep[b.keep])}. It has a license next to it now.`});
    if(!ok && c.status !== 'Deceased') out.push({kind: 'back', t: `${A} goes home without a card. ${fcCap(P0.they)} will be back, or so ${P0.they} say${P0.s}.`});
    if(nickOf(c)) out.push({kind: 'nick', t: ok ? `${A} leaves with a license and a new name: ${esc(nickOf(c))}.` : `${A} leaves with a name ${P0.they} did not ask for: ${esc(nickOf(c))}.`});
    return out;
  };
  // the order: the star, the pair who leave together, the one who missed by a fight, then the people the reader follows, then the rest
  const P = [], usedK = {}, usedC = new Set();
  if(S.starCup && S.starCup.champ && cm[S.starCup.champ]){ P.push(`${fcA(cm[S.starCup.champ])} wins the Centennial Star, and starts ${PR(cm[S.starCup.champ]).their} career as a ★ Hunter.`); usedC.add(S.starCup.champ); }
  const pair = (() => { for(const c of passed) for(const b of c.bonds || []){ const o = cm[b.id]; if(o && o.status === 'Approved' && c.id < o.id) return [c, o]; } return null; })();
  if(pair){ P.push(`${fcA(pair[0])} and ${fcA(pair[1])} leave together. Both Hunters now.`); usedC.add(pair[0].id); usedC.add(pair[1].id); }
  const order = finalists.slice().sort((x, y) => ((inLast(y) && y.status !== 'Approved') ? 4 : 0) + (fcFollowed(y) ? 2 : 0) + (FC_H('eo' + y.id) % 100) / 100 - ((inLast(x) && x.status !== 'Approved') ? 4 : 0) - (fcFollowed(x) ? 2 : 0) - (FC_H('eo' + x.id) % 100) / 100);
  let nicks = 0, losers = 0;
  for(const c of order){
    if(P.length >= 4) break; if(usedC.has(c.id)) continue;
    if(c.status !== 'Approved' && losers++ >= 1) continue;   // one line for those who go home; the epilogue belongs to the new Hunters
    // each kind of line once per epilogue; a nickname at most once, and only now and then
    const opts = beats(c).filter(x => !usedK[x.kind] && (x.kind !== 'nick' || (!nicks && FC_H('nk' + S.edition) % 3 === 0)));
    if(!opts.length) continue;
    const x = opts[FC_H('ek' + c.id) % Math.min(opts.length, 3)];
    usedK[x.kind] = 1; usedC.add(c.id); if(x.kind === 'nick') nicks++; P.push(x.t);
  }
  const E = S.castEver || [], first = E.filter(x => x.p === 0).map(x => cm[x.id]).filter(Boolean), fh = first.filter(c => c.status === 'Approved').length, later = E.filter(x => x.p > 0).map(x => cm[x.id]).filter(Boolean), lh = later.filter(c => c.status === 'Approved').length;
  const watch = first.length ? (fh ? `${fcCap(fcNum(fh))} of the ${fcNum(first.length)} the first trial introduced made it all the way to a license.` : `None of the ${fcNum(first.length)} the first trial introduced made it this far.`) + (later.length ? ` ${fcCap(fcNum(Math.min(later.length, 99)))} others joined them along the way, and ${lh ? fcNum(lh) + ' of them ' + (lh === 1 ? 'is a Hunter' : 'are Hunters') + ' now' : 'none of them passed'}.` : '') : null;
  const scenes = [{l: 'After the exam', ps: P.length ? P : [`${fcCap(fcNum(Math.min(passed.length, 99)))} new Hunters walk out into the daylight.`]}];
  if(watch) scenes.push({l: 'The ones to watch', ps: [watch]});
  // the last word: the license that means the most to someone else
  const lines = licLines(passed), best = passed.map(c => ({c, t: lines[c.id] || ''})).filter(x => /[A-Z][a-z]+ [A-Z][a-z]+|came to|half|promise|for /.test(x.t)).sort((a, b) => (fcFollowed(b.c) ? 1 : 0) - (fcFollowed(a.c) ? 1 : 0))[0];
  const sp = best ? {at: 1, k: 'Last word', t: autoLink(esc(best.t)), sfx: '終'} : null;
  return fcArticle('Final · Epilogue', fcPick([`${fcCap(fcNum(Math.min(passed.length, 20)))} Cards`, 'After the Bell', 'What They Leave With'], 'ep' + passed.length), null, scenes, sp, null);
}
function finChapterHtml(){
  if(!S.bracket) return '';
  if(FCH.ed !== S.edition){ FCH.ed = S.edition; FCH.k = null; FCH.manual = false; }
  const {L, rs} = fcChapters(), shown = rs.filter(x => L.some(y => y.k === x.k));
  // follow the live round unless the reader chose one
  let k = FCH.k;
  if(RP.active && !FCH.manual){ const cur = rs.find(x => x.ms.some(m => m.seq === RP.idx || (m.seq < RP.idx && x.shown.length < x.ms.length))) || shown[shown.length - 1]; k = cur ? cur.k : 'pre'; FCH.k = k; }   // remembered, so the chapter stays put when the replay ends
  if(!k || !L.some(x => x.k === k)) k = 'pre';
  const live = RP.active ? (rs.find(x => x.ms.some(m => m.seq === RP.idx)) || {}).k : null;
  const chips = L.map(x => `<button type="button" class="rnd${x.k === k ? ' on' : ''}${x.k === live ? ' live' : ''}" data-fch="${x.k}" aria-pressed="${x.k === k}">${esc(x.lab)}${x.k === live ? ' <i>●</i>' : ''}</button>`).join('');
  const x = rs.find(r => r.k === k);
  const body = k === 'pre' ? fcPre(rs) : k === 'ep' ? fcEpilogue() : k === 'SC' ? fcStar() : x ? fcRound(x, 0, shown) : '';
  const col = x && x.r != null ? 'r' + x.r : k;
  return {html: `<div class="fch-nav" role="toolbar" aria-label="Chapters of the final">${chips}</div>${body}`, col};
}
document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-fch]'); if(!b) return; FCH.k = b.dataset.fch; FCH.manual = true; renderBracket(); const n = document.querySelector('.fch-nav'); if(n && n.getBoundingClientRect().top < 0) n.scrollIntoView({block: 'start'}); });
