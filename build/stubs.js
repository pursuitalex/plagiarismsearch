/* Generate the placeholder pages for approved destinations that are not built yet.

   The two client briefs (DEC-0027 navigation, DEC-0030 homepage) name 20 destinations
   that have no page in this prototype. The briefs require real crawlable <a href> links,
   and our own check refuses to pass with a dead link, so every approved destination gets
   a page — one that says plainly what it will be rather than pretending to be it.

   Filenames mirror the approved production slug, so moving to clean paths later is a
   rename and nothing more. The two destinations with no approved slug yet say so.

   Run order:  node build/stubs.js  →  node build/shell.js  →  node build/check.js
   stubs.js emits empty <header></header> and <footer></footer>; shell.js fills them.
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');

/* slug          the filename, and the production path once we drop .html
   label         the navigation label from the brief, verbatim
   group         where the brief files it
   note          why it is not built, when that is not simply "not built yet"       */
const STUBS = [
  { slug: 'integration-guide',                     label: 'Moodle Integration',        group: 'Products · Integrations' },
  { slug: 'how-to-use-plagiarismsearch-google-add-on', label: 'Google Docs Add-on',    group: 'Products · Integrations' },
  { slug: 'university-plagiarism-checker',         label: 'Education & Institutions',  group: 'Solutions · For organizations', note: 'Existing URL; the brief says the page content will be completely rebuilt.' },
  { slug: 'plagiarism-checker-for-organization',   label: 'Business & Teams',          group: 'Solutions · For organizations', note: 'Existing URL; the brief says the page content will be completely rebuilt.' },
  { slug: 'plagiarism-checker-for-students',       label: 'Students',                  group: 'Solutions · For individuals',   note: 'Existing URL; a substantial rewrite is planned.' },
  { slug: 'testimonials',                          label: 'Reviews',                   group: 'Company' },
  { slug: 'powerpoint-plagiarism-checker',         label: 'PowerPoint Plagiarism Checker', group: 'Footer · Popular Checks',   note: 'Footer only. The brief keeps it out of the header and out of the homepage body.' },
  { slug: 'pdf-plagiarism-checker',                label: 'PDF Plagiarism Checker',    group: 'Footer · Popular Checks',       note: 'Footer only. The brief keeps it out of the header and out of the homepage body.' },
  { slug: 'quote-checker-at-plagiarismsearch',     label: 'Quote Checker',             group: 'Footer · Popular Checks',       note: 'Footer only. The brief keeps it out of the header and out of the homepage body.' },
  { slug: 'turnitin-checker-alternative',          label: 'Turnitin Alternative',      group: 'Footer · Popular Checks',       note: 'Footer only. The brief keeps it out of the header and out of the homepage body.' },
  { slug: 'user-manuals',                          label: 'User Guide',                group: 'Footer · Resources' },
  { slug: 'newsroom',                              label: 'News',                      group: 'Footer · Resources' },
  { slug: 'originality-badges',                    label: 'Originality Badges',        group: 'Footer · Resources',            note: 'Footer only — the brief keeps it out of the header.' },
  { slug: 'scholarship',                           label: 'Scholarship',               group: 'Footer · Company' },
  { slug: 'affiliate-program-at-plagiarismsearch', label: 'Affiliate Program',         group: 'Footer · Company' },
  { slug: 'policy',                                label: 'Privacy Policy',            group: 'Footer · Plans & Legal',        note: 'The homepage privacy section links here. The brief forbids inventing a new privacy URL.' },
  { slug: 'terms-of-use',                          label: 'Terms of Use',              group: 'Footer · Plans & Legal' },
  { slug: 'cookie-policy',                         label: 'Cookie Policy',             group: 'Footer · Plans & Legal' },

  /* no approved slug yet — the filenames below are provisional and marked as such */
  { slug: 'canvas-integration',                    label: 'Canvas',                    group: 'Products · Integrations',
    note: 'Treated as live: Olex confirmed 2026-08-17 that Canvas is definitely shipping, so it renders as an ordinary navigation item rather than a release gate. The address closed with it — the point-fix brief of 2026-08-20 approves /canvas-integration as final, so the filename is no longer provisional.' },
  { slug: 'plagiarism-checker-for-teachers',       label: 'Educators',                 group: 'Solutions · For individuals',
    note: 'The Teachers URL audit closed on 2026-08-20: Educators lands here, and no second educator address is created. The page itself will be rewritten separately around real educator use cases.' },
];

/* Reuse a real page head so the stubs carry the identical tailwind.config, fonts and
   base styles. Hand-copying it would drift within a week and the check would catch it
   as eighteen design systems instead of one. */
const donor = fs.readFileSync(path.join(SITE, 'help-center.html'), 'utf8');
const head = donor.slice(0, donor.indexOf('<body'));
const bodyTag = donor.slice(donor.indexOf('<body'), donor.indexOf('>', donor.indexOf('<body')) + 1);

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function page(s) {
  const title = 'PlagiarismSearch — ' + s.label;
  const urlLine = s.provisional
    ? 'Provisional path · not approved'
    : '/' + s.slug;

  return head.replace(/<title>[\s\S]*?<\/title>/, '<title>' + esc(title) + '</title>') + bodyTag + `
<div class="grain"></div>

<header></header>

<main>
  <section class="relative pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-28 lg:pb-32 bg-[#F2FCFC] overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="orb w-[620px] h-[620px] bg-teal-500/12 -left-48 -top-40"></div>
      <div class="orb w-[520px] h-[520px] bg-orange-500/10 right-[-140px] top-40"></div>
    </div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="max-w-[620px]">
        <div class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700 mb-4 lg:mb-5">${esc(s.group)}</div>
        <h1 class="text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08] mb-4 lg:mb-5">${esc(s.label)}</h1>
        <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] text-ink-600 leading-relaxed mb-8 sm:mb-10 lg:mb-12">This page is an approved destination in the navigation architecture. It is not designed yet — the link works so the navigation can be walked end to end.</p>

        <div class="rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7 mb-8 sm:mb-10 lg:mb-12">
          <dl class="divide-y divide-ink-100">
            <div class="flex flex-wrap gap-x-6 gap-y-1 py-3 first:pt-0 last:pb-0">
              <dt class="w-28 shrink-0 text-[13.5px] sm:text-[14.5px] font-semibold text-ink-400">Label</dt>
              <dd class="min-w-0 text-[13.5px] sm:text-[14.5px] text-ink-800">${esc(s.label)}</dd>
            </div>
            <div class="flex flex-wrap gap-x-6 gap-y-1 py-3 first:pt-0 last:pb-0">
              <dt class="w-28 shrink-0 text-[13.5px] sm:text-[14.5px] font-semibold text-ink-400">Placed in</dt>
              <dd class="min-w-0 text-[13.5px] sm:text-[14.5px] text-ink-800">${esc(s.group)}</dd>
            </div>
            <div class="flex flex-wrap gap-x-6 gap-y-1 py-3 first:pt-0 last:pb-0">
              <dt class="w-28 shrink-0 text-[13.5px] sm:text-[14.5px] font-semibold text-ink-400">Path</dt>
              <dd class="min-w-0 text-[13.5px] sm:text-[14.5px] ${s.provisional ? 'text-orange-600 font-semibold' : 'text-ink-800'} nums">${esc(urlLine)}</dd>
            </div>
          </dl>
          ${s.note ? `<p class="mt-4 pt-4 border-t border-ink-100 text-[13.5px] sm:text-[14.5px] text-ink-600 leading-relaxed">${esc(s.note)}</p>` : ''}
        </div>

        <a href="index.html" class="btn-press inline-flex items-center gap-2 h-12 sm:h-14 pl-5 sm:pl-7 pr-2.5 rounded-full bg-ink-900 text-white text-[14px] sm:text-[15px] font-semibold hover:bg-ink-800 transition-colors duration-300">
          Back to the homepage
          <span class="icon-orb w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </div>
  </section>
</main>

<footer></footer>
</body>
</html>
`;
}

/* shell.js reads this list so the two never drift — a stub missing from the shell's
   page table would throw there, and duplicating twenty filenames guarantees that. */
module.exports = STUBS;
if (require.main !== module) return;

let written = 0;
for (const s of STUBS) {
  const file = s.slug + '.html';
  const next = page(s);
  const p = path.join(SITE, file);
  const prev = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  if (prev !== next) { fs.writeFileSync(p, next); written++; console.log('  write  ' + file); }
}
console.log('  ' + STUBS.length + ' stubs, ' + written + ' written');
console.log('  ' + STUBS.filter(s => s.provisional).length + ' provisional path(s): ' +
            STUBS.filter(s => s.provisional).map(s => s.slug).join(', '));
console.log('  next: node build/shell.js');
