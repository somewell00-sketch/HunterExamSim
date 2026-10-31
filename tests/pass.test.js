// The kitchen draws the path of every dish: served, the verdict, and the ravine for the rejected; the totals match the trials.
const assert = require('assert'), {openGame} = require('./lib');
(async () => {
  const {browser, page, errors} = await openGame({fast: false});
  const r = await page.evaluate(() => { const seen = [], bad = [];
    for(const k of ['cooking', 'banquet']){ let i = -1; for(let e = 401; e < 700 && i < 0; e++){ S = fresh(e); useLineup(S); i = PHASES.findIndex(p => p.id === k); } if(i < 0) continue;
      const egg = PHASES[i + 1] && PHASES[i + 1].id === 'egg'; let g = 0; while(S.phase <= i + (egg ? 1 : 0) && !S.finished && g++ < 40) runPhase(S);
      for(const sel of egg ? [i, i + 1] : [i]){ selPhase = sel; render(); showTab('phase'); const box = document.querySelector('[data-ps]'); if(!box){ bad.push(k + ': no pass on ' + sel); continue; } passDraw(box);
        const X = passRun(i), take = box.querySelector('[data-pstake]').textContent, after = S.stats.find(s => s.p === i + (egg ? 1 : 0)).after;
        if(!take.startsWith(String(after).replace(/\B(?=(\d{3})+(?!\d))/g, ','))) bad.push(k + ': ' + take + ' vs ' + after); }
      seen.push(k); }
    return {seen, bad}; });
  await browser.close();
  assert.deepStrictEqual(errors, []); assert.deepStrictEqual(r.bad, []); assert.ok(r.seen.includes('cooking'));
  console.log(`pass: ${r.seen.join(', ')} drawn, totals match`);
})().catch(e => { console.error(e.message); process.exit(1); });
