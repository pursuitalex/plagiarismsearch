/* Generate site/discounts.html — the page of discounts and special offers.

   No brief: Olex asked for it on 2026-10-13 — look at the live page
   (plagiarismsearch.com/discounts), and propose one in the site's design system that can
   be added to with different offers for customers.

   THE LIVE PAGE (read 2026-10-13) has, top to bottom: a breadcrumb (Home / Our
   Discounts); "Discount program"; "Here you will find our current promotions and
   discounts"; ONE offer — a button "Apply discount code", "GET 15% / for any submission
   package / discount", an illustration; "Keep in mind that you should be registered to
   use PlagiarismSearch checker" with Sign in and Register; and two blocks, "24/7 Support"
   (Start Live Chat) and "Reasonable prices" (Choose Price Plan).
   What it lacks: the code itself is nowhere on the page (it is only in the button's
   address, /prices?discount_code=15off); the offer has no room for a term or a date; and
   a second offer has no place to go.

   WHAT THIS PAGE IS: A LIST OF OFFERS, RENDERED FROM OFFERS BELOW.
     the first screen    the page's name, and the FEATURED offer as a coupon — what it
                         gives in large type, and on its stub the code, a Copy button and
                         the button that applies it; under it the live page's reminder to
                         register
     "More ways to save" ONE ROW of up to three banners — every other offer: its kind,
                         what it gives with its figure in large type, a line, where it
                         leads — and, when it has them, a code and an end date. Each
                         stands on a ground of its own (teal, coral, mint, in turn)
     the foot            the live page's two blocks, as one grey panel of two halves
   Olex, on the first draft (2026-10-13): the further offers take one row only; they and
   the foot's panel must not look alike — the banners stand out, the panel stays grey.

   HOW TO ADD AN OFFER: add an object to OFFERS; to end one, delete its object.
     kind       the small label over it: "Promo code", "Subscription", "Seasonal", …
     pre        the words before the figure: "Save up to"            (a banner)
     value      the figure, set large: "17%"
     title      the words after it: "with Recurring payments"        (a banner)
     lead/text  the same parts of the featured coupon: "Get" · "discount for any …"
     text       one line of explanation                              (a banner)
     code       a discount code: shown with a Copy button            (optional)
     until      when it ends, as it should read: "Until 30 November" (optional)
     cta        [label, address]
     featured   true on ONE offer: it becomes the coupon of the first screen
   The row holds three banners at most (the build stops on a fourth): a fourth offer
   replaces one, or becomes the featured one. With no featured offer the first screen is
   the page's name alone; with no other offers the row is not written.

   WHERE THE WORDS COME FROM.
     · the head, the 15% offer, the reminder to register and the two blocks of the foot
       are the live page's, word for word (LIVE below);
     · the three banners of "More ways to save" are OURS — the live page has one offer —
       and are there to show the page holding more than one (Olex, 2026-10-13: "add a
       couple more special offers at your discretion"). TO BE CONFIRMED before launch:
         Recurring payments   the saving is computed here from the pricing source (a
                              package on Recurring payments against the same package
                              bought once), never typed;
         Yearly plans         computed too: the price of one check on Yearly against
                              Monthly, for the same plan.
       ONE IS AN EXAMPLE, marked `example: true`: the seasonal offer. Its discount, its
       code and its date are made up, to show a banner that carries a code and an end
       date. Deleting all three leaves the live page's content, in the new design.
       (A first draft also had the Scholarship, the VIP package and the Affiliate
       program as cards; with one row they went — they are pages of their own.)

   THE CODE'S BUTTON. On the live site "Apply discount code" opens Pricing with the code
   in the address (LIVE.apply). The prototype's Pricing does not read a code, so here the
   button opens Pricing and the code is shown beside it to copy; the developer restores
   the address.
   "Start Live Chat" opens the live site's chat; the prototype has no chat, so it leads to
   Contact us, as elsewhere in the prototype.

   Run:  node build/discounts.js  →  node build/shell.js  →  node build/check-discounts.js
*/
const fs = require('fs');
const path = require('path');
const page = require('./page');
const action = require('./sections/action');
const pricing = require('./pricing-data');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'discounts.html';

/* the saving of Recurring payments: the largest, over every package that can be bought
   both ways, of (once − recurring) / once — a whole per cent, rounded down */
const money = s => parseFloat(String(s).replace(/[^0-9.]/g, ''));
const RECURRING_SAVING = Math.floor(Math.max(...Object.values(pricing.PLANS).flatMap(period =>
  Object.values(period).filter(p => p && p.single).map(p => (money(p.single.price) - money(p.price)) / money(p.single.price) * 100))));

/* the saving of a yearly plan: the largest, over the three plans, of how much less one
   check costs on Yearly than on Monthly — the price over the checks the package holds
   (plagiarism and AI together, read from the plan's own lines) */
const checks = p => p.feats.reduce((n, f) => n + (/ checks?$/.test(f) ? money(f) : 0), 0);
const perCheck = p => money(p.price) / checks(p);
const YEARLY_SAVING = Math.floor(Math.max(...Object.keys(pricing.LABEL).map(t =>
  (1 - perCheck(pricing.PLANS.yearly[t]) / perCheck(pricing.PLANS.monthly[t])) * 100)));

/* ─────────────────────────────────────────────────────────────────────────────
   THE LIVE PAGE'S COPY — verbatim (plagiarismsearch.com/discounts, 2026-10-13).
   ───────────────────────────────────────────────────────────────────────────── */
const LIVE = {
  title: 'Check Out Discounts from PlagiarismSearch | Plagiarism Detection',
  meta: 'If you need to get high-quality plagiarism detection tool at affordable prices, this page is for you!',
  crumbs: [['Home', 'index.html']],
  crumb: 'Our Discounts',
  h1: 'Discount program',
  lead: 'Here you will find our current promotions and discounts',
  apply: '/prices?discount_code=15off',          /* where the live button leads */
  register: {
    text: 'Keep in mind that you should be registered to use PlagiarismSearch checker',
    links: [['Sign in', 'account.html'], ['Register', 'account.html']],
  },
  foot: [
    { icon: 'headset', id: 'support', title: '24/7 Support', text: 'Feel free to contact our support team at any time and enjoy instant assistance.', link: ['Start Live Chat', 'contact-us.html'] },
    { icon: 'tag', id: 'prices', title: 'Reasonable prices', text: 'We provide high-quality services at affordable prices.', link: ['Choose Price Plan', 'prices.html'] },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────────
   THE OFFERS — the page is this list (see the head of the file for the fields).
   ───────────────────────────────────────────────────────────────────────────── */
const OFFERS = [
  /* the live page's offer: "GET 15% / for any submission package / discount" */
  { featured: true, kind: 'Promo code', lead: 'Get', value: '15%', text: 'discount for any submission package',
    code: '15off', cta: ['Apply discount code', 'prices.html'] },

  /* AN EXAMPLE, NOT A REAL OFFER: a seasonal one, here to show a card with a code and an
     end date. Its discount, code and date are made up — replace or delete before launch. */
  { example: true, kind: 'Seasonal', pre: 'Save', value: '20%', title: 'on every 3-Months plan this autumn',
    text: 'Enter the code at checkout when you choose a 3-Months plan.',
    code: 'AUTUMN20', until: 'Until 30 November', cta: ['See the plans', 'prices.html'] },

  /* ours, to be confirmed — see the head of the file */
  { kind: 'Subscription', pre: 'Save up to', value: RECURRING_SAVING + '%', title: 'with Recurring payments',
    text: 'A package on Recurring payments costs less than the same package bought once. Keep the switch on when you choose a plan.',
    cta: ['See the plans', 'prices.html'] },
  { kind: 'Yearly plans', pre: 'Pay up to', value: YEARLY_SAVING + '%', title: 'less per check on a yearly plan',
    text: 'A yearly package holds more checks, at a lower price for each, than the same plan paid month by month.',
    cta: ['Compare the plans', 'prices.html'] },
];

const COPY = {
  more: 'More ways to save',
  code: 'Discount code',
  copy: ['Copy', 'Copied'],
};

const LABEL = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const WRAP = 'relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10';
const TEXT_LINK = 'font-semibold text-ink-900 underline decoration-ink-300 hover:decoration-ink-500 underline-offset-4 transition-colors duration-300';
const ico = (paths, size = 20, w = 1.75) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
/* Lucide: arrow-right, copy, clock, headset, tag */
const I = {
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  headset: '<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
};
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');

/* the parts an offer may carry, wherever it is shown. On a banner's coloured ground the
   kind takes the ground's own dark, and the date and the code stand on white. */
const kind = (o, tone = 'text-teal-700') => `<p class="${LABEL} ${tone}">${o.kind}</p>`;
const until = (o, on = 'bg-orange-50 text-orange-700') => (o.until ? `<p data-offer-until class="inline-flex items-center gap-1.5 rounded-full ${on} pl-2.5 pr-3 py-1 text-[12px] font-bold">${ico(I.clock, 13, 2)}${o.until}</p>` : '');
/* a code: the text itself, selectable, and a button that copies it (63-copy-text.js) */
const code = (o, on = 'border-teal-300 bg-teal-50/60') => `<div class="relative flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed ${on} pl-4 sm:pl-5 pr-1.5 py-1.5">
  <span class="min-w-0 font-mono text-[18px] sm:text-[20px] font-bold tracking-[0.1em] text-ink-900 break-all">${o.code}</span>
  <button type="button" data-copy-text="${o.code}" data-copied="${COPY.copy[1]}" aria-label="${COPY.copy[0]} the code ${o.code}" class="btn-press shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-white ring-1 ring-black/10 hover:ring-black/20 h-10 px-3.5 text-[13px] font-bold text-ink-900 transition-shadow duration-300">${ico(I.copy, 14, 2)}<span data-copy-label>${COPY.copy[0]}</span></button>
</div>`;

/* ═══════════════ 1 · THE PAGE'S NAME AND THE FEATURED OFFER ═══════════════ */
/* The coupon: two white sheets whose facing corners are rounded, so the edge pinches in
   at the tear line — a row from 1024px (what it gives | the code), a column below. One
   shadow is cast by the whole shape. The same construction as the pass of the thank-you
   page. */
const coupon = o => `<article class="rv mt-9 sm:mt-10 lg:mt-12 drop-shadow-[0_24px_40px_rgba(17,24,39,.10)] grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]" aria-labelledby="featured-offer">
  <div class="relative overflow-hidden min-w-0 bg-white px-6 sm:px-9 lg:px-12 py-8 sm:py-10 lg:py-12 rounded-t-[28px] rounded-b-[16px] lg:rounded-l-[32px] lg:rounded-r-[16px]">
    <span class="hidden md:block absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 text-[13rem] lg:text-[16rem] font-extrabold leading-none tracking-tightest text-teal-50 select-none" aria-hidden="true">%</span>
    <div class="relative flex flex-wrap items-center gap-x-4 gap-y-2 min-h-[26px]">
      ${kind(o)}
      ${until(o)}
    </div>
    <h2 id="featured-offer" class="relative mt-4 lg:mt-5 font-extrabold tracking-tightest leading-[0.95] text-ink-900">
      <span class="block text-[clamp(3.4rem,9vw,7rem)]">${o.lead} <span class="text-orange-500">${o.value}</span></span>
      <span class="block mt-3 lg:mt-4 text-[clamp(1.25rem,2.4vw,1.9rem)] leading-[1.2] tracking-tight text-ink-700 font-bold max-w-[22ch]">${o.text}</span>
    </h2>
  </div>
  <div class="relative min-w-0 bg-white px-6 sm:px-9 lg:px-10 py-8 sm:py-10 lg:py-12 rounded-t-[16px] rounded-b-[28px] lg:rounded-l-[16px] lg:rounded-r-[32px] flex flex-col justify-center">
    <span class="absolute top-0 left-5 right-5 lg:top-5 lg:bottom-5 lg:left-0 lg:right-auto border-t-2 lg:border-t-0 lg:border-l-2 border-dashed border-ink-200" aria-hidden="true"></span>
    <p class="${LABEL} text-ink-500 mb-3">${COPY.code}</p>
${indent(code(o), '    ')}
    <div class="mt-6">
${indent(action.button({ label: o.cta[0], href: o.cta[1] }), '      ')}
    </div>
  </div>
</article>`;

const head = featured => `  <!-- ================= DISCOUNTS · THE PAGE'S NAME AND THE FEATURED OFFER =================
       The live page's head, and its offer as a coupon: what it gives in large type; on
       the stub the code, a Copy button and the button that applies it. Under it the live
       page's reminder that the checker needs an account. -->
  <section id="discounts" data-component="discounts-head" class="relative pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    <div class="dot-field absolute inset-0" aria-hidden="true"></div>
    <div class="orb orb-hero-teal"></div>
    <div class="orb orb-hero-coral"></div>
    <div class="${WRAP}">
      <nav class="rv flex flex-wrap items-center gap-2 text-[12.5px] font-medium text-ink-500 mb-4 sm:mb-5" aria-label="Breadcrumb">
${LIVE.crumbs.map(([l, h]) => `        <a href="${h}" class="hover:text-ink-700 transition-colors duration-300">${l}</a>
        <span class="text-ink-500" aria-hidden="true">/</span>`).join('\n')}
        <span class="text-ink-700" aria-current="page">${LIVE.crumb}</span>
      </nav>
      <h1 class="rv text-[clamp(2.1rem,4.4vw,3.6rem)] font-extrabold tracking-tightest leading-[1.05]">${LIVE.h1}</h1>
      <p class="rv mt-4 lg:mt-5 text-[15.5px] sm:text-[16.5px] lg:text-[18px] leading-relaxed text-ink-600 max-w-[52ch]">${LIVE.lead}</p>
${featured ? '\n' + indent(coupon(featured), '      ') + '\n' : ''}
      <p class="rv mt-7 sm:mt-8 text-[13.5px] sm:text-[14px] leading-relaxed text-ink-600">${LIVE.register.text}. ${LIVE.register.links.map(([l, h]) => `<a href="${h}" class="${TEXT_LINK}">${l}</a>`).join(' <span class="text-ink-400" aria-hidden="true">·</span> ')}</p>
    </div>
  </section>`;

/* ═══════════════ 2 · EVERY OTHER OFFER ═══════════════ */
/* the grounds a banner stands on, taken in turn: the ground and its hairline, the disc in
   its corner, the colour of the figure, the colour of the kind */
const TONES = [
  { ground: 'bg-teal-50 ring-teal-200/80', disc: 'bg-teal-100', value: 'text-teal-700', kind: 'text-teal-800' },
  { ground: 'bg-orange-50 ring-orange-200/80', disc: 'bg-orange-100', value: 'text-orange-600', kind: 'text-orange-800' },
  { ground: 'bg-mint-50 ring-mint-200', disc: 'bg-mint-100', value: 'text-mint-700', kind: 'text-mint-700' },
];
/* a banner: its kind (and its end date, if it has one); what it gives — the words before
   the figure, the figure large, the words after, all one heading; a line; a code if it
   has one; and a button where it leads */
const banner = (o, i) => {
  const t = TONES[i % TONES.length];
  return `        <li class="min-w-0">
          <article class="relative overflow-hidden flex flex-col h-full rounded-3xl lg:rounded-[28px] ring-1 ${t.ground} p-6 sm:p-8 lg:p-9">
            <span class="absolute -right-14 -top-14 w-48 h-48 rounded-full ${t.disc}" aria-hidden="true"></span>
            <div class="relative flex flex-wrap items-center gap-x-3 gap-y-2 min-h-[26px]">
              ${kind(o, t.kind)}
              ${until(o, 'bg-white text-ink-800 ring-1 ring-black/5')}
            </div>
            <h3 class="relative mt-6 lg:mt-7 font-extrabold text-ink-900">
              <span class="block text-[15px] sm:text-[16px] font-bold tracking-tight text-ink-700">${o.pre}</span>
              <span class="block mt-1 text-[clamp(3.6rem,6vw,5rem)] leading-[0.95] tracking-tightest ${t.value}">${o.value}</span>
              <span class="block mt-3 text-[19px] sm:text-[20px] lg:text-[22px] leading-[1.2] tracking-tight">${o.title}</span>
            </h3>
            <p class="relative mt-3 mb-6 text-[14.5px] sm:text-[15px] leading-relaxed text-ink-700">${o.text}</p>
${o.code ? indent(code(o, 'border-ink-300 bg-white'), '            ') + '\n' : ''}            <p class="relative mt-auto${o.code ? ' pt-5' : ''}"><a href="${o.cta[1]}" class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-white ring-1 ring-black/10 hover:ring-black/20 shadow-diffuse h-11 pl-5 pr-4 text-[13.5px] font-bold text-ink-900 transition-shadow duration-300">${o.cta[0]}<span class="transition-transform duration-300 group-hover:translate-x-1">${ico(I.arrow, 15, 2)}</span></a></p>
          </article>
        </li>`;
};

const more = offers => `  <!-- ================= DISCOUNTS · EVERY OTHER OFFER =================
       One row of up to three banners from 1024px; below that they stand one under
       another, each the full width. A banner has a ground of its own — teal, coral, mint
       — so the row reads as offers, and the grey panel under it as something else. -->
  <section id="more-offers" data-component="discounts-offers" class="relative pt-14 sm:pt-20 lg:pt-24 bg-white">
    <div class="${WRAP}">
      <h2 class="rv text-[clamp(1.7rem,3vw,2.5rem)] font-extrabold tracking-tightest leading-[1.1]">${COPY.more}</h2>
      <ul class="rv-kids grid lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mt-8 sm:mt-10 lg:mt-12">
${offers.map(banner).join('\n')}
      </ul>
    </div>
  </section>`;

/* ═══════════════ 3 · THE LIVE PAGE'S TWO BLOCKS ═══════════════ */
const half = b => `        <div class="min-w-0 flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4 sm:gap-5 text-center sm:text-left p-6 sm:p-8 lg:p-10">
          <span class="inline-flex w-11 h-11 lg:w-12 lg:h-12 shrink-0 rounded-2xl bg-white ring-1 ring-black/5 shadow-diffuse items-center justify-center text-teal-700">${ico(I[b.icon], 22)}</span>
          <div class="min-w-0">
            <h2 id="foot-${b.id}" class="text-[18px] sm:text-[19px] lg:text-[21px] font-extrabold tracking-tight leading-[1.2] text-ink-900">${b.title}</h2>
            <p class="mt-2 text-[14px] sm:text-[14.5px] lg:text-[15px] leading-relaxed text-ink-600">${b.text}</p>
            <p class="mt-4"><a href="${b.link[1]}" class="action-link">${b.link[0]}</a></p>
          </div>
        </div>`;

const foot = () => `  <!-- ================= DISCOUNTS · SUPPORT AND PRICES =================
       The live page's two closing blocks, word for word, as one panel of two halves —
       side by side from 1024px with a hairline between them, one under the other below. -->
  <section id="support-and-prices" data-component="discounts-foot" class="relative py-12 sm:py-16 lg:py-20 bg-white">
    <div class="${WRAP}">
      <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-ink-50 ring-1 ring-black/5 grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-ink-200/80">
${LIVE.foot.map(half).join('\n')}
      </div>
    </div>
  </section>`;

const FEATURED = OFFERS.filter(o => o.featured);
const OTHERS = OFFERS.filter(o => !o.featured);
if (FEATURED.length > 1) throw new Error('discounts: only one offer can be featured');
if (OTHERS.length > 3) throw new Error('discounts: the row holds three banners at most — ' + OTHERS.length + ' offers are not featured');
OFFERS.forEach(o => {
  const miss = ['kind', 'value', 'text', 'cta'].concat(o.featured ? ['lead'] : ['pre', 'title']).filter(k => !o[k]);
  if (miss.length) throw new Error('discounts: an offer lacks ' + miss.join(', ') + ' — ' + JSON.stringify(o).slice(0, 80));
});

module.exports = { LIVE, OFFERS, COPY, RECURRING_SAVING, YEARLY_SAVING, OUT };
if (require.main !== module) return;

const html = page.render({ title: LIVE.title, meta: LIVE.meta, sections: [head(FEATURED[0]), OTHERS.length ? more(OTHERS) : null, foot()].filter(Boolean) });
fs.writeFileSync(path.join(SITE, OUT), html);
console.log('  site/' + OUT + ' — ' + OFFERS.length + ' offers (' + FEATURED.length + ' featured), ' + html.length + ' bytes');
