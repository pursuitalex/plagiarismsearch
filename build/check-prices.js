/* Check site/prices-v2.html against DEC-0042.

   Same discipline as the other page checkers: the brief is testable, so it is tested.

   This one has a boundary the others do not. The plan cards are a visual shell for a
   backend-driven widget, and DEC-0042 forbids freezing plan names, prices, quotas,
   billing periods, validity, entitlements or the Recommended state into page copy. So
   the checks below assert the SHELL — the four fixed tab labels, the recommendation
   label, the one-time helper — and separately assert that no plan figure has leaked out
   of the widget into body copy anywhere else on the page.

   Run: node build/check-prices.js
*/
const fs = require('fs');
const path = require('path');

const FILE = 'prices-v2.html';
const html = fs.readFileSync(path.join(__dirname, '..', 'site', FILE), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const text = body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')
                 .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ')
                 .replace(/&#39;/g, "'").replace(/&hellip;/g, '…')
                 .replace(/\s+/g, ' ').trim();

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};
const has = s => text.includes(s);

function section(id) {
  const i = body.indexOf('id="' + id + '"');
  if (i < 0) return '';
  return body.slice(body.lastIndexOf('<section', i), body.indexOf('</section>', i) + 10);
}

/* -- page-level SEO ------------------------------------------------------- */
console.log('page-level');
{
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)]
    .map(m => m[1].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim());
  ok('exactly one visible H1', h1s.length === 1, h1s.join(' | '));
  ok('H1 is "Plagiarism Checker Pricing & Plans"',
     h1s[0] === 'Plagiarism Checker Pricing & Plans', h1s[0]);

  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('approved title',
     title === 'Plagiarism Checker Pricing &amp; Plans | PlagiarismSearch', title);

  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok('approved meta description',
     desc === 'Compare PlagiarismSearch pricing for plagiarism checking, AI detection, and optional services. View one-time, monthly, 3-month, yearly, and high-volume options.',
     desc.slice(0, 55) + '…');

  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('self-canonical to /prices',
     canon === 'https://plagiarismsearch.com/prices', canon);
}

/* -- the seven approved sections, in order -------------------------------- */
console.log('\nsection order');
{
  const ORDER = [
    ['plans',        null],
    ['core-value',   'A plagiarism check you can inspect, not just a score'],
    ['ai-pricing',   'Add AI checking when you need it'],
    ['services',     'Other writing services'],
    ['high-volume',  'Need a custom or high-volume option?'],
    ['pricing-faq',  'Pricing FAQ'],
    ['free-check',   'Try plagiarism checking before you choose a plan'],
  ];

  const seen = [...body.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
  ok('seven sections carry the approved anchors in order',
     seen.join(',') === ORDER.map(o => o[0]).join(','), seen.join(', ') || 'none');

  for (const [anchor, h2] of ORDER) {
    if (!h2) continue;
    const found = (section(anchor).match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/) || [, ''])[1]
      .replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    ok('#' + anchor + ' H2', found === h2, found || '(missing)');
  }
}

/* -- fixed copy ----------------------------------------------------------- */
console.log('\nfixed copy');
{
  const FIXED = [
    'Compare one-time, monthly, 3-month, and yearly options and choose the plan that fits how much content you expect to check.',
    'Pay once. Your purchased quota does not expire.',
    'PlagiarismSearch helps you review where matches appear, which sources they come from, and which settings shaped the result.',
    'AI detection uses a separate AI word balance.',
    'AI detection and plagiarism checking are separate analyses.',
    'These optional services are available separately when you need help beyond plagiarism or AI checking.',
    'If the standard pricing options do not fit your checking volume or requirements, explore the available VIP options.',
    'Check up to 150 words without creating an account.',
    'Need an AI word allowance beyond the standard packages?',
  ];
  const missing = FIXED.filter(s => !has(s));
  ok(FIXED.length + ' approved strings present', !missing.length,
     missing.map(s => '"' + s.slice(0, 42) + '…"').join(' · '));

  /* the brief's own fixed-string checklist */
  const CTAS = ['Try a free plagiarism check', 'Explore VIP options', 'Learn about AI detection',
                'View Paper Analysis', 'Use Spell Check', 'Check Readability',
                'Visit the Help Center', 'Contact us'];
  const missingCta = CTAS.filter(s => !has(s));
  ok(CTAS.length + ' approved CTA labels present', !missingCta.length, missingCta.join(' · '));

  /* the six supporting labels of the core-value grid */
  const LABELS = ['500M+ academic texts', 'Web search', 'Evidence you can inspect',
                  'Paste or upload', 'Adjust the check', 'Keep a copy of the report'];
  const missingLabel = LABELS.filter(s => !has(s));
  ok('six core-value supporting labels', !missingLabel.length, missingLabel.join(' · '));
}

/* -- the widget shell ----------------------------------------------------- */
console.log('\npricing widget');
{
  const plans = section('plans');
  /* "The main pricing tabs are fixed: One-time · Monthly · 3-Months · Yearly" */
  const tabs = [...plans.matchAll(/data-period="[^"]*"[^>]*>([^<]+)</g)].map(m => m[1].trim());
  ok('four fixed tab labels in order',
     tabs.join(' · ') === 'One-time · Monthly · 3-Months · Yearly', tabs.join(' · ') || 'none');

  /* "Use Recommended, not Most popular" */
  ok('recommendation label is Recommended', /Recommended/i.test(plans) && !/most popular/i.test(text));

  /* "the widget occupies the primary first-screen decision area; no separate static
     plan matrix is created elsewhere on the page" — so plan figures must appear in the
     widget and nowhere else. */
  /* Everything except the widget AND the AI table — the AI packages are an approved
     second price list, and one of them ($9.95) happens to match a plan price. */
  const outside = body.replace(plans, '').replace(section('ai-pricing'), '');
  const leaked = ['$17.95', '$41.95', '$22.95', '$54.95',
                  '$64.95', '$89.95', '$114.95', '$174.95', '$259.95']
    .filter(v => outside.includes(v));
  ok('no plan price leaks outside the widget', !leaked.length, leaked.join(' '));

  /* A tier name outside the widget means someone rebuilt the plan table in prose.
     The entitlement WORDS are not banned — FAQ 4 exists to say API access is
     plan-specific, which is the opposite of duplicating it. */
  const tiers = ['Light', 'Standard', 'Premium']
    .filter(t => new RegExp('\\b' + t + '\\b').test(outside.replace(/<[^>]*>/g, ' ')));
  ok('no plan tier named outside the widget', !tiers.length, tiers.join(' · '));
}

/* -- what the brief forbids ----------------------------------------------- */
console.log('\nforbidden');
{
  const BANNED = [
    ['3 simple plans / no hidden tiers', /simple plans|no hidden tiers/i],
    ['every plan ships complete',        /ships complete|every plan (covers|includes)/i],
    ['no feature-gating',                /feature.gating/i],
    ['Most popular',                     /most popular/i],
    ['money-back guarantee',             /money.back|refund guarantee|\b7-day\b/i],
    ['14B web corpus',                   /\b14\s*b(illion)?\b|14,000,000,000/i],
    ['a numeric language count',         /\b\d+\s*\+?\s+languages\b/i],
    ['every text format',                /every (text )?format/i],
    ['instant support / reply SLA',      /instant (help|support)|4-hour|response time|24\/7/i],
    ['never indexed / no data storage',  /never indexed|no data storage|deleted after scanning/i],
    ['1,000 words daily',                /1,?000 words? (free )?daily|daily 1,?000/i],
    ['free AI words without account',    /150 free ai|free ai check without/i],
    ['full engine',                      /full engine/i],
    ['universal API or Storage claim',   /(api|storage) (access )?(is )?included with every plan|every plan includes (api|storage)/i],
    ['legacy timeframe wording',         /unlimited time ?frame/i],
    ['VIP entitlements',                 /dedicated manager|special invoicing|unlimited checks/i],
  ];
  for (const [label, re] of BANNED) {
    const m = text.match(re);
    const i = m ? text.search(re) : 0;
    ok('no ' + label, !m,
       m ? '"' + text.slice(Math.max(0, i - 28), i + m[0].length + 28).trim() + '"' : '');
  }
}

/* -- structural rules ------------------------------------------------------ */
console.log('\nstructure');
{
  /* "exactly these six semantic capabilities" */
  const core = section('core-value');
  ok('exactly six core-value cards', (core.match(/<h3\b/g) || []).length === 6,
     (core.match(/<h3\b/g) || []).length + ' found');

  /* eight AI packages in the approved snapshot */
  const ai = section('ai-pricing');
  const rows = ['10,000', '50,000', '100,000', '300,000', '500,000',
                '1,000,000', '3,000,000', '5,000,000'];
  ok('eight AI packages', rows.every(r => ai.includes(r)),
     rows.filter(r => !ai.includes(r)).join(' '));

  /* "one compact row/grid only" — three services, no sub-sections */
  const svc = section('services');
  ok('exactly three optional services', (svc.match(/<h3\b/g) || []).length === 3,
     (svc.match(/<h3\b/g) || []).length + ' found');

  /* "Additional Services ... must take materially less space" — checked by height in the
     browser, but the card count and the absence of extra headings is checkable here */
  ok('services section adds no sub-sections', !/<h2\b[\s\S]*<h2\b/.test(svc));

  /* seven FAQ items, answers rendered */
  const faq = section('pricing-faq');
  ok('seven FAQ answers in the rendered HTML',
     (faq.match(/class="faq-a"/g) || []).length === 7,
     (faq.match(/class="faq-a"/g) || []).length + ' found');

  const QS = [
    'How do I choose the right PlagiarismSearch plan?',
    'Do one-time packages expire?',
    'Is AI checking included with every plagiarism plan?',
    'Do all plans include API access and Storage?',
    'Can I buy AI checking separately?',
    'Can I try PlagiarismSearch before I buy a plan?',
    'What if the standard plans do not fit my volume?',
  ];
  ok('seven approved FAQ questions', QS.every(q => faq.includes(q)),
     QS.filter(q => !faq.includes(q)).join(' · '));

  /* "Do not render a second checker inside this section" */
  ok('no checker form on the page', !/<form\b/.test(body));

  /* the approved link policy, and nothing else */
  const APPROVED = new Set(['index.html', 'ai-detector.html', 'paper-analysis.html',
                            'spell-check.html', 'readability-check.html', 'vip.html',
                            'contact-us.html',
                            'https://plagiarismsearch.com/faq-and-support']);
  const links = [...body.matchAll(/href="([^"#][^"]*)"/g)].map(m => m[1])
    .filter(h => !h.startsWith('mailto:') && !h.startsWith('assets/'));
  const extra = [...new Set(links)].filter(h => !APPROVED.has(h));
  ok('only the approved body destinations', !extra.length, extra.join(', '));
}

console.log('\ngates — open items, not defects');
console.log('  G1  The plan cards are a visual shell. A developer must connect them to the');
console.log('      authoritative production pricing widget before launch; build/pricing-data.js');
console.log('      is placeholder data shared with the homepage and goes when the widget lands.');
console.log('  G2  AI package prices are the approved 2026-08-24 snapshot; production values');
console.log('      must come from authoritative billing data.');
console.log('  G5  Footer ratings refresh from production before launch.');

console.log('\n' + (failed ? failed + ' check(s) FAILED' : FILE + ' matches DEC-0042'));
process.exit(failed ? 1 : 0);
