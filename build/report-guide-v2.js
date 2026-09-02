/* Build site/plagiarism-and-ai-check-report-v2.html.

   The same 26 blocks as v1, in the same order, through build/article.js — the template
   taken from the blog post. The point of the exercise is that this file styles nothing:
   it maps source blocks to block types and hands them over. Everything visual lives in
   the template, so the next text page is a list like this one and no layout work.

   What v1 and v2 actually differ on:

     v1  every section is designed — a dark band for the settings, a bento of seven
         cards for the categories, a legend for the colours, widths chosen per section.
     v2  one centred 700px column, a contents box built from the h2s, and semantic
         blocks. The seven categories become h3 + paragraph, which is what the blog
         does with a run of definitions; the colours become a list whose bullet IS
         the colour.

   Same words either way. build/check-report-guide-v2.js proves it against the same
   build/report-guide-data.json v1 is checked against.

     node build/report-guide-v2.js  →  node build/shell.js  →  node build/check-report-guide-v2.js
*/
const fs = require('fs');
const path = require('path');
const { page, style } = require('./article');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'plagiarism-and-ai-check-report-v2.html';

const src = require('./report-guide-data.json');
const B = src.paras;
if (B.length !== 26) throw new Error('expected 26 blocks, data has ' + B.length);

/* ── the same seams, the same assertions as v1 ────────────────────────────── */
const at = i => { const b = B[i]; if (!b) throw new Error('no block ' + i); return b; };
const listAt = i => { const b = at(i); if (!b.items || !b.items.length) throw new Error('block ' + i + ' is not a list'); return b; };
const textAt = i => { const b = at(i); if (b.items && b.items.length) throw new Error('block ' + i + ' is a list'); return b; };

const defineAt = i => {
  const m = textAt(i).t.match(/^(.+?)\s+[–-]\s+([\s\S]+)$/);
  if (!m) throw new Error('block ' + i + ' does not split into name and description');
  return { name: m[1].trim(), body: m[2].trim() };
};
const colourAt = i => {
  const m = textAt(i).t.match(/^((?:Dark|Light)\s+\w+|\w+)\s+([\s\S]+)$/);
  if (!m) throw new Error('block ' + i + ' does not split into a colour and a description');
  return { name: m[1].trim(), body: m[2].trim() };
};

const CATEGORIES = [11, 12, 13, 14, 15, 16, 17].map(defineAt);
const COLOURS = [19, 20, 21, 22, 23, 24].map(colourAt);

/* the same swatches v1 uses, so a colour means the same thing on both pages */
const SWATCH = {
  'Red': '#F36F5A', 'Yellow': '#E0A32B', 'Purple': '#9A6ADE',
  'Green': '#2FA36B', 'Dark blue': '#2B5FA8', 'Light blue': '#3FA9CF',
};
{
  const missing = COLOURS.filter(c => !SWATCH[c.name]);
  if (missing.length) throw new Error('no swatch for: ' + missing.map(c => c.name).join(', '));
}

/* ── the same five headings v1 writes, lifted from the sections they head ── */
const H2 = {
  why: 'Unique, and human-written',            /* block 1: "the text is 1) unique; 2) human-written" */
  before: 'Before you submit the text',        /* block 4: "before you submit the text for Plagiarism and AI Check" */
  shows: 'What the report shows',              /* block 8: "the report shows:" */
  rates: 'The categories behind the rates',    /* block 10: "…illustrated with such categories as" */
  colours: 'What the colours mean',            /* block 18: "highlighted with different colors" */
};

/* the live page prints an account URL and a support address as plain text; linked here
   so the words already on the page do what they say. No words added. */
const link = html => html
  .replace(/https:\/\/plagiarismsearch\.com\/account\/buy/g,
    '<a href="https://plagiarismsearch.com/account/buy" target="_blank" rel="noopener" class="nl">https://plagiarismsearch.com/account/buy</a>')
  .replace(/([a-z]+@plagiarismsearch\.com)/g, '<a href="mailto:$1" class="nl">$1</a>');

const p = i => ({ t: 'p', html: link(textAt(i).html) });

/* ── the article, as a list of blocks and nothing else ────────────────────── */
const blocks = [
  { t: 'h2', text: H2.why },
  p(0), p(1),
  { t: 'note', tone: 'teal', label: 'The classifier', html: link(textAt(2).html) },

  { t: 'h2', text: H2.before },
  p(3), p(4),
  { t: 'ul', items: listAt(5).itemsHtml },
  p(6),
  { t: 'ul', items: listAt(7).itemsHtml },

  { t: 'h2', text: H2.shows },
  p(8),
  { t: 'ol', items: listAt(9).itemsHtml },

  { t: 'h2', text: H2.rates },
  p(10),
  ...CATEGORIES.flatMap(c => [{ t: 'h3', text: c.name }, { t: 'p', html: c.body }]),

  { t: 'h2', text: H2.colours },
  p(18),
  { t: 'ul', marker: COLOURS.map(c => SWATCH[c.name]),
    items: COLOURS.map(c => '<strong class="font-bold text-ink-900">' + c.name + '</strong> ' + c.body) },

  p(25),
];

/* the blog's masthead carries author, date and read time. This guide has no byline and
   no date on the live page, so it carries what it does have: what it is, and how long
   it takes — counted from the blocks, not typed. */
const wordCount = blocks.reduce((n, b) => {
  const t = [b.text, b.html, ...(b.items || [])].filter(Boolean).join(' ').replace(/<[^>]+>/g, ' ');
  return n + (t.match(/\S+/g) || []).length;
}, 0);
const minutes = Math.max(1, Math.round(wordCount / 200));

const { html: articleHtml, headings, words } = page({
  breadcrumb: [['All guides', 'user-manuals.html'], 'Plagiarism and AI Check Report'],
  h1: src.h1,
  meta: ['User Guide', '<span class="nums">' + minutes + '</span> min read'],
  blocks,
});

/* ─────────────────────────────────────────────────────────────────────────────
   Assemble — the same head handling as every other page
   ───────────────────────────────────────────────────────────────────────────── */
const STYLE = `
<style>
  [hidden] { display: none !important; }
  section[id] { scroll-margin-top: 100px; }

  a:focus-visible, button:focus-visible,
  [tabindex]:focus-visible { outline: 2px solid #0CA9C3; outline-offset: 3px; border-radius: 4px; }

${style}

  /* a link inside body copy */
  .nl { font-weight:600; color:#06748A; text-decoration:underline;
        text-decoration-color:rgba(6,116,138,.32); text-underline-offset:2px;
        word-break:break-word; transition:color .2s ease, text-decoration-color .2s ease; }
  .nl:hover { color:#111827; text-decoration-color:rgba(17,24,39,.45); }
</style>`;

const SCRIPT = `<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script>
(() => {
  'use strict';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.gsap) { document.documentElement.classList.add('no-motion'); return; }
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.rv').forEach(el => {
    const inView = el.getBoundingClientRect().top < innerHeight * .9;
    gsap.to(el, inView
      ? { opacity: 1, y: 0, duration: .7, ease: 'power2.out', delay: .1 }
      : { opacity: 1, y: 0, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 80%' } });
  });
})();
<\/script>`;

const donor = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
let head = donor.slice(0, donor.indexOf('<body'));
head = head.replace(/<title>[\s\S]*?<\/title>/, '<title>' + src.meta.title + '</title>');
if (/name="description"/.test(head)) {
  head = head.replace(/<meta name="description"[^>]*>/,
    '<meta name="description" content="' + src.meta.description + '" />');
} else {
  head = head.replace('<title>', '<meta name="description" content="' + src.meta.description + '" />\n<title>');
}
head = head.replace('<title>', '<link rel="canonical" href="' + src.url + '" />\n<title>');

const bodyTag = donor.slice(donor.indexOf('<body'), donor.indexOf('>', donor.indexOf('<body')) + 1);

const out = head + STYLE + '\n' + bodyTag + `
<div class="grain"></div>

<header></header>

<main>
${articleHtml}
</main>

<footer></footer>

${SCRIPT}
</body>
</html>
`;

fs.writeFileSync(path.join(SITE, OUT), out);

const count = re => (out.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + out.length + ' bytes');
console.log('  ' + blocks.length + ' blocks → ' + count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' +
            count(/<p class="text-\[15.5px\]/g) + ' paragraphs, ' + count(/<li\b/g) + ' list items');
console.log('  contents: ' + headings.length + ' entries, ' + words + ' words');
