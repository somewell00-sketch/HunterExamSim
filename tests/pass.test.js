// The kitchen draws the path of every dish: served, the verdict, and the ravine for the rejected; the totals match the trials.
const assert = require('assert'), {openGame} = require('./lib');
(async () => {
  const {browser, page, errors} = await openGame({fast: false});
  const r = await page.evaluate(() => { const seen = [], bad = [];
    for(const k of ['cooking', 'banquet']){ let i = -1, egg = false; for(let e = 401; e < 700 && i < 0; e++){ S = fresh(e); useLineup(S); i = PHASES.findIndex(p => p.id === k); if(i < 0) continue;
        egg = PHASES[i + 1] && PHASES[i + 1].id === 'egg'; let g = 0; while(S.phase <= i + (egg ? 1 : 0) && !S.finished && g++ < 40) runPhase(S); if(!S.stats.some(x => x.p === i + (egg ? 1 : 0))) i = -1; }   // an exam that ended before the kitchen does not count
      if(i < 0) continue;
      for(const sel of egg ? [i, i + 1] : [i]){ selPhase = sel; render(); showTab('phase'); const box = document.querySelector('[data-ps]'); if(!box){ bad.push(k + ': no pass on ' + sel); continue; } { const r0 = box.querySelector('input[type=range]'); if(+r0.value !== 0) bad.push('a drawing does not open at the start'); r0.value = r0.max; } passDraw(box);
        const X = passRun(i), take = box.querySelector('[data-pstake]').textContent, after = S.stats.find(s => s.p === i + (egg ? 1 : 0)).after;
        if(!take.startsWith(String(after).replace(/\B(?=(\d{3})+(?!\d))/g, ','))) bad.push(k + ': ' + take + ' vs ' + after); }
      if(egg){ // one step: the Egg Retrieval has no card of its own, the Cooking card counts both, one page and one pass
        const st = [...document.querySelectorAll('#stepper .step .n')].map(x => x.textContent); if(st.includes(PHASES[i + 1].name)) bad.push('egg has its own step');
        const card = document.querySelector(`#stepper .step[data-step="${i + 1}"]`); if(!card || !/Cooking/.test(card.textContent)) bad.push('cooking card does not stand for both');
        selPhase = i + 1; render(); if(document.querySelectorAll('[data-ps]').length !== 1) bad.push('the pass twice'); }
      seen.push(k); }
    // the Next button runs the Cooking Trial and the egg together
    for(let e = 401; e < 700; e++){ S = fresh(e); useLineup(S); const i = PHASES.findIndex(p => p.id === 'cooking'); if(i < 0 || !(PHASES[i + 1] && PHASES[i + 1].id === 'egg')) continue;
      let g = 0; while(S.phase < i && !S.finished && g++ < 40) runPhase(S); if(S.finished || S.phase !== i) continue;
      MENTOR.off = true; document.getElementById('bStep').onclick(); if(!S.finished && S.phase === i + 1) bad.push('the egg waited for a second click'); seen.push('one click'); break; }
    return {seen, bad}; });
  await browser.close();
  assert.deepStrictEqual(errors, []); assert.deepStrictEqual(r.bad, []); assert.ok(r.seen.includes('cooking'));
  console.log(`pass: ${r.seen.join(', ')} drawn, totals match`);
})().catch(e => { console.error(e.message); process.exit(1); });
