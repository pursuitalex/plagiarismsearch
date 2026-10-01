/* Start free — its catalogue entry (site/section-library.html, built by
   build/section-library.js).

   Every snippet is a section the template (build/sections/start-free.js) rendered for an
   approved page, read back from site/ as it stands there — the approved copy, the
   approved configuration — with only its anchor id renamed (catalogue-tools.js). Run
   after the page generators. */
const { sectionOf } = require('./catalogue-tools');

const freeOf = (file, id) => sectionOf(file, 'start-free', id);

const snippets = [
  { file: 'start-free-open.html', name: 'Start free · текст і дві великі цифри (open)',
    about: 'Ліворуч пігулка, заголовок, один-два абзаци, кнопка до чекера і тихе посилання на тарифи; праворуч дві картки з цифрами — світла й темна. Копія — Students.',
    uses: 'plagiarism-checker-for-students; ua-plagiarism-check (один абзац, ритм md)',
    html: freeOf('plagiarism-checker-for-students.html', 'example-start-free') },
  { file: 'start-free-framed.html', name: 'Start free · в одному аркуші (framed)',
    about: 'Те саме в аркуші з подвійною рамкою: менші цифри і рядок-примітка з іконкою під ними. Копія — PDF.',
    uses: 'pdf-plagiarism-checker',
    html: freeOf('pdf-plagiarism-checker.html', 'example-start-free-framed') },
];

const pages = [
  ['plagiarism-checker-for-students.html', 'section', 'open · lg', 'два абзаци; кнопка + тихе посилання; 150 / 300'],
  ['ua-plagiarism-check.html', 'section', 'open · md', 'один абзац; кнопка + тихе посилання; 150 / 300; такт .06'],
  ['pdf-plagiarism-checker.html', 'section', 'framed · lg', 'два абзаци; кнопка + тихе посилання; 150 / 300; рядок під цифрами'],
];

module.exports = {
  lead: 'Вхід безкоштовно: що можна перевірити без оплати — двома цифрами поруч із реченням, яке їх називає, кнопкою назад до чекера і тихим посиланням на тарифи. Без цін і без таблиці.',
  files: { template: 'build/sections/start-free.js', css: 'build/sections/start-free.css', js: 'build/assets/js/20-motion.js (поява .rv і .rv-kids), 30-checker.js (курсор у полі чекера)', contract: 'build/sections/start-free.contract.js' },
  snippets, pages,
};
