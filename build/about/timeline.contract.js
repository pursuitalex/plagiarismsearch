/* Timeline — the content contract: what an editor may change in the Timeline's HTML, and
   what not.

   PAGE-SPECIFIC: the About page's own component, not a Section Library member (a library
   candidate after the pilot review), so it is not in the catalogue.

   Read by build/about/timeline.check.js (the validator, run by build/check-about.js).

   The rule of thumb for the CMS: change the YEAR, the TITLE and the TEXT of a milestone;
   add or remove a milestone by copying or deleting a whole <li class="timeline-item">;
   keep them in chronological order; leave every class as the snippet has it. */

const variants = {
  section: {
    'data-bg': { values: ['white', 'tint'], required: true,
      uk: 'фон секції: white — білий, tint — світло-сірий (ink-50). Чергуйте з сусідніми секціями.' },
  },
};

const classes = {
  section: ['timeline'],
  inner: ['timeline-inner'],
  head: ['timeline-head', 'rv'],
  list: ['timeline-list'],
  item: ['timeline-item', 'rv'],
  year: ['timeline-year'],
  title: ['timeline-title'],
  text: ['timeline-text'],
};

const inline = { text: ['strong', 'em', 'br'], year: [], title: [] };

const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці; можна прибрати' },
  { field: 'Фон секції', where: 'data-bg на <section>', rule: 'white | tint' },
  { field: 'Надпис-пігулка', where: '.section-eyebrow-label', rule: 'текст; блок .section-eyebrow можна прибрати цілком' },
  { field: 'Заголовок H2', where: '.section-title', rule: 'текст (обов’язковий); допускаються <br>, <em>, <strong>' },
  { field: 'Вступ', where: 'p.section-intro', rule: 'текст; можна прибрати' },
  { field: 'Рік', where: 'p.timeline-year', rule: 'лише текст (рік); події йдуть у хронологічному порядку' },
  { field: 'Назва події', where: 'h3.timeline-title', rule: 'лише текст, коротко — один рядок' },
  { field: 'Опис події', where: 'p.timeline-text', rule: 'текст, одне речення; допускаються strong, em, br' },
  { field: 'Кількість подій', where: 'li.timeline-item', rule: 'копіюйте або видаляйте цілий <li class="timeline-item rv">; на десктопі ряд розрахований приблизно на шість подій' },
];

const locked = [
  'усі класи й порядок частин у події: рік → назва → опис',
  'data-component="timeline" на секції, role="list" на <ol class="timeline-list">',
  'лінія і крапки — малюються стилями (build/sections/timeline.css), окремих елементів для них немає',
  'клас rv на .timeline-head і на кожній .timeline-item — анімація появи',
  'жодних style="", <script>, <style>, класів Tailwind усередині секції',
];

module.exports = { name: 'timeline', variants, classes, inline, editable, locked };
