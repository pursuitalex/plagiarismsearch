/* Sources — its catalogue entry (site/section-library.html, built by build/section-library.js).

   Every snippet is a section the template (build/sections/sources.js) rendered for an
   approved page, read back from site/ as it stands there — the approved copy, the
   approved configuration — with only its anchor id renamed (catalogue-tools.js). Run
   after the page generators. */
const { sectionOf } = require('./catalogue-tools');

const sourcesOf = (file, id) => sectionOf(file, 'sources-section', id);

const snippets = [
  { file: 'sources-groups.html', name: 'Sources · дві групи і цифра (groups)',
    about: 'Дві групи з галочками — що шукати і що виключити; у кожному пункті назва й опис. Поруч темна картка з цифрою охоплення; під ними дві примітки, друга — тепла (data-tone="warm"). Копія — Students.',
    uses: 'plagiarism-checker-for-students',
    html: sourcesOf('plagiarism-checker-for-students.html', 'example-sources-groups') },
  { file: 'sources-groups-labels.html', name: 'Sources · групи з короткими підписами (головна)',
    about: 'data-items="labels": пункт — галочка і короткий підпис без опису; плитки з обідком; без приміток. Копія — головна.',
    uses: 'index (головна)',
    html: sourcesOf('index.html', 'example-sources-labels') },
  { file: 'sources-flow.html', name: 'Sources · «вхід → джерела» (flow)',
    about: 'Ліворуч запечатаний блок сторінки [data-slot="media"] (тут — «Input format: PDF»), стрілка, праворуч одна група з галочками. Копія — PDF.',
    uses: 'pdf-plagiarism-checker',
    html: sourcesOf('pdf-plagiarism-checker.html', 'example-sources-flow') },
  { file: 'sources-list.html', name: 'Sources · заголовок поруч з аркушем рядків (list)',
    about: 'Заголовок ліворуч (на десктопі їде за прокруткою), праворуч аркуш у подвійній рамці: рядок — плитка з іконкою, назва, опис; останній темний рядок каже, чого список стосується. Копія — Turnitin Alternative.',
    uses: 'turnitin-checker-alternative',
    html: sourcesOf('turnitin-checker-alternative.html', 'example-sources-list') },
  { file: 'sources-cells.html', name: 'Sources · аркуш із чотирьох комірок (cells)',
    about: 'Заголовок над аркушем; чотири комірки по дві в ряд: плитка з іконкою, вид («Джерело» / «Параметр»), назва, опис. Копія — українська сторінка.',
    uses: 'ua-plagiarism-check',
    html: sourcesOf('ua-plagiarism-check.html', 'example-sources-cells') },
];

const pages = [
  ['plagiarism-checker-for-students.html', 'section', 'groups · cool · lg · accent teal', '2 + 2 пункти з описом; цифра; дві примітки'],
  ['index.html', 'section', 'groups · labels · cool · md', '4 + 4 підписи; цифра; блок заголовка 720'],
  ['pdf-plagiarism-checker.html', 'section', 'flow · white · lg · accent teal', 'запечатаний вхід; стрілка; група з 4 пунктів'],
  ['turnitin-checker-alternative.html', 'section', 'list · cool · md · accent teal', '4 рядки; темний рядок'],
  ['ua-plagiarism-check.html', 'section', 'cells · cool · md · accent teal', '4 комірки; блок заголовка 860, вступ 72'],
];

module.exports = {
  lead: 'З чим порівнюється перевірка і що з неї можна виключити: джерела й налаштування сканування. Показано як доступне — галочками й плитками, ніколи перемикачами.',
  files: { template: 'build/sections/sources.js', css: 'build/sections/sources.css', js: 'build/assets/js/20-motion.js (поява .rv і .rv-kids)', contract: 'build/sections/sources.contract.js' },
  snippets, pages,
};
