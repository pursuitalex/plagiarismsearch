/* Report showcase — the content contract: what an editor may change in the section's HTML, and what not.

   Read by build/sections/report-showcase.check.js (the validator, run by
   build/check-library.js), by the template (build/sections/report-showcase.js takes its
   variant values from here) and by build/section-library.js (the catalogue page,
   site/section-library.html). One source, so the rules an editor reads are the rules the
   validator applies.

   The rule of thumb for the CMS: change the TEXT around the report and the VARIANT VALUES
   listed here; pick the snippet whose set of parts you need rather than assembling parts
   by hand; leave every class, every icon and — above all — the report itself exactly as
   the snippet has them. The report is the product's screen: a sealed block. */

/* the variant switches, on the element that carries them */
const variants = {
  section: {
    'data-surface': { values: ['dark'], required: false,
      uk: 'темна секція (ink-950, два світіння): звіт на темному тлі — так на шести сторінках. Секція має рівно один із двох атрибутів: data-surface="dark" або data-bg="white". Це різні фрагменти — беріть відповідний зразок, а не міняйте атрибут.' },
    'data-bg': { values: ['white'], required: false,
      uk: 'біла секція (Turnitin Alternative): звіт у сірій рамці, під ним — три пункти з іконками і помаранчева виноска. Пігулка сама бере сірий відтінок.' },
    'data-space': { values: ['md', 'lg'], required: true,
      uk: 'вертикальний ритм сторінки на десктопі: lg — 128px, md — 112px. Беріть той, що в сусідніх секцій сторінки.' },
    'data-accent': { values: ['teal'], required: false,
      uk: 'колір крапки в пігулці. Без атрибута — помаранчева; teal — бірюзова.' },
    'data-tone': { values: ['quiet'], required: false,
      uk: 'лише для темної секції. quiet — темний акт головної: одне тепле світіння внизу праворуч (блок .report-bg), а пігулка і вступ на крок тихіші. Без атрибута — два світіння (.orb-dark-teal, .orb-dark-coral) і звичайна темна шапка.' },
  },
  head: {
    'data-measure': { values: ['720', '760', '860'], required: false,
      uk: 'ширина блока заголовка, px. Без атрибута — 820. 760 — звичайна для цієї секції; 720 — головна.' },
  },
  intro: {
    'data-measure': { values: ['64', '72'], required: false,
      uk: 'найдовший рядок вступу, у символах. Без атрибута — на всю ширину блока.' },
  },
  pathPill: {
    'data-state': { values: ['current'], required: false,
      uk: 'current — виділена пігулка шляху (помаранчева, з крапкою span.report-path-dot усередині). Одна на шлях.' },
  },
  points: {
    'data-marker': { values: ['number', 'icon'], required: true,
      uk: 'чим позначено пункт. number — круглий номер, пункти однією смугою (темна секція). icon — плитка з іконкою над назвою, пункти окремими колонками (біла секція). Розмітка пункту в кожного своя — беріть зразок.' },
  },
  pair: {
    'data-split': { values: ['tail'], required: false,
      uk: 'пропорції пари карток під звітом. Без атрибута — перша ширша (1.15 / 0.85); tail — друга ширша (0.85 / 1.15, українська сторінка).' },
  },
  callout: {
    'data-tone': { values: ['orange'], required: false,
      uk: 'виноска. Без атрибута — бірюзова на темному тлі; orange — помаранчева на білій секції (з плиткою .icon-tile і великим рядком).' },
  },
  tile: {
    'data-tone': { values: ['teal', 'ink', 'orange', 'mint'], required: true,
      uk: 'колір плитки з іконкою (.icon-tile): один атрибут задає і тло плитки, і колір іконки.' },
  },
};

/* the classes each part may carry — its own class first; nothing else, anywhere outside the sealed blocks */
const classes = {
  section: ['report-showcase'],
  glowCool: ['orb-dark-teal', 'orb'], glowWarm: ['orb-dark-coral', 'orb'],
  bg: ['report-bg'], orbCool: ['report-orb-cool', 'orb'], orbWarm: ['report-orb-warm', 'orb'],
  inner: ['report-inner'],
  head: ['section-head', 'rv'],
  top: ['report-top'], topHead: ['report-top-head', 'rv'],
  path: ['report-path', 'rv'], pathStep: ['report-path-step'], pathPill: ['report-path-pill'], pathDot: ['report-path-dot'], pathArrow: ['report-path-arrow'],
  pen: ['pen-word'], penMark: ['pen-mark'],
  points: ['report-points', 'rv', 'rv-kids'], point: ['report-point'],
  pointNum: ['report-point-num'], pointBody: ['report-point-body'], pointName: ['report-point-name'], pointText: ['report-point-text'],
  callout: ['report-callout', 'rv'], calloutIcon: ['report-callout-icon'], calloutText: ['report-callout-text'],
  pair: ['report-pair', 'rv'],
  principle: ['report-principle'], kicker: ['report-kicker'], principleTitle: ['report-principle-title'], principleText: ['report-principle-text'],
  aside: ['report-aside'],
  statement: ['report-statement'], statementText: ['report-statement-text'],
  foot: ['report-foot'],
  caveat: ['report-caveat', 'rv'], caveatIcon: ['report-caveat-icon'],
};

/* the behaviour hooks a part must keep besides its own class */
const hooks = { glow: ['orb'], head: ['rv'], block: ['rv'] };

/* the sealed slots: rendered by the template, copied as they are, not inspected */
const slots = {
  report: 'the report mock-up (build/report.js) — the product\'s own screen, wired by [data-report]',
  media: 'a block drawn for the page, under the report (the homepage\'s integrations rail)',
};

/* inline markup allowed inside each text part */
const inline = {
  title: ['span.pen-word', 'br', 'em', 'strong'],
  intro: ['strong', 'em', 'br'],
  text: ['strong', 'em', 'br'],
  principleTitle: ['span.pen-word', 'br', 'em', 'strong'],
  label: [],
};

/* what the editor may change — the catalogue prints this table */
const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці; можна прибрати, якщо на секцію ніхто не посилається' },
  { field: 'Варіанти', where: 'data-space, data-accent на <section>; data-measure на .section-head і p.section-intro; data-split на .report-pair; data-state на пігулці шляху; data-tone на .icon-tile', rule: 'лише значення зі списку варіантів. Темну й білу секцію, тон quiet і маркер пунктів не перемикайте на готовому фрагменті: у кожного своя розмітка' },
  { field: 'Надпис-пігулка', where: '.section-eyebrow-label', rule: 'текст; блок .section-eyebrow можна прибрати цілком. Фон пігулки не задається — його дає секція' },
  { field: 'Заголовок H2', where: 'h2.section-title', rule: 'текст (обов’язковий); допускаються <br>, <em>, <strong> і одне підкреслене слово' },
  { field: 'Підкреслене слово', where: 'span.pen-word у заголовку або у великому рядку картки-принципу', rule: 'не більше одного на рядок; міняйте лише текст перед <svg class="pen-mark">. Лінію під нове слово перемалює скрипт під час завантаження' },
  { field: 'Вступ', where: 'p.section-intro', rule: 'текст; один або два абзаци; можна прибрати' },
  { field: 'Шлях у пігулках', where: 'ol.report-path > li.report-path-step > span.report-path-pill', rule: 'текст кожної пігулки; кроків 2–4; aria-label списку — шлях словами. Стрілка <svg> стоїть після кожної пігулки, крім останньої' },
  { field: 'Три пункти під звітом', where: '.report-points > .report-point: .report-point-name, .report-point-text', rule: 'текст; рівно три пункти. У смузі з номерами — цифри 1, 2, 3; у пунктах з іконками іконку <svg> можна замінити іншою з Lucide, колір — data-tone на плитці' },
  { field: 'Виноска', where: '.report-callout > p.report-callout-text', rule: 'текст; допускаються strong, em, br; блок можна прибрати' },
  { field: 'Картка-принцип', where: '.report-principle: p.report-kicker, p.report-principle-title, p.report-principle-text', rule: 'текст; підпис і абзац можна прибрати' },
  { field: 'Текстова картка і картка-твердження', where: 'p.report-aside; .report-statement > p.report-statement-text', rule: 'текст; тон плитки — data-tone' },
  { field: 'Примітка під звітом', where: 'p.report-caveat', rule: 'текст після іконки; можна прибрати' },
];

/* what stays locked */
const locked = [
  'звіт — блок [data-slot="report"] (build/report.js): копіюється як є, без жодних змін усередині. Це екран продукту: текст документа, відсотки, джерела, підписи й кольори категорій належать зразку звіту, а не сторінці; валідатор не заглядає всередину, лише перевіряє, що звіт на місці',
  'блок сторінки [data-slot="media"] під звітом (на головній — рядок інтеграцій): копіюється як є',
  'тло темної секції: два світіння .orb.orb-dark-teal і .orb.orb-dark-coral (у тоні quiet — блок .report-bg з двома .orb) — копіюються як є',
  'усі класи й обгортки: .report-inner, .section-head, .report-top, .report-points, .report-pair, .report-foot …',
  'data-component="report-showcase" на секції — гачок для перевірок; data-space і один із data-surface="dark" / data-bg="white" — обов’язкові',
  'класи-гачки: rv на блоці заголовка і на кожному блоці під звітом; rv-kids на списку пунктів з іконками; pen-word і pen-mark (підкреслення); orb на світіннях',
  'порядок: заголовок → звіт → блоки під звітом. На темній секції під звітом: смуга з трьох пунктів → виноска, або пара карток, або примітка → блок сторінки. На білій: один блок .report-foot (три пункти з іконками + помаранчева виноска)',
  'іконки <svg> (у виносці, примітці, плитках, стрілки шляху, лінія підкреслення) — копіюються як є',
  'жодних style="", <script>, <style>, класів Tailwind (px-4, text-ink-600 …) поза запечатаними блоками',
];

module.exports = { name: 'report-showcase', variants, classes, hooks, slots, inline, editable, locked };
