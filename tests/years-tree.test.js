// Each year keeps its rankings and council; the year page, the Rankings block and the family tree draw from them.
const assert = require('assert'), {openGame, runExams} = require('./lib');
(async () => {
  const {browser, page, errors} = await openGame({fast: true});
  await runExams(page, 60);
  const r = await page.evaluate(() => { const bad = [], Y = WORLD.yrs || {}, eds = Object.keys(Y).map(Number);
    if(eds.length < 55) bad.push('years kept: ' + eds.length);
    eds.forEach(e => { const y = yrGet(e); if(y.top.length > 10 || y.rise.length > 5 || y.top.some(l => y.rise.includes(l))) bad.push(e + ': lists'); if(!y.zod || Object.keys(y.zod).length !== 12) bad.push(e + ': council'); });
    // the council a year leaves is the one the next year starts with
    const last = Math.max(...eds), cur = yrGet(last); if(cur.chair !== ((WORLD.chair && WORLD.chair.lic) || '')) bad.push('chair of the last year');
    const ranked = HUNTERS.find(h => eds.some(e => yrGet(e).top.includes(h.license)));
    if(!ranked || !/Rankings/.test(rankingsHtml(ranked))) bad.push('rankings block');
    HISTORY.slice(-5).forEach(x => { openYear(x.edition); const sh = document.querySelector('.sheet'); if(!sh || !/Hunter Exam/.test(sh.textContent)) bad.push(x.edition + ': year page'); });
    // a tree for every family with three or more in its line: each person once, parents above their children
    const G = famGraph(); let trees = 0;
    HUNTERS.filter(h => (h.heirOf || h.hParent || h.grandOf)).slice(0, 25).forEach(h => { const F = famOf(h.license, G); if(F.blood.size < 3) return; openTree(h.license); trees++;
      const ids = [...document.querySelectorAll('#ftA [data-ftp]')].map(n => n.dataset.ftp); if(new Set(ids).size !== ids.length) bad.push('twice in a tree: ' + h.name);
      if(ids.length !== F.ids.size) bad.push(`tree of ${h.name}: ${ids.length} cards for ${F.ids.size} people`); });
    if(!trees) bad.push('no tree drawn');
    closeModal(); return {bad: bad.slice(0, 12), years: eds.length, trees, kb: Math.round(JSON.stringify(Y).length / 1024)}; });
  await browser.close();
  assert.deepStrictEqual(errors, []); assert.deepStrictEqual(r.bad, []);
  console.log(`years & trees: ${r.years} years kept (${r.kb} KB), ${r.trees} trees drawn`);
})().catch(e => { console.error(e.message); process.exit(1); });
