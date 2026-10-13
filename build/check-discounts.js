/* Check site/discounts.html — discounts and special offers (build/discounts.js).

   What it holds to: the live page's words are on it; the page is its list of offers —
   one coupon for the featured one, one row of banners for the others (three at most), each
   on a ground of its own and none like the grey panel of the foot;
   a code is always text that can be selected, with a button beside it that copies exactly
   that text; the figures computed from the pricing source are computed, not typed; every
   address leads somewhere; and an example offer is told from a real one.

   Run: node build/check-discounts.js
*/
const fs = require('fs');
const path = require('path');
const D = require('./discounts');
const pricing = require('./pricing-data');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const html = fs.readFileSync(path.join(SITE, D.OUT), 'utf8');
const head = html.slice(0, html.indexOf('<body'));
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const flat = s => s.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').replace(/\s+([,.;:!?])(?=\s|$)/g, '$1').trim();
const text = flat(body);
const L = D.LIVE;

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};

const featured = D.OFFERS.filter(o => o.featured);
const others = D.OFFERS.filter(o => !o.featured);

console.log('the live page\'s words');
{
  const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1: "' + L.h1 + '"', h1s.length === 1 && h1s[0] === L.h1, h1s.join(' | '));
  ok('the title and the description are the live page\'s', (head.match(/<title>([^<]*)<\/title>/) || [])[1] === L.title && head.includes('content="' + L.meta + '"'));
  const all = [L.lead, L.register.text, ...L.register.links.map(l => l[0]), ...L.foot.flatMap(b => [b.title, b.text, b.link[0]])];
  const missing = all.filter(s => !text.includes(flat(s)));
  ok(all.length + ' strings of the live page present verbatim', !missing.length, missing.slice(0, 2).join(' | '));
  ok('the breadcrumb: Home / Our Discounts', /aria-label="Breadcrumb"/.test(body) && /href="index\.html"[^>]*>Home</.test(body) && body.includes('aria-current="page">' + L.crumb + '<'));
  const f = featured[0];
  ok('the live offer, in its words: Get 15% — discount for any submission package', !!f && flat(f.lead + ' ' + f.value) === 'Get 15%' && f.text === 'discount for any submission package' && text.includes('Get 15% discount for any submission package'));
  ok('its code is the one in the live button\'s address', !!f && L.apply.endsWith('discount_code=' + f.code) && f.cta[0] === 'Apply discount code');
  ok('not indexed in the prototype', /<meta name="robots" content="noindex/.test(head));
}

console.log('\nthe page is its list of offers');
{
  ok(D.OFFERS.length + ' offers: ' + featured.length + ' featured, ' + others.length + ' banners — one row, three at most', featured.length <= 1 && D.OFFERS.length >= 1 && others.length <= 3);
  const coupons = body.match(/<article[^>]*aria-labelledby="featured-offer"/g) || [];
  ok('the featured offer is the one coupon of the first screen', coupons.length === featured.length);
  const cards = [...body.matchAll(/<li class="min-w-0">\s*<article\b[\s\S]*?<\/article>\s*<\/li>/g)].map(m => m[0]);
  const name = o => flat(o.pre + ' ' + o.value + ' ' + o.title);
  ok('one banner for each of the others, in the list\'s order', cards.length === others.length && others.every((o, i) => flat(cards[i]).includes(name(o))), cards.length + ' banners');
  const wrong = others.filter((o, i) => {
    const c = cards[i] || '', t = flat(c);
    return !(t.includes(o.kind) && t.includes(flat(o.text)) && c.includes(`<a href="${o.cta[1]}"`) && t.includes(o.cta[0])
      && !!o.until === /data-offer-until/.test(c) && (!o.until || t.includes(o.until))
      && !!o.code === /data-copy-text=/.test(c));
  });
  ok('each banner shows its kind, its line, its button — and a date or a code only if the offer has one', !wrong.length, wrong.map(name).join(' | '));
  const heads = cards.map(c => flat((c.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/) || [])[1] || ''));
  ok('a banner\'s heading reads as one sentence: the words, the figure, the words', heads.every((h, i) => h === name(others[i])), heads.join(' | '));
  const grounds = cards.map(c => (c.match(/<article class="[^"]*?\b(bg-[a-z]+-\d+)\b/) || [])[1]);
  ok('each banner stands on a ground of its own: ' + grounds.join(', '), new Set(grounds).size === cards.length && grounds.every(g => g && g !== 'bg-ink-50'));
  const foot = (body.match(/<section id="support-and-prices"[\s\S]*?<\/section>/) || [''])[0];
  ok('the foot\'s panel stays grey, and no banner is', /<div class="rv rounded-3xl[^"]*\bbg-ink-50\b/.test(foot) && !cards.some(c => /\bbg-ink-50\b/.test(c)));
  ok('the row is one row from 1024px', /<ul class="rv-kids grid lg:grid-cols-3 /.test(body));
  const comps = [...body.matchAll(/<section\b[^>]*data-component="([^"]+)"/g)].map(m => m[1]);
  ok('three sections: the head and the coupon, the cards, the foot', comps.join() === 'discounts-head,discounts-offers,discounts-foot', comps.join());
  const kinds = [...body.matchAll(/<h([1-6])\b/g)].map(m => +m[1]);
  ok('the headings descend in order: h1, the coupon\'s h2, the banners\' h3 under their h2, the foot\'s h2', kinds.join('') === '12' + '2' + '3'.repeat(others.length) + '22', kinds.join(''));
}

console.log('\na code');
{
  const codes = D.OFFERS.filter(o => o.code);
  const shown = [...body.matchAll(/<span class="[^"]*font-mono[^"]*">([^<]+)<\/span>\s*<button type="button" data-copy-text="([^"]+)" data-copied="([^"]+)" aria-label="([^"]+)"[^>]*>[\s\S]*?<span data-copy-label>([^<]+)<\/span><\/button>/g)].map(m => m.slice(1));
  ok(codes.length + ' codes, each as text on the page with a button beside it', shown.length === codes.length, shown.length + ' found');
  ok('the button copies exactly the text shown', shown.every(s => s[0] === s[1]) && shown.map(s => s[0]).join() === codes.map(o => o.code).join());
  ok('it says what it does, and what it did', shown.every(s => s[4] === D.COPY.copy[0] && s[2] === D.COPY.copy[1] && s[3].includes(s[0])));
  const js = fs.readFileSync(path.join(ROOT, 'build', 'assets', 'js', '63-copy-text.js'), 'utf8');
  ok('the script is in site.js and writes text only', fs.readFileSync(path.join(SITE, 'assets', 'js', 'site.js'), 'utf8').includes('data-copy-text') && !/innerHTML/.test(js));
}

console.log('\nfigures');
{
  const money = s => parseFloat(String(s).replace(/[^0-9.]/g, ''));
  const pairs = Object.values(pricing.PLANS).flatMap(p => Object.values(p).filter(x => x && x.single));
  const rec = Math.floor(Math.max(...pairs.map(p => (money(p.single.price) - money(p.price)) / money(p.single.price) * 100)));
  ok('the Recurring payments saving is the pricing source\'s: up to ' + rec + '%', D.RECURRING_SAVING === rec && text.includes('Save up to ' + rec + '% with Recurring payments') && pairs.length === 9);
  const checks = p => p.feats.reduce((n, f) => n + (/ checks?$/.test(f) ? money(f) : 0), 0);
  const per = p => money(p.price) / checks(p);
  const yr = Math.floor(Math.max(...Object.keys(pricing.LABEL).map(t => (1 - per(pricing.PLANS.yearly[t]) / per(pricing.PLANS.monthly[t])) * 100)));
  ok('the yearly saving is the pricing source\'s: up to ' + yr + '% less per check', D.YEARLY_SAVING === yr && text.includes('Pay up to ' + yr + '% less per check on a yearly plan'));
  const src = fs.readFileSync(path.join(__dirname, 'discounts.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  ok('neither computed saving is typed in the generator', /value: RECURRING_SAVING \+ '%'/.test(src) && /value: YEARLY_SAVING \+ '%'/.test(src));
}

console.log('\naddresses');
{
  const refs = [...body.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m => m[1]);
  const missing = refs.filter(r => /^(https?:|mailto:)/.test(r) || !fs.existsSync(path.join(SITE, r.split('#')[0])));
  ok(refs.length + ' addresses, all to pages of the prototype that exist', refs.length === D.OFFERS.length + 5 && !missing.length, missing.join(', '));
  ok('no form; the only buttons copy a code', !/<form\b|<input\b/.test(body) && (body.match(/<button\b/g) || []).length === D.OFFERS.filter(o => o.code).length);
  ok('no CSS or JS of its own', !/<style\b|<script\b|\sstyle="/.test(body));
}

const examples = D.OFFERS.filter(o => o.example);
console.log('\n  NOTE  ' + (examples.length ? examples.length + ' offer(s) marked as an example, not a real offer — replace or delete before launch: ' + examples.map(o => '"' + flat(o.pre + ' ' + o.value + ' ' + o.title) + '" (' + o.code + ')').join(', ') : 'no example offers'));
console.log('  NOTE  the live button applies the code through its address (' + L.apply + '); the prototype\'s Pricing does not read a code.');

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok') + '  (' + D.OUT + ')');
process.exit(failed ? 1 : 0);
