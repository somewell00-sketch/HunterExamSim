// The split save: the register in blocks of text, long-dead blocks skipped between years; a reload gives back the same world.
const assert = require('assert'), {openGame, runExams} = require('./lib');
(async () => {
  const {browser, page, errors} = await openGame({fast: true});
  await runExams(page, 120);
  const a = await page.evaluate(async () => { await flush(); const [p1] = svPairs(); const hn = Math.ceil(HUNTERS.length / SV_CH);
    // a second save in the same year leaves the long-dead blocks alone
    const skipped = hn - p1.filter(x => /^h:/.test(x[0])).length;
    HUNTERS[HUNTERS.length - 1].log = (HUNTERS[HUNTERS.length - 1].log || []).concat({ed: S.edition, text: 'Round-trip marker.'});
    await flush();
    return {n: HUNTERS.length, h: HISTORY.length, ed: S.edition, last: HUNTERS[HUNTERS.length - 1].license, skipped, hn, w: JSON.stringify(WORLD).length}; });
  await page.reload(); await page.waitForTimeout(1500);
  const b = await page.evaluate(() => ({n: HUNTERS.length, h: HISTORY.length, ed: S.edition, last: HUNTERS[HUNTERS.length - 1].license, mark: (HUNTERS[HUNTERS.length - 1].log || []).some(e => e.text === 'Round-trip marker.'), w: JSON.stringify(WORLD).length}));
  await browser.close();
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(b.n, a.n); assert.strictEqual(b.h, a.h); assert.strictEqual(b.ed, a.ed); assert.strictEqual(b.last, a.last); assert.ok(b.mark, 'last change lost');
  assert.ok(a.skipped > 0, 'no block skipped');
  console.log(`split save: ${a.n} Hunters in ${a.hn} blocks, ${a.skipped} long-dead blocks skipped on a second save, reload gives the same world`);
})().catch(e => { console.error(e.message); process.exit(1); });
