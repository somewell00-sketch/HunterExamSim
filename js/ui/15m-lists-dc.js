/* ===================== FULL LISTS AND THE DARK CONTINENT ===================== */
// "See all ›" on a Statistics list opens every row of it: a search box, a filter where one helps, columns that sort.
// The Dark Continent gets a page of its own in World: who is out there now, and every expedition the records keep.

const SA = {kind: null, q: '', f: '', sort: null, dir: -1};
const saName = h => h ? `<a data-hunter="${esc(h.license)}">${esc(h.name)}</a>` : '<span class="muted">—</span>';
// each list: its title, its columns ([label, numeric?]), and its rows ({c: cells, v: sort values, t: search text, f: filter value})
const SA_DEF = {
  families: () => { const by = {};
    const PAR = new Set((WORLD.heirs || []).flatMap(k => (k.parents || []).concat(k.grand || [])));
    HUNTERS.filter(h => !h.legacy && (h.heirOf || h.hParent || h.grandOf || PAR.has(h.license))).forEach(h => { const s = surOf(h); (by[s] = by[s] || []).push(h); });
    return {title: 'Hunter families', cols: [['Family'], ['Hunters', 1], ['Active', 1], ['First licensed', 1], ['Best known']],
      rows: Object.entries(by).map(([s, L]) => { const best = L.slice().sort((a, b) => (b.rp || 0) - (a.rp || 0))[0], a = L.filter(hActive).length, f = Math.min(...L.map(h => h.edition));
        return {c: [`<a data-famq="${esc(s)}">${esc(s)}</a>`, L.length, a, ordinal(f), saName(best)], v: [s, L.length, a, f, best.name], t: s + ' ' + L.map(h => h.name).join(' ')}; })}; },
  lines: () => { const G = famGraph(), memo = new Map(), up = id => { if(memo.has(id)) return memo.get(id); memo.set(id, 1); const ps = G.par.get(id) || []; const d = ps.length ? 1 + Math.max(...ps.map(up)) : 1; memo.set(id, d); return d; };
    return {title: 'Longest lines', cols: [['Hunter'], ['Generations', 1], ['Licensed', 1], ['Status'], ['']],
      rows: HUNTERS.filter(h => !h.legacy && (h.heirOf || h.hParent || h.grandOf)).map(h => { const g = up(h.license);
        return {c: [saName(h), g, ordinal(h.edition), esc(hActive(h) ? 'Active' : h.status), `<a data-tree="${esc(h.license)}">tree ›</a>`], v: [h.name, g, h.edition, h.status, 0], t: h.name}; }).filter(r => r.v[1] >= 2)}; },
  schools: () => ({title: 'Schools of Nen', cols: [['School'], ['Students', 1], ['Masters', 1], ['Founded', 1], ['Status']], filter: ['Status', [['open', 'Open'], ['closed', 'Closed']]],
    rows: (WORLD.schools || []).map(s => { const n = HUNTERS.filter(h => h.school === s.id).length;
      return {c: [`<a data-school="${s.id}">${esc(capS(s.name))}</a>`, n, (s.heads || []).length, s.ed != null ? ordinal(s.ed) : '—', esc(s.st || '')], v: [s.name, n, (s.heads || []).length, s.ed ?? 0, s.st], t: s.name + ' ' + (s.fName || ''), f: s.st === 'open' ? 'open' : 'closed'}; })}),
  outlaws: () => ({title: 'Outlaws', cols: [['Outlaw'], ['On the list', 1], ['Hunters killed', 1], ['Status'], ['Brought in by']], filter: ['Status', [['wanted', 'At large'], ['captured', 'Captured'], ['dead', 'Killed']]],
    rows: (WORLD.wanted || []).map(w => { const by = w.byLic && hLic(w.byLic);
      return {c: [`<a data-outlaw="${esc(w.id)}">${esc(w.name)}</a>${w.nick ? ` <span class="muted">“${esc(w.nick)}”</span>` : ''}`, w.from != null ? `${ordinal(w.from)}${w.endEd != null ? '–' + ordinal(w.endEd) : ''}` : '—', w.kills || 0, esc(w.status === 'wanted' ? 'at large' : w.status), by ? saName(by) : esc(w.by || '—')],
        v: [w.name, w.from ?? 0, w.kills || 0, w.status, w.by || ''], t: `${w.name} ${w.nick || ''} ${w.by || ''}`, f: w.status}; })}),
  catchers: () => { const by = {}; (WORLD.wanted || []).forEach(w => { if(w.byLic && (w.status === 'captured' || w.status === 'dead')) (by[w.byLic] = by[w.byLic] || []).push(w); });
    return {title: 'Hunters who brought in outlaws', cols: [['Hunter'], ['Outlaws', 1], ['Killed', 1], ['Specialty']],
      rows: Object.entries(by).map(([l, L]) => { const h = hLic(l); return {c: [h ? saName(h) : esc(L[0].by || l), L.length, L.filter(w => w.status === 'dead').length, esc(h ? (h.career || '').replace(' Hunter', '') : '')], v: [h ? h.name : '', L.length, L.filter(w => w.status === 'dead').length, h ? h.career : ''], t: h ? h.name : L[0].by || ''}; })}; },
  relics: () => ({title: 'Relics', cols: [['Relic'], ['Owners', 1], ['Status'], ['Held by']], filter: ['Status', [['held', 'Held'], ['vault', 'In the vault'], ['lost', 'Lost'], ['outlaw', 'With an outlaw'], ['missing', 'Missing']]],
    rows: Object.values(WORLD.relics || {}).filter(r => r.st !== 'hidden' && RDEF[r.id]).map(r => { const h = (r.st === 'held' || r.st === 'missing') && hLic(r.holder);
      return {c: [`<a data-relic="${r.id}">${esc(capS(RDEF[r.id].name))}</a>`, r.n || (r.owners || []).length, esc(r.st), h ? saName(h) : '<span class="muted">—</span>'], v: [RDEF[r.id].name, r.n || (r.owners || []).length, r.st, h ? h.name : ''], t: RDEF[r.id].name + ' ' + (h ? h.name : ''), f: r.st}; })}),
  chairs: () => { const CH = WORLD.chairHist || [];
    return {title: 'Chairmen', cols: [['Chairman'], ['Term', 1], ['Years', 1], ['Specialty'], ['Stars', 1]],
      rows: CH.map(t => { const h = hLic(t.lic), y = (t.to || S.edition) - t.from;
        return {c: [saName(h), `${ordinal(t.from)}–${t.to ? ordinal(t.to) : 'now'}`, y, esc(h ? (h.career || '').replace(' Hunter', '') : ''), h ? `<span class="stars">${starStr(hStars(h))}</span>` : ''], v: [h ? h.name : '', t.from, y, h ? h.career : '', h ? hStars(h) : 0], t: h ? h.name : ''}; })}; }
};
function openStAll(kind){
  if(SA.kind !== kind){ SA.kind = kind; SA.q = ''; SA.f = ''; SA.sort = null; SA.dir = -1; }
  const L = SA_DEF[kind] && SA_DEF[kind](); if(!L) return; modalBack = null;
  const q = SA.q.trim().toLowerCase(), first = L.cols.findIndex(c => c[1]), sk = SA.sort ?? (first >= 0 ? first : 0);
  const rows = L.rows.filter(r => (!q || r.t.toLowerCase().includes(q)) && (!SA.f || r.f === SA.f));
  rows.sort((a, b) => { const x = a.v[sk], y = b.v[sk]; return (typeof x === 'string' ? x.localeCompare(y) : x - y) * SA.dir || String(a.v[0]).localeCompare(String(b.v[0])); });
  const cnt = v => L.rows.filter(r => r.f === v && (!q || r.t.toLowerCase().includes(q))).length;
  const per = 200, more = rows.length > per;
  showModal(`<div class="sheet wide" role="dialog" aria-modal="true" aria-label="${esc(L.title)}">
    <div class="sheet-head"><div><div class="meta">Statistics · every row</div><h2>${esc(L.title)}</h2></div><button class="btn" id="mClose">Close</button></div>
    <div class="sa-bar"><input type="search" id="saq" placeholder="Search" value="${esc(SA.q)}" aria-label="Search the list">${L.filter ? `<select id="saf" aria-label="${esc(L.filter[0])}"><option value="">${esc(L.filter[0])}: any</option>${L.filter[1].map(([v, l]) => { const n = cnt(v); return n || SA.f === v ? `<option value="${v}"${SA.f === v ? ' selected' : ''}>${esc(l)} (${n})</option>` : ''; }).join('')}</select>` : ''}<span class="muted">${rows.length} of ${L.rows.length}</span></div>
    <div class="tablebox"><table class="sa-t"><thead><tr>${L.cols.map(([l, num], i) => `<th class="sortable${i === sk ? ' on' : ''}${num ? ' num' : ''}" data-sasort="${i}">${esc(l)}${l ? `<i>${i === sk ? (SA.dir > 0 ? '▲' : '▼') : '↕'}</i>` : ''}</th>`).join('')}</tr></thead>
      <tbody>${rows.slice(0, per).map(r => `<tr>${r.c.map((c, i) => `<td${L.cols[i][1] ? ' class="num"' : ''}>${c}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${L.cols.length}" class="muted">Nothing matches.</td></tr>`}</tbody></table></div>
    ${more ? `<p class="muted st-note">The first ${per} are shown; search to find the rest.</p>` : ''}</div>`);
  const i = $('saq'); if(i){ i.oninput = () => { SA.q = i.value; clearTimeout(window._saT); window._saT = setTimeout(() => { openStAll(kind); const j = $('saq'); if(j){ j.focus(); j.setSelectionRange(j.value.length, j.value.length); } }, 160); }; }
  const f = $('saf'); if(f) f.onchange = () => { SA.f = f.value; openStAll(kind); };
}
document.addEventListener('click', e => { if(!e.target.closest) return;
  const a = e.target.closest('[data-stall]'); if(a){ e.preventDefault(); e.stopPropagation(); openStAll(a.dataset.stall); return; }
  const s = e.target.closest('[data-sasort]'); if(s){ const k = +s.dataset.sasort; if(SA.sort === k) SA.dir = -SA.dir; else { SA.sort = k; SA.dir = SA_DEF[SA.kind]().cols[k][1] ? -1 : 1; } openStAll(SA.kind); }
}, true);

/* ---------- the Dark Continent ---------- */
// every expedition, written down when it comes back (or is given up)
function expRecord(E, ed, live, text){
  WORLD.expHist = WORLD.expHist || [];
  if(WORLD.expHist.some(x => x.id === E.id)) return;
  WORLD.expHist.push({id: E.id, ed: E.ed, back: ed, goal: E.goal || null, rescue: !!E.rescue, members: E.members.slice(), lost: (E.lost || []).slice(), home: live.map(h => h.license), text: text || ''});
}
let DC_ALL = false;
document.addEventListener('click', e => { if(e.target.closest && e.target.closest('[data-dcall]')){ DC_ALL = !DC_ALL; renderWorld(); } });
const DC_OUT = x => !x.home.length ? 'lost' : x.lost.length ? 'short' : 'home';
function dcPageHtml(){
  const X = (WORLD.expHist || []).slice().sort((a, b) => b.ed - a.ed), E = WORLD.exped, T = WORLD.tally || {}, PL = WORLD.expPlan;
  const nm = l => { const h = hLic(l); return h ? `<a data-hunter="${esc(h.license)}">${esc(h.name)}</a>` : '—'; };
  const now = dcHtml().replace('<div class="section-h">Dark Continent</div>', '<div class="section-h">Out there now</div>');
  const plan = PL && !E ? `<p class="muted st-note" style="margin:8px 0 0">An expedition leaves next year ${esc(PL.goal)}${(PL.vol || []).length ? `; ${PL.vol.map(nm).join(', ')} volunteered` : ''}.</p>` : '';
  // the strip: one bar per expedition along the years, coloured by how it ended
  const all = X.concat(E ? [{id: E.id, ed: E.ed, back: null, members: E.members, lost: E.lost || [], home: [], now: true, goal: E.goal, rescue: !!E.rescue}] : []);
  let strip = '';
  if(all.length){ const e0 = Math.min(...all.map(x => x.ed)), e1 = S.edition, W = 760, H = 46, x = e => 10 + (e - e0) / Math.max(1, e1 - e0) * (W - 20), ticks = [];
    const st = Math.max(10, Math.ceil((e1 - e0) / 6 / 10) * 10); for(let t = Math.ceil(e0 / st) * st; t <= e1; t += st) ticks.push(t);
    strip = `<figure class="st-fig dc-strip"><figcaption>Every expedition on record</figcaption><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Expeditions along the years">${ticks.map(t => `<line x1="${x(t)}" x2="${x(t)}" y1="4" y2="28" class="st-grid"/><text x="${x(t)}" y="${H - 4}" text-anchor="middle" class="st-ax">${ordinal(t)}</text>`).join('')}
      ${all.map(e => { const k = e.now ? 'now' : DC_OUT(e); return `<rect x="${x(e.ed)}" y="8" width="${Math.max(4, x(e.back ?? e1) - x(e.ed))}" height="16" rx="4" class="dc-b ${k}"><title>${ordinal(e.ed)}–${e.back ? ordinal(e.back) : 'now'}: ${e.members.length} went${e.now ? ', still out there' : `, ${e.home.length} came home`}</title></rect>`; }).join('')}</svg>
      <p class="dc-lg"><span><i class="home"></i>everyone came home</span><span><i class="short"></i>some were lost</span><span><i class="lost"></i>nobody came back</span>${E ? '<span><i class="now"></i>out there now</span>' : ''}</p></figure>`; }
  const went = X.reduce((s, x) => s + x.members.length, 0), back = X.reduce((s, x) => s + x.home.length, 0);
  const row = x => { const lead = hLic(x.members[0]), k = DC_OUT(x), yrs = x.back - x.ed;
    return `<details class="dc-x ${k}"><summary><span class="dc-yr">${ordinal(x.ed)}–${ordinal(x.back)}</span><span class="dc-g">${x.rescue ? 'A rescue' : esc(capS((x.goal || 'an expedition').replace(/^to /, '')))}</span><span class="dc-n">${x.home.length} of ${x.members.length} home · ${yrs} yr${yrs === 1 ? '' : 's'}</span></summary>
      <div class="dc-d">${lead ? `<p class="muted">Led by ${nm(lead.license)}.</p>` : ''}<div class="dc-team">${x.members.map(l => { const h = hLic(l), ok = x.home.includes(l); return `<span class="${ok ? '' : 'lost'}"><i>${ok ? '▲' : '✝'}</i>${nm(l)}${!ok && h ? ` <small>${h.status === 'Missing' ? 'missing' : h.status === 'Deceased' ? 'died out there' : 'lost'}</small>` : ''}</span>`; }).join('')}</div>${x.text ? `<p class="dc-t">${esc(x.text)}</p>` : ''}</div></details>`; };
  const first = X.length ? Math.min(...X.map(x => x.ed)) : null, older = Math.max(0, (T.exp || 0) - X.length - (E ? 1 : 0));
  return `<div class="dcp">${now}${plan}
    <div class="hcard dc-n4"><div><small>Expeditions on record</small><b>${X.length}</b></div><div><small>Hunters sent</small><b>${went}</b></div><div><small>Came home</small><b>${went ? Math.round(back / went * 100) + '%' : '—'}</b></div><div><small>Lost for good</small><b>${X.filter(x => !x.home.length).length}</b></div></div>
    ${strip}${X.length ? `<div class="section-h">The expeditions <small class="muted">${X.length}</small></div><div class="dc-xs">${(DC_ALL ? X : X.slice(0, 10)).map(row).join('')}</div>${X.length > 10 ? `<button type="button" class="btn small" data-dcall>${DC_ALL ? 'Show the latest 10' : `Show all ${X.length}`}</button>` : ''}` : '<p class="muted st-note">No expedition has come back since the records of expeditions began.</p>'}
    ${older ? `<p class="muted st-note">${older} earlier expedition${older === 1 ? '' : 's'}, before the ${first ? ordinal(first) : 'records'}, are only counted.</p>` : ''}</div>`;
}
