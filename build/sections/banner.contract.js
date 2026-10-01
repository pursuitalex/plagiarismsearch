/* Banner — the content contract: what an editor may change in the banner's HTML, and what not.

   Read by build/sections/banner.check.js (the validator, run by build/check-library.js),
   by the template (build/sections/banner.js takes its variant values from here) and by
   build/section-library.js (the catalogue page, site/section-library.html).

   The rule of thumb for the CMS: change the TEXT, the LINKS and the VARIANT VALUES listed
   here; take the snippet with the parts you need (a row with one button, a row with a
   button and a link, the split with its schematic); leave every class and every icon
   exactly as the snippet has them. */

const variants = {
  section: {
    'data-glow': { values: ['teal', 'coral', 'coral-soft', 'violet'], required: true,
      uk: 'колір світіння у правому верхньому куті коробки; крапка пігулки бере відповідний колір сама: teal і violet — бірюзова, coral — помаранчева (orange-500), coral-soft — світліша помаранчева (orange-400).' },
    'data-layout': { values: ['split'], required: false,
      uk: 'розкладка. Без атрибута — ряд: текст ліворуч, кнопка праворуч. split — текст ліворуч, схема-панель праворуч (1.4fr / 1fr), кнопка під панеллю. Це різні фрагменти — беріть відповідний зразок.' },
  },
  lead: {
    'data-measure': { values: ['54', '60', '62', '66'], required: false,
      uk: 'найдовший рядок вступу, у символах. Без атрибута — 62.' },
  },
  detail: {
    'data-measure': { values: ['58', '60'], required: false,
      uk: 'найдовший рядок другого, тихішого абзацу. Без атрибута — 60.' },
  },
};

/* the classes each part may carry — its own class first */
const classes = {
  section: ['banner'],
  inner: ['banner-inner'],
  box: ['banner-box', 'rv'],
  glow: ['banner-glow', 'orb'],
  grid: ['banner-grid'],
  text: ['banner-text'],
  eyebrow: ['section-eyebrow'], eyebrowDot: ['section-eyebrow-dot'], eyebrowLabel: ['section-eyebrow-label'],
  title: ['banner-title'],
  lead: ['banner-lead'],
  pill: ['banner-pill'], pillDot: ['banner-pill-dot'],
  callout: ['banner-callout'], calloutIcon: ['banner-callout-icon'],
  detail: ['banner-detail'],
  action: ['banner-action'],
  actions: ['banner-actions'],
  button: ['banner-button', 'btn-press', 'group'],
  buttonOrb: ['banner-button-orb', 'icon-orb'],
  link: ['banner-link'],
  aside: ['banner-aside'],
  branch: ['banner-branch'],
  branchParent: ['banner-branch-parent'], branchParentIcon: ['banner-branch-parent-icon'],
  branchChildren: ['banner-branch-children'],
  branchChild: ['banner-branch-child'],
  branchLine: ['banner-branch-line'],
  branchIcon: ['banner-branch-icon'],
  branchLabel: ['banner-branch-label'],
};

/* the behaviour hooks a part must keep besides its own class */
const hooks = { glow: ['orb'], button: ['btn-press', 'group'], buttonOrb: ['icon-orb'] };

/* inline markup allowed inside each text part */
const inline = {
  title: ['br', 'em', 'strong'],
  lead: ['strong', 'em', 'br'],
  detail: ['strong', 'em', 'br'],
  callout: ['strong', 'em', 'br'],
  pill: [], label: [], eyebrow: [],
};

const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці; можна прибрати' },
  { field: 'Колір світіння', where: 'data-glow на <section>', rule: 'teal | coral | coral-soft | violet (обов’язковий); крапка пігулки змінюється разом із ним' },
  { field: 'Надпис-пігулка', where: '.section-eyebrow-label', rule: 'текст; блок .section-eyebrow можна прибрати цілком. Фон і колір крапки не задаються — їх дає банер' },
  { field: 'Заголовок H2', where: 'h2.banner-title', rule: 'текст (обов’язковий); допускаються <br>, <em>, <strong>' },
  { field: 'Вступ', where: 'p.banner-lead', rule: 'текст (обов’язковий); strong, em, br; data-measure — зі списку' },
  { field: 'Теза-пігулка', where: 'p.banner-pill', rule: 'короткий текст без тегів після крапки span.banner-pill-dot; можна прибрати' },
  { field: 'Застереження', where: 'p.banner-callout', rule: 'текст після іконки; strong, em, br; можна прибрати' },
  { field: 'Другий абзац', where: 'p.banner-detail', rule: 'текст; strong, em, br; можна прибрати' },
  { field: 'Кнопка', where: 'a.banner-button', rule: 'текст і href (rel="noopener" для зовнішніх адрес); кружок зі стрілкою лишається' },
  { field: 'Тихе посилання під кнопкою', where: '.banner-actions > a.banner-link (лише ряд)', rule: 'текст і href; щоб прибрати — візьміть зразок з однією кнопкою (без обгортки .banner-actions)' },
  { field: 'Схема (split)', where: '.banner-branch', rule: 'лише тексти: назва в p.banner-branch-parent і підписи двох гілок у span.banner-branch-label; гілок рівно дві' },
];

const locked = [
  'усі класи й обгортки: .banner-inner, .banner-box, .banner-grid, .banner-text, .banner-action — копіюються як є',
  'data-component="banner" на секції; data-surface="dark" на .banner-box — перемикає кільце фокусу на темному тлі',
  'класи-гачки: rv на .banner-box (поява), btn-press і group на кнопці, icon-orb на кружку зі стрілкою, orb на світінні',
  'іконки <svg> (стрілка, іконка застереження, іконки схеми) — копіюються як є',
  'порядок у тексті: пігулка → заголовок → вступ → теза-пігулка → застереження → другий абзац',
  'схема .banner-branch лишається з aria-hidden="true": вона малює те, що вже сказано текстом',
  'жодних style="", <script>, <style>, класів Tailwind усередині банера',
];

module.exports = { name: 'banner', variants, classes, hooks, inline, editable, locked };
