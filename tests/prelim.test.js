// The preliminaries draw: the voyage, the night line, the old woman's question and the two forks. Totals match the trial,
// every way out is a real cause, and a journey ends in two states only.
const assert = require('assert'), {openGame} = require('./lib');
(async () => {
  const {browser, page, errors} = await openGame({fast: false});
  const r = await page.evaluate(() => { const seen = [], bad = [];
    for(const k of ['sea', 'quiz', 'disguise', 'nighttrain']){ let i = -1; for(let e = 401; e < 700 && i < 0; e++){ S = fresh(e); useLineup(S); i = PHASES.findIndex(p => p.id === k); } if(i < 0) continue;
      let g = 0; while(S.phase <= i && !S.finished && g++ < 40) runPhase(S); selPhase = i; render(); showTab('phase');
      const box = document.querySelector('[data-pv]'); if(!box){ bad.push(k + ': no drawing'); continue; } { const r0 = box.querySelector('input[type=range]'); if(+r0.value !== 0) bad.push('a drawing does not open at the start'); r0.value = r0.max; } prelDraw(box);
      const X = prelRun(i), st = S.stats.find(s => s.p === i), nums = [...box.querySelectorAll('.hb-card>b')].map(b => +b.textContent.replace(/,/g, ''));
      if(X.after !== st.after) bad.push(`${k}: through ${X.after} vs ${st.after}`);
      if(X.n !== st.before) bad.push(`${k}: ${X.n} took part vs ${st.before}`);
      const outs = X.cards.filter(c => !c.ok).reduce((a, c) => a + c.n, 0); if(outs + X.after !== X.n) bad.push(`${k}: cards add to ${outs + X.after} of ${X.n}`);
      if(X.K.ride){ if(box.querySelectorAll('.hb-card.ok').length !== 1 || box.querySelector('.hb-card.still')) bad.push(k + ': a journey ends in two states'); if(nums[0] !== st.after) bad.push(`${k}: arrived card ${nums[0]}`); }
      if(!/\d/.test(box.querySelector('[data-pvtake]').textContent)) bad.push(k + ': no take');
      // halfway through, some are still on the way
      const r = box.querySelector('[data-pvh]'); r.value = 90; prelDraw(box); if(!/still|aboard|on the train|in line|forest/.test(box.querySelector('[data-pvtake]').textContent)) bad.push(k + ': halfway is not drawn');
      seen.push(k); }
    return {seen, bad}; });
  await browser.close();
  assert.deepStrictEqual(errors, []); assert.deepStrictEqual(r.bad, []); assert.ok(r.seen.length === 4, 'missing: ' + r.seen.join(', '));
  console.log(`prelim: ${r.seen.join(', ')} drawn`);
})().catch(e => { console.error(e.message); process.exit(1); });
