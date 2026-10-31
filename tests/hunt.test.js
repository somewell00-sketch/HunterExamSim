// Hunts draw their board: one card for the way through and one for each way the trial took people out, filled hour by hour.
const assert = require('assert'), {openGame} = require('./lib');
(async () => {
  const {browser, page, errors} = await openGame({fast: false});
  const r = await page.evaluate(() => { const seen = [], bad = [];
    for(const k of ['capture', 'beast', 'wetlands', 'nighthunt']){ let i = -1; for(let e = 401; e < 700 && i < 0; e++){ S = fresh(e); useLineup(S); i = PHASES.findIndex(p => p.id === k); } if(i < 0) continue;
      let g = 0; while(S.phase <= i && !S.finished && g++ < 40) runPhase(S); selPhase = i; render(); showTab('phase');
      const box = document.querySelector('[data-hu]'); if(!box){ bad.push(k + ': no board'); continue; } huntDraw(box);
      const X = huntRun(i), cards = box.querySelectorAll('.hb-card').length, st = S.stats.find(s => s.p === i);
      if(cards < 3) bad.push(k + ': ' + cards + ' cards');
      if(X.after !== st.after) bad.push(k + ': finishers ' + X.after + ' vs ' + st.after);
      if(!/through/.test(box.querySelector('[data-hutake]').textContent)) bad.push(k + ': the end is not drawn at the last hour');
      seen.push(k); }
    return {seen, bad}; });
  await browser.close();
  assert.deepStrictEqual(errors, []); assert.deepStrictEqual(r.bad, []); assert.ok(r.seen.length >= 3, 'too few hunts found: ' + r.seen.join(', '));
  console.log(`hunt: ${r.seen.join(', ')} drawn`);
})().catch(e => { console.error(e.message); process.exit(1); });
