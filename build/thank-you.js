/* Generate site/thank-you.html — the page a customer sees after paying.

   No brief: Olex asked for it on 2026-10-13, from a screenshot of the old page — an
   illustration with a green tick over its lower edge, "Thank you for making the purchase
   at PlagiarismSearch!", one button ("Check for plagiarism"), a line about more services
   and discounts on social media, six social icons. He did not know how current that page
   is and asked for a modern one in the site's design system — and said plainly that the
   404 page is NOT the model for it. Its model is the payment page it follows: the same
   path, one step further.

   WHAT A THANK-YOU PAGE IS FOR, and so what is on this one:
     1  it says where the customer is        the path, finished: Plan ✓ — Payment ✓ — Ready
                                             to check; then the thanks
     2  it shows what was bought             the pass: the payment page's order summary
                                             come back as a ticket stamped with the tick —
                                             the plan on its stub, the receipt under the
                                             tear line
     3  it gives ONE next step               "Check for plagiarism" — the old page's button
                                             — and, beside it, the way to the account
     4  it says where the proof is           the confirmation by email; who to write to
     5  then, quietly, help and the rest     one panel: the Help Center, and the social
                                             accounts the old page ended with
   Olex, on the first draft (2026-10-13): no "first check in three steps" — a customer who
   has just paid has usually just run a check and knows how; the help and the social
   accounts follow the thanks at once, set as one panel of their own.
   No auto-redirect: a page that leaves by itself takes the receipt away before it is
   read, and a timer has to be stoppable to be accessible. The account is one click away.

   THE PASS IS THE PAYMENT PAGE'S SUMMARY. It carries the same hooks ([data-payment],
   data-pay="order|holds|recurring|total") and the same two JSON islands, so the same
   script (site.js, module payment — 62-payment.js) fills it from the address:
   thank-you.html#plan=premium&period=yearly&recurring=on shows that order. Opened without
   a fragment, or without script, it shows the example order of the payment page
   (build/payment.js: ORDER). No figure is typed here.

   WHAT IS AN EXAMPLE, AND THE BACKEND'S IN PRODUCTION: the whole pass — the order number
   (ORDER_NUMBER below is made up), the plan, the total.

   THE COPY IS OURS, EXCEPT the button's label, which is the old page's. Three statements
   in it are TO BE CONFIRMED by the developer, because the old page does not make them:
   that the plan can be used straight away, and that a confirmation is sent by email.
   The support address is the payment page's (the live one).

   THE SOCIAL ACCOUNTS are the six the live site links in its footer (read on
   2026-10-13), in the old page's order. They are named in words: the site's icon set
   (Lucide) has no brand marks, and no brand mark is drawn by hand.

   Run:  node build/thank-you.js  →  node build/shell.js  →  node build/check-thank-you.js
*/
const fs = require('fs');
const path = require('path');
const page = require('./page');
const action = require('./sections/action');
const widget = require('./pricing');     /* the data island the plan cards carry */
const P = require('./payment');          /* the example order, the names, the support address */

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'thank-you.html';

/* an example: the backend's in production */
const ORDER_NUMBER = 'PS-104582';

const COPY = {
  title: 'Thank you for your purchase',
  /* the path the customer has walked: two steps done, the third is where they stand */
  path: { label: 'Your order', steps: ['Plan', 'Payment', 'Ready to check'] },
  h1: 'Thank you for your purchase',
  lead: 'Your payment went through and your plan is ready to use. You can run your first check right now.',
  primary: ['Check for plagiarism', 'index.html#checker'],          /* the old page's button */
  secondary: ['Go to my account', 'account.html'],
  /* [before the address, after it] */
  note: ['We have sent a confirmation of this order to your email. If anything looks wrong, write to', '— we will sort it out.'],
  pass: {
    h2: 'Your order',
    status: 'Paid',
    rows: { number: 'Order number', billing: 'Billing' },
    recurring: 'Recurring payments',
    total: 'Total paid',
  },
  help: {
    title: 'Need a hand?',
    text: 'The Help Center answers questions about plans, payments and reports.',
    link: ['Visit the Help Center', 'help-center.html'],
  },
  social: {
    title: 'Follow us for news and discounts',
    links: [
      ['Facebook', 'https://www.facebook.com/BeAuthentic'],
      ['YouTube', 'https://www.youtube.com/channel/UCDAcwt02U9A_6Gy2XX98VCw'],
      ['X', 'https://twitter.com/AuthenticPapers'],
      ['Pinterest', 'https://www.pinterest.com/plagiarismsearc/'],
      ['LinkedIn', 'https://www.linkedin.com/company/plagiarismsearch/'],
      ['Instagram', 'https://www.instagram.com/plagiarismsearch/'],
    ],
  },
};

/* the page's name in the tab is the same for every order: the script (module payment)
   titles the page from these two, and neither names the order */
const WORDS = Object.assign({}, P.WORDS, { subscription: COPY.title, once: COPY.title });

const LABEL = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const WRAP = 'relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10';
const ico = (paths, size = 20, w = 1.75) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
/* Lucide: check, life-buoy, badge-percent */
const I = {
  check: '<path d="M20 6 9 17l-5-5"/>',
  lifebuoy: '<circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/>',
  percent: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m15 9-6 6"/><path d="M9 9h.01"/><path d="M15 15h.01"/>',
};
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
const TEXT_LINK = 'font-semibold text-ink-900 underline decoration-ink-300 hover:decoration-ink-500 underline-offset-4 transition-colors duration-300';

/* ── the path ─────────────────────────────────────────────────────────────────
   Three steps in a row, at every width: the two behind the customer carry a tick, the
   third is where they stand now. A list, read in order; the state of each step is said
   in words for a screen reader. */
const trail = () => {
  const last = COPY.path.steps.length - 1;
  return `<ol class="rv flex items-center justify-center lg:justify-start gap-2 sm:gap-3 text-[12px] sm:text-[12.5px] font-semibold" aria-label="${COPY.path.label}">
${COPY.path.steps.map((s, i) => `  <li class="flex items-center gap-2 sm:gap-3"${i === last ? ' aria-current="step"' : ''}>
${i ? `    <span class="w-4 sm:w-7 h-0.5 rounded-full ${i === last ? 'bg-teal-500' : 'bg-mint-500'}" aria-hidden="true"></span>\n` : ''}    ${i === last
    ? '<span class="w-5 h-5 shrink-0 rounded-full bg-white ring-2 ring-teal-500 inline-flex items-center justify-center" aria-hidden="true"><span class="w-2 h-2 rounded-full bg-teal-500"></span></span>'
    : `<span class="w-5 h-5 shrink-0 rounded-full bg-mint-600 text-white inline-flex items-center justify-center" aria-hidden="true">${ico(I.check, 11, 3.5)}</span>`}
    <span class="${i === last ? 'text-ink-900' : 'text-ink-500'} whitespace-nowrap">${s}${i === last ? '' : '<span class="sr-only"> — done</span>'}</span>
  </li>`).join('\n')}
</ol>`;
};

/* ── the stamp (39-thank-you.css) ─────────────────────────────────────────────
   A green disc with a tick, set over the pass's upper edge — where the old page set its
   tick over the illustration. A halo leaves it once; small sparks stand around it, the
   old drawing's pluses and rings in the site's colours. Sizes and places are utilities;
   the motion is in the stylesheet. */
const plus = cls => `<svg class="ty-spark absolute ${cls}" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 1v10M1 6h10"/></svg>`;
const stamp = () => `<div class="ty-mark absolute z-10 -top-9 sm:-top-10 right-6 sm:right-8 w-[76px] h-[76px] sm:w-[88px] sm:h-[88px]" aria-hidden="true">
  <span class="ty-halo absolute inset-0 rounded-full ring-2 ring-mint-400"></span>
  <span class="ty-disc absolute inset-0 rounded-full bg-mint-600 ring-[6px] ring-white shadow-[0_14px_28px_-10px_rgba(27,122,80,.6)] flex items-center justify-center text-white">
    <svg class="ty-check w-[46%] h-[46%]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M20 6 9 17l-5-5"/></svg>
  </span>
  <span class="ty-spark absolute -left-7 top-2 w-2 h-2 rounded-full bg-orange-400"></span>
  ${plus('-left-12 top-5 w-3 h-3 text-teal-500')}
  <span class="ty-spark absolute -right-3 -top-3 w-2.5 h-2.5 rounded-full ring-2 ring-orange-300"></span>
  ${plus('left-3 -top-6 w-2.5 h-2.5 text-mint-500')}
  <span class="ty-spark absolute -left-4 -top-3 w-1.5 h-1.5 rounded-full bg-teal-400"></span>
</div>`;

/* ── the pass ─────────────────────────────────────────────────────────────────
   A ticket in two parts. The stub names what was bought — the plan, what it holds, and
   "Paid"; under the tear line the receipt — the order number, the billing, the total.
   The two parts are two white sheets whose facing corners are rounded: where they meet
   the edge pinches in, as a ticket's does, with no mask and no cut-out to keep in step
   with the ground behind. One shadow is cast by the whole shape (a drop-shadow on the
   wrapper). The hooks are the payment page's, for the same script. */
const SHEET = 'bg-white px-6 sm:px-7 lg:px-8';
const row = (name, value, attr = '') => `      <div class="flex items-baseline justify-between gap-6 py-3"${attr}>
        <dt class="shrink-0 text-[13px] sm:text-[13.5px] text-ink-500">${name}</dt>
        <dd class="min-w-0 text-right text-[13.5px] sm:text-[14px] font-semibold text-ink-900">${value}</dd>
      </div>`;

const pass = () => `<aside class="rv relative min-w-0 w-full max-w-[440px] mx-auto lg:max-w-none mt-6 lg:mt-0" aria-labelledby="order-pass">
${indent(stamp(), '  ')}
  <div class="drop-shadow-[0_24px_40px_rgba(17,24,39,.10)]">
    <div class="${SHEET} pt-7 sm:pt-8 pb-7 rounded-t-[28px] rounded-b-[16px]">
      <h2 id="order-pass" class="${LABEL} text-teal-700">${COPY.pass.h2}</h2>
      <p class="mt-4 text-[clamp(1.7rem,2.6vw,2.2rem)] font-extrabold tracking-tightest leading-[1.05] text-ink-900" data-pay="order">${P.ORDER.name}</p>
      <p class="mt-2.5 text-[14.5px] sm:text-[15px] text-ink-600" data-pay="holds">${P.ORDER.holds}</p>
      <p class="mt-5 inline-flex items-center gap-1.5 rounded-full bg-mint-100 text-mint-700 pl-2.5 pr-3 py-1 text-[12px] font-bold tracking-wide">${ico(I.check, 12, 3)}${COPY.pass.status}</p>
    </div>
    <div class="relative ${SHEET} pt-3 pb-7 sm:pb-8 rounded-t-[16px] rounded-b-[28px]">
      <span class="absolute top-0 left-5 right-5 border-t-2 border-dashed border-ink-200" aria-hidden="true"></span>
      <dl class="divide-y divide-ink-200/70">
${row(COPY.pass.rows.number, `<span class="nums">${ORDER_NUMBER}</span>`)}
${row(COPY.pass.rows.billing, COPY.pass.recurring, ' data-pay="recurring"')}
      </dl>
      <p class="mt-2 pt-5 border-t border-ink-200/70 flex items-baseline justify-between gap-4">
        <span class="text-[14px] font-bold">${COPY.pass.total}</span>
        <span class="text-[26px] sm:text-[28px] lg:text-[30px] font-extrabold tracking-tightest leading-none nums" data-pay="total">${P.ORDER.price}</span>
      </p>
    </div>
  </div>
</aside>`;

/* ═══════════════ 1 · THE THANKS AND THE PASS ═══════════════ */
const thanks = () => `  <!-- ================= THANK YOU · THE PAYMENT WENT THROUGH =================
       Two columns from 1024px: on the left the finished path, the thanks, the one next
       step and where the confirmation went; on the right the pass — the payment page's
       order summary as a ticket, stamped with the tick. Under 1024px one centred column:
       the thanks, then the pass.
       The section is the script's root (data-payment): it fills the pass from the
       address's fragment, as on the payment page. -->
  <section id="thank-you" data-component="thank-you" data-payment class="relative pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-28 bg-[#F2FCFC] overflow-hidden">
    <div class="dot-field absolute inset-0" aria-hidden="true"></div>
    <div class="orb orb-hero-teal"></div>
    <div class="orb orb-hero-coral"></div>

    <div class="${WRAP}">
      <div class="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] gap-12 sm:gap-14 lg:gap-14 xl:gap-24 items-center">

        <div class="min-w-0 text-center lg:text-left">
${indent(trail(), '          ')}
          <h1 class="rv mt-6 sm:mt-7 text-[clamp(2.3rem,5vw,4.1rem)] font-extrabold tracking-tightest leading-[1.03] max-w-[14ch] mx-auto lg:mx-0">${COPY.h1}</h1>
          <p class="rv mt-5 lg:mt-6 text-[15.5px] sm:text-[16.5px] lg:text-[18px] leading-relaxed text-ink-600 max-w-[44ch] mx-auto lg:mx-0">${COPY.lead}</p>

          <div class="rv mt-7 lg:mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-3">
${indent(action.button({ label: COPY.primary[0], href: COPY.primary[1] }), '            ')}
${indent(action.link({ label: COPY.secondary[0], href: COPY.secondary[1] }), '            ')}
          </div>

          <p class="rv mt-7 lg:mt-9 text-[13px] sm:text-[13.5px] leading-relaxed text-ink-500 max-w-[52ch] mx-auto lg:mx-0">${COPY.note[0]} <a href="mailto:${P.SUPPORT}" class="${TEXT_LINK}">${P.SUPPORT}</a> ${COPY.note[1]}</p>
        </div>

${indent(pass(), '        ')}

      </div>
    </div>
    ${widget.island()}
    <script type="application/json" data-payment-words>${JSON.stringify(WORDS)}</script>
  </section>`;

/* ═══════════════ 2 · HELP AND THE REST ═══════════════ */
/* one half of the panel: an icon, a name, and what is under it */
const half = (icon, id, title, inner) => `        <div class="min-w-0 flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4 sm:gap-5 text-center sm:text-left p-6 sm:p-8 lg:p-10">
          <span class="inline-flex w-11 h-11 lg:w-12 lg:h-12 shrink-0 rounded-2xl bg-white ring-1 ring-black/5 shadow-diffuse items-center justify-center text-teal-700">${ico(I[icon], 22)}</span>
          <div class="min-w-0">
            <h2 id="${id}" class="text-[18px] sm:text-[19px] lg:text-[21px] font-extrabold tracking-tight leading-[1.2] text-ink-900">${title}</h2>
${inner}
          </div>
        </div>`;

const more = () => `  <!-- ================= THANK YOU · HELP AND THE REST =================
       One panel, straight after the thanks: where to get help, and the social accounts
       the old page ended with — named in words, as plain links. Two halves, side by side
       from 1024px with a hairline between them, one under the other below. Nothing here
       is needed to finish the purchase. -->
  <section id="more" data-component="thank-you-more" class="relative py-12 sm:py-16 lg:py-20 bg-white">
    <div class="${WRAP}">
      <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-ink-50 ring-1 ring-black/5 grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-ink-200/80">
${half('lifebuoy', 'need-a-hand', COPY.help.title, `            <p class="mt-2 text-[14px] sm:text-[14.5px] lg:text-[15px] leading-relaxed text-ink-600">${COPY.help.text}</p>
            <p class="mt-4"><a href="${COPY.help.link[1]}" class="action-link">${COPY.help.link[0]}</a></p>`)}
${half('percent', 'follow-us', COPY.social.title, `            <ul class="mt-3 flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-2 text-[14px] sm:text-[14.5px]" aria-labelledby="follow-us">
${COPY.social.links.map(([name, href]) => `              <li><a href="${href}" target="_blank" rel="noopener noreferrer" class="${TEXT_LINK}">${name}</a></li>`).join('\n')}
            </ul>`)}
      </div>
    </div>
  </section>`;

module.exports = { COPY, WORDS, ORDER_NUMBER, OUT };
if (require.main !== module) return;

const html = page.render({ title: COPY.title + P.WORDS.site, sections: [thanks(), more()] });
fs.writeFileSync(path.join(SITE, OUT), html);
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
