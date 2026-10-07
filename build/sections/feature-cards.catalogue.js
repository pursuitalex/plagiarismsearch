/* Feature cards — its catalogue entry (site/section-library.html, built by
   build/section-library.js).

   Every snippet is a section the template (build/sections/feature-cards.js) rendered for
   an approved page, read back from site/ as it stands there — the approved copy, the
   approved configuration — with only its anchor id renamed (catalogue-tools.js). Run
   after the page generators. */
const { sectionOf, kept } = require('./catalogue-tools');

/* the cards section of a page, under an example id; `own`: the section's id on the page,
   where the page has two */
const cardsOf = (file, id, own) => sectionOf(file, 'cards-section', id, own ? n => n.attrs.id === own : undefined);

const snippets = [
  { file: 'feature-cards-grid.html', name: 'Feature cards · сітка карток',
    about: 'Чотири картки: плитка з іконкою, назва, текст; остання — акцентна (data-tone="teal"). Під сіткою — одна світла кнопка. Копія — PDF.',
    uses: 'pdf-plagiarism-checker',
    html: cardsOf('pdf-plagiarism-checker.html', 'example-cards-grid') },
  { file: 'feature-cards-inline-head.html', name: 'Feature cards · заголовок у першій комірці',
    about: 'data-head="inline": заголовок і вступ стоять першою коміркою сітки, далі картки (тут п’ять); у тексті картки може бути посилання a.cards-link. Копія — Affiliate Program.',
    uses: 'жодна сторінка зараз — приклад збережено з першої версії Affiliate Program (сторінку прибрано 2026-10-07)',
    html: kept('feature-cards-inline-head.html') },
  { file: 'feature-cards-compact.html', name: 'Feature cards · картки сторінки API (compact)',
    about: 'data-size="compact": пласка плитка на найсвітлішому тоні, менший текст; на бірюзовому тлі. Копія — API.',
    uses: 'api (#api-use-cases)',
    html: cardsOf('api.html', 'example-cards-compact') },
  { file: 'feature-cards-lead.html', name: 'Feature cards · картки з кнопкою (lead)',
    about: 'data-size="lead": картка головної — плитка з обідком, більша назва, унизу картки кнопка (data-tone="ghost"). Копія — головна.',
    uses: 'index (головна)',
    html: cardsOf('index.html', 'example-cards-lead') },
  { file: 'feature-cards-panel.html', name: 'Feature cards · комірки одного аркуша (panel)',
    about: 'Три комірки на сірому аркуші з рисками між ними; плитки білі. Останній рядок аркуша — примітка і кнопка. Для білої секції. Копія — Business & Teams.',
    uses: 'plagiarism-checker-for-organization (#data-handling)',
    html: cardsOf('plagiarism-checker-for-organization.html', 'example-cards-panel') },
  { file: 'feature-cards-panel-bare.html', name: 'Feature cards · аркуш без заголовка',
    about: 'Той самий аркуш як коротка смуга (data-space="sm") без блока заголовка: секцію називає aria-label. Копія — Affiliate Program.',
    uses: 'affiliate-program-at-plagiarismsearch (#affiliate-tools)',
    html: cardsOf('affiliate-program-at-plagiarismsearch.html', 'example-cards-panel-bare', 'affiliate-tools') },
];

const pages = [
  ['pdf-plagiarism-checker.html', 'section', 'grid · cool · lg', '4 картки, остання акцентна; світла кнопка'],
  ['api.html (#api-use-cases)', 'section', 'grid · aqua · lg · compact', '3 картки; блок заголовка 760'],
  ['index.html', 'section', 'grid · cool · md · lead', '3 картки з кнопкою ghost; блок заголовка 720'],
  ['plagiarism-checker-for-organization.html (#data-handling)', 'section', 'panel · white · lg', '3 комірки; примітка і світла кнопка'],
  ['affiliate-program-at-plagiarismsearch.html (#affiliate-tools)', 'section', 'panel · white · sm', '3 комірки; без заголовка (aria-label)'],
];

module.exports = {
  lead: 'Набір рівноправних речей без нумерації — що продукт зберігає, пропонує чи для кого він: іконка, назва і кілька рядків. Дві розкладки: окремі картки або комірки одного аркуша.',
  files: { template: 'build/sections/feature-cards.js', css: 'build/sections/feature-cards.css', js: 'build/assets/js/20-motion.js (поява .rv і .rv-kids)', contract: 'build/sections/feature-cards.contract.js' },
  snippets, pages,
};
