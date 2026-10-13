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
  { file: 'index.html', path: '/', note: 'The Plagiarism Checker page, to DEC-0030. Built by build/home-v2.js, checked by build/check-home.js. Its plan cards take their figures from build/pricing-data.js.' },
  { file: 'ai-detector.html', path: '/ai-content-detector', note: 'The AI Detector, to DEC-0038. Built by build/ai-v2.js, checked by build/check-ai.js.' },
  { file: 'api.html', path: '/plagiarism-api', note: 'The API page, to DEC-0041. Built by build/api-v2.js, checked by build/check-api.js.' },
  { file: 'prices.html', path: '/prices', note: 'The Pricing page, to DEC-0042. Built by build/prices-v2.js, checked by build/check-prices.js. Its plan cards are a shell for the backend pricing widget; figures come from build/pricing-data.js, shared with the homepage.' },
  { file: 'terms-of-use.html',            path: '/terms-of-use',                             note: 'Text carried over from the live page word for word; only the styling is new. Built by build/legal.js from the copy in build/legal/.' },
  { file: 'policy.html',                 path: '/policy',                                   note: 'Text carried over from the live page word for word; only the styling is new. Built by build/legal.js from the copy in build/legal/.' },
  { file: 'cookie-policy.html',          path: '/cookie-policy',                            note: 'Text carried over from the live page word for word; only the styling is new. Built by build/legal.js from the copy in build/legal/.' },
  { file: 'originality-badges.html',      path: '/originality-badges',                       note: 'Copy and artwork carried over from the live page unchanged; the 129 badge images live in site/assets/img/badges/. Built by build/badges.js.' },
  { file: 'video-on-plagiarism-tutorial.html', path: '/video-on-plagiarism-tutorial', note: 'Video Tutorials. No brief: the live page\'s H1, line and six tutorials word for word (two typos corrected); the arrangement is new — one tutorial on a stage, the six as rows that play on it, the player loaded only on request. In the header under Resources and in the footer (Olex, 2026-10-06). Built by build/tutorials.js, checked by build/check-tutorials.js.' },
  { file: 'user-manuals.html',            path: '/user-manuals',                            note: 'Category names and all twenty guide titles carried over unchanged; the arrangement is new. Built by build/manuals.js. Most guides still live on the production site and keep absolute addresses.' },
  { file: 'newsroom.html',                path: '/newsroom',                                 note: 'The news archive. All 68 items carried over from the seven live pages with their dates, wording and destinations intact; the arrangement is new. Built by build/newsroom.js from build/newsroom-data.json, which build/newsroom-fetch.js refreshes.' },
  { file: 'plagiarism-and-ai-check-report.html', path: '/plagiarism-and-ai-check-report', note: 'A User Guide article, rendered through build/article.js — the template lifted from the blog post: one centred 700px column, a contents box, and semantic blocks styled once. Built by build/report-guide-v2.js from build/report-guide-data.json (refreshed by build/report-guide-fetch.js), checked by build/check-report-guide-v2.js.' },
  { file: 'about-us.html', path: '/about-us', note: 'About us, to the 2026-09-30 brief: a company / trust page — a hero with its three facts (launched, founder, today) drawn as a path, the story, the six approved milestones as a timeline, nine team profiles of one size (initials and inactive LinkedIn marks until the real photos and addresses arrive), five areas of work, and a closing band to Mission & Values and Contact. English copy is a draft awaiting approval. Built by build/about.js with the page-specific components in build/about/, checked by build/check-about.js.' },
  { file: 'why-us.html',                 path: '/why-us' },
  { file: 'mission.html',                path: '/plagiarismsearch-mission-and-core-values' },
  { file: 'contact-us.html',             path: '/contact-us' },
  { file: 'help-center.html',            path: '/help-center' },
  { file: 'faq-and-support.html',        path: '/faq-and-support', note: 'Support & Frequently Asked Questions. No brief: the live page\'s H1, nine group names, sixty-two questions and answers and the inquiry form, word for word (build/faq-data.json, read by build/faq-fetch.js). The arrangement is new: jump links in the hero, one library FAQ section a group with a schematic figure of our own interface in place of the live stock picture (build/faq/figures.js), the library Inquiry form. In the header under Resources, in the footer and on the Help Center\'s FAQ card (Olex, 2026-10-07). Built by build/faq.js, checked by build/check-faq.js.' },
  { file: 'blog.html',                   path: '/blog' },
  { file: 'blog-best-checker-2026.html', path: '/blog/best-plagiarism-checker-in-2026' },
  { file: 'blog-affiliate-programs.html', path: '/blog/best-plagiarism-checker-affiliate-programs-for-education-bloggers-and-academic-creators', note: 'A real article from the archive, set in the approved blog article template exactly as the archive holds it — plain semantic HTML with no class on any element — to prove the article body typography (.article-body, build/assets/css/26-article.css). Its pictures are served from the live site. Built by build/blog-plain.js from build/blog/affiliate-programs.body.html, checked by build/check-blog-plain.js.' },
  { file: 'blog-article-elements.html', path: null, note: 'Internal reference, not a page of the site: every element the article body styles, once — h2 to h6, long headings, nested lists, a quotation, a figure, a table, code — as plain HTML in the blog article template. Built by build/blog-plain.js from build/blog/elements.body.html.' },
  { file: 'blog-author-kelsey-ayton.html', path: '/blog/author/kelsey-ayton', note: 'A blog author\'s page. No brief: the live profile (heading, photograph, bio, Twitter link) and the author\'s ten newest posts with their titles and dates; the dress is the blog index\'s — its hero, its cards, its pager, its closing section. One of the ten posts is in the prototype; the other nine and pages 2–6 lead to the live site. Linked from the article\'s author name. Built by build/blog-author.js, checked by build/check-blog-author.js.' },
  { file: 'university-plagiarism-checker.html', path: '/university-plagiarism-checker', note: 'The University page to the v2 brief of 2026-09-04: nine sections, a proof type per act (hub, report, relationship map, source map, decision tree). Built by build/university-v2.js, checked by build/check-university-v2.js.' },
  { file: 'plagiarism-checker-for-students.html', path: '/plagiarism-checker-for-students', note: 'The Students page to the 2026-09-15 brief: the real checker in a two-column hero, the shared report with the student principle, a decision-shaped review workflow. Replaced the stub. Built by build/students.js, checked by build/check-students.js.' },
  { file: 'turnitin-checker-alternative.html', path: '/turnitin-checker-alternative', note: 'The Turnitin Alternative page to the 2026-09-15 brief: the real checker, a semantic comparison table with official Turnitin sources and a last-verified date, the non-equivalence act, a balanced fit section, the shared report, a pricing preview, the trademark notice. Footer only. Replaced the stub. Built by build/turnitin.js, checked by build/check-turnitin.js.' },
  { file: 'integration-guide.html', path: '/integration-guide', note: 'The Moodle Integration guide to the 2026-09-15 brief: a documentation-led page — compact product header, quick facts, a sticky On-this-page rail, definition tables, masked crops of the real plugin screens, troubleshooting, FAQ, support handoff. Replaced the stub. Built by build/moodle.js, checked by build/check-moodle.js.' },
  { file: 'canvas-integration.html', path: '/canvas-integration', note: 'Canvas Integration to the approved illustrated brief of 2026-10-08 (new-tasks/new-page-7): eleven sections in the brief\'s order, its English copy verbatim, and the two real developer screenshots of Canvas SpeedGrader as the proof — behind two tabs in the SpeedGrader act, each beside the brief\'s crop of its report panel and opening enlarged; the files are tidied copies (app name, grade field and two comments retouched by build/canvas-tidy.js, the Canvas interface and the PlagiarismSearch results untouched). The hero carries no screenshot (Olex, 2026-10-12): it draws the integration as a loop between the Canvas and PlagiarismSearch marks. The Admin and Teacher guides are linked on the live site, not recreated. Built by build/canvas.js (the screenshot parts: build/evidence.js), checked by build/check-canvas.js.' },
  { file: 'powerpoint-plagiarism-checker.html', path: '/powerpoint-plagiarism-checker', note: 'The PowerPoint Plagiarism Checker to the brief of 2026-10-08 (new-tasks/new-page-7): ten sections in the brief\'s order, its English copy verbatim, the sitewide checker in the hero, and two compositions of its own — where text lives in a presentation (four drawn tiles and the "Not guaranteed" note for image-only text) and the proof: four tabs, each a source slide of the controlled PPTX beside the excerpt of the real report it produced — both drawn in HTML from the test (passages word for word, the report categories and source numbers as they were) and tagged for the product owner to review; no screenshot of the internal test material is on the page or in the repository. Footer only. Built by build/powerpoint.js (the screenshot parts: build/evidence.js), checked by build/check-powerpoint.js.' },
  { file: 'ua-plagiarism-check.html', path: '/ua/plagiarism-check', note: 'The Ukrainian dedicated checker to the 2026-09-16 brief — the AR-03 master. Ukrainian content, English shell and product UI by decision. Flat file in the prototype; the production path is /ua/plagiarism-check. Built by build/ua.js, checked by build/check-ua.js.' },
  { file: 'pdf-plagiarism-checker.html', path: '/pdf-plagiarism-checker', note: 'The PDF Plagiarism Checker to the 2026-09-15 brief: protect-first — title and route kept, the real checker first, the text-based / scan-only / mixed extraction act as the signature, no OCR. Replaced the stub. Built by build/pdf.js, checked by build/check-pdf.js.' },
  { file: 'affiliate-program-at-plagiarismsearch.html', path: '/affiliate-program-at-plagiarismsearch', note: 'The Affiliate Program with the old site\'s opening redrawn — the one version since 2026-10-07 (the developer\'s review). The title among people on dashed paths, the affiliate cabinet in a browser window (Olex\'s Figma frame, drawn in HTML and SVG), the four facts as chips; then v1\'s three tools and v2\'s sections. Built by build/affiliate-v3.js.' },
  { file: 'testimonials.html', path: '/testimonials', note: 'Reviews, illustrated — the one version since 2026-10-07 (the developer\'s review). Same live data; a hero photograph with the two platforms\' ratings as chips, the platform tiles with spot icons beside a photograph, Trustpilot in its own manner as a masonry wall, SmartCustomer (the live Sitejabber, renamed with its profile figures) as two running rows of equal cards with a zoom popup, the four videos on a stage with a playlist (IMAGES.md §8, wardrobe law). Built by build/testimonials-v2.js, checked by build/check-testimonials.js with the file name.' },
  { file: 'scholarship.html', path: '/scholarship', note: 'The Scholarship, illustrated — the one version since 2026-10-07 (the developer\'s review). Same live copy; the prize as a chip over the hero photograph, the four contest facts as spot-icon cards, a photograph for "try your luck", spot icons in the dark act (IMAGES.md §8). Built by build/scholarship-v2.js, checked by build/check-scholarship.js with the file name.' },
  { file: 'plagiarism-checker-for-organization.html', path: '/plagiarism-checker-for-organization', note: 'Business & Teams to the 2026-09-15 brief: no checker; the managed organization in the hero, Organization Management as a bento led by the personal-vs-organization separation, Storage as two tracks, workspace-vs-API as one split card, the business inquiry as the conversion. Replaced the stub. Built by build/business.js, checked by build/check-business.js.' },
  { file: 'vip.html',                    path: '/vip-plagiarism-checker',                   note: 'Footer only, under Plans & Legal. Not a core product; stays out of the header.' },

  /* built and kept. DEC-0027 §5 put these outside the global navigation; on 2026-10-06 Olex
     brought the three writing tools back into the footer (Popular checks). The header still
     does not carry them, and the chat bot stays out. */
  { file: 'paper-analysis.html',         path: '/rate-my-paper',            note: 'Footer only, under Popular checks (Olex, 2026-10-06). Not in the header. One version since 2026-10-07 (build/paper-v2.js): every word the live page\'s (build/paper-data.json), the order form in one column as Olex drew it in Figma — three numbered steps in one card, the summary with the button in a card under it.' },
  { file: 'spell-check.html',            path: '/spell-checker',            note: 'Footer only, under Popular checks (Olex, 2026-10-06). Not in the header. One version since 2026-10-07: every word the live page\'s (build/spell-data.json); the form of the other checkers — the text, the drop zone, the four ways in, the 47 languages — and the result (Mistakes, Statistics, Readability, Language) shown when "Free check" is pressed; photographs and spot icons (IMAGES.md §8). Built by build/spell-v2.js, checked by build/check-spell-v2.js.' },
  { file: 'readability-check.html',      path: '/readability-checker',      note: 'Footer only, under Popular checks (Olex, 2026-10-06). Not in the header. One version since 2026-10-07: every word the live page\'s (build/readability-data.json); the working Flesch calculator with the live upload controls and a drop zone; the two charts the live page shows as pictures drawn from their own numbers; the Trustpilot feedback from the Reviews data; photographs and spot icons (IMAGES.md §8). Built by build/readability-v2.js, checked by build/check-readability-v2.js.' },
  { file: 'chat-bot.html',               path: '/plagiarism-checker-app',   delisted: true },

  /* no approved path */
  { file: 'plagiarism-check.html',       path: null, note: 'Confirmed 2026-08-17: the homepage IS the Plagiarism Checker page. So this one has no approved address of its own. It stays on disk and leaves the navigation, the same treatment as the other delisted pages.' },
  { file: 'payment.html',                path: '/pay/subscription-monthly-standart', note: 'The payment page — where a customer lands after choosing a plan. No brief; Olex asked for it on 2026-10-12 from a screenshot of the live page ("Standard Monthly subscription payment"): its copy word for word, in the design system, the payment methods on the left and the order summary sticky on the right. The plan shown is an example and its figures come from build/pricing-data.js; the card and wallet marks are the live page files, the Stripe and PayPal logos are still names; the form sends nothing. Every plan card on the site leads here and names its order in the address fragment (#plan=…&period=…&recurring=on), and the page shows that order (62-payment.js). On the live site each order has its own address under /pay/ (the one given is the saved example); the prototype has this one page for all of them. Built by build/payment.js, checked by build/check-payment.js.' },
  { file: 'discounts.html',              path: '/discounts', note: 'Discounts and special offers — no brief; Olex asked for it on 2026-10-13 from the live page. A list of offers rendered from one array (build/discounts.js: OFFERS): the live 15% code as a coupon with the code and a Copy button, then a card per further offer. The live page\'s words are kept; the three further offers are ours, to be confirmed. Not linked from the header or the footer.' },
  { file: 'thank-you.html',              path: null, note: 'The page after the payment — no brief; Olex asked for it on 2026-10-13 from a screenshot of the old page. The live address is not known. Our own copy except the button ("Check for plagiarism"); the receipt shows the order named in the address, as the payment page does (build/thank-you.js).' },
  { file: '404.html',                    path: null, note: 'The page for an address that leads nowhere — no brief; Olex asked for it on 2026-10-12. Our own copy: the 404 with a lens for its zero, a dashed trail that wanders in and stops at an empty outline, "This page wandered off", a button home, the Help Center and five usual destinations. Served by the host at any missing address, so its head carries a base for relative links. Not linked from anywhere. Built by build/not-found.js, checked by build/check-not-found.js.' },
  { file: 'account.html',                path: null, note: 'Log in / create account. The brief says only "keep existing authentication behavior" and names no path.' },
  { file: 'design-system.html',          path: null, note: 'Internal reference sheet. Never part of the public site.' },
  { file: 'section-library.html',        path: null, note: 'Internal: the Section Library catalogue — each library component and variant, live, with its copy-paste HTML and content contract. Never part of the public site. Built by build/section-library.js; validated by build/check-library.js.' },
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
