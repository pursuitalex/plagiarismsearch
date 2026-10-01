/* Sources — the content contract: what an editor may change in the section's HTML, and what not.

   Read by build/sections/sources.check.js (the validator, run by build/check-library.js),
   by the template (build/sections/sources.js takes its variant values from here) and by
   build/section-library.js (the catalogue page, site/section-library.html). One source,
   so the rules an editor reads are the rules the validator applies.

   The rule of thumb for the CMS: change the TEXT and the VARIANT VALUES listed here; add
   or remove a whole source by copying one; pick the snippet whose layout you need rather
   than assembling parts by hand; leave every class and every icon exactly as the snippet
   has them. The sources are shown as available — ticks and tiles, never switches. */

/* the variant switches, on the element that carries them */
const variants = {
  section: {
    'data-layout': { values: ['groups', 'flow', 'list', 'cells'], required: true,
      uk: 'розкладка. groups — дві групи з галочками і темна картка з цифрою (головна, Students). flow — «вхід → джерела»: запечатаний блок, стрілка, одна група (PDF). list — заголовок ліворуч, праворуч аркуш із рядками (Turnitin). cells — заголовок над аркушем із чотирьох комірок (українська сторінка). Це різні фрагменти — беріть відповідний зразок.' },
    'data-bg': { values: ['white', 'cool'], required: true,
      uk: 'фон секції: white — білий, cool — холодний світлий (#F7FAFC). Пігулка сама бере протилежний фон.' },
    'data-space': { values: ['md', 'lg'], required: true,
      uk: 'вертикальний ритм сторінки на десктопі: lg — 128px, md — 112px. Беріть той, що в сусідніх секцій сторінки.' },
    'data-accent': { values: ['teal'], required: false,
      uk: 'колір крапки в пігулці. Без атрибута — помаранчева; teal — бірюзова.' },
    'data-items': { values: ['labels'], required: false,
      uk: 'лише groups. labels — вигляд головної: пункт — галочка і короткий підпис (span.sources-label) без опису; плитка з обідком. Без атрибута — пункт із назвою та описом.' },
  },
  head: {
    'data-measure': { values: ['720', '760', '860'], required: false,
      uk: 'ширина блока заголовка, px. Без атрибута — 820. 720 — головна (і менший відступ до карток).' },
  },
  intro: {
    'data-measure': { values: ['72'], required: false,
      uk: 'найдовший рядок вступу, у символах (українська сторінка).' },
  },
  note: {
    'data-tone': { values: ['warm'], required: false,
      uk: 'примітка під групами. Без атрибута — біла, звичайним текстом; warm — тепла, напівжирна: та, на яку треба зважити.' },
  },
  tile: {
    'data-tone': { values: ['teal', 'ink', 'orange', 'mint'], required: true,
      uk: 'колір плитки з іконкою (.icon-tile): один атрибут задає і тло плитки, і колір іконки.' },
    'data-variant': { values: ['ring'], required: false,
      uk: 'ring — плитка головної з тонким кольоровим обідком (лише з data-items="labels").' },
  },
};

/* the classes each part may carry — its own class first; nothing else, anywhere in the section */
const classes = {
  section: ['sources-section'],
  inner: ['sources-inner'],
  head: ['section-head', 'rv'],
  grid: ['sources-grid', 'rv-kids'],
  group: ['sources-group'], groupHead: ['sources-group-head'], kicker: ['sources-kicker'],
  list: ['sources-list'], item: ['sources-item'], tick: ['sources-tick'],
  itemBody: ['sources-item-body'], itemTitle: ['sources-item-title'], itemText: ['sources-item-text'], label: ['sources-label'],
  stat: ['sources-stat'], statIcon: ['sources-stat-icon'], statValue: ['sources-stat-value'], statText: ['sources-stat-text'],
  notes: ['sources-notes', 'rv'], note: ['sources-note'],
  flow: ['sources-flow', 'rv'], arrow: ['sources-arrow'], arrowLine: ['sources-arrow-line'], arrowHead: ['sources-arrow-head'],
  split: ['sources-split'], aside: ['sources-aside', 'rv'],
  frame: ['sources-frame', 'rv'], sheet: ['sources-sheet'],
  rows: ['sources-rows'], row: ['sources-row'], rowBody: ['sources-row-body'],
  term: ['sources-term'], desc: ['sources-desc'],
  foot: ['sources-foot'], footIcon: ['sources-foot-icon'], footText: ['sources-foot-text'],
  cells: ['sources-cells', 'cells'], cell: ['sources-cell'], cellHead: ['sources-cell-head'],
};

/* the behaviour hooks a part must keep besides its own class */
const hooks = { grid: ['rv-kids'], reveal: ['rv'], cells: ['cells'] };

/* the sealed slot */
const slots = { media: 'the input drawn for the page, at the start of a flow' };

/* inline markup allowed inside each text part */
const inline = {
  title: ['br', 'em', 'strong'],
  intro: ['strong', 'em', 'br'],
  label: [],
  text: ['strong', 'em', 'br'],
};

/* what the editor may change — the catalogue prints this table */
const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці; можна прибрати' },
  { field: 'Варіанти', where: 'data-bg, data-space, data-accent на <section>; data-measure на .section-head і p.section-intro; data-tone на плитці й примітці', rule: 'лише значення зі списку варіантів. data-layout і data-items не міняйте на готовому фрагменті: у кожного своя розмітка' },
  { field: 'Надпис-пігулка', where: '.section-eyebrow-label', rule: 'текст; блок .section-eyebrow можна прибрати цілком. Фон пігулки не задається' },
  { field: 'Заголовок H2', where: 'h2.section-title', rule: 'текст (обов’язковий); допускаються <br>, <em>, <strong>' },
  { field: 'Вступ', where: 'p.section-intro', rule: 'текст; можна прибрати' },
  { field: 'Назва групи', where: 'span.sources-kicker', rule: 'текст без розмітки' },
  { field: 'Пункт групи', where: 'li.sources-item', rule: 'додати чи прибрати — цілим пунктом; у групі 1–6 пунктів. Назва — span.sources-item-title, опис — span.sources-item-text (strong, em, br); у вигляді labels — лише span.sources-label' },
  { field: 'Картка з цифрою', where: 'div.sources-stat-value, p.sources-stat-text', rule: 'текст; іконка лишається' },
  { field: 'Примітки під групами', where: 'div.sources-notes > p.sources-note', rule: 'текст; одна або дві; блок можна прибрати' },
  { field: 'Джерело (list, cells)', where: 'dt.sources-term, dd.sources-desc', rule: 'текст; додати чи прибрати — цілим рядком (.sources-row) чи коміркою (.sources-cell); у cells — 2 або 4 комірки' },
  { field: 'Підпис комірки', where: '.sources-cell-head > span.sources-kicker', rule: 'текст без розмітки (вид: «Джерело», «Параметр»)' },
  { field: 'Темний рядок аркуша (list)', where: 'p.sources-foot > span.sources-foot-text', rule: 'текст; рядок можна прибрати' },
  { field: 'Іконка', where: 'span.icon-tile > svg', rule: 'іконку <svg> можна замінити іншою з Lucide (24×24, stroke="currentColor"); колір — data-tone на плитці' },
];

/* what stays locked */
const locked = [
  'усі класи й обгортки: .sources-inner, .section-head, .sources-grid, .sources-group, .sources-frame, .sources-sheet …',
  'data-component="sources" на секції — гачок для перевірок; data-layout, data-bg, data-space — обов’язкові',
  'класи-гачки: rv на блоці заголовка, рамці аркуша, примітках і flow; rv-kids на сітці груп; cells на <dl> комірок (риски між комірками)',
  'джерела показано як доступні: галочки й плитки. Жодних перемикачів, <input>, кнопок — сторінка не може діяти на перемикач',
  'groups: рівно дві групи і картка з цифрою; flow: запечатаний блок [data-slot="media"] (малюнок сторінки — копіюється як є), стрілка, одна група',
  'іконки <svg> (галочка, стрілка, іконка картки з цифрою, іконка темного рядка) — копіюються як є',
  'жодних style="", <script>, <style>, класів Tailwind (px-4, text-ink-600 …) поза запечатаним блоком',
];

module.exports = { name: 'sources', variants, classes, hooks, slots, inline, editable, locked };
