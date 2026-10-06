/* Team — the content contract: what an editor may change in the Team section's HTML, and
   what not.

   PAGE-SPECIFIC: the About page's own component, not a Section Library member (a library
   candidate after the pilot review), so it is not in the catalogue.

   Read by build/about/team.check.js (the validator, run by build/check-about.js). One
   source, so the rules an editor reads here are the rules the validator applies.

   The rule of thumb for the CMS: per person, change the PHOTO, the NAME, the ROLE, the BIO
   and the LINKEDIN ADDRESS; add or remove a person by copying or deleting a whole
   <li class="team-card">; leave every class, the order of the parts and the icon as the
   page has them. */

/* the variant switches, on the element that carries them */
const variants = {
  section: {
    'data-bg': { values: ['white', 'tint'], required: true,
      uk: 'фон секції: white — білий, tint — світло-сірий (ink-50). Плашка фото бере протилежний фон сама: на білій секції — сіра, на сірій — біла. Чергуйте з сусідніми секціями.' },
  },
};

/* the classes each part may carry — nothing else, anywhere inside a Team section */
const classes = {
  section: ['team'],
  inner: ['team-inner'],
  head: ['team-head', 'rv'],
  grid: ['team-grid'],
  card: ['team-card', 'rv'],
  photo: ['team-photo'],
  initials: ['team-initials'],
  img: ['team-photo-img'],
  name: ['team-name'],
  role: ['team-role'],
  bio: ['team-bio'],
  linkedin: ['team-linkedin'],
};

/* inline markup allowed inside the bio (the name and the role are text only) */
const inline = { bio: ['strong', 'em', 'br'], name: [], role: [] };

/* the two parts that are replaced whole when the real material arrives */
const swaps = {
  photo: {
    uk: 'Фото. Поки фото немає — ініціали на плашці. Коли є: замініть <span class="team-initials" …>…</span> на <img>. Файл 4:5 (напр. 800×1000 px, WebP), обличчя в верхній половині кадру; alt — ім’я людини.',
    from: '<span class="team-initials" aria-hidden="true">PK</span>',
    to: '<img class="team-photo-img" src="/assets/img/team/pavlo-kucheruk.webp" alt="Pavlo Kucheruk" width="800" height="1000" loading="lazy" decoding="async">',
  },
  linkedin: {
    uk: 'LinkedIn. Поки адреси немає — неактивна іконка (<span>, не посилання). Коли є: замініть <span class="team-linkedin" aria-hidden="true"> … </span> на <a> з тим самим <svg> усередині; aria-label — «LinkedIn profile of Ім’я Прізвище».',
    from: '<span class="team-linkedin" aria-hidden="true"><svg …></svg></span>',
    to: '<a class="team-linkedin" href="https://www.linkedin.com/in/…" rel="noopener" aria-label="LinkedIn profile of Pavlo Kucheruk"><svg …></svg></a>',
  },
};

/* what the editor may change — the catalogue prints this table */
const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці; можна прибрати, якщо на секцію ніхто не посилається' },
  { field: 'Фон секції', where: 'data-bg на <section>', rule: 'white | tint' },
  { field: 'Надпис-пігулка', where: '.section-eyebrow-label', rule: 'текст; блок .section-eyebrow можна прибрати цілком' },
  { field: 'Заголовок H2', where: '.section-title', rule: 'текст (обов’язковий); допускаються <br>, <em>, <strong>' },
  { field: 'Вступ', where: 'p.section-intro', rule: 'текст; можна прибрати' },
  { field: 'Фото', where: '.team-photo', rule: 'усередині рівно один елемент: span.team-initials (ініціали, 1–3 літери) АБО img.team-photo-img (src, alt = ім’я, width, height; пропорція 4:5)' },
  { field: 'Ім’я', where: 'h3.team-name', rule: 'лише текст, без тегів' },
  { field: 'Посада', where: 'p.team-role', rule: 'лише текст, без тегів' },
  { field: 'Біо', where: 'p.team-bio', rule: 'текст, 2–3 речення, 25–55 слів, приблизно однакової довжини в усіх картках; допускаються strong, em, br' },
  { field: 'LinkedIn', where: '.team-linkedin', rule: 'span (неактивна іконка, адреси ще немає) АБО a з href на linkedin.com, rel="noopener" і aria-label «LinkedIn profile of …»; інших соцмереж немає' },
  { field: 'Кількість людей', where: 'li.team-card', rule: 'копіюйте або видаляйте цілий <li class="team-card rv">; усі картки однакові — жодна не більша за інші' },
];

/* what stays locked */
const locked = [
  'усі класи й порядок частин у картці: фото → ім’я → посада → біо → LinkedIn (від порядку залежить сітка на телефоні й планшеті)',
  'data-component="team" на секції, role="list" на <ul class="team-grid">',
  'пропорція фото 4:5, розмір і розкладка карток, типографіка, відступи — задані в build/sections/team.css',
  'іконка <svg> LinkedIn — копіюється як є',
  'клас rv на .team-head і на кожній .team-card — анімація появи',
  'жодних style="", <script>, <style>, класів Tailwind (px-4, text-ink-600 …) усередині секції',
];

module.exports = { name: 'team', variants, classes, inline, swaps, editable, locked };
