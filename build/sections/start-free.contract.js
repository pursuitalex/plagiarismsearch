/* Start free — the content contract: what an editor may change in the section's HTML, and
   what not.

   Read by build/sections/start-free.check.js (the validator, run by build/check-library.js),
   by the template (build/sections/start-free.js takes its variant values from here) and by
   build/section-library.js (the catalogue page, site/section-library.html). One source,
   so the rules an editor reads are the rules the validator applies.

   The rule of thumb for the CMS: change the TEXT, the LINKS and the VARIANT VALUES listed
   here; leave every class and every icon exactly as the snippet has them. The figures are
   product facts (the free limits): change them only when the product changes. */

/* the variant switches, on the element that carries them */
const variants = {
  section: {
    'data-layout': { values: ['open', 'framed'], required: true,
      uk: 'розкладка. open — текст і дві великі цифри поруч, без рамки (Students, українська сторінка). framed — те саме в одному аркуші з подвійною рамкою, менші цифри і рядок-примітка під ними (PDF). Це різні фрагменти — беріть відповідний зразок.' },
    'data-bg': { values: ['white'], required: true,
      uk: 'фон секції: лише білий (пігулка на ньому сіра). Атрибут обов’язковий — від нього пігулка бере свій фон.' },
    'data-space': { values: ['md', 'lg'], required: true,
      uk: 'вертикальний ритм сторінки на десктопі: lg — 128px, md — 112px. Беріть той, що в сусідніх секцій сторінки.' },
  },
  figure: {
    'data-tone': { values: ['teal', 'dark'], required: true,
      uk: 'колір картки з цифрою: teal — світла бірюзова, dark — темна. У секції одна світла й одна темна, у цьому порядку.' },
  },
  list: {
    'data-stagger': { values: ['.06'], required: false,
      uk: 'такт появи двох карток, с (українська сторінка). Без атрибута — .08.' },
  },
};

/* the classes each part may carry — its own class first; nothing else, anywhere in the section */
const classes = {
  section: ['start-free'],
  inner: ['start-free-inner'],
  frame: ['start-free-frame', 'rv'],
  grid: ['start-free-grid'],
  text: ['start-free-text', 'rv'],
  actions: ['start-free-actions'], sectionLink: ['section-link'],
  figures: ['start-free-figures', 'rv-kids'], figure: ['start-free-figure'],
  value: ['start-free-value'], label: ['start-free-label'], sub: ['start-free-sub'],
  note: ['start-free-note'],
};

/* the behaviour hooks a part must keep besides its own class */
const hooks = { frame: ['rv'], text: ['rv'], figures: ['rv-kids'] };

/* inline markup allowed inside each text part */
const inline = {
  title: ['br', 'em', 'strong'],
  intro: ['strong', 'em', 'br'],
  plain: [],
  note: ['strong', 'em'],
};

/* what the editor may change — the catalogue prints this table */
const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці; можна прибрати' },
  { field: 'Варіанти', where: 'data-space на <section>', rule: 'md або lg — за ритмом сторінки. data-layout не міняйте на готовому фрагменті' },
  { field: 'Надпис-пігулка', where: '.section-eyebrow-label', rule: 'текст; блок .section-eyebrow можна прибрати цілком. Фон і колір крапки не задаються' },
  { field: 'Заголовок H2', where: 'h2.section-title', rule: 'текст (обов’язковий); допускаються <br>, <em>, <strong>' },
  { field: 'Вступ', where: 'p.section-intro', rule: 'текст; один або два абзаци. Тут називаються ліміти — без цін і без таблиці тарифів' },
  { field: 'Кнопка', where: 'div.start-free-actions > a.action-button', rule: 'текст і href — якір чекера на цій сторінці (#…): клік ставить курсор у поле чекера' },
  { field: 'Тихе посилання', where: 'div.start-free-actions > a.section-link', rule: 'текст і href (сторінка тарифів); можна прибрати' },
  { field: 'Цифра', where: 'p.start-free-value', rule: 'число без розмітки (факт продукту: 150, 300)' },
  { field: 'Підписи цифри', where: 'p.start-free-label, p.start-free-sub', rule: 'текст без розмітки: що рахуємо і для кого' },
  { field: 'Рядок під цифрами (framed)', where: 'p.start-free-note', rule: 'текст після іконки; рядок можна прибрати' },
];

/* what stays locked */
const locked = [
  'усі класи й обгортки: .start-free-inner, .start-free-frame, .start-free-grid, .start-free-text, .start-free-figures',
  'data-component="start-free" на секції — гачок для перевірок; data-layout, data-bg="white", data-space — обов’язкові',
  'класи-гачки: rv (на колонці тексту в open, на рамці у framed), rv-kids на парі карток в open; btn-press, group, icon-orb на кнопці',
  'дві картки з цифрами: спершу світла (data-tone="teal"), потім темна (data-tone="dark", з data-surface="dark")',
  'жодних цін, знижок, таблиць тарифів: це вхід безкоштовно, тарифи — за посиланням',
  'іконки <svg> — копіюються як є',
  'жодних style="", <script>, <style>, класів Tailwind (px-4, text-ink-600 …) усередині секції',
];

module.exports = { name: 'start-free', variants, classes, hooks, inline, editable, locked };
