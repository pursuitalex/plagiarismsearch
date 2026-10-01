/* Inquiry form — the content contract: what an editor may change in the form section's
   HTML, and what not.

   Read by build/sections/inquiry-form.check.js (the validator, run by
   build/check-library.js), by the template (build/sections/inquiry-form.js) and by
   build/section-library.js (the catalogue page, site/section-library.html).

   The rule of thumb for the CMS: change the TEXT — the head, the labels, the placeholders,
   the hints, the button — and the VARIANT VALUES listed here. Which fields the form has,
   which are required and where it submits are agreed with the developer who binds the
   form to the backend: a field is added or removed only together with that binding. */

const variants = {
  section: {
    'data-bg': { values: ['white', 'cool'], required: true,
      uk: 'фон секції: white — білий, cool — холодний світлий (#F7FAFC). Пігулка сама бере протилежний фон (на білій секції — сіра, на cool — біла).' },
    'data-layout': { values: ['fluid-wide'], required: false,
      uk: 'сітка. Без атрибута — 0.85fr / 1.15fr (Business, University). fluid-wide — 0.9fr / 1.1fr: ширша ліва колонка (API).' },
    'data-accent': { values: ['teal'], required: false,
      uk: 'колір крапки в пігулці. Без атрибута — помаранчева; teal — бірюзова (API).' },
    'data-sticky': { values: ['off'], required: false,
      uk: 'off — ліва колонка не їде за прокруткою на десктопі (так затверджено на API). Без атрибута — ліва колонка «липне» під шапкою, поки гортається форма.' },
  },
  field: {
    'data-span': { values: ['full'], required: false,
      uk: 'full — поле на всю ширину форми (обидві колонки). Без атрибута — одна колонка з двох.' },
  },
};

/* the classes each part may carry — its own class first */
const classes = {
  section: ['inquiry'],
  inner: ['inquiry-inner'],
  grid: ['inquiry-grid'],
  aside: ['inquiry-aside', 'rv'],
  eyebrow: ['section-eyebrow'], eyebrowDot: ['section-eyebrow-dot'], eyebrowLabel: ['section-eyebrow-label'],
  title: ['section-title'],
  intro: ['section-intro'],
  alt: ['inquiry-alt'], altLink: ['inquiry-alt-link'],
  card: ['inquiry-card', 'rv'],
  fields: ['inquiry-fields'],
  field: ['inquiry-field'],
  label: ['cf-label'],
  control: ['cf-field'],
  optional: ['inquiry-optional'],
  help: ['inquiry-help'],
  choice: ['inquiry-choice'],
  chips: ['inquiry-chips'],
  option: ['inquiry-option'],
  optionInput: ['inquiry-option-input'],
  chip: ['inquiry-chip'], chipTick: ['inquiry-chip-tick'],
  consent: ['inquiry-consent'], consentBox: ['inquiry-consent-box'], consentText: ['inquiry-consent-text'],
  link: ['inquiry-link'], required: ['inquiry-required'],
  submit: ['inquiry-submit'],
  button: ['inquiry-button', 'btn-press', 'group'],
  buttonOrb: ['inquiry-button-orb', 'icon-orb'],
  success: ['inquiry-success'], successTitle: ['inquiry-success-title'], successText: ['inquiry-success-text'],
};

const hooks = { button: ['btn-press', 'group'], buttonOrb: ['icon-orb'] };

/* inline markup allowed inside each text part */
const inline = {
  title: ['br', 'em', 'strong'],
  intro: ['strong', 'em', 'br'],
  alt: ['a.inquiry-alt-link'],
  label: ['i', 'span.inquiry-optional'],
  help: ['strong', 'em'],
  consent: ['a.inquiry-link', 'i.inquiry-required'],
  success: ['strong', 'em', 'br'],
  eyebrow: [],
};

/* the control types a field may hold */
const controls = { input: ['text', 'email', 'tel', 'url', 'number'], textarea: true, select: true };

const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці. На нього ведуть кнопки «Request a quote» сторінки — змінюйте разом із їхніми href' },
  { field: 'Варіанти секції', where: 'data-bg, data-layout, data-accent, data-sticky на <section>', rule: 'лише значення зі списку варіантів' },
  { field: 'Надпис-пігулка', where: '.section-eyebrow-label', rule: 'текст; блок .section-eyebrow можна прибрати цілком. Фон пігулки не задається' },
  { field: 'Заголовок H2', where: 'h2.section-title', rule: 'текст (обов’язковий); допускаються <br>, <em>, <strong>' },
  { field: 'Вступ', where: 'p.section-intro', rule: 'текст; можна прибрати' },
  { field: 'Рядок під вступом', where: 'p.inquiry-alt > a.inquiry-alt-link', rule: 'текст і одне посилання (mailto: або адреса); можна прибрати' },
  { field: 'Підпис поля', where: 'label.cf-label', rule: 'текст; зірочка обов’язкового поля — <i>*</i> наприкінці; слово Optional — <span class="inquiry-optional">' },
  { field: 'Підказка в полі', where: 'placeholder на input / textarea', rule: 'текст; можна прибрати' },
  { field: 'Підказка під полем', where: 'p.inquiry-help', rule: 'текст; можна прибрати' },
  { field: 'Ширина поля', where: 'data-span на .inquiry-field', rule: 'full — на всю ширину; без атрибута — половина' },
  { field: 'Варіанти списку', where: '<option> у select.cf-field', rule: 'текст варіантів; перший порожній «Select an option» лишається' },
  { field: 'Чипи множинного вибору', where: 'label.inquiry-option', rule: 'текст чипа і value його <input> — однакові; чип копіюється чи видаляється цілим; legend — текст' },
  { field: 'Згода', where: 'span.inquiry-consent-text', rule: 'текст і href двох посилань a.inquiry-link; зірочка <i class="inquiry-required">*</i> лишається' },
  { field: 'Кнопка', where: 'button.inquiry-button', rule: 'лише текст; кружок зі стрілкою лишається' },
  { field: 'Стан успіху', where: '.inquiry-success-title, p.inquiry-success-text', rule: 'текст; блок лишається прихованим (hidden) — його показує форма після відправлення' },
  { field: 'Id полів', where: 'id на полі і for на його label', rule: 'чіпати не треба: скрипт сторінки сам лагодить пари під час завантаження (скопійоване поле можна лишити з тим самим id)' },
];

const locked = [
  'склад форми: які поля є, які з них обов’язкові (атрибут required), їхні type, name і value, куди форма відправляється — це узгоджується з розробником, який підключає форму до бекенду; поле додається чи прибирається лише разом із цим підключенням',
  '<form data-inquiry-form … novalidate> з його атрибутами (data-focus-first, onsubmit="return false" — заглушка прототипу, яку замінює підключення до бекенду)',
  'усі класи й обгортки: .inquiry-grid, .inquiry-aside, .inquiry-card, .inquiry-fields, .inquiry-field, .inquiry-submit',
  'класи полів cf-label і cf-field — спільний рецепт форм сайту',
  'data-component="inquiry-form" на секції; data-inquiry-form на <form> — гачок скрипта',
  'класи-гачки: rv на .inquiry-aside і .inquiry-card (поява), btn-press і group на кнопці, icon-orb на кружку зі стрілкою',
  'іконки <svg> (стрілка, галочка чипа) — копіюються як є',
  'блок .inquiry-success: hidden і role="status"',
  'жодних style="", <script>, <style>, класів Tailwind усередині секції; жодних on*-обробників, крім заглушки onsubmit="return false" на <form>',
];

module.exports = { name: 'inquiry-form', variants, classes, hooks, inline, controls, editable, locked };
