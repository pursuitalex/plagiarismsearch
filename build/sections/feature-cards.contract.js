/* Feature cards — the content contract: what an editor may change in the section's HTML,
   and what not.

   Read by build/sections/feature-cards.check.js (the validator, run by
   build/check-library.js), by the template (build/sections/feature-cards.js takes its
   variant values from here) and by build/section-library.js (the catalogue page,
   site/section-library.html). One source, so the rules an editor reads are the rules the
   validator applies.

   The rule of thumb for the CMS: change the TEXT, the LINKS and the VARIANT VALUES listed
   here; add or remove a whole card by copying one; pick the snippet whose layout you need
   rather than assembling parts by hand; leave every class and every icon exactly as the
   snippet has them. */

/* the variant switches, on the element that carries them */
const variants = {
  section: {
    'data-layout': { values: ['grid', 'panel'], required: true,
      uk: 'розкладка. grid — окремі картки (PDF, API, головна, Affiliate). panel — комірки одного сірого аркуша з рисками між ними (Business & Teams, Affiliate); для білої секції. Це різні фрагменти — беріть відповідний зразок.' },
    'data-bg': { values: ['white', 'cool', 'aqua'], required: true,
      uk: 'фон секції: white — білий, cool — холодний світлий (#F7FAFC), aqua — світло-бірюзовий (#F2FCFC). Пігулка сама бере протилежний фон.' },
    'data-space': { values: ['sm', 'md', 'lg'], required: true,
      uk: 'вертикальний ритм на десктопі: lg — 128px, md — 112px (беріть той, що в сусідніх секцій сторінки); sm — 80px: коротка смуга без заголовка (Affiliate).' },
    'data-accent': { values: ['teal'], required: false,
      uk: 'колір крапки в пігулці. Без атрибута — помаранчева; teal — бірюзова.' },
    'data-size': { values: ['compact', 'lead'], required: false,
      uk: 'вигляд картки (лише grid). Без атрибута — звичайна. compact — картка сторінки API: пласка плитка на найсвітлішому тоні, менший текст. lead — картка головної: плитка з обідком, більша назва, внизу картки кнопка.' },
  },
  head: {
    'data-measure': { values: ['720', '760', '860'], required: false,
      uk: 'ширина блока заголовка, px. Без атрибута — 820. 720 — головна (і менший відступ до карток).' },
  },
  grid: {
    'data-cols': { values: ['3', '4'], required: false,
      uk: 'скільки карток у ряд на десктопі: 3 — три з 768px; 4 — дві з 640px, чотири з 1024px. Обов’язковий, крім сітки з data-head="inline".' },
    'data-head': { values: ['inline'], required: false,
      uk: 'inline — заголовок секції стоїть першою коміркою сітки (div.cards-head-cell), блока .section-head над сіткою немає; дві картки в ряд із 640px, три з 1024px (Affiliate).' },
  },
  item: {
    'data-tone': { values: ['teal'], required: false,
      uk: 'teal — акцентна картка: бірюзове тло без тіні (одна з набору, яка означає щось інше — у PDF це Storage).' },
  },
  tile: {
    'data-tone': { values: ['teal', 'ink', 'orange', 'mint'], required: true,
      uk: 'колір плитки з іконкою (.icon-tile): один атрибут задає і тло плитки, і колір іконки. На сірому аркуші (panel) плитка біла, тон задає лише колір іконки.' },
    'data-variant': { values: ['ring'], required: false,
      uk: 'ring — плитка головної з тонким кольоровим обідком (лише з data-size="lead").' },
  },
  button: {
    'data-tone': { values: ['light', 'ghost'], required: false,
      uk: 'кнопка: light — біла з обідком (під сіткою, у підвалі аркуша); ghost — велика прозора з обідком (у картці головної).' },
  },
};

/* the classes each part may carry — its own class first; nothing else, anywhere in the section */
const classes = {
  section: ['cards-section'],
  inner: ['cards-inner'],
  head: ['section-head', 'rv'],
  grid: ['cards-grid', 'rv-kids', 'rv'], headCell: ['cards-head-cell'],
  item: ['cards-item'], title: ['cards-title'], text: ['cards-text'], link: ['cards-link'],
  itemAction: ['cards-item-action'],
  actions: ['cards-actions', 'rv'],
  panel: ['cards-panel', 'rv'], cells: ['cards-cells'], cell: ['cards-cell'],
  panelFoot: ['cards-panel-foot'], panelNote: ['cards-panel-note'], panelAction: ['cards-panel-action'],
};

/* the behaviour hooks a part must keep besides its own class */
const hooks = { head: ['rv'], panel: ['rv'], actions: ['rv'] };

/* inline markup allowed inside each text part */
const inline = {
  sectionTitle: ['br', 'em', 'strong'],
  intro: ['strong', 'em', 'br'],
  title: [],
  text: ['a.cards-link', 'strong', 'em', 'br'],
  note: ['strong', 'em', 'br'],
};

/* what the editor may change — the catalogue prints this table */
const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці; можна прибрати' },
  { field: 'Назва для читача екрана', where: 'aria-label на <section>', rule: 'лише для секції без заголовка (panel без .section-head): коротко перелічіть, що в комірках' },
  { field: 'Варіанти', where: 'data-bg, data-space, data-accent на <section>; data-measure на .section-head; data-cols на сітці; data-tone на картці, плитці, кнопці', rule: 'лише значення зі списку варіантів. data-layout, data-size і data-head не міняйте на готовому фрагменті: у кожного своя розмітка' },
  { field: 'Надпис-пігулка', where: '.section-eyebrow-label', rule: 'текст; блок .section-eyebrow можна прибрати цілком. Фон пігулки не задається' },
  { field: 'Заголовок H2', where: 'h2.section-title', rule: 'текст; допускаються <br>, <em>, <strong>. У grid — обов’язковий (у блоці .section-head або в першій комірці)' },
  { field: 'Вступ', where: 'p.section-intro', rule: 'текст; можна прибрати' },
  { field: 'Картка', where: '.cards-item / .cards-cell', rule: 'додати чи прибрати — цілим блоком, скопіювавши сусідній; карток 2–8 (комірок аркуша — 2–4). Після зміни кількості перевірте data-cols' },
  { field: 'Назва картки', where: '.cards-title', rule: 'текст без розмітки' },
  { field: 'Текст картки', where: 'p.cards-text', rule: 'текст; допускаються strong, em, br і посилання a.cards-link (href; rel="noopener" для зовнішніх)' },
  { field: 'Іконка', where: 'span.icon-tile > svg', rule: 'іконку <svg> можна замінити іншою з Lucide (24×24, stroke="currentColor"); колір — data-tone на плитці' },
  { field: 'Кнопка в картці (lead)', where: 'div.cards-item-action > a.action-button', rule: 'текст і href; блок можна прибрати' },
  { field: 'Кнопка під сіткою', where: 'div.cards-actions > a.action-button', rule: 'текст і href; блок можна прибрати' },
  { field: 'Підвал аркуша (panel)', where: 'div.cards-panel-foot: p.cards-panel-note, a.action-button', rule: 'текст примітки, текст і href кнопки; кнопку або весь підвал можна прибрати' },
];

/* what stays locked */
const locked = [
  'усі класи й обгортки: .cards-inner, .section-head, .cards-grid, .cards-item, .cards-panel, .cards-cells, .cards-cell',
  'data-component="feature-cards" на секції — гачок для перевірок; data-layout, data-bg, data-space — обов’язкові',
  'класи-гачки: rv на блоці заголовка, аркуші та кнопці під сіткою; rv-kids на сітці (картки з’являються по черзі; у сітки з data-head="inline" — rv); btn-press, group, icon-orb на кнопці',
  'склад картки: плитка з іконкою → назва → текст (→ кнопка в lead); порядок не міняється',
  'акцентна картка (data-tone="teal") — не більше однієї на сітку',
  'іконки <svg> стрілок — копіюються як є',
  'жодних style="", <script>, <style>, класів Tailwind (px-4, text-ink-600 …) усередині секції',
];

module.exports = { name: 'feature-cards', variants, classes, hooks, inline, editable, locked };
