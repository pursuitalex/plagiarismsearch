/* Hero — the content contract: what an editor may change in the hero's HTML, and what not.

   Read by build/sections/hero.check.js (the validator, run by build/check-library.js), by
   the template (build/sections/hero.js takes its variant values from here) and by
   build/section-library.js (the catalogue page, site/section-library.html). One source,
   so the rules an editor reads are the rules the validator applies.

   The rule of thumb for the CMS: change the TEXT, the LINKS and the VARIANT VALUES listed
   here; pick the snippet whose layout you need rather than assembling parts by hand;
   leave every class, the ground, the icons and the two sealed blocks — the checker form
   and the diagram — exactly as the snippet has them. */

/* the variant switches, on the element that carries them */
const variants = {
  section: {
    'data-layout': { values: ['split-aside', 'split', 'hub', 'center'], required: true,
      uk: 'розкладка. split-aside — текст і блок під ним ліворуч, чекер праворуч (Students, PDF, Turnitin). split — те саме без блока під текстом, колонки по центру, пропорції української сторінки. hub — ширша текстова колонка з кнопками, праворуч схема (Business, University, Affiliate). center — головна: заголовок по центру над чекером. Це різні фрагменти — беріть відповідний зразок, а не міняйте атрибут.' },
  },
  title: {
    'data-size': { values: ['long'], required: false,
      uk: 'long — менший кегль для довгого заголовка-речення (Turnitin). Без атрибута — розмір hero.' },
  },
  lead: {
    'data-measure': { values: ['52', '54', '60', '62'], required: false,
      uk: 'найдовший рядок вступу, у символах. Без атрибута: 54 біля чекера (52 на українській сторінці), 60 у hub, без обмеження на головній. Змінюйте, лише якщо текст негарно переноситься.' },
  },
  note: {
    'data-measure': { values: ['58'], required: false,
      uk: 'найдовший рядок примітки під кнопками (hub), у символах. Без атрибута — на всю колонку.' },
  },
  pathPill: {
    'data-state': { values: ['current'], required: false,
      uk: 'current — темна пігулка поточного кроку (з крапкою span.hero-path-dot усередині). Одна на шлях.' },
  },
  tile: {
    'data-tone': { values: ['teal', 'ink', 'orange', 'mint'], required: true,
      uk: 'колір плитки з іконкою (.icon-tile) у блоці-примітці: один атрибут задає і тло плитки, і колір іконки.' },
  },
};

/* the classes each part may carry — its own class first; nothing else, anywhere in a hero */
const classes = {
  section: ['hero'],
  dots: ['hero-dots', 'dot-field'],
  glowCool: ['orb-hero-teal', 'orb'], glowWarm: ['orb-hero-coral', 'orb'],
  bg: ['hero-bg'], orbCool: ['hero-orb-cool', 'orb'], orbWarm: ['hero-orb-warm', 'orb'],
  inner: ['hero-inner'], grid: ['hero-grid'],
  head: ['hero-head', 'rv'],
  eyebrow: ['section-eyebrow'], eyebrowDot: ['section-eyebrow-dot'], eyebrowLabel: ['section-eyebrow-label'],
  title: ['hero-title'],
  pen: ['pen-word'], penMark: ['pen-mark'], word: ['hw'], wordIn: ['hw-in'],
  lead: ['hero-lead'],
  actions: ['hero-actions'],
  button: ['action-button', 'btn-press', 'group'], buttonOrb: ['action-button-orb', 'icon-orb'],
  link: ['action-link'],
  note: ['hero-note'],
  media: ['hero-media', 'rv'],
  free: ['hero-free'], freeIcon: ['hero-free-icon'],
  aside: ['hero-aside', 'rv'],
  path: ['hero-path'], pathStep: ['hero-path-step'], pathPill: ['hero-path-pill'], pathDot: ['hero-path-dot'], pathArrow: ['hero-path-arrow'],
  facts: ['hero-facts'], factsGrid: ['hero-facts-grid'], fact: ['hero-fact'], factValue: ['hero-fact-value'], factLabel: ['hero-fact-label'], factsNote: ['hero-facts-note'],
  asideMore: ['hero-aside-more'], asideLink: ['hero-aside-link'],
  notice: ['hero-notice'], noticeText: ['hero-notice-text'],
  tile: ['icon-tile'],
};

/* the behaviour hooks a part must keep besides its own class */
const hooks = {
  dots: ['dot-field'], glow: ['orb'],
  button: ['btn-press', 'group'], buttonOrb: ['icon-orb'],
};

/* the sealed slots: rendered by the template, copied as they are, not inspected */
const slots = {
  checker: 'the quick-check form (build/checker.js) — the product\'s own component',
  media: 'a diagram or a card drawn for the page',
};

/* inline markup allowed inside each text part */
const inline = {
  title: ['span.pen-word', 'span.hw', 'br', 'wbr'],
  lead: ['strong', 'em', 'br'],
  note: ['strong', 'em', 'br'],
  free: ['strong', 'em'],
  factsNote: ['strong', 'em', 'br'],
  noticeText: ['strong', 'em', 'br'],
  label: [], eyebrow: [],
};

/* what the editor may change — the catalogue prints this table */
const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці. У hero з чекером кнопка форми веде на цей самий якір (href="#…" усередині чекера): міняйте обидва разом — валідатор попередить, якщо вони розійшлися' },
  { field: 'Варіанти', where: 'data-size на h1.hero-title, data-measure на p.hero-lead і p.hero-note, data-state на пігулці шляху, data-tone на .icon-tile', rule: 'лише значення зі списку варіантів; необов’язковий атрибут можна прибрати' },
  { field: 'Надпис-пігулка', where: '.section-eyebrow-label', rule: 'текст; блок .section-eyebrow можна прибрати цілком. Колір крапки не задається — у hero вона бірюзова' },
  { field: 'Заголовок H1', where: 'h1.hero-title', rule: 'текст (обов’язковий, єдиний H1 сторінки); допускаються <br>, <wbr>' },
  { field: 'Підкреслене слово', where: 'span.pen-word усередині заголовка', rule: 'не більше одного; міняйте лише текст перед <svg class="pen-mark">. Лінію під нове слово перемалює скрипт під час завантаження — у <svg> нічого міняти не треба' },
  { field: 'Слова, що виринають (головна)', where: 'h1.hero-title[data-hero-title]', rule: 'кожне слово в <span class="hw"><span class="hw-in">…</span></span>; слово, вписане без обгортки, скрипт обгорне сам (валідатор попередить). data-hero-support на вступі лишається' },
  { field: 'Вступ', where: 'p.hero-lead', rule: 'текст; допускаються strong, em, br. У hub — один або два абзаци' },
  { field: 'Кнопка і тихе посилання (hub)', where: '.hero-actions > a.action-button, a.action-link', rule: 'текст і href (rel="noopener" для зовнішніх адрес); посилання можна прибрати; кружок зі стрілкою лишається' },
  { field: 'Примітка під кнопками (hub)', where: 'p.hero-note', rule: 'текст; можна прибрати' },
  { field: 'Рядок під чекером', where: 'p.hero-free', rule: 'текст після іконки-іскри; іконка лишається' },
  { field: 'Шлях у пігулках (split-aside)', where: 'ol.hero-path > li.hero-path-step > span.hero-path-pill', rule: 'текст кожної пігулки; кроків 2–6; aria-label списку — назва шляху. Стрілка <svg> стоїть після кожної пігулки, крім останньої' },
  { field: 'Три цифри (split-aside)', where: '.hero-facts: p.hero-fact-value, p.hero-fact-label, p.hero-facts-note', rule: 'текст; рівно три пари «значення — підпис» і речення під ними. Під карткою — необов’язкове посилання p.hero-aside-more > a.hero-aside-link (текст і href)' },
  { field: 'Примітка з іконкою (split-aside)', where: '.hero-notice > p.hero-notice-text', rule: 'текст; допускаються strong, em, br. Тон плитки — data-tone' },
];

/* what stays locked */
const locked = [
  'чекер — блок [data-slot="checker"] (форма швидкої перевірки, build/checker.js): копіюється як є, без жодних змін усередині; це компонент продукту, його поля й поведінку підключає розробник',
  'схема — блок [data-slot="media"] у hub: копіюється як є; валідатор не заглядає всередину',
  'тло: крапкове поле .dot-field.hero-dots і два світіння .orb (у center — усередині .hero-bg) — копіюються як є, у цьому порядку',
  'усі класи й обгортки: .hero-inner, .hero-grid, .hero-head, .hero-media, .hero-aside',
  'data-component="hero" на секції — гачок для перевірок; data-layout — обов’язковий',
  'класи-гачки: rv (анімація появи), pen-word і pen-mark (підкреслення), btn-press і group на кнопці, icon-orb на кружку зі стрілкою, dot-field і orb на шарах тла',
  'іконки <svg> (іскра, стрілки, підкреслення, іконка в плитці) — копіюються як є',
  'порядок частин: пігулка → заголовок → вступ → кнопки → примітка; у сітці: текст → чекер або схема → блок під текстом',
  'у блоці під текстом — рівно один із трьох: шлях, три цифри або примітка з іконкою',
  'жодних style="", <script>, <style>, класів Tailwind (px-4, text-ink-600 …) поза запечатаними блоками',
];

module.exports = { name: 'hero', variants, classes, hooks, slots, inline, editable, locked };
