// The Final plays at every size and in every case the engine produces: it opens on the draw, under the header, draws every step,
// and ends on the real number of new Hunters (or says nobody passed).
const assert = require('assert'), {openGame} = require('./lib');
(async () => {
  const {browser, page, errors} = await openGame({fast: false});
  const r = await page.evaluate(() => { const bad = [], C = {}; let seen = 0;
    const mk = j => j % 15 === 13 ? newState(50, 900, 12, null, {special: 'jubilee'}) : j % 15 === 14 ? newState(100, 900, 12, null, {special: 'centenary'}) : newState(5 + j, 200 + (j * 137) % 1100, 6 + (j % 3) * 6);
    for(let j = 0; j < 75; j++){ S = mk(j); useLineup(S); let g = 0; while(!S.finished && g++ < 90) runPhase(S);
      selPhase = PHASES.length - 1; render(); showTab('phase');
      const M = S.bracket ? bracketMatches().filter(m => !m.bye && m.a && m.b) : [], n = S.candidates.filter(c => c.status === 'Approved').length;
      M.forEach(m => { if(m.fatal) C.death = 1; if(m.how) C[m.how] = 1; if(/EX$/.test(m.id)) C.license = 1; }); if(S.bracket && S.bracket.prelim.length) C.prelim = 1; if(S.bracket && S.bracket.groups) C.jubilee = 1; if(S.bracket && !n) C.nobody = 1;
      const box = document.querySelector('#pane-phase>.rep-head+.tw-full [data-fp]');
      if(!box){ if(M.length) bad.push(j + ': no tournament under the header'); continue; }
      const rg = box.querySelector('[data-fph]'); if(+rg.value !== 0) bad.push(j + ': does not open on the draw');
      const X = fpRun(); if(X.M.length <= 12 && !X.blow) bad.push(j + ': a small final is not blow by blow');
      for(let k = 0; k <= +rg.max; k++){ rg.value = k; fpDraw(box); }
      const t = box.querySelector('[data-fptake]').textContent; if(!t.startsWith(n ? n + ' new Hunter' : 'No new Hunters')) bad.push(`${j}: ends on "${t}", not ${n}`);
      seen++; }
    return {bad, seen, C: Object.keys(C)}; });
  await browser.close();
  assert.deepStrictEqual(errors, []); assert.deepStrictEqual(r.bad, []); assert.ok(r.seen >= 60, 'only ' + r.seen);
  for(const k of ['death', 'prelim', 'jubilee', 'license', 'knockout', 'surrender']) assert.ok(r.C.includes(k), 'never met: ' + k);
  console.log(`final play: ${r.seen} tournaments (${r.C.join(', ')}), each ends on its new Hunters`);
})().catch(e => { console.error(e.message); process.exit(1); });
