/* Steps — its catalogue entry (site/section-library.html, built by build/section-library.js).

   Every snippet is a section the template (build/sections/steps.js) rendered for an
   approved page, read back from site/ as it stands there — the approved copy, the
   approved configuration — with only its anchor id renamed (catalogue-tools.js). Run
   after the page generators. */
const { sectionOf, kept } = require('./catalogue-tools');

/* the steps section of a page, under an example id; `own`: the section's id on the page,
   where the page has two */
const stepsOf = (file, id, own) => sectionOf(file, 'steps-section', id, own ? n => n.attrs.id === own : undefined);

const snippets = [
  { file: 'steps-rail.html', name: 'Steps · лінія зі станціями (rail)',
    about: 'Чотири станції на одній лінії: плитка з іконкою, номер, назва, текст. Під списком — панель-примітка з кнопкою (на білій секції панель сіра). Копія — Students.',
    uses: 'plagiarism-checker-for-students',
    html: stepsOf('plagiarism-checker-for-students.html', 'example-steps-rail') },
  { file: 'steps-rail-3.html', name: 'Steps · лінія, три станції, кнопка під списком',
    about: 'data-cols="3" на холодному тлі: без пігулки і вступу, під списком — одна світла кнопка (div.steps-actions). Копія — Turnitin Alternative.',
    uses: 'turnitin-checker-alternative',
    html: stepsOf('turnitin-checker-alternative.html', 'example-steps-rail-3') },
  { file: 'steps-rail-apart.html', name: 'Steps · лінія, остання станція окремо',
    about: 'data-last="apart": остання станція — окрема дія, тому вона в пунктирній рамці, а лінія закінчується перед нею. Копія — українська сторінка.',
    uses: 'ua-plagiarism-check (#your-document)',
    html: stepsOf('ua-plagiarism-check.html', 'example-steps-rail-apart', 'your-document') },
  { file: 'steps-rail-disc.html', name: 'Steps · лінія з великими номерами (disc)',
    about: 'data-marker="disc": замість іконок — великі круглі номери, останній темний; під списком — виноска з плиткою-іконкою (div.steps-callout). Копія — українська сторінка.',
    uses: 'ua-plagiarism-check (#how-to-read)',
    html: stepsOf('ua-plagiarism-check.html', 'example-steps-rail-disc', 'how-to-read') },
  { file: 'steps-cards-linked.html', name: 'Steps · картки з рисками між ними (cards)',
    about: 'Картка на крок: плитка з іконкою й номер в одному рядку, назва, текст; data-link="line" з’єднує картки рисками. Копія — PDF.',
    uses: 'pdf-plagiarism-checker',
    html: stepsOf('pdf-plagiarism-checker.html', 'example-steps-cards') },
  { file: 'steps-cards-stack.html', name: 'Steps · картки головної (icon-stack)',
    about: 'data-marker="icon-stack": плитка з обідком зверху, номер перед назвою; світіння на бірюзовому тлі; під списком — біла панель-примітка з великою кнопкою (data-tone="ghost"). Копія — головна.',
    uses: 'index (головна)',
    html: stepsOf('index.html', 'example-steps-stack') },
  { file: 'steps-cards-badge.html', name: 'Steps · картки з круглим номером (badge)',
    about: 'data-marker="badge": на білій секції картки сірі, без тіні. Під списком — запечатаний блок сторінки [data-slot="media"] (тут — схема асинхронного запиту). Копія — API.',
    uses: 'api',
    html: stepsOf('api.html', 'example-steps-badge') },
  { file: 'steps-cards-compact.html', name: 'Steps · компактні картки (badge-sm)',
    about: 'data-marker="badge-sm": менший номер, три картки в ряд уже з 640px; на бірюзовому тлі картки білі. Під списком — рядок із тихим посиланням (div.steps-more). Копія — AI Detector.',
    uses: 'ai-detector',
    html: stepsOf('ai-detector.html', 'example-steps-compact') },
  { file: 'steps-rows.html', name: 'Steps · рядки на одному аркуші (rows)',
    about: 'Один аркуш у подвійній рамці, рядок на крок: велика цифра, назва з мітками, текст. Копія — Business & Teams.',
    uses: 'plagiarism-checker-for-organization',
    html: stepsOf('plagiarism-checker-for-organization.html', 'example-steps-rows') },
  { file: 'steps-rows-icon.html', name: 'Steps · рядки з іконкою і підписом (rows, icon)',
    about: 'data-marker="icon": у рядку ще плитка з іконкою та підпис «Step 1» над назвою; аркуш — список <ol>. Копія — Affiliate Program.',
    uses: 'жодна сторінка зараз — приклад збережено з першої версії Affiliate Program (сторінку прибрано 2026-10-07)',
    html: kept('steps-rows-icon.html') },
];

const pages = [
  ['plagiarism-checker-for-students.html', 'section', 'rail · icon · white · lg', '4 станції; панель-примітка зі світлою кнопкою'],
  ['turnitin-checker-alternative.html', 'section', 'rail · icon · cool · md', '3 станції; світла кнопка'],
  ['ua-plagiarism-check.html (#your-document)', 'section', 'rail · icon · cool · md · last apart', '4 станції, остання окремо; вступ 72'],
  ['ua-plagiarism-check.html (#how-to-read)', 'section', 'rail · disc · white · md', '3 кроки; виноска'],
  ['pdf-plagiarism-checker.html', 'section', 'cards · icon · white · md · link line', '3 картки з рисками'],
  ['index.html', 'section', 'cards · icon-stack · aqua · md', '4 картки; світіння; панель-примітка з кнопкою ghost; блок заголовка 720'],
  ['api.html', 'section', 'cards · badge · white · lg', '4 картки (<div>); запечатана схема; блок заголовка 760'],
  ['ai-detector.html', 'section', 'cards · badge-sm · aqua · lg', '3 картки (<div>); рядок із посиланням; блок заголовка 760'],
  ['plagiarism-checker-for-organization.html', 'section', 'rows · white · lg', '3 рядки з мітками'],
];

module.exports = {
  lead: 'Пронумерована послідовність: що відбувається і в якому порядку. Три розкладки — лінія зі станціями, картки, рядки на одному аркуші — і свій спосіб позначити крок у кожній.',
  files: { template: 'build/sections/steps.js', css: 'build/sections/steps.css', js: 'build/assets/js/20-motion.js (поява .rv і .rv-kids)', contract: 'build/sections/steps.contract.js' },
  snippets, pages,
};
