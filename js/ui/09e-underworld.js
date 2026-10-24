/* ===== The Underworld: organised outlaw groups, in the spirit of the Phantom Troupe =====
   Usually one group at a time, sometimes none, now and then two, very rarely three. Each has a name, an emblem and a shape:
   numbered members, or titles from a theme (colours, chess, cards, sins, notes, metals, moons, winds), or no theme at all.
   Members live in WORLD.wanted beside the lone outlaws, so the Blacklist and its hunts reach them; they carry a gang id and a title.
   A group robs, burns, kills Hunters and recruits; it ends when its leader is caught or killed: someone takes over, it splits, or it scatters.
   Also here: expeditions sent to the Dark Continent by other powers, a spy in the Hunter Exam, and the last survivor of a massacre. */

const UW_ADJ = ['Phantom', 'Hollow', 'Silent', 'Pale', 'Ashen', 'Gilded', 'Velvet', 'Nameless', 'Crimson', 'Black', 'Last', 'Broken', 'Weeping', 'Smiling', 'Hidden', 'Grey', 'Midnight', 'Drowned', 'Laughing'];
const UW_COLL = ['Troupe', 'Choir', 'Circus', 'Carnival', 'Orchestra', 'Parade', 'Masquerade', 'Congregation', 'Menagerie', 'Court', 'Procession', 'Caravan', 'Lanterns', 'Ferrymen', 'Orchard', 'Wolves', 'Hands', 'Masks', 'Spiders', 'Bells'];
const UW_PLURAL = ['Lanterns', 'Ferrymen', 'Wolves', 'Hands', 'Masks', 'Spiders', 'Bells', 'Knives', 'Ravens', 'Thieves', 'Saints', 'Ghosts'];
const UW_NUMW = {5: 'Five', 7: 'Seven', 8: 'Eight', 9: 'Nine', 12: 'Twelve', 13: 'Thirteen'};
// the emblem is drawn with the crest charges and gives the group its street name
const UW_EMB = {web: 'the Spider', moth: 'the Moths', eye: 'the Eye', mirror: 'the Mirror', key: 'the Keys', serpent: 'the Serpent', rose: 'the Rose', eclipse: 'the Eclipse', hourglass: 'the Hourglass', lantern: 'the Lanterns', chain: 'the Chain', strings: 'the Puppeteers', crown: 'the Crown', moon: 'the Moon', book: 'the Ledger', sword: 'the Blades', rook: 'the Tower'};
// themes: the titles (the first one leads), the names that fit, and the words a name can be built from
const UW_THEMES = {
  numbered: {w: 4, label: 'numbered', sizes: [7, 9, 12, 13], titles: n => Array.from({length: n}, (_, i) => 'No. ' + i), fixed: [], nouns: null},
  rainbow: {w: 1, label: 'the colours', titles: () => ['White', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'], fixed: ['The Prism', 'The Spectrum', 'The Rainbow Parade', 'The Seven Colours', 'The Broken Prism', 'The Last Rainbow', 'The Stained Glass'], nouns: ['Prism', 'Spectrum', 'Colours', 'Glass', 'Palette']},
  chess: {w: 1, label: 'chess', titles: () => ['the King', 'the Queen', 'the White Bishop', 'the Black Bishop', 'the White Knight', 'the Black Knight', 'the Left Rook', 'the Right Rook'], fixed: ['The Black Court', 'The Ivory Gambit', 'Endgame', 'The Checkered Hand', 'The Last Gambit', 'The Sixty-Four', 'The Stalemate'], nouns: ['Court', 'Gambit', 'Board', 'Endgame', 'Kings', 'Opening']},
  cards: {w: 1, label: 'the cards', sizes: [5, 7, 9], titles: n => ['the Joker', 'the Ace of Spades', 'the King of Hearts', 'the Queen of Diamonds', 'the Jack of Clubs', 'the Ace of Hearts', 'the King of Spades', 'the Queen of Clubs', 'the Jack of Diamonds'].slice(0, n), fixed: ['The Marked Deck', "The Dead Man's Hand", 'The House of Cards', "The Joker's Court", 'The Last Hand', 'The Stacked Deck', 'The Wild Cards'], nouns: ['Deck', 'Hand', 'House', 'Jokers', 'Aces', 'Suits']},
  sins: {w: 1, label: 'the sins', titles: () => ['Pride', 'Greed', 'Wrath', 'Envy', 'Lust', 'Gluttony', 'Sloth'], fixed: ['The Seven Mouths', "The Sinners' Choir", 'The Seventh Hunger', 'The Unforgiven', 'The Crooked Saints', 'The Confession', 'The Fallen Seven'], nouns: ['Sinners', 'Saints', 'Mouths', 'Hungers', 'Penitents']},
  notes: {w: 1, label: 'the notes', titles: () => ['the Conductor', 'Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti'], fixed: ['The Silent Orchestra', 'The Broken Choir', 'The Requiem', 'The Last Overture', 'The Dirge', 'The Night Chorus', 'The Scale'], nouns: ['Orchestra', 'Choir', 'Chorus', 'Requiem', 'Overture', 'Scale']},
  metals: {w: 0.8, label: 'the metals', titles: () => ['Gold', 'Silver', 'Quicksilver', 'Copper', 'Iron', 'Tin', 'Lead'], fixed: ['The Alchemists', 'The Iron Crown', 'The Base Metals', "The Philosopher's Hand", 'The Crucible', 'The Leaden Seven', 'The Furnace'], nouns: ['Alchemists', 'Crucible', 'Furnace', 'Crown', 'Forge']},
  moon: {w: 0.8, label: 'the moon', titles: () => ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'], fixed: ['The Eclipse', 'The Moonless', 'The Pale Tide', 'The Night Hours', "The Lunatics' Court", 'The Silver Wake', 'The Eighth Night'], nouns: ['Tide', 'Moons', 'Nights', 'Wake', 'Phases']},
  winds: {w: 0.8, label: 'the winds', sizes: [5, 9], titles: n => ['the Eye', 'North', 'East', 'South', 'West', 'Northeast', 'Southeast', 'Southwest', 'Northwest'].slice(0, n), fixed: ['The Four Winds', 'The Compass', 'The Storm Court', 'The Gale', 'The Cardinal Hand', 'The Eye of the Storm', 'The Weathervane'], nouns: ['Winds', 'Gale', 'Compass', 'Storm', 'Squall']},
  none: {w: 2, label: '', sizes: [4, 5, 6, 8, 10], titles: n => ['the Head'].concat(Array(n - 1).fill('')), fixed: [], nouns: null}
};
const uwLive = w => w && (w.status === 'wanted' || w.status === 'hidden' || w.status === 'exam');
const gangOf = id => (WORLD.gangs || []).find(g => g.id === id) || null;
const gangActive = () => (WORLD.gangs || []).filter(g => g.end == null);
const gangMembers = g => (WORLD.wanted || []).filter(w => w.gang === g.id);
// everyone who ever belonged: still in, scattered when it fell apart, or gone to the group that split off
const gangRoster = g => (WORLD.wanted || []).filter(w => w.gang === g.id || w.formerGang === g.id || (w.pastGangs || []).includes(g.id));
// the mark as a thing you can paint on a door: "a spider", "keys", "an hourglass"
const UW_MARK = {web: 'a spider', moth: 'moths', eye: 'an eye', mirror: 'a mirror', key: 'keys', serpent: 'a serpent', rose: 'a rose', eclipse: 'an eclipse', hourglass: 'an hourglass', lantern: 'a lantern', chain: 'a chain', strings: 'puppet strings', crown: 'a crown', moon: 'a moon', book: 'a ledger', sword: 'blades', rook: 'a tower'};
const uwMark = g => UW_MARK[g.emb] || 'a mark';
const uwW = id => (WORLD.wanted || []).find(w => w.id === id) || null;
const uwNote = (g, ed, t) => { t = capS(t); (g.hist = g.hist || []).push({ed, t}); if(g.hist.length > 14) g.hist = g.hist.slice(-14); };
const uwContact = (w, ed, t) => { if(!w) return; (w.contacts = w.contacts || []).push({ed, t}); if(w.contacts.length > 8) w.contacts = w.contacts.slice(-8); };
// "No. 4 of the Nine Lanterns", "the Bishop of the Black Court", "Indigo of the Prism"
const uwWho = (w, g) => `${w.name}${w.title ? `, ${w.title}${g ? ` of ${g.name.replace(/^The /, 'the ')}` : ''}` : g ? ` of ${g.name.replace(/^The /, 'the ')}` : ''}`;
const gname = g => g.name.replace(/^The /, 'the ');

function uwName(theme, size){
  const T = UW_THEMES[theme], taken = new Set((WORLD.gangs || []).flatMap(g => [g.name].concat(g.aka || [])));
  for(let t = 0; t < 40; t++){
    let n;
    if(T.fixed.length && Math.random() < 0.45) n = pickR(T.fixed);
    else if(T.nouns && Math.random() < 0.7) n = `The ${pickR(UW_ADJ)} ${pickR(T.nouns)}`;
    else if(UW_NUMW[size] && Math.random() < 0.45) n = `The ${UW_NUMW[size]} ${pickR(UW_PLURAL)}`;   // "the Nine Lanterns", never "the Nine Choir"
    else n = `The ${pickR(UW_ADJ)} ${pickR(UW_COLL)}`;
    if(!taken.has(n)) return n;
  }
  return `The ${pickR(UW_ADJ)} ${pickR(UW_COLL)} of ${pickR(PLACES).replace(/^the /, '')}`;
}
// a member: a body and a mind like any candidate's, a Nen type, a title; the full Hatsu is drawn again from the same seed when the page opens
function uwStats(w, lead){
  const a = {}; ATTRS.forEach(([k]) => { const g = (Math.random() + Math.random() + Math.random() - 1.5) * 24; a[k] = Math.max(25, Math.min(97, Math.round(62 + g + (lead ? 8 : 0)))); });
  w.a = w.a || a; w.ns = w.ns || (Math.floor(Math.random() * 1e9) + 1);
  if(!w.nenK){ try { w.nenK = generateNen({seed: w.ns}, {id: w.id, a: w.a}, new Set()).category; } catch(e){ w.nenK = pickR(NEN_CATS); } }
  if(lead && !w.leadNen){ w.leadNen = 1; if(w.nenK !== 'Specialization' && Math.random() < 0.4) w.nenK = 'Specialization'; }   // the ones who lead lean toward the rarest kind of Nen: a tendency, not a rule
  if(!w.born) w.born = (S ? S.edition : 0) - (20 + Math.floor(Math.random() * 25));
  return w;
}
function uwMember(g, title, ed, lead){
  const r = Math.random(), gender = r < 0.47 ? 'Male' : r < 0.94 ? 'Female' : 'x';
  const first = pickR(gender === 'Male' ? FIRST_M : gender === 'Female' ? FIRST_F : FIRST_N);
  const w = {id: 'W' + (++WORLD.seq), name: `${first} ${pickR(LAST)}`, gender, nick: null, danger: lead ? 3 : 2 + (Math.random() < 0.3 ? 1 : 0), from: ed, status: 'wanted', gang: g.id, title: title || ''};
  uwStats(w, lead); WORLD.wanted.push(w);
  return w;
}
function uwFound(ed, items, past){
  const th = wpickM(Object.keys(UW_THEMES), k => UW_THEMES[k].w), T = UW_THEMES[th];
  const size = T.sizes ? pickR(T.sizes) : T.titles(0).length, titles = T.titles(size);
  const emb = pickR(Object.keys(UW_EMB)), g = {id: 'G' + (++WORLD.seq), name: uwName(th, size), theme: th, emb, ed, size, kills: 0, heists: 0, hist: []};
  (WORLD.gangs = WORLD.gangs || []).push(g);
  // the leader is sometimes a lone outlaw already on the Blacklist
  const lone = (WORLD.wanted || []).filter(w => w.status === 'wanted' && !w.gang && (w.danger || 1) >= 2);
  let lead;
  if(lone.length && Math.random() < 0.4){ lead = pickR(lone); uwStats(lead, true); lead.gang = g.id; lead.title = titles[0]; lead.danger = 3; }
  else lead = uwMember(g, titles[0], ed, true);
  g.lead = lead.id;
  const start = Math.max(2, Math.round(size * (0.5 + Math.random() * 0.4)));
  for(let i = 1; i < start; i++) uwMember(g, titles[i], ed);
  uwNote(g, ed, `${g.name} appear${past ? ', years before the records' : ''}, led by ${uwWho(lead)}. Their mark: ${UW_MARK[emb] || 'a mark'}.`);
  if(!past) items.push({lic: '', name: '', kind: 'hunt', text: pickR([`A new name starts to appear in the Association's files: ${gname(g)}, ${UW_NUMW[size] ? UW_NUMW[size].toLowerCase() : size} of them at most, who leave ${UW_MARK[emb] || 'a mark'} wherever they go.`, `${g.name} announce themselves in ${pickR(PLACES)} with a single night of fire. Their leader, ${lead.name}, goes straight onto the Blacklist.`, `They call themselves ${gname(g)}. Nobody knows how many there are yet, only that they answer to ${lead.name}.`]), rank: 10});
  return g;
}
const UW_HEIST = [
  (g, pl) => `${g.name} empty the vaults of the auction house in ${pl} in a single night. Nobody saw a face.`,
  (g, pl) => `${g.name} rob a museum in ${pl} and leave a single calling card: ${uwMark(g)}.`,
  (g, pl) => `An armoured train is found empty outside ${pl}. ${g.name} have been busy.`,
  (g, pl) => `${g.name} walk into the treasury of ${pl} at noon and walk out again before anyone understands what happened.`
];
const UW_ATTACK = [
  (g, pl) => `${g.name} burn the market district of ${pl} to the ground. The town will be years recovering.`,
  (g, pl) => `${g.name} take ${pl} for three days and leave it in ruins.`,
  (g, pl) => `${capS(pl)} wakes up to find ${uwMark(g)} painted on every door. By evening, half the town has fled.`
];
// a fight between a Hunter and a member: the Hunter's rank and field against the member's body and Nen
function uwFight(h, w){
  const hp = (typeof careerSkill === 'function' ? careerSkill(h) : 60) + hStars(h) * 12 + Math.random() * 40;
  const wp = (w.a ? (w.a.combat + w.a.strength + w.a.agility + w.a.strategy) / 4 : 60) + (w.danger || 2) * 8 + Math.random() * 40;
  return hp - wp;
}
function uwClash(g, ed, add, items){
  const live = gangMembers(g).filter(w => w.status === 'wanted'); if(!live.length) return;
  const w = Math.random() < 0.8 ? pickR(live.filter(x => x.id !== g.lead).concat(live.length === 1 ? live : [])) : uwW(g.lead) || pickR(live);
  if(!w) return;
  const act = HUNTERS.filter(h => hActive(h) && !h.legacy && !(WORLD.exped && h.exped === WORLD.exped.id));
  const hunting = (WORLD.hunts || []).filter(x => !x.done && gangMembers(g).some(m => m.id === x.w)).map(x => hLic(x.lic)).filter(h => h && hActive(h));
  const vend = act.filter(h => h.uwVend === g.id);
  const pool = vend.length && Math.random() < 0.5 ? vend : hunting.length && Math.random() < 0.6 ? hunting : act.filter(h => /Blacklist|Crime/.test(h.career || '') && hStars(h) >= 1);
  const h = pool.length ? pickR(pool) : null; if(!h) return;
  const pl = pickR(PLACES), d = uwFight(h, w), who = uwWho(w, g);
  if(d < -25 && !(typeof relicSaves === 'function' && relicSaves(h, ed, add, 'hunt'))){
    h.status = 'Deceased'; h.diedEd = ed; h.killedBy = w.name; w.kills = (w.kills || 0) + 1; g.kills++;
    add(h, 'death', pickR([`${h.name} is killed in ${pl} by ${who}.`, `${h.name} went after ${who} in ${pl}, alone. ${PR(h).They} did not come back.`]), 10);
    uwContact(w, ed, `Killed ${h.name} in ${pl}.`); uwNote(g, ed, `${w.name} killed the Hunter ${h.name} in ${pl}.`);
    if(typeof mournFor === 'function') try { mournFor(h, ed, add); } catch(e){}
  } else if(d > 25){
    const kill = Math.random() < 0.4; w.status = kill ? 'dead' : 'captured'; w.by = h.name; w.byLic = h.license; w.endEd = ed;
    h.rp = (h.rp || 0) + 80 + (w.id === g.lead ? 120 : 0);
    add(h, 'hunt', kill ? `${h.name} kills ${who} in ${pl}.` : `${h.name} brings in ${who} alive, after a fight that levels a street in ${pl}.`, w.id === g.lead ? 11 : 8);
    uwContact(w, ed, kill ? `Killed by ${h.name} in ${pl}.` : `Captured by ${h.name} in ${pl}.`); uwNote(g, ed, `${w.name} ${kill ? 'was killed' : 'was captured'} by ${h.name}.`);
    if(w.relic && WORLD.relics && WORLD.relics[w.relic] && typeof relVault === 'function'){ const r = WORLD.relics[w.relic]; delete w.relic; try { relVault(r, ed, `${RDEF[r.id].name} is recovered from ${w.name}.`); } catch(e){} }
  } else {
    add(h, 'hunt', pickR([`${h.name} and ${who} cross paths in ${pl}. Both walk away, both bleeding.`, `${h.name} corners ${who} in ${pl}, and ${w.name.split(' ')[0]} slips away at the last moment.`]), 6);
    uwContact(w, ed, `Fought ${h.name} in ${pl}; both walked away.`);
  }
  // whoever fought them remembers
  w.met = Array.from(new Set((w.met || []).concat([h.license]))).slice(-6);
}
// the group loses its head: someone takes over, it splits in two, or it scatters into the Blacklist
function uwLeaderless(g, ed, items){
  const live = gangMembers(g).filter(w => w.status === 'wanted');
  const old = uwW(g.lead), how = old ? (old.status === 'dead' ? `${old.name}'s death` : `the capture of ${old.name}`) : 'the loss of its leader';
  if(live.length < 2){ uwEnd(g, ed, items, `${g.name} do not survive ${how}. The last of them vanish.`, 'scattered'); return; }
  const r = Math.random(), sp = live.filter(w => w.nenK === 'Specialization'), heir = sp.length && Math.random() < 0.5 ? sp[0] : live.slice().sort((a, b) => (b.danger || 0) - (a.danger || 0) || (b.kills || 0) - (a.kills || 0))[0];   // a Specialist in the group often takes over
  if(r < 0.42){
    g.lead = heir.id; heir.danger = 3; const T = UW_THEMES[g.theme];
    const lt = T.titles(g.size)[0], prevT = heir.title; if(lt && !live.some(x => x.title === lt)) heir.title = lt;
    let t = `After ${how}, ${heir.name}${prevT && prevT !== heir.title ? ` (once ${prevT})` : ''} takes command of ${gname(g)}.`;
    if(Math.random() < 0.3){ (g.aka = g.aka || []).push(g.name); g.name = uwName(g.theme, g.size); t += ` They call themselves ${gname(g)} now.`; }
    uwNote(g, ed, t); items.push({lic: '', name: '', kind: 'hunt', text: t, rank: 9});
  } else if(r < 0.57 && live.length >= 5 && gangActive().length < 3){
    const half = live.filter(w => w !== heir).sort(() => Math.random() - 0.5).slice(0, Math.floor(live.length / 2));
    const T = UW_THEMES[g.theme], ng = {id: 'G' + (++WORLD.seq), name: uwName(g.theme, half.length), theme: g.theme, emb: pickR(Object.keys(UW_EMB)), ed, size: Math.max(half.length, 4), kills: 0, heists: 0, hist: [], from: g.id};
    WORLD.gangs.push(ng); g.lead = heir.id; heir.danger = 3;
    const nl = half.sort((a, b) => (b.danger || 0) - (a.danger || 0))[0]; ng.lead = nl.id; nl.danger = 3;
    half.forEach(w => { (w.pastGangs = w.pastGangs || []).push(g.id); w.gang = ng.id; });
    const t = `${g.name} split after ${how}. ${heir.name} keeps the name; ${nl.name} walks out with ${half.length - 1} others and founds ${gname(ng)}.`;
    uwNote(g, ed, t); uwNote(ng, ed, t); items.push({lic: '', name: '', kind: 'hunt', text: t, rank: 10});
  } else uwEnd(g, ed, items, `${g.name} fall apart after ${how}. ${live.length} of them are still out there, each on their own now.`, 'disbanded');
}
function uwEnd(g, ed, items, t, how){
  g.end = ed; g.endHow = how; uwNote(g, ed, t);
  gangMembers(g).filter(w => w.status === 'wanted').forEach(w => { w.formerGang = g.id; w.gang = null; });   // free outlaws now, still on the Blacklist
  // a hidden member in the Association has less to protect now
  items.push({lic: '', name: '', kind: 'hunt', text: t, rank: 10});
  // the towns they hurt remember
  Object.entries(WORLD.places || {}).filter(([pl, p]) => p.foe === g.id).slice(0, 1).forEach(([pl, p]) => { delete p.foe; items.push({lic: '', name: '', kind: 'place', text: `In ${pl}, people come out into the streets: ${gname(g)} are finished.`, rank: 7}); });
}
function underworldYear(prev, ed, add, items){
  WORLD.gangs = WORLD.gangs || [];
  if(!WORLD.uwInit){ WORLD.uwInit = 1; if(Math.random() < 0.8){ const g = uwFound(ed - 5 - Math.floor(Math.random() * 15), items, true); g.ed = Math.min(g.ed, ed); } }
  // the spy in the last exam: licensed (and hidden in the Association), or back with the group
  (WORLD.wanted || []).filter(w => w.status === 'exam' && w.spyEd === prev.edition).forEach(w => {
    const c = (prev.candidates || []).find(x => x.id === w.cid);
    if(c && c.status === 'Approved'){ const h = HUNTERS.find(x => x.cid === c.id); if(h){ w.status = 'hidden'; w.lic = h.license; return; } }
    if(c && c.status === 'Deceased'){ w.status = 'dead'; w.endEd = ed; uwContact(w, ed, `Died in the ${ordinal(prev.edition)} Hunter Exam, under the name ${c.name}.`); return; }
    w.status = 'wanted'; uwContact(w, ed, `Took the ${ordinal(prev.edition)} Hunter Exam under a false name, and failed.`);
  });
  // hidden in the Association: sooner or later someone looks too closely
  (WORLD.wanted || []).filter(w => w.status === 'hidden').forEach(w => {
    const h = hLic(w.lic), g = gangOf(w.gang) || gangOf(w.formerGang);
    if(!h || !hActive(h)){ if(h && h.status === 'Deceased'){ w.status = 'dead'; w.endEd = h.diedEd; } return; }
    if(Math.random() >= (g && g.end == null ? 0.1 : 0.25)) return;
    h.revoked = ed; h.status = 'Retired'; h.retEd = ed; retireRec(h, ed, `unmasked as ${w.title || 'a member'} of ${g ? gname(g) : 'an outlaw group'}`); h.unmasked = w.id;
    w.status = 'wanted'; w.danger = 3; w.lic = h.license;
    add(h, 'scandal', `${h.name}, licensed in the ${ordinal(h.edition)}, is unmasked as ${w.title ? w.title + ' of ' : 'a member of '}${g ? gname(g) : 'an outlaw group'}. The license is revoked; ${h.name.split(' ')[0]} is on the Blacklist before the day is out.`, 11);
    uwContact(w, ed, `Unmasked inside the Association after ${ed - h.edition} years as the Hunter ${h.name}.`); if(g) uwNote(g, ed, `${h.name}, a licensed Hunter, was unmasked as one of them.`);
  });
  // outlaws grow old too: past sixty, some die in their beds, never caught
  (WORLD.wanted || []).filter(w => w.status === 'wanted' && w.born != null && ed - w.born > 60).forEach(w => {
    if(Math.random() >= (ed - w.born - 60) * 0.012) return;
    w.status = 'dead'; w.endEd = ed; uwContact(w, ed, `Died of old age at ${ed - w.born}, never caught.`);
    const g = gangOf(w.gang); if(g){ uwNote(g, ed, `${w.name} died of old age.`); if(g.lead === w.id) items.push({lic: '', name: '', kind: 'hunt', text: `${w.name}, who led ${gname(g)} for ${ed - g.ed} years, dies in bed at ${ed - w.born}. No Hunter ever caught ${w.gender === 'Male' ? 'him' : w.gender === 'Female' ? 'her' : 'them'}.`, rank: 9}); }
  });
  // survivors of a massacre who became Hunters keep their vendetta
  (WORLD.uwSurvC || []).forEach(x => { const h = HUNTERS.find(y => y.cid === x.cid); if(h && !h.uwVend) h.uwVend = x.g; });
  gangActive().forEach(g => {
    const mem = gangMembers(g), live = mem.filter(uwLive), lead = uwW(g.lead);
    if(!lead || !(lead.status === 'wanted' || lead.status === 'hidden')){ uwLeaderless(g, ed, items); return; }
    if(!live.filter(w => w.status === 'wanted').length){ uwEnd(g, ed, items, `${g.name} are gone; nobody is left to carry the name.`, 'scattered'); return; }
    // recruit: an empty seat is filled, sometimes by a lone outlaw, now and then by a Hunter who walks away from the Association
    const titles = UW_THEMES[g.theme].titles(g.size), used = new Set(live.map(w => w.title).filter(Boolean)), open = titles.filter((t, i) => i > 0 && (t === '' || !used.has(t)));
    if(live.length < g.size && open.length && Math.random() < 0.45){
      const t = open[0], lone = (WORLD.wanted || []).filter(w => w.status === 'wanted' && !w.gang && !w.formerGang && w.cid);
      const traitors = HUNTERS.filter(h => hActive(h) && !h.legacy && hStars(h) <= 2 && (h.trait === 'Schemer' || h.guiltyEd || (typeof caseOf === 'function' && caseOf(h))));
      let w, text;
      if(traitors.length && Math.random() < 0.06){
        const h = pickR(traitors); h.status = 'Retired'; h.retEd = ed; h.defected = g.id; retireRec(h, ed, `left to join ${gname(g)}`);
        w = {id: 'W' + (++WORLD.seq), name: h.name, gender: h.gender, nick: h.nick || null, danger: 3, from: ed, status: 'wanted', gang: g.id, title: t, lic: h.license, cid: h.cid, a: Object.assign({}, h.attrs || {}), nenK: h.nen && h.nen.category, born: ed - hunterAge(h)};
        uwStats(w); WORLD.wanted.push(w);
        add(h, 'scandal', `${h.name} walks away from the Association and turns up months later as ${t ? t + ' of ' : 'a member of '}${gname(g)}.`, 11);
        uwContact(w, ed, `Was the Hunter ${h.name}, licensed in the ${ordinal(h.edition)}, until ${PR(h).they} joined ${gname(g)}.`);
        text = null;
      } else if(lone.length && Math.random() < 0.35){ w = pickR(lone); uwStats(w); w.gang = g.id; w.title = t; text = `${w.name}, wanted since the ${ordinal(w.from)}, joins ${gname(g)}${t ? ' as ' + t : ''}.`; }
      else { w = uwMember(g, t, ed); text = `${g.name} have a new ${t ? (t.replace(/^the /, '')) : 'member'}. The Association does not know the face yet.`; }
      uwNote(g, ed, `${w.name} joined${t ? ' as ' + t : ''}.`);
      if(text) items.push({lic: '', name: '', kind: 'hunt', text, rank: 5});
    }
    // the older the group and the busier the underworld, the harder the Association's best go after the head
    { const nAct = gangActive().length, pHead = Math.max(0, ed - g.ed - 18) * 0.015 + (nAct >= 3 ? 0.12 : nAct === 2 ? 0.025 : 0);
      if(lead.status === 'wanted' && Math.random() < pHead){
        const best = HUNTERS.filter(h => hActive(h) && !h.legacy && hStars(h) >= 3 && !(WORLD.exped && h.exped === WORLD.exped.id)).sort(() => Math.random() - 0.5)[0];
        if(best){ const pl = pickR(PLACES), kill = Math.random() < 0.45; lead.status = kill ? 'dead' : 'captured'; lead.by = best.name; lead.byLic = best.license; lead.endEd = ed;
          best.rp = (best.rp || 0) + 200;
          add(best, 'hunt', kill ? `${best.name} ends it: ${uwWho(lead, g)} dies in ${pl}, after ${ed - g.ed} years at the head of ${gname(g)}.` : `${best.name} brings in ${uwWho(lead, g)}, alive, in ${pl}. ${ed - g.ed} years, and it ends in a single night.`, 11);
          uwContact(lead, ed, `${kill ? 'Killed' : 'Captured'} by ${best.name} in ${pl}.`); uwNote(g, ed, `${lead.name} ${kill ? 'was killed' : 'was captured'} by ${best.name} in ${pl}.`);
          uwLeaderless(g, ed, items); return; } } }
    // what they do this year
    const n = Math.random() < 0.7 ? 1 : Math.random() < 0.6 ? 2 : 0;
    for(let i = 0; i < n; i++){
      const k = wpickM([['heist', 3], ['attack', 1.4], ['clash', 2.2], ['kidnap', 0.5]], x => x[1])[0], pl = pickR(PLACES);
      if(k === 'heist'){
        g.heists++;
        const vault = Object.values(WORLD.relics || {}).filter(r => r.st === 'vault'), thief = pickR(live.filter(w => w.status === 'wanted' && !w.relic)) || lead;
        if(vault.length && Math.random() < 0.04 && typeof relOutlaw === 'function' && thief){
          const r = pickR(vault), D = RDEF[r.id]; relOutlaw(r, ed, thief, `${D.name} is stolen from the Association's vault by ${gname(g)}.`);
          items.push({lic: '', name: '', kind: 'relic', text: `${capS(D.name)} is stolen from the Association's vault. ${capS(uwMark(g))} ${/s$/.test(uwMark(g)) ? 'are' : 'is'} left on the empty shelf: ${gname(g)}.`, rank: 10});
          uwNote(g, ed, `Stole ${D.name} from the Association's vault.`); uwContact(thief, ed, `Stole ${D.name} from the Association's vault.`);
        } else { const t = pickR(UW_HEIST)(g, plText(pl)); items.push({lic: '', name: '', kind: 'hunt', text: t, rank: 7}); uwNote(g, ed, t); }
      } else if(k === 'attack'){
        const st = Math.random() < 0.5 ? 'ruins' : 'gangs', t = pickR(UW_ATTACK)(g, pl);
        setPlace(pl, st, ed, t); WORLD.places[pl].foe = g.id; hometownNews(pl, st, ed, add);
        items.push({lic: '', name: '', kind: 'place', text: t, rank: 9}); uwNote(g, ed, t);
        // a massacre leaves one survivor, who will be heard from again
        if(Math.random() < 0.3){ const clan = pickR(LAST); (WORLD.uwSurv = WORLD.uwSurv || []).push({g: g.id, gname: g.name, pl, clan, ed});
          items.push({lic: '', name: '', kind: 'place', text: `Among the dead in ${pl}: the whole ${clan} family. Rumour says one child got away.`, rank: 7}); }
      } else if(k === 'clash') uwClash(g, ed, add, items);
      else {
        const kids = (WORLD.heirs || []).filter(x => !x.entered && ed - x.born >= 4 && ed - x.born <= 14 && x.parents.some(l => hActive(hLic(l))));
        const kid = kids.length ? pickR(kids) : null; if(!kid) continue;
        const P = kid.parents.map(hLic).find(h => h && hActive(h)), w = pickR(live.filter(x => x.status === 'wanted')) || lead;
        if(Math.random() < 0.65){ add(P, 'hunt', `${gname(g).replace(/^the/, 'The')} take ${P.name}'s child, ${kid.name.split(' ')[0]}, in ${pl}. ${P.name.split(' ')[0]} gets ${kid.gender === 'Male' ? 'him' : kid.gender === 'Female' ? 'her' : 'them'} back within the week, and ${w.name} will not forget the face.`, 9); uwContact(w, ed, `Took the child of ${P.name}, who got the child back.`); }
        else { add(P, 'hunt', `${gname(g).replace(/^the/, 'The')} take ${P.name}'s child, ${kid.name.split(' ')[0]}, and ask a price. The Association pays it. Nobody is proud of it.`, 9); uwContact(w, ed, `Ransomed the child of ${P.name}.`); }
        uwNote(g, ed, `Kidnapped the child of ${P.name}.`);
      }
    }
    // when a group gets too loud, the Association strikes back with its best
    if((g.kills + g.heists) >= 4 && Math.random() < 0.08){
      const lead3 = HUNTERS.filter(h => hActive(h) && !h.legacy && hStars(h) >= 3 && !(WORLD.exped && h.exped === WORLD.exped.id)).sort(() => Math.random() - 0.5)[0];
      if(lead3){ const hit = live.filter(w => w.status === 'wanted').sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 3)), pl = pickR(PLACES), out = [];
        hit.forEach(w => { if(w.id === g.lead && Math.random() > 0.3) return; const kill = Math.random() < 0.5; w.status = kill ? 'dead' : 'captured'; w.by = lead3.name; w.byLic = lead3.license; w.endEd = ed; out.push(`${w.name} ${kill ? 'dead' : 'taken'}`); uwContact(w, ed, `${kill ? 'Killed' : 'Captured'} in the Association's raid on ${pl}, led by ${lead3.name}.`); });
        if(out.length){ lead3.rp = (lead3.rp || 0) + 100; add(lead3, 'hunt', `The Association hits back: ${lead3.name} leads a raid on ${gname(g)} in ${pl}. ${capS(andList(out))}.`, 10); uwNote(g, ed, `The Association raided them in ${pl}, led by ${lead3.name}: ${andList(out)}.`); } }
    }
  });
  // new groups: likely when there are none, rare beside one, very rare beside two, never beside three
  const n = gangActive().length, pF = [0.18, 0.03, 0.035, 0][Math.min(3, n)];   // about: none 15%, one 60%, two 20%, three 5%
  if(Math.random() < pF) uwFound(ed, items);
  try { rivalExpYear(ed, add, items); } catch(e){ console.error(e); }
}

/* ---------- the exam: a spy, and the last of a family ---------- */
function underworldEnter(S){
  if(!WORLD.gangs) return;
  // a spy who failed before and came back for another try is undercover again
  S.candidates.filter(c => c.uwSpy).forEach(c => { const w = uwW(c.uwSpy); if(w && w.status === 'wanted'){ w.status = 'exam'; w.spyEd = S.edition; } });
  const pool = S.candidates.filter(c => c.status === 'Active' && !(c.attempts && c.attempts.length > 1) && !c.fam && !c.heir && !c.hParent && !c.dojo && !c.avenge);
  // one of them, in the spirit of Hisoka: registered under a clean name, with a seat in a group waiting
  const g = gangActive().find(x => { const live = gangMembers(x).filter(uwLive).length; return live < x.size; });
  if(g && Math.random() < 0.14){
    const strong = pool.filter(c => c.age >= 18 && c.age <= 40).sort((a, b) => total(b) - total(a)).slice(0, 40);
    const c = strong.length ? pickR(strong) : null;
    if(c){ const titles = UW_THEMES[g.theme].titles(g.size), used = new Set(gangMembers(g).filter(uwLive).map(w => w.title)), t = titles.find((x, i) => i > 0 && (x === '' || !used.has(x))) || '';
      const w = {id: 'W' + (++WORLD.seq), name: c.name, gender: c.gender, nick: null, danger: 2, from: S.edition, status: 'exam', gang: g.id, title: t, cid: c.id, spyEd: S.edition, a: Object.assign({}, c.a), born: S.edition - c.age};
      uwStats(w); WORLD.wanted.push(w); c.uwSpy = w.id; }
  }
  // the last survivor of a massacre registers, alone, with one purpose
  const sv = (WORLD.uwSurv || []).find(x => S.edition - x.ed >= 4);
  if(sv){ const young = pool.filter(c => c.age >= 14 && c.age <= 26 && !c.uwSpy).sort((a, b) => total(b) - total(a)).slice(0, 12); const c = young.length ? pickR(young) : null;   // among the strongest of the young: they have trained for this
    if(c){ WORLD.uwSurv.splice(WORLD.uwSurv.indexOf(sv), 1);
      if(!S.candidates.some(o => o.name === c.first + ' ' + sv.clan)){ c.last = sv.clan; c.name = c.first + ' ' + sv.clan; }
      ['determination', 'courage', 'perception', 'combat'].forEach(k => { if(c.a[k] != null) c.a[k] = Math.min(97, c.a[k] + 7); });   // years spent getting ready
      c.uwSurv = {g: sv.g, gname: sv.gname, pl: sv.pl, clan: sv.clan, ed: sv.ed};
      (WORLD.uwSurvC = WORLD.uwSurvC || []).push({cid: c.id, g: sv.g}); if(WORLD.uwSurvC.length > 30) WORLD.uwSurvC = WORLD.uwSurvC.slice(-30);
      log(S, 0, 'rival', `${c.name} registers alone. ${PR(c).They} ${PR(c).are} the last of the ${sv.clan} family, and ${PR(c).they} want${PR(c).s} a license for one reason: ${sv.gname.replace(/^The /, 'the ')}.`, [c.id]); }
  }
}

/* ---------- other powers on the Dark Continent: a king, a bank, a free city, each with Hunters on the payroll ---------- */
const RX_PATRON = ['the Royal House of Vasht', 'the Merchant Prince of Aurex', 'the Nadir Consortium', 'the Free City of Lumenhal', 'the Emperor of the Eastern Isles', 'the Gildmark Bank', 'the Saltwind Republic', 'the Order of the Pale Lamp'];
function rivalExpYear(ed, add, items){
  const X = WORLD.rx;
  if(!X){
    if(ed - (WORLD.rxLast ?? -99) < 12 || Math.random() >= 0.1) return;
    const patron = pickR(RX_PATRON), pool = HUNTERS.filter(h => hActive(h) && !h.legacy && hStars(h) >= 1 && !h.exped && !(typeof caseOf === 'function' && caseOf(h))).sort(() => Math.random() - 0.5);
    const hired = pool.slice(0, 2 + Math.floor(Math.random() * 3)); if(hired.length < 2) return;
    const allowed = Math.random() < 0.5, len = 1 + Math.floor(Math.random() * 3);
    WORLD.rx = {id: 'RX' + (++WORLD.seq), patron, ed, len, allowed, members: hired.map(h => h.license), lost: []};
    hired.forEach(h => { h.exped = WORLD.rx.id; });
    items.push({lic: hired[0].license, name: hired[0].name, kind: 'exped', text: `${capS(patron)} sends its own expedition to the Dark Continent, and pays Hunters to lead it: ${andList(hired.map(h => h.name))}. ${allowed ? 'The Association gives its blessing, through clenched teeth.' : 'The Association never gave permission.'}${WORLD.exped ? " The Association's own expedition is already out there. It is a race now." : ''}`, rank: 9});
    if(!allowed && typeof openCase === 'function' && CASE_K.patron) try { openCase(hired[0], 'patron', ed, add, {}); } catch(e){}
    return;
  }
  if(X.ed >= ed) return;
  X.year = (X.year || 0) + 1;
  const alive = X.members.map(hLic).filter(h => h && hActive(h));
  if(alive.length && Math.random() < 0.3){ const v = pickR(alive); v.status = Math.random() < 0.6 ? 'Deceased' : 'Missing'; v.diedEd = ed; v.lostIn = X.id; X.lost.push(v.license); add(v, v.status === 'Deceased' ? 'death' : 'missing', `${v.name} ${v.status === 'Deceased' ? 'dies' : 'goes missing'} on the Dark Continent, on ${X.patron.replace(/^the /, 'the ')}'s expedition.`, 9); }
  if(X.year < X.len) return;
  const live = X.members.map(hLic).filter(h => h && hActive(h));
  live.forEach(h => { delete h.exped; h.rp = (h.rp || 0) + 120; });
  HUNTERS.forEach(h => { if(h.exped === X.id) delete h.exped; });
  const r = Math.random(), P = capS(X.patron);
  const t = !live.length ? `${P}'s expedition to the Dark Continent is lost with everyone on it. The patron sends flowers and no explanation.`
    : r < 0.4 ? `${P}'s expedition comes back with something nobody will describe in public: ${andList(live.map(h => h.name))} are richer than the Chairman now.`
    : r < 0.75 ? `${P}'s expedition comes home${X.lost.length ? `, ${X.lost.length} short` : ''}, with less than it promised. ${live[0].name} refuses to talk about it.`
    : `${P}'s expedition returns early. Whatever ${live[0].name} saw out there, ${PR(live[0]).they} tell${PR(live[0]).s} the patron it is not for sale.`;
  items.push({lic: live[0] ? live[0].license : '', name: live[0] ? live[0].name : '', kind: 'exped', text: t, rank: 9});
  WORLD.rx = null; WORLD.rxLast = ed;
}

/* ---------- pages: the Underworld in the World tab, a page per group, a page per member ---------- */
function gangCrest(g, size){ return typeof crestSVG === 'function' ? crestSVG({key: 'gang' + g.id, arms: {shape: ['round', 'hexagon', 'lozenge', 'octagon', 'kite'][nhash(g.id) % 5], div: 'plain', c1: '#3a1418', c2: '#141012', charge: g.emb}, size}) : ''; }
const uwStatusTxt = w => ({wanted: 'At large', hidden: 'At large', exam: 'At large', captured: 'Captured', dead: 'Dead'}[w.status] || w.status);
function underworldHtml(){
  const L = WORLD.gangs || []; if(!L.length) return '';
  const act = L.filter(g => g.end == null), past = L.filter(g => g.end != null).slice(-12).reverse();
  const wl = w => w ? `<a data-outlaw="${w.id}">${esc(w.name)}</a>` : '—';
  return `<div><div class="section-h">Groups</div>${act.length ? `<div class="tablebox"><table class="hatable sch-t"><thead><tr><th>Group</th><th>Leader</th><th>Since</th><th>At large</th><th>Hunters killed</th></tr></thead><tbody>
    ${act.map(g => { const m = gangMembers(g), live = m.filter(uwLive).length; return `<tr data-gang="${g.id}"><td>${gangCrest(g, 40)}<b>${esc(g.name)}</b><br><small class="muted">${esc(UW_EMB[g.emb])}${UW_THEMES[g.theme].label ? ' · ' + esc(UW_THEMES[g.theme].label) : ''}</small></td><td>${wl(uwW(g.lead))}</td><td>${ordinal(g.ed)}</td><td>${live} of ${g.size}</td><td>${g.kills || 0}</td></tr>`; }).join('')}
    </tbody></table></div>` : '<p class="muted" style="margin:0">No organised group is known to be active.</p>'}
    ${past.length ? `<details class="bn-brief"><summary>${past.length} group${past.length === 1 ? '' : 's'} in the records</summary><div class="bulletin">${past.map(g => `<div class="bl hunt"><i>☠</i><span><a data-gang="${g.id}">${esc(g.name)}</a> <span class="muted">${ordinal(g.ed)}–${ordinal(g.end)} · ${esc(g.endHow || 'ended')}</span></span></div>`).join('')}</div></details>` : ''}</div>`;
}
function openGang(id){
  const g = gangOf(id); if(!g) return;
  const m = gangRoster(g), live = gangMembers(g).filter(uwLive), lead = uwW(g.lead), T = UW_THEMES[g.theme];
  const order = w => { const t = T.titles(Math.max(g.size, 16)).indexOf(w.title); return (uwLive(w) ? 0 : 100) + (t < 0 ? 50 : t); };
  const row = w => `<tr data-outlaw="${w.id}"><td>${esc(w.title || '—')}${w.id === g.lead ? ' <span class="xtag sm sp">Leader</span>' : ''}</td><td>${w.nenK ? `<i class="ndot" style="background:${NEN_COLOR[w.nenK]};margin-right:6px" title="${esc(w.nenK)}"></i>` : ''}<b>${esc(w.name)}</b></td><td>${'☠'.repeat(w.danger || 1)}</td><td class="${uwLive(w) ? '' : 'muted'}">${w.gang !== g.id && w.gang && gangOf(w.gang) ? `Left for <a data-gang="${w.gang}">${esc(gangOf(w.gang).name)}</a>` : esc(uwStatusTxt(w)) + (w.formerGang === g.id && uwLive(w) ? ' · on their own' : '')}${w.by ? ` <small class="muted">· ${esc(w.by)}</small>` : ''}</td></tr>`;
  const hl = (g.hist || []).slice().reverse();
  showModal(`<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(g.name)}">
    <div class="sheet-head"><div class="sch-head">${gangCrest(g, 120)}<div><div class="meta">The Underworld · known as ${esc(UW_EMB[g.emb])}</div><div class="sh-t"><h2>${esc(g.name)}</h2></div><div class="meta">${g.end != null ? `Active from the ${ordinal(g.ed)} to the ${ordinal(g.end)}` : `Active since the ${ordinal(g.ed)}`}${g.aka && g.aka.length ? ` · once ${g.aka.map(esc).join(', ')}` : ''}${g.from && gangOf(g.from) ? ` · split from <a data-gang="${g.from}">${esc(gangOf(g.from).name)}</a>` : ''}</div></div></div>
      <div style="display:flex;gap:8px;align-items:center"><button class="btn" id="mClose">Close</button></div></div>
    <div class="hcard"><div><small>Status</small><b>${g.end != null ? esc((g.endHow || 'ended').replace(/^./, c => c.toUpperCase())) : 'Active'}</b></div><div><small>Leader</small><b>${lead ? `<a data-outlaw="${lead.id}">${esc(lead.name)}</a>` : '—'}</b></div><div><small>At large</small><b>${live.length} of ${g.size}</b></div><div><small>Hunters killed</small><b>${g.kills || 0}</b></div><div><small>Heists</small><b>${g.heists || 0}</b></div><div><small>Ranks</small><b style="font-size:13px">${T.label ? esc(capS(T.label)) : 'No titles'}</b></div></div>
    ${(() => { const cur = m.filter(w => w.gang === g.id && uwLive(w)).sort((a, b) => order(a) - order(b)), gone = m.filter(w => !(w.gang === g.id && uwLive(w))).sort((a, b) => (b.endEd || 0) - (a.endEd || 0)), head = '<thead><tr><th>Title</th><th>Name</th><th>Danger</th><th>Status</th></tr></thead>';
      return `<div><div class="section-h">Members</div>${cur.length ? `<div class="tablebox"><table class="hatable">${head}<tbody>${cur.map(row).join('')}</tbody></table></div>` : '<p class="muted" style="margin:0">Nobody is left.</p>'}
      ${gone.length ? `<details class="bn-brief"><summary>${gone.length} former member${gone.length === 1 ? '' : 's'}</summary><div class="tablebox"><table class="hatable">${head}<tbody>${gone.map(row).join('')}</tbody></table></div></details>` : ''}</div>`; })()}
    ${hl.length ? `<div><div class="section-h">History</div><div class="bulletin">${hl.map(x => `<div class="bl hunt"><i>☠</i><span><span class="muted">${ordinal(x.ed)}</span> ${uwLinkAll(esc(capS(x.t)))}</span></div>`).join('')}</div></div>` : ''}
  </div>`);
}
function openOutlaw(id){
  const w = uwW(id); if(!w) return;
  uwStats(w);
  const g = gangOf(w.gang) || gangOf(w.formerGang), groups = {};
  ATTRS.forEach(([k, l, gr]) => (groups[gr] = groups[gr] || []).push([k, l]));
  let attrs = ''; for(const gr in groups) attrs += `<div class="grp">${gr}</div>` + groups[gr].map(([k, l]) => `<div class="attr"><span>${l}</span><span class="t"><i style="width:${w.a[k]}%"></i></span><span class="v">${w.a[k]}</span></div>`).join('');
  let nen = ''; try { const n = generateNen({seed: w.ns}, {id: w.id, a: w.a}, new Set()); n.category = w.nenK || n.category; nen = nenPanel({nen: n}).replace('Nen · unlocked after the exam', 'Nen'); } catch(e){}
  const age = w.born != null ? (w.status === 'dead' && w.endEd ? w.endEd : S.edition) - w.born : null;
  const C = (w.contacts || []).slice().reverse(), h = w.lic && hLic(w.lic);
  showModal(`<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(w.name)}">
    <div class="sheet-head"><div><div class="meta">The Underworld · ${g ? `<a data-gang="${g.id}">${esc(g.name)}</a>${w.gang ? '' : ' (former)'}` : 'Blacklist'}</div><div class="sh-t"><h2>${esc(w.name)}</h2><span class="xtag ${uwLive(w) ? 'sp' : ''}">${esc(uwStatusTxt(w))}</span></div>${w.nick ? `<div class="meta knownas">Known as <b>“${esc(w.nick)}”</b></div>` : ''}
      <div class="meta">${w.title ? esc(capS(w.title)) + ' · ' : ''}${age ? age + ' years old' + (w.status === 'dead' ? ' at death' : '') + ' · ' : ''}wanted since the ${ordinal(w.from)}${h ? ` · was the Hunter <a data-hunter="${esc(h.license)}">${esc(h.name)}</a>` : ''}</div></div>
      <div style="display:flex;gap:8px;align-items:center"><button class="btn" id="mClose">Close</button></div></div>
    <div class="hcard"><div><small>Group</small><b style="font-size:13px">${g ? esc(g.name) : '—'}</b></div><div><small>Title</small><b>${esc(w.title || '—')}</b></div><div><small>Danger</small><b>${'☠'.repeat(w.danger || 1)}</b></div><div><small>Nen</small><b>${w.nenK ? nenChip(w.nenK) : '—'}</b></div><div><small>Hunters killed</small><b>${w.kills || 0}</b></div><div><small>Status</small><b>${esc(uwStatusTxt(w))}${w.by ? `<br><small class="muted">by ${esc(w.by)}</small>` : ''}</b></div></div>
    <div><div class="section-h">What the Association knows</div>${C.length ? `<div class="bulletin">${C.map(x => `<div class="bl hunt"><i>·</i><span><span class="muted">${ordinal(x.ed)}</span> ${uwLinkAll(esc(x.t), w.name)}</span></div>`).join('')}</div>` : '<p class="muted" style="margin:0">Known only by reputation. No Hunter has faced them yet.</p>'}</div>
    ${nen}
    <details class="pf-more"><summary>Attributes</summary><div class="attrs">${attrs}</div></details>
  </div>`);
}
// capture phase, like schools and relics: a group or member link inside a Hunter's row opens the group or member
document.addEventListener('click', e => {
  const gl = e.target.closest('[data-gang]'), ol = e.target.closest('[data-outlaw]'), h = e.target.closest('[data-hunter]');
  if(ol && (!gl || gl.contains(ol)) && (!h || h.contains(ol))){ e.preventDefault(); e.stopPropagation(); openOutlaw(ol.dataset.outlaw); return; }
  if(gl && (!h || h.contains(gl))){ e.preventDefault(); e.stopPropagation(); openGang(gl.dataset.gang); }
}, true);

/* ---------- links between the two worlds ---------- */
let UWL = {h: null, o: null};
const uwRe = names => names.length ? new RegExp('(^|[^\\p{L}])(' + names.sort((a, b) => b.length - a.length).map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![\\p{L}])', 'gu') : null;
// outlaw names in a line of text become links to their page (skip: a name that is the page's own subject)
function uwLinkOutlaws(html, skip){
  const W = WORLD.wanted || [], k = W.length + ':' + W.filter(w => w.status !== 'wanted').length;
  if(!UWL.o || UWL.o.k !== k){ const map = {}; W.forEach(w => { if(w.name && w.name.includes(' ')) map[w.name] = w.id; }); UWL.o = {k, map, re: uwRe(Object.keys(map))}; }
  if(!UWL.o.re) return html;
  return html.replace(UWL.o.re, (m, pre, name) => name === skip ? m : `${pre}<a data-outlaw="${UWL.o.map[name]}">${name}</a>`);
}
function uwLinkHunters(html, skip){
  const k = HUNTERS.length;
  if(!UWL.h || UWL.h.k !== k){ const map = {}; HUNTERS.forEach(h => { map[h.name] = h.license; }); UWL.h = {k, map, re: uwRe(Object.keys(map))}; }
  if(!UWL.h.re) return html;
  return html.replace(UWL.h.re, (m, pre, name) => name === skip ? m : `${pre}<a data-hunter="${esc(UWL.h.map[name])}">${name}</a>`);
}
// Hunters first, then outlaws in what is left (a name already inside a link is not touched twice)
const uwLinkAll = (html, skip) => html.split(/(<a [^>]*>.*?<\/a>)/).map(part => part.startsWith('<a ') ? part : uwLinkOutlaws(uwLinkHunters(part, skip), skip)).join('');
// on a Hunter's page: every outlaw they crossed
function hunterUwHtml(h){
  const W = (WORLD.wanted || []).filter(w => w.byLic === h.license || (w.met || []).includes(h.license) || w.lic === h.license || (h.killedBy && w.name === h.killedBy) || (w.contacts || []).some(c => c.t.includes(h.name)));
  if(!W.length) return '';
  const rel = w => w.lic === h.license ? (h.unmasked === w.id ? 'was unmasked as this outlaw' : 'left the Association to become this outlaw') : h.killedBy === w.name ? 'killed by' : w.byLic === h.license ? (w.status === 'dead' ? 'killed' : 'captured') : 'crossed paths with';
  return `<div><div class="section-h">The Underworld</div><div class="grs">${W.slice(0, 8).map(w => { const g = gangOf(w.gang) || gangOf(w.formerGang);
    return `<div><span style="color:var(--red)">☠</span> <span class="muted">${esc(rel(w).charAt(0).toUpperCase() + rel(w).slice(1))}</span> <a data-outlaw="${w.id}">${esc(w.name)}</a>${g ? ` <span class="muted">· ${esc(w.title ? w.title + ' of ' : '')}<a data-gang="${g.id}">${esc(w.title ? gname(g) : g.name)}</a></span>` : ''}</div>`; }).join('')}</div></div>`;
}
