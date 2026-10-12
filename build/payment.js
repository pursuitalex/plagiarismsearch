/* Generate site/payment.html — the payment page: where a customer lands after choosing a
   plan on Pricing, or from any order button.

   No brief: Olex asked for it on 2026-10-12, from a screenshot of the live page
   ("Standard Monthly subscription payment"). Its content is the live page's, word for
   word; what is ours is the manner — the site's design system — and the classic layout
   he named: the content on the left, which may run as tall as it likes, and the order
   summary on the right, which stays in view while the page scrolls (position: sticky —
   CSS, no script). On a phone the summary follows the methods, in the page's flow.

   What is on it, as on the live page:
     the head      breadcrumb and the page's name (the plan and the period)
     the left      "Payment methods": the note to the customer, and the two methods as one
                   radio group — Stripe (selected) and PayPal, each with its paragraph and
                   the payment marks it accepts
     the right     "Order summary": the plan, what it holds, "Recurring payments", the
                   gift card / discount code field, the total, "To checkout"

   THE FIGURES ARE NOT THE PAGE'S. The plan shown is an example — the live screenshot's,
   Standard · Monthly — and its name, price and contents are read from the one pricing
   source (build/pricing-data.js), never typed here. The live page words the quota "300
   submissions"; the pricing source says "300 plagiarism checks", and the page follows the
   source so it agrees with the plan cards. In production the whole summary is the
   backend's: which plan, which period, recurring or not, the code, the total.

   A SHELL, LIKE EVERY FORM IN THE PROTOTYPE. The radios choose, the field takes text, and
   nothing is sent: the form has no action and submits nowhere. No card field is drawn —
   the customer enters payment details at the provider, after "To checkout".

   THE PAYMENT MARKS ARE NAMES FOR NOW. The live page shows the providers' and card
   schemes' logos; the prototype has no approved files for them, and a brand mark is not
   drawn by hand. So each stands as its name in a plate, sized as a logo will be, until
   the files arrive (MARKS below is the one place to put them).

   THE ORDER FOLLOWS THE ADDRESS (Olex, 2026-10-12). Every plan card's button leads here
   and names its order in the address's fragment — #plan=standard&period=monthly&recurring=on
   (build/pricing.js: orderHref). The page carries the pricing data as the same JSON island
   the cards carry, and site.js (module payment, 62-payment.js) fills the head and the
   summary from it: the plan and the period, the price — the subscription's, or the one-off
   `single` when Recurring payments is off — what the plan holds, the Recurring payments
   line (shown only for a subscription) and the total. Opened without a fragment, or
   without script, the page shows the example order rendered here.
   The live page names a subscription "… subscription payment"; a one-off order's name is
   not known from the screenshot, so it is "… payment" (WORDS below) — to be confirmed.
   The live address of this page is not known.

   Run:  node build/payment.js  →  node build/shell.js  →  node build/check-payment.js
*/
const fs = require('fs');
const path = require('path');
const page = require('./page');
const pricing = require('./pricing-data');
const widget = require('./pricing');   /* the data island the plan cards carry */

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'payment.html';

/* the example order: the live screenshot's plan and period, its figures from the source */
const TIER = 'standard', PERIOD = 'monthly';
const PERIOD_NAME = { onetime: 'One-time', monthly: 'Monthly', quarterly: '3-Months', yearly: 'Yearly' };
/* what the script needs besides the figures: the names, and how the page is titled */
const WORDS = { tiers: pricing.LABEL, periods: PERIOD_NAME, subscription: '{order} subscription payment', once: '{order} payment', site: ' | PlagiarismSearch' };
const PLAN = pricing.PLANS[PERIOD][TIER];
const ORDER = {
  name: pricing.LABEL[TIER] + ' ' + PERIOD_NAME[PERIOD],      /* "Standard Monthly" */
  price: PLAN.price,                                           /* the recurring price: the example has Recurring payments on */
  holds: PLAN.feats[0],
};

/* ─────────────────────────────────────────────────────────────────────────────
   THE LIVE PAGE'S COPY — verbatim (the screenshot of 2026-10-12).
   ───────────────────────────────────────────────────────────────────────────── */
const SUPPORT = 'services@plagiarismsearch.com';
const COPY = {
  title: WORDS.subscription.replace('{order}', ORDER.name) + WORDS.site,
  h1: WORDS.subscription.replace('{order}', ORDER.name),
  crumbs: [['Home', 'index.html'], ['Prices', 'prices.html']],
  methods: {
    h2: 'Payment methods',
    /* [before the button's name, the button's name, after it, the address] */
    note: ['Dear Customer! Please refer to the payment system that is more convenient for you and press', 'To checkout', '. In case you experience any inconveniences, please do not hesitate to contact us any time. Depending on your request you may contact our live chat or'],
    items: [
      { id: 'stripe', name: 'Stripe', text: 'facilitates transactions worldwide, accepting a wide range of payment methods including major debit and credit cards, e-wallets, bank debits, and transfers. Accredited by the Better Business Bureau, Stripe maintains an outstanding A+ rating.',
        marks: ['Visa', 'Mastercard', 'American Express', 'Discover', 'Diners Club', 'JCB', 'UnionPay', 'Apple Pay'] },
      { id: 'paypal', name: 'PayPal', text: 'is a trusted online payment platform that accepts various methods including major credit and debit cards providing users with flexibility and convenience in their financial transactions.',
        marks: ['Visa', 'Mastercard', 'Amex', 'Discover'] },
    ],
  },
  summary: {
    h2: 'Order summary',
    recurring: 'Recurring payments',
    codeLabel: 'Gift card or Discount code',
    codePlaceholder: 'Discount code',
    apply: 'Apply',
    total: 'Total',
    submit: 'To checkout',
  },
};

/* a payment mark: the provider's or scheme's logo, when its file is here — { name: [src, w, h] } */
const MARKS = {};

const LABEL = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const WRAP = 'relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10';
const SHELL = 'rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.025] ring-1 ring-black/[.12] p-1.5 sm:p-2 shadow-diffuse';
const SHEET = 'rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl';
const ico = (paths, stroke, size = 20, w = 1.75) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const I = {
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  lock:  '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
};
const mark = name => (MARKS[name]
  ? `<img src="${MARKS[name][0]}" alt="${name}" width="${MARKS[name][1]}" height="${MARKS[name][2]}" loading="lazy" decoding="async" class="h-6 w-auto">`
  : `<span class="inline-flex items-center h-7 rounded-md bg-white ring-1 ring-black/10 px-2 text-[11px] font-bold tracking-tight text-ink-700 whitespace-nowrap">${name}</span>`);

/* ═══════════════ THE HEAD ═══════════════ */
const head = () => `  <!-- ================= PAYMENT · THE PAGE'S NAME =================
       A compact head on the tint: where the customer is (the breadcrumb) and what they
       are paying for — the plan and the period, as the live page names it. -->
  <section data-component="payment-head" class="relative pt-28 sm:pt-32 lg:pt-36 pb-8 sm:pb-10 lg:pb-12 bg-[#F2FCFC] overflow-hidden">
    <div class="dot-field absolute inset-0" aria-hidden="true"></div>
    <div class="orb orb-hero-teal"></div>
    <div class="${WRAP}">
      <nav class="rv flex flex-wrap items-center gap-2 text-[12.5px] font-medium text-ink-500 mb-4 sm:mb-5" aria-label="Breadcrumb">
${COPY.crumbs.map(([l, h]) => `        <a href="${h}" class="hover:text-ink-700 transition-colors duration-300">${l}</a>
        <span class="text-ink-500" aria-hidden="true">/</span>`).join('\n')}
        <span class="text-ink-700" aria-current="page" data-pay="title">${COPY.h1}</span>
      </nav>
      <h1 class="rv text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08] max-w-[22ch]" data-pay="title">${COPY.h1}</h1>
    </div>
  </section>`;

/* ═══════════════ THE METHODS AND THE SUMMARY ═══════════════ */
/* a method: the whole card is the radio's label. The chosen one is told three ways — the
   radio itself, a teal hairline and a white ground — never by colour alone. */
const method = (m, i) => `            <label class="group relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 lg:gap-8 rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-ink-50 ring-1 ring-black/5 has-[:checked]:bg-white has-[:checked]:ring-2 has-[:checked]:ring-teal-500 has-[:checked]:shadow-diffuse hover:ring-black/15 p-5 sm:p-6 lg:p-7 cursor-pointer transition-shadow duration-300">
              <span class="flex items-center gap-4 sm:w-[210px] shrink-0">
                <input type="radio" name="payment_method" value="${m.id}"${i === 0 ? ' checked' : ''} class="w-[18px] h-[18px] shrink-0 accent-teal-600">
                <span class="text-[22px] sm:text-[24px] lg:text-[26px] font-extrabold tracking-tightest leading-none text-ink-900">${MARKS[m.name] ? mark(m.name) : m.name}</span>
              </span>
              <span class="min-w-0 flex-1">
                <span class="block text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600"><span class="font-semibold text-ink-900">${m.name}</span> ${m.text}</span>
                <span class="flex flex-wrap gap-1.5 mt-3.5" aria-label="Accepted through ${m.name}">
${m.marks.map(n => '                  ' + mark(n)).join('\n')}
                </span>
              </span>
            </label>`;

const main = () => `  <!-- ================= PAYMENT · METHODS + ORDER SUMMARY =================
       Two columns from 1024px: the methods on the left, as tall as they need to be; the
       order summary on the right, sticky under the header, so the total and the button
       stay beside whatever the customer is reading. Under 1024px it is one column — the
       methods, then the summary — and nothing is fixed to the screen.
       One form, and it sends nothing (a shell: the developer binds it). The section does
       not clip its content: a clipping ancestor would stop the summary from sticking. -->
  <section id="payment" data-component="payment" data-payment class="relative pt-10 sm:pt-12 lg:pt-14 pb-16 sm:pb-24 lg:pb-28 bg-white">
    <form class="${WRAP}" novalidate onsubmit="return false" aria-label="${COPY.methods.h2}">
      <div class="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-start">

        <div class="min-w-0">
          <h2 class="rv text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold tracking-tightest leading-[1.12]">${COPY.methods.h2}</h2>
          <p class="rv mt-4 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600 max-w-[72ch]">${COPY.methods.note[0]} “<strong class="font-semibold text-ink-900">${COPY.methods.note[1]}</strong>”${COPY.methods.note[2]} <a href="mailto:${SUPPORT}" class="font-semibold text-ink-900 underline decoration-ink-300 hover:decoration-ink-500 underline-offset-4 transition-colors duration-300">${SUPPORT}</a>.</p>

          <fieldset class="rv-kids grid gap-3 sm:gap-4 mt-7 sm:mt-8 lg:mt-10 min-w-0">
            <legend class="sr-only">${COPY.methods.h2}</legend>
${COPY.methods.items.map(method).join('\n')}
          </fieldset>
        </div>

        <aside class="rv lg:sticky lg:top-28 min-w-0" aria-labelledby="order-summary">
          <div class="${SHELL}">
            <div class="${SHEET} p-5 sm:p-6 lg:p-7">
              <h2 id="order-summary" class="text-[clamp(1.5rem,2.4vw,2rem)] lg:text-[22px] font-extrabold tracking-tightest leading-[1.12]">${COPY.summary.h2}</h2>

              <div class="mt-5 flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <p class="${LABEL} text-ink-900" data-pay="order">${ORDER.name}</p>
                  <p class="mt-2 text-[13.5px] text-ink-600" data-pay="holds">${ORDER.holds}</p>
                  <p class="mt-1.5 flex items-center gap-2 text-[13.5px] text-ink-600" data-pay="recurring"><span class="inline-flex w-[18px] h-[18px] rounded-full bg-mint-100 items-center justify-center shrink-0">${ico(I.check, '#1B7A50', 11, 3)}</span>${COPY.summary.recurring}</p>
                </div>
                <p class="shrink-0 text-[16px] sm:text-[17px] font-extrabold tracking-tight nums" data-pay="price">${ORDER.price}</p>
              </div>

              <div class="mt-5 pt-5 border-t border-ink-200/70">
                <label for="payment-code" class="block text-[13px] font-bold text-ink-900 mb-2.5">${COPY.summary.codeLabel}</label>
                <div class="flex gap-2">
                  <input type="text" id="payment-code" name="discount_code" placeholder="${COPY.summary.codePlaceholder}" autocomplete="off" class="cf-field !h-11 flex-1 min-w-0">
                  <button type="button" class="shrink-0 h-11 rounded-xl bg-white ring-1 ring-black/10 hover:ring-black/20 px-4 text-[13px] font-bold transition-shadow duration-300">${COPY.summary.apply}</button>
                </div>
              </div>

              <p class="mt-5 pt-5 border-t border-ink-200/70 flex items-baseline justify-between gap-4">
                <span class="text-[14px] font-bold">${COPY.summary.total}</span>
                <span class="text-[22px] sm:text-[24px] lg:text-[26px] font-extrabold tracking-tightest leading-none nums" data-pay="total">${ORDER.price}</span>
              </p>

              <button type="submit" class="btn-press group mt-6 flex items-center justify-center gap-2.5 w-full rounded-full bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-white text-[14px] font-bold tracking-wide py-3.5">${COPY.summary.submit}${ico(I.arrow, '#fff', 16, 2)}</button>
            </div>
          </div>
        </aside>

      </div>
    </form>
    ${widget.island()}
    <script type="application/json" data-payment-words>${JSON.stringify(WORDS)}</script>
  </section>`;

module.exports = { COPY, ORDER, WORDS, SUPPORT, TIER, PERIOD, OUT };
if (require.main !== module) return;

const html = page.render({ title: COPY.title, sections: [head(), main()] });
fs.writeFileSync(path.join(SITE, OUT), html);
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
