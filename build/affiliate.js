/* Generate site/affiliate-program-at-plagiarismsearch.html — the Affiliate Program page.
   It replaces a stub: no -v2, no switcher.

   There is no brief for this page, so the copy is the live page's, verbatim
   (https://plagiarismsearch.com/affiliate-program-at-plagiarismsearch, read 2026-09-30),
   and only the architecture is new: the system's sections in place of the old layout.

   The page has one job — get a partner to sign up — and one real decision: cash
   commission or service credits. So the two programs are the centre of the page, drawn
   as a pair of offer cards with the cash model dark, and everything before them earns
   the click: the facts in the hero, the three tools in the dashboard, three steps, five
   reasons. The FAQ closes the questions, and the closing band carries the live page's
   "Join our authentic community now." with its "Start saving now".

   Two liberties, both architectural, neither in the words:
   - The live page's "Couldn't find the answer…" says "using the form below", and there
     is no form below — only a login modal. The card links to Contact Us, where the form
     is, under that page's own name (its H1, "Contact Us").
   - The live FAQ heading is an h3 under no h2; here it is the section's h2.

   Run:  node build/affiliate.js  →  node build/shell.js  →  node build/check-affiliate.js
   On the shared production assets (build/assets.js, build/page.js): no <style> or
   <script> of its own, hooks are data-*. */
const fs = require('fs');
const path = require('path');
const page = require('./page');
const cta = require('./sections/cta-band');
const faq = require('./sections/faq');   /* the FAQ: one library template */
const { dotField } = require('./dots');

const SITE = path.join(__dirname, '..', 'site');
const OUT = 'affiliate-program-at-plagiarismsearch.html';

const JOIN = 'https://app.plagiarismsearch.com/affiliate';
const FRIENDS = 'https://app.plagiarismsearch.com/friends';

/* ─────────────────────────────────────────────────────────────────────────────
   Copy — the live page's, verbatim. Nothing below this block writes a word of its own.
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  title: 'Earn with PlagiarismSearch Affiliate Program | 30% Commission',
  meta: 'Partner with PlagiarismSearch to monetize your education or writing audience. 30% first-sale commission, 20% lifetime earnings, 90-day cookie.',
  canonical: 'https://plagiarismsearch.com/affiliate-program-at-plagiarismsearch',

  hero: {
    eyebrow: 'Earn with PlagiarismSearch',
    h1: 'Monetize Your Audience with a Trusted Academic Tool',
    p: 'Earn recurring commissions by recommending a high-demand academic tool trusted across universities, research, and online publishing',
    primary: 'Become an Affiliate',
    secondary: 'Learn more',
    facts: [
      ['30% commission', 'on every new client', 'percent'],
      ['Promote a high-trust', 'academic tool', 'award'],
      ['Real-time', 'Performance tracking', 'activity'],
      ['90 days', '90-Day Cookie Window', 'cookie'],
    ],
  },

  tools: [
    ['Affiliate Dashboard', 'Access your personal affiliate link, marketing materials, and performance overview in one place.', 'dashboard'],
    ['Performance Statistics', 'Track clicks, registrations, and earnings with clear, real-time reporting.', 'chart'],
    ['Conversion Tracking', 'See every approved sale and commission directly inside your affiliate panel.', 'target'],
  ],

  how: {
    h2: 'How It Works',
    intro: 'Explore our affiliate program below and kickstart your academic year on the right note!',
    steps: [
      ['Step 1', 'Sign Up', 'Register an account with us to receive an individual affiliate link for directing your traffic.', 'userPlus'],
      ['Step 2', 'Advertise PlagiarismSearch', 'Introduce PlagiarismSearch to your audience by sharing your affiliate link within relevant content.', 'megaphone'],
      ['Step 3', 'Get Paid', 'Earn money swiftly with timely payouts when your referral makes a purchase.', 'banknote'],
    ],
  },

  why: {
    h2: 'Why Join Us?',
    intro: 'Dive into the authentic advantages',
    items: [
      ['User-friendly interface', 'Get the best experience with our easy to use and interactive design', 'smile'],
      ['Guaranteed confidentiality', 'Your data is safe here! It is guaranteed by our terms of use and privacy policy', 'shield'],
      ['Effective algorithms', 'Plagiarism detection has gone far! We offer a great alternative to turnitin', 'cpu',
        ['alternative to turnitin', 'turnitin-checker-alternative.html']],
      ['Reasonable pricing', 'No one wants to pay more, so check out our seasonal discounts and great affiliate program', 'tag'],
      ['Plenty of happy customers', 'The database of satisfied customers is growing every day. Check our Trustpilot.', 'users',
        ['Trustpilot.', 'https://www.trustpilot.com/review/plagiarismsearch.com']],
    ],
  },

  programs: {
    h2: 'Discover Our Affiliate Program',
    intro: 'Unlock rewards through our two affiliate models at PlagiarismSearch.com. Tailor your benefits to your liking—opt for cash commissions or service credits.',
    perks: [
      'User-friendly dashboard to monitor your earnings',
      'High conversion rates',
      'Exceptionally generous 90-days cookie window',
      'Professional affiliate support',
    ],
    cash: {
      name: 'Elevated Cash Commission', figure: '30%', sub: '+20% Lifetime Commission',
      terms: [
        ['30% of Initial Commission', 'Earn 30% commission on the first purchase of every referred client.'],
        ['20% Lifetime Commission', 'Continue to earn 20% on all subsequent purchases made by your referrals.'],
      ],
      cta: 'Join & Earn', href: JOIN,
    },
    credits: {
      name: 'Service Credits Earnings', figure: '20%', sub: 'Referral Discount',
      terms: [
        ['Earn Matching Service Credits', 'Receive service credits equal to the amount your referrals spend.'],
        ['20% discount for Your Referrals', 'Your affiliates enjoy a 20% discount on their purchases, enhancing the attractiveness of an offer.'],
      ],
      cta: 'Get Credits', href: FRIENDS,
    },
  },

  faq: {
    h2: 'Frequently Asked Questions',
    intro: 'Get quick and helpful information addressing common queries and concerns about our affiliate program.',
    items: [
      ['Who can become a PlagiarismSearch affiliate?', 'Each registered PlagiarismSearch user is welcome to become our affiliate. Over time, individuals such as digital marketers, content creators, bloggers, marketing agencies, and influencers have been successful as PlagiarismSearch.com affiliates. If you are none of the above, you may also join our affiliate program by referring your friends to our service.'],
      ['What is the minimum payout for cash commissions?', 'You may request your earnings to be transferred to your payment account as soon as you have 50$ or more on your balance.'],
      ['Is there a payment for becoming a PlagiarismSearch.com affiliate?', 'No. Our affiliate program is free of charge.'],
      ['Is it necessary to purchase PlagiarismSearch products prior to becoming an affiliate?', 'No. To join our affiliate program, you need to register yourself with our platform, but it is not necessary to make a purchase of the service.'],
      ['Is there a limit of the referrals I may bring to PlagiarismSearch.com?', 'No, there is no limit of the referrals. We encourage you to spread awareness about our services to as many people as possible.'],
      ['Where can I view my earnings and credits?', 'When you are logged in to your account, go to My Profile on the top right corner and choose Invite Friends from the menu. Scroll down the page to see your individual affiliate link and your earnings/credits.'],
    ],
    contact: {
      h3: 'Couldn\'t find the answer to your question?',
      p1: 'We would like to hear from you! PlagiarismSearch team is here to respond to all your inquiries.',
      p2: 'Send us your questions, suggestions, and comments using the form below and we will get back to you as soon as possible.',
      cta: 'Contact Us', href: 'contact-us.html', /* the contact page's own H1: the page that has the form */
    },
  },

  close: {
    lead: 'And dive into the distinct advantages of the professional software.',
    h2: 'Join our authentic community now.',
    cta: 'Start saving now',
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the system's (build/business.js is the reference page).
   ───────────────────────────────────────────────────────────────────────────── */
const esc = s => s.replace(/&(?!amp;)/g, '&amp;');
const eyebrow = (dot, label, ground = 'white') => `        <div class="inline-flex items-center gap-2 rounded-full ${ground === 'white' ? 'bg-white' : 'bg-ink-50'} ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">${label}</span>
        </div>`;

const H2 = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const INTRO = 'mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600';
const BODY = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const CAP = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const H3 = 'text-[16px] sm:text-[17px] lg:text-[18px] font-bold tracking-tight';
const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ext = h => (/^https?:/.test(h) ? ' rel="noopener"' : '');

const btnDark = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
          </a>`;
const btnLight = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-ink-100 ring-1 ring-black/10 transition-colors duration-300 text-ink-900 text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-ink-900/10 items-center justify-center">${arrow}</span>
          </a>`;
const inline = (label, href) => `<a href="${href}"${ext(href)} class="font-semibold text-ink-800 underline decoration-ink-300 underline-offset-4 hover:text-ink-900 transition-colors duration-300">${label}</a>`;

const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/></svg>`;
  if (!text.includes(phrase)) throw new Error('penMark: "' + phrase + '" not in "' + text + '"');
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};

/* Lucide icons (the system's set) */
const ico = (paths, stroke, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const TINT = { teal: ['bg-teal-100', '#06748A'], ink: ['bg-ink-100', '#374151'], orange: ['bg-orange-100', '#B84431'], mint: ['bg-mint-100', '#1B7A50'] };
const chip = (tint, paths) => `<span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl ${TINT[tint][0]} items-center justify-center shrink-0">${ico(paths, TINT[tint][1])}</span>`;
const I = {
  percent:   '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  award:     '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
  activity:  '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  cookie:    '<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/>',
  dashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  chart:     '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  target:    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  userPlus:  '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  banknote:  '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  smile:     '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
  shield:    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  cpu:       '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
  tag:       '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
  users:     '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  gift:      '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  check:     '<path d="M20 6 9 17l-5-5"/>',
  help:      '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
};

/* ═══════════════ 01 · HERO ═══════════════ */
const section1 = () => `  <!-- ================= 01 · HERO / AFFILIATE PROGRAM =================
       The live page's four hero facts become the visual: one double-bezel sheet, four
       cells, each fact in its own words. No dashboard is drawn — the page has no
       screenshot of it we could show honestly. -->
  <section id="affiliate-program" data-component="hero-facts" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    ${dotField()}
    <div class="orb absolute orb-hero-teal"></div>
    <div class="orb absolute orb-hero-coral"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">

        <div class="rv min-w-0">
${eyebrow('teal-400', COPY.hero.eyebrow)}
          <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 sm:mb-5 lg:mb-6">${penMark(COPY.hero.h1, 'Your Audience')}</h1>
          <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[60ch] mb-7 lg:mb-8">${COPY.hero.p}</p>
          <div class="flex flex-wrap items-center gap-3 sm:gap-4">
            ${btnDark(COPY.hero.primary, JOIN)}
            <a href="#how-it-works" class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-600 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.hero.secondary}</a>
          </div>
        </div>

        <div class="rv min-w-0">
          <div class="rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
            <ul class="grid md:grid-cols-2 divide-y md:divide-y-0 divide-ink-100 rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl overflow-hidden" role="list">
${COPY.hero.facts.map(([lead, rest, icon], i) => `              <li class="${i === 0 ? 'bg-ink-950 text-white ' : ''}p-5 sm:p-6 lg:p-7"${i === 0 ? ' data-surface="dark"' : ''}>
                ${i === 0
    ? `<span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-white/10 ring-1 ring-white/15 items-center justify-center">${ico(I[icon], '#fff')}</span>`
    : chip(['teal', 'teal', 'mint', 'orange'][i], I[icon])}
                <p class="mt-5 sm:mt-6 text-[clamp(1.35rem,2.2vw,1.75rem)] font-extrabold tracking-tightest leading-[1.1] nums">${lead.replace(/(\S+-\S+)/, '<span class="whitespace-nowrap">$1</span>')}</p>
                <p class="mt-1.5 ${BODY} ${i === 0 ? 'text-white/60' : 'text-ink-600'}">${rest}</p>
              </li>`).join('\n')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · THE THREE TOOLS ═══════════════ */
const section2 = () => `  <!-- ================= 02 · AFFILIATE TOOLS =================
       The live page's three tools, one sheet with rules between them — they are three
       views of the same panel, so they share a surface rather than float as cards. -->
  <section id="affiliate-tools" data-component="tool-cells" aria-label="${COPY.tools.map(t => t[0]).join(', ')}" class="relative py-12 sm:py-16 lg:py-20 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv rounded-3xl sm:rounded-4xl bg-ink-50 overflow-hidden">
        <div class="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink-200/70">
${COPY.tools.map(([head, body, icon], i) => `          <div class="p-6 sm:p-7 lg:p-8">
            <span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-white ring-1 ring-black/5 items-center justify-center">${ico(I[icon], ['#06748A', '#374151', '#B84431'][i])}</span>
            <h3 class="${H3} mt-5 mb-1.5">${head}</h3>
            <p class="${BODY} text-ink-600">${body}</p>
          </div>`).join('\n')}
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · HOW IT WORKS ═══════════════ */
const section3 = () => `  <!-- ================= 03 · HOW IT WORKS =================
       Three steps as the system's editorial list: number, name, what happens. The hero's
       "Learn more" lands here, so the id is the live page's fragment. -->
  <section id="how-it-works" data-component="workflow-list" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
        <h2 class="${H2}">${COPY.how.h2}</h2>
        <p class="${INTRO}">${COPY.how.intro}</p>
      </div>

      <div class="rv rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
        <ol class="rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl divide-y divide-ink-100" role="list">
${COPY.how.steps.map(([step, head, body, icon], i) => `          <li class="grid lg:grid-cols-[5rem_1fr_1.35fr] gap-3 lg:gap-8 items-start px-5 py-6 sm:px-7 sm:py-7 lg:px-9 lg:py-8">
            <span class="text-[clamp(1.6rem,2.8vw,2.4rem)] font-extrabold tracking-tightest leading-none text-ink-200 nums" aria-hidden="true">0${i + 1}</span>
            <div class="min-w-0 flex items-center gap-3.5">
              ${chip(['teal', 'orange', 'mint'][i], I[icon])}
              <div class="min-w-0">
                <p class="${CAP} text-ink-500 mb-1">${step}</p>
                <h3 class="text-[19px] sm:text-[21px] lg:text-[22px] font-bold tracking-tight">${head}</h3>
              </div>
            </div>
            <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${body}</p>
          </li>`).join('\n')}
        </ol>
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · THE TWO PROGRAMS ═══════════════ */
const offer = (o, dark) => {
  const muted = dark ? 'text-white/60' : 'text-ink-600';
  const rule = dark ? 'border-white/10' : 'border-ink-100';
  return `        <article class="rv flex flex-col rounded-3xl sm:rounded-4xl lg:rounded-5xl ${dark ? 'bg-ink-950 text-white' : 'bg-white ring-1 ring-black/5'} shadow-diffuse p-6 sm:p-8 lg:p-10"${dark ? ' data-surface="dark"' : ''}>
          <div class="flex items-center gap-3 mb-6 lg:mb-7">
            ${dark
    ? `<span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-white/10 ring-1 ring-white/15 items-center justify-center shrink-0">${ico(I.banknote, '#fff')}</span>`
    : chip('teal', I.gift)}
            <h3 class="text-[17px] sm:text-[18px] lg:text-[19px] font-bold tracking-tight">${o.name}</h3>
          </div>
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span class="text-[clamp(3rem,6vw,4.5rem)] font-extrabold tracking-tightest leading-none nums">${o.figure}</span>
            <span class="text-[14.5px] sm:text-[15.5px] font-semibold ${dark ? 'text-orange-300' : 'text-teal-700'}">${o.sub}</span>
          </div>

          <dl class="mt-7 lg:mt-8 grid gap-4 sm:gap-5">
${o.terms.map(([t, d]) => `            <div class="border-t ${rule} pt-4 sm:pt-5">
              <dt class="text-[14.5px] sm:text-[15px] font-bold tracking-tight mb-1">${t}</dt>
              <dd class="${BODY} ${muted}">${d}</dd>
            </div>`).join('\n')}
          </dl>

          <ul class="flex-1 mt-6 lg:mt-7 pt-5 sm:pt-6 border-t ${rule} grid gap-2.5 content-start" role="list">
${COPY.programs.perks.map(p => `            <li class="flex items-start gap-2.5 ${BODY} ${dark ? 'text-white/80' : 'text-ink-700'}"><span class="mt-[3px] shrink-0 w-5 h-5 rounded-full ${dark ? 'bg-white/10' : 'bg-teal-50'} flex items-center justify-center">${ico(I.check, dark ? '#7FE0EE' : '#06748A', 12)}</span>${p}</li>`).join('\n')}
          </ul>

          <div class="mt-8 lg:mt-9">
            ${dark ? btnLight(esc(o.cta), o.href) : btnDark(esc(o.cta), o.href)}
          </div>
        </article>`;
};

const section4 = () => `  <!-- ================= 04 · THE TWO PROGRAMS =================
       The page's one decision, so its centre: two offer cards side by side, the cash
       model dark. Each card carries its figure, its two terms, the four shared perks and
       its own action. -->
  <section id="affiliate-models" data-component="offer-pair" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
        <h2 class="${H2}">${COPY.programs.h2}</h2>
        <p class="${INTRO}">${COPY.programs.intro}</p>
      </div>

      <div class="grid md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-stretch">
${offer(COPY.programs.cash, true)}
${offer(COPY.programs.credits, false)}
      </div>
    </div>
  </section>`;

/* ═══════════════ 05 · WHY JOIN US ═══════════════ */
const section5 = () => `  <!-- ================= 05 · WHY JOIN US =================
       Five reasons on one tinted sheet: heading block in the first cell, the five
       reasons in the rest, so the grid is a clean three by two. The two live links stay
       on the phrases that carry them. -->
  <section id="why-join-us" data-component="reason-grid" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div class="sm:col-span-2 lg:col-span-1 flex flex-col justify-center p-1 sm:p-2 lg:pr-6">
          <h2 class="${H2}">${COPY.why.h2}</h2>
          <p class="${INTRO}">${COPY.why.intro}</p>
        </div>
${COPY.why.items.map(([head, body, icon, link], i) => {
  const text = link ? body.replace(link[0], inline(link[0], link[1])) : body;
  if (link && text === body) throw new Error('why: link phrase not found: ' + link[0]);
  return `        <div class="rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-6 sm:p-7">
          ${chip(['teal', 'ink', 'teal', 'orange', 'mint'][i], I[icon])}
          <h3 class="${H3} mt-5 mb-1.5">${head}</h3>
          <p class="${BODY} text-ink-600">${text}</p>
        </div>`;
}).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · FAQ ═══════════════ */
const section6 = () => `  <!-- ================= 06 · FAQ =================
       The library FAQ (build/sections/faq.js): six questions, full answers in the HTML.
       The live page's "Couldn't find the answer…" sits under the heading as the aside
       slot, linked to the form. -->
${faq.section({
  id: 'affiliate-faq', ns: 'affiliate-faq', bg: 'white', space: 'lg', layout: 'fluid',
  head: { title: COPY.faq.h2, intro: COPY.faq.intro },
  aside: `<div data-slot="aside" class="mt-8 lg:mt-10 rounded-3xl bg-ink-50 p-5 sm:p-6 lg:p-7">
  ${chip('teal', I.help)}
  <h3 class="${H3} mt-4 mb-1.5">${COPY.faq.contact.h3}</h3>
  <p class="${BODY} text-ink-600">${COPY.faq.contact.p1}</p>
  <p class="mt-2 ${BODY} text-ink-600 mb-5">${COPY.faq.contact.p2}</p>
  ${btnLight(COPY.faq.contact.cta, COPY.faq.contact.href)}
</div>`,
  items: COPY.faq.items.map(([q, a]) => ({ q, a })),
})}`;

/* ═══════════════ 07 · CLOSING BAND ═══════════════ */
const section7 = () => `  <!-- ================= 07 · CLOSING CTA =================
       The closing band (build/sections/cta-band.js) with the live page's own closing lines: the lead
       above, the heading with its ring on "community", "Start saving now" to sign-up. -->
${cta.section({
  id: 'affiliate-cta',
  kicker: COPY.close.lead,
  title: COPY.close.h2, ring: 'community',
  actions: { button: { label: COPY.close.cta, href: JOIN } },
})}`;

/* ─────────────────────────────────────────────────────────────────────────────
   Assemble — the shared page shell (build/page.js).
   ───────────────────────────────────────────────────────────────────────────── */
/* check-affiliate.js reads COPY; requiring this file must not rewrite the page (the
   page on disk carries the header and footer shell.js filled in) */
/* affiliate-v2.js (the illustrated version) reuses the sections that do not change */
module.exports = { COPY, section4, section6, section7 };
if (require.main !== module) return;

const sections = [section1, section2, section3, section4, section5, section6, section7];
const html = page.render({ title: esc(COPY.title), meta: COPY.meta, canonical: COPY.canonical, sections: sections.map(f => f()) });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' +
            count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' + count(/class="faq-item/g) + ' faq items');
