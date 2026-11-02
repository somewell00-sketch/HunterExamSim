/* ===================== NAMES ARE LINKS: everywhere a person is named, the name opens their page ===================== */
// Text is linked after it is drawn: any full name of a candidate in this exam, a Hunter on the register or an outlaw
// becomes a quiet link (a fine dotted underline). Hovering one shows who it is; the first profile opened says so once.
const LKX = {k: null, re: null, map: null};
function lkIndex(){
  const W = WORLD.wanted || [], k = S.edition + ':' + S.candidates.length + ':' + HUNTERS.length + ':' + W.length;
  if(LKX.k === k) return LKX;
  const map = new Map();
  // outlaws first, then Hunters, then this exam's candidates: the later one wins a shared name, so the person in front of you comes first
  W.forEach(w => { if(w.name && w.name.includes(' ')) map.set(w.name, ['outlaw', w.id]); });
  HUNTERS.forEach(h => { if(h.name && h.name.includes(' ')) map.set(h.name, ['hunter', h.license]); });
  S.candidates.forEach(c => { if(c.name && c.name.includes(' ')) map.set(c.name, ['id', c.id]); });
  const names = [...map.keys()].sort((a, b) => b.length - a.length).map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const fi = new Map(); map.forEach((v, n) => { const f = n.split(' ')[0]; if(!fi.has(f)) fi.set(f, []); fi.get(f).push([n, v[1]]); });
  Object.assign(LKX, {k, map, fi, re: names.length ? new RegExp('(^|[^\\p{L}])(' + names.join('|') + ')(?![\\p{L}])', 'gu') : null});
  return LKX;
}
const LK_SKIP = 'a,button,select,option,textarea,input,script,style,svg,h1,h2,label,summary,.tabs,nav,.stepper,.controls,.fch-nav,.sh-t,[data-noal],.lk-card,.fs-i,.tile,.sc-card,.sc-pick,.tech';
function lkLinkIn(root){
  if(!root || root.nodeType !== 1 || typeof S === 'undefined' || !S || !S.candidates || root.closest('[data-noal]')) return;
  const L = lkIndex(); if(!L.map.size) return;
  const self = (root.closest('.sheet') || root.querySelector?.('.sheet') || {}).getAttribute?.('aria-label') || '';
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode: n => n.nodeValue.length > 4 && /[A-Z]\S* [A-Z]/.test(n.nodeValue) && !(n.parentElement && n.parentElement.closest(LK_SKIP)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT});
  const todo = []; let n; while((n = tw.nextNode())) todo.push(n);
  todo.forEach(t => {
    const s = t.nodeValue, hits = lkScan(s, L.map); if(!hits.length) return;
    const frag = document.createDocumentFragment(); let at = 0, any = false;
    for(const [st, name] of hits){
      if(name === self) continue;
      const [kind, id] = L.map.get(name); any = true;
      frag.append(s.slice(at, st)); const a = document.createElement('a'); a.setAttribute('data-' + kind, id); a.className = 'nl'; a.textContent = name; frag.append(a); at = st + name.length;
    }
    if(!any) return; frag.append(s.slice(at)); t.parentNode.replaceChild(frag, t);
  });
  lkFirstIn(root, self);
}
// a first name on its own ("Cleo looks back") is linked when the same scene or paragraph already names that person in full,
// and nobody else there shares the first name. A missing link is better than the wrong one.
const LK_BLOCK = 'li,td,p,blockquote,.story-p,.hb-card,.tr-st,.tl-b,.rc-tick';
// who a link points to, by its id: looked up in maps built once per world, not by walking every list for every link
const LKW = {k: null};
function lkWho(a){
  const k = LKX.k; if(LKW.k !== k){ LKW.k = k; LKW.c = new Map(S.candidates.map(c => [c.id, c])); LKW.h = new Map(HUNTERS.map(h => [String(h.license), h])); LKW.w = new Map((WORLD.wanted || []).map(w => [String(w.id), w])); }
  if(a.dataset.id){ const c = LKW.c.get(a.dataset.id); return c && ['id', c.id, c.name, lkFirst(c)]; }
  if(a.dataset.hunter){ const h = LKW.h.get(a.dataset.hunter); return h && ['hunter', h.license, h.name, h.name.split(' ')[0]]; }
  if(a.dataset.outlaw){ const w = LKW.w.get(a.dataset.outlaw); return w && ['outlaw', w.id, w.name, w.name.split(' ')[0]]; }
}
function lkFirstIn(root, self){
  lkIndex(); const selfF = self ? self.split(' ')[0] : '', B = new Map();
  const ctx = el => { const b = el.closest('.wt-scene') || el.closest(LK_BLOCK) || el.parentElement; if(B.has(b)) return B.get(b);
    const by = {}, bad = new Set(selfF ? [selfF] : []);
    b.querySelectorAll('a[data-id],a[data-hunter],a[data-outlaw]').forEach(a => { const w = lkWho(a); if(!w || !w[2].includes(' ') || w[3].length < 2 || LK_WORDY.has(w[3])) return;
      if(by[w[3]] && by[w[3]][1] !== w[1]) bad.add(w[3]); else by[w[3]] = w; });
    // a full name in plain text (not linked, e.g. the profile's own person) also claims its first name
    const txt = b.textContent, FI = lkIndex().fi; Object.keys(by).forEach(f => { if((FI.get(f) || []).some(([n, id]) => id !== by[f][1] && txt.includes(n))) bad.add(f); });
    bad.forEach(f => delete by[f]);
    const ks = Object.keys(by).sort((x, y) => y.length - x.length).map(f => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const r = {by, re: ks.length ? new RegExp('(^|[^\\p{L}])(' + ks.join('|') + ')(?![\\p{L}])', 'gu') : null}; B.set(b, r); return r; };
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode: n => n.nodeValue.length > 1 && /[A-Z]/.test(n.nodeValue) && n.parentElement && !n.parentElement.closest(LK_SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT});
  const todo = []; let n; while((n = tw.nextNode())) todo.push(n);
  todo.forEach(t => { const X = ctx(t.parentElement); if(!X.re) return; const s = t.nodeValue; X.re.lastIndex = 0; if(!X.re.test(s)) return; X.re.lastIndex = 0;
    const frag = document.createDocumentFragment(); let at = 0, m;
    while((m = X.re.exec(s))){ const f = m[2], st = m.index + m[1].length, w = X.by[f];
      frag.append(s.slice(at, st)); const a = document.createElement('a'); a.setAttribute('data-' + w[0], w[1]); a.className = 'nl'; a.textContent = f; frag.append(a); at = st + f.length; }
    if(!at) return; frag.append(s.slice(at)); t.parentNode.replaceChild(frag, t); });
}
// full names in a piece of text: runs of capitalised words, looked up two and three words at a time (longest first).
// A hash lookup per word instead of one huge pattern of every name: the cost follows the text, not the size of the world.
const LK_RUN = /(?<![\p{L}-])\p{Lu}[\p{L}-]*(?: \p{Lu}[\p{L}-]*)+(?![\p{L}-])/gu;
function lkScan(s, map){
  const out = []; LK_RUN.lastIndex = 0; let m;
  while((m = LK_RUN.exec(s))){ const W = m[0].split(' '), pos = []; let o = m.index; W.forEach(w => { pos.push(o); o += w.length + 1; });
    for(let k = 0; k < W.length - 1;){ const n3 = k + 2 < W.length ? W.slice(k, k + 3).join(' ') : null, n2 = W.slice(k, k + 2).join(' ');
      if(n3 && map.has(n3)){ out.push([pos[k], n3]); k += 3; } else if(map.has(n2)){ out.push([pos[k], n2]); k += 2; } else k++; } }
  return out; }
// run on whatever the page draws, a frame later
const LK_Q = new Set(); let LK_T = 0;
const lkObs = new MutationObserver(ms => { ms.forEach(m => m.addedNodes.forEach(x => { if(x.nodeType === 1) LK_Q.add(x); else if(x.nodeType === 3 && x.parentElement) LK_Q.add(x.parentElement); })); if(!LK_T) LK_T = requestAnimationFrame(() => { LK_T = 0; const q = [...LK_Q]; LK_Q.clear(); lkObs.disconnect(); try { q.forEach(el => { if(el.isConnected) lkLinkIn(el); }); } catch(e){ console.error(e); } lkObs.observe(document.body, {childList: true, subtree: true}); lkHint(); }); });
lkObs.observe(document.body, {childList: true, subtree: true});

/* ---------- who is this: a small card on hover (pointer devices only) ---------- */
let LKC = null, LKT = 0;
function lkCardFor(a){
  const esc2 = esc, line = (...p) => p.filter(Boolean).join(' · ');
  if(a.dataset.hunter){ const h = hLic(a.dataset.hunter); if(!h) return '';
    return `<b>${esc2(h.name)}</b>${h.nick ? ` <i>“${esc2(h.nick)}”</i>` : ''}<small>${esc2(line(h.status === 'Active Hunter' ? null : h.status, h.career, hStars(h) ? starStr(hStars(h)) : null, `${h.status === 'Deceased' ? 'died at ' : ''}${hunterAge(h)}`))}</small>`; }
  if(a.dataset.id){ const c = S.candidates.find(x => x.id === a.dataset.id); if(!c) return '';
    return `<b>${esc2(c.name)}</b>${c.nick ? ` <i>“${esc2(c.nick)}”</i>` : ''}<small>${esc2(line(c.status === 'Approved' ? 'Hunter' : c.status === 'Active' ? 'In the exam' : c.status, c.age, c.trait ? traitNoun(c.trait) : null, attemptsOf(c) > 1 ? 'attempt ' + attemptsOf(c) : null))}</small>`; }
  if(a.dataset.outlaw){ const w = (WORLD.wanted || []).find(x => String(x.id) === a.dataset.outlaw); if(!w) return '';
    return `<b>${esc2(w.name)}</b><small>${esc2(line('Blacklist', w.status && w.status !== 'wanted' ? w.status : 'wanted'))}</small>`; }
  return '';
}
const lkHover = typeof matchMedia === 'function' && matchMedia('(hover: hover)').matches;
document.addEventListener('mouseover', e => {
  if(!lkHover) return; const a = e.target.closest && e.target.closest('a[data-hunter],a[data-id],a[data-outlaw]'); if(!a) return;
  clearTimeout(LKT); LKT = setTimeout(() => { const html = lkCardFor(a); if(!html) return;
    if(!LKC){ LKC = document.createElement('div'); LKC.className = 'lk-card'; LKC.setAttribute('role', 'tooltip'); document.body.append(LKC); }
    LKC.innerHTML = html + '<em>Open profile</em>'; const r = a.getBoundingClientRect(); LKC.style.left = Math.min(innerWidth - 260, Math.max(8, r.left)) + 'px'; LKC.style.top = (r.bottom + 6 + scrollY) + 'px'; LKC.hidden = false; }, 380);
});
document.addEventListener('mouseout', e => { if(e.target.closest && e.target.closest('a[data-hunter],a[data-id],a[data-outlaw]')){ clearTimeout(LKT); if(LKC) LKC.hidden = true; } });
['scroll', 'click', 'keydown'].forEach(ev => addEventListener(ev, () => { clearTimeout(LKT); if(LKC) LKC.hidden = true; }, true));

/* ---------- said once: names open their page ---------- */
function lkHint(){
  let seen = false; try { seen = localStorage.getItem('hx-namehint') === '1'; } catch(e){}
  if(seen) return; const m = $('modal'); if(!m || m.hidden || !m.querySelector('a.nl,a[data-hunter],a[data-id]')) return;
  try { localStorage.setItem('hx-namehint', '1'); } catch(e){}
  const t = document.createElement('div'); t.className = 'nl-hint'; t.textContent = 'Tip: names with a dotted underline open that person’s page.'; document.body.append(t);
  setTimeout(() => t.classList.add('out'), 4200); setTimeout(() => t.remove(), 5000);
}
