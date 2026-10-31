// Endurance trials draw their course: one row per stretch, the examiner's pace, the people we follow, the events on the way.
const assert = require('assert'), {openGame} = require('./lib');
(async () => {
  const {browser, page, errors} = await openGame({fast: false});
  const r = await page.evaluate(() => { const seen = [], bad = [];
    for(const k of ['marathon', 'stairs', 'desert', 'mountain', 'cliffpath']){ let i = -1; for(let e = 401; e < 700 && i < 0; e++){ S = fresh(e); useLineup(S); i = PHASES.findIndex(p => p.id === k); } if(i < 0) continue;
      let g = 0; while(S.phase <= i && !S.finished && g++ < 40) runPhase(S); selPhase = i; render(); showTab('phase');
      const box = document.querySelector('[data-rc]'); if(!box){ bad.push(k + ': no course'); continue; } raceDraw(box);
      const K = RACE[k], X = raceRun(i), rows = box.querySelectorAll('.rc-cp').length, st = S.stats.find(s => s.p === i);
      if(rows !== Math.round(K.len / K.step) + 1) bad.push(k + ': ' + rows + ' rows');
      if(X.after !== st.after) bad.push(k + ': finishers ' + X.after + ' vs ' + st.after);
      if(!/made it/.test(box.querySelector('[data-rctake]').textContent)) bad.push(k + ': the end is not drawn at the last hour');
      seen.push(k); }
    return {seen, bad}; });
  await browser.close();
  assert.deepStrictEqual(errors, []); assert.deepStrictEqual(r.bad, []); assert.ok(r.seen.length >= 3, 'too few endurance trials found: ' + r.seen.join(', '));
  console.log(`race: ${r.seen.join(', ')} drawn`);
})().catch(e => { console.error(e.message); process.exit(1); });
