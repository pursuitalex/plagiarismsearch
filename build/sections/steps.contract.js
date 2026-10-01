/* Steps — the content contract: what an editor may change in the section's HTML, and what not.

   Read by build/sections/steps.check.js (the validator, run by build/check-library.js), by
   the template (build/sections/steps.js takes its variant values from here) and by
   build/section-library.js (the catalogue page, site/section-library.html). One source,
   so the rules an editor reads are the rules the validator applies.

   The rule of thumb for the CMS: change the TEXT, the LINKS and the VARIANT VALUES listed
   here; add or remove a whole step by copying one; pick the snippet whose layout and
   marker you need rather than assembling parts by hand; leave every class and every icon
   exactly as the snippet has them. */

/* the markers each layout knows */
const markers = {
  rail: ['icon', 'disc'],
  cards: ['icon', 'icon-stack', 'badge', 'badge-sm'],
  rows: ['icon'],
};

/* the variant switches, on the element that carries them */
const variants = {
  section: {
    'data-layout': { values: ['rail', 'cards', 'rows'], required: true,
      uk: 'розкладка. rail — станції на одній лінії, без карток (Students, Turnitin, українська сторінка). cards — картка на крок (PDF, головна, AI Detector, API). rows — один аркуш, рядок на крок (Business & Teams, Affiliate). Це різні фрагменти — беріть відповідний зразок, а не міняйте атрибут.' },
    'data-marker': { values: ['icon', 'icon-stack', 'badge', 'badge-sm', 'disc'], required: false,
      uk: 'чим позначено крок. rail: icon — плитка з іконкою і номер; disc — великий круглий номер (останній — темний). cards: icon — плитка і номер в одному рядку; icon-stack — плитка зверху, номер перед назвою (головна); badge — круглий номер 32px; badge-sm — компактна картка з номером 28px, три в ряд уже з 640px (AI Detector). rows: без атрибута — лише велика цифра; icon — ще й плитка з іконкою та підписом «Step 1». Розмітка кроку в кожного маркера своя — беріть зразок.' },
    'data-bg': { values: ['white', 'cool', 'aqua'], required: true,
      uk: 'фон секції: white — білий, cool — холодний світлий (#F7FAFC), aqua — світло-бірюзовий (#F2FCFC). Пігулка, картки з номером і панель-примітка самі беруть протилежну поверхню.' },
    'data-space': { values: ['md', 'lg'], required: true,
      uk: 'вертикальний ритм сторінки на десктопі: lg — 128px, md — 112px. Беріть той, що в сусідніх секцій сторінки.' },
    'data-accent': { values: ['teal'], required: false,
      uk: 'колір крапки в пігулці. Без атрибута — помаранчева; teal — бірюзова.' },
  },
  head: {
    'data-measure': { values: ['720', '760', '860'], required: false,
      uk: 'ширина блока заголовка, px. Без атрибута — 820. 720 — головна (і менший відступ до списку).' },
  },
  intro: {
    'data-measure': { values: ['72'], required: false,
      uk: 'найдовший рядок вступу, у символах (українська сторінка). Без атрибута — на всю ширину блока.' },
  },
  list: {
    'data-cols': { values: ['3', '4'], required: false,
      uk: 'скільки кроків у ряд на десктопі (rail і cards — обов’язковий): 3 — три з 768px; 4 — два з 640px, чотири з 1024px. Ставте за кількістю кроків.' },
    'data-link': { values: ['line'], required: false,
      uk: 'cards: line — картки з’єднані рисками (span.steps-link у кожній картці, крім останньої).' },
    'data-last': { values: ['apart'], required: false,
      uk: 'rail: apart — остання станція окремо, у пунктирній рамці, лінія закінчується перед нею (українська сторінка: Storage — окрема дія).' },
    'data-stagger': { values: ['.06'], required: false,
      uk: 'такт появи елементів списку, с (українська сторінка). Без атрибута — .08.' },
  },
  tile: {
    'data-tone': { values: ['teal', 'ink', 'orange', 'mint'], required: true,
      uk: 'колір плитки з іконкою (.icon-tile): один атрибут задає і тло плитки, і колір іконки.' },
    'data-variant': { values: ['ring'], required: false,
      uk: 'ring — плитка головної: з тонким кольоровим обідком (лише з data-marker="icon-stack").' },
  },
  noteLine: {
    'data-tone': { values: ['strong'], required: false,
      uk: 'рядок панелі-примітки. Без атрибута — звичайний; strong — напівжирний темний.' },
  },
  button: {
    'data-tone': { values: ['light', 'ghost'], required: false,
      uk: 'кнопка внизу секції: light — біла з обідком; ghost — велика прозора з обідком (головна).' },
  },
};

/* the classes each part may carry — its own class first; nothing else, anywhere in the section */
const classes = {
  section: ['steps-section'],
  bg: ['steps-bg'], glow: ['steps-glow', 'orb'],
  inner: ['steps-inner'],
  head: ['section-head', 'rv'],
  eyebrow: ['section-eyebrow'], eyebrowDot: ['section-eyebrow-dot'], eyebrowLabel: ['section-eyebrow-label'],
  title: ['section-title'], intro: ['section-intro'],
  list: ['steps-list', 'rv-kids'], line: ['steps-line'],
  item: ['steps-item'], link: ['steps-link'],
  marker: ['steps-marker'], num: ['steps-num'], badge: ['steps-badge'], disc: ['steps-disc'],
  heading: ['steps-heading'],
  stepTitle: ['steps-title'], text: ['steps-text'],
  frame: ['steps-frame', 'rv'], sheet: ['steps-sheet'], row: ['steps-row'],
  rowHead: ['steps-row-head'], rowTitle: ['steps-row-title'], kicker: ['steps-kicker'],
  tags: ['steps-tags'], tag: ['steps-tag'],
  note: ['steps-note', 'rv'], noteText: ['steps-note-text'], noteLine: ['steps-note-line'], noteAction: ['steps-note-action'],
  actions: ['steps-actions', 'rv'],
  more: ['steps-more', 'rv'], moreText: ['steps-more-text'], moreLink: ['steps-more-link'], sectionLink: ['section-link'],
  callout: ['steps-callout', 'rv'], calloutText: ['steps-callout-text'],
};

/* the behaviour hooks a part must keep besides its own class */
const hooks = {
  head: ['rv'], list: ['rv-kids'], frame: ['rv'], foot: ['rv'], glow: ['orb'],
};

/* the sealed slot */
const slots = { media: 'a diagram or a panel drawn for the page, under the list' };

/* inline markup allowed inside each text part */
const inline = {
  title: ['br', 'em', 'strong'],
  intro: ['strong', 'em', 'br'],
  stepTitle: [],
  text: ['strong', 'em', 'br'],
  noteLine: ['strong', 'em', 'br'],
  moreText: ['strong', 'em', 'br'],
  calloutText: ['strong', 'em', 'br'],
  label: [],
};

/* what the editor may change — the catalogue prints this table */
const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці; можна прибрати, якщо на секцію ніхто не посилається' },
  { field: 'Варіанти', where: 'data-bg, data-space, data-accent на <section>; data-measure на .section-head і p.section-intro; data-cols на списку; data-tone на плитці, рядку примітки, кнопці', rule: 'лише значення зі списку варіантів. data-layout і data-marker не міняйте на готовому фрагменті: у кожного своя розмітка кроку' },
  { field: 'Надпис-пігулка', where: '.section-eyebrow-label', rule: 'текст; блок .section-eyebrow можна прибрати цілком. Фон пігулки не задається' },
  { field: 'Заголовок H2', where: 'h2.section-title', rule: 'текст (обов’язковий); допускаються <br>, <em>, <strong>' },
  { field: 'Вступ', where: 'p.section-intro', rule: 'текст; можна прибрати' },
  { field: 'Крок', where: '.steps-item / .steps-row', rule: 'додати чи прибрати — цілим блоком, скопіювавши сусідній; кроків 2–6 (rows — до 8). Після зміни кількості перепишіть номери й data-cols' },
  { field: 'Номер кроку', where: 'span.steps-num, span.steps-badge, span.steps-disc', rule: 'лише цифри, по порядку: 01, 02 … (у badge і disc — 1, 2 …)' },
  { field: 'Назва кроку', where: '.steps-title', rule: 'текст без розмітки' },
  { field: 'Текст кроку', where: 'p.steps-text', rule: 'текст; допускаються strong, em, br' },
  { field: 'Іконка кроку', where: 'span.icon-tile > svg', rule: 'іконку <svg> можна замінити іншою з Lucide (24×24, stroke="currentColor"); колір — data-tone на плитці' },
  { field: 'Мітки кроку (rows)', where: 'div.steps-tags > span.steps-tag', rule: 'текст; мітку чи весь блок можна прибрати' },
  { field: 'Підпис над назвою (rows, icon)', where: 'p.steps-kicker', rule: 'текст («Step 1»); можна прибрати' },
  { field: 'Панель-примітка', where: 'div.steps-note: p.steps-note-line, a.action-button', rule: 'текст рядків (1–3), текст і href кнопки; кнопку (.steps-note-action) можна прибрати' },
  { field: 'Кнопка під списком', where: 'div.steps-actions > a.action-button', rule: 'текст і href; блок можна прибрати' },
  { field: 'Рядок із посиланням', where: 'div.steps-more: p.steps-more-text, a.section-link', rule: 'текст і href; блок можна прибрати' },
  { field: 'Виноска', where: 'div.steps-callout > p.steps-callout-text', rule: 'текст; тон плитки — data-tone; блок можна прибрати' },
];

/* what stays locked */
const locked = [
  'усі класи й обгортки: .steps-inner, .section-head, .steps-list, .steps-item, .steps-marker, .steps-frame, .steps-sheet …',
  'data-component="steps" на секції — гачок для перевірок; data-layout, data-bg, data-space — обов’язкові',
  'класи-гачки: rv на блоці заголовка, рамці rows і нижньому блоці; rv-kids на списку (поява елементів по черзі); btn-press, group, icon-orb на кнопці; orb на світінні',
  'лінія rail (span.steps-line — перший елемент списку) і риски між картками (span.steps-link) — копіюються як є',
  'розмітка кроку відповідає маркеру (див. варіант data-marker): її частини та їхній порядок не міняються',
  'у нижній частині секції — не більше одного блока: панель-примітка, кнопка, рядок із посиланням, виноска або запечатаний блок [data-slot="media"] (схема сторінки — копіюється як є)',
  'іконки <svg> стрілок — копіюються як є',
  'жодних style="", <script>, <style>, класів Tailwind (px-4, text-ink-600 …) поза запечатаним блоком',
];

module.exports = { name: 'steps', variants, markers, classes, hooks, slots, inline, editable, locked };
