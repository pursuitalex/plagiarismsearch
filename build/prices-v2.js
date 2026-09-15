/* Generate site/prices-v2.html — the DEC-0042 Pricing page.

   Same shape as the other page generators: approved copy in COPY, verbatim, diffable
   against the brief line by line.

   The thing that makes this page different is that its most important element is not
   page content at all. DEC-0042 is explicit: the plan cards are a visual shell for the
   authoritative production pricing widget, and plan names, prices, quotas, billing
   periods, validity, entitlements, checkout actions and the Recommended state are all
   backend-driven. None of it may be frozen into copy. So the shell here renders from
   build/pricing-data.js — placeholder figures shared with the homepage so the two pages
   cannot drift — and check-prices.js separately asserts that no plan figure has leaked
   out of the widget into body copy elsewhere.

   The old prices.html stays where it is. Its H1 and its second heading are both on this
   brief's reject list by name, so this is a new file beside it: the index-v2 precedent,
   and the same reason — nothing is retired until Olex accepts the replacement.

   TARGETED CORRECTIONS v2, 2026-09-04. A surgical batch on top of DEC-0042, applied
   here and nowhere else: the AI packages became selectable with one continuation
   action; bare "Storage" became "report storage" in plan-entitlement copy (the widget's
   own label, see pricing-data.js); the six capability cards became three content
   groups; Custom & High Volume moved ahead of Optional Services and lost the word VIP.
   Everything the batch does not name is preserved as DEC-0042 built it.

   Run:  node build/prices-v2.js  →  node build/shell.js  →  node build/check-prices.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'prices-v2.html';
const cta = require('./cta');
const { dots } = require('./dots');
const banner = require('./banner');
const { PLANS, LABEL } = require('./pricing-data');   /* TAGLINE is the homepage's; DEC-0042 grants no plan subtitle */

const HELP = 'https://plagiarismsearch.com/faq-and-support';   /* live production, no page here */

/* ─────────────────────────────────────────────────────────────────────────────
   APPROVED COPY — DEC-0042, 2026-08-24. Verbatim.

   Destinations: the brief names production routes; the prototype keeps flat filenames
   and URLS.md holds the mapping. / → index.html, /ai-content-detector → ai-detector.html,
   /rate-my-paper → paper-analysis.html, /spell-checker → spell-check.html,
   /readability-checker → readability-check.html, /vip-plagiarism-checker → vip.html,
   /contact-us → contact-us.html. /faq-and-support has no page here and is a live
   production URL, so it is linked absolutely.
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  title: 'Plagiarism Checker Pricing &amp; Plans | PlagiarismSearch',
  meta: 'Compare PlagiarismSearch pricing for plagiarism checking, AI detection, and optional services. View one-time, monthly, 3-month, yearly, and high-volume options.',
  canonical: 'https://plagiarismsearch.com/prices',

  s1: {
    eyebrow: 'PRICING',
    h1: 'Plagiarism Checker Pricing &amp; Plans',
    support: 'Compare one-time, monthly, 3-month, and yearly options and choose the plan that fits how much content you expect to check. The pricing cards show the current price, checking allowance, billing period, and included features for each plan.',
    /* fixed by the brief, in this order */
    tabs: [['onetime', 'One-time'], ['monthly', 'Monthly'], ['quarterly', '3-Months'], ['yearly', 'Yearly']],
    recommended: 'Recommended',
    /* the ONLY helper line approved for this page. The homepage's per-period notes are
       deliberately not rendered here: "Do not add a static subtitle such as Recurring
       billing · cancel anytime unless that exact helper is already returned by the
       authoritative pricing widget." */
    onetimeHelper: 'Pay once. Your purchased quota does not expire.',
  },

  s2: {
    eyebrow: 'PLAGIARISM CHECKING',
    h2: 'A plagiarism check you can inspect, not just a score',
    /* Corrections v2 §6 — verbatim. "report storage" is the widget's own entitlement
       label; bare Storage collides with Organization Storage elsewhere on the site. */
    intro: 'PlagiarismSearch shows where matches appear and which sources they come from, so you can review the result instead of relying on a single percentage. Core checking supports web and academic source comparison, text or document input, scan controls, and downloadable PDF reports. The pricing widget above shows which plans add plan-specific features such as API access, report storage, or an AI allowance.',
    /* Three content groups, not six equal cards — §6. h3, body, proof (only the first
       has one), Lucide path, tint. The layout is the section's, not the brief's. */
    groups: [
      ['Compare with web and academic sources',
       'Compare submitted content with sources available on the web and more than 500 million indexed academic texts.',
       ['500M+', 'indexed academic texts'],
       '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>', 'teal'],
      ['Inspect matches source by source',
       'Review where matching or similar text appears and open the corresponding source to understand the result in context.',
       null,
       '<path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.944.033z"/>', 'orange'],
      ['Check text or documents your way',
       'Paste text or upload a supported document, exclude references and in-text citations when appropriate, and download or print a PDF report when you need an offline copy.',
       null,
       '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>', 'ink'],
    ],
  },

  s3: {
    eyebrow: 'AI CHECKING',
    h2: 'Add AI checking when you need it',
    intro: 'AI detection uses a separate AI word balance. Choose a one-time or recurring AI package based on the amount of text you expect to analyze.',
    clarification: 'AI detection and plagiarism checking are separate analyses. If a plagiarism plan includes an AI allowance, the main pricing widget shows it as part of that plan.',
    /* DYNAMIC — "the approved current baseline/prototype snapshot, not a permission to
       create a second manual billing source" */
    packages: [
      ['10,000', 'One-time', '$4.95'],
      ['50,000', 'One-time', '$9.95'],
      ['100,000', 'Monthly', '$12.95'],
      ['300,000', 'Monthly', '$25.95'],
      ['500,000', 'Monthly', '$35.95'],
      ['1,000,000', 'Yearly', '$55.95'],
      ['3,000,000', 'Yearly', '$125.95'],
      ['5,000,000', 'Yearly', '$215.95'],
    ],
    tableHeads: ['AI words', 'Billing', 'Current price'],
    /* Corrections v2 §4 — the read-only table was a conversion dead end. Exactly one
       package is selected at a time, 10,000 by default, and the one continuation
       action names the selected allowance. Where the checkout route lands is not
       known here, so the button carries a data hook for the developer and no href. */
    selectHelper: 'Select an AI word package, then continue with the option you want to purchase.',
    continueLabel: ['Continue with ', ' AI words'],
    defaultPackage: '10,000',
    cta: 'Learn about AI detection',
    ctaHref: 'ai-detector.html',
    customNote: 'Need an AI word allowance beyond the standard packages?',
    customCta: 'Contact us',
    customHref: 'contact-us.html',
  },

  s4: {
    eyebrow: 'OPTIONAL SERVICES',
    h2: 'Other writing services',
    intro: 'These optional services are available separately when you need help beyond plagiarism or AI checking.',
    /* head, body, price, CTA, href — DEC-0042 verbatim — then the icon and tint the
       first version (site/prices.html, "Additional services") gave each service. */
    items: [
      ['Paper Analysis', 'Human editor review of grammar, style, and punctuation.', 'From $3.50', 'View Paper Analysis', 'paper-analysis.html',
       '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>', 'orange'],
      ['Spell Check', 'Check spelling, grammar, and punctuation online.', 'Free', 'Use Spell Check', 'spell-check.html',
       '<path d="m6 16 6-12 6 12"/><path d="M8 12h8"/><path d="m16 20 2 2 4-4"/>', 'mint'],
      ['Readability Check', 'Get a readability score and recommendations for making your text easier to read.', 'From $0.99', 'Check Readability', 'readability-check.html',
       '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>', 'teal'],
    ],
  },

  s5: {
    eyebrow: 'CUSTOM &amp; HIGH VOLUME',
    h2: 'Need a custom or high-volume option?',
    /* Corrections v2 §8 — the destination stays /vip; the words stop asking the
       reader to know what VIP means. No benefits invented. */
    body: 'If the standard pricing options do not fit your checking volume or requirements, explore the available custom and high-volume options.',
    cta: 'Explore high-volume options',
    ctaHref: 'vip.html',
  },

  s6: {
    h2: 'Pricing FAQ',
    items: [
      ['How do I choose the right PlagiarismSearch plan?', 'Start with how much content you expect to check and which additional features you need. Use the One-time, Monthly, 3-Months, and Yearly tabs to compare the current price, checking allowance, billing period, and included features for each plan.'],
      ['Do one-time packages expire?', 'No. A purchased one-time quota does not expire, so you can use it when you need it rather than within a fixed billing period.'],
      ['Is AI checking included with every plagiarism plan?', 'Not necessarily. AI allowance is plan-specific. If AI checking is included with a plan, the current pricing widget shows the available AI allowance in that plan’s features. Separate AI word packages are also available on this page.'],
      ['Do all plans include API access and report storage?', 'No. API access and report storage are plan-specific features. Check the current pricing widget to see which options are included with the plan you are considering.'],
      ['Can I buy AI checking separately?', 'Yes. Separate AI word packages are available for users who need additional AI checking volume. AI checks use an AI word balance that is separate from plagiarism checking.'],
      ['Can I try PlagiarismSearch before I buy a plan?', 'Yes. You can run a plagiarism check of up to 150 words without creating an account. New accounts also receive a one-time 1,000-word credit that can be used for plagiarism or AI checking.'],
      ['What if the standard plans do not fit my volume?', 'Explore the VIP options if you need a higher-volume or custom arrangement beyond the standard pricing choices.'],
    ],
    /* the CTA that lives inside answer 7 */
    inAnswerCta: 'View VIP options',
    inAnswerHref: 'vip.html',
    footer: 'Need help with an existing plan or account?',
    cta: 'Visit the Help Center',
    ctaHref: HELP,
  },

  s7: {
    h2: 'Try plagiarism checking before you choose a plan',
    support: 'Check up to 150 words without creating an account. See how the plagiarism checker works first, then return when you are ready to choose a plan.',
    cta: 'Try a free plagiarism check',
    ctaHref: 'index.html',
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the site's.
   ───────────────────────────────────────────────────────────────────────────── */
const eyebrow = (dot, label, ground = 'white') => `        <div class="inline-flex items-center gap-2 rounded-full ${ground === 'white' ? 'bg-white' : 'bg-ink-50'} ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">${label}</span>
        </div>`;

const eyebrowDark = (dot, label) => `        <div class="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/80">${label}</span>
        </div>`;

const h2 = t => `<h2 class="text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]">${t}</h2>`;

const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ext = h => (/^https?:/.test(h) ? ' rel="noopener"' : '');

const btnDark = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
          </a>`;

const btnLight = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-ink-100 transition-colors duration-300 text-ink-900 text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-ink-900/10 items-center justify-center">${arrow}</span>
          </a>`;

const linkQuiet = (label, href, dark) => `<a href="${href}"${ext(href)} class="inline-flex items-center gap-2 text-[13px] sm:text-[13.5px] font-semibold ${dark ? 'text-white/70 hover:text-white decoration-white/30' : 'text-ink-500 hover:text-ink-900 decoration-ink-300'} underline underline-offset-4 transition-colors duration-300">${label}</a>`;

/* pen mark — DESIGN.md § Motion. One per heading. */
const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round" opacity="0"/></svg>`;
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};

/* ═══════════════ 01 · HERO + THE SHARED PRICING WIDGET ═══════════════ */
const section1 = () => `  <!-- ================= 01 · PRICING HERO + MAIN WIDGET =================
       "The plagiarism plan cards are not authored as static page content." Everything
       below the tabs is a shell: the figures come from build/pricing-data.js, which is
       placeholder data shared with the homepage so the two cannot drift, and a developer
       replaces the whole thing with the authoritative production widget before launch.

       Only ONE helper line is approved for this page — the one-time note. The homepage's
       per-period notes are deliberately not rendered: the brief forbids inventing
       billing or cancellation wording in the design layer. -->
  <section id="plans" class="relative pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-16 lg:pb-20 bg-[#F2FCFC] overflow-hidden">
    ${dots('heroDots')}
    <div class="orb absolute" style="width:860px;height:800px;left:-16%;top:-400px;background:rgba(44,195,219,.22)"></div>
    <div class="orb absolute" style="width:700px;height:680px;right:-14%;top:-200px;background:rgba(243,111,90,.13)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv text-center max-w-[760px] mx-auto mb-8 sm:mb-10 lg:mb-12">
${eyebrow('teal-400', COPY.s1.eyebrow)}
        <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 sm:mb-5 lg:mb-6">${penMark(COPY.s1.h1, 'Pricing')}</h1>
        <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600">${COPY.s1.support}</p>
      </div>

      <div class="rv flex justify-center mb-8 sm:mb-10 lg:mb-12">
        <div class="inline-flex items-center rounded-full bg-ink-100 p-1 max-w-full overflow-x-auto" id="periodTabs">
${COPY.s1.tabs.map(([k, label]) => `          <button type="button" data-period="${k}" aria-pressed="false" class="period-btn whitespace-nowrap rounded-full px-3.5 sm:px-5 lg:px-6 py-2.5 text-[13px] sm:text-[13.5px] font-semibold text-ink-600">${label}</button>`).join('\n')}
        </div>
      </div>

      <div class="rv grid lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-center max-w-[1180px] mx-auto">
${['light', 'standard', 'premium'].map(tier => {
  const dark = tier === 'standard';
  return `        <div data-tier="${tier}" class="${dark
    ? 'relative rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-ink-950 text-white ring-1 ring-white/10 shadow-diffuse-lg p-5 sm:p-6 lg:p-8 lg:-my-6 overflow-hidden'
    : 'rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7'}">
${dark ? '          <div class="orb w-[300px] h-[300px] bg-orange-500/15 -right-20 -top-24"></div>' : ''}
          <div class="relative">
            <div class="flex items-center justify-between gap-3 mb-1.5">
              <span class="text-[11px] font-bold tracking-[0.16em] uppercase ${dark ? 'text-teal-300' : 'text-orange-700'}">${LABEL[tier]}</span>
${dark ? `              <span class="text-[9.5px] font-bold tracking-widest bg-orange-700 text-white rounded-full px-2.5 py-1 uppercase">${COPY.s1.recommended}</span>` : ''}
            </div>
            <div class="flex items-end gap-1.5 mb-3">
              <span class="text-[29px] sm:text-[34px] lg:text-[40px] font-extrabold tracking-tightest leading-none tabular-nums js-price"></span>
              <span class="text-[12.5px] font-medium ${dark ? 'text-white/50' : 'text-ink-500'} pb-1.5 js-term"></span>
            </div>
            <div class="inline-flex items-center rounded-full ${dark ? 'bg-white/10 text-white/70' : 'bg-ink-50 text-ink-600'} px-3 py-1 text-[11.5px] font-bold tabular-nums mb-5 sm:mb-6 lg:mb-7"><span class="js-rate"></span>&nbsp;/ 1,000 words</div>
            <div class="h-px ${dark ? 'bg-white/10' : 'bg-ink-100'} mb-5 sm:mb-6 lg:mb-7"></div>
            <ul class="space-y-3.5 text-[13.5px] font-medium ${dark ? 'text-white/80' : 'text-ink-700'} min-h-[9rem] mb-6 sm:mb-7 lg:mb-8 js-feats"></ul>
            <a href="index.html" class="btn-press block text-center rounded-full ${dark
              ? 'bg-white text-ink-900 hover:bg-ink-50'
              : 'ring-1 ring-ink-200 text-ink-900 hover:bg-ink-50'} text-[13.5px] sm:text-[14.5px] font-semibold py-3 sm:py-3.5 transition-colors duration-300">Start ${LABEL[tier]}</a>
          </div>
        </div>`;
}).join('\n')}
      </div>

      <!-- the one approved helper, shown only on the one-time tab -->
      <p id="onetimeHelper" hidden class="rv mt-6 lg:mt-7 text-center text-[13px] sm:text-[13.5px] font-semibold text-ink-600">${COPY.s1.onetimeHelper}</p>
    </div>
  </section>`;

/* ═══════════════ 02 · CORE PRODUCT VALUE ═══════════════ */
const section2 = () => `  <!-- ================= 02 · CORE PRODUCT VALUE =================
       Three content groups (Corrections v2 §6), not six equal cards. The first group is
       the one with a proof figure, so it gets the lead: a tall double-bezel card with the
       figure in the homepage's statistic treatment. The other two stack beside it in the
       same vocabulary at the smaller size. Same words, three weights. -->
  <section id="core-value" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[760px] mb-10 sm:mb-12">
${eyebrow('orange-500', COPY.s2.eyebrow, 'ink')}
        ${h2(COPY.s2.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s2.intro}</p>
      </div>

      <div class="rv-kids grid lg:grid-cols-[1.15fr_1fr] gap-4 lg:gap-5">
${COPY.s2.groups.map(([head, body, proof, icon, tint], i) => {
  const lead = i === 0;
  const CHIP = { teal: ['bg-teal-100', '#06748A'], ink: ['bg-ink-100', '#374151'], orange: ['bg-orange-100', '#B84431'] }[tint];
  const card = `        <div class="min-w-0 ${lead ? 'lg:row-span-2' : ''} rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse spotlight">
          <div class="min-w-0 h-full rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl p-5 sm:p-7 lg:p-8 flex flex-col">
            <span class="inline-flex ${lead ? 'w-12 h-12' : 'w-11 h-11'} rounded-xl sm:rounded-[14px] lg:rounded-2xl ${CHIP[0]} items-center justify-center mb-4 sm:mb-5">
              <svg width="${lead ? 22 : 20}" height="${lead ? 22 : 20}" viewBox="0 0 24 24" fill="none" stroke="${CHIP[1]}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>
            </span>
            <h3 class="${lead ? 'text-[19px] sm:text-[21px] lg:text-[23px]' : 'text-[17px] sm:text-[18px] lg:text-[19px]'} font-bold tracking-tight mb-2.5">${head}</h3>
            <p class="${lead ? '' : 'flex-1 '}text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[52ch]">${body}</p>${proof ? `
            <!-- the proof, in the statistic treatment the homepage gives its figures -->
            <div class="mt-auto pt-8 sm:pt-10 lg:pt-12">
              <div class="rounded-2xl sm:rounded-3xl bg-teal-50 ring-1 ring-teal-600/10 px-5 py-5 sm:px-6 sm:py-6">
                <p class="text-[34px] sm:text-[40px] lg:text-[48px] font-extrabold tracking-tightest nums leading-none text-teal-800">${proof[0]}</p>
                <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-teal-700 mt-2">${proof[1]}</p>
              </div>
            </div>` : ''}
          </div>
        </div>`;
  return card;
}).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · AI PRICING ═══════════════ */
const section3 = () => `  <!-- ================= 03 · AI PRICING =================
       The page's dark act. AI pricing is the second commercial decision on the page and
       separating it from the plagiarism plans is the section's whole job, so it gets its
       own ground rather than another white band.

       DYNAMIC: this is the approved 2026-08-24 snapshot for the prototype, "not a
       permission to create a second manual billing source". -->
  <section id="ai-pricing" class="relative py-16 sm:py-24 lg:py-32 bg-ink-950 overflow-hidden">
    <div class="orb absolute" style="width:880px;height:820px;left:-14%;top:-360px;background:rgba(44,195,219,.20)"></div>
    <div class="orb absolute" style="width:700px;height:680px;right:-12%;bottom:-320px;background:rgba(243,111,90,.12)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1fr_1.25fr] gap-8 lg:gap-14 items-start">

        <div class="rv lg:sticky lg:top-28 text-white">
${eyebrowDark('teal-400', COPY.s3.eyebrow)}
          ${h2(COPY.s3.h2)}
          <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/70 max-w-[54ch]">${COPY.s3.intro}</p>

          <div class="mt-6 rounded-2xl bg-teal-400/[.07] ring-1 ring-teal-400/25 p-5 flex items-start gap-4">
            <span class="shrink-0 w-10 h-10 rounded-xl bg-teal-400/15 ring-1 ring-teal-400/30 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6ED7E8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </span>
            <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-white/80">${COPY.s3.clarification}</p>
          </div>

          <div class="mt-6 lg:mt-7">${linkQuiet(COPY.s3.cta, COPY.s3.ctaHref, true)}</div>
        </div>

        <div class="rv min-w-0">
          <!-- Corrections v2 §4: a selector, not a table. Native radios carry the
               keyboard model and the one-at-a-time rule; the drawn dot and the check mark
               carry the selected state without leaning on colour alone. -->
          <p id="aiHelp" class="mb-4 text-[13.5px] sm:text-[14.5px] leading-relaxed text-white/80">${COPY.s3.selectHelper}</p>
          <fieldset class="m-0 p-0 border-0 min-w-0">
            <legend class="sr-only">AI word package</legend>
            <div class="rounded-3xl sm:rounded-4xl bg-white/[.05] ring-1 ring-white/10 p-1.5 sm:p-2">
              <div class="rounded-[18px] sm:rounded-3xl bg-white overflow-hidden">
                <div class="grid grid-cols-[2rem_1fr_auto_auto] sm:grid-cols-[2.25rem_1fr_7rem_7rem] gap-x-3 sm:gap-x-4 items-center px-4 sm:px-5 py-3.5 border-b border-ink-100" aria-hidden="true">
                  <span></span>
${COPY.s3.tableHeads.map((h, i) => `                  <span class="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500${i === 2 ? ' text-right' : ''}">${h}</span>`).join('\n')}
                </div>
                <div class="divide-y divide-ink-100">
${COPY.s3.packages.map(([words, billing, price]) => `                  <label class="ai-opt grid grid-cols-[2rem_1fr_auto_auto] sm:grid-cols-[2.25rem_1fr_7rem_7rem] gap-x-3 sm:gap-x-4 items-center px-4 sm:px-5 py-3 sm:py-3.5 cursor-pointer">
                    <input type="radio" name="aiPackage" value="${words.replace(/,/g, '')}" data-billing="${billing}" data-price="${price}" class="sr-only"${words === COPY.s3.defaultPackage ? ' checked' : ''}>
                    <span class="ai-dot w-5 h-5 rounded-full ring-1 ring-inset ring-ink-300 flex items-center justify-center" aria-hidden="true">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </span>
                    <span class="text-[14.5px] font-bold tracking-tight tabular-nums text-ink-900">${words}</span>
                    <span class="text-[13px] text-ink-600">${billing}</span>
                    <span class="text-[14.5px] font-semibold text-ink-900 tabular-nums text-right">${price}</span>
                  </label>`).join('\n')}
                </div>
              </div>
            </div>
          </fieldset>

          <!-- the one continuation action, in the site's accent (the header's Check free
               button): white would vanish against the white selector above it. No href:
               the checkout route is not known to the prototype and the brief says not to
               invent one. data-purchase-hook and the data-ai-* attributes are the
               developer's binding point. -->
          <div class="mt-5 sm:mt-6">
            <button type="button" id="aiContinue" data-purchase-hook="ai-package" data-ai-words="${COPY.s3.defaultPackage.replace(/,/g, '')}" class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-teal-600 hover:bg-teal-700 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
              <span>${COPY.s3.continueLabel[0]}<span class="js-ai-words tabular-nums">${COPY.s3.defaultPackage}</span>${COPY.s3.continueLabel[1]}</span>
              <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/15 items-center justify-center">${arrow}</span>
            </button>
          </div>

          <div class="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <p class="text-[13.5px] leading-relaxed text-white/70">${COPY.s3.customNote}</p>
            <span class="shrink-0">${linkQuiet(COPY.s3.customCta, COPY.s3.customHref, true)}</span>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · ADDITIONAL SERVICES ═══════════════ */
const section4 = () => `  <!-- ================= 04 · OTHER WRITING SERVICES =================
       "Intentionally compact and secondary because these services receive little actual
       usage. It must take materially less space and visual weight than the main pricing
       widget or AI pricing section."

       The cards are the first version's (site/prices.html, "Additional services"):
       a tinted icon chip, the name, a quiet description, and a footer that sets the
       price as a figure — or a mint pill where the service is free — beside the link.
       What keeps it secondary is the section, not the card: a short band rather than a
       full act. The heading is the page's h2, set left like every other section heading;
       the row runs to 1200. Words are DEC-0042's. -->
  <section id="services" class="relative py-12 sm:py-14 lg:py-16 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-7 sm:mb-8 lg:mb-10">
${eyebrow('orange-500', COPY.s4.eyebrow)}
        ${h2(COPY.s4.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s4.intro}</p>
      </div>

      <div class="rv-kids grid md:grid-cols-3 gap-4 lg:gap-5 max-w-[1200px]">
${COPY.s4.items.map(([head, body, price, label, href, icon, tint]) => {
  const CHIP = { orange: ['bg-orange-100', '#B84431'], mint: ['bg-mint-100', '#1B7A50'], teal: ['bg-teal-100', '#06748A'] }[tint];
  /* "From $3.50" stays one phrase: the word small, the figure as a figure */
  const m = price.match(/^(From)\s+(\S+)$/);
  const priceHtml = m
    ? `<span class="text-[12px] font-medium text-ink-500 mr-1">${m[1]}</span><span class="text-[20px] sm:text-[22px] lg:text-[24px] font-extrabold tracking-tightest nums">${m[2]}</span>`
    : `<span class="text-[12px] font-bold tracking-[0.12em] uppercase text-mint-700 bg-mint-100 rounded-full px-3 py-1.5">${price}</span>`;
  return `        <div class="rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-8 flex flex-col">
          <span class="w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl ${CHIP[0]} flex items-center justify-center mb-4 lg:mb-5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${CHIP[1]}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>
          </span>
          <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tightest mb-2">${head}</h3>
          <p class="text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-500 mb-4 sm:mb-5 lg:mb-6">${body}</p>
          <div class="mt-auto flex items-end justify-between gap-3">
            <div class="flex items-baseline">${priceHtml}</div>
            <a href="${href}" class="shrink-0 inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-700 hover:text-teal-800 transition-colors duration-300">
              ${label}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </div>`;
}).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 05 · CUSTOM / HIGH VOLUME ═══════════════ */
const section5 = () => `  <!-- ================= 05 · CUSTOM & HIGH VOLUME =================
       The dark banner the brief calls for, and the page's second dark beat. Neutral by
       instruction: no VIP benefits, pricing, discounts, submission quantities, dedicated
       manager, invoicing or Storage promises — only the approved sentence and the link.

       The shell is build/banner.js — the same block the AI Detector page gives its API
       and the University page gives AI checking. It used to carry its own heading size
       and padding here; that was drift, not a decision. -->
${banner({
    id: 'high-volume',
    orb: 'rgba(243,111,90,.18)',
    eyebrow: ['orange-500', COPY.s5.eyebrow],
    h2: COPY.s5.h2,
    lead: COPY.s5.body, leadMax: '62ch',
    action: banner.btn(COPY.s5.cta, COPY.s5.ctaHref),
  })}`;

/* ═══════════════ 06 · PRICING FAQ ═══════════════ */
const section6 = () => `  <!-- ================= 06 · PRICING FAQ =================
       Seven exact questions. Every answer is in the rendered HTML — the brief requires it
       and any later schema must match the visible copy exactly. -->
  <section id="pricing-faq" class="relative py-16 sm:py-24 lg:py-32 bg-ink-50">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-start">
        <div class="rv lg:sticky lg:top-28">
${eyebrow('orange-500', 'Questions')}
          ${h2(COPY.s6.h2)}
          <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s6.footer}</p>
          <div class="mt-5 lg:mt-6">${linkQuiet(COPY.s6.cta, COPY.s6.ctaHref)}</div>
        </div>

        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl divide-y divide-ink-100 overflow-hidden">
${COPY.s6.items.map(([q, a], i) => `            <div class="faq-item${i === 0 ? ' open' : ''}">
              <button type="button" aria-expanded="${i === 0 ? 'true' : 'false'}" class="faq-q w-full flex items-center justify-between gap-4 sm:gap-5 lg:gap-6 text-left px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6">
                <span class="text-[15.5px] font-bold tracking-tight">${q}</span>
                <span class="faq-chev shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </button>
              <div class="faq-a"><div><p class="px-4 sm:px-5 lg:px-6 pb-5 sm:pb-6 lg:pb-7 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[72ch]">${a}${i === 6 ? ` <a href="${COPY.s6.inAnswerHref}" class="font-semibold text-ink-800 underline decoration-ink-300 underline-offset-4 hover:text-ink-900 transition-colors duration-300">${COPY.s6.inAnswerCta}</a>` : ''}</p></div></div>
            </div>`).join('\n')}
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 07 · FINAL FREE-CHECK CTA ═══════════════ */
const section7 = () => `  <!-- ================= 07 · FINAL FREE-CHECK CTA =================
       "Do not render a second checker inside this section." One action, to the primary
       Plagiarism Checker owner at /. Plagiarism only: no AI, and no "full engine". -->
  <section id="free-check" class="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
${cta.background('free-check')}

    <div class="relative max-w-[880px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
      <h2 class="rv ${cta.HEADING} mb-5 sm:mb-6 lg:mb-7">${cta.ringMark(COPY.s7.h2, 'before you choose')}</h2>
      <p class="rv text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600 max-w-[58ch] mx-auto mb-8 sm:mb-10 lg:mb-11">${COPY.s7.support}</p>
      <div class="rv flex justify-center">
        <a href="${COPY.s7.ctaHref}" class="btn-press group flex items-center gap-3 rounded-full bg-ink-900 hover:bg-ink-800 text-white text-[15px] sm:text-[16px] font-semibold pl-6 sm:pl-7 lg:pl-8 pr-2.5 py-3.5 transition-colors duration-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F58971" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/></svg>
          ${COPY.s7.cta}
          <span class="icon-orb w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </div>
  </section>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Page-local styles.
   ───────────────────────────────────────────────────────────────────────────── */
const STYLE = `
<style>
  /* [hidden] must actually hide: Tailwind's display utilities share specificity with the
     attribute selector and come later in the sheet, so a hidden element carrying .flex
     still renders. */
  [hidden] { display: none !important; }

  /* Anchor landings clear the sticky header. The header is fixed at top:20 and its bar
     ends at 76px; 100 leaves the section label fully visible with air above. */
  section[id] { scroll-margin-top: 100px; }

  a:focus-visible, button:focus-visible, summary:focus-visible,
  [tabindex]:focus-visible, input:focus-visible, textarea:focus-visible {
    outline: 2px solid #0CA9C3; outline-offset: 3px; border-radius: 4px; }
  .bg-ink-950 a:focus-visible, .bg-ink-950 button:focus-visible { outline-color: #6ED7E8; }

  .rv-kids > * { opacity:0; transform:translateY(40px); }
  .no-motion .rv-kids > * { opacity:1 !important; transform:none !important; }

  /* the period switcher, same control as the homepage widget */
  .period-btn { transition:background-color .3s ease, color .3s ease, box-shadow .3s ease; }
  .period-btn.active { background:#fff; color:#111827; box-shadow:0 1px 2px rgba(0,0,0,.06); }

  /* the AI package selector. The selected row is tinted AND carries the filled dot with
     a check mark, so the state survives without colour. Keyboard focus lands on the
     hidden radio, so the ring is drawn on the row that contains it. */
  .ai-opt { transition:background-color .15s ease; }
  .ai-opt:hover { background:#F2FAFB; }
  .ai-opt.on { background:#E6F4F7; }
  .ai-opt .ai-dot { background:#fff; transition:background-color .15s ease, box-shadow .15s ease; }
  .ai-opt .ai-dot svg { opacity:0; }
  .ai-opt.on .ai-dot { background:#0991A8; box-shadow:inset 0 0 0 1px #0991A8; }
  .ai-opt.on .ai-dot svg { opacity:1; }
  .ai-opt:has(input:focus-visible) { outline:2px solid #6ED7E8; outline-offset:-2px; }

  /* the bento hover from the homepage capabilities grid */
  .spotlight { transition:transform .35s cubic-bezier(.32,.72,0,1), box-shadow .35s ease; }
  .spotlight:hover { transform:translateY(-4px); }
  @media (prefers-reduced-motion: reduce) { .spotlight { transition:none; } .spotlight:hover { transform:none; } }

  /* pen and ring marks — the reduced-motion fallback is mandatory */
  .no-motion .pen-word { color:#DC5A45; }
  .no-motion .pen-underline { opacity:1; }
${cta.style('free-check')}
</style>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Behaviour.
   ───────────────────────────────────────────────────────────────────────────── */
const SCRIPT = `<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script>
(() => {
  'use strict';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.gsap) { document.documentElement.classList.add('no-motion'); return; }

  gsap.registerPlugin(ScrollTrigger);

  const rvs = gsap.utils.toArray('.rv');
  const inView = rvs.filter(el => el.getBoundingClientRect().top < innerHeight * .9);
  inView.forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      delay: .1 + (el.getBoundingClientRect().top / innerHeight) * .3 });
  });
  rvs.filter(el => !inView.includes(el)).forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 70%' } });
  });

  gsap.utils.toArray('.rv-kids').forEach(group => {
    gsap.to(group.children, { opacity: 1, y: 0, duration: .7, ease: 'power2.out', stagger: .08,
      scrollTrigger: { trigger: group, start: 'top 80%' } });
  });

  gsap.utils.toArray('.pen-word').forEach(word => {
    const line = word.querySelector('.pen-underline');
    if (!line) return;
    const len = line.getTotalLength();
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    const inFirstView = word.getBoundingClientRect().top < innerHeight * .9;
    const tl = gsap.timeline(inFirstView
      ? { delay: 1 }
      : { scrollTrigger: { trigger: word, start: 'top 80%', once: true } });
    tl.to(word, { color: '#DC5A45', duration: .45, ease: 'power2.out' })
      .set(line, { opacity: 1 }, .35)
      .to(line, { strokeDashoffset: 0, duration: .7, ease: 'power2.inOut' }, .35);
  });
${cta.script}
})();
</script>
<script>
(() => {
  'use strict';

  /* ── the pricing widget shell ────────────────────────────────────────────────
     PLACEHOLDER DATA. DEC-0042 makes every figure here backend-driven; this exists so
     the shell has something to render until a developer connects the authoritative
     production widget, and it is the same object the homepage uses so the two pages
     cannot show different prices.

     The per-period notes the homepage renders are deliberately absent: this brief
     approves exactly one helper line, the one-time one, and forbids inventing billing
     or cancellation wording in the design layer. */
  const PLANS = ${JSON.stringify(PLANS, null, 2).split('\n').join('\n  ')};

  const tabs = [...document.querySelectorAll('#periodTabs .period-btn')];
  const cards = [...document.querySelectorAll('[data-tier]')];
  const helper = document.getElementById('onetimeHelper');
  if (!tabs.length || !cards.length) return;

  const render = key => {
    const period = PLANS[key];
    if (!period) return;
    tabs.forEach(t => {
      const on = t.dataset.period === key;
      t.classList.toggle('active', on);
      t.setAttribute('aria-pressed', String(on));
    });
    helper.hidden = key !== 'onetime';
    cards.forEach(card => {
      const tier = period[card.dataset.tier];
      if (!tier) return;
      card.querySelector('.js-price').textContent = tier.price;
      card.querySelector('.js-term').textContent = period.term;
      card.querySelector('.js-rate').textContent = tier.rate;
      card.querySelector('.js-feats').innerHTML = tier.feats.map(f =>
        '<li class="flex items-start gap-2.5"><svg class="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>' + f + '</li>').join('');
    });
  };

  tabs.forEach(t => t.addEventListener('click', () => render(t.dataset.period)));
  render('onetime');

  /* ── the AI package selector ──────────────────────────────────────────────
     One radio group; the checked one names the allowance on the button and stamps it
     on the data hook a developer binds the real purchase flow to. */
  const radios = [...document.querySelectorAll('input[name="aiPackage"]')];
  const go = document.getElementById('aiContinue');
  if (radios.length && go) {
    const fmt = n => Number(n).toLocaleString('en-US');
    const syncAi = () => {
      const r = radios.find(x => x.checked) || radios[0];
      radios.forEach(x => x.closest('.ai-opt').classList.toggle('on', x === r));
      go.querySelector('.js-ai-words').textContent = fmt(r.value);
      go.dataset.aiWords = r.value;
      go.dataset.aiBilling = r.dataset.billing;
      go.dataset.aiPrice = r.dataset.price;
    };
    radios.forEach(x => x.addEventListener('change', syncAi));
    syncAi();
  }

  /* FAQ: answers are already in the DOM; this only opens and closes them */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      const list = item.parentElement;
      list.querySelectorAll('.faq-item').forEach(x => x.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
      list.querySelectorAll('.faq-q').forEach(b =>
        b.setAttribute('aria-expanded', String(b.closest('.faq-item').classList.contains('open'))));
    });
  });
})();
</script>
<script>
(() => {
  'use strict';
  const btn = document.getElementById('navBurger');
  const panel = document.getElementById('navPanel');
  if (!btn || !panel) return;
  const setOpen = on => {
    btn.setAttribute('aria-expanded', String(on));
    panel.classList.toggle('open', on);
    btn.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
  };
  btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });
  addEventListener('resize', () => { if (innerWidth >= 1024) setOpen(false); });
})();
</script>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Assemble
   ───────────────────────────────────────────────────────────────────────────── */
const donor = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
let head = donor.slice(0, donor.indexOf('<body'));
head = head.replace(/<title>[\s\S]*?<\/title>/, '<title>' + COPY.title + '</title>');
if (/name="description"/.test(head)) {
  head = head.replace(/<meta name="description"[^>]*>/,
    '<meta name="description" content="' + COPY.meta + '" />');
} else {
  head = head.replace('<title>',
    '<meta name="description" content="' + COPY.meta + '" />\n<title>');
}
head = head.replace('<title>', '<link rel="canonical" href="' + COPY.canonical + '" />\n<title>');

const bodyTag = donor.slice(donor.indexOf('<body'), donor.indexOf('>', donor.indexOf('<body')) + 1);

/* Corrections v2 §7: high-volume/custom access continues the pricing intent; the
   writing services are peripheral and stay behind it. The section numbers in the
   builders keep their DEC-0042 names; only the page order changes. */
const sections = [section1, section2, section3, section5, section4, section6, section7];

const html = head + STYLE + '\n' + bodyTag + `
<div class="grain"></div>

<header></header>

<main>
${sections.map(f => f()).join('\n\n')}
</main>

<footer></footer>

${SCRIPT}
</body>
</html>
`;

fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' +
            count(/<h2\b/g) + ' h2, ' + count(/class="faq-item/g) + ' faq items');
