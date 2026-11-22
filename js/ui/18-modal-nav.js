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
showModal = function(html){ _showModal(html);
  const c = $('mClose'); if(!c || !MH.stack.length || $('mBack')) return;   // the participants grid keeps its own way back
  const b = document.createElement('button'); b.className = 'btn'; b.id = 'mHBack'; b.type = 'button'; b.textContent = '‹ Back'; b.title = 'Back to the page before';
  b.onclick = () => { const p = MH.stack.pop(); if(!p) return; MH.back = true; window[p.name](...p.a); };
  c.parentNode.insertBefore(b, c); };
const _closeModal = closeModal;
closeModal = function(){ _closeModal(); MH.stack = []; MH.cur = null; };
