/* CTA band — the content contract: what an editor may change in the band's HTML, and what not.

   Read by build/sections/cta-band.check.js (the validator, run by build/check-library.js),
   by the template (build/sections/cta-band.js takes its variant values from here) and by
   build/section-library.js (the catalogue page, site/section-library.html). One source,
   so the rules an editor reads are the rules the validator applies.

   The rule of thumb for the CMS: change the TEXT, the LINKS and the VARIANT VALUES listed
   here; pick the snippet whose set of parts you need (a band with a quiet link, with the
   spark line, with two buttons …) rather than assembling parts by hand; leave every class,
   the ground block and every icon exactly as the snippet has them. */

/* the variant switches, on the element that carries them */
const variants = {
  section: {
    'data-variant': { values: ['plain'], required: false,
      uk: 'вигляд смуги. Без атрибута — фірмова смуга (крапкове поле, два світіння, обведене слово, заголовок розміру hero). plain — спрощена смуга старих сторінок (Help Center, Mission, безкоштовні інструменти): м’які плями, заголовок розміру секції, одна кольорова кнопка. Це різні фрагменти — беріть відповідний зразок, а не міняйте атрибут.' },
    'data-width': { values: ['wide'], required: false,
      uk: 'wide — ширша колонка 920px (українська сторінка, довший заголовок). Без атрибута — 880px. Лише для фірмової смуги.' },
  },
  lead: {
    'data-measure': { values: ['46', '52', '54', '56', '58', '62', '560px'], required: false,
      uk: 'найдовший рядок вступу, у символах (560px — About us). Без атрибута: 58 у фірмовій смузі, 46 у plain. Змінюйте, лише якщо текст негарно переноситься.' },
  },
  actions: {
    'data-layout': { values: ['stack', 'pair'], required: false,
      uk: 'розкладка дій. Без атрибута — ряд: кнопка і, за потреби, тихе посилання поруч. stack — стовпчик: кнопка, під нею рядок з іскрою (.cta-hint). pair — дві рівноправні кнопки розміру 48/56px: темна і світла (.cta-button-secondary).' },
  },
  button: {
    'data-tone': { values: ['orange'], required: false,
      uk: 'лише в plain: колір кнопки. Без атрибута — бірюзова; orange — помаранчева (сторінки безкоштовних інструментів).' },
  },
  note: {
    'data-tone': { values: ['quiet'], required: false,
      uk: 'рядок під діями. Без атрибута — виразний (напівжирний, ink-700). quiet — малий сірий, наприкінці може мати посилання a.cta-note-link.' },
  },
};

/* the classes each part may carry — its own class first; nothing else, anywhere in a band */
const classes = {
  section: ['cta-band'],
  bg: ['cta-band-bg'],
  dots: ['cta-band-dots', 'dot-field'],
  glowWarm: ['cta-glow-warm', 'orb'], glowCool: ['cta-glow-cool', 'orb'],
  orbWarm: ['cta-orb-warm', 'orb'], orbCool: ['cta-orb-cool', 'orb'],
  inner: ['cta-band-inner'],
  eyebrow: ['section-eyebrow', 'rv'], eyebrowDot: ['section-eyebrow-dot', 'pulse-dot'], eyebrowLabel: ['section-eyebrow-label'],
  kicker: ['cta-kicker', 'rv'],
  title: ['cta-title', 'rv'],
  ring: ['ring-word'], ringMark: ['ring-mark'],
  lead: ['cta-lead', 'rv'],
  actions: ['cta-actions', 'rv'],
  button: ['cta-button', 'btn-press', 'group', 'rv'],
  buttonOrb: ['cta-button-orb', 'icon-orb'],
  secondary: ['cta-button-secondary', 'btn-press'],
  link: ['cta-link'],
  hint: ['cta-hint'], hintIcon: ['cta-hint-icon'],
  note: ['cta-note', 'rv'], noteLink: ['cta-note-link'],
};

/* the behaviour hooks a part must keep besides its own class */
const hooks = {
  dots: ['dot-field'], glow: ['orb'],
  button: ['btn-press', 'group'], buttonOrb: ['icon-orb'], secondary: ['btn-press'],
};

/* inline markup allowed inside each text part */
const inline = {
  title: ['span.ring-word', 'br', 'em', 'strong'],
  titlePlain: ['br', 'em', 'strong'],
  lead: ['strong', 'em', 'br'],
  kicker: ['strong', 'em', 'br'],
  note: ['a.cta-note-link', 'strong', 'em', 'br'],
  hint: [], label: [], eyebrow: [],
};

/* what the editor may change — the catalogue prints this table */
const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці; можна прибрати, якщо на смугу ніхто не посилається' },
  { field: 'Варіанти', where: 'data-width на <section>, data-measure на p.cta-lead, data-layout на .cta-actions, data-tone на кнопці чи примітці', rule: 'лише значення зі списку варіантів; атрибут можна прибрати (значення за замовчуванням)' },
  { field: 'Надпис-пігулка', where: '.section-eyebrow-label', rule: 'текст; блок .section-eyebrow можна прибрати цілком. Фон пігулки не задається — його дає смуга' },
  { field: 'Рядок над заголовком', where: 'p.cta-kicker', rule: 'текст; ставиться замість вступу (у смузі або kicker, або lead)' },
  { field: 'Заголовок H2', where: 'h2.cta-title', rule: 'текст (обов’язковий); допускаються <br>, <em>, <strong>' },
  { field: 'Обведене слово', where: 'span.ring-word усередині заголовка', rule: 'рівно одне на заголовок; міняйте лише текст перед <svg>. Петля розрахована на фрагмент близько 10 символів (4–18): надто короткий чи довгий розтягне її' },
  { field: 'Вступ', where: 'p.cta-lead', rule: 'текст; допускаються strong, em, br; у фірмовій смузі можна прибрати' },
  { field: 'Кнопка', where: 'a.cta-button', rule: 'текст і href (rel="noopener" для зовнішніх адрес); іконку <svg> на початку можна прибрати, але не змінювати; кружок зі стрілкою лишається' },
  { field: 'Тихе посилання поруч', where: 'a.cta-link (ряд)', rule: 'текст і href; можна прибрати' },
  { field: 'Рядок з іскрою', where: 'p.cta-hint (stack)', rule: 'текст; можна прибрати' },
  { field: 'Друга кнопка', where: 'a.cta-button-secondary (pair)', rule: 'текст і href' },
  { field: 'Рядок під діями', where: 'p.cta-note', rule: 'текст; допускаються strong, em, br і одне посилання a.cta-note-link; можна прибрати' },
];

/* what stays locked */
const locked = [
  'усі класи й обгортки: .cta-band-bg з трьома шарами (крапки, два світіння) у фірмовій смузі, дві плями .orb у plain — копіюються як є',
  'data-component="cta-band" на секції — гачок для перевірок',
  'класи-гачки: rv (анімація появи), btn-press і group на кнопці, icon-orb на кружку зі стрілкою, pulse-dot на крапці пігулки, dot-field і orb на шарах фону',
  'іконки <svg> (стрілка, іскра, петля обведення) — копіюються як є',
  'порядок частин: пігулка → (рядок над заголовком) → заголовок → вступ → дії → рядок під діями',
  'склад дій відповідає розкладці: ряд — кнопка (+ тихе посилання); stack — кнопка (+ рядок з іскрою); pair — темна і світла кнопки',
  'жодних style="", <script>, <style>, класів Tailwind (px-4, text-ink-600 …) усередині смуги',
];

module.exports = { name: 'cta-band', variants, classes, hooks, inline, editable, locked };
