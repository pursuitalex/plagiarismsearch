/* Reviews — its catalogue entry (site/section-library.html, built by build/section-library.js).

   Every snippet is a section the template (build/sections/reviews.js) rendered for an
   approved page, read back from site/ as it stands there — the reviews as their authors
   published them (build/reviews.js), the approved configuration — with only its anchor id
   renamed (catalogue-tools.js). Run after the page generators. */
const { sectionOf } = require('./catalogue-tools');

const reviewsOf = (file, id) => sectionOf(file, 'reviews-section', id);

const snippets = [
  { file: 'reviews-carousel.html', name: 'Reviews · стрічка на темній секції (carousel)',
    about: 'Вісім карток у стрічці, що гортається стрілками (з’являються при наведенні й фокусі) та крапками; під стрічкою — біла кнопка. Картки напівпрозорі, бо секція темна. Кожна картка — цитата справжнього відгуку: текст, ім’я й оцінка не редагуються по суті. Копія — головна.',
    uses: 'index (головна)',
    html: reviewsOf('index.html', 'example-reviews') },
  { file: 'reviews-grid.html', name: 'Reviews · три картки в ряд (grid)',
    about: 'data-layout="grid" на сірій секції: три білі картки, без пігулки. Відгуки подано мовою оригіналу — lang="en" на сітці, бо сторінка українська: перекладений відгук був би вже іншим текстом. Копія — українська сторінка.',
    uses: 'ua-plagiarism-check',
    html: reviewsOf('ua-plagiarism-check.html', 'example-reviews-grid') },
];

const pages = [
  ['index.html', 'section', 'carousel · dark · md · quiet', '8 відгуків (по два з Trustpilot, G2, SmartCustomer, Google Workspace Marketplace); пігулка; блок заголовка 720; біла кнопка'],
  ['ua-plagiarism-check.html', 'section', 'grid · tint · md', '3 відгуки (по одному з трьох платформ), lang="en"; блок заголовка 860; такт появи .06'],
];

module.exports = {
  lead: 'Відгуки користувачів: заголовок і набір карток — стрічкою, що гортається, або сіткою. Картка — цитата справжнього відгуку з платформи: редактор додає чи прибирає картку цілком, а текст, ім’я й оцінку змінює лише на інший справжній відгук.',
  files: { template: 'build/sections/reviews.js (відгуки — build/reviews.js)', css: 'build/sections/reviews.css', js: 'build/assets/js/45-carousel.js (стрілки й крапки стрічки), 44-review-rating.js (цифра й підпис оцінки за data-rating), 20-motion.js (поява .rv, .rv-kids)', contract: 'build/sections/reviews.contract.js' },
  snippets, pages,
};
