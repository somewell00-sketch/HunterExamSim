// Shared helpers: open the game in headless Chromium, with a clean save, and collect page errors.
const path = require('path');
const {chromium} = require('playwright');
const URL = process.env.GAME_URL || 'file://' + path.join(__dirname, '..', 'index.html');
async function openGame({fast = true, width = 1200, height = 900} = {}){
  const browser = await chromium.launch(), page = await browser.newPage({viewport: {width, height}}), errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(URL); await page.evaluate(() => { localStorage.clear(); indexedDB.deleteDatabase('hxsim'); }); await page.reload(); await page.waitForTimeout(500);
  // fast mode: no saving and no drawing while many exams run back to back
  if(fast) await page.evaluate(() => { window.__render = render; save = () => {}; MT_AUTO = true; render = () => {}; renderPhase = () => {}; showTab = () => {}; });
  return {browser, page, errors};
}
// run n exams (and the years between them)
const runExams = (page, n) => page.evaluate(n => { for(let i = 0; i < n; i++){ try{ legendParents(S); }catch(e){} while(!S.finished) runFav(); registerHunters(); document.getElementById('bNext').onclick(); } }, n);
module.exports = {openGame, runExams, URL};
