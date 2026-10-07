/* The nine figures of the FAQ & Support page — one per group of questions.

   IMAGES.md §3.5, type E: a schematic of OUR interface, built in HTML, never a generated
   picture and never a stock glyph (the live page has a stopwatch, a backpack, a medal).
   Each figure shows the thing its group's questions are about, with the product's own
   words on it — a control's label, a metric's name, a status chip — and at most one or
   two figures that mean something; everything else is a grey bar. Metric colours are the
   product's: plagiarism coral, AI rate teal, AI probability violet, citations mint.

   Every word and number on a figure is from the product's interface or from the group's
   own questions and answers (noted on each). Nothing here is a claim of its own: a
   figure repeats what the answers beside it say. They are decoration to a reader of the
   text, so each is aria-hidden.

   CSS: build/assets/css/34-faq-figures.css (.fg-*). Widths are classes (fg-w10 … fg-w90,
   a tenth of the row each), since the page carries no inline style. */
const bar = (w, cls = '') => `<i class="fg-bar fg-w${w}${cls ? ' ' + cls : ''}"></i>`;
const hl = (w, tone) => `<i class="fg-bar fg-hl is-${tone} fg-w${w}"></i>`;
const line = (...parts) => `<span class="fg-line">${parts.join('')}</span>`;
const lines = (...ls) => `<div class="fg-lines">${ls.join('')}</div>`;
const chip = (t, tone) => `<span class="fg-chip is-${tone}">${t}</span>`;
const num = (n, tone) => `<span class="fg-num is-${tone}">${n}</span>`;
const cap = t => `<span class="fg-cap">${t}</span>`;
const btn = (t, tone = '') => `<span class="fg-btn${tone ? ' is-' + tone : ''}">${t}</span>`;
const toggle = on => `<span class="fg-toggle${on ? ' is-on' : ''}"></span>`;
const row = (...parts) => `<div class="fg-row">${parts.join('')}</div>`;
const box = (...parts) => `<div class="fg-box">${parts.join('')}</div>`;
const gap = '<span class="fg-gap"></span>';
const metric = (label, tone, w, val = '', tick = '') => `<div class="fg-metric"><span>${label}</span><span class="fg-track"><i class="fg-fill is-${tone} fg-w${w}"></i>${tick ? `<i class="fg-tick fg-at${tick}"><b>${tick}%</b></i>` : ''}</span>${val ? `<b>${val}</b>` : '<b></b>'}</div>`;
const ico = paths => `<svg class="fg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
const I = {
  file:   '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  db:     '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  arrow:  '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  chev:   '<path d="m6 9 6 6 6-6"/>',
  check:  '<path d="M20 6 9 17l-5-5"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
};
const wrap = (...parts) => `<div data-slot="aside" class="fg" aria-hidden="true">
  <div class="fg-in">
${parts.map(p => '    ' + p).join('\n')}
  </div>
</div>`;

const FIGURES = [
  /* 1 · What is plagiarism? — a passage, the source it matches, and a quotation that is
     cited. "15%" is the score the group's second question asks about; "Plagiarism" and
     "Citations" are the report's legend. */
  () => wrap(
    metric('Plagiarism', 'coral', 15, '15%'),
    box(lines(
      line(bar(90)),
      line(num(1, 'coral'), hl(50, 'coral'), bar(30)),
      line(bar(70)),
      line(num(2, 'mint'), hl(40, 'mint'), bar(40)),
      line(bar(50)))),
    row(num(1, 'coral'), bar(40), gap, chip('15%', 'coral')),
    `<div class="fg-legend"><span class="is-coral">Plagiarism</span><span class="is-mint">Citations</span></div>`),

  /* 2 · General Inquiries — the questions are about what happens to a submitted paper
     ("will not be added to any databases") and about the API key. "Add to Storage" is the
     product's own control, drawn off; "API key" is the question's word, its value masked. */
  () => wrap(
    box(row(`<span class="fg-tile is-teal">${ico(I.file)}</span>`, `<div class="fg-stack">${bar(60)}${bar(40)}</div>`, gap, `<span class="fg-tile is-mint">${ico(I.shield)}</span>`)),
    row('<span class="fg-label">Add to Storage</span>', gap, toggle(false)),
    `<div class="fg-rule"></div>`,
    row('<span class="fg-label">API key</span>', gap, '<span class="fg-mask">••••••••••••</span>')),

  /* 3 · How it works? — the checker: the text box with the form's own placeholder, the file
     types the answer names, the form's own button, the check running, the result as the
     report's first metric and its list of sources. */
  () => wrap(
    box('<span class="fg-ph">Paste or type your text here</span>',
      row(`<span class="fg-tile is-ink">${ico(I.upload)}</span>`, chip('.doc', 'ink'), chip('.docx', 'ink'), chip('.pdf', 'ink'))),
    row(btn('Check for plagiarism'), gap),
    `<span class="fg-track fg-progress"><i class="fg-fill is-teal fg-w60"></i></span>`,
    metric('Plagiarism', 'coral', 20),
    row(num(1, 'coral'), bar(40), gap, bar(10, 'is-chip')),
    row(num(2, 'coral'), bar(30), gap, bar(10, 'is-chip'))),

  /* 4 · For universities — the two things the group asks about: the LMS (the answer names
     Moodle; "Assignment" is the Moodle activity the plugin serves) and a repository of the
     institution's own ("private repositories"). "Active" is the storage row's status chip. */
  () => wrap(
    box(row('<b>Moodle</b>', gap, chip('Assignment', 'ink')),
      row('<span class="fg-dot"></span>', bar(40), gap, `<span class="fg-track fg-mini"><i class="fg-fill is-coral fg-w30"></i></span>`),
      row('<span class="fg-dot"></span>', bar(30), gap, `<span class="fg-track fg-mini"><i class="fg-fill is-coral fg-w10"></i></span>`),
      row('<span class="fg-dot"></span>', bar(50), gap, `<span class="fg-track fg-mini"><i class="fg-fill is-coral fg-w50"></i></span>`)),
    box(row(`<span class="fg-tile is-teal">${ico(I.db)}</span>`, '<b>Private repository</b>'),
      row(`<span class="fg-glyph">${ico(I.file)}</span>`, bar(40), gap, chip('Active', 'mint')),
      row(`<span class="fg-glyph">${ico(I.file)}</span>`, bar(30), gap, chip('Active', 'mint')))),

  /* 5 · Paper Analysis Service — what the first answer says you get: a writing check with
     an editor's comments, and "An approximate grade" judged on the aspects it lists
     (grammar, organization of ideas, writing style, content, structure). */
  () => wrap(
    `<div class="fg-split">${box(lines(line(bar(90)), line(hl(30, 'teal'), bar(50)), line(bar(70)), line(bar(40), hl(30, 'teal')), line(bar(60))))}<div class="fg-notes">${row(num(1, 'teal'), `<div class="fg-stack">${bar(90)}${bar(60)}</div>`)}${row(num(2, 'teal'), `<div class="fg-stack">${bar(80)}${bar(40)}</div>`)}</div></div>`,
    cap('An approximate grade'),
    ...[['Grammar', 4], ['Organization of ideas', 3], ['Writing style', 4], ['Content', 5], ['Structure', 3]].map(([t, n]) =>
      row(`<span class="fg-label">${t}</span>`, gap, `<span class="fg-rate">${[1, 2, 3, 4, 5].map(k => `<i${k <= n ? ' class="is-on"' : ''}></i>`).join('')}</span>`))),

  /* 6 · Grammar, style, and spell checker — mistakes marked in the text with a correction
     beside one, the "Detect language" menu and the two buttons the answers name: "Free
     Check" and the red "Order Analysis". */
  () => wrap(
    box(lines(
      line(bar(30), bar(20, 'is-err'), bar(30)),
      line(bar(50), bar(20, 'is-err'), bar(10)),
      line(bar(70))),
      row(bar(20, 'is-struck'), `<span class="fg-glyph">${ico(I.arrow)}</span>`, bar(20, 'is-fix'), gap)),
    row(`<span class="fg-select">Detect language ${ico(I.chev)}</span>`, gap),
    row(btn('Free Check'), btn('Order Analysis', 'coral'), gap)),

  /* 7 · Readability score checker — the score on its scale from 0 to 100 (the answer: "a
     readability score in the range from 0 to 100"), and the four things the checker counts
     ("the words, sentences, syllables, and characters"). */
  () => wrap(
    row('<b>Readability score</b>', gap),
    `<div class="fg-scale"><span class="fg-scale-track"><i></i><i></i><i></i><i></i><i></i></span><span class="fg-pin fg-at60"></span></div>`,
    row('<span class="fg-end">0</span>', gap, '<span class="fg-end">100</span>'),
    `<div class="fg-cells">${['Words', 'Sentences', 'Syllables', 'Characters'].map(t => `<span class="fg-cell">${cap(t)}${bar(60)}</span>`).join('')}</div>`),

  /* 8 · Other — the account: the answers send the reader to "your current balance, usage
     statistics, subscriptions, and payment history". "Active" is the subscription's status. */
  () => wrap(
    box(row('<b>Balance</b>', gap, bar(20, 'is-chip')), `<span class="fg-track"><i class="fg-fill is-teal fg-w60"></i></span>`),
    box(row('<b>Subscriptions</b>', gap, chip('Active', 'mint'))),
    box(row('<b>Payment history</b>', gap),
      row(bar(30), bar(20), gap, `<span class="fg-tile is-mint is-sm">${ico(I.check)}</span>`),
      row(bar(40), bar(20), gap, `<span class="fg-tile is-mint is-sm">${ico(I.check)}</span>`))),

  /* 9 · AI checker — the form's two switches, the report's two AI metrics, AI passages
     marked in the text, and the answers' own words: the "Check Your Text" button and the
     70% of AI probability the last question asks about. */
  () => wrap(
    row(toggle(true), '<span class="fg-label">Check for plagiarism</span>'),
    row(toggle(true), '<span class="fg-label">Check for AI writing</span>'),
    `<div class="fg-rule"></div>`,
    metric('Total AI rate', 'teal', 40),
    metric('AI probability', 'violet', 80, '', 70),
    box(lines(line(bar(80)), line(hl(60, 'violet'), bar(20)), line(hl(70, 'violet')), line(bar(50)))),
    row(btn('Check Your Text'), gap)),
];

module.exports = { FIGURES };
