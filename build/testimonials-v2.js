/* Generate site/testimonials-v2.html — Reviews, illustrated. v1 (build/testimonials.js)
   stays beside it; the switcher (build/version-switch.js) puts the two one click apart
   until Olex picks one.

   Everything on the page is still the live page's, read into testimonials-data.json by
   build/testimonials-fetch.js. The opening is in the illustrated manner of Affiliate v2
   and Scholarship v2 (IMAGES.md §8):
   - the hero gets a photograph — someone reading good news on a phone — with the two
     platforms' ratings as chips, the live figures ("4.7 / 5", "5 / 5");
   - "Join Thousands Who Trust PlagiarismSearch" pairs a photograph (on the side
     opposite the hero's, DESIGN.md checkerboard) with the three platform tiles, each now
     carrying a duotone spot icon on a white plate.
   First pages under the wardrobe law (IMAGES.md §2.1): the people wear everyday clothes,
   not the brand's colours. The laptops' maker's marks were patched out of both frames.

   Then, by Olex's second pass (2026-09-30) — the cards no longer sit in an even grid
   with holes, and each platform speaks in its own manner:
   - Trustpilot: its cream ground, its green star squares, round initial avatars, a
     masonry wall (CSS columns) — still nine at a time behind the live "Show more".
   - SmartCustomer (the live page's Sitejabber: sitejabber.com now redirects there;
     renamed with that profile's figures by Olex's decision, see SMART below): gold
     stars, square initial avatars, bold titles, blue accents, as two rows running
     sideways in opposite directions (site.js, module marquee). Cards of one height; the
     rows slow down under the pointer and on focus, stop on the pause button, and stay
     still for readers who asked for less motion; the full review opens as a popup zoomed
     out of its card (hover, keyboard focus, tap).
   - The four video reviews get a stage: the first one large (YouTube's 1280px still),
     the four as a playlist beside it; a pick plays on the stage (module video-stage).

   Run:  node build/testimonials-v2.js  →  node build/shell.js  →  node build/check-testimonials.js testimonials-v2.html */
const fs = require('fs');
const path = require('path');
const page = require('./page');
const { dotField } = require('./dots');
const { stars } = require('./reviews');
const v1 = require('./testimonials');

/* Sitejabber is now SmartCustomer: sitejabber.com/reviews/plagiarismsearch.com answers
   301 → smartcustomer.com/reviews/plagiarismsearch.com. Olex, 2026-09-30: rename it and
   take the figures from the SmartCustomer profile (read that day from its structured
   data: ratingValue 4.0 of 5, reviewCount 43). The cards and the featured quote are the
   same reviews, carried over by the move; only the name, the link and the figures
   change, and only here — v1 keeps the live page's words. */
const SMART = {
  name: 'SmartCustomer',
  url: 'https://www.smartcustomer.com/reviews/plagiarismsearch.com',
  rating: '4.0', stars: 4, max: 5, count: 43,   /* the rating as printed, "4.0" */
  heading: 'Latest SmartCustomer feedbacks',
};
const D = JSON.parse(JSON.stringify(v1.D));
Object.assign(D.sitejabber, { url: SMART.url, rating: SMART.rating, stars: SMART.stars, max: SMART.max, count: SMART.count, heading: SMART.heading, textRating: null });
D.trust.tiles = D.trust.tiles.map(t => t.key === 'sitejabber'
  ? { ...t, url: SMART.url, rating: SMART.rating, max: String(SMART.max), stars: SMART.stars } : t);
const NAME = { ...v1.NAME, sitejabber: SMART.name };

const SITE = path.join(__dirname, '..', 'site');
const OUT = 'testimonials-v2.html';
const IMG = '/assets/img/reviews/';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const H2 = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const INTRO = 'mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600';
const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/></svg>`;
  if (!text.includes(phrase)) throw new Error('penMark: "' + phrase + '" not in "' + text + '"');
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};
const ico = (paths, stroke, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const I = {
  star:     '<path d="m12 2 2.9 6.26 6.6.83-4.9 4.6 1.3 6.31L12 16.9 6.1 20l1.3-6.31L2.5 9.09l6.6-.83z"/>',
  message:  '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
};

/* a chip over a photograph (affiliate-v2.js): under the photo on a phone, floating from sm */
const chip = (pos, tone, icon, big, small) => `        <span class="${pos} flex items-center gap-3 rounded-2xl bg-white shadow-diffuse-lg pl-2.5 pr-4 lg:pr-5 py-2.5">
          <span class="w-10 h-10 rounded-full ${tone} flex items-center justify-center shrink-0">${ico(I[icon], '#fff')}</span>
          <span class="flex flex-col">
            <span class="text-[15px] sm:text-[16px] font-extrabold tracking-tight leading-tight nums">${big}</span>
            <span class="text-[12px] sm:text-[12.5px] text-ink-500 leading-snug">${small}</span>
          </span>
        </span>`;

const [TP, SJ] = D.trust.tiles;

/* ═══════════════ 01 · HERO ═══════════════ */
const section1 = () => `  <!-- ================= 01 · HERO / REVIEWS =================
       The live heading and line beside a photograph of someone reading good news; the
       two platforms' live ratings as chips over the window and the table. -->
  <section id="reviews" data-component="hero-photo" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    ${dotField()}
    <div class="orb absolute orb-hero-teal"></div>
    <div class="orb absolute orb-hero-coral"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-14 items-center">
        <div class="rv min-w-0">
          <h1 class="text-[clamp(2.2rem,4.6vw,3.6rem)] font-extrabold tracking-tightest leading-[1.05] mb-5 sm:mb-6">${penMark(esc(D.h1), 'Real Impact')}</h1>
          <p class="text-[15.5px] sm:text-[16px] lg:text-[17px] leading-relaxed text-ink-600 max-w-[58ch]">${esc(D.lead)}</p>
        </div>

        <div class="rv relative min-w-0">
          <img src="${IMG}hero.webp" alt="" width="1000" height="1241" class="w-full rounded-3xl sm:rounded-[28px] lg:rounded-4xl shadow-diffuse" fetchpriority="high">
          <div class="mt-3 flex flex-col gap-2.5 sm:mt-0">
${chip('sm:absolute sm:-right-4 lg:-right-6 sm:top-10', 'bg-teal-500', 'star', TP.rating + ' / ' + TP.max, NAME.trustpilot)}
${chip('sm:absolute sm:-left-4 lg:-left-6 sm:bottom-14', 'bg-orange-500', 'star', SJ.rating + ' / ' + SJ.max, NAME.sitejabber)}
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · JOIN THOUSANDS ═══════════════ */
const ICON = { trustpilot: 'icon-rating', sitejabber: 'icon-review', 'google-workspace': 'icon-install' };
const tile = t => {
  const figure = t.rating != null
    ? `<span class="col-start-2 sm:col-start-auto text-[22px] sm:text-[24px] font-extrabold tracking-tightest leading-none nums">${t.rating} <span class="text-ink-300 font-bold">/</span> ${t.max}</span>`
    : `<span class="col-start-2 sm:col-start-auto inline-flex items-center gap-1.5 text-[22px] sm:text-[24px] font-extrabold tracking-tightest leading-none nums">${ico(I.download, '#06748A', 18)}${t.downloads}</span>`;
  /* a grid, not a row: on a phone the figure drops under the name beside the plate
     (a 375px row cannot hold plate, name, stars and "492.000+"); from sm it sits right */
  return `          <a href="${t.url}" rel="nofollow noopener" class="group grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto_auto] items-center gap-x-4 sm:gap-x-5 gap-y-2 rounded-2xl sm:rounded-3xl bg-ink-50 hover:bg-ink-100 p-3.5 sm:p-4 pr-5 sm:pr-6 transition-colors duration-300">
            <span class="row-span-2 sm:row-span-1 shrink-0 w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl sm:rounded-2xl bg-white flex items-center justify-center"><img src="${IMG}${ICON[t.key]}.webp" alt="" width="288" height="288" loading="lazy" decoding="async" class="w-10 h-10 sm:w-11 sm:h-11"></span>
            <span class="min-w-0 flex-1 flex flex-col gap-1.5">
              <span class="text-[14px] sm:text-[14.5px] font-bold tracking-tight">${NAME[t.key]}</span>
              <span class="flex items-center gap-2.5">${stars(t.stars)}${t.reviewsCount ? `<span class="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-600 nums">${ico(I.message, '#6B7280', 13)}${t.reviewsCount}</span>` : ''}</span>
            </span>
            ${figure}
            <span class="hidden sm:block shrink-0 text-ink-300 group-hover:text-ink-600 transition-colors duration-300">${ico(I.external, 'currentColor', 16)}</span>
          </a>`;
};

const section2 = () => `  <!-- ================= 02 · JOIN THOUSANDS =================
       A photograph left (opposite the hero's), the heading, the line and the three
       platform tiles right — each tile a link to the platform, its spot icon on a white
       plate, the live figures beside the system's stars. -->
  <section id="join-thousands" data-component="photo-tiles" class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
        <div class="rv min-w-0 order-2 lg:order-1">
          <img src="${IMG}trust.webp" alt="" width="1200" height="805" loading="lazy" decoding="async" class="w-full rounded-3xl sm:rounded-[28px] lg:rounded-4xl shadow-diffuse">
        </div>
        <div class="rv min-w-0 order-1 lg:order-2">
          <h2 class="${H2}">${esc(D.trust.title)}</h2>
          <p class="${INTRO} max-w-[56ch]">${esc(D.trust.text)}</p>
          <div class="mt-7 lg:mt-8 grid gap-3">
${D.trust.tiles.map(tile).join('\n')}
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ THE PLATFORMS, EACH IN ITS OWN MANNER ═══════════════ */
const attr = s => esc(s).replace(/"/g, '&quot;');
const STEP = 9;                               /* the live page's "Show more" step */
/* initials: up to two, from the name as printed */
const initials = n => esc(n.trim().split(/\s+/).filter(w => /\p{L}/u.test(w)).slice(0, 2).map(w => [...w][0].toUpperCase()).join('') || '?');
/* a stable pastel per name, as Trustpilot does it */
/* full class strings, so Tailwind sees them in this file */
const TP_AV = ['bg-[#F1DFFC] text-[#6B2F9E]', 'bg-[#E5F2FF] text-[#1C5FA8]', 'bg-[#FFE8D6] text-[#A04A0C]', 'bg-[#DDF6EA] text-[#16704A]', 'bg-[#FCE1E4] text-[#A3243A]', 'bg-[#FFF4CC] text-[#7A5A00]'];
const hash = s => [...s].reduce((h, c) => (h * 31 + c.codePointAt(0)) >>> 0, 7);

/* star rows: the value is the data; a part-lit square/star gets its share inline */
const tpStars = (value, lg) => `<span class="tp-stars${lg ? ' is-lg' : ''}" data-score="${Math.round(value)}" role="img" aria-label="${value} out of 5">${[1, 2, 3, 4, 5].map(n => {
  const f = Math.max(0, Math.min(1, value - (n - 1)));
  return f >= 1 ? '<span class="tp-star"></span>' : f <= 0 ? '<span class="tp-star is-off"></span>' : `<span class="tp-star" style="--f:${Math.round(f * 100)}%"></span>`;
}).join('')}</span>`;
const scStars = (value, lg) => `<span class="sc-stars${lg ? ' is-lg' : ''}" role="img" aria-label="${value} out of 5">${[1, 2, 3, 4, 5].map(n => `<span class="sc-star${n <= Math.round(value) ? '' : ' is-off'}"></span>`).join('')}</span>`;

/* tpCardOn(ring) — the card for a given ground: Trustpilot's warm rule on its cream, a
   neutral one on the site's white (the tool pages). The soft shadow is the library review
   card's own (build/sections/reviews.css, shadow-diffuse), borrowed, not invented (Olex,
   2026-10-06). */
/* the text goes through build/review-clip.js: about nine lines, then "Read more" (design
   correction pack of 2026-10-06). The wall keeps its masonry; a long review no longer
   makes one card the height of a column. */
const { clip } = require('./review-clip');
const tpCardOn = ring => (r, i) => {
  const av = TP_AV[hash(r.name) % TP_AV.length];
  return `          <article data-review class="${i >= STEP ? 'more-later ' : ''}mb-4 rounded-xl bg-white ring-1 ${ring} shadow-diffuse p-5 sm:p-6 outline-none">
            <header class="flex items-center gap-3 mb-4">
              <span class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold ${av}" aria-hidden="true">${initials(r.name)}</span>
              <span class="min-w-0 text-[14.5px] font-semibold text-[#191919] truncate">${esc(r.name)}</span>
            </header>
            <div class="mb-3">${tpStars(r.score)}</div>
            <h3 class="rc-title text-[15.5px] sm:text-[16px] font-bold tracking-tight text-[#191919] mb-1.5">${esc(r.title)}</h3>
${clip(r.text.map(p => `                <p class="text-[14px] sm:text-[14.5px] leading-relaxed text-[#191919]/80 mt-1.5 first-of-type:mt-0">${esc(p)}</p>`).join('\n'), '            ')}
          </article>`;
};
const tpCard = tpCardOn('ring-[#E5E5DD]');       /* on the Reviews page's cream ground */

const SC_AV =['bg-[#0F8A7A]', 'bg-[#2B7FD4]', 'bg-[#7A5AF8]', 'bg-[#E0692F]', 'bg-[#1F2937]'];
/* One height for every card in the rows (.sc-card): the title keeps two lines, the text
   fades out at the foot of the card. The whole review is still in the HTML, and the
   marquee module opens it in full as a popup zoomed out of the card (hover, focus, tap). */
const scCard = (r, copy) => `            <article ${copy ? 'data-review-copy' : 'data-review tabindex="0"'} class="sc-card w-[300px] sm:w-[360px] shrink-0 rounded-2xl bg-white ring-1 ring-[#E4E8EE] p-5 sm:p-6">
              <header class="flex items-center gap-3 mb-4">
                <span class="shrink-0 w-10 h-10 rounded-lg ${SC_AV[hash(r.name) % SC_AV.length]} text-white flex items-center justify-center text-[16px] font-bold" aria-hidden="true">${initials(r.name).slice(0, 1)}</span>
                <span class="min-w-0 text-[15px] font-semibold text-[#111827] truncate">${esc(r.name)}</span>
              </header>
              <${copy ? 'p' : 'h3'} class="sc-title text-[17px] sm:text-[18px] font-bold tracking-tight text-[#111827] leading-snug mb-2">${esc(r.title)}</${copy ? 'p' : 'h3'}>
              <div class="mb-3">${scStars(r.score)}</div>
              <div class="sc-clip">
${r.text.map(p => `                <p class="text-[14px] sm:text-[14.5px] leading-[1.7] text-[#374151] mt-1.5 first-of-type:mt-0">${esc(p)}</p>`).join('\n')}
              </div>
            </article>`;

const P_TP = D.trustpilot, P_SJ = D.sitejabber;
const extIco = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';

const trustpilotWall = () => `  <!-- ================= TRUSTPILOT, IN ITS MANNER =================
       Trustpilot's cream ground and green star squares; the summary as their score card
       (score, text rating, stars, "Based on N reviews") beside the featured quote; the
       cards as a masonry wall, nine at a time behind the live "Show more". -->
  <section id="trustpilot-reviews" data-component="review-masonry" class="relative py-16 sm:py-24 lg:py-28 bg-[#FCFBF3]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv grid lg:grid-cols-[auto_1fr] gap-6 lg:gap-12 items-center rounded-2xl sm:rounded-3xl bg-white ring-1 ring-[#E5E5DD] p-6 sm:p-8 lg:p-10 mb-10 sm:mb-12">
        <div class="flex flex-col gap-2.5 lg:pr-12 lg:border-r lg:border-[#E5E5DD]">
          <p class="text-[13px] font-semibold text-[#191919]/60">${NAME.trustpilot}</p>
          <p class="flex items-baseline gap-3"><span class="text-[clamp(2.6rem,4vw,3.4rem)] font-extrabold tracking-tightest leading-none text-[#191919] nums">${P_TP.rating}</span><span class="text-[15px] font-semibold text-[#191919]/50 nums">/ ${P_TP.max}</span></p>
          ${P_TP.textRating ? `<p class="text-[17px] font-bold text-[#191919]">${esc(P_TP.textRating)}</p>` : ''}
          ${tpStars(P_TP.stars, true)}
          <p class="text-[13.5px] text-[#191919]/70">Based on <a href="${P_TP.url}" rel="nofollow noopener" class="font-semibold text-[#191919] underline decoration-[#191919]/30 underline-offset-4 hover:decoration-[#191919] nums">${P_TP.count} reviews</a></p>
        </div>
        <figure class="min-w-0">
          <p class="text-[14px] font-bold text-[#191919]/60 mb-2">${esc(P_TP.featured.title)}</p>
          <blockquote class="text-[clamp(1.3rem,2.3vw,1.85rem)] font-bold tracking-tight leading-[1.3] text-[#191919] max-w-[42ch]">${esc(P_TP.featured.text)}</blockquote>
        </figure>
      </div>

      <div data-show-more="${STEP}">
        <h2 class="rv ${H2} text-[#191919] mb-8 sm:mb-10">${esc(P_TP.heading)}</h2>
        <div class="masonry columns-1 sm:columns-2 lg:columns-3 gap-4">
${P_TP.reviews.map(tpCard).join('\n')}
        </div>
        <div class="mt-6 sm:mt-8 flex justify-center">
          <button type="button" data-show-more-btn class="btn-press inline-flex items-center gap-2.5 rounded-full bg-[#191919] hover:bg-black text-white transition-colors duration-300 text-[13.5px] sm:text-[14.5px] font-semibold px-6 py-3">
            ${esc(P_TP.showMore)}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>
      </div>
    </div>
  </section>`;

/* the SmartCustomer cards in two rows, split in half, the second running the other way */
const half = Math.ceil(P_SJ.reviews.length / 2);
const ROWS = [P_SJ.reviews.slice(0, half), P_SJ.reviews.slice(half)];
const sitejabberRows = () => `  <!-- ================= SMARTCUSTOMER, IN ITS MANNER =================
       SmartCustomer's gold stars, square initial avatars, bold titles and blue accents;
       the summary card with the profile's figures, then every card in two rows running
       sideways (module marquee): cards of one height, slower under the pointer, the full
       review as a popup zoomed out of the card. Each row's copy is aria-hidden and holds
       nothing focusable (it stays hoverable, so a copy card opens its popup too). -->
  <section id="sitejabber-reviews" data-component="review-marquee" data-marquee class="relative py-16 sm:py-24 lg:py-28 bg-[#F4F7FB] overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv grid lg:grid-cols-[1fr_auto] gap-6 lg:gap-12 items-center rounded-2xl sm:rounded-3xl bg-white ring-1 ring-[#E4E8EE] p-6 sm:p-8 lg:p-10 mb-10 sm:mb-12">
        <figure class="min-w-0 order-2 lg:order-1">
          <p class="text-[18px] sm:text-[20px] font-bold tracking-tight text-[#111827] mb-2">${esc(P_SJ.featured.title)}</p>
          <blockquote class="text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-[#374151] max-w-[70ch]">${esc(P_SJ.featured.text)}</blockquote>
        </figure>
        <div class="order-1 lg:order-2 flex flex-col gap-2.5 lg:pl-12 lg:border-l lg:border-[#E4E8EE]">
          <p class="text-[13px] font-semibold text-[#6B7280]">${NAME.sitejabber}</p>
          <p class="flex items-center gap-3">${scStars(P_SJ.stars, true)}<span class="text-[clamp(1.8rem,2.8vw,2.3rem)] font-extrabold tracking-tightest leading-none text-[#111827] nums">${P_SJ.rating} <span class="text-[#9CA3AF] font-bold">/</span> ${P_SJ.max}</span></p>
          <p class="text-[13.5px] text-[#4B5563]">Based on <a href="${P_SJ.url}" rel="nofollow noopener" class="font-semibold text-[#1E7FD0] underline decoration-[#1E7FD0]/30 underline-offset-4 hover:decoration-[#1E7FD0] nums">${P_SJ.count} reviews</a></p>
        </div>
      </div>

      <div class="flex items-end justify-between gap-4 mb-8 sm:mb-10">
        <h2 class="rv ${H2} text-[#111827]">${esc(P_SJ.heading)}</h2>
        <button type="button" data-marquee-toggle hidden aria-pressed="false" aria-label="Pause" class="shrink-0 w-11 h-11 rounded-full bg-white ring-1 ring-[#E4E8EE] hover:ring-[#1E7FD0] text-[#1E7FD0] flex items-center justify-center transition-shadow duration-300">
          <svg data-icon="pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
          <svg data-icon="play" hidden width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L8.5 4.64A1 1 0 0 0 7 5.5Z"/></svg>
        </button>
      </div>
    </div>

    <div class="grid gap-4">
${ROWS.map((row, n) => `      <div class="mq">
        <div class="mq-track${n ? ' is-right' : ''}">
          <div class="mq-group">
${row.map(r => scCard(r, false)).join('\n')}
          </div>
          <div class="mq-group" data-marquee-copy aria-hidden="true">
${row.map(r => scCard(r, true)).join('\n')}
          </div>
        </div>
      </div>`).join('\n')}
    </div>
    <div class="sc-pop" data-marquee-pop aria-hidden="true" hidden></div>
  </section>`;

/* ═══════════════ VIDEO REVIEWS — THE STAGE ═══════════════ */
const V = D.videos.items;
const playIco = size => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L8.5 4.64A1 1 0 0 0 7 5.5Z"/></svg>`;
const videoStage = () => `  <!-- ================= VIDEO REVIEWS — THE STAGE =================
       The first video large on the stage (YouTube's 1280px still under a play button),
       the four as a playlist beside it; each pick is a link to YouTube, and with site.js
       plays on the stage (module video-stage). -->
  <section id="video-reviews" data-component="video-stage" data-surface="dark" class="relative py-16 sm:py-24 lg:py-28 bg-ink-950 text-white overflow-hidden">
    <div class="orb absolute w-[720px] h-[720px] -left-56 -top-64 bg-[rgba(44,195,219,.16)]"></div>
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
        <h2 class="${H2}">${esc(D.videos.title)}</h2>
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/60">${esc(D.videos.text)}</p>
      </div>

      <div data-video-stage class="rv grid lg:grid-cols-[1.8fr_1fr] gap-4 sm:gap-5 items-start">
        <figure class="rounded-3xl sm:rounded-4xl overflow-hidden bg-ink-900 ring-1 ring-white/10">
          <div data-stage class="relative aspect-video bg-black">
            <a href="https://www.youtube.com/watch?v=${V[0].youtube}" rel="noopener" data-video="${V[0].youtube}" data-video-title="${attr(V[0].name + ': ' + V[0].line)}" data-video-frame-class="absolute inset-0 h-full" aria-label="${attr(V[0].name + ': ' + V[0].line)}" class="group absolute inset-0 block">
              <img src="https://i.ytimg.com/vi/${V[0].youtube}/maxresdefault.jpg" alt="" loading="lazy" width="1280" height="720" class="absolute inset-0 w-full h-full object-cover">
              <span class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden="true"></span>
              <span class="vf-play absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 text-ink-900 flex items-center justify-center shadow-diffuse-lg">${playIco(26)}</span>
            </a>
          </div>
          <figcaption class="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-4 sm:px-7 sm:py-5">
            <span data-caption-name class="text-[17px] sm:text-[19px] font-bold tracking-tight">${esc(V[0].name)}</span>
            <span data-caption-line class="text-[14px] sm:text-[15px] text-white/60">${esc(V[0].line)}</span>
          </figcaption>
        </figure>

        <ol class="grid sm:grid-cols-2 lg:grid-cols-1 gap-3" role="list">
${V.map((v, i) => `          <li><a href="https://www.youtube.com/watch?v=${v.youtube}" rel="noopener" data-video-pick="${v.youtube}" data-video-title="${attr(v.name + ': ' + v.line)}" data-name="${attr(v.name)}" data-line="${attr(v.line)}" aria-current="${i === 0 ? 'true' : 'false'}" class="vs-pick group flex items-center gap-4 rounded-2xl p-2.5 pr-4 bg-white/[.04] ring-1 ring-white/10 hover:bg-white/[.08] transition-colors duration-300">
            <span class="relative shrink-0 w-28 sm:w-32 lg:w-36 aspect-video rounded-xl overflow-hidden bg-ink-900">
              <img src="https://i.ytimg.com/vi/${v.youtube}/mqdefault.jpg" alt="" loading="lazy" width="320" height="180" class="absolute inset-0 w-full h-full object-cover">
              <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-ink-900 flex items-center justify-center" aria-hidden="true">${playIco(12)}</span>
            </span>
            <span class="min-w-0 flex flex-col gap-0.5">
              <span class="text-[15px] sm:text-[15.5px] font-bold tracking-tight">${esc(v.name)}</span>
              <span class="text-[13px] sm:text-[13.5px] text-white/60 leading-snug">${esc(v.line)}</span>
            </span>
            <span class="vs-now ml-auto shrink-0 w-2 h-2 rounded-full bg-teal-400 opacity-0 transition-opacity duration-300" aria-hidden="true"></span>
          </a></li>`).join('\n')}
        </ol>
      </div>
    </div>
  </section>`;

/* check-testimonials.js holds the page to the data it rendered */
module.exports = { D, SMART, tpCard, tpCardOn, tpStars };   /* the Trustpilot card is reused by readability-v2.js */
if (require.main !== module) return;

const sections = [section1(), section2(), trustpilotWall(), videoStage(), sitejabberRows()];
const html = page.render({ title: esc(D.title), meta: D.meta, canonical: 'https://plagiarismsearch.com/testimonials', sections });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' + count(/<h2\b/g) + ' h2, ' +
            count(/<h3\b/g) + ' h3 (review titles), ' + count(/more-later/g) + ' behind "Show more"');
