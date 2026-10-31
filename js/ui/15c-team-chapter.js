/* ===================== TEAM TRIALS (Trick Tower, Labyrinth, River): the chapter told hour by hour, and the tower itself ===================== */
// The engine records each team's way down (S.teamRun[p]): one door per level, the vote at each, and the hour they got there.
// The chapter follows up to four teams, each saying why it is there; the tower below shows every team, hour by hour.
const TR_LV = {tower: ['Roof', 'Floor 1', 'Floor 2', 'Floor 3', 'Floor 4', 'Floor 5', 'Out'], maze: ['Entrance', 'Gallery 1', 'Gallery 2', 'Gallery 3', 'Gallery 4', 'Gallery 5', 'Exit'], raft: ['Launch', 'Stretch 1', 'Stretch 2', 'Stretch 3', 'Stretch 4', 'Stretch 5', 'Delta']};
const TR_WHAT = {tower: 'The tower', maze: 'The labyrinth', raft: 'The river'};
const TR_COL = ['#72b58d', '#d9a640', '#e3889f', '#7fa6c9'];
const trRun = i => S.teamRun && S.teamRun[i];
const trH = (i, k) => nhashUI(S.seed + ':tr:' + i + ':' + k);
const trName = t => t.name || 'Team ' + t.n;
const trLv = (R, f) => (TR_LV[R.k] || TR_LV.tower)[f];
const trFloorWord = (R, f) => f === 6 ? (R.k === 'tower' ? 'the bottom' : R.k === 'maze' ? 'the exit' : 'the delta') : trLv(R, f).toLowerCase();
const trAt = (t, h) => { let f = 0; t.path.forEach(([ph, pf]) => { if(ph <= h) f = pf; }); return f; };
function trFormed(t, cm){
  const rec = (t.rec || []).map(id => cm[id]).filter(Boolean).map(c => c.name);
  if(t.formed === 'family') return 'A family. They registered together and went in together.';
  if(t.formed === 'alliance') return `An alliance from earlier in the exam, “${t.name}”, went in together${rec.length ? `; ${andList(rec)} ${rec.length === 1 ? 'was' : 'were'} recruited at the gate to make up the numbers` : ''}.`;
  return 'Strangers. Nobody here had an alliance, so the examiners grouped them at the gate by registration number.';
}
// up to four teams, each with the reason it is in the chapter
function trPick(i){
  const R = trRun(i); if(!R) return [];
  const cm = cmap(S), cast = new Set(typeof chCastAt === 'function' ? chCastAt(i) : []);
  const why = t => { const M = t.ids.map(id => cm[id]).filter(Boolean);
    const ap = M.find(c => !MENTOR.off && mtOf(c.id)); if(ap) return [100, `◆ ${ap.name}, your apprentice`];
    const fv = M.find(c => isFav(c.id)); if(fv) return [80, `★ ${fv.name}, your favourite`];
    const cw = M.find(c => cast.has(c.id)); if(cw) return [50, `● ${cw.name}, one to watch`];
    return [0, '']; };
  const L = R.teams.map(t => ({t, w: why(t)})).filter(x => x.w[0] > 0).sort((a, b) => b.w[0] - a.w[0] || (b.t.ok ? 1 : 0) - (a.t.ok ? 1 : 0)).slice(0, 4).map(x => ({t: x.t, why: x.w[1]}));
  // nobody followed (or room left): the teams with the most story
  const has = t => L.some(x => x.t === t), add = (t, w) => { if(t && L.length < 4 && !has(t)) L.push({t, why: w}); };
  const fast = R.teams.filter(t => R.merged && R.done != null ? t.res === 'out' : t.ok).sort((a, b) => (b.spare || 0) - (a.spare || 0))[0];
  if(L.length < 4) add(fast, 'Fastest team of the year');
  if(L.length < 3) add(R.teams.filter(t => t.formed === 'family').sort((a, b) => b.end - a.end)[0], 'A family');
  if(L.length < 3) add(R.teams.filter(t => !t.ok).sort((a, b) => b.doors.filter(d => d.k === 'split').length - a.doors.filter(d => d.k === 'split').length)[0], 'The longest deadlock');
  if(L.length < 3) add(R.teams.find(t => t.doors.some(d => d.k === 'short')), 'Found a hidden way down');
  // a trial with its duels inside: the chapter needs people at the halfway stop too
  if(R.merged && R.done != null){
    const reached = t => t.ok && t.res && t.route === 'vote', B = t => t.bouts || [], stop = typeof trSk === 'function' ? trSk(R).stop : 'hall';
    const score = t => B(t).some(b => b.kill) ? 5 : B(t).some(b => b.sab) ? 4 : t.res === 'out' ? 3 + (t.spare || 0) / 100 : (t.cell || 0) > 15 ? 2 : 1;
    const why = t => B(t).some(b => b.kill) ? 'A fight that went too far' : B(t).some(b => b.sab) ? 'A bout given away' : t.res === 'out' ? 'Fastest of the year' : (t.cell || 0) > 15 ? 'Paid the most hours' : `Got as far as the ${stop}`;
    const cands = R.teams.filter(t => reached(t) && !has(t)).sort((a, b) => score(b) - score(a));
    while(L.filter(x => reached(x.t)).length < 2 && cands.length){ const t = cands.shift(); if(L.length < 4) L.push({t, why: why(t)}); else { const k = L.map(x => !!reached(x.t)).lastIndexOf(false); if(k < 0) break; L.splice(k, 1, {t, why: why(t)}); } }
    if(!L.some(x => x.t.res === 'out')){ const t = R.teams.filter(x => x.res === 'out' && !has(x)).sort((a, b) => (b.spare || 0) - (a.spare || 0))[0]; if(t){ if(L.length < 4) L.push({t, why: why(t)}); else { const k = L.map(x => !!reached(x.t)).lastIndexOf(false); if(k >= 0) L.splice(k, 1, {t, why: why(t)}); } } }
  }
  return L.map((x, j) => ({...x, col: TR_COL[j]}));
}
/* ---------- the chapter, hour by hour ---------- */
function teamChapterHtml(i){
  if(typeof trStop === 'function' && trStop(i)) return trStopChapterHtml(i);
  const R = trRun(i), ph = PHASES[i], cm = cmap(S), P = trPick(i), C = chapterOf(i), st = S.stats.find(s => s.p === i) || {before: 0, after: 0};
  const outs = R.teams.filter(t => t.ok).length, ex = ph.ex ? ph.ex.name : 'The examiner', A = c => `<a data-id="${c.id}">${esc(c.name)}</a>`;
  const tn = x => `<b class="trn" style="--c:${x.col}">${esc(trName(x.t))}</b>`;
  const open = {tower: `${st.before > 20 ? `There are ${fmt(st.before)}` : fcCapS(numWordS(st.before))} candidates on a flat roof with no stairs. ${ex} gives them seventy-two hours and walks away. By nightfall they are ${R.teams.length} teams, and every door below will need a vote.`,
    maze: `${st.before > 20 ? `There are ${fmt(st.before)}` : fcCapS(numWordS(st.before))} candidates at the mouth of the labyrinth. ${ex} lights one lamp and leaves. They split into ${R.teams.length} teams, and every fork will need a vote.`,
    raft: `${st.before > 20 ? `There are ${fmt(st.before)}` : fcCapS(numWordS(st.before))} candidates on the riverbank, and ${R.teams.length} rafts. ${ex} points downstream and says nothing. Every channel will need a vote.`}[R.k] || '';
  // what happened to the followed teams, door by door, in time order
  const beats = [];
  P.forEach(x => { const t = x.t, lead = cm[t.lead];
    t.doors.forEach((d, j) => { const lv = Math.max(0, d.to - (d.k === 'short' ? 2 : 1)), at = lv === 0 ? 'the ' + trLv(R, 0).toLowerCase() : trLv(R, lv).toLowerCase(), by = d.by && cm[d.by];
      if(d.k === 'short') beats.push({h: d.h || 10, x, w: 6, t: `${by ? A(by) : 'Someone'} finds ${aN(d.d.toLowerCase())} on ${at}, and ${tn(x)} skips a whole level.`});
      else if(d.k === 'trap') beats.push({h: d.h || 20, x, w: 4, t: `${tn(x)} votes ${d.f}–${d.a} for the wrong door on ${at}: ${d.d.toLowerCase()}. They lose hours climbing out.`});
      else if(d.k === 'split') beats.push({h: d.h || 30, x, w: t.loner ? 7 : 5, t: `${tn(x)} splits ${d.f}–${d.a} on ${at}${t.loner && cm[t.loner] ? `. ${A(cm[t.loner])} will not move, and the team waits` : ', and waits'}.`});
      else if(d.k === 'stuck') beats.push({h: 66, x, w: 3, t: `${tn(x)} never gets past ${trFloorWord(R, t.end)}${t.loner && cm[t.loner] ? `: ${A(cm[t.loner])} still says no` : ''}.`});
      else if(j === 0 && t.ok && t.spare >= 15) beats.push({h: d.h || 3, x, w: 2, t: `${tn(x)} votes ${d.f}–${d.a} at the first door${lead ? `, ${A(lead)} leading,` : ''} and is through before the others have finished arguing.`});
    }); });
  // the year's colour lines about people in those teams join in
  const inP = new Set(P.flatMap(x => x.t.ids));
  [...C.B, ...C.D, ...C.A].filter(e => (e.ids || []).some(id => inP.has(id))).slice(0, 3).forEach((e, j) => beats.push({h: 12 + j * 18, w: 2, t: linkNames(chTidy(e.text, ph), e.ids || [])}));
  beats.sort((a, b) => a.h - b.h);
  const star = beats.slice().sort((a, b) => b.w - a.w)[0];
  const first = beats.filter(b => b !== star && b.h < 36), second = beats.filter(b => b !== star && b.h >= 36 && b.h < 66), last = beats.filter(b => b !== star && b.h >= 66);
  const lvAt = h => { const f = Math.round(P.reduce((s, x) => s + trAt(x.t, h), 0) / Math.max(1, P.length)); return trLv(R, Math.min(5, f)); };
  const hr = arr => arr.length ? Math.round(arr.reduce((s, b) => s + b.h, 0) / arr.length) : 0;
  const scene = (label, arr, cls) => arr.length ? `<div class="wt-scene"><span class="wt-time">${esc(label)}</span>${arr.map((b, j) => `<p${cls && !j ? ` class="${cls}"` : ''}>${b.t}</p>`).join('')}</div>` : '';
  const fastest = R.teams.filter(t => t.ok).sort((a, b) => b.spare - a.spare);
  const endT = [`${fcCapS(numWordS(outs))} team${outs === 1 ? '' : 's'} make${outs === 1 ? 's' : ''} it out.${fastest[0] ? ` ${esc(trName(fastest[0]))} had ${fastest[0].spare} hours to spare${fastest[1] ? `, ${esc(trName(fastest[1]))} ${fastest[1].spare}` : ''}.` : ''}`];
  const stuckP = P.filter(x => !x.t.ok); if(stuckP.length) endT.push(`Somewhere above them, ${andList(stuckP.map(x => tn(x)))} ${stuckP.length === 1 ? 'is' : 'are'} still there when the time runs out.`);
  const prev = i > 0 && S.stats.find(s => s.p === i - 1) && !PHASES[i - 1].zevil && !PHASES[i - 1].final ? chapterOf(i - 1) : null, pl = prev ? (prev.A[prev.A.length - 1] || prev.moment) : null;
  const nx = chNext(i, C);
  const title = chPick({tower: ['Majority Rules', 'Seventy-Two Hours', 'The Long Way Down', 'Two Against Two'], maze: ['Every Fork a Vote', 'Seventy-Two Hours', 'Lost Together'], raft: ['Downstream', 'Seventy-Two Hours', 'Every Channel a Vote']}[R.k] || ['Seventy-Two Hours'], 'trt' + i);
  return `<article class="wt2 tw-ch"><div class="wt2-h"><span>Chapter ${i + 1}</span><h3>${esc(title)}</h3></div>
    ${pl ? `<p class="wt-prev">Previously: ${linkNames(chTidy(pl.text, prev.ph), pl.ids || [])}</p>` : ''}
    ${typeof trRosterHtml === 'function' ? trRosterHtml(P, cm) : ''}
    <div class="wt-scene"><span class="wt-time">Hour 0 · ${esc(trLv(R, 0))}</span><p class="drop">${esc(open)}</p>${first.filter(b => b.h < 6).map(b => `<p>${b.t}</p>`).join('')}</div>
    ${scene(`Hour ${hr(first.filter(b => b.h >= 6)) || 20} · ${lvAt(hr(first.filter(b => b.h >= 6)) || 20)}`, first.filter(b => b.h >= 6))}
    ${star ? `<figure class="wt-splash"><span class="sfx" aria-hidden="true">${chPick(['ガコン', 'ゴゴゴ', 'ザッ'], 'trs' + i)}</span><span class="mo-k">Moment of the trial</span><blockquote>${star.t}</blockquote></figure>` : ''}
    ${scene(`Hour ${hr(second) || 50} · ${lvAt(hr(second) || 50)}`, second)}
    <div class="wt-scene"><span class="wt-time">Hour 72 · ${esc(hsCapS(trFloorWord(R, 6)))}</span>${last.map(b => `<p>${b.t}</p>`).join('')}<p>${endT.join(' ')}</p></div>
    ${nx ? `<div class="next"><span>Next · ${esc(nx.to)}</span><p>${linkNames(nx.text, [])}</p></div>` : ''}</article>`;
}
const numWordS = n => n <= 20 ? ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'][n] : fmt(n);
const fcCapS = t => String(t).charAt(0).toUpperCase() + String(t).slice(1), hsCapS = fcCapS;
/* ---------- the tower: every team on its level, scrubbed by the hour; click one to see who they are ---------- */
function trTowerHtml(i){
  const R = trRun(i), M = typeof trStop === 'function' && trStop(i) && R.done != null; return `<div class="tv${M ? ' tv8' : ''}" data-tv="${i}"><div class="tv-top"><div class="section-h" style="margin:0">${M ? trSk(R).viz : TR_WHAT[R.k] || 'The tower'}</div></div>
    <div class="tv-time"><button type="button" class="btn small" data-tvplay>▶ Play</button><div class="tv-rng"><input type="range" data-tvh min="0" max="72" value="72" aria-label="Hour"><div class="tv-ticks"><span>0h</span><span>12</span><span>24</span><span>36</span><span>48</span><span>60</span><span>72h</span></div></div><b data-tvlab>Hour 72</b></div>
    <p class="tv-take" data-tvtake></p><div class="tv-body"><div class="tv-tower" data-tvtower></div><aside class="tv-side" data-tvside></aside></div>
    <p class="muted" style="font-size:12.5px;margin:8px 0 0">Every square is a team. Drag the hours to watch them move${M ? `: teams stop at the ${trSk(R).stop} while they play and pay their hours` : ''}; click a team to see who was in it${M ? ', its route and its bouts' : ' and how it formed'}. In colour: the teams this chapter follows.</p></div>`;
}
const TV_SEL = {};
function tvDraw(box){
  const i = +box.dataset.tv, R = trRun(i); if(!R) return; const cm = cmap(S), P = trPick(i), col = new Map(P.map(x => [x.t.n, x])), h = +box.querySelector('[data-tvh]').value;
  if(R.merged && R.done != null) return tvDraw8(box, i, R, cm, P, col, h);
  const LV = TR_LV[R.k] || TR_LV.tower;
  box.querySelector('[data-tvlab]').textContent = 'Hour ' + h;
  const by = LV.map(() => []); R.teams.forEach(t => by[trAt(t, h)].push(t));
  if(TV_SEL[i] == null || !R.teams.some(t => t.n === TV_SEL[i])) TV_SEL[i] = (P[0] || {t: R.teams[0]}).t.n;
  box.querySelector('[data-tvtower]').innerHTML = LV.map((f, j) => `<div class="tv-fl${j === 6 ? ' out' : ''}"><span class="tv-fn">${f}<small>${by[j].length}</small></span><span class="tv-tk">${by[j].sort((a, b) => (col.has(b.n) ? 1 : 0) - (col.has(a.n) ? 1 : 0) || a.n - b.n).map(t => { const x = col.get(t.n);
      return `<button type="button" class="tk${x ? ' c' : ''}${t.n === TV_SEL[i] ? ' on' : ''}" ${x ? `style="--c:${x.col}"` : ''} data-tvt="${t.n}" title="${esc(trName(t))}: ${esc(t.ids.map(id => cm[id] ? cm[id].name : '').join(', '))}">${x ? esc(trName(t)) : t.n}</button>`; }).join('')}</span></div>`).join('');
  const outN = by[6].length, most = by.slice(0, 6).map((a, j) => [j, a.length]).sort((a, b) => b[1] - a[1])[0];
  box.querySelector('[data-tvtake]').textContent = h === 72 ? `When time ran out: ${outN} of ${R.teams.length} teams were out. The most crowded level was ${LV[most[0]].toLowerCase()}, with ${most[1]} teams.` : `At hour ${h}: ${outN} team${outN === 1 ? '' : 's'} out, ${by[0].length} still at ${LV[0].toLowerCase()}.`;
  const t = R.teams.find(x => x.n === TV_SEL[i]), x = col.get(t.n), f = trAt(t, h), lastD = t.path[t.path.length - 1];
  const sp = t.doors.filter(d => d.k === 'split' || d.k === 'stuck').length, pips = t.doors.map(d => `<i class="${d.k === 'split' || d.k === 'stuck' ? 'n' : 'y'}"></i>`).join('');
  box.querySelector('[data-tvside]').innerHTML = `<div class="tv-card" ${x ? `style="--c:${x.col}"` : ''}><small>Team ${t.n}</small><b>${esc(trName(t))}</b>${x && x.why ? `<em>${esc(x.why)}</em>` : ''}
    <p>${esc(trFormed(t, cm))}</p><ul>${t.ids.map(id => cm[id] ? `<li><a data-id="${id}">${esc(cm[id].name)}</a>${id === t.lead ? ' <span>leads</span>' : ''}</li>` : '').join('')}</ul>
    <div class="tv-st"><span>At hour ${h}</span><b>${f === 6 ? 'Out' : LV[f]}</b></div>
    <div class="tv-st"><span>The doors</span><b><span class="vp">${pips}</span>${sp ? `Split at ${sp} door${sp === 1 ? '' : 's'}` : 'Agreed at every door'}</b></div>
    <ol class="tv-doors">${t.doors.map(d => `<li class="${d.k}">${esc(d.d)} <small>${d.f}–${d.a} · ${{ok: 'agreed', split: 'split, waited', short: 'a hidden way', trap: 'a trap', stuck: 'never got through'}[d.k]}${d.h ? ` · hour ${d.h}` : ''}</small></li>`).join('')}</ol>
    <div class="tv-st"><span>In the end</span><b class="${t.ok ? 'ok' : 'bad'}">${t.ok ? `Out at hour ${lastD[0]}, ${t.spare}h to spare` : `Stuck on ${LV[t.end].toLowerCase()}`}</b></div></div>`;
}
document.addEventListener('input', e => { const r = e.target.closest && e.target.closest('[data-tvh]'); if(r) tvDraw(r.closest('[data-tv]')); });
document.addEventListener('click', e => {
  const tk = e.target.closest && e.target.closest('[data-tvt]'); if(tk){ const box = tk.closest('[data-tv]') || document.querySelector('[data-tv]'); if(!box) return; TV_SEL[+box.dataset.tv] = +tk.dataset.tvt; tvDraw(box); if(!tk.closest('[data-tv]')) box.scrollIntoView({behavior: 'smooth', block: 'start'}); return; }
  const pl = e.target.closest && e.target.closest('[data-tvplay]'); if(!pl) return; const box = pl.closest('[data-tv]'), r = box.querySelector('[data-tvh]');
  if(box._tm){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; return; }
  if(+r.value >= 72) r.value = 0; pl.textContent = '❚❚ Pause';
  box._tm = setInterval(() => { if(!box.isConnected){ clearInterval(box._tm); return; } r.value = +r.value + 1; tvDraw(box); if(+r.value >= 72){ clearInterval(box._tm); box._tm = null; pl.textContent = '▶ Play'; } }, 90);
});
// the tower draws itself once it is on the page
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if(n.nodeType !== 1) return; (n.matches && n.matches('[data-tv]') ? [n] : [...n.querySelectorAll ? n.querySelectorAll('[data-tv]') : []]).forEach(b => { if(!b.dataset.drawn){ b.dataset.drawn = 1; tvDraw(b); } }); }))).observe(document.body, {childList: true, subtree: true});
/* ---------- the teams in the chapter, door by door; and every team ---------- */
function trTablesHtml(i){
  if(typeof trStop === 'function' && trStop(i) && trRun(i).done != null) return trStopTablesHtml(i);
  const R = trRun(i), cm = cmap(S), P = trPick(i), LV = TR_LV[R.k] || TR_LV.tower;
  const row = x => { const t = x.t, M = t.ids.map(id => cm[id]).filter(Boolean);
    return `<tr><th><div class="tid"><i style="background:${x.col}"></i><b>${esc(trName(t))}</b></div>${x.why ? `<div class="twhy2">${esc(x.why)}</div>` : ''}<div class="tmem">${M.map(c => `<a data-id="${c.id}">${esc(c.name)}</a>${c.id === t.lead ? ' (leads)' : ''}`).join(', ')}</div></th>`
      + [0, 1, 2, 3, 4, 5].map(j => { const d = t.doors[j]; return d ? `<td class="${d.k}"><b>${esc(d.d)}</b><small>${d.f}–${d.a} · ${{ok: 'agreed', split: 'split, waited', short: 'hidden way', trap: 'trap', stuck: 'never got through'}[d.k]}</small></td>` : '<td class="none">—</td>'; }).join('')
      + `<td class="res ${t.ok ? 'out' : 'stuck'}">${t.ok ? `Out at hour ${t.path[t.path.length - 1][0]} · ${t.spare}h to spare` : `Stuck on ${LV[t.end].toLowerCase()}`}</td></tr>`; };
  const pips = t => t.doors.map(d => `<i class="${d.k === 'split' || d.k === 'stuck' ? 'n' : 'y'}"></i>`).join('');
  const words = t => { const n = t.doors.filter(d => d.k === 'split' || d.k === 'stuck').length; return n ? `Split at ${n}` : 'Agreed at every door'; };
  const fol = new Set(P.map(x => x.t.n)), whyOf = new Map(P.map(x => [x.t.n, x.why]));
  const all = R.teams.slice().sort((a, b) => (b.ok ? 1 : 0) - (a.ok ? 1 : 0) || (b.spare || 0) - (a.spare || 0) || b.end - a.end || a.n - b.n).map(t => `<tr class="${fol.has(t.n) ? 'fol' : ''}"><td><b>${t.name ? `Team ${t.n} · ${esc(t.name)}` : `Team ${t.n}`}</b>${whyOf.get(t.n) ? `<span class="tag">${esc(whyOf.get(t.n))}</span>` : ''}<small>${t.ids.map(id => cm[id] ? esc(cm[id].name) + (id === t.lead ? ' (leads)' : '') : '').filter(Boolean).join(', ')}</small></td><td><span class="vp">${pips(t)}</span>${words(t)}</td><td class="res ${t.ok ? 'out' : 'stuck'}">${t.ok ? `Out, ${t.spare}h to spare` : `Stuck on ${LV[t.end].toLowerCase()}`}</td></tr>`).join('');
  return `<div><div class="section-h">The teams in this chapter</div><div class="tablebox"><table class="tw-t"><thead><tr><th>Team</th>${[1, 2, 3, 4, 5, 6].map(n => `<th>Door ${n}</th>`).join('')}<th>When the 72 hours ran out</th></tr></thead><tbody>${P.map(row).join('')}</tbody></table></div>
    <p class="muted" style="font-size:12.5px;margin:6px 0 0">One door per level. Under each door: the vote (for–against) and what came of it.</p></div>
    <details class="tw-all"><summary>All ${R.teams.length} teams · ${R.teams.filter(t => t.ok).length} made it out</summary><div class="tablebox tw-scroll"><table class="tw-a"><thead><tr><th>Team</th><th>Doors</th><th>Result</th></tr></thead><tbody>${all}</tbody></table></div><p class="muted" style="font-size:12px;margin:6px 0 0">One square per door: filled, the team agreed; outlined, it split and waited.</p></details>`;
}

// eight levels: the halfway stop between the second and third, and where every team stood at that hour
function tvDraw8(box, i, R, cm, P, col, h){
  const K = trSk(R), LV = K.LV; box.querySelector('[data-tvlab]').textContent = 'Hour ' + h;
  const by = LV.map(() => []); R.teams.forEach(t => by[trAt8(t, h)].push(t));
  if(TV_SEL[i] == null || !R.teams.some(t => t.n === TV_SEL[i])) TV_SEL[i] = (P[0] || {t: R.teams[0]}).t.n;
  box.querySelector('[data-tvtower]').innerHTML = LV.map((f, j) => `<div class="tv-fl${j === 7 ? ' out' : j === 3 ? ' stop' : ''}"><span class="tv-fn">${f}<small>${by[j].length}</small></span><span class="tv-tk">${by[j].sort((a, b) => (col.has(b.n) ? 1 : 0) - (col.has(a.n) ? 1 : 0) || a.n - b.n).map(t => { const x = col.get(t.n);
      return `<button type="button" class="tk${x ? ' c' : ''}${t.n === TV_SEL[i] ? ' on' : ''}" ${x ? `style="--c:${x.col}"` : ''} data-tvt="${t.n}" title="${esc(trName(t))}: ${esc(t.ids.map(id => cm[id] ? cm[id].name : '').join(', '))}">${x ? esc(trName(t)) : t.n}</button>`; }).join('')}</span></div>`).join('');
  const at = by[3].length, out = by[7].length, held = R.teams.filter(t => trAt8(t, h) === 3 && t.bouts && t.hx + t.bouts.length <= h).length;
  box.querySelector('[data-tvtake]').textContent = h === 72 ? `When time ran out: ${out} of ${R.teams.length} teams were out. ${at} ${at === 1 ? 'was' : 'were'} still at the ${K.stop}; ${by.slice(0, 3).reduce((s, a) => s + a.length, 0)} never got down to it.` : `At hour ${h}: ${at} team${at === 1 ? '' : 's'} at the ${K.stop}${held ? ` (${held} paying in hours)` : ''}, ${out} out, ${by[0].length} still at the ${LV[0].toLowerCase()}.`;
  const t = R.teams.find(x => x.n === TV_SEL[i]);
  box.querySelector('[data-tvside]').innerHTML = trStopSide(R, t, col.get(t.n), h, cm);
}
