/* Global shell builder — writes build/shell/{header,footer}.html into every page.

   Why this exists: the header and footer were inlined in 18 files, so a one-line
   navigation change meant 18 edits and 18 chances to drift. Two such drifts had already
   happened before this script was written (see NOTES at the bottom).

   How it writes: by <header>/<footer> tag boundaries, not by marker comments. That keeps
   the very first build byte-identical to what was already committed, which is the only
   way to prove the extraction is faithful rather than merely plausible.

   Run order: this is always LAST. build-auth.js / build-blog.js / build-article.js each
   carry their own copy of the shell from when they were written, so re-running any of
   them re-inlines a stale header. Run this afterwards and the canonical shell is back.

   Usage:  node build/shell.js            build
           node build/shell.js --check    verify only, exit 1 if any page is out of date
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const TPL = path.join(__dirname, 'shell');

/* ── nav states ─────────────────────────────────────────────────────────────
   The idle/active pair is the whole of the "you are here" treatment. Kept here
   rather than in the template so a page's state is one word in the table below. */
const IDLE = 'hover:bg-ink-900/5 transition-colors duration-300';
const ACTIVE = 'bg-ink-900/5 text-ink-900 font-semibold';

const LANG_CHEV = '        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

/* ── the page table ─────────────────────────────────────────────────────────
   active   which top-level nav item is highlighted, or null
   home     the page IS the homepage, so logo and CTA become same-page anchors
   header   false for pages that deliberately have none

   `active` must match the dropdown the page actually sits in. Blog, the blog article
   and Help center belong to Company in the current menu — that is where the markup
   lists them — so they are not exceptions. */
const PAGES = {
  'index.html':                  { active: null, home: true },
  'plagiarism-check.html':       { active: 'products' },
  'ai-detector.html':            { active: 'products' },
  'paper-analysis.html':         { active: 'products' },
  'readability-check.html':      { active: 'products' },
  'spell-check.html':            { active: 'products' },
  'vip.html':                    { active: 'products' },
  'api.html':                    { active: 'products' },
  'chat-bot.html':               { active: 'products' },
  'prices.html':                 { active: 'prices' },
  'why-us.html':                 { active: 'company' },
  'mission.html':                { active: 'company' },
  'contact-us.html':             { active: 'company' },
  'blog.html':                   { active: 'company' },
  'blog-best-checker-2026.html': { active: 'company' },
  'help-center.html':            { active: 'company' },
  /* the account screen drops the menu bar on purpose — a header invites you to leave
     a page whose only job is to get you in. It keeps the footer. */
  'account.html':                { active: null, header: false },
};

/* design-system.html has its own shell and is not part of the site's navigation */
const SKIP = new Set(['design-system.html']);

function render(tpl, page) {
  const at = k => (page.active === k ? ACTIVE : IDLE);
  return tpl
    .split('{{HOME}}').join(page.home ? '#top' : 'index.html')
    .split('{{CTA}}').join(page.home ? '#top' : 'index.html#top')
    .split('{{NAV_PRODUCTS}}').join(at('products'))
    .split('{{NAV_SOLUTIONS}}').join(at('solutions'))
    .split('{{NAV_PRICES}}').join(at('prices'))
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

const headerTpl = fs.readFileSync(path.join(TPL, 'header.html'), 'utf8');
const footerTpl = fs.readFileSync(path.join(TPL, 'footer.html'), 'utf8');

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

console.log('  ' + found.length + ' pages, ' + changed + ' ' + (check ? 'stale' : 'rewritten') +
            (changed ? '' : '  — every page already matches the templates'));
if (check && changed) process.exit(1);

/* ── NOTES ──────────────────────────────────────────────────────────────────
   Two drifts existed at extraction time and are reproduced above rather than fixed,
   so that the first build could be proven identical to what was committed:

   1. ACTIVE STATE. Eleven pages mark "Company" as the current section — api, blog,
      the blog article, chat-bot, help-center, paper-analysis, readability-check and
      spell-check among them. Only why-us, mission and contact-us belong to Company.
      The other eight should be Products or Resources.

   2. LANGUAGE CHEVRON. The footer language pill has a dropdown chevron on the homepage
      and nowhere else. It is a selector on all 18 pages, so one of the two is wrong.

   Both are single-line fixes in this file now. Neither is fixed yet — that is a visible
   change and belongs to its own step. */
