// The themed trials and the Centennial draw: each opens at the start, its numbers match the trial, and every way out is counted once.
const assert = require('assert'), {openGame} = require('./lib');
(async () => {
  const {browser, page, errors} = await openGame({fast: false});
  const r = await page.evaluate(() => { const seen = [], bad = [], OF = Object.fromEntries(Object.entries(THEME_TRIAL).map(([t, id]) => [id, t]));
    for(const k of ['ridge', 'feeding', 'centennial', 'mute', 'dice', 'hall', 'mirror', 'blankmap', 'pit', 'pairs']){
      let N = null; for(let t = 0; t < 80 && !N; t++){ const n = k === 'centennial' ? newState(100, 500, 12, null, {special: 'centenary'}) : newState(5, 500, 12, null, {theme: OF[k]}); if(n.phaseSpec.some(x => x.id === k)) N = n; }
      if(!N){ bad.push(k + ': never drawn'); continue; } S = N; useLineup(S); const i = PHASES.findIndex(p => p.id === k);
      let g = 0; while(S.phase <= i && !S.finished && g++ < 60) runPhase(S); selPhase = i; render(); showTab('phase');
      const tw = document.querySelector('#pane-phase>.rep-head+.tw-full'); if(!tw){ bad.push(k + ': no drawing under the header'); continue; }
      const rg = tw.querySelector('input[type=range]'); if(+rg.value !== 0) bad.push(k + ': does not open at the start');
      rg.value = rg.max; rg.dispatchEvent(new Event('input', {bubbles: true}));
      const st = S.stats.find(s => s.p === i), take = (tw.querySelector('.tv-take') || {}).textContent || '';
      if(!take.includes(String(st.after).replace(/\B(?=(\d{3})+(?!\d))/g, ',')) && !(k === 'pairs')) bad.push(`${k}: the end does not say ${st.after} (${take})`);
      if(PREL[k]){ const X = prelRun(i), outs = X.cards.filter(c => !c.ok).reduce((a, c) => a + c.n, 0); if(outs + X.after !== X.n) bad.push(`${k}: cards add to ${outs + X.after} of ${X.n}`);
        if(X.K.ride && tw.querySelector('.hb-card.still')) bad.push(k + ': two cards for one state'); }
      seen.push(k); }
    return {seen, bad}; });
  await browser.close();
  assert.deepStrictEqual(errors, []); assert.deepStrictEqual(r.bad, []); assert.strictEqual(r.seen.length, 10);
  console.log(`themed drawings: ${r.seen.join(', ')}`);
})().catch(e => { console.error(e.message); process.exit(1); });
