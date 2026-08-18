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
  { file: 'ai-detector.html',            path: '/ai-content-detector' },
  { file: 'api.html',                    path: '/plagiarism-api' },
  { file: 'prices.html',                 path: '/prices' },
  { file: 'why-us.html',                 path: '/why-us' },
  { file: 'mission.html',                path: '/plagiarismsearch-mission-and-core-values' },
  { file: 'contact-us.html',             path: '/contact-us' },
  { file: 'help-center.html',            path: '/help-center' },
  { file: 'blog.html',                   path: '/blog' },
  { file: 'blog-best-checker-2026.html', path: '/blog/best-plagiarism-checker-in-2026' },
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

/* a page on disk but missing from this table would quietly have no mapping */
const onDisk = fs.readdirSync(SITE).filter(f => f.endsWith('.html'));
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
  '- **Educators** — the destination stays configurable until the Teachers URL audit closes. The only open address left.',
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
