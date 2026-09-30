/* Generate URLS.md — prototype filename ↔ approved production path.

   Decision of 2026-08-14: the prototype keeps flat .html filenames and the production
   paths from the briefs live here instead. That keeps the local server, every relative
   href and the link check working today, and makes the eventual switch a rename driven
   by one table rather than a hunt through 38 files.

   Run: node build/urlmap.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const STUBS = require('./stubs');

/* Built pages. `path` is the approved production path from DEC-0027 / DEC-0030;
   null means the briefs give this page no approved path. */
const BUILT = [
  { file: 'index.html',                  path: '/',                                         note: 'The Plagiarism Checker page. DEC-0030 governs its content.' },
  { file: 'index-v2.html',               path: null, note: 'The DEC-0030 rebuild of the homepage, alongside the current one. Takes over `/` once approved; the old index is retired then, not before.' },
  { file: 'ai-detector.html',            path: '/ai-content-detector' },
  { file: 'ai-detector-v2.html',         path: null, note: 'The DEC-0038 rebuild of the AI Detector, alongside the current one. Takes over `/ai-content-detector` once approved; the old page is retired then, not before. Built by build/ai-v2.js, checked by build/check-ai.js.' },
  { file: 'api.html',                    path: '/plagiarism-api' },
  { file: 'api-v2.html',                 path: null, note: 'The DEC-0041 rebuild of the API page, alongside the current one. Takes over `/plagiarism-api` once approved; the old page is retired then, not before. Built by build/api-v2.js, checked by build/check-api.js.' },
  { file: 'prices.html',                 path: '/prices' },
  { file: 'prices-v2.html',              path: null, note: 'The DEC-0042 rebuild of the Pricing page, alongside the current one. Takes over `/prices` once approved. Built by build/prices-v2.js, checked by build/check-prices.js. Its plan cards are a shell for the backend pricing widget; figures come from build/pricing-data.js, shared with the homepage.' },
  { file: 'terms-of-use.html',            path: '/terms-of-use',                             note: 'Text carried over from the live page word for word; only the styling is new. Built by build/legal.js from the copy in build/legal/.' },
  { file: 'policy.html',                 path: '/policy',                                   note: 'Text carried over from the live page word for word; only the styling is new. Built by build/legal.js from the copy in build/legal/.' },
  { file: 'cookie-policy.html',          path: '/cookie-policy',                            note: 'Text carried over from the live page word for word; only the styling is new. Built by build/legal.js from the copy in build/legal/.' },
  { file: 'originality-badges.html',      path: '/originality-badges',                       note: 'Copy and artwork carried over from the live page unchanged; the 129 badge images live in site/assets/img/badges/. Built by build/badges.js.' },
  { file: 'user-manuals.html',            path: '/user-manuals',                             note: 'Category names and all twenty guide titles carried over unchanged; the arrangement is new. Built by build/manuals.js. Most guides still live on the production site and keep absolute addresses.' },
  { file: 'newsroom.html',                path: '/newsroom',                                 note: 'The news archive. All 68 items carried over from the seven live pages with their dates, wording and destinations intact; the arrangement is new. Built by build/newsroom.js from build/newsroom-data.json, which build/newsroom-fetch.js refreshes.' },
  { file: 'plagiarism-and-ai-check-report.html', path: '/plagiarism-and-ai-check-report', note: 'A User Guide article. All 26 blocks of the live page carried over in their original order and wording; the sections are cuts along seams the text itself makes. Built by build/report-guide.js from build/report-guide-data.json, which build/report-guide-fetch.js refreshes.' },
  { file: 'plagiarism-and-ai-check-report-v2.html', path: '/plagiarism-and-ai-check-report', note: 'The same guide rendered through build/article.js — the template lifted from the blog post: one centred 700px column, a contents box, and semantic blocks styled once. Built alongside v1 so the two approaches can be compared.' },
  { file: 'why-us.html',                 path: '/why-us' },
  { file: 'mission.html',                path: '/plagiarismsearch-mission-and-core-values' },
  { file: 'contact-us.html',             path: '/contact-us' },
  { file: 'help-center.html',            path: '/help-center' },
  { file: 'blog.html',                   path: '/blog' },
  { file: 'blog-best-checker-2026.html', path: '/blog/best-plagiarism-checker-in-2026' },
  { file: 'university-plagiarism-checker.html', path: '/university-plagiarism-checker', note: 'The DEC-0043 institutional solution page, v1. Built by build/university.js, checked by build/check-university.js. Version switcher to v2.' },
  { file: 'university-plagiarism-checker-v2.html', path: '/university-plagiarism-checker', note: 'The University page to the v2 brief of 2026-09-04: nine sections, a proof type per act (hub, report, relationship map, source map, decision tree). Built by build/university-v2.js, checked by build/check-university-v2.js.' },
  { file: 'plagiarism-checker-for-students.html', path: '/plagiarism-checker-for-students', note: 'The Students page to the 2026-09-15 brief: the real checker in a two-column hero, the shared report with the student principle, a decision-shaped review workflow. Replaced the stub. Built by build/students.js, checked by build/check-students.js.' },
  { file: 'turnitin-checker-alternative.html', path: '/turnitin-checker-alternative', note: 'The Turnitin Alternative page to the 2026-09-15 brief: the real checker, a semantic comparison table with official Turnitin sources and a last-verified date, the non-equivalence act, a balanced fit section, the shared report, a pricing preview, the trademark notice. Footer only. Replaced the stub. Built by build/turnitin.js, checked by build/check-turnitin.js.' },
  { file: 'integration-guide.html', path: '/integration-guide', note: 'The Moodle Integration guide to the 2026-09-15 brief: a documentation-led page — compact product header, quick facts, a sticky On-this-page rail, definition tables, masked crops of the real plugin screens, troubleshooting, FAQ, support handoff. Replaced the stub. Built by build/moodle.js, checked by build/check-moodle.js.' },
  { file: 'ua-plagiarism-check.html', path: '/ua/plagiarism-check', note: 'The Ukrainian dedicated checker to the 2026-09-16 brief — the AR-03 master. Ukrainian content, English shell and product UI by decision. Flat file in the prototype; the production path is /ua/plagiarism-check. Built by build/ua.js, checked by build/check-ua.js.' },
  { file: 'pdf-plagiarism-checker.html', path: '/pdf-plagiarism-checker', note: 'The PDF Plagiarism Checker to the 2026-09-15 brief: protect-first — title and route kept, the real checker first, the text-based / scan-only / mixed extraction act as the signature, no OCR. Replaced the stub. Built by build/pdf.js, checked by build/check-pdf.js.' },
  { file: 'plagiarism-checker-for-organization.html', path: '/plagiarism-checker-for-organization', note: 'Business & Teams to the 2026-09-15 brief: no checker; the managed organization in the hero, Organization Management as a bento led by the personal-vs-organization separation, Storage as two tracks, workspace-vs-API as one split card, the business inquiry as the conversion. Replaced the stub. Built by build/business.js, checked by build/check-business.js.' },
  { file: 'vip.html',                    path: '/vip-plagiarism-checker',                   note: 'Footer only, under Plans & Legal. Not a core product; stays out of the header.' },

  /* built, kept, but outside the global navigation per DEC-0027 §5 */
  { file: 'paper-analysis.html',         path: '/rate-my-paper',            delisted: true },
  { file: 'spell-check.html',            path: '/spell-checker',            delisted: true },
  { file: 'readability-check.html',      path: '/readability-checker',      delisted: true },
  { file: 'chat-bot.html',               path: '/plagiarism-checker-app',   delisted: true },

  /* no approved path */
  { file: 'plagiarism-check.html',       path: null, note: 'Confirmed 2026-08-17: the homepage IS the Plagiarism Checker page. So this one has no approved address of its own. It stays on disk and leaves the navigation, the same treatment as the other delisted pages.' },
  { file: 'account.html',                path: null, note: 'Log in / create account. The brief says only "keep existing authentication behavior" and names no path.' },
  { file: 'design-system.html',          path: null, note: 'Internal reference sheet. Never part of the public site.' },
];

const rows = [];
for (const b of BUILT) {
  rows.push({
    file: b.file,
    path: b.path,
    status: b.path === null ? 'no approved path' : (b.delisted ? 'built · out of global nav' : 'built'),
    note: b.note || '',
  });
}
for (const s of STUBS) {
  rows.push({
    file: s.slug + '.html',
    path: s.provisional ? null : '/' + s.slug,
    status: s.provisional ? 'stub · path NOT approved' : 'stub',
    note: (s.provisional ? 'Provisional filename. ' : '') + (s.note || 'Approved destination, page not designed yet.'),
  });
}

/* pages.html is the prototype index — a review tool over this map, not an address in
   it. Like shell.js, this generator leaves it alone. */
const NOT_A_PAGE = new Set(['pages.html']);

/* a page on disk but missing from this table would quietly have no mapping */
const onDisk = fs.readdirSync(SITE).filter(f => f.endsWith('.html') && !NOT_A_PAGE.has(f));
const untabled = onDisk.filter(f => !rows.some(r => r.file === f));
if (untabled.length) throw new Error('not in the URL map: ' + untabled.join(', '));
const ghosts = rows.filter(r => !onDisk.includes(r.file));
if (ghosts.length) throw new Error('in the URL map but not on disk: ' + ghosts.map(g => g.file).join(', '));

const cell = s => String(s).replace(/\|/g, '\\|');
const md = [
  '# URL map',
  '',
  'Prototype filename ↔ approved production path.',
  '',
  'The prototype keeps flat `.html` filenames so the local server, every relative link and',
  '`build/check.js` keep working. The production paths from the approved briefs (DEC-0027',
  'navigation, DEC-0030 homepage) live here. Switching to clean paths later is a rename',
  'driven by this table.',
  '',
  '**Generated — run `node build/urlmap.js` after adding a page. Do not edit by hand.**',
  '',
  '| Prototype file | Production path | Status | Note |',
  '|---|---|---|---|',
  ...rows.map(r => '| `' + r.file + '` | ' + (r.path ? '`' + r.path + '`' : '—') + ' | ' + r.status + ' | ' + cell(r.note) + ' |'),
  '',
  '## Counts',
  '',
  ...Object.entries(rows.reduce((a, r) => (a[r.status] = (a[r.status] || 0) + 1, a), {}))
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => '- ' + v + ' × ' + k),
  '',
  '## Open',
  '',
  '- **Educators** — settled 2026-08-20: `/plagiarism-checker-for-teachers`. No open addresses remain.',
  '',
  '## Settled',
  '',
  '- **Canvas** — 2026-08-17: shipping for certain, so it renders as an ordinary navigation item rather than a release gate. Only its final URL is still to be supplied.',
  '- **plagiarism-check.html** — 2026-08-17: the homepage IS the Plagiarism Checker page, so this one keeps no address of its own and leaves the navigation.',
  '',
].join('\n');

fs.writeFileSync(path.join(ROOT, 'URLS.md'), md);
console.log('  URLS.md — ' + rows.length + ' pages');
for (const [k, v] of Object.entries(rows.reduce((a, r) => (a[r.status] = (a[r.status] || 0) + 1, a), {})))
  console.log('    ' + String(v).padStart(3) + ' × ' + k);
