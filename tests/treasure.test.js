// The Treasure Hunt draws its clue trail: four steps at the end, the finders match the trial.
const assert = require('assert'), {openGame} = require('./lib');
(async () => {
  const {browser, page, errors} = await openGame({fast: false});
  const r = await page.evaluate(() => { const seen = [], bad = [];
    for(const k of ['treasure']){ let i = -1; for(let e = 401; e < 700 && i < 0; e++){ S = fresh(e); useLineup(S); i = PHASES.findIndex(p => p.id === k); } if(i < 0) continue;
      let g = 0; while(S.phase <= i && !S.finished && g++ < 40) runPhase(S); selPhase = i; render(); showTab('phase');
      const box = document.querySelector('[data-tt]'); if(!box){ bad.push(k + ': no trail'); continue; } trailDraw(box);
      const X = trailRun(i), cards = box.querySelectorAll('.tr-st').length, st = S.stats.find(s => s.p === i);
      if(cards < 4) bad.push(k + ': ' + cards + ' cards');
      if(X.after !== st.after) bad.push(k + ': finishers ' + X.after + ' vs ' + st.after);
      if(!/found a cache, /.test(box.querySelector('[data-tttake]').textContent)) bad.push(k + ': the end is not drawn at the last hour');
      seen.push(k); }
    return {seen, bad}; });
  await browser.close();
  assert.deepStrictEqual(errors, []); assert.deepStrictEqual(r.bad, []); assert.ok(r.seen.length >= 1, 'no treasure hunt found: ' + r.seen.join(', '));
  console.log(`treasure: ${r.seen.join(', ')} drawn`);
})().catch(e => { console.error(e.message); process.exit(1); });
