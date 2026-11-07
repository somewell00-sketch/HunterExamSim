/* ===================== EPITHETS: titles a career earns, the Zodiac's personas, outlaws' aliases ===================== */

// a third star brings a grander name, often tied to a place: the papers' name, not the friends'
const CAREER_EPI = {
  Blacklist: ['the Hound of {pl}', 'the Last Warrant', 'the One Who Always Comes', 'the Bounty Queen of {pl}', 'Judgement', 'the Long Arm', 'the Ledger', 'the Closer'],
  Treasure: ['the Gold of {pl}', 'King of the Lost Vaults', 'the Map-Breaker', 'Nine Hoards', 'the Lantern of {pl}', 'the Golden Spade', 'the Hoard-Finder', 'Lord of Small Keys'],
  Beast: ['the Beast-Lord of {pl}', 'the One the Wolves Follow', 'Mother of Monsters', 'the Tamer of {pl}', 'Wild Heart', 'the Herdwarden', 'the Keeper of {pl}', 'the Quiet Roar'],
  Gourmet: ['the Last Chef of {pl}', 'the Golden Palate', 'the Feast of {pl}', 'the Hundred-Course', 'the Salt of {pl}', 'the Taster', 'the Tongue of Kings', 'the Banquet'],
  Ruins: ['the Keeper of {pl}', 'the Lamp in the Dark', 'the Stone Whisperer', 'the Door-Opener', 'Old World', 'the Glyph-Reader', 'the Mason of {pl}', 'the Deep Delver'],
  Sea: ['the Admiral of {pl}', 'the Storm-Rider', 'the Tidecaller', 'Lord of the Seven Reefs', 'the Lighthouse of {pl}', 'Deepwater', 'the Wave-Breaker', 'the Drowned Star'],
  Virus: ['the Cure of {pl}', 'the Plague-Breaker', 'the Antidote', 'the Saint of {pl}', 'the Clean Hand', 'the Fever-Ender', 'the White Coat', 'the Last Vial'],
  Lost: ['the Finder of {pl}', 'the One Who Brings Them Home', 'the Last Lantern', 'Northstar', 'the Seeker of {pl}', 'the Homing Bird', 'the Thread', 'the Search Party'],
  Crime: ['the Detective of {pl}', 'the Final Word', 'the Glass Eye', 'the Truth of {pl}', 'the Unbribable', 'the Verdict', 'the Ledger of Sins', 'the Long Memory'],
  Jackpot: ['the Fortune of {pl}', 'the House Always Loses', 'the Golden Hand', 'King of {pl}', 'the Lucky Star', 'the Jackpot', 'Seven-Seven-Seven', 'the Last Bet'],
  Music: ['the Voice of {pl}', 'the Golden String', 'the Silent Symphony', 'the Maestro', 'the Song of {pl}', 'the Last Note', 'the Choir', 'the Echo'],
  Head: ['the Kingmaker', 'the Eye of {pl}', 'the One Who Finds Them', 'the Spotter', 'the Gatekeeper of {pl}', 'the Talent', 'the Recruiter General', 'the Open Door']
};
// a third star: sometimes the papers find a name (or a better one); the old one goes into the record
function starEpithet(h, ed){
  const L = CAREER_EPI[(h.career || '').replace(' Hunter', '')]; if(!L) return;
  if(h.nick && Math.random() >= 0.3) return; if(!h.nick && Math.random() >= 0.55) return;
  const taken = new Set(HUNTERS.filter(x => x.nick && hActive(x)).map(x => x.nick)), pl = homeOf(h);
  const n = L.map(t => t.replace('{pl}', pl)).filter(t => !taken.has(t) && t !== h.nick); if(!n.length) return; const nick = pickR(n), P = PR(h);
  if(h.nick) (h.nicks = h.nicks || []).push({n: h.nick, from: h.nickEd || h.edition, to: ed});
  h.nick = nick; h.nickWhy = `the name the papers gave ${P.them} with ${P.their} third star`; h.nickEd = ed;
  (h.log = h.log || []).push({ed, k: 'award', text: `With a third star, the papers find ${h.name} a new name: "${nick}".`});
}

// the Zodiac dress as their animal and take a name from it; the name stays with the seat's years
const ZOD_PERSONA = {
  Rat: ['Whiskers', 'the Gnawer', 'Sly Tail', 'Old Squeak', 'Granary Ghost', 'Little Teeth'],
  Ox: ['the Yoke', 'Bullhorn', 'Plough', 'Ironhide', 'Steady Hoof', 'the Furrow'],
  Tiger: ['Stripes', 'the Fang', 'Ember Eyes', 'the Prowler', 'Roar', 'Tall Grass'],
  Rabbit: ['Long Ears', 'Moonleap', 'Clover', 'the Burrow', 'Quickfoot', 'Thump'],
  Dragon: ['Scales', 'the Wyrm', 'Pearl', 'Thunderhead', 'Cloud-Rider', 'Old Fire'],
  Snake: ['Coil', 'Forked Tongue', 'the Charmer', 'Venom', 'Shed Skin', 'Hiss'],
  Horse: ['Mane', 'Gallop', 'the Stallion', 'Bridle', 'Windrunner', 'Horseshoe'],
  Sheep: ['Wool', 'the Flock', 'Bellwether', 'Cotton', "Ram's Horn", 'Shearling'],
  Monkey: ['Mischief', 'Tree-Swing', 'the Mimic', 'the Juggler', 'Banana Peel', 'Long Arms'],
  Rooster: ['Cockcrow', 'the Comb', 'Dawn-Call', 'Spur', 'the Weathervane', 'Feathers'],
  Dog: ['Muzzle', 'Loyal', 'the Sniffer', 'Bark', 'the Watchdog', 'Good Boy'],
  Boar: ['Tusk', 'the Charge', 'Bristle', 'Mudlark', 'Truffle', 'Snout']
};
function zodPersona(h, sign, ed){
  const L = ZOD_PERSONA[sign]; if(!L) return null; h.zp = h.zp || {};
  if(h.zp[sign]) return h.zp[sign];
  const used = new Set(HUNTERS.map(x => x.zp && x.zp[sign]).filter(Boolean)), free = L.filter(n => !used.has(n));
  return h.zp[sign] = pickR(free.length ? free : L);
}
const zodAs = (h, sign) => h && h.zp && h.zp[sign] ? ` · as “${h.zp[sign]}”` : '';

// outlaws: their names on the Blacklist. A lone outlaw is often known only by an alias until caught
const OL_ADJ = ['Smiling', 'Quiet', 'Hollow', 'Red', 'Grey', 'Velvet', 'Glass', 'Iron', 'Paper', 'Laughing', 'Weeping', 'Blind', 'Gentle', 'Midnight', 'Pale', 'Crooked', 'Golden', 'Rusty', 'Silent', 'Sweet', 'Lucky', 'Burnt', 'Painted', 'Hungry', 'Patient', 'Polite', 'Barefoot', 'Faceless', 'Lonely', 'Singing'];
const OL_NOUN = ['Knife', 'Widow', 'Hand', 'Lantern', 'Wolf', 'Choir', 'Saint', 'Tailor', 'Gardener', 'Ferryman', 'Moth', 'Hound', 'Doll', 'Shepherd', 'Butcher', 'Priest', 'Clockmaker', 'Fox', 'Crow', 'Bride', 'Jester', 'Collector', 'Surgeon', 'Magpie', 'Lamplighter', 'Undertaker', 'Locksmith', 'Spider', 'Piper', 'Baker'];
const OL_FIXED = ['Nine Fingers', 'Mister Tuesday', 'the Man Who Counts', 'Grandmother Teeth', 'Two Coins', 'the Toll Man', 'Sunday Best', 'the Hatless', 'Little Bell', 'the Ninth Guest', 'Old Rain', 'the Tidy One', 'Mother Ash', 'the Second Shadow', 'Lullaby', 'the Weigher', 'Cold Soup', 'the Letter Writer', 'Mister Nobody', 'Saint Nobody', 'the Last Guest', 'the Debt Collector', 'Pins', 'Velvet Gloves', 'the Uninvited', 'Seven Bells', 'Hush', 'the Pilgrim', 'Copper', 'the Night Nurse'];
const OL_PLACE = ['the Butcher of {pl}', 'the Wolf of {pl}', 'the Ghost of {pl}', 'the {pl} Strangler', 'the Saint of {pl}', 'the Ferryman of {pl}', 'the {pl} Widow', 'the Beast of {pl}', 'the Lantern of {pl}', 'the Bell-Ringer of {pl}'];
function outlawAlias(pl){
  const taken = new Set((WORLD.wanted || []).filter(w => w.status === 'wanted').flatMap(w => [w.nick, w.alias, w.name])), r = Math.random();
  for(let t = 0; t < 40; t++){
    const a = r < 0.45 ? `the ${pickR(OL_ADJ)} ${pickR(OL_NOUN)}` : r < 0.75 ? pickR(OL_FIXED) : pickR(OL_PLACE).replace('{pl}', pl);
    if(!taken.has(a)) return a;
  }
  return `the ${pickR(OL_ADJ)} ${pickR(OL_NOUN)}`;
}
// the alias is the name while nobody knows the face; capitalised when it stands as a name
const aliasName = a => a.replace(/^the /, 'The ');
// caught or killed, an outlaw known only by an alias is named at last
function outlawReveal(w, ed, how){
  if(!w || !w.anon || w.revealed) return null;
  const alias = w.alias; w.revealed = ed; w.nick = alias.replace(/^The /, 'the '); w.name = w.real; w.anon = false;
  const t = `${capS(alias)} ${how === 'dead' ? 'is dead, and has a name at last' : 'turns out to have a name after all'}: ${w.real}${w.home ? `, from ${w.home}` : ''}.`;
  if(typeof uwContact === 'function') uwContact(w, ed, `Known as ${alias.replace(/^The /, 'the ')} until the ${ordinal(ed)}. The real name was ${w.real}.`);
  return t;
}
