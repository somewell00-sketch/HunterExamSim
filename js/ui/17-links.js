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
  Object.assign(LKX, {k, map, re: names.length ? new RegExp('(^|[^\\p{L}])(' + names.join('|') + ')(?![\\p{L}])', 'gu') : null});
  return LKX;
}
const LK_SKIP = 'a,button,select,option,textarea,input,script,style,svg,h1,h2,label,summary,.tabs,nav,.stepper,.controls,.fch-nav,.sh-t,[data-noal],.lk-card,.fs-i,.tile,.sc-card,.sc-pick';
function lkLinkIn(root){
  if(!root || root.nodeType !== 1 || typeof S === 'undefined' || !S || !S.candidates || root.closest('[data-noal]')) return;
  const L = lkIndex(); if(!L.re) return;
  const self = (root.closest('.sheet') || root.querySelector?.('.sheet') || {}).getAttribute?.('aria-label') || '';
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode: n => n.nodeValue.length > 4 && /[A-Z]\S* [A-Z]/.test(n.nodeValue) && !(n.parentElement && n.parentElement.closest(LK_SKIP)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT});
  const todo = []; let n; while((n = tw.nextNode())) todo.push(n);
  todo.forEach(t => {
    const s = t.nodeValue; L.re.lastIndex = 0; if(!L.re.test(s)) return; L.re.lastIndex = 0;
    const frag = document.createDocumentFragment(); let at = 0, m, any = false;
    while((m = L.re.exec(s))){
      const name = m[2], st = m.index + m[1].length; if(name === self) continue;
      const [kind, id] = L.map.get(name); any = true;
      frag.append(s.slice(at, st)); const a = document.createElement('a'); a.setAttribute('data-' + kind, id); a.className = 'nl'; a.textContent = name; frag.append(a); at = st + name.length;
    }
    if(!any) return; frag.append(s.slice(at)); t.parentNode.replaceChild(frag, t);
  });
}
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
