/* Check site/payment.html — the payment page, from the live one (build/payment.js).

   What it holds to: the live page's words; the plan's figures read from the pricing
   source, never typed; the layout Olex asked for (content left, the summary sticky on the
   right, nothing clipping it); one radio group with one method chosen; and a form that
   sends nothing and draws no card field.

   Run: node build/check-payment.js
*/
const fs = require('fs');
const path = require('path');
const P = require('./payment');
const pricing = require('./pricing-data');

const SITE = path.join(__dirname, '..', 'site');
const html = fs.readFileSync(path.join(SITE, P.OUT), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const flat = s => s.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').replace(/\s+([,.;:!?])(?=\s|$)/g, '$1').trim();
const text = flat(body);
const K = P.COPY;

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};

console.log('the live page\'s words');
{
  const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1: the plan, the period, "subscription payment"', h1s.length === 1 && h1s[0] === K.h1, h1s.join(' | '));
  const h2s = [...body.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map(m => flat(m[1]));
  ok('two H2: Payment methods, Order summary', h2s.join(' | ') === 'Payment methods | Order summary', h2s.join(' | '));
  const all = [K.methods.note[0], K.methods.note[2].replace(/^\. /, ''), P.SUPPORT, ...K.methods.items.flatMap(m => [m.name, m.text]),
    K.summary.recurring, K.summary.codeLabel, K.summary.apply, K.summary.total, K.summary.submit];
  const missing = all.filter(s => !text.includes(flat(s)));
  ok(all.length + ' strings of the live page present verbatim', !missing.length, missing.slice(0, 2).map(s => '"' + s.slice(0, 40) + '…"').join(' '));
  ok('the breadcrumb: Home / Prices / this page', /aria-label="Breadcrumb"/.test(body) && /href="index\.html"[^>]*>Home</.test(body) && /href="prices\.html"[^>]*>Prices</.test(body) && /aria-current="page"/.test(body));
  ok('the support address is a mail link', body.includes('href="mailto:' + P.SUPPORT + '"'));
}

console.log('\nthe order');
{
  const plan = pricing.PLANS[P.PERIOD][P.TIER];
  ok('the plan\'s price is the pricing source\'s, in the line and in the total', P.ORDER.price === plan.price && (body.split('>' + plan.price + '<').length - 1) === 2, P.ORDER.price);
  ok('what the plan holds is the pricing source\'s wording', P.ORDER.holds === plan.feats[0] && text.includes(plan.feats[0]));
  ok('the plan\'s name is the pricing source\'s label', P.ORDER.name.startsWith(pricing.LABEL[P.TIER]) && text.includes(P.ORDER.name));
  const src = fs.readFileSync(path.join(__dirname, 'payment.js'), 'utf8');
  ok('no price is typed into the generator', !/[$€£]\s?\d/.test(src.replace(/\/\*[\s\S]*?\*\//g, '')));
}

console.log('\nthe layout');
{
  const main = body.slice(body.indexOf('data-component="payment"'));
  const open = (body.match(/<section[^>]*data-component="payment"[^>]*>/) || [''])[0];
  ok('two columns from 1024px, the summary the narrower one', /lg:grid-cols-\[minmax\(0,1fr\)_minmax\(0,400px\)\]/.test(main));
  ok('the summary is sticky under the header from 1024px, in the flow below it', /<aside class="[^"]*\blg:sticky lg:top-28\b/.test(main) && !/<aside class="[^"]*(?:^|\s)(?:sticky|fixed)\b/.test(main));
  ok('nothing clips the summary: its section does not hide overflow', !/overflow-(?:hidden|clip|auto)/.test(open));
  ok('the methods come before the summary in the source (a phone shows them first)', main.indexOf('<fieldset') < main.indexOf('<aside'));
  ok('the grid lets the tall column run: items start at the top', /items-start/.test(main));
}

console.log('\nthe form');
{
  const forms = [...body.matchAll(/<form\b[^>]*>/g)].map(m => m[0]);
  ok('one form, and it sends nothing', forms.length === 1 && !/\baction=/.test(forms[0]) && /onsubmit="return false"/.test(forms[0]));
  const radios = [...body.matchAll(/<input type="radio"[^>]*>/g)].map(m => m[0]);
  ok('one radio group of two methods, the first chosen', radios.length === 2 && radios.every(r => /name="payment_method"/.test(r)) && / checked/.test(radios[0]) && !/ checked/.test(radios[1]));
  ok('the group is a fieldset with a legend; each method is its radio\'s label', /<fieldset[\s\S]*?<legend class="sr-only">Payment methods<\/legend>/.test(body) && (body.match(/<label class="group /g) || []).length === 2);
  ok('the code field has its label', /<label for="payment-code"/.test(body) && /<input type="text" id="payment-code"/.test(body));
  ok('no card field is drawn: details are entered at the provider', !/card.?number|\bcvc\b|\bcvv\b|expir(?:y|ation) date|cc-number|type="(?:password|tel|number)"/i.test(body));
  ok('no CSS or JS of its own (the two data islands apart)', !/<style\b|\sstyle="/.test(body) && [...body.matchAll(/<script\b[^>]*>/g)].every(m => /type="application\/json"/.test(m[0])));
}

console.log('\nthe order follows the address');
{
  ok('the page carries the pricing data and its words as JSON islands', /<script type="application\/json" data-pricing-data>/.test(body) && /<script type="application\/json" data-payment-words>/.test(body) && /data-payment[ >]/.test(body));
  const island = JSON.parse((body.match(/<script type="application\/json" data-pricing-data>([\s\S]*?)<\/script>/) || [, '{}'])[1]);
  ok('the island is the pricing source, whole', JSON.stringify(island) === JSON.stringify(pricing.PLANS));
  for (const k of ['order', 'price', 'total', 'holds', 'recurring']) ok('one [data-pay="' + k + '"] in the summary', (body.match(new RegExp('data-pay="' + k + '"', 'g')) || []).length === 1);
  ok('the page\'s name is hooked twice: the h1 and the breadcrumb', (body.match(/data-pay="title"/g) || []).length === 2);
  ok('a subscription and a one-off order are named differently', P.WORDS.subscription !== P.WORDS.once && [P.WORDS.subscription, P.WORDS.once].every(w => w.includes('{order}')));
  /* every plan button on the site leads here, with a plan and a period the data knows */
  const site = fs.readdirSync(SITE).filter(f => f.endsWith('.html'));
  const links = site.flatMap(f => [...fs.readFileSync(path.join(SITE, f), 'utf8').matchAll(/<a href="([^"]*)" data-order-link="([^"]*)"/g)].map(m => [f, m[1], m[2]]));
  const good = l => { const m = l[1].match(/^payment\.html#plan=(\w+)&period=(\w+)(&recurring=on)?$/); return m && l[2] === 'payment.html' && pricing.PLANS[m[2]] && pricing.PLANS[m[2]][m[1]] && (!m[3] || !!pricing.PLANS[m[2]][m[1]].single); };
  ok(links.length + ' plan buttons across the site lead here with a known plan and period', links.length >= 12 && links.every(good), links.filter(l => !good(l)).slice(0, 3).map(l => l.join(' ')).join(', '));
  const plain = site.flatMap(f => [...fs.readFileSync(path.join(SITE, f), 'utf8').matchAll(/<a href="[^"]*"[^>]*>\s*Start (?:Light|Standard|Premium)\s*<\/a>/g)].map(m => [f, m[0]])).filter(x => !/data-order-link/.test(x[1]));
  ok('no plan button is left on its old destination', !plain.length, plain.slice(0, 3).map(x => x[0]).join(', '));
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok') + '  (' + P.OUT + ')');
process.exit(failed ? 1 : 0);
