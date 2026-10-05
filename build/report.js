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
                <p class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-700">${label}</p>
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
                  <span class="block text-[12px] text-ink-500 truncate">${url}</span>
                </span>
                <span class="shrink-0 rounded-full bg-orange-100 text-orange-800 px-2.5 py-1 text-[11.5px] font-bold nums">${pct}</span>
              </li>`;

/* ─────────────────────────────────────────────────────────────────────────────
   THE MOCK-UP, WHOLE — one renderer for every page that shows the report (the Section
   Library's Report showcase, build/sections/report-showcase.js, calls it).

   The block is the product's screen, not editor content: it is rendered here, marked
   data-slot="report" (sealed — copied as it is, the validator does not look inside) and
   wired by 40-report.js through [data-report]. Its markup keeps its utilities, as the
   quick-check form does.

     report.mock()                 the report on a dark ground: two white panels
     report.mock({ lang: 'en' })   …on a page in another language (the document is English)
     report.mock({ frame: true })  on a white ground: the panels in a grey frame, a hairline
                                   and the soft shadow instead of the deep one (Turnitin)
     report.mock({ pass: true })   the homepage's: the scan line sweeps the document once
                                   and the sidebar's figures follow (42-report-pass.js)

   The three renditions differ in what each approved page drew; nothing else may. */
const lines = (list, f, pad) => list.map(f).join('\n').split('\n').map(l => pad + l.trim()).join('\n');
function mock({ pass = false, frame = false, lang } = {}) {
  if (pass && frame) throw new Error('report: the pass is the dark report\'s (not framed)');
  const num = pass ? 'nums' : 'tabular-nums';
  const soft = pass ? ' bg-ink-50/60' : '';
  const panel = 'rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white text-ink-900 overflow-hidden ' + (frame ? 'ring-1 ring-black/5 shadow-diffuse' : 'shadow-diffuse-lg');
  const cabIn = pass ? 'cab-in ' : '';
  const grid = `grid lg:grid-cols-[1fr_360px] ${frame ? 'gap-3 sm:gap-4 lg:gap-5' : 'gap-4 sm:gap-5 lg:gap-6'} items-stretch`;
  const panels = `<div${pass ? ' data-report-doc' : ''} class="relative ${pass ? '' : 'min-w-0 '}${panel}">${pass ? `
  <div data-report-scan class="absolute left-0 right-0 top-[-80px] z-10 pointer-events-none opacity-0">
    <div class="h-px w-full bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
    <div class="cab-beam h-28 w-full"></div>
  </div>` : ''}
  <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 sm:px-6 lg:px-7 py-3.5 sm:py-4 lg:py-5 border-b border-ink-100${soft}">
    <span class="text-[13.5px] sm:text-[14.5px] font-bold tracking-tight ${num}">${CAB.id}</span>
    <span class="flex items-center gap-5 text-[12px] sm:text-[12.5px] ${pass ? 'text-ink-500' : 'text-ink-600'}">
      <span>Words: <b class="font-bold text-ink-800 ${num}">${CAB.words}</b></span>
      <span>Uploaded at: <b class="font-bold text-ink-800">${CAB.uploaded}</b></span>
    </span>
  </div>
  <div class="px-5 sm:px-6 lg:px-7 py-5 sm:py-6 lg:py-7 space-y-3.5">
${lines(CAB.doc, cabLine, '    ')}
  </div>
  <div class="cab-foot flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 gap-y-2 px-5 py-3.5 sm:py-4 lg:py-5 border-t border-ink-100 ${pass ? 'bg-ink-50/60' : 'bg-ink-50'}">
${lines(CAB.legend, cabLegend, '    ')}
  </div>
</div>
<div${pass ? ' data-report-side' : ''} class="flex flex-col ${pass ? '' : 'min-w-0 '}${panel}">
  <div class="shrink-0 px-5 sm:px-6 py-5 sm:py-6">
    <p class="${cabIn}text-[17px] sm:text-[18px] font-bold tracking-tight mb-5">Report information</p>
${lines(CAB.metrics, cabMetric, '    ')}
  </div>
  <div class="${cabIn}shrink-0 flex items-center gap-6 px-5 sm:px-6 border-b border-ink-200 bg-ink-100 text-[13.5px] font-semibold">
    <span class="cab-tab on pt-3">Plagiarism</span>
    <span class="cab-tab pt-3">AI</span>
  </div>
  <div class="cab-sources relative flex-1 min-h-[140px] overflow-hidden">
    <ul class="absolute inset-0 divide-y divide-ink-100">
${lines(CAB.sources, cabSource, '      ')}
    </ul>
  </div>
</div>`;
  const inset = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
  if (frame) return `<div data-slot="report" class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-ink-50 ring-1 ring-black/5 p-3 sm:p-4 lg:p-5">
  <div data-report class="${grid}">
${inset(panels, '    ')}
  </div>
</div>`;
  if (pass) return `<div data-report data-slot="report">
  <div class="${grid}">
${inset(panels, '    ')}
  </div>
</div>`;
  return `<div data-report data-slot="report" class="rv ${grid}"${lang ? ` lang="${lang}"` : ''}>
${inset(panels, '  ')}
</div>`;
}

module.exports = { CAB, cabLine, cabLegend, cabMetric, cabSource, NL14, NL16, mock };
