/* The interactive plagiarism report — one component, two pages.

   It lived inside build/home-v2.js until the University page needed it. DEC-0043 is
   explicit that the institutional page must reuse the approved report component from
   the homepage and must not create a university-specific report, so the alternative
   was a second copy of the same product evidence — the drift a shared module prevents,
   and the thing the brief forbids in the same sentence.

   Structure, labels and colour system are the product's; the document text is ours.
   Framing may change per page. The report SEMANTICS may not.

   The CSS these classes need (.cab-*) lives in each page's own style block, because
   the two pages carry different surrounding styles; the class names are the contract.
*/

/* ─────────────────────────────────────────────────────────────────────────────
   CABINET REPORT — the second treatment of block 4, modelled on the real report
   screen rather than on a card layout invented for the page.

   Copy is ours; the structure, labels and colour system are the product's. The
   percentages are a property of this sample document, not a claim about the tool —
   a different text gives different numbers, which is the whole point of showing a
   report at all.

   Passages that fall under two categories are drawn in one colour, not blended.
   Overlapping washes read as a third category that does not exist.
   ───────────────────────────────────────────────────────────────────────────── */
const CAB = {
  id: '#10248837',
  words: 214,
  uploaded: 'May 12, 2026',
  metrics: [
    ['Plagiarism',    '38.2%', 38.2, '#F36F5A'],
    ['Total AI rate', '12.4%', 12.4, '#A855F7'],
    ['AI probability', '0%',    0,   '#A855F7'],
  ],
  /* more than fits: the panel is cut off at the foot on purpose, the way a real
     report's source list runs past the fold */
  sources: [
    ['Climate volatility and agriculture vulnerability', 'nature.com/nclimate/vol-13', '31.6%'],
    ['Adaptation strategies in West African smallholding', 'cambridge.org/agricultural-economics', '6.6%'],
    ['Rain-fed yield variance under warming scenarios', 'sciencedirect.com/agsy/2024', '4.1%'],
    ['Millet cultivars and drought tolerance trials', 'fao.org/publications/cb9241', '2.8%'],
    ['Smallholder decision-making under uncertainty', 'jstor.org/stable/48729103', '1.9%'],
    ['Price transmission in West African grain markets', 'ifpri.org/publication/gm-2023', '1.2%'],
  ],
  legend: [
    ['Plagiarism', '#F36F5A'],
    ['Similarities', '#EAB308'],
    ['AI probability', '#A855F7'],
    ['Citations', '#22C55E'],
    ['References', '#3B82F6'],
  ],
  /* Each marked passage points at the source it came from, so selecting one can open
     the four fields the brief requires: Matched passage, Matching source, Source
     context, Similarity. */
  /* h — a heading line; p — body. mark: plag | ai | null. m — index into sources */
  doc: [
    { t: 'h', text: 'Climate change and the economics of food', mark: 'plag', m: 0 },
    { t: 'p', text: 'The economic implications of climate change extend beyond environmental damage and touch every part of modern agricultural systems.', mark: 'plag', m: 0 },
    { t: 'p', text: 'Recent studies have shown that rising global temperatures correlate with decreased yields in rain-fed regions, and that the effect compounds where irrigation is unavailable.', mark: 'plag', m: 1 },
    { t: 'p', text: 'However, smallholder farmers in West Africa have adapted through diversified cropping patterns and drought-resistant millet varieties.', mark: null },
    { t: 'h', text: 'What the models leave out', mark: null },
    { t: 'p', text: 'Most projections treat adaptation as a fixed parameter rather than a decision made season by season under uncertainty.', mark: 'ai', m: 2 },
    { t: 'p', text: 'Field data from recent seasons supports this reading across tropical zones, though the sample remains too small to generalise from with confidence.', mark: 'ai', m: 2 },
    { t: 'p', text: 'Further work should separate the price effect from the yield effect before either is used to guide policy.', mark: null },
  ],
};

/* Row, legend, metric and source renderers. The two newline constants keep the emitted
   markup indented the way the surrounding template expects. */
const NL14 = String.fromCharCode(10) + '              ';
const NL16 = String.fromCharCode(10) + '                ';

/* one line of the document, with its category wash */
const cabLine = l => {
  const cls = l.mark === 'plag' ? 'cab-mark cab-plag' : l.mark === 'ai' ? 'cab-mark cab-ai' : '';
  const size = l.t === 'h' ? 'text-[15.5px] sm:text-[16.5px] font-bold tracking-tight' : 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
  const inner = cls
    ? `<span class="${cls}" role="button" tabindex="0" data-match="${l.m}" aria-label="Matched passage — open its source"><span>${l.text}</span></span>`
    : l.text;
  return `<p class="${size} text-ink-800">${inner}</p>`;
};

/* ring in the category colour, centre the same colour at half strength — the dot reads
   as the wash it stands for rather than as a solid bullet */
const cabLegend = ([label, colour]) => `<span class="flex items-center gap-2 text-[12px] sm:text-[12.5px] font-medium text-ink-600">
                <span class="w-2.5 h-2.5 rounded-full ring-[1.5px] shrink-0" style="--tw-ring-color:${colour}; background:${colour}80"></span>${label}
              </span>`;

/* a metric row: label, bar, figure. The bar carries its width inline so a fill
   animation later has only to change one number. */
const cabMetric = ([label, figure, pct, colour]) => `<div class="cab-in mb-4 last:mb-0">
                <p class="text-[13.5px] sm:text-[14px] lg:text-[14.5px] font-semibold text-ink-700">${label}</p>
                <div class="flex items-center gap-3">
                  <span class="flex-1 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                    <span class="cab-bar block h-full rounded-full" style="width:${pct}%; background:${colour}"></span>
                  </span>
                  <span class="cab-figure shrink-0 w-14 text-right text-[13px] sm:text-[13.5px] font-bold nums" data-to="${pct}">${figure}</span>
                </div>
              </div>`;

const cabSource = ([title, url, pct], i) => `<li class="cab-src cab-in flex items-start justify-between gap-4 px-5 sm:px-6 py-4 transition-colors duration-300" data-src="${i}">
                <span class="min-w-0">
                  <span class="block text-[13px] sm:text-[13.5px] font-semibold tracking-tight truncate">${title}</span>
                  <span class="block text-[12px] text-ink-400 truncate">${url}</span>
                </span>
                <span class="shrink-0 rounded-full bg-orange-100 text-orange-700 px-2.5 py-1 text-[11.5px] font-bold nums">${pct}</span>
              </li>`;

module.exports = { CAB, cabLine, cabLegend, cabMetric, cabSource, NL14, NL16 };
