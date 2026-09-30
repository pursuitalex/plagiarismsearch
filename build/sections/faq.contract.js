/* FAQ — the content contract: what an editor may change in the FAQ's HTML, and what not.

   Read by build/check-library.js (the validator) and build/section-library.js (the
   catalogue page, site/section-library.html). One source, so the rules an editor reads
   are the rules the validator applies.

   The rule of thumb for the CMS: change the TEXT, the LINKS and the VARIANT VALUES listed
   here; add or remove whole questions by copying a whole .faq-item; leave every class,
   every wrapper <div> and every icon exactly as the snippet has them. */

/* the variant switches, on the element that carries them */
const variants = {
  section: {
    'data-bg': { values: ['white', 'tint'], required: true,
      uk: 'фон секції: white — білий, tint — світло-сірий (ink-50). Чергуйте з сусідніми секціями.' },
    'data-space': { values: ['lg', 'md'], required: true,
      uk: 'вертикальні відступи на десктопі: lg — 128px (lg:py-32), md — 112px (lg:py-28). На телефоні/планшеті однакові.' },
    'data-layout': { values: ['fluid', 'fluid-narrow', 'fixed'], required: true,
      uk: 'сітка: fluid — 0.85fr/1.15fr (продуктові сторінки); fluid-narrow — 0.8fr/1.2fr (UA); fixed — 380px/1fr (головна, User Guide) зі своїм ритмом заголовка.' },
  },
  grid: {
    'data-layout': { values: ['fluid', 'fluid-narrow', 'fixed'], required: true,
      uk: 'те саме, що data-layout секції — коли FAQ стоїть усередині іншого компонента без власної секції.' },
  },
  frame: {
    'data-variant': { values: ['doc'], required: false,
      uk: 'doc — список усередині колонки документації (Moodle guide): компактніші відступи на десктопі, колір тексту ink-700, посилання в стилі гайду.' },
  },
  eyebrow: {
    'data-bg': { values: ['white', 'tint'], required: false,
      uk: 'фон «пігулки» над заголовком: white (за замовчуванням) або tint (ink-50) — щоб пігулка читалась на білій секції.' },
  },
  intro: {
    'data-size': { values: ['lead', 'small'], required: false,
      uk: 'розмір вступу: lead (за замовчуванням) — 14.5/15/15.5px; small — 14.5/15/15px (так затверджено на AI Detector і API).' },
  },
};

/* the classes each part may carry — nothing else, anywhere inside a FAQ */
const classes = {
  section: ['faq'],
  inner: ['faq-inner'],
  grid: ['faq-grid'],
  aside: ['faq-aside', 'rv'],
  eyebrow: ['section-eyebrow'], eyebrowDot: ['section-eyebrow-dot'], eyebrowLabel: ['section-eyebrow-label'],
  title: ['section-title'],
  intro: ['section-intro'],
  moreWrap: ['section-more'],
  moreLink: ['section-link', 'section-more'],
  frame: ['faq-frame', 'rv'],
  list: ['faq-list'],
  item: ['faq-item', 'open'],
  heading: ['faq-heading'],
  q: ['faq-q'], qText: ['faq-q-text'], chev: ['faq-chev'],
  a: ['faq-a'],
  body: ['faq-a-body'],
  more: ['faq-a-more'], aLink: ['faq-a-link'], aLinkIcon: ['faq-a-link-icon'],
  inlineLink: ['faq-link'],
  ui: ['ui'],
};

/* inline markup allowed inside answer text and the intro */
const inline = {
  answer: ['a.faq-link', 'strong', 'em', 'b', 'i', 'br', 'span.ui'],
  intro: ['a.faq-link', 'strong', 'em', 'br'],
  title: ['br', 'em', 'strong'],
  question: [],
};

/* what the editor may change — the catalogue prints this table */
const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці; можна прибрати, якщо на FAQ ніхто не посилається' },
  { field: 'Варіанти секції', where: 'data-bg, data-space, data-layout на <section>', rule: 'лише значення зі списку variants' },
  { field: 'Надпис-пігулка', where: '.section-eyebrow-label', rule: 'текст; блок .section-eyebrow можна прибрати цілком' },
  { field: 'Фон пігулки', where: 'data-bg на .section-eyebrow', rule: 'white | tint' },
  { field: 'Заголовок H2', where: '.section-title', rule: 'текст (обов’язковий); допускаються <br>, <em>, <strong>' },
  { field: 'Вступ', where: 'p.section-intro', rule: 'текст; можна прибрати; data-size = lead | small' },
  { field: 'Посилання під вступом', where: 'a.section-link (у div.section-more або сам із класом section-more)', rule: 'текст, href, rel; іконку <svg> можна прибрати, але не змінювати; блок можна прибрати' },
  { field: 'Питання', where: '.faq-q-text', rule: 'лише текст, без тегів' },
  { field: 'Відповідь (один абзац)', where: 'p.faq-a-body', rule: 'текст; усередині — a.faq-link, strong, em, br' },
  { field: 'Відповідь (кілька абзаців)', where: 'div.faq-a-body > p', rule: 'кожен абзац — простий <p> без класів; ті самі inline-теги' },
  { field: 'Посилання під відповіддю', where: 'p.faq-a-more > a.faq-a-link', rule: 'текст, href, target/rel; лише в останньому абзаці div.faq-a-body' },
  { field: 'Кількість питань', where: '.faq-item', rule: 'копіюйте або видаляйте цілий .faq-item; перший завжди class="faq-item open" + aria-expanded="true", решта — без open + "false"' },
  { field: 'Id відповідей', where: 'id на .faq-a і aria-controls на кнопці', rule: '<простір-імен>-a1, -a2 … — однакові пари, унікальні на сторінці; при копіюванні секції змініть простір імен' },
];

/* what stays locked */
const locked = [
  'усі класи й обгортки <div> (зокрема порожній <div> усередині .faq-a) — від них залежать вигляд, анімація і JS',
  'data-component="faq" на секції і data-faq на .faq-list — гачки для JS і перевірок',
  'кнопка: type="button", class="faq-q", aria-controls + aria-expanded',
  'іконки <svg> (шеврон, іконка посилання) — копіюються як є',
  'клас rv на .faq-aside і .faq-frame — анімація появи (можна прибрати лише обидва разом і лише за рішенням дизайну)',
  'жодних style="", <script>, <style>, класів Tailwind (px-4, text-ink-600 …) усередині FAQ',
];

module.exports = { name: 'faq', variants, classes, inline, editable, locked };
