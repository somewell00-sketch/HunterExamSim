/* ===== The catastrophe: about one exam in fifty never finishes ===== */
const CAT_KINDS = {
  quake: {name: 'The Great Quake', tag: 'Quake', what: 'the quake',
    impact: o => `The ground opens in the middle of ${o.ph}. The trial site folds in on itself, and the Hunter Exam stops being an exam.`,
    hero: [o => `${o.c} digs ${o.n} people out of the rubble with ${o.P.their} bare hands.`, o => `${o.c} holds up a collapsing beam long enough for a whole corridor to get out.`, o => `${o.c} goes back into the broken hall three times. The third time ${o.P.they} come${o.P.s} out carrying an examiner's assistant.`, o => `${o.c} finds the trapped group by the sound of their knocking, and keeps them talking until the diggers arrive.`],
    die: [o => `${o.c} was under the north wall when it came down.`, o => `${o.c} went back for someone in the second shock, and did not come out.`]},
  breach: {name: 'The Breach', tag: 'Breach', what: 'the breach',
    impact: o => `Something comes out of the trees during ${o.ph} that does not belong to this continent. The examiners stop pretending it is part of the test.`,
    hero: [o => `${o.c} draws the creature away from the medical tents, alone, and leads it into the river.`, o => `${o.c} keeps ${o.n} candidates silent and still in a gully for six hours while it passes overhead.`, o => `${o.c} drags a wounded stranger into a cave and holds the entrance with a broken spear.`, o => `${o.c} works out that the thing hunts by warmth, and covers everyone near ${o.P.them} in cold mud.`],
    die: [o => `${o.c} was the first thing it saw.`, o => `${o.c} tried to fight it. Nobody else made that mistake after.`]},
  siege: {name: 'The Siege', tag: 'Siege', what: 'the siege',
    impact: o => `A Blacklist gang storms the exam during ${o.ph}, taking candidates and examiners as hostages. Their demands are read out over the examiners' own radios.`,
    hero: [o => `${o.c} unties ${o.n} hostages in the dark and walks them out past the guards.`, o => `${o.c} talks a nervous gunman into lowering his weapon, for the ten seconds it takes.`, o => `${o.c} carries the radio across the camp so the Association can hear where the hostages are held.`, o => `${o.c} steps in front of a younger candidate when the gang chooses who to make an example of.`],
    die: [o => `${o.c} was chosen as the example.`, o => `${o.c} tried to run during the first hour. They were watching.`]},
  tide: {name: 'The Beast Tide', tag: 'Tide', what: 'the beast tide',
    impact: o => `The Association's holding pens give way during ${o.ph}. Every Nen beast caught for the exam in the last ten years is loose at once.`,
    hero: [o => `${o.c} climbs onto the pens and closes the last gate by hand, with something pushing from the other side.`, o => `${o.c} gets ${o.n} candidates up a watchtower and keeps them there until morning.`, o => `${o.c} calms a panicking herd before it tramples the medical tents.`, o => `${o.c} lures the largest beast away with ${o.P.their} own scent and a lot of running.`],
    die: [o => `${o.c} was in the path of the stampede.`, o => `${o.c} stopped to help someone, and the beasts did not stop.`]},
  fire: {name: 'The Firestorm', tag: 'Firestorm', what: 'the firestorm',
    impact: o => `A wildfire jumps the ridge during ${o.ph} and reaches the trial in minutes. The sky goes orange, then black.`,
    hero: [o => `${o.c} leads ${o.n} people out through a burning valley by following the river stones.`, o => `${o.c} cuts a firebreak with a borrowed axe, and the medical tents stand.`, o => `${o.c} wraps a stranger in a wet blanket and runs with ${o.P.them} through the smoke.`, o => `${o.c} goes back for the examiners' records, then for the people left behind them.`],
    die: [o => `${o.c} was cut off when the wind turned.`, o => `${o.c} went back into the smoke for someone. Neither came out.`]},
  flood: {name: 'The Flood', tag: 'Flood', what: 'the flood',
    impact: o => `A dam upstream gives way during ${o.ph}. The water arrives before the warning does.`,
    hero: [o => `${o.c} swims the current ${o.n} times with a rope, until everyone on the island is across.`, o => `${o.c} lashes three rafts together and pulls a whole group out of the valley.`, o => `${o.c} holds a child above the water for an hour, until a boat finds them.`, o => `${o.c} dives for the people trapped in the flooded tunnel, again and again.`],
    die: [o => `${o.c} was swept away in the first wave.`, o => `${o.c} let go of the rope so someone else could hold it.`]}
};
const CAT_HERO = [o => `${o.c} never stops moving: water, bandages, stretchers, for two days straight.`, o => `${o.c} keeps a list of every name ${o.P.they} can find, so the families will know.`, o => `${o.c} gives ${o.P.their} last water to a stranger and walks the rest of the way thirsty.`, o => `${o.c} goes back for a candidate ${o.P.they} had fought the day before.`, o => `${o.c} sets a broken leg with two sticks and a belt, and the man walks out.`, o => `${o.c} stays with the wounded until the last of them is carried away.`, o => `${o.c} finds a way out nobody else saw, and leads ${o.n} people through it.`, o => `${o.c} keeps the frightened ones together with a calm voice and a terrible joke.`, o => `${o.c} shares ${o.P.their} coat, ${o.P.their} food and ${o.P.their} last match with people ${o.P.they} had never met.`, o => `${o.c} organises the survivors into teams and gives everyone a job. It is the only thing that keeps the panic down.`, o => `${o.c} finds the lost children's group and walks them out, singing so they keep up.`, o => `${o.c} carries a wounded examiner on ${o.P.their} back to the evacuation point.`];
const CAT_DIE = [o => `${o.c} did not make it out.`, o => `${o.c} was found the next morning.`, o => `${o.c} died helping strangers ${o.P.they} had met a day before.`];
const CAT_FLEE = [o => `${o.n} candidates run, and keep running. Most will be back next year.`, o => `The rest scatter: ${o.n} candidates flee into the night. Nobody blames them.`];
const CAT_EXH = [o => `${o.e} pulls candidates out of ${o.what} until ${o.P.their} hands bleed.`, o => `${o.e} holds the line between ${o.what} and the medical tents for a night and a day.`, o => `${o.e} drops the examiner's clipboard and becomes the rescue.`];
const CAT_EXD = [o => `${o.e}, the examiner, went back in for the candidates and did not come out.`, o => `${o.e} died keeping ${o.what} away from the people ${o.P.they} had been testing that morning.`];
// the mentor's apprentices get one call when it hits: run, help others, or hold the line
const CAT_CALL = {run: {l: 'Run', d: 0.5, h: 0}, help: {l: 'Help others', d: 1.1, h: 1}, hold: {l: 'Hold the line', d: 1.4, h: 1.8}};
function setupCatastrophe(S, rng){
  const ks = Object.keys(CAT_KINDS), k = ks[Math.floor(rng() * ks.length)];
  // it hits during the second, third or fourth trial: until then, the exam looks like any other
  const last = Math.max(1, Math.min(3, (S.phaseSpec || PHASES).length - 4));
  S.cat = {k, name: CAT_KINDS[k].name, tag: CAT_KINDS[k].tag, p: 1 + Math.floor(rng() * last), sev: 0.15 + rng() * 0.2, stage: null, mt: {}};
}
function runCatastrophe(S, p){
  const C = S.cat, K = CAT_KINDS[C.k], ph = PHASES[p], rng = makeRng((S.seed ^ 0xCA7A57) >>> 0);
  const act = S.candidates.filter(c => c.status === 'Active');
  if(!C.stage){
    C.stage = 'impact'; C.at = act.map(c => c.id);
    C.impact = K.impact({ph: thePhase(ph.name)}); log(S, p, 'major', C.impact, []);
    if(C.wait) return false;   // the mentor gets to make a call before the aftermath
  }
  C.stage = 'done';
  const notable = c => c.tier === 'Skilled' || c.tier === 'Elite' || (c.attempts || []).length > 1 || !!(c.nick || c.heir || c.hParent || c.fam || c.secret);
  const call = c => CAT_CALL[C.mt[c.id]] || null;
  const dead = [], alive = [];
  act.forEach(c => { const m = call(c), d = C.sev * (m ? m.d : 1) * (1.25 - (c.a.agility + c.a.speed) / 400) * (0.85 + rng() * 0.3);
    if(rng() < d){ c.status = 'Deceased'; c.out = p; c.reason = `${K.name}: did not survive`; c.notes.push({p, text: `Died in ${K.name.toLowerCase()}`}); dead.push(c); } else alive.push(c); });
  const max = S.special === 'jubilee' ? 48 : 12, nH = Math.min(alive.length, Math.floor(Math.pow(rng(), 1.4) * (max + 1)));
  const score = c => { const m = call(c); if(m && !m.h) return -1; return c.a.courage * 0.3 + c.a.teamwork * 0.3 + c.a.combat * 0.2 + c.a.determination * 0.2 + (notable(c) ? 12 : 0) + (m ? m.h * 25 : 0) + rng() * 25; };
  const heroes = alive.filter(c => score(c) >= 0).sort((x, y) => score(y) - score(x)).slice(0, nH);
  const P = c => PR(c), nm = c => c.name;
  heroes.forEach((c, i) => { c.status = 'Approved'; c.catHero = S.edition; c.out = null; c.reason = `Licensed for ${PR(c).their} part in ${K.name.toLowerCase()}`;
    if(i < 14) log(S, p, 'major', pro(vpick(S, K.hero.concat(CAT_HERO), c.id + 'ch')({c: nm(c), n: 2 + Math.floor(rng() * 9), P: P(c)}), c), [c.id]); c.notes.push({p, text: `Licensed for ${PR(c).their} part in ${K.name.toLowerCase()}`}); });
  dead.slice().sort((x, y) => notable(y) - notable(x)).slice(0, 8).forEach(c => log(S, p, 'death', vpick(S, K.die.concat(CAT_DIE), c.id + 'cd')({c: nm(c), P: P(c)}), [c.id]));
  if(dead.length > 8) log(S, p, 'death', `${dead.length} candidates died in ${K.name.toLowerCase()}.`, []);
  const fled = alive.filter(c => !heroes.includes(c));
  fled.forEach(c => { c.status = 'Eliminated'; c.out = p; c.fled = S.edition; c.reason = `${K.name}: fled with the other survivors`; });
  if(fled.length) log(S, p, 'info', vpick(S, CAT_FLEE, 'cf')({n: fled.length}), []);
  // the examiners on duty that year: most become the rescue, some do not come back
  C.ex = []; const seenEx = new Set();
  PHASES.forEach(x => { const e = x.ex; if(!e || !e.license || seenEx.has(e.license)) return; seenEx.add(e.license);
    const died = rng() < 0.2, o = {e: e.name, what: K.what, P: PR({gender: e.gender})};
    C.ex.push({license: e.license, name: e.name, died, o}); });
  // one or two of the living get their own line; the rest are named together; every one who died is remembered by name
  const exLive = C.ex.filter(x => !x.died), exDead = C.ex.filter(x => x.died);
  exLive.slice(0, 2).forEach(x => log(S, p, 'major', vpick(S, CAT_EXH, x.license)(x.o), []));
  if(exLive.length > 2){ const r = exLive.slice(2), nmL = r.slice(0, 3).map(x => x.name), more = r.length - nmL.length;
    log(S, p, 'major', `${nmL.join(', ')}${more ? ` and ${more} other examiner${more === 1 ? '' : 's'}` : ''} ${r.length === 1 ? 'becomes' : 'become'} the rescue: stretchers, tourniquets, and no sleep for three days.`, []); }
  exDead.forEach(x => log(S, p, 'death', vpick(S, CAT_EXD, x.license)(x.o), []));
  C.ex.forEach(x => delete x.o);
  C.dead = dead.length; C.fled = fled.length; C.heroes = heroes.map(c => c.id);
  S.stats.push({p, before: act.length, after: heroes.length});
  log(S, p, 'phase', `${K.name}: ${heroes.length} new Hunter${heroes.length === 1 ? '' : 's'}, ${dead.length} dead, ${fled.length} fled. The rest of the exam is never held.`, []);
  S.finished = true; S.phase = PHASES.length; finalizeAttempts(S); S.chronicle = chronicle(S);
  return true;
}
function runPhase(S){
  if(S.finished) return;
  useLineup(S);
  S.started = true;
  const p = S.phase, ph = PHASES[p];
  if(S.cat && S.cat.p === p && S.cat.stage === 'impact'){ runCatastrophe(S, p); return; }
  if(ph.ex) log(S, p, 'examiner', `${ph.ex.name}${ph.ex.license ? ` (${ph.ex.license}, ${ph.ex.career}${ph.ex.from ? `, licensed in the ${ordinal(ph.ex.from)}` : ', veteran Hunter'})` : ''} runs the ${ph.name} — ${EX_STYLES[ph.ex.style].desc}. ${exIntro(S, ph, p)}`, []);
  if(ph.ex && ph.ex.cid){
    S.candidates.filter(c => c.status === 'Active' && ((c.pastAllies || []).includes(ph.ex.cid) || (c.prevAllies || []).includes(ph.ex.cid) || (c.grudges || []).some(g => g.id === ph.ex.cid))).slice(0, 2).forEach(c => {
      const foe = (c.grudges || []).some(g => g.id === ph.ex.cid);
      log(S, p, foe ? 'rival' : 'story', foe ? vpick(S, [o => `${o.e} recognises ${o.c.name} among the candidates — the last time they met, it did not end well.`, o => `${o.c.name} goes pale: the examiner is ${o.e}, an old rival.`, o => `${o.e} and ${o.c.name} lock eyes. Neither has forgotten.`], c.id)({e: ph.ex.name, c})
        : vpick(S, [o => `${o.e} recognises an old ally in the crowd: ${o.c.name}.`, o => `${o.c.name} grins — the examiner, ${o.e}, once fought at ${PR(o.c).their} side.`, o => `A nod from ${o.e} to ${o.c.name}. They went through an exam together once.`], c.id)({e: ph.ex.name, c}), [c.id]);
    });
  }
  if(S.cat && S.cat.p === p && !S.cat.stage){ runCatastrophe(S, p); return; }
  const rng = makeRng((S.seed ^ ((p+1) * 2654435761)) >>> 0);
  const active = S.candidates.filter(c => c.status === 'Active');
  const before = active.length;

  if(before === 0){ S.stats.push({p, before:0, after:0}); return advance(S); }

  S.alliances = S.alliances || [];
  THEME = S.theme || 'classic'; SPECIAL = S.special || null;
  NOALLY = THEME === 'whim' && (S.whimPs || [S.whimP]).includes(p);
  // the year's weather and mood, said in a way that fits where this trial happens (no rain inside the tower, no walls in the forest)
  const roofed = PH_INDOOR.has(ph.id) || ['indoor', 'under', 'train'].includes(PH_ENV[ph.id]), TL = (THEME_LINES[THEME] || []).filter(f => { const t = f({ph: 'the trial'}); return phFits(ph.id, t) && (roofed || !/\bwalls?\b/.test(t)) && (!roofed || !/\b(?:rain|wind|undergrowth|ground itself|thorns)\b/i.test(t) || /walls/.test(t)); });
  if(THEME !== 'classic' && TL.length && !ph.final && nhash(S.seed + 'tl' + p) % 10 < 7) dlog(S, p, 'story', vpick(S, TL, 'tl' + p)({ph: thePhase(ph.name)}), [], 3);
  if(NOALLY) log(S, p, 'major', `The Chairman rolls his dice: in the ${ph.name}, alliances are forbidden. Every candidate for themselves.`, []);
  const arng = makeRng((S.seed ^ ((p+1) * 0x85ebca6b) ^ 0xA11CE) >>> 0);
  const newAll = (!ph.zevil && !ph.final && !NOALLY) ? allianceEncounters(S, p, arng, active) : 0;
  if(newAll) log(S, p, 'info', `${newAll} alliance${newAll === 1 ? ' forms or grows' : 's form or grow'} during the ${ph.name}.`);
  const drng = makeRng((S.seed ^ ((p+1) * 0x27d4eb2d) ^ 0xD4A3A) >>> 0);
  dramaBefore(S, ph, p, drng, active);
  const act = active.filter(c => c.status === 'Active');
  if(ph.team) runTower(S, ph, p, rng, act);
  else if(ph.prisoner) runPrisoner(S, ph, p, rng, act);
  else if(ph.zevil) runZevil(S, ph, p, rng, act);
  else if(ph.final) runFinal(S, ph, p, rng, act);
  else if(ph.id === 'egg') runScored(S, ph, p, rng, act.filter(c => c.cookFail));
  else runScored(S, ph, p, rng, act);
  dramaAfter(S, ph, p, drng);

  if(ph.id === 'cooking'){
    const fails = active.filter(c => c.cookFail).length;
    if(fails) log(S, p, 'major', `The examiner rejected ${fails} dishes. The Chairman intervenes: failed candidates get a second chance at the Egg Retrieval.`);
  }
  const after = S.candidates.filter(c => c.status === 'Active' || c.status === 'Approved').length;
  if(!ph.final && !ph.zevil) allianceUpkeep(S, p, arng);
  (S.alliances || []).filter(A => A.family).forEach(A => {
    const m = cmap(S), ms = A.ever.map(id => m[id]).filter(Boolean);
    const lost = ms.filter(c => c.out === p && c.status !== 'Approved');
    if(!lost.length) return;
    const left = ms.filter(c => c.status === 'Active' || c.status === 'Finalist' || c.status === 'Approved').length;
    log(S, p, 'family', left ? `The ${A.name} lost ${lost.length === 1 ? 'one member' : lost.length + ' members'} during the ${ph.name} (${lost.map(c => c.first).join(', ')}); ${left} still in.` : `The ${A.name} is out of the exam: ${lost.map(c => c.first).join(', ')} fell in the ${ph.name}.`, lost.map(c => c.id));
  });
  if(!ph.final) (S.alliances || []).forEach(A => { if(A.members.filter(id => { const c = cmap(S)[id]; return c && c.status === 'Active'; }).length >= 2) A.together = (A.together || 0) + 1; });
  S.stats.push({p, before, after});
  if(!ph.final) log(S, p, 'phase', `${ph.name} complete: ${after} of ${before} candidates advance.`);
  advance(S);
}

function advance(S){
  const ph = PHASES[S.phase];
  if(ph.rest) S.candidates.forEach(c => c.fatigue *= 0.4);
  S.phase++;
  if(S.phase >= PHASES.length || S.candidates.every(c => c.status !== 'Active')){
    S.finished = true; S.phase = PHASES.length;
    S.candidates.forEach(c => { if(c.status === 'Active'){ eliminate(S, c, PHASES.length-1, 'Did not earn a license'); } });
    finalizeAttempts(S);
    S.chronicle = chronicle(S);
  }
}

// crowd pressure: when far more candidates remain than a typical exam, examiners raise the bar
let CROWD_K = 4;
const crowdRaise = (ph, n) => ph.cref ? Math.round(CROWD_K * Math.log(Math.max(1, n / ph.cref)) * 10) / 10 : 0;
// experience: returning candidates remember phases they have already been through
function expBonus(S, c, p){
  let entered = 0, passed = 0;
  const key = PHASES[p].xpKey;
  (c.attempts || []).forEach(a => {
    if(a.edition === S.edition || a.phase === null || a.phase === undefined) return;
    const ids = a.ids || LEGACY_KEYS.slice(0, a.phase + 1), done = a.passedIds || LEGACY_KEYS.slice(0, a.phase);
    if(ids.includes(key)){ entered++; if(done.includes(key)) passed++; }
  });
  return Math.min(XP_CAP, Math.sqrt(entered) * 1.6 + Math.sqrt(passed) * 1.1) * (THEME === 'rookie' ? 0.4 : 1);   // diminishing: the first repeat teaches most
}
let XP_CAP = 3.5;
const PHYSICAL = new Set(['sea','marathon','stairs','wetlands','capture','egg','cliffpath','desert','nighthunt','mountain','beast']);
function runScored(S, ph, p, rng, pool){
  const xpW = PHYSICAL.has(ph.id) ? 0.4 : 0.8;
  const fieldXp = pool.length ? pool.reduce((s, c) => s + expBonus(S, c, p) * xpW, 0) / pool.length : 0;  // examiners calibrate to an experienced field
  const raise = crowdRaise(ph, pool.length), T = Math.round(ph.T + raise + fieldXp - themeEase() + (THEME === 'wild' && ph.obstacle ? 3 : 0));
  if(raise >= 1) log(S, p, 'info', `With ${pool.length} candidates still in, the examiner makes the ${ph.name} harder than usual.`);
  const passed = [], failed = [];
  for(const c of pool){
    const own = weighted(c, ph.w), noise = rng.gauss(0, 7 * ph.exNoise * (ph.luck || 1)), tired = c.fatigue * 0.15, vet = (c.attempts || []).length > 1;
    const mates = alliesOf(S, c);
    let base = own, helper = null;
    if(ph.mute){}   // the Mute Crossing: nobody can help anybody
    else if(mates.length && PHYSICAL.has(ph.id)){
      // joint strength: the group moves at a shared pace (70% own, 30% best ally), strong members lose at most a little
      const best = mates.reduce((b, o) => weighted(o, ph.w) > weighted(b, ph.w) ? o : b, mates[0]);
      const bw = weighted(best, ph.w);
      const wk = isRelative(best, c) ? 0.38 : 0.3;
      base = Math.max(own - 2, (1 - wk) * own + wk * bw) + (isRelative(best, c) ? 3 : 2);
      if(bw > own) helper = best;
    } else {
      const help = allyHelp(S, c, ph.w);
      if(help){ base = own + help.bonus; helper = help.ally; }
    }
    const raw = own + noise - tired;
    const xp = expBonus(S, c, p) * xpW;   // knowing a route matters less than legs and lungs
    const score = Math.round(base + noise - tired + xp + dmod(c) + (ph.rookie ? (vet ? -4 : 3) : 0) + (ph.vets ? (vet ? 5 : -2) : 0));
    c.scores[ph.id] = score;
    injuryCheck(S, c, p, score, T);
    if(xp && score >= T && score - xp < T && !(helper && Math.round(raw) < T)){
      log(S, p, 'veteran', `${c.name} has been through the ${ph.name} before and knows what to expect — it makes the difference.`, [c.id], true);
      c.notes.push({p, text:`Experience from earlier exams got ${PR(c).them} through`});
    }
    if(helper && score >= T && Math.round(raw) < T){
      const A = bondOf(S, helper, c); if(A){ A.helped = p; A.saves = (A.saves || 0) + 1; }
      log(S, p, isRelative(helper, c) ? 'family' : 'help', vpick(S, T_HELP, c.id)({h: helper, c, rel: isRelative(helper, c) ? kinOf(helper, c) : 'ally', relH: isRelative(helper, c) ? kinOf(c, helper) : 'ally', ph: ph.name, tag: A ? ' (' + A.name + ')' : ''}), [helper.id, c.id], !isRelative(helper, c));
      c.notes.push({p, text:`Made it thanks to ally ${helper.name}`}); helper.notes.push({p, text:`Helped ally ${c.name} through`});
    }
    if(ph.fatigue) c.fatigue = clamp(c.fatigue + ph.fatigue * ph.exFat * (1.15 - c.a.endurance/100), 0, 100);
    (score >= T ? passed : failed).push(c);
  }
  // Bound Pairs: tied two by two (allies first, strangers after); a pair passes or falls together
  if(ph.pairs){
    const all = passed.concat(failed), used = new Set(), pairs = [], sc = c => c.scores[ph.id], notable = c => spNotable(c);
    all.forEach(c => { if(used.has(c.id)) return; used.add(c.id); const m = alliesOf(S, c).find(o => all.includes(o) && !used.has(o.id)); if(m){ used.add(m.id); pairs.push([c, m, true]); } });
    const rest = rng.shuffle(all.filter(c => !pairs.some(x => x[0] === c || x[1] === c)));
    for(let i = 0; i < rest.length; i += 2) pairs.push([rest[i], rest[i + 1] || null, false]);
    passed.length = 0; failed.length = 0; let told = 0;
    pairs.forEach(([a, b, al]) => {
      if(!b){ (sc(a) >= T ? passed : failed).push(a); return; }
      const ok = (sc(a) + sc(b)) / 2 + (al ? 2 : 0) >= T; [a, b].forEach(c => (ok ? passed : failed).push(c));
      const strong = sc(a) >= sc(b) ? a : b, weak = strong === a ? b : a;
      if(told < 4 && (notable(a) || notable(b)) && ((ok && sc(weak) < T) || (!ok && sc(strong) >= T))){ told++;
        log(S, p, 'event', ok ? vpick(S, [x => `${x.w.name} got through the ${ph.name} on ${x.s.name}'s back.`, x => `Tied to ${x.s.name}, ${x.w.name} makes it. Alone, ${PR(x.w).they} would not have.`], weak.id + 'bp')({w: weak, s: strong})
          : vpick(S, [x => `${x.s.name} would have made it alone. Tied to ${x.w.name}, ${PR(x.s).they} did not.`, x => `${x.s.name} pulls and pulls, but ${x.w.name} cannot keep up. They fall together.`], strong.id + 'bp')({w: weak, s: strong}), [strong.id, weak.id]); }
    });
  }
  // allies never leave a member behind without trying: every brave ally who passed attempts a rescue
  if(ph.id !== 'cooking' && !NOALLY && !ph.mute && !ph.pairs){
    for(const c of failed.slice()){
      if(c.scores[ph.id] < T - 10) continue;
      for(const r of alliesOf(S, c).filter(o => passed.includes(o) && (bonded(o, c) || o.a.courage >= (isRelative(o, c) ? 35 : 50))).sort((x, y) => (bonded(y, c) * 2 + isRelative(y, c)) - (bonded(x, c) * 2 + isRelative(x, c)))){
        const chance = clamp(0.35 + (r.a.courage + r.a.teamwork - 100) / 250 + (isRelative(r, c) ? 0.2 : 0) + (bonded(r, c) ? 0.35 : 0), 0.2, bonded(r, c) ? 0.95 : 0.9);
        if(rng() < chance * (THEME === 'silence' ? 0.35 : 1)){
          failed.splice(failed.indexOf(c), 1); passed.push(c);
          c.rescuedBy = r.id; r.fatigue = clamp(r.fatigue + 8, 0, 100); owe(S, c, r, p);
          const A = bondOf(S, r, c); if(A){ A.saves = (A.saves || 0) + 1; A.helped = p; }
          c.notes.push({p, text:`${ph.name}: rescued by ally ${r.name}`}); r.notes.push({p, text:`${ph.name}: rescued ally ${c.name}`});
          log(S, p, isRelative(r, c) ? 'family' : 'rescue', vpick(S, T_ARESCUE, c.id)({r, c, rel: isRelative(r, c) ? kinOf(r, c) : 'ally', relH: isRelative(r, c) ? kinOf(c, r) : 'ally', ph: ph.name, tag: A ? ' (' + A.name + ')' : ''}), [r.id, c.id]);
          r.rescues = (r.rescues || 0) + 1; if(r.rescues >= 4) giveNick(S, r, 'life', 'for pulling allies through again and again', p, 0.25);
          break;
        }
      }
    }
  }
  // rescues: a brave, cooperative candidate may save someone who barely failed
  if(ph.rescue && passed.length && THEME !== 'silence'){
    for(const c of failed.slice()){
      if(c.scores[ph.id] < T - 6) continue;
      const h = rng.pick(passed);
      if(h.a.courage + h.a.teamwork > 125 && rng() < 0.5){
        failed.splice(failed.indexOf(c), 1); passed.push(c);
        c.rescuedBy = h.id; owe(S, c, h, p);
        c.notes.push({p, text:`${ph.name}: rescued by ${h.name}`});
        h.notes.push({p, text:`${ph.name}: rescued ${c.name}`});
        log(S, p, 'rescue', `${h.name} ${ph.rescue.replace('{v}', c.name)}.${pro(vpick(S, T_RESCUE_CODA, h.id), h)}`, [h.id, c.id]);
        h.rescues = (h.rescues || 0) + 1; if(h.rescues >= 3) giveNick(S, h, 'life', 'for rescuing strangers', p, 0.25);
      }
    }
  }
  if(ph.id !== 'cooking') repayDebts(S, ph, p, rng, T, passed, failed);
  if(THEME === 'blood' && ph.exStyle === 'Cruel' && (PHYSICAL.has(ph.id) || ph.obstacle)){
    const ACC = {centennial:'was crushed when the old passage gave way', sea:'drowned in the storm', cliffpath:'fell from the cliff', mountain:'fell from the ice wall', egg:'fell into the ravine', wetlands:'was pulled under by the swamp', capture:'was trampled by a Great Stamp', beast:'was mauled by a beast', marathon:'collapsed and never got up', stairs:'collapsed on the stairs and never got up', desert:'died of heat in the dunes', nighthunt:'fell into a hunter\'s pit', tower:'fell through a trapdoor', maze:'was crushed by a moving wall', raft:'drowned in the rapids'};
    let acc = 0;
    failed.slice().forEach(c => { if(acc < 1 && c.scores[ph.id] >= T - 6 && rng() < 0.012){ acc++; failed.splice(failed.indexOf(c), 1); c.status = 'Deceased'; c.out = p; c.reason = `${ph.name}: ${ACC[ph.id] || 'died in an accident'}`; c.notes.push({p, text: `Died: ${ACC[ph.id] || 'an accident'}`}); dlog(S, p, 'death', `${c.name} ${ACC[ph.id] || 'died in an accident'}. ${ph.ex ? ph.ex.name : 'The examiner'} does not stop.`, [c.id], 8); lastWords(S, p, c, null); } });
  }
  for(const c of passed){
    const sc = c.scores[ph.id];
    if(ph.id === 'egg') c.cookFail = false;
    if(!c.rescuedBy || c.notes[c.notes.length-1].p !== p) c.notes.push({p, text:`${ph.name}: ${verdict(sc - T)}`});
  }
  // The Pit: a few of the ones who lose badly do not come out of it
  if(ph.pit) failed.slice().forEach(c => { if(c.scores[ph.id] < T - 8 && rng() < 0.07){ failed.splice(failed.indexOf(c), 1); c.status = 'Deceased'; c.out = p; c.reason = `${ph.name}: did not come out of the pit`; c.notes.push({p, text: 'Died in the Pit'}); lastWords(S, p, c, null); } });
  for(const c of failed){
    const sc = c.scores[ph.id];
    if(ph.id === 'cooking'){ c.cookFail = true; c.notes.push({p, text:`Dish rejected — sent to the Egg Retrieval`}); continue; }
    const wk = weakest(c, ph.w);
    eliminate(S, c, p, `${ph.name}: ${ph.fail[wk]}${sc >= T - 3 ? ', missing the cut by a hair' : ''}`);
    setFall(S, c, p, fallPick(S, ((FALL_SC[ph.id] || {})[wk] || []).concat(['{F} ' + ph.fail[wk] + '.']), c.id + p), {attr: wk, hair: sc >= T - 3});
  }
  const best = pool.reduce((b,c) => !b || c.scores[ph.id] > b.scores[ph.id] ? c : b, null);
  if(best){ log(S, p, 'major', vpick(S, phKind(ph) === 'course' ? T_LEAD : T_LEAD_TEST, ph.id)({c: best, ph: ph.name}), [best.id]); giveNick(S, best, 'ace', `for leading the ${ph.name}`, p, 0.35); }
  trialCloser(S, ph, p, pool, passed, T, best);
  const out = failed.filter(c => c.status === 'Eliminated');
  if(out.length){
    const s = out.sort((x,y) => total(y)-total(x))[0];
    log(S, p, 'elim', s.fallScene ? vpick(S, [`Surprise exit: ${s.name}, one of the more capable applicants, is out. ${s.fallScene}`, `Few saw it coming. ${s.fallScene}`, `The favourites are not safe. ${s.fallScene}`], s.id) : vpick(S, T_SURPRISE, s.id)({c: s, why: pro(ph.fail[weakest(s, ph.w)], s)}), [s.id]);
  }
  if(ph.fatigue >= 25){
    const tough = pool.filter(c => c.status === 'Active' && c.fatigue > 60).sort((x,y) => y.fatigue - x.fatigue)[0];
    if(tough) log(S, p, 'info', `${tough.name} is still in, but on the verge of collapse.`, [tough.id]);
  }
}

/* ---------- a team's way down: one door per level, the vote at each, and when they got there ---------- */
// six doors take a team from the top (level 0) to the way out (level 6). Kinds: agreed, split (a tie, hours lost),
// short (a hidden way that skips a level), trap (hours lost), stuck (the door they never got through)
const TEAM_DOORS = {
  tower: ['Left door', 'Right door', 'The stairs', 'Long hall', 'Bridge over nothing', 'Mirror room', 'Spiked corridor', 'Flooded room', 'Dice room', 'Silent room', 'Narrow shaft', 'Chained door'],
  maze: ['Left fork', 'Right fork', 'Low tunnel', 'Painted gallery', 'Echo chamber', 'Dry well', 'Bone gallery', 'Water passage', 'Collapsed hall', 'Root tunnel', 'Lantern hall', 'Spiral stair'],
  raft: ['Left channel', 'Right channel', 'Portage', 'Whirlpool', 'Narrows', 'Rapids', 'Sandbar', 'Gorge', 'Reed maze', 'Fallen tree', 'Broken weir', 'Fog bank']};
const TEAM_LAST = {tower: 'The last door', maze: 'The last gate', raft: 'The falls'};
const TEAM_SHORT = {tower: ['Hidden passage', 'Secret chute'], maze: ['Hidden passage', 'Crawlway'], raft: ['Side channel', 'Shortcut chute']};
const TEAM_TRAP = {tower: ['Pit', 'Falling ceiling', 'Sleeping gas'], maze: ['Pit', 'Dead end', 'Rockfall'], raft: ['Capsize', 'Snag', 'Undertow']};
function teamRoute(S, ph, p, rng, o){
  const k = TEAM_DOORS[ph.id] ? ph.id : 'tower', n = o.team.length;
  // paired with its duels, the trial stops halfway (between levels 2 and 3): a team that fails never gets that far
  const stuck = o.ok ? 6 : o.merged ? clamp(2 - Math.floor(Math.max(0, o.TT - o.score) / 6), 1, 2) : clamp(5 - Math.floor(Math.max(0, o.TT - o.score) / 3), 1, 5);   // the level they ended on
  const pool = rng.shuffle(TEAM_DOORS[k].slice());
  const doors = [];
  let lvl = 0, splits = Math.min(o.lost + (o.loner ? 1 : 0), 4), shortUsed = !o.shortcut, trapLeft = rng() < 0.3 ? 1 : 0;
  const vote = split => { if(n < 2) return [1, 0]; if(split) return [Math.floor(n / 2), Math.ceil(n / 2)]; const no = rng() < 0.35 ? rng.int(1, Math.max(1, Math.floor((n - 1) / 2))) : 0; return [n - no, no]; };
  while(lvl < stuck){
    const left = stuck - lvl, canShort = !shortUsed && left >= 2 && rng() < 0.5;
    if(canShort){ shortUsed = true; const [f, a] = vote(false); doors.push({d: rng.pick(TEAM_SHORT[k]), f, a, k: 'short', by: o.brain.id, to: lvl + 2}); lvl += 2; continue; }
    if(splits && rng() < 0.55){ splits--; const [f, a] = vote(true); doors.push({d: o.loner ? `${o.loner.first || o.loner.name} says no` : 'Deadlock', f, a, k: 'split', to: lvl + 1}); lvl++; continue; }
    if(trapLeft && rng() < 0.4){ trapLeft = 0; const [f, a] = vote(false); doors.push({d: rng.pick(TEAM_TRAP[k]), f, a, k: 'trap', to: lvl + 1}); lvl++; continue; }
    const [f, a] = vote(false); doors.push({d: lvl === 5 ? TEAM_LAST[k] : pool.pop() || 'Door', f, a, k: 'ok', to: lvl + 1}); lvl++;
  }
  if(!o.ok){ const [f, a] = vote(!!o.loner || o.lost > 0); doors.push({d: o.loner ? `${o.loner.first || o.loner.name} says no` : pool.pop() || 'Door', f, a, k: 'stuck', to: lvl}); }
  // when: each door costs time by its kind; a team that made it is out at 72 minus its spare hours
  const end = o.ok ? clamp(72 - o.hoursLeft, 20, 72) : 72, W = {ok: 1, short: 0.8, trap: 1.8, split: 2.6, stuck: 0};
  const passed = doors.filter(d => d.k !== 'stuck'), tot = passed.reduce((s, d) => s + W[d.k] * (0.8 + rng() * 0.5), 0) || 1;
  const span = o.ok ? end - 1 : (55 + rng() * 12) - 1;
  let h = 1, acc = 0; const path = [[0, 0]];
  passed.forEach(d => { acc += W[d.k] * (0.8 + rng() * 0.4); h = Math.min(o.ok ? end : 70, Math.round(1 + span * acc / tot)); d.h = h; path.push([h, d.to]); });
  if(o.ok) path[path.length - 1][0] = Math.round(end); else path.push([72, stuck]);
  // paired with its duels, the first half leaves room on the clock for the stop and the rest of the way
  if(o.merged){ const sq = h => Math.round(h * 0.72); path.forEach((x, j) => { if(!(j === path.length - 1 && !o.ok)) x[0] = sq(x[0]); }); doors.forEach(d => { if(d.h) d.h = sq(d.h); }); }
  const nameOf = o.M.alliance ? o.M.alliance.name : null;
  (S.teamRun = S.teamRun || {})[p] = S.teamRun[p] || {k, teams: []};
  if(o.merged) S.teamRun[p].merged = p + 1;
  const route = o.merged ? (rng() < 0.45 ? 'vote' : 'other') : undefined;
  S.teamRun[p].teams.push({n: o.T, name: nameOf, formed: !nameOf ? 'strangers' : /Family$/.test(nameOf) ? 'family' : 'alliance', rec: (o.M.recruits || []).map(c => c.id), ids: o.team.map(c => c.id), lead: o.leader.id, loner: o.loner ? o.loner.id : undefined,
    ok: o.ok, spare: o.ok ? Math.max(0, Math.round(72 - path[path.length - 1][0])) : null, end: stuck, path, doors, ...(route ? {route, obst: route === 'other' ? rng.pick(TEAM_OTHER[k]) : undefined} : {})});
}
// the team trials that carry their duels inside them, as in the manga: the Trick Tower's prisoners wait halfway down
const TEAM_PAIR = {tower: 'prisoner', maze: 'guardians', raft: 'bandits'};
const teamMerged = (ph, p) => !!(TEAM_PAIR[ph.id] && PHASES[p + 1] && PHASES[p + 1].id === TEAM_PAIR[ph.id]);
const TEAM_STOP_W = {tower: 'hall', maze: 'gate', raft: 'toll bank'};
const TEAM_OTHER = {tower: ['a room that slowly fills with sand', 'a corridor of pressure plates', 'a mirror maze with one real door', 'a long drop into dark water', 'a staircase that only moves when nobody speaks'],
  maze: ['an underground river', 'a collapsed gallery', 'a stretch with no light at all', 'a hall of echoes', 'a flooded stair'],
  raft: ['the rapids', 'the flooded forest', 'the mill race', 'a channel choked with reeds', 'a stretch where the river runs underground']};
function runTower(S, ph, p, rng, active){
  const merged = teamMerged(ph, p);
  const raise = crowdRaise(ph, active.length);
  let TT = Math.round(ph.T + raise);
  if(raise >= 1) log(S, p, 'info', `With ${active.length} candidates entering, the ${ph.name}\'s routes are rigged to be harder than usual.`);
  // teams are built around alliances: each alliance enters together, small ones recruit nearby candidates
  const chunk = arr => { const out = []; let i = 0; while(i < arr.length){ let size = rng.int(3, 5); const left = arr.length - i - size; if(left > 0 && left < 3) size = left + size <= 5 ? left + size : size - (3 - left); out.push(arr.slice(i, i + size)); i += size; } return out; };
  const inTeam = new Set(), teams = [], meta = [];
  const groups = {};
  active.forEach(c => { const A = familyOf(S, c) || allianceOf(S, c); if(A) (groups[A.id] = groups[A.id] || {A, m: []}).m.push(c); });
  Object.values(groups).filter(g => g.m.length >= 2).sort((x, y) => y.m.length - x.m.length).forEach(g => {
    const parts = g.m.length <= 5 ? [rng.shuffle(g.m.slice())] : chunk(rng.shuffle(g.m.slice()));
    parts.forEach(t => { t.forEach(c => inTeam.add(c.id)); teams.push(t); meta.push({alliance: g.A, recruits: []}); });
  });
  // free candidates sorted by registration number: neighbours tend to end up together
  const free = active.filter(c => !inTeam.has(c.id)).sort((a, b) => a.reg - b.reg);
  const takeNearest = reg => { if(!free.length) return null; let k = 0; free.forEach((c, i) => { if(Math.abs(c.reg - reg) < Math.abs(free[k].reg - reg)) k = i; }); return free.splice(k, 1)[0]; };
  teams.forEach((t, i) => {
    const want = t.length < 3 ? 3 - t.length + (rng() < 0.4 ? 1 : 0) : 0;
    const mid = t.reduce((s, c) => s + c.reg, 0) / t.length;
    for(let k = 0; k < want; k++){ const r = takeNearest(mid); if(r){ t.push(r); meta[i].recruits.push(r); inTeam.add(r.id); } }
  });
  chunk(free).forEach(t => { teams.push(t); meta.push({alliance: null, recruits: []}); });
  // a lone leftover joins the smallest team
  for(let i = teams.length - 1; i >= 0; i--) if(teams[i].length < 2 && teams.length > 1){ const [x] = teams.splice(i, 1); meta.splice(i, 1); const small = teams.reduce((b, t) => t.length < b.length ? t : b, teams[0]); small.push(...x); }
  const teamVet = t => { const x = Math.max(0, ...t.map(c => expBonus(S, c, p))); return x ? Math.min(6, x * 0.8) : 0; };
  TT = Math.round(ph.T + raise - themeEase() + (THEME === 'wild' && ph.obstacle ? 3 : 0) + (teams.length ? teams.reduce((s, t) => s + teamVet(t), 0) / teams.length : 0));   // the tower adapts to veteran-led teams
  let bestTeam = null, bestScore = -1, passed = 0;
  teams.forEach((team, ti) => {
    const T = ti + 1;
    const avg = team.reduce((s,c) => s + weighted(c, ph.w) + dmod(c) * 0.6, 0) / team.length;
    const fat = team.reduce((s,c) => s + c.fatigue, 0) / team.length;
    const loner = team.find(c => c.a.teamwork < 30);
    const leader = team.reduce((b,c) => (c.a.charisma > b.a.charisma ? c : b), team[0]);
    const brain = team.reduce((b,c) => (c.a.intelligence + c.a.strategy > b.a.intelligence + b.a.strategy ? c : b), team[0]);
    const shortcut = (brain.a.intelligence + brain.a.strategy) / 2 > 75 && rng() < 0.5;
    // majority votes at the tower's doors
    const votes = team.length > 1 ? rng.int(2, 4) : 0; let lost = 0;
    const trusts = c => team.some(o => o !== c && ((c.alliance && o.alliance === c.alliance) || isRelative(c, o)));   // allies vote together
    for(let v=0; v<votes; v++){ const agree = team.filter(c => rng()*100 < c.a.teamwork + 20 + (trusts(c) ? 18 : 0)).length; if(agree <= team.length/2) lost++; }
    const allyPairs = team.filter(c => team.some(o => o !== c && ((c.alliance && o.alliance === c.alliance) || isRelative(c, o)))).length;
    const vet = team.reduce((b, c) => { const x = expBonus(S, c, p); return !b || x > b.x ? {c, x} : b; }, null);
    const vetBonus = vet && vet.x ? Math.min(6, vet.x * 0.8) : 0;      // a veteran remembers traps, doors and the fastest routes
    const score = Math.round(avg + rng.gauss(0, 6) - fat*0.2 - (loner ? 5 : 0) - lost*2 + (shortcut ? 6 : 0) + (team.length === 1 ? -4 : 0) + Math.min(6, allyPairs * 1.5) + vetBonus);
    const ok = score >= TT;
    const hoursLeft = Math.round(clamp((score - TT) * 2.2, -40, 40));
    const names = team.map(c => c.name);
    const M = meta[ti] || {};
    log(S, p, 'team', `Team ${T}${M.alliance ? ' · ' + M.alliance.name : ''} (${names.join(', ')}) — led by ${leader.name}.${M.alliance && M.recruits.length ? ` Recruited ${M.recruits.map(r => r.name).join(' and ')} to fill the team.` : ''}${allyPairs ? ` ${allyPairs} allies vote as one.` : ''} ${votes ? `${votes - lost} of ${votes} majority votes passed. ` : ''}${ok ? (merged ? `Through the first half; the ${TEAM_STOP_W[ph.id]} is next.` : `${ph.flavor.done.charAt(0).toUpperCase() + ph.flavor.done.slice(1)} with ${hoursLeft}h to spare.`) : `${ph.flavor.timeout}.`}`, team.map(c => c.id), true);
    teamRoute(S, ph, p, rng, {T, team, M, leader, loner, brain, shortcut, lost, ok, hoursLeft, score, TT, merged});
    if(loner) log(S, p, 'info', `Majority votes stall: ${loner.name} keeps refusing to cooperate with team ${T}.`, [loner.id]);
    if(shortcut) log(S, p, 'major', `${brain.name} finds a hidden shortcut for team ${T}.`, [brain.id]);
    if(vetBonus) { log(S, p, 'veteran', `${vet.c.name} has been through the ${ph.name} before and guides team ${T} past the traps they remember.`, [vet.c.id], true); vet.c.notes.push({p, text:`Guided team ${T} using what ${PR(vet.c).they} remembered of the ${ph.name}`}); giveNick(S, vet.c, 'hand', `for guiding team ${T} through the ${ph.name}`, p, 0.06); }
    // one cause for the whole team: the weak link decides how it went wrong
    const weak = team.slice().sort((x, y) => weighted(x, ph.w) - weighted(y, ph.w))[0], teamWhy = weak ? ph.fail[weakest(weak, ph.w)] : null;
    team.forEach(c => {
      c.scores[ph.id] = score; c.team = T;
      const mates = names.filter(n => n !== c.name).join(', ');
      if(ok) c.notes.push({p, text: merged ? `${ph.name}: team ${T} with ${mates || 'nobody'}, through the first half` : `${ph.name}: team ${T} with ${mates || 'nobody'}, ${ph.flavor.done} with ${hoursLeft}h to spare`});
      else {
        const why = loner && c !== loner ? `team was crippled by ${loner.name}'s refusal to cooperate` : teamWhy || ph.fail[weakest(c, ph.w)];
        eliminate(S, c, p, `${ph.name}: ${why}; out of time (team ${T})`);
        const lf = loner ? (loner.first || loner.name) : '', wf = weak ? (weak.first || weak.name) : '', wk2 = weak ? weakest(weak, ph.w) : weakest(c, ph.w);
        const sc2 = loner && c !== loner ? fallPick(S, FALL_LONER[ph.id] || FALL_LONER._, c.id + p) : loner === c ? fallPick(S, FALL_LONER_SELF, c.id + p) : fallPick(S, ((FALL_TEAM[ph.id] || {})[wk2] || []).concat(['Team {T} ' + (ph.fail[wk2] || 'ran out of time').replace(/^team /, '') + '.']), c.id + p);
        setFall(S, c, p, sc2.replace(/\{L\}/g, loner ? loner.name : '').replace(/\{T\}/g, T).replace(/\{W\}/g, wf), {team: true, attr: wk2});
      }
    });
    if(ok){
      const M2 = meta[ti] || {};
      if(M2.alliance) M2.recruits.forEach(r => { const host = team.find(o => o.alliance === M2.alliance.id); if(host && rng() < allianceChance(host, r, ph.w, {obstacle:true}) + 0.15) formAlliance(S, p, host, r, `after the ${ph.name} together`, rng); });
      else if(team.length >= 2 && rng() < 0.25){ const [x, y] = rng.shuffle(team.slice()); formAlliance(S, p, x, y, `after surviving the ${ph.name} together`, rng); }
    }
    if(ok) passed++;
    if(score > bestScore){ bestScore = score; bestTeam = {T, names, hoursLeft}; }
  });
  log(S, p, 'info', `${teams.length} teams formed ${ph.flavor.inside}; ${passed} ${ph.flavor.within}.`);
  if(bestTeam && !merged) log(S, p, 'major', `Fastest descent: team ${bestTeam.T} (${bestTeam.names.join(', ')}) with ${bestTeam.hoursLeft}h left.`);
  // at least one team finds the path of the vote, so the duels have someone to play
  const R = S.teamRun && S.teamRun[p];
  if(merged && R && !R.teams.some(t => t.ok && t.route === 'vote')){ const t = R.teams.find(x => x.ok); if(t){ t.route = 'vote'; delete t.obst; } }
}

const PRISONER_KINDS = [
  {k:'Combat', w:{combat:.6,strength:.2,strategy:.2}},
  {k:'Riddle', w:{intelligence:.7,strategy:.3}},
  {k:'Wager',  w:{strategy:.6,intelligence:.25,combat:.15}}
];
let PR_BASE = 57;
const PRISONER_NAMES = ['Bendot','Sedokan','Majitani','Johness','Leroute','Tompa','Brodo','Gazul','Murk','Vexa','Old Kreel','Sabbath','Dorran','Grisette','Hask'];
/* ---------- the duels inside a team trial: each team that reached the halfway stop plays there together ---------- */
// One bout per member against the stop's own five; the team needs a majority (a tie: the leader plays once more).
// Only the dreaded game costs time (a lost wager in the tower, a wrong riddle in the labyrinth, a lost bet on the river):
// hours held while the 72-hour clock keeps running. Teams on other routes face an obstacle that costs time instead.
// After the stop the descent goes on; the last door is the long, easy way or the short, hard one.
const TEAM_STOP = {tower: {dread: 'Wager', kinds: {Combat: .45, Riddle: .2, Wager: .35}}, maze: {dread: 'Riddle', kinds: {Combat: .25, Riddle: .5, Wager: .25}}, raft: {dread: 'Wager', kinds: {Combat: .25, Riddle: .25, Wager: .5}}};
let PR_TEAM = 7.5, OB_TEAM = -14;   // calibration: keeps the pass rate of the two halves close to the old two phases
function stopHalls(ph){ const L = (ph.npcs && ph.npcs.length ? ph.npcs : PRISONER_NAMES_DEF).slice(), H = []; for(let i = 0; i + 5 <= L.length && H.length < 3; i += 5) H.push(L.slice(i, i + 5)); if(!H.length){ const x = L.slice(); while(x.length < 5) x.push(...L); H.push(x.slice(0, 5)); } return H; }
function runTeamStop(S, ph, p, rng, active, R){
  const k = R.k, cfg = TEAM_STOP[k] || TEAM_STOP.tower, halls = stopHalls(ph), act = new Set(active.map(c => c.id)), cm = cmap(S), sw = TEAM_STOP_W[k] || 'hall';
  const fieldXp = active.length ? active.reduce((s, c) => s + expBonus(S, c, p) * 0.8, 0) / active.length : 0;
  const base = PR_BASE + crowdRaise(ph, active.length) + fieldXp + ph.exT - themeEase() - PR_TEAM;
  const KW = Object.entries(cfg.kinds), pickKind = () => { let x = rng(), acc = 0; for(const [kk, w] of KW){ acc += w; if(x < acc) return PRISONER_KINDS.find(q => q.k === kk); } return PRISONER_KINDS[0]; };
  const handled = new Set(); let upset = null, passed = 0, held = 0;
  R.teams.forEach(t => {
    if(!t.ok) return;
    const M = t.ids.map(id => cm[id]).filter(c => c && act.has(c.id)); if(!M.length) return;
    M.forEach(c => handled.add(c.id));
    const lead = M.find(c => c.id === t.lead) || M[0], hx = (t.path.find(([, f]) => f >= 3) || t.path[t.path.length - 1])[0];
    t.hx = hx; let delay;
    if(t.route === 'other'){
      const avg = M.reduce((s, c) => s + weighted(c, ph.w) + dmod(c) * 0.6 - c.fatigue * 0.2, 0) / M.length, sc = avg + rng.gauss(0, 8);
      t.cell = Math.round(clamp(10 + (base - OB_TEAM - sc) * 1.4 + rng.gauss(0, 4), 2, 48)); t.ob = t.cell <= 8 ? 'ok' : 'slow'; delay = t.cell;
      log(S, p, 'team', `Team ${t.n}${t.name ? ' · ' + t.name : ''} takes another way: ${t.obst}${t.ob === 'ok' ? ', and gets through it quickly' : `, and loses ${t.cell} hours to it`}.`, M.map(c => c.id), true);
    } else {
      const hall = rng.int(0, halls.length - 1), PRs = halls[hall]; t.hall = hall + 1; t.bouts = [];
      const bout = (c, pr, dec) => {
        const kind = dec && k === 'raft' ? PRISONER_KINDS[0] : pickKind(), rating = rng.gauss(base, 9 * ph.exNoise);
        const tipper = kind.k !== 'Combat' ? M.find(o => o !== c && o.a.intelligence >= c.a.intelligence + 10) : null;
        const score = weighted(c, kind.w) + rng.gauss(0, 8) - c.fatigue * 0.2 + (tipper ? 3 : 0) + expBonus(S, c, p) * 0.8 + dmod(c) * 0.7;
        const b = {id: c.id, npc: pr, k: kind.k, w: score >= rating ? 1 : 0};
        if(dec) b.dec = 1;
        else if(c !== lead && c.a.teamwork < 30 && rng() < 0.3){ b.w = 0; b.sab = 1; }
        if(b.w && kind.k === 'Combat' && score - rating > 14 && rng() < (THEME === 'blood' ? 0.5 : 0.2)) b.kill = 1;
        if(!b.w && kind.k === cfg.dread) b.lock = rng.int(10, 24);
        if(b.w && rating - weighted(c, kind.w) > 12) upset = {c, pr, kind};
        t.bouts.push(b); return b; };
      M.forEach((c, j) => bout(c, PRs[j % PRs.length]));
      let w = t.bouts.filter(b => b.w).length, l = t.bouts.length - w;
      if(w === l){ const b = bout(lead, k === 'raft' ? PRs[0] : PRs[M.length % PRs.length], true); w += b.w; l += 1 - b.w; }
      t.w = w; t.l = l; t.cell = t.bouts.reduce((s, b) => s + (b.lock || 0), 0); delay = t.bouts.length + t.cell;
      const say = b => `${cm[b.id].first || cm[b.id].name} ${b.sab ? 'threw the bout to' : b.w ? 'beat' : 'lost to'} ${b.npc} (${b.k}${b.lock ? `, ${b.lock}h held` : ''}${b.dec ? ', tie-break' : ''})`;
      log(S, p, 'team', `Team ${t.n}${t.name ? ' · ' + t.name : ''} at ${sw === 'hall' ? 'a hall' : 'the ' + sw} (${halls.length > 1 ? (k === 'raft' ? 'camp ' : k === 'maze' ? 'gate ' : 'hall ') + t.hall + ', ' : ''}${w}–${l}): ${t.bouts.map(say).join('; ')}.`, M.map(c => c.id), true);
      t.bouts.forEach(b => { const c = cm[b.id]; if(!c) return;
        if(b.sab) dlog(S, p, 'story', vpick(S, [`${c.name} gives the bout to ${b.npc} without a fight. Nobody on team ${t.n} believes it was fear.`, `${c.name} loses to ${b.npc} on purpose. The rest of team ${t.n} will not forget it.`], c.id + p), [c.id], 5);
        if(b.kill) dlog(S, p, 'major', vpick(S, [`${c.name} does not stop when the fight is over. ${b.npc} does not get up.`, `${b.npc} asked for a fight to the end. ${c.name} gave him one.`], c.id + p), [c.id], 7);
        if(!b.w && b.k === 'Combat' && THEME === 'blood' && (S._dm || 0) < 2 && rng() < 0.12){ S._dm = (S._dm || 0) + 1; c.status = 'Deceased'; c.out = p; c.reason = `${ph.name}: killed in a death-match`; dlog(S, p, 'death', `${c.name} does not survive the death-match with ${b.npc}. Nobody steps in to stop it.`, [c.id], 8); lastWords(S, p, c, null); }
      });
    }
    t.rel = hx + delay;
    // the rest of the way down, later by the time lost; the last door: the long, easy way or the short, hard one
    const after = t.path.filter(([, f]) => f >= 3).map(([h, f]) => [h + delay, f + 1]);
    if(after.length) after[0][0] = Math.max(after[0][0], t.rel);
    const lastD = t.doors.filter(d => d.k !== 'stuck').slice(-1)[0];
    if(t.route === 'vote' && after.length >= 2 && after[after.length - 1][1] === 7 && lastD){ t.final = lastD.a === 0 ? 'short' : 'long'; after[after.length - 1][0] = after[after.length - 2][0] + (t.final === 'short' ? 1 : Math.max(6, after[after.length - 1][0] - after[after.length - 2][0] + 6)); }
    const hp = t.path.filter(([, f]) => f < 3).map(x => x.slice()); if(t.route === 'vote') hp.push([hx, 3]);
    let last = t.route === 'vote' ? 3 : (hp[hp.length - 1] || [0, 0])[1];
    const lostHall = t.route === 'vote' && t.w < t.l;
    if(!lostHall && t.rel < 72) after.forEach(([h, f]) => { if(h <= 72){ hp.push([h, f]); last = f; } });
    t.hp = hp;
    t.res = lostHall ? 'hall' : t.rel >= 72 ? (t.route === 'vote' ? 'clockhall' : 'clock') : last === 7 ? 'out' : 'clock';
    if(t.res === 'out'){ t.outh = hp[hp.length - 1][0]; t.spare = Math.max(0, 72 - t.outh); }
    else { t.stuckAt = last; if(last < 6) delete t.final; }
    const T = t.n, alive = M.filter(c => c.status === 'Active');
    if(t.res === 'out'){ passed++;
      alive.forEach(c => { const b = (t.bouts || []).find(x => x.id === c.id); c.scores[ph.id] = b ? b.w : 1;
        log(S, p, 'duel', b ? `${c.name} ${b.w ? 'beat' : 'lost to'} ${b.npc} (${b.k}) — advances with team ${T}.` : `${c.name} took another way down with team ${T} — advances.`, [c.id], true);
        c.notes.push({p, text: b ? `${b.w ? 'Beat' : 'Lost to'} ${b.npc} (${b.k.toLowerCase()}); team ${T} went on ${t.w}–${t.l} and reached the bottom with ${t.spare}h to spare` : `Took another way down (${t.obst}) and reached the bottom with ${t.spare}h to spare`}); });
    } else {
      if(t.cell) held++;
      const why = t.res === 'hall' ? `the team lost the majority at the ${sw}` : t.res === 'clockhall' ? `the team was held at the ${sw} until the clock ran out` : t.route === 'other' ? `the team took another way down and the clock ran out` : `the team got past the ${sw}, but the hours it cost ran out the clock`;
      alive.forEach(c => { const b = (t.bouts || []).find(x => x.id === c.id); c.scores[ph.id] = b ? b.w : 0;
        if(b) log(S, p, 'duel', `${c.name} ${b.sab ? 'threw the bout to' : b.w ? 'beat' : 'lost to'} ${b.npc} (${b.k}) — eliminated with team ${T}.`, [c.id], true);
        eliminate(S, c, p, `${ph.name}: ${why}`);
        const own = b && !b.w && !b.sab ? `{F} lost ${b.k === 'Riddle' ? 'the riddle' : b.k === 'Wager' ? 'the bet' : 'the fight'} to ${npcIntro(b.npc)} ` : b && b.w ? `{F} beat ${b.npc}, ` : '';
        const tail = t.res === 'hall' ? (b && b.w ? `but team ${T} lost the majority, ${t.w}–${t.l}, and the way on never opened.` : `and team ${T} lost the majority, ${t.w}–${t.l}.`) : t.res === 'clockhall' ? `${own ? 'and ' : ''}team ${T} spent ${t.cell} hours held at the ${sw}. The clock ran out before they were let go.` : t.route === 'other' ? `Team ${T} went another way, ${t.obst}, lost ${t.cell} hours to it and never reached the bottom.` : `${own ? 'and ' : ''}team ${T} got through the ${sw}, but the hours it cost them ran out ${t.stuckAt >= 4 ? 'a few levels from the bottom' : 'soon after'}.`;
        setFall(S, c, p, (own + tail).replace(/^\w/, m => m.toUpperCase()).replace(/^\{f\}/, '{F}'), {team: true, attr: b ? (b.k === 'Riddle' ? 'intelligence' : b.k === 'Wager' ? 'strategy' : 'combat') : 'teamwork'}); });
    }
  });
  R.done = p;
  const rest = active.filter(c => !handled.has(c.id) && c.status === 'Active');
  if(rest.length) runPrisoner(S, ph, p, rng, rest);
  if(upset){ log(S, p, 'major', `Upset: ${upset.c.name} outplayed the veteran ${ph.npc || 'prisoner'} ${upset.pr} in a ${upset.kind.k.toLowerCase()} challenge.`, [upset.c.id]); giveNick(S, upset.c, 'giant', `for beating ${upset.pr}`, p); }
  log(S, p, 'info', `${passed} team${passed === 1 ? '' : 's'} reached the bottom.${held ? ` ${held} lost to the clock after hours held.` : ''}`);
}
function runPrisoner(S, ph, p, rng, active){
  const TR = S.teamRun && S.teamRun[p - 1];
  if(TR && TR.merged === p && TR.done == null) return runTeamStop(S, ph, p, rng, active, TR);
  const prFieldXp = active.length ? active.reduce((s, c) => s + expBonus(S, c, p) * 0.8, 0) / active.length : 0;
  let upset = null;
  for(const c of active){
    let won = 0; const parts = [];
    for(let b=0; b<2; b++){
      const kind = rng.pick(PRISONER_KINDS);
      const pr = rng.pick(ph.npcs || PRISONER_NAMES);
      const prRating = rng.gauss(PR_BASE + crowdRaise(ph, active.length) + prFieldXp + ph.exT - themeEase(), 9 * ph.exNoise);
      const tipper = kind.k !== 'Combat' ? alliesOf(S, c).find(o => o.a.intelligence >= c.a.intelligence + 10) : null;
      const score = weighted(c, kind.w) + rng.gauss(0, 8) - c.fatigue*0.2 + (tipper ? 3 : 0) + expBonus(S, c, p) * 0.8 + dmod(c) * 0.7;
      if(score >= prRating){ won++; parts.push(`beat ${pr} (${kind.k}${tipper ? ', with tips from ally ' + tipper.name : ''})`); if(prRating - weighted(c, kind.w) > 12) upset = {c, pr, kind}; }
      else parts.push(`lost to ${pr} (${kind.k})`);
    }
    c.scores[ph.id] = won;
    log(S, p, 'duel', `${c.name} ${parts.join(', then ')} — ${won ? 'advances' : 'eliminated'}.`, [c.id], true);
    if(won >= 1) c.notes.push({p, text:parts.join(', ')});
    else if(THEME === 'blood' && (S._dm || 0) < 2 && rng() < 0.12){ S._dm = (S._dm || 0) + 1; c.status = 'Deceased'; c.out = p; c.reason = `${ph.name}: killed in a death-match`; dlog(S, p, 'death', `${c.name} does not survive the death-match. Nobody steps in to stop it.`, [c.id], 8); lastWords(S, p, c, null); }
    else { eliminate(S, c, p, `${ph.name}: ${parts.join(' and ')}; the time penalties ran out the clock`);
      const L2 = parts.map(t => t.match(/^lost to (.+?) \((\w+)\)$/)).filter(Boolean);
      let sc3;
      if(L2.length === 2 && L2[0][2] === L2[1][2]){ const V = FALL_DUEL2[L2[0][2]] || FALL_DUEL2.Combat; sc3 = V[nhash(c.id + p) % V.length].replace('{A}', npcIntro(L2[0][1])).replace('{B}', L2[1][1] === L2[0][1] ? L2[1][1] + ' again' : npcIntro(L2[1][1])); }
      else { const cl = L2.map((m2, i) => { const V = FALL_DUEL[m2[2]] || FALL_DUEL.Combat; return V[nhash(c.id + p + i) % V.length].replace('{N}', i === 0 || m2[1] !== L2[0][1] ? npcIntro(m2[1]) : m2[1]); }); sc3 = `{F} ${cl[0]}, then ${cl[1] || 'ran out of time'}.`; }
      setFall(S, c, p, `${sc3.replace(/,\.$/, '.').replace(/, ,/g, ',')} ${FALL_DUEL_END[ph.id] || FALL_DUEL_END._}`, {attr: 'combat'}); }
  }
  if(upset){ log(S, p, 'major', `Upset: ${upset.c.name} outplayed the veteran ${ph.npc || 'prisoner'} ${upset.pr} in a ${upset.kind.k.toLowerCase()} challenge.`, [upset.c.id]); giveNick(S, upset.c, 'giant', `for beating ${upset.pr}`, p); }
}


