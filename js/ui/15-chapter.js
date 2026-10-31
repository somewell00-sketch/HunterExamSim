/* ===================== CHAPTERS: each trial (and each Zevil day) told as one episode ===================== */
// The same lines the engine writes, arranged as a short episode: an opening, two or three scenes, the moment,
// the aftermath and a hook for the next one. Every chapter draws its own shape, intro and labels, and never
// repeats the shape of the chapter right before it, so the exam does not read like the same template twice.

const CH_H = s => nhashUI(S.seed + ':ch:' + s);
const chPick = (arr, k) => arr[CH_H(k) % arr.length];
// people the reader follows come first: favourites, the Scout's picks and ones to watch, apprentices
// the exam's own cast (the ones to watch the first trial introduced, and those who joined later) as it stood at trial i
const chCastAt = i => { const cm = cmap(S); return (S.castEver || []).filter(x => x.p <= i && cm[x.id] && (cm[x.id].out == null || cm[x.id].out >= i)).map(x => x.id); };
function chFollowed(i){
  const E = (SCOUT.ex || {})[S.edition] || {}, set = new Set(i == null ? [] : chCastAt(i));
  (E.picks || []).forEach(x => set.add(x.id)); (E.pool || []).forEach(x => set.add(x.id));
  S.candidates.forEach(c => { if(isFav(c.id) || (!MENTOR.off && mtOf(c.id))) set.add(c.id); });
  return set;
}
const chNotable = c => c && (c.tier === 'Skilled' || c.tier === 'Elite' || attemptsOf(c) > 1 || c.nick || (c.bonds || []).length || (c.secret && c.secret.revealed) || c.heir || c.hParent || c.kills);

/* ---------- words ---------- */
const CH_OPEN = {
  classic: ['Nothing about the morning suggests anything unusual.', 'The examiner checks the list twice and nods.', 'It starts the way trials always start: someone counts heads, and nobody says much.'],
  storm: ['Rain again. Nobody has been dry for days.', 'The sky is the colour of a bruise before the start.', 'Thunder somewhere close. The examiner does not look up.'],
  blood: ['Someone counts the stretchers before the start. There are more than last time.', 'The examiner smiles in a way nobody likes.', 'Nobody talks about the ones who did not come back yesterday.'],
  whim: ['The Chairman is in the stands, rolling his dice.', 'Before the signal, the Chairman changes one rule, just because.', 'Nobody knows what the Chairman will do today, including the Chairman.'],
  jubilee: ['Music at the start line. Somebody hands out sweets.', 'Banners everywhere. It is hard to remember this is still the Hunter Exam.', 'The examiners are almost cheerful. Almost.'],
  rookie: ['Nothing looks the way the veterans remember it.', 'The old routes are gone. The first-timers do not know enough to be afraid.', 'The veterans keep looking for landmarks that are not there.'],
  oldguard: ['Half the field has done this before, and it shows.', 'Old faces, old grudges, an old trial with new teeth.', 'Somebody recognises the examiner. The examiner recognises them too.'],
  silence: ['Nobody shares water this year. Nobody shares anything.', 'Every alliance is watching every other alliance.', 'It is a quiet start. Too quiet.'],
  friendship: ['Strangers keep ending up side by side this year.', 'Somebody is already holding a stranger\'s pack at the start line.', 'The candidates stand closer together than usual.'],
  shadows: ['Not everyone at the start line is who they say they are.', 'The examiner counts the candidates and gets a different number each time.', 'A new face in the crowd. Nobody remembers seeing it at the gate.'],
  wild: ['Something is moving in the trees before the signal.', 'The animals are restless this year, and so are the candidates.', 'Somebody finds claw marks on the gate. Fresh ones.']
};
const CH_OPEN_SP = {centenary: ['Another hundred exams since the last centenary, and this road remembers every one of them.', 'The old stones remember every candidate. Today they get a few more.'], jubilee: ['A Jubilee year: more licenses, more noise, the same danger.', 'The whole Association is watching this one.']};
const CH_LABEL = {
  clock: [['Dawn', 'Morning', 'Nightfall'], ['First light', 'The long middle', 'After dark'], ['Before the signal', 'Halfway', 'By the fire']],
  mood: [['The calm', 'The turn', 'The cost'], ['The waiting', 'The rush', 'The quiet after'], ['Nerves', 'Chaos', 'The count']],
  place: {forest: ['The edge of the trees', 'Deep in', 'Back at camp'], water: ['On deck', 'Open water', 'Ashore'], night: ['Boarding', 'The small hours', 'Arrival'], mountain: ['The foot of it', 'The climb', 'The top'],
    underground: ['The entrance', 'In the dark', 'Daylight'], swamp: ['The shore', 'The mist', 'Dry ground'], desert: ['The morning heat', 'Noon', 'The cold night'], tower: ['The way in', 'Inside', 'The way out'],
    kitchen: ['The stations', 'The rush', 'The tasting'], vault: ['The viewing', 'The bidding', 'The count'], wild: ['The open ground', 'The chase', 'The fire'], arena: ['The gate', 'The fight', 'The gate again'], island: ['The beach', 'The forest', 'The cliffs']}
};
const CH_CONN = ['Meanwhile,', 'Not far away,', 'A little later,', 'Elsewhere,', 'By then,', 'Around the same time,', 'Further back,', 'Somewhere ahead,'];
const CH_TITLE = {
  rescue: ['Not Without You', 'Going Back', 'Nobody Gets Left', 'The Long Way Round', 'Hands in the Dark'],
  death: ['One Less at the Fire', 'A Quiet Name', 'The Price of It', 'Empty Place'],
  betray: ['Two Faces', 'The Knife in the Dark', 'Broken Promises', 'Old Friends'],
  secret: ['The Mask Slips', 'What Was Hidden', 'Someone Knows'],
  hurt: ['Bleeding but Standing', 'A Bad Fall', 'Still Walking'],
  fear: ['Old Fears', 'Pale at the Start', 'The Thing Under the Bed'],
  lead: ['Out in Front', 'Nobody Keeps Up', 'The Pace Setter'],
  any: ['Wrong Turns', 'Small Mercies', 'Counting Heads', 'Nobody Sleeps', 'Long Day', 'The Ones Who Stayed', 'Half the Field', 'Familiar Faces', 'The Narrow Part', 'What the Examiner Saw'],
  person: [n => `${n}'s Long Day`, n => `${n} Goes First`, n => `${n} Keeps Going`, n => `Watch ${n}`, n => `${n} Against the Odds`],
  island: ['Ambush at Dusk', 'The Long Knives', 'A Quiet Day on the Island', 'Hunters and Hunted', 'The Stream', 'Smoke on the Beach', 'Footprints', 'Nobody Sleeps']
};
const CH_NEXT = {
  hurt: (c, nx) => `${c.first} goes into the ${nx} with a ${c.injury.w}.`,
  rival: (c, nx, o) => `${c.first} and ${o.first} are both still in. That will not last.`,
  climb: (c, nx) => `Everyone is watching ${c.first} now.`,
  bondLost: (c, nx) => `${c.first} carries two people into the ${nx} now.`,
  plain: [(c, nx) => `Next, the ${nx}. ${c.first} is ready, or says so.`, (c, nx) => `The ${nx} is waiting. So is ${c.first}.`, (c, nx) => `${c.first} sleeps badly before the ${nx}.`, (c, nx) => `Tomorrow, the ${nx}. ${c.first} has been told what it does to people.`]
};

/* ---------- picking the lines ---------- */
function chKindOf(e){
  const t = (e && e.text) || '';
  return /dies|died|killed|did not come out|not make it|lifeless/i.test(t) ? 'death' : /betray|turns on|knife/i.test(t) ? 'betray' : e && e.type === 'secret' ? 'secret'
    : /back for|pulls? .* through|drags|refuses to leave|not without|rescue/i.test(t) ? 'rescue' : /injur|bleed|bites|ankle|knee|arm|ribs|hurt/i.test(t) ? 'hurt' : /afraid|fear|pale|freezes/i.test(t) ? 'fear' : null;
}
function chScore(e, F, cm){
  const ids = e.ids || [];
  return (ids.some(id => F.has(id)) ? 6 : 0) + (ids.some(id => chNotable(cm[id])) ? 2 : 0) + (e.dr || 2) + (/[“"]/.test(e.text) ? 0.5 : 0);
}
// two lines about the same person sit together; the second says only the first name
function chFlow(lines, cm, k, known){
  const out = [], used = new Set();
  lines.forEach(e => { if(used.has(e)) return; used.add(e); out.push(e); const a = (e.ids || [])[0]; if(!a) return; lines.forEach(x => { if(!used.has(x) && (x.ids || [])[0] === a){ used.add(x); out.push(x); } }); });
  let conn = 0, prevId = known || null;
  return out.map((e, i) => {
    let t = e.text; const a = (e.ids || [])[0], c = cm[a];
    if(c && (i > 0 || known) && a === prevId && t.startsWith(c.name + ' ')) t = c.first + t.slice(c.name.length);
    else if(c && i > 0 && t.startsWith(c.name + ' ') && CH_H(k + ':c' + i) % 3 === 0){ t = CH_CONN[(CH_H(k) + conn++) % CH_CONN.length] + ' ' + t; }
    prevId = a; return {text: t, ids: e.ids || []};
  });
}
const chPara = (lines, cls) => { const out = []; for(let i = 0; i < lines.length; i += 2) out.push(`<p${i === 0 && cls && !(cls === 'drop' && /^[^A-Za-z]/.test(lines[0].text || '')) ? ` class="${cls}"` : ''}>${lines.slice(i, i + 2).map(x => linkNames(x.text, x.ids)).join(' ')}</p>`); return out.join(''); };

/* ---------- one trial ---------- */
// lines: the trial's notable lines in log order; camp: its colour lines; moment: the line of the trial
function chapterOf(i){
  const ph = PHASES[i], ev = S.log.filter(e => e.p === i && !e.d), cm = cmap(S), F = chFollowed(i);
  const moment = momentOf(S.log.filter(e => e.p === i));
  const SKIP = ['phase', 'examiner', 'fav', 'ally', 'split', 'help', 'family', 'team', 'duel', 'fight', 'info', 'veteran', 'bond', 'rescue'];
  // the first chapter opens on the year itself: a Jubilee or Centenary opening and the year's theme, set apart from the scenes
  const tn = THEMES[S.theme || 'classic'], yearL = i === 0 ? ev.filter(e => isOpening(e) || (tn && e.text.startsWith(tn.name + ':'))).sort((a, b) => (b.sp ? 1 : 0) - (a.sp ? 1 : 0)) : [];
  // older saves wrote some colour lines that do not fit the place (vines in a tunnel): they stay in the log, out of the chapter
  const fitsHere = e => typeof phFits !== 'function' || !['story', 'event', 'arc'].includes(e.type) || phFits(ph.id, e.text, S.theme || 'classic');
  const pool = ev.filter(e => e !== moment && !yearL.includes(e) && !SKIP.includes(e.type) && !/alliances? (form|forms) or grow/.test(e.text) && fitsHere(e));
  const firstAct = ev.findIndex(e => ['event', 'help', 'rescue', 'veteran', 'team', 'duel'].includes(e.type));
  const leadAt = ev.findIndex(e => e.type === 'major' && (e.ids || []).length === 1 && /front of the pack|keeps up|look easy|mark one name|First through/i.test(e.text));
  const at = e => ev.indexOf(e);
  const before = pool.filter(e => (firstAct < 0 || at(e) < firstAct));
  const after = pool.filter(e => !before.includes(e) && (leadAt >= 0 ? at(e) >= leadAt : e.type === 'story' || /after the|finishes|scrapes|barely|rattled|waking up|watching|first through/i.test(e.text)));
  const during = pool.filter(e => !before.includes(e) && !after.includes(e));
  const rescues = S.log.filter(e => e.p === i && e.type === 'rescue').sort((x, y) => chScore(y, F, cm) - chScore(x, F, cm)).slice(0, 1);
  const top = (arr, n) => arr.slice().sort((x, y) => chScore(y, F, cm) - chScore(x, F, cm)).slice(0, n).sort((x, y) => at(x) - at(y));
  const B = top(before, 3), D = top(during.concat(rescues), 4), A = top(after, 3), used = new Set([...B, ...D, ...A, moment]);
  // the people the reader follows always get a beat, even on a trial where the engine wrote nothing about them
  const W = chWatchBeats(i, ph, ev, F, cm, used); W.forEach(w => { used.add(w.src || w); (w.out ? A : D).push(w); });
  const rest = pool.filter(e => !used.has(e));
  return {i, ph, moment, B, D, A, rest, cm, F, yearL};
}
const CH_WATCH = {
  top: [n => `${n} is near the front all trial and never looks worried.`, n => `${n} finishes among the first, barely out of breath.`, n => `Nobody has to ask where ${n} is: up front, as usual.`, n => `${n} makes it look easy. Some of the others start to hate that.`, n => `The examiner writes down ${n}'s name early, and keeps watching.`],
  mid: [n => `${n} keeps a steady pace in the middle of the pack, and saves something for later.`, (n, f) => `${n} is not the fastest or the slowest. ${f} is still here.`, n => `${n} gets through without fuss. Not every trial has to be a story.`, n => `Quietly, ${n} gets it done.`, n => `${n} spends the trial watching the others, and learns a few things.`],
  low: [n => `${n} scrapes through near the back, one of the last to make it.`, n => `It is close for ${n}. Closer than anyone following would like.`, n => `${n} arrives late, shaking, and still counted. Just.`, (n, f) => `For a long stretch nobody can see ${n}. Then, at the very end, there ${f} is.`, n => `${n} limps over the line among the last few.`],
  out: [n => `This is where ${n}'s exam ends.`, n => `${n} does not make it past this one.`, n => `The trial is over for ${n}. Some of the others notice the empty spot.`, n => `${n} falls short here, and knows it before anyone says so.`],
  dead: [n => `${n} does not come back from this trial.`, n => `${n}'s name is read out with the others who will not be going on.`],
  dq: [n => `${n} is disqualified. The examiner does not explain twice.`, n => `${n} is sent home for breaking the rules.`]
};
function chWatchBeats(i, ph, ev, F, cm, used){
  if(!F.size || ph.zevil || ph.final) return [];
  const said = new Set(); used.forEach(e => (e && e.ids || []).forEach(id => said.add(id)));
  const sc = S.candidates.filter(c => typeof (c.scores || {})[ph.id] === 'number').sort((x, y) => y.scores[ph.id] - x.scores[ph.id]), n = sc.length;
  const here = S.candidates.filter(c => F.has(c.id) && !said.has(c.id) && (c.out == null || c.out >= i) && (sc.includes(c) || c.out === i));
  // apprentices and favourites first, then the exam's ones to watch, then the Scout's picks; at most four per chapter
  const cast = new Set(chCastAt(i));
  const rank = c => (!MENTOR.off && mtOf(c.id) ? 0 : isFav(c.id) ? 1 : cast.has(c.id) ? 1.5 : 2) + (c.out === i ? -0.5 : 0) + (CH_H('wo' + i + c.id) % 100) / 1000;
  return here.sort((a, b) => rank(a) - rank(b)).slice(0, 4).map(c => {
    // a line the engine did write about them (an alliance, a duel, a helping hand) beats a made-up one
    const own = ev.find(e => !used.has(e) && (e.ids || [])[0] === c.id && e.type !== 'phase' && e.type !== 'examiner' && e.type !== 'fav' && !/alliances? (form|forms) or grow/.test(e.text));
    if(own && c.out !== i) return {text: own.text, ids: own.ids, src: own, dr: own.dr};
    const r = sc.indexOf(c), out = c.out === i;
    return {c, out, b: out ? (c.status === 'Deceased' ? 'dead' : c.status === 'Disqualified' ? 'dq' : 'out') : r < Math.max(3, n * 0.12) ? 'top' : r > n * 0.85 ? 'low' : 'mid'};
  }).reduce((acc, w) => {
    if(!w.c) return acc.concat([w]);
    // two or more with the same kind of day share one sentence; a single one gets a line of their own, never the same line twice in a chapter
    const g = acc.find(x => x.grp && x.b === w.b); if(g) g.cs.push(w.c); else acc.push({grp: true, b: w.b, out: w.out, cs: [w.c]}); return acc;
  }, []).map(w => {
    if(!w.grp) return w;
    if(w.cs.length === 1){ const c = w.cs[0]; return {text: chPick(CH_WATCH[w.b], 'w' + i + c.id)(c.name, c.first || c.name), ids: [c.id], out: w.out, dr: 2}; }
    const names = w.cs.map(c => c.name), list = names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
    return {text: chPick(CH_WATCH_G[w.b], 'wg' + i + w.b)(list), ids: w.cs.map(c => c.id), out: w.out, dr: 2};
  });
}
const CH_WATCH_G = {
  top: [l => `${l} are near the front all trial.`, l => `Up front, as usual: ${l}.`, l => `${l} finish among the first and barely look tired.`],
  mid: [l => `${l} get through without fuss. Not every trial has to be a story.`, l => `Somewhere in the middle of the pack, ${l} keep going.`, l => `${l} make it, quietly.`, l => `No drama for ${l}: they are through.`],
  low: [l => `${l} scrape through near the back.`, l => `It is close for ${l}. Closer than anyone following would like.`, l => `${l} are among the last few counted.`],
  out: [l => `This is where the exam ends for ${l}.`, l => `${l} do not make it past this one.`],
  dead: [l => `${l} do not come back from this trial.`],
  dq: [l => `${l} are disqualified.`]
};
function chTitle(i, C){
  const taken = new Set(); for(let j = 0; j < i; j++){ if(S.stats.find(s => s.p === j) && !PHASES[j].final && !PHASES[j].zevil) taken.add(chTitleRaw(j)); }
  let t = chTitleRaw(i, C), n = 0; while(taken.has(t) && n++ < 8) t = chTitleRaw(i, C, n); return t;
}
function chTitleRaw(i, C, salt){
  C = C || chapterOf(i); let k = chKindOf(C.moment); const cast = chCast(C), lead = cast[0];
  // the same kind of title twice in a row reads like a template: the second one goes generic
  if(k && i > 0 && S.stats.find(s => s.p === i - 1) && !PHASES[i - 1].zevil && !PHASES[i - 1].final && chKindOf(momentOf(S.log.filter(e => e.p === i - 1))) === k) k = null;
  const r = CH_H('title' + i + (salt || '')) % 10;
  if(lead && r < 3 && !chPersonTitled(i, lead.id)) return chPick(CH_TITLE.person, 'tp' + i + (salt || ''))(lead.first);
  return chPick(CH_TITLE[k] || CH_TITLE.any, 'tt' + i + (salt || ''));
}
function chPersonTitled(i, id){ for(let j = 0; j < i; j++){ if(!S.stats.find(s => s.p === j) || PHASES[j].final || PHASES[j].zevil) continue; const Cj = chapterOf(j), l = chCast(Cj)[0]; if(l && l.id === id && CH_H('title' + j) % 10 < 3) return true; } return false; }
function chCast(C){
  const seen = new Map(), add = (e, w) => (e && e.ids || []).forEach((id, k) => { const c = C.cm[id]; if(c) seen.set(id, (seen.get(id) || 0) + w * (k ? 0.6 : 1) + (C.F.has(id) ? 4 : 0) + (chNotable(c) ? 1 : 0)); });
  add(C.moment, 3); [...C.B, ...C.D, ...C.A].forEach(e => add(e, 1));
  const L = [...seen.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => C.cm[id]);
  // the people the reader follows lead, but they never take more than half of the cast
  const fol = L.filter(c => C.F.has(c.id)).slice(0, 3), oth = L.filter(c => !C.F.has(c.id));
  return fol.concat(oth).slice(0, 5);
}
function chNext(i, C){
  const nx = PHASES[i + 1]; if(!nx) return null; const nxn = nx.name.replace(/^The /, '');
  const alive = chCast(C).filter(c => c.out == null || c.out > i);
  const c = alive[0]; if(!c) return {to: nx.name, text: `${S.stats.find(s => s.p === i).after} candidates go on to the ${nxn}.`};
  const riv = (c.grudges || []).map(g => C.cm[g.id]).find(o => o && o.status === 'Active');
  const lostBond = (c.bonds || []).some(b => { const o = C.cm[b.id]; return o && o.out === i && o.status !== 'Active'; });
  const climbed = [...C.A].some(e => (e.ids || [])[0] === c.id && /after the|waking up|watching/.test(e.text));
  const text = c.injury && c.injury.p != null ? CH_NEXT.hurt(c, nxn) : riv ? CH_NEXT.rival(c, nxn, riv) : lostBond ? CH_NEXT.bondLost(c, nxn) : climbed ? CH_NEXT.climb(c, nxn) : chPick(CH_NEXT.plain, 'nx' + i)(c, nxn);
  return {to: nx.name, text};
}
function chIntro(i, ph){
  const sp = S.special && CH_OPEN_SP[S.special];
  const pool = (sp && CH_H('sp' + i) % 3 === 0) ? sp : (CH_OPEN[S.theme] || CH_OPEN.classic);
  return pool[(CH_H('op') + i) % pool.length];
}
// the layout is always the same reading page (scenes by time of day, the moment in the middle, a hook at the end);
// what varies is how it opens, the words for the time of day, and now and then a cold open or a chapter that follows one person
function chShape(i){
  if(i <= 0) return chPick(['clock', 'clock', 'pov'], 'shape0');
  const prev = chShape(i - 1), r = CH_H('shape' + i) % 10;
  const s = r < 2 ? 'cold' : r < 4 ? 'pov' : 'clock';
  return s !== 'clock' && s === prev ? 'clock' : s;
}
const chTidy = (t, ph) => t.replace(/ \([^)]*\)(?=\.?$)/, '').replace(new RegExp(` (?:in|during) the ${ph.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[.,;:!?])`, 'g'), '');
// the order people first appear in a chapter (the Ones to watch list follows it)
function chOrder(i){ const k = S.edition + ':' + i + ':' + S.log.length; if(chOrder.k !== k){ chOrder.k = k; const ids = []; [...chapterHtml(i).matchAll(/data-id="([^"]+)"/g)].forEach(m => { if(!ids.includes(m[1])) ids.push(m[1]); }); chOrder.v = ids; } return chOrder.v; }
function chapterHtml(i){
  const C = chapterOf(i), ph = C.ph, shape = chShape(i), k = 'c' + i, cast = chCast(C), nx = chNext(i, C);
  const tidy = arr => arr.map(e => Object.assign({}, e, {text: chTidy(e.text, ph)}));
  const B = tidy(C.B), D = tidy(C.D), A = tidy(C.A);
  const prev = i > 0 && S.stats.find(s => s.p === i - 1) && !PHASES[i - 1].zevil && !PHASES[i - 1].final ? chapterOf(i - 1) : null;
  const labels = typeof RACE !== 'undefined' && RACE[ph.id] ? chPick(RACE[ph.id].labels, 'lb' + i) : chPick([['Dawn', 'Morning', 'Nightfall'], ['First light', 'Midday', 'After dark'], ['Before the signal', 'Halfway', 'By the fire'], ['Morning', 'Afternoon', 'Evening']], 'lb' + i);   // a race is told by distance
  const scene = (label, arr, cls, lead, known) => arr.length || lead ? `<div class="wt-scene"><span class="wt-time">${esc(label)}</span>${chPara((lead ? [{text: lead, ids: []}] : []).concat(chFlow(arr, C.cm, k + label, known)), cls)}</div>` : '';
  const splash = C.moment ? `<figure class="wt-splash"><span class="sfx" aria-hidden="true">${chPick(['ドン', 'ゾッ', 'バッ', 'ザッ'], 'sfx' + i)}</span><span class="mo-k">Moment of the trial</span><blockquote>${linkNames(chTidy(C.moment.text, ph), C.moment.ids)}</blockquote></figure>` : '';
  // the opening: the year's mood, the examiner, or the person this chapter follows
  const ex = ph.ex ? ph.ex.name : null, st = S.stats.find(s => s.p === i);
  let lead = chIntro(i, ph), known = null;
  if(shape === 'pov' && cast[0] && !(ph.ex && ph.ex.legend)){ const c = cast[0]; known = c.id; lead = chPick([`This is ${c.first}'s trial, whether ${PR(c).they} like${PR(c).s} it or not.`, `Keep an eye on ${c.name} today.`, `${c.name} does not know it yet, but this is ${PR(c).their} day.`], 'pov' + i); }
  else if(ex && ph.ex.legend) lead = chPick([`${legendName(ex, ph.ex.legend).replace(/,$/, '')} examines this one in person. Nobody talks above a whisper.`, `The examiner today is ${legendName(ex, ph.ex.legend).replace(/,$/, '')}. Half the candidates forget to breathe.`, `${ex} does not usually examine anyone. This year, ${ex} does.`], 'lg' + i);
  else if(ex && CH_H('exo' + i) % 4 === 0) lead = chPick([`${ex} watches ${fmt(st.before)} candidates walk in. ${fmt(st.after)} will walk out.`, `${ex} has a notebook, and by nightfall it is full.`], 'ex' + i);
  let body;
  if(shape === 'cold') body = splash + scene(labels[0], B.concat(D), 'drop', chPick(['It had started like any other trial.', 'A few hours earlier, nobody saw it coming.', 'Rewind to the start.'], 'cold' + i)) + scene(labels[2], A);
  else body = scene(labels[0], B, 'drop', lead, known) + scene(labels[1], D) + splash + scene(labels[2], A);
  const more = C.rest.length ? `<details class="more"><summary>Read the full chapter · ${C.rest.length} more moment${C.rest.length === 1 ? '' : 's'}</summary>${chPara(tidy(C.rest).map(e => ({text: e.text, ids: e.ids || []})))}</details>` : '';
  // previously: the last thing the previous chapter left open, in one line
  const pl = prev ? (prev.A[prev.A.length - 1] || prev.moment) : null;
  const prevT = pl ? `<p class="wt-prev">Previously: ${linkNames(chTidy(pl.text, prev.ph), pl.ids || [])}</p>`
    : C.yearL.length ? `<div class="wt-year${S.special ? ' sp' : ''}"><span>${esc(examName(S).replace(/^the /, 'The '))}${!S.special && THEMES[S.theme || 'classic'] ? ' · ' + esc(THEMES[S.theme || 'classic'].name) : ''}</span>${C.yearL.map(e => `<p>${linkNames(e.text.replace(THEMES[S.theme || 'classic'] ? THEMES[S.theme || 'classic'].name + ': ' : '\u0000', ''), e.ids || [])}</p>`).join('')}</div>` : '';
  return `<article class="wt2"><div class="wt2-h"><span>Chapter ${i + 1}</span><h3>${esc(chTitle(i, C))}</h3></div>`
    + prevT + body + more + (nx ? `<div class="next"><span>Next · ${esc(nx.to)}</span><p>${linkNames(nx.text, [])}</p></div>` : '') + `</article>`;
}

/* ---------- one Zevil day ---------- */
function zChapterHtml(day, pre, post){
  const Z = S.zevil, cm = cmap(S), F = chFollowed(PHASES.findIndex(x => x.zevil));
  // pre: the camp on arrival; post: how the island ended for the cast and the bonds it made (last day)
  const raw = (pre || []).map(e => ({text: e.text, ids: e.ids || [], dr: 3}))
    .concat(Z.ev.filter(e => e.day === day).map(e => ({text: e.text.replace(/^(Day \d+|Arrival): /, ''), ids: e.ids || [], dr: /target badge|ambush|betray|killed|dies|turned on/i.test(e.text) ? 6 : 3})))
    .concat((post || []).map(e => ({text: e.text, ids: e.ids || [], dr: 5})));
  if(!raw.length) return `<article class="wt2"><div class="wt2-h"><span>${day ? `Day ${day} of 7` : 'Arrival'}</span><h3>A Quiet Day on the Island</h3></div><p class="wt-turn">Nobody moves. Everybody watches.</p></article>`;
  const score = e => chScore(e, F, cm);
  const moment = raw.slice().sort((x, y) => score(y) + (y.dr > 3 ? 3 : 0) - score(x) - (x.dr > 3 ? 3 : 0))[0];
  const zs = d => { const r = CH_H('zs' + d) % 10; return r < 2 ? 'cold' : r < 4 ? 'pov' : 'clock'; }, rest = raw.filter(e => e !== moment), shape = zs(day) !== 'clock' && zs(day) === zs(day - 1) ? 'clock' : zs(day);
  const keep = rest.slice().sort((x, y) => score(y) - score(x)).slice(0, 8), shown = rest.filter(e => keep.includes(e)), extra = rest.filter(e => !keep.includes(e));
  const third = Math.ceil(shown.length / 3), parts = [shown.slice(0, third), shown.slice(third, 2 * third), shown.slice(2 * third)];
  const labels = chPick([['Dawn', 'Midday', 'Dusk'], ['First light', 'The heat of the day', 'Night falls'], ['Morning', 'Afternoon', 'Night']], 'zt' + day);
  const k = 'z' + day, scene = (label, arr, cls, lead) => arr.length || lead ? `<div class="wt-scene"><span class="wt-time">${esc(label)}</span>${chPara((lead ? [{text: lead, ids: []}] : []).concat(chFlow(arr, cm, k + label)), cls)}</div>` : '';
  const splash = `<figure class="wt-splash zv"><span class="sfx" aria-hidden="true">${chPick(['ザッ', 'シュッ', 'ドッ'], 'zsfx' + day)}</span><span class="mo-k">Moment of the day</span><blockquote>${linkNames(moment.text, moment.ids)}</blockquote></figure>`;
  const castIds = [...new Set([moment, ...shown].flatMap(e => e.ids.slice(0, 2)))].map(id => cm[id]).filter(Boolean);
  const cast = castIds.filter(c => F.has(c.id)).slice(0, 3).concat(castIds.filter(c => !F.has(c.id))).slice(0, 5);
  const fam = (() => { const s = {}; castIds.forEach(c => { const l = c.name.split(' ').slice(-1)[0]; s[l] = (s[l] || 0) + 1; }); const t = Object.entries(s).find(([, n]) => n >= 3); return t && t[0]; })();
  const title = fam && CH_H('zf' + day) % 2 ? `The ${fam}s Hold the Line` : /ambush/i.test(moment.text) ? chPick(['Ambush at Dusk', 'The Long Knives', 'Hunters and Hunted'], 'zt1' + day) : /betray|turned on/i.test(moment.text) ? chPick(['Broken Promises', 'Two Faces'], 'zt2' + day) : /dies|killed/i.test(moment.text) ? 'The Island Takes One' : chPick(CH_TITLE.island, 'zt3' + day);
  const intro = (chPick(day === 1 ? ['The first full day. Everyone knows who they are hunting, and nobody knows who is hunting them.'] : day === 7 ? ['The last day. The boat leaves at dawn.', 'One more day, and then the boat.'] : [`${['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'][8 - day] || 'A few'} days left. The island is quieter than it should be.`, 'Fewer footprints on the beach this morning.', 'Somebody did not sleep last night. Nobody did, really.'], 'zi' + day));
  let body;
  if(shape === 'cold') body = splash + scene(labels[0], parts[0].concat(parts[1]), 'drop', chPick(['That was at the end of the day. It started much earlier.', 'Rewind to sunrise.'], 'zc' + day)) + scene(labels[2], parts[2]);
  else if(shape === 'pov' && cast[0]){ const c = cast[0], mine = e => e.ids[0] === c.id || e.ids[1] === c.id; body = scene(labels[0], shown.filter(mine), 'drop', `Follow ${c.first} today.`) + scene(labels[1], shown.filter(e => !mine(e))) + splash; }
  else body = scene(labels[0], parts[0], 'drop', intro) + scene(labels[1], parts[1]) + splash + scene(labels[2], parts[2]);
  // tomorrow: whoever lost a target badge today will come looking
  const m = moment.text.match(/^(.+?) (?:and .+? )?(?:waylaid|blindsided|caught out|turned the tables on|ambushed) (.+?)(?: in| and|,)/), thief = moment.ids[0] && cm[moment.ids[0]], vic = moment.ids[1] && cm[moment.ids[1]];
  const nextT = day >= 7 ? null : thief && vic && /target badge/.test(moment.text) ? `${vic.first} has lost ${PR(vic).their} target badge. ${thief.first} knows ${PR(vic).they} will come looking.` : cast[0] ? chPick([`${cast[0].first} has ${7 - day} days left to make it count.`, `Tomorrow, ${cast[0].first} goes hunting.`], 'zn' + day) : null;
  const prevM = day > 1 ? (() => { const pr = Z.ev.filter(e => e.day === day - 1); if(!pr.length) return ''; const pm = pr.map(e => ({text: e.text.replace(/^(Day \d+|Arrival): /, ''), ids: e.ids || []})).sort((x, y) => score(y) - score(x))[0]; return `<p class="wt-prev">Yesterday: ${linkNames(pm.text, pm.ids)}</p>`; })() : '';
  return `<article class="wt2"><div class="wt2-h"><span>${day ? `Day ${day} of 7` : 'Arrival'}</span><h3>${esc(title)}</h3></div>`
    + prevM + body + (extra.length ? `<details class="more"><summary>The rest of the day · ${extra.length} more</summary>${chPara(extra)}</details>` : '') + (nextT ? `<div class="next"><span>Tomorrow · Day ${day + 1}</span><p>${linkNames(nextT, [])}</p></div>` : '') + `</article>`;
}
