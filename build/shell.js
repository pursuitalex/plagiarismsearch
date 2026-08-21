/* Global shell builder — writes build/shell/{header,footer}[-v2].html into every page.

   Why this exists: the header and footer were inlined in 18 files, so a one-line
   navigation change meant 18 edits and 18 chances to drift. Two such drifts had already
   happened before this script was written.

   How it writes: by <header>/<footer> tag boundaries, not by marker comments. That kept
   the very first build byte-identical to what was already committed, which was the only
   way to prove the extraction was faithful rather than merely plausible.

   Run order: this is always LAST. build/stubs.js and the page builders emit their own
   shell, so run this afterwards and the canonical shell is back.

   Usage:  node build/shell.js            build the current version
           node build/shell.js --v1       build the pre-brief navigation instead
           node build/shell.js --check    verify only, exit 1 if any page is out of date
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const TPL = path.join(__dirname, 'shell');

/* ── which navigation ────────────────────────────────────────────────────────
   'v2' is the approved DEC-0027 architecture. 'v1' is the navigation the site had
   before the briefs arrived, kept alongside so the two can be compared and so a
   rollback is one word rather than a revert. Override per run with --v1 / --v2. */
let VERSION = 'v2';
if (process.argv.includes('--v1')) VERSION = 'v1';
if (process.argv.includes('--v2')) VERSION = 'v2';

/* ── nav states ─────────────────────────────────────────────────────────────
   The idle/active pair is the whole of the "you are here" treatment. Kept here
   rather than in the template so a page's state is one word in the table below. */
const IDLE = 'hover:bg-ink-900/5 transition-colors duration-300';
const ACTIVE = 'bg-ink-900/5 text-ink-900 font-semibold';

/* ── configurable destinations ──────────────────────────────────────────────
   DEC-0027 requires these two to stay configurable rather than hardcoded, because
   neither address is settled: Canvas gets its final verified URL at implementation,
   and Educators waits on the Teachers URL audit. Changing either is one line. */
const CANVAS = 'canvas-integration.html';
const EDUCATORS = 'plagiarism-checker-for-teachers.html';

const LANG_CHEV = '        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

/* ── the page table ─────────────────────────────────────────────────────────
   `active` is written in the v2 taxonomy — products, solutions, pricing, resources,
   company — and mapped down for v1, which had no Solutions links and filed Blog and
   Help center under Company.

   home     the page IS the homepage, so logo and CTA become same-page anchors
   header   false for pages that deliberately have none                          */
const PAGES = {
  'index.html':                  { active: null, home: true },
  /* the DEC-0030 homepage, built alongside the current one so the two can be compared
     before either is retired. It is the checker page, so it anchors its own CTAs. */
  'index-v2.html':               { active: null, home: true },
  'ai-detector.html':            { active: 'products' },
  'api.html':                    { active: 'products' },
  'prices.html':                 { active: 'pricing' },
  'help-center.html':            { active: 'resources' },
  'blog.html':                   { active: 'resources' },
  'blog-best-checker-2026.html': { active: 'resources' },
  'why-us.html':                 { active: 'company' },
  'mission.html':                { active: 'company' },
  'contact-us.html':             { active: 'company' },

  /* built and kept, but outside the global navigation per DEC-0027 §5 — plus
     plagiarism-check.html, which the homepage supersedes as the checker page */
  'plagiarism-check.html':       { active: null },
  /* legal: reachable from the footer, so no header item lights up */
  'terms-of-use.html':           { active: null },
  'policy.html':                 { active: null },
  'cookie-policy.html':          { active: null },
  'paper-analysis.html':         { active: null },
  'readability-check.html':      { active: null },
  'spell-check.html':            { active: null },
  'chat-bot.html':               { active: null },
  'vip.html':                    { active: null },

  /* the account screen drops the menu bar on purpose — a header invites you to leave
     a page whose only job is to get you in. It keeps the footer. */
  'account.html':                { active: null, header: false },
};

/* Placeholder pages, read from build/stubs.js rather than listed again here. Their
   nav group is derived from the group the brief files them under, so a stub lands in
   the right dropdown without being named twice. */
const GROUP_TO_NAV = { Products: 'products', Solutions: 'solutions', Company: 'company', Footer: null };
for (const s of require('./stubs')) {
  PAGES[s.slug + '.html'] = { active: GROUP_TO_NAV[s.group.split(' ')[0]] ?? null };
}

/* v1 had four top-level items and no Solutions destinations */
const V1_OF = { products: 'products', pricing: 'prices', resources: 'company', company: 'company', solutions: null };

/* design-system.html has its own shell and is not part of the site's navigation */
/* pages.html is the prototype index, a review tool rather than a page of the site,
   so it carries no global header or footer to keep fresh. */
const SKIP = new Set(['design-system.html', 'pages.html']);

function render(tpl, page) {
  const active = VERSION === 'v1' ? V1_OF[page.active] ?? null : page.active;
  const at = k => (active === k ? ACTIVE : IDLE);
  return tpl
    .split('{{HOME}}').join(page.home ? '#top' : 'index.html')
    .split('{{CTA}}').join(page.home ? '#top' : 'index.html#top')
    .split('{{CANVAS}}').join(CANVAS)
    .split('{{EDUCATORS}}').join(EDUCATORS)
    .split('{{NAV_PRODUCTS}}').join(at('products'))
    .split('{{NAV_SOLUTIONS}}').join(at('solutions'))
    .split('{{NAV_PRICES}}').join(at('prices'))
    .split('{{NAV_PRICING}}').join(at('pricing'))
    .split('{{NAV_RESOURCES}}').join(at('resources'))
    .split('{{NAV_COMPANY}}').join(at('company'))
    /* The pill opens a language menu, so it shows the chevron that says so — on every
       page. It used to appear only on the homepage, which was drift, not a decision.
       A line placeholder: when empty the whole line goes, not just its contents. */
    .replace(/\{\{LANG_CHEV\}\}\n/, page.langChev === false ? '' : LANG_CHEV + '\n');
}

/* Replace one element by its tag boundaries. Every page was verified to hold at most
   one <header> and one <footer>, so indexOf is enough and no parser is needed. */
function swap(html, tag, replacement, file) {
  const a = html.indexOf('<' + tag);
  const b = html.indexOf('</' + tag + '>');
  if (a < 0 || b < 0) throw new Error(file + ': no <' + tag + '> to replace');
  return html.slice(0, a) + replacement + html.slice(b + tag.length + 3);
}

const suffix = VERSION === 'v2' ? '-v2' : '';
/* Trailing whitespace is stripped so the build is idempotent. swap() replaces up to and
   including the closing tag and leaves whatever followed it in the page; a template that
   ends with a newline therefore injects one extra blank line on every single build, and
   the page never converges. v1 was extracted by slicing and had none, so this was invisible
   until the hand-written v2 templates arrived. */
const readTpl = n => fs.readFileSync(path.join(TPL, n + suffix + '.html'), 'utf8').replace(/\s+$/, '');
const headerTpl = readTpl('header');
const footerTpl = readTpl('footer');

const check = process.argv.includes('--check');
const found = fs.readdirSync(SITE).filter(f => f.endsWith('.html') && !SKIP.has(f));

/* a page missing from the table would silently keep a hand-edited shell forever */
const untabled = found.filter(f => !PAGES[f]);
if (untabled.length) throw new Error('not in the page table: ' + untabled.join(', '));
const missing = Object.keys(PAGES).filter(f => !found.includes(f));
if (missing.length) throw new Error('in the table but not on disk: ' + missing.join(', '));

let changed = 0;
for (const file of found) {
  const page = PAGES[file];
  const p = path.join(SITE, file);
  const before = fs.readFileSync(p, 'utf8');
  let after = before;

  if (page.header !== false) after = swap(after, 'header', render(headerTpl, page), file);
  after = swap(after, 'footer', render(footerTpl, page), file);

  if (after !== before) {
    changed++;
    console.log('  ' + (check ? 'STALE  ' : 'write  ') + file);
    if (!check) fs.writeFileSync(p, after);
  }
}

console.log('  [' + VERSION + '] ' + found.length + ' pages, ' + changed + ' ' +
            (check ? 'stale' : 'rewritten') +
            (changed ? '' : '  — every page already matches the templates'));
if (check && changed) process.exit(1);
