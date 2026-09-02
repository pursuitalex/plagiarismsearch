/* Build site/plagiarism-and-ai-check-report.html from build/report-guide-data.json.

   The live page is one h1 and twenty-six blocks in a single column — no sub-headings at
   all, so a reader meets 6,000 characters as one wall. The redesign gives it structure.

   ── The rule this page was built under ────────────────────────────────────
   The logic is already in the writing, sequentially, and it must not be broken. So the
   sections are cuts along seams the text itself makes, and nothing is reordered:

     §2  blocks  0–2    why the check matters, and the classifier
     §3  blocks  3–7    getting access, then the settings to switch on
     §4  blocks  8–9    what the report shows
     §5  blocks 10–17   the intro to the rates, then the seven categories
     §6  blocks 18–24   the intro to the highlighting, then the six colours
     §7  block  25      the closing

   Every block appears exactly once, in its original position. build/check-report-guide.js
   proves that: it walks the rendered text and fails if any block is missing, reworded, or
   out of sequence.

   ── What is written here ──────────────────────────────────────────────────
   The eyebrows, and five section headings, each lifted from the words of the section it
   heads — "Before you submit" from block 4, "the report shows" from block 8, and so on.
   Nothing else. No sentence was rewritten, cut or added.

   Refresh the source deliberately, it is not part of the page build:
     node build/report-guide-fetch.js  →  node build/report-guide.js
     →  node build/shell.js  →  node build/check-report-guide.js  →  node build/check.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'plagiarism-and-ai-check-report.html';

const src = require('./report-guide-data.json');
const B = src.paras;
if (B.length !== 26) throw new Error('expected 26 blocks, data has ' + B.length);

/* ── the seams, asserted rather than assumed ──────────────────────────────── */
const at = i => { const b = B[i]; if (!b) throw new Error('no block ' + i); return b; };
const listAt = i => { const b = at(i); if (!b.items || !b.items.length) throw new Error('block ' + i + ' is not a list'); return b; };
const textAt = i => { const b = at(i); if (b.items && b.items.length) throw new Error('block ' + i + ' is a list'); return b; };

/* "Plagiarism – for example, 30% …" → name + rest. Block 14 uses a hyphen, the rest an
   en dash, so both are accepted; a block that does not split at all throws. */
const defineAt = i => {
  const m = textAt(i).t.match(/^(.+?)\s+[–-]\s+([\s\S]+)$/);
  if (!m) throw new Error('block ' + i + ' does not split into name and description');
  return { name: m[1].trim(), body: m[2].trim() };
};

/* "Dark blue represents the references." → colour + rest */
const colourAt = i => {
  const m = textAt(i).t.match(/^((?:Dark|Light)\s+\w+|\w+)\s+([\s\S]+)$/);
  if (!m) throw new Error('block ' + i + ' does not split into a colour and a description');
  return { name: m[1].trim(), body: m[2].trim() };
};

const CATEGORIES = [11, 12, 13, 14, 15, 16, 17].map(defineAt);
const COLOURS = [19, 20, 21, 22, 23, 24].map(colourAt);

/* The swatches. Red and Purple are the marks the report demo on ai-detector-v2 already
   uses for plagiarism and AI, so the same idea wears the same colour across the site;
   the other four are the palette's nearest tone to the name the text gives them. The
   text names a colour, so the swatch shows that colour — nothing is being decided here
   beyond which red. */
const SWATCH = {
  'Red': '#F36F5A', 'Yellow': '#E0A32B', 'Purple': '#9A6ADE',
  'Green': '#2FA36B', 'Dark blue': '#2B5FA8', 'Light blue': '#3FA9CF',
};
{
  const missing = COLOURS.filter(c => !SWATCH[c.name]);
  if (missing.length) throw new Error('no swatch for: ' + missing.map(c => c.name).join(', '));
}

/* one Lucide glyph per category, in the order the text introduces them */
const CAT_ICON = [
  '<path d="m8 11 2 2 4-4"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
  '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M7 16h8"/><path d="M7 11h12"/><path d="M7 6h3"/>',
  '<path d="M17 6H3"/><path d="M21 12H8"/><path d="M21 18H8"/><path d="M3 12v6"/>',
  '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',
  '<path d="m18 5-3-3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"/><path d="M15 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>',
];
if (CAT_ICON.length !== CATEGORIES.length) throw new Error('icon count does not match category count');

/* ─────────────────────────────────────────────────────────────────────────────
   Written copy — the whole of it
   ───────────────────────────────────────────────────────────────────────────── */
const WRITTEN = {
  eyebrow1: 'User Guide',
  eyebrow2: 'Why it matters',
  eyebrow3: 'Before you check',
  eyebrow4: 'The report',
  eyebrow5: 'The rates',
  eyebrow6: 'Highlighting',
  /* each lifted from the section it heads */
  h2why: 'Unique, and human-written',              /* block 1: "the text is 1) unique; 2) human-written" */
  h2before: 'Before you submit the text',          /* block 4: "before you submit the text for Plagiarism and AI Check" */
  h2shows: 'What the report shows',                /* block 8: "the report shows:" */
  h2rates: 'The categories behind the rates',      /* block 10: "these rates are illustrated with such categories as" */
  h2colours: 'What the colours mean',              /* block 18: "highlighted with different colors" */
  backLabel: 'All guides',
};

/* ─────────────────────────────────────────────────────────────────────────────
   Destinations. The live page prints two of them as plain text — an account URL and a
   support address — so they are linked here. That adds no words; it makes the words
   already on the page do what they say.
   ───────────────────────────────────────────────────────────────────────────── */
const linkify = html => html
  .replace(/https:\/\/plagiarismsearch\.com\/account\/buy/g,
    '<a href="https://plagiarismsearch.com/account/buy" target="_blank" rel="noopener" class="nl">https://plagiarismsearch.com/account/buy</a>')
  .replace(/([a-z]+@plagiarismsearch\.com)/g, '<a href="mailto:$1" class="nl">$1</a>');

const rich = i => linkify(textAt(i).html);

/* ── shared idioms, as the v2 pages use them ─────────────────────────────── */
const eyebrow = (dot, label) => `        <div class="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">${label}</span>
        </div>`;

const eyebrowDark = (dot, label) => `        <div class="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/80">${label}</span>
        </div>`;

const h2 = t => `<h2 class="text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]">${t}</h2>`;

/* ── Widths ──────────────────────────────────────────────────────────────────
   Olex: the 700 cap belongs to a long text block, if the page has one — everything
   else lays out like every other page. It does not, so it should not be on
   everything, and it no longer is.

   One LEFT EDGE for the whole page; only the right edge moves, and it moves by what
   the block is. That is what the other pages do, and it is what stops the layout
   looking ragged without pretending a section heading is a paragraph.

     HERO   820   the h1 block; 820 is a width this site already uses for one
     HEAD   760   eyebrow + h2 + the single line under it. Nine blocks across the v2
                  pages already use 760 for exactly that
     READ   700   the one long run of prose here — §2's two paragraphs, 646 and 671
                  characters. Nothing else on the page is long enough to need it: the
                  other leads run 113 to 441 characters, one paragraph each
     WIDE  1080   card grids and the colour legend

   Body copy keeps the blog post's ramp, so this page adds no size architecture. */
const HERO = 'max-w-[820px]';
const HEAD = 'max-w-[760px]';
const READ = 'max-w-[700px]';
const WIDE = 'max-w-[1080px]';
const BODY = 'text-[15.5px] sm:text-[16px] lg:text-[17px] leading-[1.72]';

const PROSE = BODY + ' text-ink-700';
const PROSE_DARK = BODY + ' text-white/75';

/* ═══════════════ 01 · HERO ═══════════════ */
const section1 = () => `  <!-- ================= 01 · HERO =================
       The heading is the live page's own and it is long — 55 characters, so it takes the
       S tier of the three H1 ceilings in DESIGN.md, not the L one. The line under it is
       the page's own meta description. -->
  <section id="report-guide" class="relative pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-14 lg:pb-16 bg-white overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="orb absolute" style="width:640px;height:620px;left:-12%;top:-250px;background:rgba(154,106,222,.14)"></div>
    </div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv ${HERO}">
        <div class="mb-5"><a href="user-manuals.html" class="inline-flex items-center gap-2 text-[12.5px] sm:text-[13px] font-semibold text-ink-500 hover:text-ink-900 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
          ${WRITTEN.backLabel}
        </a></div>
${eyebrow('orange-500', WRITTEN.eyebrow1)}
        <h1 class="text-[clamp(2.4rem,5.5vw,3.6rem)] font-extrabold tracking-tightest leading-[1.04] mb-4 lg:mb-5">${src.h1}</h1>
        <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600">${src.meta.description}</p>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · WHY ═══════════════ */
const section2 = () => `  <!-- ================= 02 · WHY IT MATTERS · blocks 0-2 =================
       Three paragraphs that were three paragraphs. The only change is that the third,
       which is the one that says what PlagiarismSearch actually does about it, is lifted
       onto its own ground instead of being the last of three identical columns. -->
  <section id="why-check" class="relative py-14 sm:py-18 lg:py-24 bg-[#F7F9FA]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv ${HEAD} mb-7 sm:mb-8">
${eyebrow('teal-400', WRITTEN.eyebrow2)}
        ${h2(WRITTEN.h2why)}
      </div>

      <div class="rv ${READ} space-y-4 mb-7 lg:mb-8">
        <p class="${PROSE}">${rich(0)}</p>
        <p class="${PROSE}">${rich(1)}</p>
      </div>

      <div class="rv ${HEAD} rounded-3xl sm:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-6 sm:p-7 lg:p-8">
        <div class="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
          <span class="shrink-0 w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B84431" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/></svg>
          </span>
          <p class="${PROSE.replace('text-ink-600', 'text-ink-700')}">${rich(2)}</p>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · BEFORE YOU SUBMIT ═══════════════ */
const optionChips = (i, tint) => `            <div class="flex flex-wrap gap-2">
${listAt(i).itemsHtml.map(o => `              <span class="inline-flex items-center gap-2 rounded-full bg-white/[.07] ring-1 ring-white/15 px-3.5 py-2 text-[13px] sm:text-[13.5px] font-semibold text-white/90">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${tint}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                ${o}
              </span>`).join('\n')}
            </div>`;

const section3 = () => `  <!-- ================= 03 · BEFORE YOU SUBMIT · blocks 3-7 =================
       Access first, then the two settings — the order the text gives them. The option
       names are the product's own, printed as the switches they describe rather than as
       two more bullet lists, which is what they are on the live page. -->
  <section id="before-you-submit" class="relative py-14 sm:py-18 lg:py-24 bg-ink-950 overflow-hidden">
    <div class="orb absolute" style="width:720px;height:680px;right:-12%;top:-260px;background:rgba(44,195,219,.18)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv ${HEAD} mb-7 sm:mb-9">
${eyebrowDark('teal-400', WRITTEN.eyebrow3)}
        <h2 class="text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08] text-white">${WRITTEN.h2before}</h2>
      </div>

      <div class="rv ${HEAD} mb-7 lg:mb-9">
        <p class="${PROSE_DARK}">${rich(3)}</p>
      </div>

      <div class="rv-kids grid lg:grid-cols-2 gap-4 sm:gap-5 ${WIDE}">
${[[4, 5, '#5AD3E4'], [6, 7, '#F58971']].map(([lead, list, tint]) => `        <div class="min-w-0 rounded-3xl sm:rounded-4xl bg-white/[.05] ring-1 ring-white/10 p-6 sm:p-7">
          <p class="text-[13.5px] sm:text-[14.5px] leading-relaxed text-white/70 mb-5">${rich(lead)}</p>
${optionChips(list, tint)}
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · WHAT THE REPORT SHOWS ═══════════════ */
const section4 = () => `  <!-- ================= 04 · WHAT THE REPORT SHOWS · blocks 8-9 =================
       Seven things, so seven rows rather than a bullet list running the width of the
       page. The example timestamp in the first row is the live page's own. -->
  <section id="report-shows" class="relative py-14 sm:py-18 lg:py-24 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv ${HEAD} mb-7 sm:mb-9">
${eyebrow('orange-500', WRITTEN.eyebrow4)}
        ${h2(WRITTEN.h2shows)}
        <p class="mt-4 lg:mt-5 ${PROSE}">${rich(8)}</p>
      </div>

      <div class="rv-kids grid sm:grid-cols-2 gap-3 sm:gap-4 ${WIDE}">
${listAt(9).itemsHtml.map((row, n) => `        <div class="min-w-0 flex items-start gap-3.5 rounded-2xl sm:rounded-[20px] bg-[#F7F9FA] ring-1 ring-black/5 px-4 py-4 sm:px-5">
          <span class="shrink-0 inline-flex w-7 h-7 rounded-full bg-white ring-1 ring-black/5 items-center justify-center text-[11.5px] font-bold tabular-nums text-ink-500">${n + 1}</span>
          <span class="min-w-0 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-700">${row}</span>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 05 · THE CATEGORIES ═══════════════ */
const section5 = () => `  <!-- ================= 05 · THE CATEGORIES · blocks 10-17 =================
       Seven definitions that were seven paragraphs starting "Name – ". Each keeps its
       name and its sentence exactly; only the dash becomes a card. -->
  <section id="report-categories" class="relative py-14 sm:py-18 lg:py-24 bg-[#F7F9FA]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv ${HEAD} mb-7 sm:mb-9">
${eyebrow('teal-400', WRITTEN.eyebrow5)}
        ${h2(WRITTEN.h2rates)}
        <p class="mt-4 lg:mt-5 ${PROSE}">${rich(10)}</p>
      </div>

      <div class="rv-kids grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 ${WIDE}">
${CATEGORIES.map((c, n) => `        <div class="min-w-0 ${n === 3 ? 'sm:col-span-2 lg:col-span-1' : ''} rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7 flex flex-col">
          <span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] bg-ink-100 items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CAT_ICON[n]}</svg>
          </span>
          <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-2">${c.name}</h3>
          <p class="flex-1 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600">${c.body}</p>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · THE COLOURS ═══════════════ */
const section6 = () => `  <!-- ================= 06 · THE COLOURS · blocks 18-24 =================
       Six colours described in words on the live page and never shown. Each row carries
       the colour it names, and the mark is the same shape the report demo on
       ai-detector-v2 uses, so a highlighted sentence looks the same wherever it appears.
       Red and Purple are that page's own plagiarism and AI marks. -->
  <section id="report-colours" class="relative py-14 sm:py-18 lg:py-24 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv ${HEAD} mb-7 sm:mb-9">
${eyebrow('orange-500', WRITTEN.eyebrow6)}
        ${h2(WRITTEN.h2colours)}
        <p class="mt-4 lg:mt-5 ${PROSE}">${rich(18)}</p>
      </div>

      <div class="rv ${WIDE} rounded-3xl sm:rounded-4xl bg-[#F7F9FA] ring-1 ring-black/5 p-2 sm:p-2.5">
        <div class="rounded-[18px] sm:rounded-3xl bg-white divide-y divide-ink-100">
${COLOURS.map(c => `          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 px-5 py-4 sm:px-6 sm:py-4.5">
            <span class="shrink-0 sm:w-[152px] inline-flex items-center gap-3">
              <span class="shrink-0 w-5 h-5 rounded-md ring-1 ring-black/10" style="background:${SWATCH[c.name]}" aria-hidden="true"></span>
              <span class="text-[14.5px] sm:text-[15px] font-bold tracking-tight">${c.name}</span>
            </span>
            <span class="min-w-0 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600">${c.body}</span>
          </div>`).join('\n')}
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 07 · CLOSING ═══════════════ */
const section7 = () => `  <!-- ================= 07 · CLOSING · block 25 =================
       The live page's last paragraph, kept as its last paragraph. The link under it goes
       back to the guide index, which is how a reader arrives here. -->
  <section id="report-closing" class="relative py-14 sm:py-18 lg:py-24 bg-ink-950 overflow-hidden">
    <div class="orb absolute" style="width:700px;height:660px;left:-10%;bottom:-300px;background:rgba(154,106,222,.18)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv ${READ}">
        <p class="text-[15.5px] sm:text-[16.5px] lg:text-[17.5px] font-semibold tracking-tight leading-[1.5] text-white">${rich(25)}</p>
        <a href="user-manuals.html" class="btn-press group inline-flex items-center gap-2.5 mt-7 rounded-full bg-white hover:bg-ink-100 transition-colors duration-300 text-ink-900 text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
          ${WRITTEN.backLabel}
          <span class="hidden sm:flex w-8 h-8 rounded-full bg-ink-900/10 items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </div>
  </section>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Style and behaviour
   ───────────────────────────────────────────────────────────────────────────── */
const STYLE = `
<style>
  [hidden] { display: none !important; }
  section[id] { scroll-margin-top: 100px; }

  a:focus-visible, button:focus-visible,
  [tabindex]:focus-visible { outline: 2px solid #0CA9C3; outline-offset: 3px; border-radius: 4px; }
  .bg-ink-950 a:focus-visible { outline-color: #6ED7E8; }

  .rv-kids > * { opacity:0; transform:translateY(40px); }
  .no-motion .rv-kids > * { opacity:1 !important; transform:none !important; }

  /* a link inside body copy; the ground picks the colour */
  .nl { font-weight:600; text-decoration:underline; text-underline-offset:2px;
        transition:color .2s ease, text-decoration-color .2s ease; word-break:break-word; }
  .nl { color:#06748A; text-decoration-color:rgba(6,116,138,.32); }
  .nl:hover { color:#111827; text-decoration-color:rgba(17,24,39,.45); }
  .bg-ink-950 .nl { color:#6ED7E8; text-decoration-color:rgba(110,215,232,.35); }
  .bg-ink-950 .nl:hover { color:#fff; text-decoration-color:rgba(255,255,255,.6); }
</style>`;

const SCRIPT = `<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script>
(() => {
  'use strict';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.gsap) { document.documentElement.classList.add('no-motion'); return; }

  gsap.registerPlugin(ScrollTrigger);

  const rvs = gsap.utils.toArray('.rv');
  const inView = rvs.filter(el => el.getBoundingClientRect().top < innerHeight * .9);
  inView.forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      delay: .1 + (el.getBoundingClientRect().top / innerHeight) * .3 });
  });
  rvs.filter(el => !inView.includes(el)).forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 70%' } });
  });

  gsap.utils.toArray('.rv-kids').forEach(group => {
    gsap.to(group.children, { opacity: 1, y: 0, duration: .7, ease: 'power2.out', stagger: .07,
      scrollTrigger: { trigger: group, start: 'top 80%' } });
  });
})();
<\/script>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Assemble
   ───────────────────────────────────────────────────────────────────────────── */
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

const html = head + STYLE + '\n' + bodyTag + `
<div class="grain"></div>

<header></header>

<main>
${[section1, section2, section3, section4, section5, section6, section7].map(f => f()).join('\n\n')}
</main>

<footer></footer>

${SCRIPT}
</body>
</html>
`;

fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' +
            count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3');
console.log('  ' + CATEGORIES.length + ' categories, ' + COLOURS.length + ' colours, ' +
            listAt(9).items.length + ' report rows, ' +
            (listAt(5).items.length + listAt(7).items.length) + ' option chips');
