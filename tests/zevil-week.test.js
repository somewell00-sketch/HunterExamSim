// Zevil Island plays its week: replaying the moves part by part ends exactly on the recorded holdings of every day.
const assert = require('assert'), {openGame} = require('./lib');
(async () => {
  const {browser, page, errors} = await openGame({fast: false});
  const r = await page.evaluate(() => { const bad = []; let seen = 0;
    for(let e = 401; e < 430 && seen < 3; e++){ S = fresh(e); useLineup(S); const i = PHASES.findIndex(p => p.zevil); if(i < 0) continue;
      let g = 0; while(S.phase <= i && !S.finished && g++ < 60) runPhase(S); if(!S.zevil || S.zevil.days.length < 2) continue;
      selPhase = i; render(); showTab('phase'); const box = document.querySelector('[data-zw]'); if(!box){ bad.push(e + ': no week'); continue; } { const r0 = box.querySelector('input[type=range]'); if(+r0.value !== 0) bad.push('a drawing does not open at the start'); r0.value = r0.max; } zwDraw(box);
      const X = zwRun(i), norm = H => JSON.stringify(Object.fromEntries(Object.entries(H).map(([k, v]) => [k, v.slice().sort()]).filter(([k, v]) => v.length).sort()));
      for(let d = 1; d < X.Z.days.length; d++) if(norm(zwHold(X, d * 3)) !== norm(X.Z.days[d].hold)) bad.push(`${e}: day ${d} does not match`);
      if(!box.querySelectorAll('.zw-r').length) bad.push(e + ': no rows');
      if(!new RegExp(`^${X.after} left`).test(box.querySelector('[data-zwtake]').textContent)) bad.push(e + ': end ' + box.querySelector('[data-zwtake]').textContent);
      // a day tab above keeps the week where it was
      const r = box.querySelector('[data-zwh]'); r.value = 7; zwDraw(box); document.querySelector('.zd[data-zday="2"]').click();
      const b2 = document.querySelector('[data-zw]'); if(+b2.querySelector('[data-zwh]').value !== 7) bad.push(e + ': the day tab rewound the week');
      ZW_POS = null; seen++; }
    return {bad, seen}; });
  await browser.close();
  assert.deepStrictEqual(errors, []); assert.deepStrictEqual(r.bad, []); assert.ok(r.seen >= 1, 'no Zevil Island found');
  console.log(`zevil week: ${r.seen} islands replayed, every day matches`);
})().catch(e => { console.error(e.message); process.exit(1); });
