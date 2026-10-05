/* Stat rail — the content contract: what an editor may change in the rail's HTML, and what not.

   Read by build/sections/stat-rail.check.js (the validator, run by build/check-library.js),
   by the template (build/sections/stat-rail.js takes its variant values from here) and by
   build/section-library.js (the catalogue page, site/section-library.html). One source,
   so the rules an editor reads are the rules the validator applies.

   The rule of thumb for the CMS: change the FIGURES, the LABELS and the mark; add or
   remove a whole item by copying one; leave every class exactly as the snippet has it.
   A figure here is a claim the page makes about the product — change it only to a
   number someone can stand behind. */

/* the variant switches, on the element that carries them */
const variants = {
  section: {
    'data-tone': { values: ['soft'], required: false,
      uk: 'колір підписів. Без атрибута — ink-500 (контрастний, для читання). soft — світліший ink-400, як на головній.' },
  },
};

/* the classes each part may carry — its own class first; nothing else, anywhere in the rail */
const classes = {
  section: ['stat-rail'],
  inner: ['stat-rail-inner'],
  list: ['stat-rail-list', 'rv'],
  item: ['stat-rail-item'],
  lead: ['stat-rail-lead'], gap: ['stat-rail-gap'],
  figure: ['stat-rail-figure'],
  value: ['stat-rail-value', 'od-num'],
  mark: ['stat-rail-mark'],
  label: ['stat-rail-label'],
};

/* the behaviour hooks a part must keep besides its own class */
const hooks = { list: ['rv'] };

/* inline markup allowed inside each text part: none — a rail is figures and short labels */
const inline = { lead: [], value: [], label: [] };

/* what the editor may change — the catalogue prints this table */
const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці; можна прибрати' },
  { field: 'Варіант', where: 'data-tone на <section>', rule: 'soft або без атрибута' },
  { field: 'Пункт', where: 'div.stat-rail-item', rule: 'додати чи прибрати — цілим блоком, скопіювавши сусідній; пунктів 2–5' },
  { field: 'Рядок над цифрою', where: 'div.stat-rail-lead', rule: 'короткий текст («Plagiarism checking in»). Якщо рядка немає, на його місці стоїть порожній <div class="stat-rail-gap" aria-hidden="true"></div> — він тримає цифри на одній лінії; щоб додати рядок, замініть його на div.stat-rail-lead з текстом' },
  { field: 'Цифра', where: 'div.stat-rail-value', rule: 'коротка цифра з позначками («500,000+», «80+»), без розмітки. Це твердження про продукт: змінюйте лише на підтверджене число. Клас od-num — цифра «прокручується» при появі; його можна прибрати' },
  { field: 'Знак замість цифри', where: 'img.stat-rail-mark', rule: 'src — шлях до файла знака (SVG); alt порожній і aria-hidden="true", бо назву каже підпис під знаком. Розміри задає рейка' },
  { field: 'Підпис', where: 'div.stat-rail-label', rule: 'текст (обов’язковий), без розмітки' },
];

/* what stays locked */
const locked = [
  'усі класи й обгортки: .stat-rail-inner, .stat-rail-list, .stat-rail-item, .stat-rail-figure',
  'data-component="stat-rail" на секції — гачок для перевірок',
  'клас-гачок rv на списку (анімація появи); od-num на цифрі — гачок «одометра» (build/assets/js/24-odometer.js)',
  'склад пункту і порядок: рядок над цифрою або порожній проміжок → цифра або знак (усередині div.stat-rail-figure) → підпис',
  'жодних посилань, кнопок, style="", <script>, <style>, класів Tailwind (px-4, text-ink-600 …) усередині рейки',
];

module.exports = { name: 'stat-rail', variants, classes, hooks, inline, editable, locked };
