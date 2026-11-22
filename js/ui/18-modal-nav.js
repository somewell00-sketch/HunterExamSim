/* ---------- going back between pages: a page opened from inside another page offers "‹ Back" to the one before ---------- */
// Each page (Hunter, family tree, school, relic, list…) is opened by a function; the ones opened from an open page are
// remembered in order, and Back opens the previous one again as it was asked for. Closing forgets the trail.
const MH = {stack: [], cur: null, back: false};
const MH_FN = ['openHunter', 'openProfile', 'openTree', 'openYear', 'openStAll', 'openSchool', 'openRelic', 'openGang', 'openOutlaw', 'openArchive', 'openPeople', 'mtPastProfile'];
MH_FN.forEach(name => { const f = window[name]; if(typeof f !== 'function') return;
  window[name] = function(...a){
    const same = MH.cur && MH.cur.name === name && JSON.stringify(MH.cur.a) === JSON.stringify(a);
    if(!MH.back && !same){ if($('modal').hidden) MH.stack = []; else if(MH.cur) MH.stack.push(MH.cur); if(MH.stack.length > 30) MH.stack.shift(); }
    MH.cur = {name, a}; MH.back = false;
    return f.apply(this, a); }; });
const _showModal = showModal;
// one bar on top of every page: Back on the left (when there is somewhere to go back to), Close on the right.
// The page's own buttons (Favorite, the register, …) stay in its header; the bar stays put while the page scrolls.
showModal = function(html){ _showModal(html);
  const sh = $('modal').querySelector('.sheet'), c = $('mClose'); if(!sh || !c) return;
  const nav = document.createElement('div'); nav.className = 'mnav';
  const own = $('mBack');   // the participants grid has its own way back: it moves into the bar
  if(own){ own.classList.add('mnav-b'); nav.appendChild(own); }
  else if(MH.stack.length){ const b = document.createElement('button'); b.type = 'button'; b.className = 'mnav-b'; b.id = 'mHBack'; b.textContent = '‹ Back'; b.title = 'Back to the page before';
    b.onclick = () => { const p = MH.stack.pop(); if(!p) return; MH.back = true; window[p.name](...p.a); }; nav.appendChild(b); }
  else nav.appendChild(document.createElement('span'));
  const x = document.createElement('button'); x.type = 'button'; x.className = 'mnav-x'; x.textContent = 'Close ✕'; x.setAttribute('aria-label', 'Close'); x.onclick = closeModal; nav.appendChild(x);
  c.hidden = true; c.style.display = 'none'; const box = c.parentNode; if(box && box !== sh && box.id !== 'modal' && ![...box.children].some(e => e !== c)) box.style.display = 'none';
  sh.insertBefore(nav, sh.firstChild); x.focus({preventScroll: true}); };
const _closeModal = closeModal;
closeModal = function(){ _closeModal(); MH.stack = []; MH.cur = null; };
