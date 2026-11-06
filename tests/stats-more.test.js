// The new Statistics blocks, the full lists behind them, the Dark Continent page and the direct line of a family.
const assert = require('assert'), {openGame, runExams} = require('./lib');
(async () => {
  const {browser, page, errors} = await openGame({fast: true});
  await runExams(page, 80);
  const r = await page.evaluate(() => { const bad = [];
    const st = statsHtml(); ['Still active 30 years on', 'In the chair, by specialty', 'Longest in the chair', 'Hunter families'].forEach(t => { if(!st.includes(t)) bad.push('stats: no ' + t); });
    if(HUNTERS.some(h => h.se && h.se.some((e, k) => e != null && (e < h.edition || (k && h.se[k - 1] != null && e < h.se[k - 1]))))) bad.push('a star before the license or before the one below it');
    Object.keys(SA_DEF).forEach(k => { openStAll(k); const sh = document.querySelector('.sheet'); if(!sh || !sh.querySelector('table')) bad.push('list ' + k); });
    // every expedition that came back is on record, its members split between home and lost
    const X = WORLD.expHist || []; X.forEach(x => { if(x.home.length + x.lost.length > x.members.length + 1) bad.push(x.id + ': counts'); if(x.back < x.ed) bad.push(x.id + ': dates'); });
    if((WORLD.tally || {}).exp > 1 && !X.length) bad.push('no expedition recorded');
    const dc = dcPageHtml(); if(!/Expeditions on record/.test(dc)) bad.push('dc page');
    const h = HUNTERS.find(x => (x.heirOf || x.hParent) && famSize(x.license) >= 3);
    if(h){ FT_VIEW = 'C'; openTree(h.license); const c = document.querySelectorAll('#ftC [data-ftd]'); if(!c.length) bad.push('direct line empty'); else { const other = [...c].find(n => n.dataset.ftd !== h.license); if(other){ other.click(); if(!document.querySelector(`#ftC .sel[data-ftd="${other.dataset.ftd}"]`)) bad.push('direct line does not recentre'); } } FT_VIEW = 'A'; }
    closeModal(); return {bad, exp: X.length}; });
  await browser.close();
  assert.deepStrictEqual(errors, []); assert.deepStrictEqual(r.bad, []);
  console.log(`stats & lists: new blocks drawn, every list opens, ${r.exp} expeditions on record, direct line recentres`);
})().catch(e => { console.error(e.message); process.exit(1); });
