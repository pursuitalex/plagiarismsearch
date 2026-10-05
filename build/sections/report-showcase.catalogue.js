/* Report showcase — its catalogue entry (site/section-library.html, built by build/section-library.js).

   Every snippet is a section the template (build/sections/report-showcase.js) rendered
   for an approved page, read back from site/ as it stands there — the approved copy, the
   approved configuration — with only its anchor id renamed (catalogue-tools.js). Run
   after the page generators. */
const { sectionOf } = require('./catalogue-tools');

const reportOf = (file, id) => sectionOf(file, 'report-showcase', id);

const snippets = [
  { file: 'report-showcase-dark.html', name: 'Report showcase · темна секція: три пункти і виноска',
    about: 'Основний вигляд: заголовок, звіт на темному тлі, під ним — смуга з трьох пронумерованих пунктів і бірюзова виноска. Звіт — запечатаний блок [data-slot="report"]: копіюється як є. Копія — PDF.',
    uses: 'pdf-plagiarism-checker, plagiarism-checker-for-organization, university-plagiarism-checker (два абзаци вступу)',
    html: reportOf('pdf-plagiarism-checker.html', 'example-report') },
  { file: 'report-showcase-pair.html', name: 'Report showcase · пара карток: принцип і виноска',
    about: 'Замість смуги й виноски — дві картки поруч (div.report-pair): біла картка-принцип із великим рядком і підкресленим словом та бірюзова виноска. Копія — Students.',
    uses: 'plagiarism-checker-for-students',
    html: reportOf('plagiarism-checker-for-students.html', 'example-report-pair') },
  { file: 'report-showcase-path.html', name: 'Report showcase · заголовок зі шляхом у пігулках',
    about: 'Заголовок ліворуч, праворуч — шлях у пігулках (ol.report-path), перша виділена. Під звітом — пара з ширшою другою карткою (data-split="tail"): тиха текстова картка і біла картка-твердження з плиткою. Звіт англійською (lang="en" на запечатаному блоці). Копія — українська сторінка.',
    uses: 'ua-plagiarism-check',
    html: reportOf('ua-plagiarism-check.html', 'example-report-path') },
  { file: 'report-showcase-quiet.html', name: 'Report showcase · темний акт головної (quiet)',
    about: 'data-tone="quiet": одне тепле світіння, тихіша шапка, підкреслене слово в заголовку; звіт із проходом сканера. Під звітом — примітка (p.report-caveat) і блок сторінки [data-slot="media"] — тут рядок інтеграцій. Копія — головна.',
    uses: 'index (головна)',
    html: reportOf('index.html', 'example-report-quiet') },
  { file: 'report-showcase-light.html', name: 'Report showcase · біла секція',
    about: 'data-bg="white": звіт у сірій рамці на білій секції — щоб на сторінці лишався один темний акт. Під ним — три пункти з іконками і помаранчева виноска. Копія — Turnitin Alternative.',
    uses: 'turnitin-checker-alternative',
    html: reportOf('turnitin-checker-alternative.html', 'example-report-light') },
];

const pages = [
  ['pdf-plagiarism-checker.html', 'section', 'dark · md · teal', 'блок заголовка 760, вступ 72; смуга з трьох пунктів; виноска'],
  ['plagiarism-checker-for-organization.html', 'section', 'dark · md · teal', 'блок заголовка 760, вступ 72; смуга з трьох пунктів; виноска'],
  ['university-plagiarism-checker.html', 'section', 'dark · md · teal', 'блок заголовка 760, два абзаци вступу; смуга з трьох пунктів; виноска'],
  ['plagiarism-checker-for-students.html', 'section', 'dark · md · teal', 'блок заголовка 760, вступ 72; пара: картка-принцип + виноска'],
  ['ua-plagiarism-check.html', 'section', 'dark · md · teal', 'заголовок зі шляхом, вступ 64; звіт lang="en"; пара tail: текстова картка + картка-твердження'],
  ['index.html', 'section', 'dark · md · quiet', 'блок заголовка 720, підкреслене слово; звіт із проходом сканера; примітка; блок сторінки (інтеграції)'],
  ['turnitin-checker-alternative.html', 'section', 'white · md', 'блок заголовка 760, вступ 72; звіт у рамці; три пункти з іконками + помаранчева виноска'],
];

module.exports = {
  lead: 'Секція, що показує звіт про перевірку: заголовок, сам звіт і кілька рядків про те, як його читати. Звіт — екран продукту, запечатаний блок: його не редагують, а копіюють цілком. Редактор змінює лише текст навколо.',
  files: { template: 'build/sections/report-showcase.js (звіт — build/report.js)', css: 'build/sections/report-showcase.css', js: 'build/assets/js/40-report.js (вибір фрагмента у звіті), 42-report-pass.js (прохід сканера на головній), 20-motion.js (поява .rv)', contract: 'build/sections/report-showcase.contract.js' },
  snippets, pages,
};
