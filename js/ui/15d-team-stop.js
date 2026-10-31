/* ===================== A TEAM TRIAL WITH ITS DUELS INSIDE (Trick Tower + Prisoners, Labyrinth + Guardians, River + Bandits) ===================== */
// As in the manga, the duels happen halfway down: the engine still runs two phases, but the page tells them as one
// chapter in three movements (the descent, the stop, the last stretch), on one 72-hour clock.
const TR_SK = {
  tower: {LV: ['Roof', 'Floor 1', 'Floor 2', 'The hall', 'Floor 3', 'Floor 4', 'Floor 5', 'Out'], stop: 'hall', stopA: 'a hall', unit: 'Hall', npcs: 'prisoners', viz: 'The tower',
    titles: ['Majority Rules', 'Seventy-Two Hours', 'The Long Way Down'], sfx: 'ガチャン', bottom: 'The bottom',
    intro: ex => `Five prisoners in chains, and ${ex}, who explains: each of them proposes a game, each of you plays one, and the team needs a majority. Lose a wager and you pay in hours, held in the room next door while the clock keeps running.`,
    lock: 'held in a locked room', lockN: 'in the room', lockLeg: 'hours lost on a wager, held in a locked room',
    sab: F => `${F} gives up before it starts. Nobody on the team believes it was fear.`,
    kill: (who, F, n) => `${who} proposes a fight to the end. ${F} takes him at his word. ${n} does not get up.`, killS: 'he did not get up',
    tie: 'A tie, and a tie is not a majority: the leader plays once more.',
    finS: (T, L) => `At the last door the choice is written on the wall: the long, easy way, about ten hours, or the short, hard one, a few minutes. ${T} votes for the long way. Then ${L} picks up an axe and breaks through into the short one.`,
    finL: T => `At the last door the choice is written on the wall: the long, easy way or the short, hard one. ${T} cannot agree on the short one, and takes the long way down.`,
    finWord: ['the short way, with an axe', 'the long way'], outT: 'walks out of the bottom door', outP: 'walk out of the bottom door',
    mKill: (F, n, T) => `${F} does not stop when the fight is over, and ${n} does not get up. The rest of ${T} looks away.`,
    mSab: (F, n, T) => `${F} gives the bout to ${n} without a fight, and the rest of ${T} watch it happen.`,
    mLock: (F, n, T, h) => `${F} loses the wager to ${n}, and ${T} spends ${h} hours in a locked room, listening to the clock.`,
    rule: 'On the path of the vote, every team that gets this far plays: five prisoners, one bout per member, the prisoner proposes the game, the team needs a majority. Only a lost wager costs time, and it costs a lot: hours locked in a room while the clock keeps running. A tie means the leader plays once more. Not every way down has a hall.',
    pathW: 'the path where every door is a vote, with a hall of prisoners halfway down', costW: 'The hours in the room cost them the tower.'},
  maze: {LV: ['Entrance', 'Gallery 1', 'Gallery 2', 'The gate', 'Gallery 3', 'Gallery 4', 'Gallery 5', 'Exit'], stop: 'gate', stopA: 'a guarded gate', unit: 'Gate', npcs: 'guardians', viz: 'The labyrinth',
    titles: ['Every Fork a Vote', 'Seventy-Two Hours', 'Lost Together'], sfx: 'ゴゴゴ', bottom: 'The exit',
    intro: ex => `Five guardians stand at the gate, and ${ex} explains: each of them sets a trial, each of you takes one, and the team needs a majority. Get a riddle wrong and the labyrinth takes its price: the team is sealed in a side chamber for hours while the clock keeps running.`,
    lock: 'sealed in a side chamber', lockN: 'sealed in', lockLeg: 'hours sealed in a side chamber after a wrong answer',
    sab: F => `${F} gives an answer everyone knows is wrong. Nobody believes it was a mistake.`,
    kill: (who, F, n) => `${who} sets a trial of strength. ${F} hits it until something gives. ${n} cracks down the middle and does not move again.`, killS: 'broken',
    tie: 'A tie, and the gate will not open on a tie: the leader must answer once more.',
    finS: (T, L) => `At the last fork there are two ways: a lit corridor, long and safe, or a dark one where the air moves. ${L} wets a finger, finds the draft, and ${T} follows it into the dark.`,
    finL: T => `At the last fork there are two ways: a lit corridor, long and safe, or a dark one where the air moves. ${T} cannot agree on the dark, and takes the long, lit way.`,
    finWord: ['the dark way', 'the lit way'], outT: 'climbs out into daylight', outP: 'climb out into daylight',
    mKill: (F, n, T) => `${n} breaks under ${F}’s hands, and for a moment the whole of ${T} is afraid of what they have done.`,
    mSab: (F, n, T) => `${F} gives the wrong answer on purpose, and the rest of ${T} hear the side chamber lock behind them.`,
    mLock: (F, n, T, h) => `${F} gets ${n}’s riddle wrong, and ${T} spends ${h} hours sealed in a side chamber, counting drops of water.`,
    rule: 'On the path of the vote, every team that gets this far is stopped at a gate: five guardians, one trial per member, the guardian sets it, the team needs a majority. Only a wrong riddle costs time, and it costs a lot: hours sealed in a side chamber while the clock keeps running. A tie means the leader answers once more. Not every way through has a gate.',
    pathW: 'the galleries where every fork is a vote, with a guarded gate halfway through', costW: 'The hours sealed in cost them the labyrinth.'},
  raft: {LV: ['Launch', 'Stretch 1', 'Stretch 2', 'The toll bank', 'Stretch 3', 'Stretch 4', 'Stretch 5', 'Delta'], stop: 'toll bank', stopA: 'a toll bank', unit: 'Camp', npcs: 'bandits', viz: 'The river',
    titles: ['Downstream', 'Seventy-Two Hours', 'The Toll'], sfx: 'ザバッ', bottom: 'The delta',
    intro: ex => `Five bandits block the channel with a chain, and ${ex} does not interfere: each of them names a game, each of you plays one, and the team needs a majority. Lose a bet and the toll is time: they hold your raft at the bank while the clock keeps running.`,
    lock: 'raft held at the bank', lockN: 'held at the bank', lockLeg: 'hours the raft is held at the bank after a lost bet',
    sab: F => `${F} takes the bandits’ money and loses the bet on purpose. The others see the coins later.`,
    kill: (who, F, n) => `${who} wants a fight on the jetty. ${F} gives one. ${n} goes over the side and does not come up.`, killS: 'went over the side',
    tie: 'A tie, and the bandits do not lift the chain for a tie: the leader arm-wrestles their captain.',
    finS: (T, L) => `Before the delta the river splits: a long, calm channel or the falls. ${T} votes for the channel. Then ${L} turns the raft toward the falls anyway, and everybody holds on.`,
    finL: T => `Before the delta the river splits: a long, calm channel or the falls. ${T} cannot agree on the falls, and takes the long channel.`,
    finWord: ['the falls', 'the long channel'], outT: 'reaches the delta', outP: 'reach the delta',
    mKill: (F, n, T) => `${n} goes into the water off the jetty and does not come up, and nobody in ${T} says anything for an hour.`,
    mSab: (F, n, T) => `${F} loses the bet to ${n} on purpose, and the rest of ${T} watch the bandits pay for it.`,
    mLock: (F, n, T, h) => `${F} loses the bet to ${n}, and ${T} sits on the bank for ${h} hours, watching the other rafts go by.`,
    rule: 'On the path of the vote, every raft that gets this far is stopped at a toll bank: five bandits, one game per member, the bandit names it, the team needs a majority. Only a lost bet costs time, and it costs a lot: hours with the raft held at the bank while the clock keeps running. A tie means the leader plays their captain. Not every channel has a toll.',
    pathW: 'the channels where every fork is a vote, with a toll bank halfway down', costW: 'The hours at the bank cost them the delta.'}
};
const TR_RULE = {Combat: ['first to touch the ground loses', 'inside a chalk circle; out is out', 'until one of you says stop'], Riddle: ['three riddles, one wrong answer ends it', 'a riddle with two right answers; give the one they like', 'one question and an hour to think'], Wager: ['dice, and everyone knows they are loaded', 'cards, from a deck of their own', 'a coin, and the stake is time']};
const trSk = R => TR_SK[R.k] || TR_SK.tower;
const trStop = i => { const R = trRun(i); return R && R.merged ? R : null; };
// the page for either half of a merged pair, once both have run: the first half's index
function trPairA(i){ if(i == null || !S.teamRun) return null; const R = S.teamRun[i], Rp = S.teamRun[i - 1];
  if(R && R.merged === i + 1 && R.done != null) return i; if(Rp && Rp.merged === i && Rp.done != null) return i - 1; return null; }
const trHiddenStep = i => !!(S.teamRun && S.teamRun[i - 1] && S.teamRun[i - 1].merged === i);
const trPairPending = () => { const a = lastDone(); return a != null && !S.finished && S.teamRun && S.teamRun[a] && S.teamRun[a].merged === S.phase && S.teamRun[a].done == null; };
// eight levels: the stop sits between the second and third
const trLv8 = f => f < 3 ? f : f + 1;
const trAt8 = (t, h) => { let f = 0; (t.hp || t.path.map(([x, y]) => [x, trLv8(y)])).forEach(([ph, pf]) => { if(ph <= h) f = pf; }); return f; };
const trRes = (t, K) => { const L = K.LV; switch(t.res){
  case 'out': return ['ok', t.route === 'other' ? 'Made it, another way' : 'Made it', `hour ${t.outh} · ${t.spare}h to spare`];
  case 'hall': return ['bad', 'Out', `${t.w}–${t.l} · no majority`];
  case 'clockhall': return ['bad', 'Out', `clock ran out, ${K.lockN}`];
  case 'clock': return ['bad', 'Out', `clock ran out on ${(L[t.stuckAt] || '').toLowerCase()}`];
  default: return ['bad', 'Out', `stuck on ${(L[trLv8(t.end)] || '').toLowerCase()}`]; } };

/* ---------- the chapter: the descent · the stop · the last stretch ---------- */
function trStopChapterHtml(i){
  const R = trRun(i), K = trSk(R), LV = K.LV, ph = PHASES[i], phB = PHASES[i + 1], cm = cmap(S), P = trPick(i), C = chapterOf(i), st = S.stats.find(s => s.p === i) || {before: 0, after: 0}, done = R.done != null;
  const A = c => `<a data-id="${c.id}">${esc(c.name)}</a>`, F = id => cm[id] ? `<a data-id="${id}">${esc(cm[id].first || cm[id].name)}</a>` : 'Someone', FN = id => cm[id] ? esc(cm[id].first || cm[id].name) : '';
  const tn = x => `<b class="trn" style="--c:${x.col}">${esc(trName(x.t))}</b>`, lw = f => { const w = LV[f].toLowerCase(); return f === 0 ? 'the ' + w : w; };
  const ex = ph.ex ? ph.ex.name : 'The examiner', exB = phB && phB.ex ? phB.ex.name : 'the examiner';
  const mv = (n, t, s) => `<div class="tw-act"><span>${n}</span><b>${esc(t)}</b><small>${esc(s)}</small></div>`;
  const scene = (label, arr) => arr.length ? `<div class="wt-scene"><span class="wt-time">${esc(label)}</span>${arr.map(b => `<p>${b.t}</p>`).join('')}</div>` : '';
  // I · the doors above the stop, and the year's colour lines about the people we follow
  const b1 = [], b3 = [];
  P.forEach(x => { const t = x.t;
    t.doors.forEach(d => { if(d.k === 'stuck' || !d.h) return; const part = d.to <= 3 || (d.k === 'short' && d.to - 2 < 3) ? 1 : 3;
      if(part === 3 && !(done && (t.res === 'out' || t.res === 'clock') && t.rel < 72)) return;
      const fr = Math.max(0, d.to - (d.k === 'short' ? 2 : 1)), at = lw(trLv8(fr)), h = d.h + (part === 3 ? t.rel - t.hx : 0), arr = part === 1 ? b1 : b3, by = d.by && cm[d.by];
      if(part === 3 && h > 72) return;
      if(d.k === 'short') arr.push({h, x, t: `${by ? A(by) : 'Someone'} finds ${aN(d.d.toLowerCase())} on ${at}, and ${tn(x)} skips a whole level.`});
      else if(d.k === 'trap') arr.push({h, x, t: `${tn(x)} votes ${d.f}–${d.a} for the wrong door on ${at}: ${esc(d.d.toLowerCase())}. They lose hours climbing out.`});
      else if(d.k === 'split') arr.push({h, x, t: `${tn(x)} splits ${d.f}–${d.a} on ${at}${part === 1 && t.loner && cm[t.loner] ? `. ${A(cm[t.loner])} will not move, and the team waits` : ', and waits'}.`});
      else if(part === 1 && d.to === 1 && t.ok && (t.spare || 0) >= 15) arr.push({h, x, t: `${tn(x)} votes ${d.f}–${d.a} at the first door${cm[t.lead] ? `, ${A(cm[t.lead])} leading,` : ''} and is through before the others have finished arguing.`}); });
    if(!t.ok) b1.push({h: 66, x, t: `${tn(x)} never gets past ${lw(trLv8(t.end))}${t.loner && cm[t.loner] ? `: ${A(cm[t.loner])} still says no` : ''}. They never see the ${K.stop}.`}); });
  const inP = new Set(P.flatMap(x => x.t.ids));
  const teamOf = id => R.teams.find(t => t.ids.includes(id)), fits = e => !/shortcut|short way|hidden (way|passage)|trapdoor/i.test(e.text) || (e.ids || []).every(id => { const t = teamOf(id); return !t || t.ok; });
  [...C.B, ...C.D, ...C.A].filter(e => (e.ids || []).some(id => inP.has(id)) && fits(e)).slice(0, 2).forEach((e, j) => b1.push({h: 12 + j * 14, t: linkNames(chTidy(e.text, ph), e.ids || [])}));
  b1.sort((a, b) => a.h - b.h);
  const nVote = R.teams.filter(t => t.route === 'vote').length, others = [...new Set(R.teams.filter(t => t.obst).map(t => t.obst))].slice(0, 3);
  const open = {tower: `${st.before > 20 ? `There are ${fmt(st.before)}` : fcCapS(numWordS(st.before))} candidates on a flat roof with no stairs. ${ex} gives them seventy-two hours and walks away. By nightfall they are ${R.teams.length} teams.`,
    maze: `${st.before > 20 ? `There are ${fmt(st.before)}` : fcCapS(numWordS(st.before))} candidates at the mouth of the labyrinth. ${ex} lights one lamp and leaves. They split into ${R.teams.length} teams.`,
    raft: `${st.before > 20 ? `There are ${fmt(st.before)}` : fcCapS(numWordS(st.before))} candidates on the riverbank, and ${R.teams.length} rafts. ${ex} points downstream and says nothing.`}[R.k] || '';
  const ways = `Not every way is the same: ${fmt(nVote)} team${nVote === 1 ? '' : 's'} find ${K.pathW}${others.length ? `; the rest go other ways: ${andList(others)}` : ''}.`;
  // II · the stop, team by team in the order they got there
  const inH = done ? P.filter(x => x.t.ok && x.t.res).sort((a, b) => a.t.hx - b.t.hx) : [];
  const allB = inH.filter(x => x.t.route === 'vote').flatMap(x => x.t.bouts.map(b => ({x, b})));
  const star = allB.slice().sort((p, q) => ((q.b.kill ? 3 : 0) + (q.b.sab ? 2 : 0) - (p.b.kill ? 3 : 0) - (p.b.sab ? 2 : 0)) || (q.b.lock || 0) - (p.b.lock || 0))[0];
  const starOk = star && (star.b.kill || star.b.sab || star.b.lock);
  const moment = starOk ? (star.b.kill ? K.mKill : star.b.sab ? K.mSab : K.mLock)(F(star.b.id), esc(star.b.npc), tn(star.x), star.b.lock) : null;
  const splash = moment ? `<figure class="wt-splash"><span class="sfx" aria-hidden="true">${K.sfx}</span><span class="mo-k">Moment of the trial</span><blockquote>${moment}</blockquote></figure>` : '';
  let first = true; const hseen = new Set(), nseen = new Set();
  const stopScene = x => { const t = x.t;
    if(t.route === 'other') return `<div class="wt-scene"><span class="wt-time">Hour ${t.hx} · ${esc(trName(t))}</span><p>${tn(x)} never sees the ${K.stop}. Halfway down they find another way: ${esc(t.obst)}. ${t.ob === 'ok' ? `It costs them only ${t.cell} hours.` : `It costs them ${t.cell} hour${t.cell === 1 ? '' : 's'}.`}${t.rel >= 72 ? ' The clock runs out before they are through.' : ''}</p></div>`;
    const intro = first ? K.intro(esc(exB)) + ' ' : hseen.has(t.hall) ? `${K.unit} ${t.hall}: ${esc(t.bouts[0].npc)} and the others are still waiting, a little more confident than before. ` : `${K.unit} ${t.hall}, and five more ${K.npcs}. `; first = false; hseen.add(t.hall);
    const ps = [`${tn(x)} reaches ${K.stopA} at hour ${t.hx}. ${intro}${F(t.lead)} picks the order: ${t.bouts.filter(b => !b.dec).map(b => FN(b.id)).join(', ')}.`];
    t.bouts.forEach(b => { const n = esc(b.npc), who = nseen.has(b.npc) ? n : `${n}${NPC_EPI[b.npc] ? ', ' + esc(NPC_EPI[b.npc]) + ',' : ''}`; nseen.add(b.npc);
      const chip = b.lock ? ` <span class="tw-hd">−${b.lock}h, ${K.lock}</span>` : '';
      if(b.dec) ps.push(`${t.w - b.w}–${t.l - (1 - b.w)}. ${K.tie} ${R.k === 'raft' ? '' : `${who} proposes ${b.k.toLowerCase()}. `}${F(b.id)} ${b.w ? 'wins' : 'loses'}.${chip}`);
      else if(b.sab) ps.push(`${who} proposes ${b.k.toLowerCase()}. ${K.sab(F(b.id))}${chip}`);
      else if(b.kill) ps.push(K.kill(who, F(b.id), n));
      else ps.push(`${who} proposes ${b.k.toLowerCase()}: ${chPick(TR_RULE[b.k] || TR_RULE.Combat, 'rl' + b.npc + b.k)}. ${F(b.id)} ${b.w ? 'wins' : 'loses'}.${chip}`); });
    ps.push(t.res === 'hall' ? `${t.w}–${t.l}. No majority. The way on never opens.` : t.res === 'clockhall' ? `${t.w}–${t.l}, but ${t.cell} hours ${K.lockN} is more than they have left. The clock runs out with them still waiting.` : `${t.w}–${t.l}. The way on opens${t.cell ? ` after ${t.cell} hours ${K.lockN}` : ' at once'}. It is hour ${t.rel}.`);
    return `<div class="wt-scene"><span class="wt-time">Hour ${t.hx} · ${esc(trName(t))}</span>${ps.map(p => `<p>${p}</p>`).join('')}</div>`; };
  // III · the last stretch
  P.forEach(x => { const t = x.t; if(done && t.res === 'out' && t.route === 'vote' && !b3.some(b => b.x === x)) b3.push({h: t.rel + 2, x, t: `Past the ${K.stop}, ${tn(x)} agrees at every door. Nobody wants to lose another hour.`}); });
  b3.sort((a, b) => a.h - b.h);
  const ends = done ? P.map(x => { const t = x.t, fin = t.final === 'short' ? K.finS(tn(x), F(t.lead)) + ' ' : t.final === 'long' ? K.finL(tn(x)) + ' ' : '';
    if(t.res === 'out') return {h: t.outh, t: fin ? `${fin}They ${K.outP} at hour ${t.outh}, ${t.spare} hour${t.spare === 1 ? '' : 's'} to spare.` : `${tn(x)} ${K.outT} at hour ${t.outh}, ${t.spare} hour${t.spare === 1 ? '' : 's'} to spare.`};
    if(t.res === 'clock' && t.rel < 72) return {h: 72, t: `${fin}${tn(x)} is on ${lw(t.stuckAt)} when the clock runs out.${t.cell ? ' ' + K.costW : ''}`};
    return null; }).filter(Boolean).sort((a, b) => a.h - b.h) : [];
  const made = R.teams.filter(t => t.res === 'out'), reached = R.teams.filter(t => t.ok && t.res), past = reached.filter(t => t.route === 'vote' && (t.res === 'hall' || t.res === 'clockhall')).length;
  const prev = i > 0 && S.stats.find(s => s.p === i - 1) && !PHASES[i - 1].zevil && !PHASES[i - 1].final ? chapterOf(i - 1) : null, pl = prev ? (prev.A[prev.A.length - 1] || prev.moment) : null;
  const nx = done ? chNext(i + 1, chapterOf(i + 1)) : null;
  const title = chPick(K.titles, 'trt' + i);
  return `<article class="wt2 tw-ch"><div class="wt2-h"><span>Chapter ${i + 1}</span><h3>${esc(title)}</h3></div>
    ${pl ? `<p class="wt-prev">Previously: ${linkNames(chTidy(pl.text, prev.ph), pl.ids || [])}</p>` : ''}
    ${trRosterHtml(P, cm)}
    ${mv('I', 'The descent', `${LV[0]} → ${LV[2]}`)}
    <div class="wt-scene"><span class="wt-time">Hour 0 · ${esc(LV[0])}</span><p class="drop">${esc(open)} ${ways}</p>${b1.filter(b => b.h < 6).map(b => `<p>${b.t}</p>`).join('')}</div>
    ${scene(`Hours 6–40 · ${LV[1]} and ${LV[2]}`, b1.filter(b => b.h >= 6 && b.h <= 40))}${scene(`Later, still above the ${K.stop}`, b1.filter(b => b.h > 40))}
    ${done ? `${mv('II', LV[3], `between ${LV[2]} and ${LV[4]}`)}<p class="tw-rule"><b>${esc(LV[3])}.</b> ${K.rule}</p>
    ${inH.map(x => stopScene(x) + (star && starOk && star.x === x ? splash : '')).join('')}
    ${mv('III', 'The last stretch', `${LV[4]} → ${K.bottom.toLowerCase()}`)}
    ${scene(`After the ${K.stop}`, b3)}
    <div class="wt-scene"><span class="wt-time">Hour 72 · ${esc(K.bottom)}</span>${ends.map(e => `<p>${e.t}</p>`).join('')}<p>${fcCapS(numWordS(made.length))} of ${R.teams.length} teams ${K.outP}, ${fmt(made.reduce((s, t) => s + t.ids.length, 0))} candidates. ${fmt(R.teams.length - reached.length)} never reached the ${K.stop} or the other ways down; ${past ? `${fmt(past)} never got past the ${K.stop}.` : `nobody stayed at the ${K.stop}.`}</p></div>`
    : `<div class="wt-scene"><span class="wt-time">${esc(LV[3])}</span><p>${fcCapS(numWordS(R.teams.filter(t => t.ok).length))} teams get halfway. The ${K.stop} is next.</p></div>`}
    ${nx ? `<div class="next"><span>Next · ${esc(nx.to)}</span><p>${linkNames(nx.text, [])}</p></div>` : ''}</article>`;
}
// the teams we follow, before anything happens to them: no results here
function trRosterHtml(P, cm){
  if(!P.length) return '';
  return `<div class="tw-roster"><div class="tw-roster-h">The teams we follow</div><div class="tw-rcs">${P.map(x => { const t = x.t, M = t.ids.map(id => cm[id]).filter(Boolean);
    return `<div class="tw-rc" style="--c:${x.col}"><b data-tvt="${t.n}">${esc(trName(t))}</b>${x.why ? `<em>${esc(x.why)}</em>` : ''}<span>${M.map(c => `<a data-id="${c.id}">${esc(c.first || c.name)}</a>`).join(', ')}</span><small>${esc(trFormed(t, cm).split('.')[0])}.</small></div>`; }).join('')}</div></div>`;
}

/* ---------- the tower view, side card ---------- */
function trStopSide(R, t, x, h, cm){
  const K = trSk(R), LV = K.LV, r = trRes(t, K), pip = d => `<i class="${d.k === 'split' || d.k === 'stuck' ? 'n' : 'y'}"></i>`;
  const above = t.doors.filter(d => d.to <= 3 && d.k !== 'stuck'), below = t.res === 'out' || t.res === 'clock' ? t.doors.filter(d => d.to > 3 && d.k !== 'stuck') : [];
  const ol = ds => `<ol class="tv-doors">${ds.map(d => `<li class="${d.k}">${esc(d.d)} <small>${d.f}–${d.a} · ${{ok: 'agreed', split: 'split, waited', short: 'a hidden way', trap: 'a trap'}[d.k]}</small></li>`).join('')}</ol>`;
  const FN = id => cm[id] ? esc(cm[id].first || cm[id].name) : '';
  return `<div class="tv-card" ${x ? `style="--c:${x.col}"` : ''}><small>Team ${t.n}</small><b>${esc(trName(t))}</b>${x && x.why ? `<em>${esc(x.why)}</em>` : ''}
    <p>${esc(trFormed(t, cm))}</p><ul>${t.ids.map(id => cm[id] ? `<li><a data-id="${id}">${esc(cm[id].name)}</a>${id === t.lead ? ' <span>leads</span>' : ''}</li>` : '').join('')}</ul>
    <div class="tv-st"><span>At hour ${h}</span><b>${esc(LV[trAt8(t, h)])}</b></div>
    <div class="tv-st"><span>Before the ${K.stop}</span><b><span class="vp">${above.map(pip).join('')}</span></b></div>${ol(above)}
    ${t.route === 'other' && t.res ? `<div class="tv-st"><span>Their way down</span><b>${esc(t.obst)} · ${t.cell}h</b></div>` : t.bouts ? `<div class="tv-st"><span>${K.unit} ${t.hall} · hour ${t.hx}</span><b>${t.w}–${t.l}${t.cell ? ` · ${t.cell}h ${K.lockN}` : ''}</b></div><ul class="tv-bouts">${t.bouts.map(b => `<li class="${b.w ? 'w' : 'l'}">${b.dec ? 'tie-break · ' : ''}${b.w ? '✓' : '✗'} ${FN(b.id)} <small>vs ${esc(b.npc)} · ${b.k.toLowerCase()}${b.sab ? ' · gave it away' : ''}${b.kill ? ' · ' + K.killS : ''}${b.lock ? ` · −${b.lock}h` : ''}</small></li>`).join('')}</ul>` : ''}
    ${t.final ? `<div class="tv-st"><span>The last choice</span><b>${K.finWord[t.final === 'short' ? 0 : 1]}</b></div>` : ''}${below.length ? `<div class="tv-st"><span>After the ${K.stop}</span><b><span class="vp">${below.map(pip).join('')}</span></b></div>${ol(below)}` : ''}
    <div class="tv-st"><span>In the end</span><b class="${r[0] === 'ok' ? 'ok' : 'bad'}">${r[1]} · ${r[2]}</b></div></div>`;
}

/* ---------- the teams, one row each: the doors before, the stop, the doors after, the result ---------- */
function trStopTablesHtml(i){
  const R = trRun(i), K = trSk(R), cm = cmap(S), P = trPick(i), pk = new Map(P.map(x => [x.t.n, x]));
  const pip = d => `<i class="${d.k === 'split' || d.k === 'stuck' ? 'n' : 'y'}"></i>`, FN = id => cm[id] ? esc(cm[id].first || cm[id].name) : '';
  const row = t => { const x = pk.get(t.n), r = trRes(t, K), above = t.doors.filter(d => d.to <= 3 && d.k !== 'stuck'), below = t.res === 'out' || t.res === 'clock' ? t.doors.filter(d => d.to > 3 && d.k !== 'stuck') : [];
    const mid = !t.ok || !t.res ? `<span class="tw-none">never got there</span>` : t.route === 'other' ? `<span class="tw-none">another way: ${esc(t.obst)} · ${t.cell}h</span>`
      : `<small class="tw-hn">${K.unit} ${t.hall}</small>` + t.bouts.map(b => `<span class="tw-pl ${b.w ? 'w' : 'l'}" title="vs ${esc(b.npc)} · ${b.k.toLowerCase()}">${b.dec ? '<i>tie-break</i> ' : ''}${b.w ? '✓' : '✗'} ${FN(b.id)}${b.sab ? ' <i>gave it away</i>' : ''}${b.kill ? ' <i>†</i>' : ''}${b.lock ? ` <i>−${b.lock}h</i>` : ''}</span>`).join('');
    return `<div class="tw-ur${x ? ' fol' : ''}" ${x ? `style="--c:${x.col}"` : ''}><span class="tw-tnm"><b data-tvt="${t.n}" role="button" tabindex="0">${esc(trName(t))}</b>${x && x.why ? `<small class="why">${esc(x.why)}</small>` : `<small>${t.ids.map(FN).filter(Boolean).join(', ')}</small>`}</span>
      <span class="vp">${above.map(pip).join('')}</span><span class="tw-pls">${mid}</span><span class="vp">${below.length ? below.map(pip).join('') : '<span class="tw-none">—</span>'}${t.final ? `<small class="tw-fin">${K.finWord[t.final === 'short' ? 0 : 1]}</small>` : ''}</span><span class="tw-r3 ${r[0]}">${r[1]}<small>${r[2]}</small></span></div>`; };
  const HD = `<div class="tw-ur hd"><span>Team</span><span>Before</span><span>At the ${K.stop}</span><span>After</span><span>Result</span></div>`;
  const ORD = ['out', 'clock', 'clockhall', 'hall', undefined], ord = (a, b) => ORD.indexOf(a.res) - ORD.indexOf(b.res) || (b.spare || 0) - (a.spare || 0) || a.n - b.n;
  const made = R.teams.filter(t => t.res === 'out').length, reached = R.teams.filter(t => t.route === 'vote' && t.res).length;
  // the stop's own: five per hall, gate or camp
  const halls = typeof stopHalls === 'function' && PHASES[i + 1] ? stopHalls(PHASES[i + 1]) : [], rec = {}, dead = new Set(), nT = {};
  R.teams.forEach(t => (t.bouts || []).forEach(b => { const v = rec[b.npc] = rec[b.npc] || [0, 0]; v[b.w ? 1 : 0]++; if(b.kill) dead.add(b.npc); })); R.teams.forEach(t => { if(t.hall) nT[t.hall] = (nT[t.hall] || 0) + 1; });
  const npcs = halls.map((H, k) => `<div class="tw-hallb"><b>${K.unit} ${k + 1} <small>· ${nT[k + 1] || 0} team${nT[k + 1] === 1 ? '' : 's'}</small></b>${H.map(n => `<div class="tw-npc${dead.has(n) ? ' dead' : ''}"><b>${esc(n)}${dead.has(n) ? ' †' : ''}</b><small>${esc(NPC_EPI[n] || '')}</small><span>${rec[n] ? `today ${rec[n][0]}–${rec[n][1]}` : 'nobody came'}</span></div>`).join('')}</div>`).join('');
  return `<div class="tw-u"><div class="section-h">The teams in this chapter</div><div class="tw-rows">${HD}${P.map(x => x.t).sort(ord).map(row).join('')}</div>
    <details class="tw-all"><summary>All ${R.teams.length} teams · ${reached} reached ${K.stopA} · ${made} made it</summary><div class="tw-rows tw-scroll">${HD}${R.teams.slice().sort(ord).map(row).join('')}</div></details>
    <p class="tw-leg">Doors: <span class="vp"><i class="y"></i></span> agreed <span class="vp"><i class="n"></i></span> split and waited · ${esc(K.LV[3])}: ✓/✗ each member in the order they played; −h: ${K.lockLeg} · tie-break: the leader plays again</p></div>
    ${npcs ? `<details class="tw-all"><summary>The ${K.npcs} of the day · ${halls.length * 5}</summary><div class="tw-npcs">${npcs}</div></details>` : ''}`;
}

/* ---------- duels on their own (no team trial before them): one row per candidate, both bouts, the result ---------- */
function duelTableHtml(i){
  const cm = cmap(S), ph = PHASES[i], cast = new Set(typeof chCastAt === 'function' ? chCastAt(i) : []);
  const rows = S.log.filter(e => e.p === i && e.type === 'duel' && (e.ids || []).length).map(e => { const c = cm[e.ids[0]]; if(!c) return null;
    const B = [...e.text.matchAll(/(beat|lost to) (.+?) \((\w+)(?:, with tips from ally ([^)]+))?\)/g)].map(m => ({w: m[1] === 'beat', npc: m[2], k: m[3], tip: m[4]}));
    return {c, B, ok: /advances/.test(e.text), dead: c.status === 'Deceased' && c.out === i, mine: isFav(c.id) || (!MENTOR.off && mtOf(c.id)) || cast.has(c.id)}; }).filter(Boolean);
  if(!rows.length) return '';
  rows.sort((a, b) => (b.mine ? 1 : 0) - (a.mine ? 1 : 0) || (b.ok ? 1 : 0) - (a.ok ? 1 : 0) || b.B.filter(x => x.w).length - a.B.filter(x => x.w).length);
  const bt = x => x ? `<span class="tw-pl ${x.w ? 'w' : 'l'}" title="${esc(x.k.toLowerCase())}${x.tip ? ', tips from ' + esc(x.tip) : ''}">${x.w ? '✓' : '✗'} ${esc(x.npc)} <i>${esc(x.k.toLowerCase())}</i></span>` : '<span class="tw-none">—</span>';
  const row = r => `<div class="tw-ur du${r.mine ? ' fol' : ''}" style="--c:var(--gold)"><span class="tw-tnm"><b><a data-id="${r.c.id}">${esc(r.c.name)}</a></b>${r.mine ? `<small class="why">${isFav(r.c.id) ? '★ your favourite' : !MENTOR.off && mtOf(r.c.id) ? '◆ your apprentice' : '● one to watch'}</small>` : ''}</span>${bt(r.B[0])}${bt(r.B[1])}<span class="tw-r3 ${r.ok ? 'ok' : 'bad'}">${r.ok ? 'Through' : r.dead ? 'Died' : 'Out'}<small>${r.B.filter(x => x.w).length} of ${r.B.length} won</small></span></div>`;
  const HD = `<div class="tw-ur du hd"><span>Candidate</span><span>First bout</span><span>Second bout</span><span>Result</span></div>`, top = rows.slice(0, 12), rest = rows.slice(12);
  return `<p class="ally-sum">${rows.filter(r => r.ok).length} of ${rows.length} won at least one of their two bouts against the ${esc(ph.npc ? ph.npc + 's' : 'prisoners')}.</p><div class="tw-rows">${HD}${top.map(row).join('')}</div>${rest.length ? `<details class="tw-all"><summary>Everyone else · ${rest.length}</summary><div class="tw-rows tw-scroll">${HD}${rest.map(row).join('')}</div></details>` : ''}`;
}
