/* Pricing preview — the content contract: what an editor may change in the section's HTML, and what not.

   Read by build/sections/pricing-preview.check.js (the validator, run by
   build/check-library.js), by the template (build/sections/pricing-preview.js takes its
   variant values from here) and by build/section-library.js (the catalogue page,
   site/section-library.html). One source, so the rules an editor reads are the rules the
   validator applies.

   THE RULE OF THIS COMPONENT: an editor changes the words AROUND the plans — the heading,
   the intro, the note, the link under the cards — and never a figure. Plan names, prices,
   rates, quotas, periods, the Recommended state and the cards' buttons are not page copy:
   they come from the pricing data source (build/pricing-data.js — the stand-in for the
   backend widget) and DEC-0042 forbids freezing them into a page. The period switch and
   the plan cards are therefore two sealed blocks, copied exactly as the snippet has them,
   and the validator refuses a section whose figures are not the data source's. */

/* the variant switches, on the element that carries them */
const variants = {
  section: {
    'data-layout': { values: ['center', 'split'], required: true,
      uk: 'розкладка. center — заголовок і перемикач по центру, рекомендований тариф темний і піднятий, під картками рядок із приміткою періоду й тихим посиланням (головна). split — заголовок ліворуч, праворуч картка-примітка, перемикач біля лівого краю, три однакові білі картки, під ними світла кнопка (Turnitin Alternative). Це різні фрагменти — беріть відповідний зразок, а не міняйте атрибут.' },
    'data-bg': { values: ['tint'], required: true,
      uk: 'фон секції — сірий відтінок (ink-50): картки тарифів білі, пігулка біла. Інших фонів немає.' },
    'data-space': { values: ['md', 'lg'], required: true,
      uk: 'вертикальний ритм сторінки на десктопі: lg — 128px, md — 112px. Беріть той, що в сусідніх секцій сторінки.' },
    'data-accent': { values: ['teal'], required: false,
      uk: 'колір крапки в пігулці. Без атрибута — помаранчева; teal — бірюзова.' },
  },
  intro: {
    'data-measure': { values: ['64', '72'], required: false,
      uk: 'найдовший рядок вступу, у символах (split). Без атрибута — на всю ширину блока.' },
  },
  button: {
    'data-tone': { values: ['light'], required: true,
      uk: 'кнопка під картками (split) — світла: біла з обідком. Темні кнопки належать самим тарифам.' },
  },
};

/* the classes each part may carry — its own class first; nothing else, anywhere outside the sealed blocks */
const classes = {
  section: ['pricing-preview'],
  glow: ['pricing-glow', 'orb'],
  inner: ['pricing-inner'],
  head: ['section-head', 'rv'],
  top: ['pricing-top'], topHead: ['pricing-top-head', 'rv'],
  aside: ['pricing-aside', 'rv'], asideIcon: ['pricing-aside-icon'], asideText: ['pricing-aside-text'],
  foot: ['pricing-foot', 'rv'], note: ['pricing-note'], footDot: ['pricing-foot-dot'], link: ['pricing-link'],
  actions: ['pricing-actions', 'rv'],
};

/* the behaviour hooks a part must keep besides its own class */
const hooks = { glow: ['orb'], block: ['rv'] };

/* the sealed slots: rendered by build/pricing.js, copied as they are */
const slots = {
  'pricing-periods': 'the period switch (.period-btn buttons, one per period of the data); in center, optionally with the "Recurring payments" switch under the tabs (label.pr-switch > input[data-recurring])',
  'pricing-plans': 'the plan cards ([data-tier]) with the feature-line template and the JSON island of the pricing data',
};

/* inline markup allowed inside each text part */
const inline = {
  title: ['br', 'em', 'strong'],
  intro: ['strong', 'em', 'br'],
  aside: ['strong', 'em', 'br'],
  label: [],
};

/* what the editor may change — the catalogue prints this table */
const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці; можна прибрати, якщо на секцію ніхто не посилається' },
  { field: 'Варіанти', where: 'data-space, data-accent на <section>; data-measure на p.section-intro', rule: 'лише значення зі списку варіантів. data-layout не міняйте на готовому фрагменті: у кожної розкладки свої блоки' },
  { field: 'Надпис-пігулка', where: '.section-eyebrow-label', rule: 'текст; блок .section-eyebrow можна прибрати цілком. Фон пігулки не задається' },
  { field: 'Заголовок H2', where: 'h2.section-title', rule: 'текст (обов’язковий); допускаються <br>, <em>, <strong>. Без цін і цифр тарифів' },
  { field: 'Вступ', where: 'p.section-intro', rule: 'текст; можна прибрати. Без цін: суми, квоти й періоди показують лише картки' },
  { field: 'Картка-примітка (split)', where: 'p.pricing-aside > span.pricing-aside-text', rule: 'текст; допускаються strong, em, br; блок можна прибрати. Іконка лишається' },
  { field: 'Тихе посилання під картками (center)', where: '.pricing-foot > a.pricing-link', rule: 'текст і href; посилання можна прибрати разом із крапкою-роздільником (span.pricing-foot-dot)' },
  { field: 'Кнопка під картками (split)', where: '.pricing-actions > a.action-button', rule: 'текст і href (rel="noopener" для зовнішніх адрес); блок можна прибрати; кружок зі стрілкою лишається' },
];

/* what stays locked */
const locked = [
  'ЦІНИ. Назви тарифів, ціни, ставка за 1000 слів, квоти, періоди, позначка Recommended і кнопки тарифів — не текст сторінки. Вони приходять з єдиного джерела даних (build/pricing-data.js; у продакшні — віджет бекенду, DEC-0042) і вписані в два запечатані блоки. Жодної цифри в них редактор не змінює',
  'перемикач періодів — блок [data-slot="pricing-periods"]: копіюється як є',
  'перемикач «Recurring payments» (center, де він є) — label.pr-switch > input[data-recurring] у тому ж блоці, під вкладками: один на три картки, копіюється разом із блоком. Увімкнений — картки показують ціну підписки, вимкнений — разову ціну періоду (single з даних); на One-time, де підписки немає, він вимкнений і неактивний (disabled). Валідатор відхиляє другий перемикач, перемикач поза блоком або в split, і перемикач без disabled на початковому періоді без разової ціни',
  'картки тарифів — блок [data-slot="pricing-plans"]: копіюється як є, разом із <template data-pricing-feat> і <script type="application/json" data-pricing-data> усередині. Це «острів» даних: із нього скрипт бере цифри для інших періодів. Без нього перемикач не працює',
  'валідатор відхиляє секцію, якщо: острова немає або він не читається; острів відрізняється від джерела даних (змінена ціна, квота чи період); цифри в картках не збігаються з островом для початкового періоду; кнопки перемикача не відповідають періодам острова',
  'data-pricing="onetime" (початковий період) і data-pricing-animate на секції — гачки скрипта build/assets/js/60-pricing.js; data-component="pricing-preview", data-layout, data-bg, data-space — обов’язкові',
  'примітка періоду — span.pricing-note[data-period-note] (center): її текст теж із даних, скрипт міняє його з періодом; редактор його не пише',
  'ціни в тексті навколо карток (заголовок, вступ, примітка) заборонені: «від $9.95» у вступі — це заморожена ціна',
  'усі класи й обгортки: .pricing-inner, .section-head, .pricing-top, .pricing-foot, .pricing-actions; світіння .orb.pricing-glow у center — копіюється як є',
  'класи-гачки: rv на блоці заголовка і на блоках під ним; btn-press, group, icon-orb на кнопці; orb на світінні',
  'порядок: заголовок → перемикач періодів → картки → рядок або кнопка під ними',
  'жодних style="", <script> (крім острова даних), <style>, класів Tailwind (px-4, text-ink-600 …) поза запечатаними блоками',
];

module.exports = { name: 'pricing-preview', variants, classes, hooks, slots, inline, editable, locked };
