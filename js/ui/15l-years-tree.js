/* ===================== YEARS, RANKINGS AND FAMILY TREES ===================== */
// Each finished year leaves a small record (WORLD.yrs[ed]): the Top 10 and the Rising 5 as the Association listed them,
// and the council as the year ended. From it: a Rankings block on a Hunter's page and a page for each year.
// The family tree reads the lines the world already keeps (heirs, parents, spouses).

// the two lists, as the Association page draws them
function rankLists(){
  const A = HUNTERS.filter(h => hActive(h) && !h.legacy);
  const top = A.slice().sort((a, b) => rpRecent(b) - rpRecent(a) || hStars(b) - hStars(a)).slice(0, 10);
  const rise = A.filter(h => !top.includes(h) && S.edition - h.edition <= 10 && h.edition < S.edition + (S.finished ? 1 : 0))
    .sort((a, b) => (b.rp || 0) / Math.max(1, S.edition - b.edition) - (a.rp || 0) / Math.max(1, S.edition - a.edition) || hStars(b) - hStars(a)).slice(0, 5);
  return {top, rise};
}
// kept as short strings of licences: some 300 bytes a year
function yrRank(ed){ try { const {top, rise} = rankLists(); WORLD.yrs = WORLD.yrs || {}; WORLD.yrs[ed] = Object.assign(WORLD.yrs[ed] || {}, {t: top.map(h => h.license).join(' '), r: rise.map(h => h.license).join(' ')}); } catch(e){ console.error(e); } }
function yrCouncil(ed){ try { WORLD.yrs = WORLD.yrs || {}; const Z = WORLD.zodiac || {};
  WORLD.yrs[ed] = Object.assign(WORLD.yrs[ed] || {}, {c: [(WORLD.chair && WORLD.chair.lic) || '', WORLD.vice || ''].concat(ZSIGNS.map(z => Z[z] || '')).join(' ')}); } catch(e){ console.error(e); } }
const yrGet = ed => { const r = (WORLD.yrs || {})[ed]; if(!r) return null; const sp = s => s ? s.split(' ') : [];
  const c = r.c != null ? r.c.split(' ') : null; return {top: sp(r.t), rise: sp(r.r), chair: c ? c[0] : null, vice: c ? c[1] : null, zod: c ? Object.fromEntries(ZSIGNS.map((z, i) => [z, c[i + 2] || ''])) : null}; };
const yrFirst = () => { const K = Object.keys(WORLD.yrs || {}).map(Number); return K.length ? Math.min(...K) : null; };

/* ---------- a Hunter's place in the rankings ---------- */
function rankingsHtml(h){
  const Y = WORLD.yrs || {}, eds = Object.keys(Y).map(Number).sort((a, b) => a - b); if(!eds.length) return '';
  const L = h.license, at = eds.map(e => { const r = yrGet(e); return {e, t: r.top.indexOf(L), s: r.rise.indexOf(L)}; });
  const T = at.filter(x => x.t >= 0), R = at.filter(x => x.s >= 0); if(!T.length && !R.length) return '';
  const best = (A, k) => A.length ? Math.min(...A.map(x => x[k])) + 1 : null, bT = best(T, 't'), bR = best(R, 's');
  const times = (A, k, p) => A.filter(x => x[k] + 1 === p).length, yr = n => `${n} year${n === 1 ? '' : 's'}`;
  const runs = A => { const out = []; A.map(x => x.e).forEach(e => { const r = out[out.length - 1]; if(r && e === r[1] + 1) r[1] = e; else out.push([e, e]); }); return out.map(([a, b]) => a === b ? ordinal(a) : `${ordinal(a)}–${ordinal(b)}`).join(' · '); };
  const tile = (k, v, s) => `<div class="st-fig rk-t"><small>${k}</small><b>${v}</b><span>${s}</span></div>`;
  // the line: the Top 10 above (1 at the top), the Rising 5 below, a gap in the years out of both
  const end = h.diedEd ?? h.missEd ?? (h.retire && h.retire.ed) ?? S.edition, E = eds.filter(e => e >= h.edition && e <= end);
  let svg = '';
  if(E.length > 1){
    const W = Math.max(420, Math.min(860, innerWidth - 90)), Hh = 190, x = e => 34 + (e - E[0]) / (E[E.length - 1] - E[0]) * (W - 50), yT = i => 14 + i * 9, yR = i => 120 + i * 9;
    const P = at.filter(p => p.e >= E[0] && p.e <= E[E.length - 1]);
    const seg = (k, y) => { let d = '', on = false, last = null; P.forEach(p => { const v = p[k]; if(v >= 0){ d += `${on && p.e === last + 1 ? 'L' : 'M'}${x(p.e).toFixed(1)},${y(v).toFixed(1)} `; on = true; last = p.e; } else on = false; }); return d; };
    const dots = (k, y, cls) => P.filter(p => p[k] >= 0 && !P.some(q => q[k] >= 0 && Math.abs(q.e - p.e) === 1)).map(p => `<circle cx="${x(p.e)}" cy="${y(p[k])}" r="2.4" class="${cls}"/>`).join('');   // a lone year still shows
    const step = W < 600 ? 20 : 10, ticks = E.filter(e => e % step === 0);
    svg = `<figure class="st-fig"><figcaption>Place in the rankings, year by year</figcaption><svg class="rk-svg" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Place in the rankings of ${esc(h.name)}, year by year">
      <rect x="34" y="8" width="${W - 50}" height="${yT(9) - 2}" class="band"/><text x="4" y="${yT(0) + 4}">#1</text><text x="0" y="${yT(9) + 4}">#10</text><text x="4" y="${yR(0) + 4}">R1</text><text x="4" y="${yR(4) + 4}">R5</text>
      <line x1="34" x2="${W - 16}" y1="${yR(0) - 12}" y2="${yR(0) - 12}" class="sep"/><text x="${W - 16}" y="${yT(9) + 17}" text-anchor="end">Top Hunters</text><text x="${W - 16}" y="${yR(4) + 18}" text-anchor="end">Rising Hunters</text>
      <path d="${seg('t', yT)}" class="top"/><path d="${seg('s', yR)}" class="rise"/>${dots('t', yT, 'tdot')}${dots('s', yR, 'rdot')}
      ${P.filter(p => p.t === 0).map(p => `<circle cx="${x(p.e)}" cy="${yT(0)}" r="4" class="one"><title>#1 after the ${ordinal(p.e)}</title></circle>`).join('')}
      ${ticks.map(e => `<text x="${x(e)}" y="${Hh - 2}" text-anchor="middle">${ordinal(e)}</text>`).join('')}</svg></figure>`;
  }
  return `<div class="rk"><div class="section-h">Rankings</div><div class="rk-ts">
      ${tile('Best in Top Hunters', bT ? '#' + bT : '—', bT ? `${yr(times(T, 't', bT))} at #${bT}` : 'never in the Top 10')}
      ${tile('Years in the Top 10', T.length || '—', T.length ? runs(T) : '')}
      ${tile('Best in Rising Hunters', bR ? '#' + bR : '—', bR ? `${yr(times(R, 's', bR))} at #${bR}` : 'never listed')}</div>
    ${svg}<p class="muted st-note rk-n">Counted from the ${ordinal(eds[0])} exam on.${T.some(p => p.t === 0) ? ' The gold dots are the years at #1.' : ''}</p></div>`;
}

/* ---------- a page for each year ---------- */
const YP_GROUPS = [['Elections', ['election']], ['Seats', ['zodiac']], ['The Dark Continent', ['exped']], ['Lost', ['death', 'missing']], ['Retired', ['retire']], ['Stars', ['star']], ['Weddings', ['wed']], ['Cases & scandals', ['case', 'scandal']], ['Honours', ['award']]];
function openYear(ed){
  const r = HISTORY.find(x => x.edition === ed); if(!r) return;
  modalBack = null;
  const EDS = HISTORY.map(x => x.edition), i = EDS.indexOf(ed), rec = yrGet(ed), prv = yrGet(ed - 1);
  // what the year did: every line the Hunters' records keep for it, once each
  const seen = new Set(), EV = [];
  HUNTERS.forEach(h => (h.log || []).forEach(x => { if(x.ed !== ed || seen.has(x.text)) return; seen.add(x.text); EV.push(x); }));
  const B = BULLETINS.find(b => b.edition === ed); if(B) B.items.forEach(it => { if(!seen.has(it.text)){ seen.add(it.text); EV.push({k: it.kind, text: it.text}); } });
  const grp = ([t, K]) => { const L = EV.filter(e => K.includes(e.k)); return L.length ? `<div class="yp-g"><div class="section-h">${t} <small>${L.length}</small></div>${L.slice(0, 5).map(e => `<p>${esc(e.text)}</p>`).join('')}${L.length > 5 ? `<details class="yp-more"><summary>${L.length - 5} more</summary>${L.slice(5).map(e => `<p>${esc(e.text)}</p>`).join('')}</details>` : ''}</div>` : ''; };
  const lic = hh => HUNTERS.find(x => !x.pro && x.edition === ed && x.name === hh.name);
  const nh = r.hunters.map(hh => { const h = lic(hh); return `<div${h ? ` data-hunter="${esc(h.license)}"` : ''}><b>${esc(hh.name)}</b><span>${h ? `<i class="stars">${starStr(hStars(h))}</i>${esc((h.career || '').replace(' Hunter', ''))}` : esc(hh.career || '')}</span></div>`; }).join('');
  const cc = (k, kj, role, l, nw) => { const h = hLic(l); return `<div class="cc ${k}"${h ? ` data-hunter="${esc(h.license)}"` : ''}><span class="kj" aria-hidden="true">${kj}</span><small>${role}${nw ? ' <span class="yp-nw">new</span>' : ''}</small>${h ? `<b>${esc(h.name)}</b><span class="cc-sub"><span class="stars">${starStr(hStars(h))}</span> ${esc((h.career || '').replace(' Hunter', ''))}</span>` : '<b class="muted">Vacant</b>'}</div>`; };
  const council = rec && rec.chair != null ? `<div class="yp-g"><div class="section-h">The Council</div>
      <div class="council">${cc('chair', '会長', 'Chairman', rec.chair, prv && prv.chair != null && prv.chair !== rec.chair)}${cc('vice', '副会長', 'Vice-Chairman', rec.vice, prv && prv.vice != null && prv.vice !== rec.vice)}</div>
      <div class="zgrid yp-zg">${ZSIGNS.map(z => cc('zod', ZKANJI[z], 'The ' + z, rec.zod[z], prv && prv.zod && prv.zod[z] !== rec.zod[z])).join('')}</div>
      <p class="muted st-note yp-cn">As the year ended.${prv && prv.zod ? ' <span class="yp-nw">new</span> marks a seat that changed hands during it.' : ''}</p></div>` : '';
  const ol = L => `<ol class="yp-ol">${L.map(l => { const h = hLic(l); return h ? `<li><a data-hunter="${esc(h.license)}">${esc(h.name)}</a> <span class="stars">${starStr(hStars(h))}</span></li>` : ''; }).join('')}</ol>`;
  const ranks = rec && rec.top.length ? `<div class="yp-g"><div class="section-h">Top Hunters</div>${ol(rec.top)}${rec.rise.length ? `<div class="section-h" style="margin-top:12px">Rising Hunters</div>${ol(rec.rise)}` : ''}</div>` : '';
  const first = yrFirst(), nav = (e, lab) => e != null ? `<button type="button" class="btn small" data-year="${e}">${lab}</button>` : '<span></span>';
  const died = EV.filter(e => e.k === 'death').length;
  showModal(`<div class="sheet wide" role="dialog" aria-modal="true" aria-label="The year of the ${ordinal(ed)} Hunter Exam">
    <div class="sheet-head"><div><div class="meta">The year of the</div><h2>${ordinal(ed)} Hunter Exam</h2></div><div style="display:flex;gap:8px;flex-wrap:wrap">${r.snap ? `<button class="btn" data-arch="${ed}">The exam ›</button>` : ''}<button class="btn" id="mClose">Close</button></div></div>
    <div class="yp-nav">${nav(i > 0 ? EDS[i - 1] : null, `← ${i > 0 ? ordinal(EDS[i - 1]) : ''}`)}<select class="sel" data-yrsel aria-label="Go to a year">${EDS.slice().reverse().map(e => `<option value="${e}"${e === ed ? ' selected' : ''}>${ordinal(e)}</option>`).join('')}</select>${nav(i < EDS.length - 1 ? EDS[i + 1] : null, `${i < EDS.length - 1 ? ordinal(EDS[i + 1]) : ''} →`)}</div>
    <div class="yp-top">${r.paper ? `<div class="yp-paper"><small>The Hunter Herald</small><b>${esc(r.paper.head || '')}</b>${r.paper.dek ? `<p>${esc(r.paper.dek)}</p>` : ''}</div>` : ''}
      <div class="yp-nums"><div><b>${r.hunters.length}</b><span>new Hunters</span></div><div><b>${fmt(r.applicants)}</b><span>applicants</span></div><div><b>${r.snap ? r.snap.dead : '—'}</b><span>died in the exam</span></div><div><b>${died}</b><span>Hunters died this year</span></div></div></div>
    ${r.hunters.length ? `<div class="yp-g"><div class="section-h">New Hunters <small>${r.hunters.length}</small></div><div class="yp-new">${nh}</div></div>` : ''}
    ${council || ranks ? `<div class="yp-two">${council}${ranks}</div>` : first != null && ed < first ? `<p class="muted st-note">The council and the rankings are kept from the ${ordinal(first)} exam on.</p>` : ''}
    <div class="yp-grid">${YP_GROUPS.map(grp).join('')}</div>
    ${EV.length ? '' : '<p class="muted">Nothing else from this year survives in the records.</p>'}</div>`);
}
document.addEventListener('click', e => { const y = e.target.closest && e.target.closest('[data-year]'); if(!y || y.disabled) return; e.preventDefault(); e.stopPropagation(); openYear(+y.dataset.year); }, true);
document.addEventListener('change', e => { const s = e.target.closest && e.target.closest('[data-yrsel]'); if(s) openYear(+s.value); });

/* ---------- the family tree ---------- */
// people: Hunters, and the children who never became one (WORLD.heirs); a grandchild through someone the records never named gets a "?"
function famGraph(){
  const N = new Map(), par = new Map(), kidOf = new Map((WORLD.heirs || []).filter(k => k.cid).map(k => [k.cid, k])), byCid = new Map(HUNTERS.map(h => [h.cid, h]));
  HUNTERS.forEach(h => N.set(h.license, {id: h.license, h, name: h.name, born: h.edition - (h.age || 0), died: h.diedEd ?? null, spouse: h.spouse || h.widowOf || null}));
  const heirNode = k => { const h = k.cid && byCid.get(k.cid); if(h) return h.license; if(!N.has(k.id)) N.set(k.id, {id: k.id, name: k.name, born: k.born, died: null, never: !!k.never, entered: k.entered || null}); return k.id; };
  const H2 = WORLD.heirs || [], byK = new Map(H2.map(k => [k.id, k]));
  const link = (id, ps) => { ps = ps.filter(p => N.has(p)); if(ps.length && !par.has(id)) par.set(id, ps); };
  const via = (id, grand, viaId) => { const v = viaId && byK.get(viaId); let m;
    if(v){ m = heirNode(v); if(!par.has(m)) link(m, grand); } else { m = 'via-' + id; N.set(m, {id: m, ghost: true, name: 'a parent who never became a Hunter'}); link(m, grand); }
    link(id, [m]); };
  H2.forEach(k => { const id = heirNode(k); if(k.grand && k.grand.length) via(id, k.grand, k.via); else link(id, k.parents || []); });
  HUNTERS.forEach(h => { if(par.has(h.license)) return; if(h.grandOf && h.grandOf.length) via(h.license, h.grandOf, null); else link(h.license, h.heirOf || (h.hParent ? [h.hParent] : [])); });
  const kids = new Map(); par.forEach((ps, c) => ps.forEach(p => { if(!kids.has(p)) kids.set(p, []); kids.get(p).push(c); }));
  return {N, par, kids};
}
// one family: everyone tied by blood to this person, and their spouses
function famOf(lic, G){
  G = G || famGraph(); if(!G.N.has(lic)) return null;
  const blood = new Set([lic]), q = [lic];
  while(q.length && blood.size < 90){ const x = q.shift(); [...(G.par.get(x) || []), ...(G.kids.get(x) || [])].forEach(y => { if(!blood.has(y)){ blood.add(y); q.push(y); } }); }
  const all = new Set(blood); blood.forEach(id => { const s = G.N.get(id).spouse; if(s && G.N.has(s)) all.add(s); });
  G.N.forEach(n => { if(n.spouse && blood.has(n.spouse)) all.add(n.id); });   // a spouse whose record points this way
  return {G, ids: all, blood};
}
const famSize = lic => { const F = famOf(lic); return F ? F.blood.size : 0; };
let FT_VIEW = 'A';
function openTree(lic){
  const F = famOf(lic); if(!F) return;
  modalBack = null;
  const {G, ids} = F, P = id => G.N.get(id), parentsOf = id => (G.par.get(id) || []).filter(p => ids.has(p));
  // generations: the eldest at the top, a child one row below its lower parent, a couple on one row
  const gen = {}, g = id => { if(gen[id] != null) return gen[id]; gen[id] = 0; const ps = parentsOf(id); return gen[id] = ps.length ? 1 + Math.max(...ps.map(p => g(p))) : 0; };
  ids.forEach(id => g(id));
  for(let k = 0; k < 3; k++) ids.forEach(id => { const s = P(id).spouse; if(s && ids.has(s)){ const m = Math.max(gen[id], gen[s]); if(!parentsOf(id).length || !parentsOf(s).length) gen[id] = gen[s] = m; } });
  const spouseOf = id => { const s = P(id).spouse; if(s && ids.has(s)) return s; for(const x of ids) if(P(x).spouse === id) return x; return null; };
  const sur = (P(lic).name || '').split(' ').slice(-1)[0];
  const card = id => { const p = P(id), h = p.h;
    if(p.ghost) return `<div class="ft-c ghost" data-ftp="${id}"><b>?</b><span>${esc(p.name)}</span></div>`;
    const life = `${p.born != null ? 'born ' + p.born : ''}${p.died != null ? ` · died ${p.died}` : h && h.status === 'Missing' ? ' · missing' : ''}`;
    return `<div class="ft-c ${h ? 'h' : 'civ'}${h && !hActive(h) && h.status !== 'Retired' ? ' dead' : ''}${id === lic ? ' me' : ''}" data-ftp="${id}">${h ? `<a data-hunter="${esc(h.license)}">${esc(p.name)}</a>` : `<b>${esc(p.name)}</b>`}
      <span>${h ? `<i class="stars">${starStr(hStars(h)) || ''}</i> ${esc((h.career || 'Hunter').replace(' Hunter', ''))} · ${h.pro ? 'veteran' : ordinal(h.edition)}` : p.never ? 'never sat the exam' : p.entered ? `took the ${ordinal(p.entered)} exam` : 'not a Hunter'}</span>${life ? `<small>${life}</small>` : ''}</div>`; };
  const maxG = Math.max(...[...ids].map(id => gen[id])), rows = [];
  for(let r = 0; r <= maxG; r++){ const L = [...ids].filter(id => gen[id] === r).sort((a, b) => (P(a).born ?? 0) - (P(b).born ?? 0)), done = new Set(), out = [];
    L.forEach(id => { if(done.has(id)) return; done.add(id); const s = spouseOf(id); if(s && gen[s] === r && !done.has(s)){ done.add(s); out.push(`<div class="ft-pair">${card(id)}<span class="ft-wed" title="Married">⚭</span>${card(s)}</div>`); } else out.push(card(id)); });
    rows.push(`<div class="ft-row"><small class="ft-gl"><span class="lg">Generation </span><span class="sh">G</span>${r + 1}</small><div class="ft-cs">${out.join('')}</div></div>`); }
  // lifelines: one bar from birth to death (or now), a star in the year of the license
  const LL = [...ids].map(P).filter(p => !p.ghost && p.born != null).sort((a, b) => a.born - b.born);
  let life = '';
  if(LL.length){ const y0 = Math.min(...LL.map(p => p.born)), y1 = S.edition, W = innerWidth < 640 ? 520 : 900, rowH = 24, x = y => 150 + (y - y0) / Math.max(1, y1 - y0) * (W - 166), ix = new Map(LL.map((p, i) => [p.id, i])), H = 28 + LL.length * rowH, ticks = [];
    for(let t = Math.ceil(y0 / 20) * 20; t <= y1; t += 20) ticks.push(t);
    life = `<svg viewBox="0 0 ${W} ${H}" class="lt" role="img" aria-label="Lifelines of the family">${ticks.map(t => `<line x1="${x(t)}" x2="${x(t)}" y1="16" y2="${H}" class="tk"/><text x="${x(t)}" y="11" text-anchor="middle" class="ax">${ordinal(t)}</text>`).join('')}
      ${LL.flatMap(c => parentsOf(c.id).filter(p => ix.has(p)).map(p => `<path class="pc" d="M${x(c.born)},${28 + ix.get(p) * rowH + 5} V${28 + ix.get(c.id) * rowH - 6}"/>`)).join('')}
      ${LL.map((p, i) => { const y = 28 + i * rowH, h = p.h, end = p.died ?? (h ? (!hActive(h) && h.status !== 'Retired' ? Math.min(y1, p.born + 60) : y1) : Math.min(y1, p.born + 80));   // a civilian with no news fades at 80
        return `<g class="${h ? 'h' : 'civ'}" data-ftp="${p.id}"><text x="144" y="${y + 4}" text-anchor="end" class="nm">${esc(p.name)}</text><rect x="${x(p.born)}" y="${y - 6}" width="${Math.max(3, x(end) - x(p.born))}" height="12" rx="6"/>${h ? `<text x="${x(h.pro ? h.edition - (h.years || 0) : h.edition)}" y="${y + 4}" text-anchor="middle" class="lic">★</text>` : ''}</g>`; }).join('')}</svg>`; }
  const nH = [...ids].filter(id => P(id).h).length;
  showModal(`<div class="sheet wide" role="dialog" aria-modal="true" aria-label="Family tree">
    <div class="sheet-head"><div><div class="meta">Family tree · ${nH} Hunter${nH === 1 ? '' : 's'} · ${maxG + 1} generation${maxG ? 's' : ''}</div><h2>The family of ${esc(P(lic).name)}</h2></div><div style="display:flex;gap:8px;flex-wrap:wrap">${sur ? `<button class="btn" data-famreg="${esc(sur)}">Every ${esc(sur)} in the register</button>` : ''}<button class="btn" id="mClose">Close</button></div></div>
    <div class="ft-sw seg" role="group" aria-label="View"><button type="button" data-ftv="A" aria-pressed="${FT_VIEW === 'A'}">The tree</button><button type="button" data-ftv="B" aria-pressed="${FT_VIEW === 'B'}">Lifelines</button></div>
    <div class="ft-wrap" data-noal><div id="ftA" class="ft-a"${FT_VIEW === 'A' ? '' : ' hidden'}><svg class="ft-lines"></svg>${rows.join('')}</div><div id="ftB"${FT_VIEW === 'B' ? '' : ' hidden'}>${life}</div></div>
    <p class="muted st-note">⚭ married · a dashed card never became a Hunter · ★ on a lifeline is the year of the license. Tap someone to light up their line; tap a name to open the Hunter.</p></div>`);
  const M = $('modal'); M._ft = {parentsOf, kids: id => (G.kids.get(id) || []).filter(k => ids.has(k)), spouseOf, pairs: [...ids].filter(id => parentsOf(id).length).map(id => [parentsOf(id), id])};
  ftLines(); ftLight(lic);
}
function ftLines(){
  const box = document.getElementById('ftA'), M = $('modal'); if(!box || box.hidden || !M._ft) return;
  requestAnimationFrame(() => { const bb = box.getBoundingClientRect(), svg = box.querySelector('.ft-lines'); svg.setAttribute('width', box.scrollWidth); svg.setAttribute('height', box.scrollHeight);
    const at = id => { const e = box.querySelector(`[data-ftp="${CSS.escape(id)}"]`); if(!e) return null; const r = e.getBoundingClientRect(); return {x: r.left - bb.left + r.width / 2 + box.scrollLeft, t: r.top - bb.top + box.scrollTop, b: r.bottom - bb.top + box.scrollTop}; };
    svg.innerHTML = M._ft.pairs.map(([ps, c]) => { const C = at(c), Q = ps.map(at).filter(Boolean); if(!C || !Q.length) return ''; const px = Q.reduce((s, q) => s + q.x, 0) / Q.length, pb = Math.max(...Q.map(q => q.b));
      // parents on one row meet above the child; parents on different rows each draw their own line
      const one = Q.every(q => Math.abs(q.b - Q[0].b) < 4), L = one ? [[px, pb]] : Q.map(q => [q.x, q.b]), my2 = y => Math.max(y + 6, C.t - 14);
      return L.map(([x0, y0]) => `<path data-l="${esc(ps.join(' '))}>${esc(c)}" d="M${x0},${y0} V${my2(y0)} H${C.x} V${C.t}"/>`).join(''); }).join(''); ftLight(M._ftOn); });
}
function ftLight(id){
  const M = $('modal'), F = M._ft; if(!F || !id) return; M._ftOn = id;
  const on = new Set([id]), up = i => F.parentsOf(i).forEach(p => { if(!on.has(p)){ on.add(p); up(p); } }), down = i => F.kids(i).forEach(k => { if(!on.has(k)){ on.add(k); down(k); } });
  up(id); down(id); const s = F.spouseOf(id); if(s) on.add(s);
  M.querySelectorAll('[data-ftp]').forEach(n => { n.classList.toggle('dim', !on.has(n.dataset.ftp)); n.classList.toggle('sel', n.dataset.ftp === id); });
  M.querySelectorAll('.ft-lines path').forEach(p => { const [ps, k] = p.dataset.l.split('>'); p.classList.toggle('dim', !(on.has(k) && ps.split(' ').some(x => on.has(x)))); });
}
document.addEventListener('click', e => {
  if(!e.target.closest) return;
  const t = e.target.closest('[data-tree]'); if(t){ e.preventDefault(); e.stopPropagation(); openTree(t.dataset.tree); return; }
  const v = e.target.closest('[data-ftv]'); if(v){ FT_VIEW = v.dataset.ftv; document.querySelectorAll('[data-ftv]').forEach(b => b.setAttribute('aria-pressed', b === v)); $('ftA').hidden = FT_VIEW !== 'A'; $('ftB').hidden = FT_VIEW !== 'B'; ftLines(); return; }
  const p = e.target.closest('[data-ftp]'); if(p && !e.target.closest('a')){ ftLight(p.dataset.ftp); }
}, true);
// the button on a Hunter's page, when there is a family to draw
const famTreeBtn = h => famSize(h.license) >= 2 ? `<button type="button" class="btn small ft-open" data-tree="${esc(h.license)}">Family tree ›</button>` : '';
// a surname from the Statistics: the largest family of that name
function treeBySurname(s){
  const G = famGraph(), done = new Set(); let best = null;
  HUNTERS.filter(h => h.name.split(' ').slice(-1)[0] === s).forEach(h => { if(done.has(h.license)) return; const F = famOf(h.license, G); F.blood.forEach(id => done.add(id));
    if(!best || F.blood.size > best.n || (F.blood.size === best.n && hStars(h) > hStars(best.h))) best = {h, n: F.blood.size}; });
  if(best) openTree(best.h.license);
}
