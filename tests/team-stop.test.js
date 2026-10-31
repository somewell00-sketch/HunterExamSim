// A team trial and its duels run as one: the duels happen halfway down, on the same 72-hour clock, and the page tells
// both halves as one chapter. Checks the bookkeeping, the pass rate, and that each setting draws its page.
const assert = require('assert'), {openGame} = require('./lib');
(async () => {
  const {browser, page, errors} = await openGame({fast: false});
  const r = await page.evaluate(() => {
    const PAIR = {tower: 'prisoner', maze: 'guardians', raft: 'bandits'}, seen = {}, bad = []; let entered = 0, through = 0;
    for(let ed = 401; ed < 520 && Object.keys(seen).length < 3 || ed < 440; ed++){
      S = fresh(ed); useLineup(S); const a = PHASES.findIndex((p, i) => PAIR[p.id] && PHASES[i + 1] && PHASES[i + 1].id === PAIR[p.id]); if(a < 0) continue;
      let g = 0; while(S.phase <= a + 1 && !S.finished && g++ < 40) runPhase(S);
      const R = S.teamRun && S.teamRun[a]; if(!R) continue; const cm = cmap(S), st = S.stats.find(s => s.p === a + 1);
      if(R.merged !== a + 1 || R.done !== a + 1) bad.push(ed + ': not merged');
      if(!/\(the /.test(PHASES[a + 1].name)) bad.push(ed + ': second half not named after the first');
      R.teams.forEach(t => {
        if(!t.ok){ if(t.end > 2) bad.push(ed + ': a team stuck below the stop'); return; }
        const M = t.ids.map(id => cm[id]).filter(c => c && (c.out == null || c.out >= a + 1)); if(!M.length) return;
        if(!t.res) bad.push(ed + ': a team without a result');
        if(t.route === 'vote' && t.w + t.l !== t.bouts.length) bad.push(ed + ': bouts and score disagree');
        if(t.route === 'vote' && t.w === t.l) bad.push(ed + ': a tie was left standing');
        M.forEach(c => { const live = c.status === 'Active' || c.status === 'Approved' || c.status === 'Finalist';
          if(t.res === 'out' && !live && /the team/.test(c.reason || '')) bad.push(ed + ': ' + c.name + ' made it but is out');
          if(t.res !== 'out' && live) bad.push(ed + ': ' + c.name + ' is still in after the team fell'); });
      });
      entered += st.before; through += st.after;
      if(!seen[R.k]){ seen[R.k] = 1; selPhase = a + 1; render(); showTab('phase');
        const pane = document.getElementById('pane-phase'); pane.querySelectorAll('[data-tv]').forEach(b => tvDraw(b));
        if(pane.querySelectorAll('.tw-act').length !== 3) bad.push(R.k + ': the chapter has no three movements');
        if(!pane.querySelector('.tw-ur:not(.hd)')) bad.push(R.k + ': no team rows');
        if(pane.querySelectorAll('.tv-fl').length !== 8) bad.push(R.k + ': the view has no stop level');
        if([...document.querySelectorAll('#stepper .step')].some(b => +b.dataset.step === a && PHASES[a + 1])) bad.push(R.k + ': the stepper still shows two steps'); }
    }
    return {bad: bad.slice(0, 8), rate: through / entered, kinds: Object.keys(seen).sort()};
  });
  await browser.close();
  assert.deepStrictEqual(errors, []); assert.deepStrictEqual(r.bad, []); assert.deepStrictEqual(r.kinds, ['maze', 'raft', 'tower']);
  assert.ok(r.rate > 0.35 && r.rate < 0.65, 'second-half pass rate out of range: ' + r.rate.toFixed(3));
  console.log(`team stop: tower, labyrinth and river drawn; second half lets ${(r.rate * 100).toFixed(1)}% through`);
})().catch(e => { console.error(e.message); process.exit(1); });
