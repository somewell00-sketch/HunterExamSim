// Discoveries, crews, family feuds, Heaven's Arena and the year at a glance: made over the years, drawn where they belong.
const assert = require('assert'), {openGame, runExams} = require('./lib');
(async () => {
  const {browser, page, errors} = await openGame({fast: true});
  await runExams(page, 150);
  const r = await page.evaluate(() => { const bad = [], W = WORLD;
    render = window.__render; showTab = window.showTab || showTab;
    const D = W.disc || [], C = W.crews || [], F = W.feuds || [], A = W.arena;
    if(!D.length) bad.push('no discoveries'); if(!C.length) bad.push('no crews'); if(!A || A.fm.length !== 10) bad.push('arena');
    // no Hunter in two crews at once; no crew of one still together
    const on = C.filter(c => c.end == null), seen = new Set(); on.forEach(c => { if(c.m.length < 2) bad.push(c.name + ': alone'); c.m.forEach(l => { if(seen.has(l)) bad.push(l + ' in two crews'); seen.add(l); if(!hActive(hLic(l))) bad.push(c.name + ': a member not active'); }); });
    if(new Set(D.map(x => x.name)).size !== D.length) bad.push('a discovery twice');
    A.fm.forEach(s => { if(s.lic && !hActive(hLic(s.lic)) && s.since < S.edition) bad.push('a Floor Master gone'); });
    F.forEach(f => { if(f.a === f.b) bad.push('a family at odds with itself'); });
    ['herald', 'atlas', 'arena'].forEach(t => { wdTab = t; renderWorld(); const p = document.getElementById('pane-world').innerHTML; if(t === 'arena' && !/Floor Masters/.test(p)) bad.push('arena tab'); if(t === 'atlas' && !/Discoveries/.test(p)) bad.push('atlas: no discoveries'); });
    const g = BULLETINS.map(glanceHtml).filter(Boolean).length; if(!g) bad.push('no glance in any issue');
    const dh = hLic(D[D.length - 1].lic); if(dh){ openHunter(dh.license); if(!/Works/.test(document.querySelector('.sheet').innerHTML)) bad.push('no works on profile'); closeModal(); }
    const ch = hLic(on[0] ? on[0].m[0] : C[0].m[0]); if(ch){ openHunter(ch.license); if(!/data-hunter|⚑/.test(document.querySelector('.sheet').innerHTML) || !/Crews and families/.test(document.querySelector('.sheet').innerHTML)) bad.push('no crew on profile'); closeModal(); }
    ['disc', 'crews'].forEach(k => { openStAll(k); if(!document.querySelector('.sheet table')) bad.push('list ' + k); closeModal(); });
    const per = D.length / 150;
    return {bad, d: D.length, c: C.length, on: on.length, f: F.length, fm: A.fm.filter(s => s.lic).length, cl: A.cl.length, back: A.back || 0, per}; });
  await browser.close();
  assert.deepStrictEqual(errors, []); assert.deepStrictEqual(r.bad, []);
  assert.ok(r.per < 8, 'too many discoveries a year: ' + r.per);
  console.log(`world more: ${r.d} discoveries, ${r.c} crews (${r.on} together), ${r.f} feuds, ${r.fm} Hunter Floor Masters, ${r.cl} to the arena (${r.back} back at the exam)`);
})().catch(e => { console.error(e.message); process.exit(1); });
