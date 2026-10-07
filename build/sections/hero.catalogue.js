/* Hero — its catalogue entry (site/section-library.html, built by build/section-library.js).

   Every snippet is a hero the template (build/sections/hero.js) rendered for an approved
   page, read back from site/ as it stands there — the approved copy, the approved
   configuration, the page's own checker or diagram in its sealed slot — with its anchor
   renamed (catalogue-tools.js), and the checker's button and field following the new
   anchor, as an editor would rename them. Run after the page generators. */
const { sectionOf } = require('./catalogue-tools');

/* the hero of a page, under an example id; the checker inside returns to that id and its
   label / field pair is named after it */
const heroOf = (file, id) => {
  const html = sectionOf(file, 'hero', id);
  const old = (html.match(/<a href="(#[^"]*)" class="btn-press group shrink-0/) || [])[1];
  return (old ? html.split(`href="${old}"`).join(`href="#${id}"`) : html)
    .replace(/(<label for=")[^"]*(" class="sr-only")/, `$1${id}-text$2`)
    .replace(/(<textarea id=")[^"]*(" data-checker-text)/, `$1${id}-text$2`);
};

const snippets = [
  { file: 'hero-split-path.html', name: 'Hero · чекер праворуч, під текстом шлях (split-aside)',
    about: 'Текст ліворуч, справжній чекер праворуч, під текстом — шлях у пігулках (ol.hero-path), одна з них поточна. На телефоні порядок: заголовок → чекер → шлях. Копія — Students.',
    uses: 'plagiarism-checker-for-students',
    html: heroOf('plagiarism-checker-for-students.html', 'example-hero-path') },
  { file: 'hero-split-facts.html', name: 'Hero · чекер праворуч, під текстом три цифри (split-aside)',
    about: 'Те саме, а під текстом — картка з трьома цифрами й реченням (.hero-facts) і тихе посилання під нею. Копія — PDF.',
    uses: 'pdf-plagiarism-checker',
    html: heroOf('pdf-plagiarism-checker.html', 'example-hero-facts') },
  { file: 'hero-split-notice.html', name: 'Hero · чекер праворуч, під текстом примітка з іконкою (split-aside)',
    about: 'З пігулкою над заголовком і меншим кеглем довгого заголовка (data-size="long"); під текстом — одне твердження поруч із плиткою-іконкою (.hero-notice). Копія — Turnitin Alternative.',
    uses: 'turnitin-checker-alternative',
    html: heroOf('turnitin-checker-alternative.html', 'example-hero-notice') },
  { file: 'hero-split.html', name: 'Hero · чекер праворуч, без блока під текстом (split)',
    about: 'Дві колонки по центру: текст і чекер; пропорції й кегль заголовка — української сторінки. Форма чекера лишається англійською (обгортка <div lang="en">). Копія — українська сторінка.',
    uses: 'ua-plagiarism-check',
    html: heroOf('ua-plagiarism-check.html', 'example-hero-split') },
  { file: 'hero-hub.html', name: 'Hero · текст із кнопками і схема (hub)',
    about: 'Без чекера: пігулка, заголовок, вступ, кнопка з тихим посиланням і примітка; праворуч — схема в запечатаному блоці [data-slot="media"]. Вступ ширший: data-measure="62". Копія — University.',
    uses: 'university-plagiarism-checker; affiliate-program-at-plagiarismsearch (без примітки, у блоці — картка з фактами)',
    html: heroOf('university-plagiarism-checker.html', 'example-hero-hub') },
  { file: 'hero-hub-two-leads.html', name: 'Hero · hub, два абзаци вступу',
    about: 'Те саме з двома абзацами вступу й обмеженою приміткою (data-measure="58"). Копія — Business & Teams.',
    uses: 'plagiarism-checker-for-organization',
    html: heroOf('plagiarism-checker-for-organization.html', 'example-hero-hub-leads') },
  { file: 'hero-center.html', name: 'Hero · заголовок над чекером (center)',
    about: 'Головна: заголовок розміру секції по центру, слова виринають одне за одним (data-hero-title), під ним — чекер на всю ширину колонки. Копія — головна.',
    uses: 'index (головна)',
    html: heroOf('index.html', 'example-hero-center') },
];

const pages = [
  ['index.html', 'section', 'center', 'заголовок, що виринає; чекер; рядок під чекером'],
  ['plagiarism-checker-for-students.html', 'section', 'split-aside', 'чекер; шлях у п’яти пігулках'],
  ['pdf-plagiarism-checker.html', 'section', 'split-aside', 'чекер; три цифри + посилання під карткою'],
  ['turnitin-checker-alternative.html', 'section', 'split-aside · title long', 'пігулка; чекер; примітка з іконкою'],
  ['ua-plagiarism-check.html', 'section', 'split', 'чекер (форма lang="en")'],
  ['plagiarism-checker-for-organization.html', 'section', 'hub · note 58', 'пігулка; два абзаци; кнопка + посилання; примітка; схема'],
  ['university-plagiarism-checker.html', 'section', 'hub · lead 62', 'пігулка; кнопка + посилання; примітка; схема'],
];

module.exports = {
  lead: 'Перша секція сторінки на світлому тлі з крапковим полем: H1 з одним підкресленим словом і один об’єкт поруч — справжній чекер або схема. Чекер і схема — запечатані блоки: копіюються як є.',
  files: { template: 'build/sections/hero.js', css: 'build/sections/hero.css', js: 'build/assets/js/18-pen-mark.js (перемальовує підкреслення), 22-hero-title.js (слова, що виринають), 20-motion.js, 30-checker.js', contract: 'build/sections/hero.contract.js' },
  snippets, pages,
};
