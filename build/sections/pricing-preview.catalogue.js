/* Pricing preview — its catalogue entry (site/section-library.html, built by build/section-library.js).

   Every snippet is a section the template (build/sections/pricing-preview.js) rendered
   for an approved page, read back from site/ as it stands there — the approved copy, the
   approved configuration, the figures of the pricing data source — with only its anchor id
   renamed (catalogue-tools.js). Run after the page generators. */
const { sectionOf } = require('./catalogue-tools');

const previewOf = (file, id) => sectionOf(file, 'pricing-preview', id);

const snippets = [
  { file: 'pricing-preview-center.html', name: 'Pricing preview · по центру, рекомендований тариф виділено',
    about: 'Заголовок і перемикач періодів по центру; три картки, середня — темна й піднята, з позначкою Recommended. Під картками — примітка періоду (з даних) і тихе посилання. Перемикач і картки — два запечатані блоки: жодної цифри в них не змінюють. Копія — головна.',
    uses: 'index (головна)',
    html: previewOf('index.html', 'example-pricing') },
  { file: 'pricing-preview-split.html', name: 'Pricing preview · заголовок із карткою-приміткою, три однакові картки',
    about: 'data-layout="split": заголовок ліворуч, праворуч — картка-примітка з іскрою; перемикач біля лівого краю; три однакові білі картки з темними кнопками; під ними — світла кнопка на сторінку цін. Копія — Turnitin Alternative.',
    uses: 'turnitin-checker-alternative',
    html: previewOf('turnitin-checker-alternative.html', 'example-pricing-split') },
];

const pages = [
  ['index.html', 'section', 'center · tint · md', 'пігулка; перемикач по центру; рекомендований тариф темний; примітка періоду + тихе посилання'],
  ['turnitin-checker-alternative.html', 'section', 'split · tint · md · teal', 'вступ 64; картка-примітка; три однакові картки; світла кнопка'],
];

module.exports = {
  lead: 'Попередній перегляд тарифів на сторінці, яка не є сторінкою цін: заголовок, перемикач періодів, три картки тарифів і шлях до повного прайсу. Усі цифри — з єдиного джерела даних (build/pricing-data.js; у продакшні — віджет бекенду): редактор змінює лише текст навколо карток.',
  files: { template: 'build/sections/pricing-preview.js (перемикач і картки — build/pricing.js)', css: 'build/sections/pricing-preview.css', js: 'build/assets/js/60-pricing.js (перемикання періодів з острова даних), 20-motion.js (поява .rv)', contract: 'build/sections/pricing-preview.contract.js' },
  snippets, pages,
};
