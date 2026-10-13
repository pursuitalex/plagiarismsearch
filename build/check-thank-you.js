/* Check site/thank-you.html — the page after the payment (build/thank-you.js).

   What it holds to: the page says the payment went through and gives one next step; the
   pass shows the order with the payment page's hooks and figures from the pricing source,
   never typed; every address on it leads somewhere; nothing on it sends, redirects or
   asks for anything; and its small motion rests when motion is off.

   Run: node build/check-thank-you.js
*/
const fs = require('fs');
const path = require('path');
const T = require('./thank-you');
const P = require('./payment');
const pricing = require('./pricing-data');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const html = fs.readFileSync(path.join(SITE, T.OUT), 'utf8');
const head = html.slice(0, html.indexOf('<body'));
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const flat = s => s.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').replace(/\s+([,.;:!?])(?=\s|$)/g, '$1').trim();
const text = flat(body.replace(/<script[\s\S]*?<\/script>/g, ''));
const K = T.COPY;

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};

console.log('the page');
{
  const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1, the thanks', h1s.length === 1 && h1s[0] === K.h1, h1s.join(' | '));
  ok('the title is the thanks and the site', (head.match(/<title>([^<]*)<\/title>/) || [])[1] === K.title + P.WORDS.site);
  const comps = [...body.matchAll(/<section\b[^>]*data-component="([^"]+)"/g)].map(m => m[1]);
  ok('two sections: the thanks, then help and the rest', comps.join() === 'thank-you,thank-you-more', comps.join());
  const h2s = [...body.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map(m => flat(m[1]));
  ok('three H2: the order, help, the social accounts', h2s.join(' | ') === [K.pass.h2, K.help.title, K.social.title].join(' | '), h2s.join(' | '));
  ok('no "first check in three steps" (Olex, 2026-10-13)', !/three steps/i.test(text) && !/<ol\b[^>]*rv-kids/.test(body));
  const panel = (body.match(/<section id="more"[\s\S]*?<\/section>/) || [''])[0];
  ok('help and the social accounts are one panel of two halves', (panel.match(/<div class="rv rounded-3xl[^"]*bg-ink-50[^"]*lg:grid-cols-2[^"]*lg:divide-x/g) || []).length === 1 && (panel.match(/<h2 id="(?:need-a-hand|follow-us)"/g) || []).length === 2);
  const all = [K.lead, K.note[0], K.note[1], K.pass.status, K.pass.total, K.help.title, K.help.text, K.help.link[0], K.social.title, ...K.path.steps];
  const missing = all.filter(s => !text.includes(flat(s)));
  ok(all.length + ' strings of the copy on the page', !missing.length, missing.slice(0, 2).join(' | '));
  ok('not indexed', /<meta name="robots" content="noindex/.test(head));
  ok('the global header and footer are there', /<header\b[\s\S]*<\/header>/.test(html) && /<footer\b[\s\S]*<\/footer>/.test(html));
}

console.log('\nthe path and the next step');
{
  const trail = (body.match(/<ol class="rv flex[^>]*aria-label="[^"]*">([\s\S]*?)<\/ol>/) || [])[1] || '';
  const lis = trail.match(/<li\b[^>]*>/g) || [];
  ok('three steps in order; the last is where the customer stands', lis.length === 3 && !/aria-current/.test(lis[0] + lis[1]) && /aria-current="step"/.test(lis[2]));
  ok('a finished step says so in words, not only with a tick', (trail.match(/<span class="sr-only"> — done<\/span>/g) || []).length === 2);
  const hero = body.slice(0, body.indexOf('<aside'));
  const buttons = [...hero.matchAll(/<a href="([^"]+)"[^>]*class="action-button\b[^"]*"[^>]*>\s*([^<]+?)\s*</g)].map(m => [m[2], m[1]]);
  ok('one button: the old page\'s, to the checker', buttons.length === 1 && buttons[0][0] === K.primary[0] && buttons[0][1] === K.primary[1], buttons.map(b => b.join(' → ')).join(', '));
  ok('the checker it leads to exists', fs.readFileSync(path.join(SITE, 'index.html'), 'utf8').includes('id="checker"'));
  ok('beside it, the way to the account', hero.includes(`<a href="${K.secondary[1]}" class="action-link">${K.secondary[0]}</a>`));
  ok('the support address is the payment page\'s, as a mail link', hero.includes('href="mailto:' + P.SUPPORT + '"'));
}

console.log('\nthe pass');
{
  const root = body.match(/<section id="thank-you"[^>]*>/)[0];
  ok('the section is the payment script\'s root', /\sdata-payment[\s>]/.test(root));
  ok('it carries the pricing data and the names', /<script type="application\/json" data-pricing-data>/.test(body) && /<script type="application\/json" data-payment-words>/.test(body));
  const hooks = [...body.matchAll(/data-pay="([a-z]+)"/g)].map(m => m[1]).sort().join();
  ok('the hooks: order, holds, recurring, total — once each, and no page name to rewrite', hooks === 'holds,order,recurring,total', hooks);
  ok('the tab keeps one name for every order', T.WORDS.subscription === K.title && T.WORDS.once === K.title && !/\{order\}/.test(T.WORDS.subscription + T.WORDS.once));
  const plan = pricing.PLANS[P.PERIOD][P.TIER];
  ok('the example order is the payment page\'s, its figures the pricing source\'s', text.includes(P.ORDER.name) && text.includes(plan.feats[0]) && body.includes('data-pay="total">' + plan.price + '<'), P.ORDER.name + ' ' + plan.price);
  const src = fs.readFileSync(path.join(__dirname, 'thank-you.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  ok('no price is typed in the generator', !/[$€£]\s?\d/.test(src));
  ok('the order number is the one marked as an example', text.includes(T.ORDER_NUMBER));
  ok('the tick is decoration; "Paid" is said in words', /<div class="ty-mark[^"]*" aria-hidden="true">/.test(body) && />Paid<\/p>/.test(body.replace(/<svg[\s\S]*?<\/svg>/g, '')));
  ok('the pass is named by its heading', /<aside[^>]*aria-labelledby="order-pass"/.test(body) && /<h2 id="order-pass"/.test(body));
}

console.log('\naddresses');
{
  const refs = [...body.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)].map(m => [m[1], m[0]]);
  const local = refs.filter(r => !/^(https?:|mailto:)/.test(r[0]));
  const missing = local.filter(r => !fs.existsSync(path.join(SITE, r[0].split('#')[0])));
  ok(local.length + ' local addresses — the checker, the account, the Help Center — lead to pages that exist', local.map(r => r[0]).join() === [K.primary[1], K.secondary[1], K.help.link[1]].join() && !missing.length, local.map(r => r[0]).join(', '));
  const out = refs.filter(r => /^https?:/.test(r[0]));
  ok('six social accounts, in a new tab, with no referrer', out.length === 6 && out.every(r => /^https:/.test(r[0]) && /target="_blank" rel="noopener noreferrer"/.test(r[1])) && out.map(r => r[0]).join() === K.social.links.map(l => l[1]).join(), out.length + ' found');
  ok('they are named in words: no brand mark on the page', K.social.links.every(l => new RegExp('>' + l[0] + '</a>').test(body)) && !/<img\b/.test(body));
}

console.log('\nnothing is sent, nothing leaves by itself');
{
  ok('no form, no field', !/<form\b|<input\b|<button\b|<textarea\b|<select\b/.test(body));
  ok('no redirect: no meta refresh in the head', !/http-equiv="refresh"/i.test(html));
  const scripts = [...body.matchAll(/<script\b([^>]*)>/g)].map(m => m[1]);
  ok('no CSS or JS of its own: two JSON islands and nothing else', scripts.length === 2 && scripts.every(s => /type="application\/json"/.test(s)) && !/<style\b|\sstyle="/.test(body));
}

console.log('\nthe motion (39-thank-you.css)');
{
  const css = fs.readFileSync(path.join(ROOT, 'build', 'assets', 'css', '39-thank-you.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const anim = [...css.matchAll(/([^{}]+)\{[^{}]*animation:(?!none)[^{}]*\}/g)].map(m => m[1].trim());
  ok(anim.length + ' animated rules, every one under html.js-motion', anim.length >= 4 && anim.every(s => s.split(',').every(p => p.trim().startsWith('html.js-motion '))), anim.filter(s => !s.startsWith('html.js-motion')).join(' | '));
  ok('nothing loops', !/infinite/.test(css));
  ok('reduced motion stops all of it', /@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*animation:none/.test(css));
  ok('at rest the tick is drawn and the halo is not there', /\.ty-halo \{ opacity:0; \}/.test(css) && /\.ty-check path \{[^}]*stroke-dashoffset:0/.test(css));
  ok('the built site.css carries it', fs.readFileSync(path.join(SITE, 'assets', 'css', 'site.css'), 'utf8').includes('@keyframes ty-draw'));
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok') + '  (' + T.OUT + ')');
process.exit(failed ? 1 : 0);
