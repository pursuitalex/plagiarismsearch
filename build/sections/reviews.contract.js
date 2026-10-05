/* Reviews — the content contract: what an editor may change in the section's HTML, and what not.

   Read by build/sections/reviews.check.js (the validator, run by build/check-library.js),
   by the template (build/sections/reviews.js takes its variant values from here) and by
   build/section-library.js (the catalogue page, site/section-library.html). One source,
   so the rules an editor reads are the rules the validator applies.

   THE RULE OF THIS COMPONENT: a review is a real person's words under a real name. A card
   is a QUOTATION — the text as the platform published it (an ellipsis may mark a cut,
   nothing else is altered: not the spelling, not the punctuation), the name as the
   platform prints it, the rating that person gave. An editor adds or removes a whole
   card; inside a card the text is changed only to another real review, never rewritten,
   improved or translated. The validator cannot know whether a quote is real — it holds
   the card's shape; the page's own check (build/check-*.js) holds its words to the data
   (build/reviews.js). */

/* a review's rating: whole and half stars, as the platforms publish them */
const RATINGS = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'];

/* the variant switches, on the element that carries them */
const variants = {
  section: {
    'data-layout': { values: ['carousel', 'grid'], required: true,
      uk: 'розкладка. carousel — стрічка карток на темній секції, що гортається стрілками й крапками (головна). grid — три картки в ряд на сірій секції (українська сторінка). Це різні фрагменти — беріть відповідний зразок, а не міняйте атрибут.' },
    'data-surface': { values: ['dark'], required: false,
      uk: 'темна секція — обов’язкова для carousel: картки стають напівпрозорими, шапка й текст — світлими. Секція має рівно один із двох: data-surface="dark" або data-bg="tint".' },
    'data-bg': { values: ['tint'], required: false,
      uk: 'сіра секція (ink-50) — для grid: картки білі з тінню.' },
    'data-space': { values: ['md', 'lg'], required: true,
      uk: 'вертикальний ритм сторінки на десктопі: lg — 128px, md — 112px. Беріть той, що в сусідніх секцій сторінки.' },
    'data-accent': { values: ['teal'], required: false,
      uk: 'колір крапки в пігулці. Без атрибута — помаранчева; teal — бірюзова.' },
    'data-tone': { values: ['quiet'], required: false,
      uk: 'лише для темної секції: quiet — темний акт головної, пігулка на крок тихіша.' },
  },
  head: {
    'data-measure': { values: ['720', '760', '860'], required: false,
      uk: 'ширина блока заголовка, px. Без атрибута — 820.' },
  },
  list: {
    'data-stagger': { values: ['.06'], required: false,
      uk: 'grid: такт появи карток, с (українська сторінка). Без атрибута — .08.' },
  },
  rating: {
    'data-rating': { values: RATINGS, required: true,
      uk: 'оцінка цього відгуку — стільки зірок і зафарбовано. Цілі та половинки від 1 до 5, як їх публікує платформа. Це факт: оцінка, яку поставила саме ця людина. Цифру поруч (.review-rating-value) і підпис для читачів екрана (aria-label) пишіть ті самі; якщо вони розійдуться, скрипт виправить їх за цим атрибутом, а валідатор попередить.' },
  },
  button: {
    'data-tone': { values: ['inverse'], required: true,
      uk: 'кнопка під стрічкою (carousel) — біла, для темної секції.' },
  },
};

/* the classes each part may carry — its own class first; nothing else, anywhere in the section */
const classes = {
  section: ['reviews-section'],
  bg: ['reviews-bg'], glow: ['reviews-glow', 'orb'],
  inner: ['reviews-inner'],
  top: ['reviews-top', 'rv'],
  head: ['section-head', 'rv'],
  rail: ['reviews-rail', 'rv'],
  track: ['reviews-track'], grid: ['reviews-grid', 'rv-kids'],
  item: ['reviews-item'],
  nav: ['reviews-nav'],
  dots: ['reviews-dots'],
  actions: ['reviews-actions', 'rv'],
  card: ['review-card'],
  source: ['review-source'], mark: ['review-source-mark'], sourceName: ['review-source-name'],
  rating: ['review-rating'], stars: ['review-stars'], ratingValue: ['review-rating-value'],
  quote: ['review-quote'],
  by: ['review-by'], author: ['review-author'], link: ['review-link'],
};

/* the behaviour hooks a part must keep besides its own class */
const hooks = { glow: ['orb'], top: ['rv'], rail: ['rv'], grid: ['rv-kids'], actions: ['rv'] };

/* inline markup allowed inside each text part */
const inline = {
  title: ['br', 'em', 'strong'],
  intro: ['strong', 'em', 'br'],
  quote: ['br'],
  label: [],
};

/* what the editor may change — the catalogue prints this table */
const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці; можна прибрати' },
  { field: 'Варіанти', where: 'data-space, data-accent, data-tone на <section>; data-measure на .section-head', rule: 'лише значення зі списку варіантів. data-layout і фон не міняйте на готовому фрагменті' },
  { field: 'Надпис-пігулка, заголовок, вступ', where: '.section-eyebrow-label, h2.section-title, p.section-intro', rule: 'текст; заголовок обов’язковий, пігулку і вступ можна прибрати' },
  { field: 'Картка відгуку', where: 'div.reviews-item > figure.review-card', rule: 'додати чи прибрати — лише цілим блоком div.reviews-item, скопіювавши сусідній. carousel: 3–12 карток; grid: 3 або 6' },
  { field: 'Текст відгуку', where: 'blockquote.review-quote', rule: 'ЦИТАТА справжнього відгуку, слово в слово, як його опублікувала платформа. Скоротити можна лише з кінця, позначивши трьома крапками (…). Не виправляти, не покращувати, не перекладати: перекладений відгук — це вже інший текст під справжнім іменем' },
  { field: 'Автор', where: 'span.review-author', rule: 'ім’я так, як його друкує платформа («Maybelle R.», «Verified User in Higher Education»). Без посад і організацій, яких платформа не публікувала' },
  { field: 'Оцінка відгуку', where: 'span.review-rating: data-rating, aria-label на .review-stars, span.review-rating-value', rule: 'оцінка, яку поставив автор: data-rating (1 … 5, з половинками), та сама цифра з одним знаком після крапки («4.5») і той самий підпис («4.5 out of 5»). Якщо оцінки немає — приберіть увесь блок span.review-rating' },
  { field: 'Платформа', where: 'img.review-source-mark (src), span.review-source-name', rule: 'назва платформи, де опубліковано відгук, і її знак (шлях до файла; alt порожній). Знак можна прибрати' },
  { field: 'Посилання на джерело', where: 'figcaption.review-by > a.review-link', rule: 'текст («Read on Trustpilot») і href — сторінка відгуків на платформі; rel="nofollow noopener". Можна прибрати' },
  { field: 'Мова цитат', where: 'lang на .reviews-track / .reviews-grid', rule: 'якщо відгуки подано мовою оригіналу, а сторінка іншою мовою (українська сторінка: lang="en")' },
  { field: 'Слова стрічки (carousel)', where: 'aria-label на кнопках .reviews-nav; data-dot-label на .reviews-dots', rule: 'підписи для читачів екрана: «Previous reviews», «More reviews», «Reviews page» (до останнього скрипт додає номер сторінки)' },
  { field: 'Кнопка під стрічкою (carousel)', where: '.reviews-actions > a.action-button', rule: 'текст і href; блок можна прибрати' },
];

/* what stays locked */
const locked = [
  'відгук — цитата: текст, ім’я й оцінка беруться зі справжнього відгуку на платформі й не редагуються по суті (див. «Текст відгуку»). Відгуки з критикою не обрізають до похвали — їх не беруть узагалі',
  'оцінки цифрами — факти: і оцінка окремого відгуку, і будь-яка зведена оцінка платформи («4.7», «4.9 / 5») є даними, а не оздобою; зведених оцінок ця секція не показує',
  'усі класи й обгортки: .reviews-inner, .reviews-top, .section-head, .reviews-rail, .reviews-track, .reviews-grid, .reviews-item, .review-card і частини картки',
  'data-component="reviews" на секції — гачок для перевірок; data-layout, data-space і фон (data-surface="dark" для carousel, data-bg="tint" для grid) — обов’язкові',
  'гачки стрічки (carousel): data-carousel на секції, data-carousel-track на стрічці, data-carousel-prev і data-carousel-next на кнопках, порожній блок data-carousel-dots — їх читає build/assets/js/45-carousel.js; крапки він малює сам',
  'класи-гачки: rv на рядку заголовка, стрічці й кнопці; rv-kids на сітці; btn-press, group, icon-orb на кнопці; orb на світінні',
  'зірки — блок span.review-stars (десять <svg>): копіюється як є; скільки з них зафарбовано, визначає лише data-rating',
  'тло темної секції — блок div.reviews-bg зі світінням: копіюється як є',
  'порядок у картці: платформа й оцінка → цитата → автор і посилання',
  'жодних style="", <script>, <style>, класів Tailwind (px-4, text-ink-600 …) усередині секції',
];

module.exports = { name: 'reviews', variants, RATINGS, classes, hooks, inline, editable, locked };
