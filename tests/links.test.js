// Names are links: first names are linked when it is clear who they are, and a link never points to someone with another first name.
const assert = require('assert'), {openGame} = require('./lib');
(async () => {
  const {browser, page, errors} = await openGame({fast: false});
  const r = await page.evaluate(async () => { const bad = [], seen = {full: 0, first: 0}, eg = [];
    const t0 = performance.now(); let g = 0; while(!S.finished && g++ < 60) runPhase(S);
    // a line with ids: every first name of those people is linked, not just the first time
    const c = S.candidates.find(x => x.name.includes(' ') && !LK_WORDY.has(lkFirst(x))), F = lkFirst(c);
    const h = linkNames(`${c.name} stops. ${F} looks back, and ${F} goes on.`, [c.id]);
    if((h.match(/<a data-id/g) || []).length !== 3) bad.push('event line: ' + h);
    const twin = S.candidates.find(x => x !== c && lkFirst(x) === F);
    if(twin && (linkNames(`${F} and ${F}`, [c.id, twin.id]).match(/<a/g) || []).length) bad.push('twins linked');
    let ms = 0;
    for(let i = 0; i < PHASES.length; i++){ selPhase = i; render(); showTab('phase'); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const t = performance.now(); lkLinkIn(document.body); ms = Math.max(ms, performance.now() - t);
      document.querySelectorAll('a.nl,a[data-id]').forEach(a => { const w = lkWho(a); if(!w) return; const txt = a.textContent.replace(/^[✓✕] /, '').trim();
        if(txt === w[2]) seen.full++; else if(txt === w[3]){ seen.first++; if(eg.length < 4 && a.closest('p,li')) eg.push(a.closest('p,li').textContent.slice(0, 120)); }
        else if(/^[A-Z][\p{L}'-]+$/u.test(txt) && txt !== w[3] && !(a.closest('.rc-tk,.tile,.chip,.vx-g'))) bad.push(`"${txt}" points to ${w[2]}`); }); }
    return {bad: [...new Set(bad)].slice(0, 10), seen, eg, ms: Math.round(ms)}; });
  await browser.close();
  assert.deepStrictEqual(errors, []); assert.deepStrictEqual(r.bad, []); assert.ok(r.seen.first > 0, 'no first names linked');
  console.log(`links: ${r.seen.full} full names, ${r.seen.first} first names linked, slowest pass ${r.ms} ms`); r.eg.forEach(x => console.log('  · ' + x));
})().catch(e => { console.error(e.message); process.exit(1); });
