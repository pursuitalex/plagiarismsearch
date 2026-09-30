/* Generate site/testimonials.html — the Reviews page. It replaces a stub.

   There is no brief for this page, so everything on it is the live page's
   (https://plagiarismsearch.com/testimonials): the headings, the three rating tiles, the
   two platforms' summaries and their hundred review cards, the four video reviews. It
   is all read into build/testimonials-data.json by build/testimonials-fetch.js, and
   this file only lays it out — no review is typed by hand, because a mistyped review is
   a fabricated quote with a real person's name on it.

   The page is a wall of evidence, so the architecture is about making a hundred cards
   readable: the three platforms first, as rating tiles; then each platform as its own
   act — its summary and one featured quote on a dark card, then its cards, nine at a
   time behind "Show more" as on the live page (all in the HTML; see 28-testimonials.css);
   and the four video reviews between the two platforms as the dark act.

   Architectural liberties, none in the words:
   - The live headings are <p>s; here the page has an h2 per section, and each review
     title is an h3.
   - Platform logos are images on the live page; here the platform is named in text
     beside the system's stars (build/reviews.js) — no logo is redrawn.
   - A review card carries the reviewer's initial in place of the live page's generic
     avatar image.
   - The videos are click-to-play facades (site.js, module video) over YouTube's own
     still, instead of four players loading with the page.

   Run:  node build/testimonials.js  →  node build/shell.js  →  node build/check-testimonials.js
   Refresh the data first when the live page changes:  node build/testimonials-fetch.js */
const fs = require('fs');
const path = require('path');
const page = require('./page');
const { dotField } = require('./dots');
const { stars } = require('./reviews');

const SITE = path.join(__dirname, '..', 'site');
const OUT = 'testimonials.html';
const D = require('./testimonials-data.json');
const STEP = 9;                 /* cards shown before, and per, "Show more" — the live page's */

/* the platforms' names, for the text that stands in for their logos */
const NAME = { trustpilot: 'Trustpilot', sitejabber: 'Sitejabber', 'google-workspace': 'Google Workspace Marketplace' };

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the system's (build/business.js is the reference page).
   ───────────────────────────────────────────────────────────────────────────── */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = s => esc(s).replace(/"/g, '&quot;');
const H2 = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const INTRO = 'mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600';
const BODY = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';

const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/></svg>`;
  if (!text.includes(phrase)) throw new Error('penMark: "' + phrase + '" not in "' + text + '"');
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};

/* Lucide icons (the system's set) */
const ico = (paths, stroke, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const I = {
  quote:    '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
  message:  '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  play:     '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>',
};

/* ═══════════════ 01 · HERO ═══════════════ */
const section1 = () => `  <!-- ================= 01 · HERO / REVIEWS =================
       The live heading and its line, centred: the page's evidence starts one scroll
       down, so the hero only says what the page is. -->
  <section id="reviews" data-component="hero-centered" class="relative pt-32 sm:pt-36 lg:pt-44 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    ${dotField()}
    <div class="orb absolute orb-hero-teal"></div>
    <div class="orb absolute orb-hero-coral"></div>

    <div class="relative max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
      <h1 class="rv text-[clamp(2.2rem,4.8vw,3.6rem)] font-extrabold tracking-tightest leading-[1.05] mb-5 sm:mb-6">${penMark(esc(D.h1), 'Real Impact').replace(': ', ':<br class="hidden lg:inline"> ')}</h1>
      <p class="rv text-[15.5px] sm:text-[16px] lg:text-[17px] leading-relaxed text-ink-600 max-w-[64ch] mx-auto">${esc(D.lead)}</p>
    </div>
  </section>`;

/* ═══════════════ 02 · JOIN THOUSANDS — THE THREE PLATFORMS ═══════════════ */
const tile = t => {
  const figure = t.rating != null
    ? `<p class="text-[clamp(1.8rem,2.8vw,2.3rem)] font-extrabold tracking-tightest leading-none nums">${t.rating} <span class="text-ink-300 font-bold">/</span> ${t.max}</p>`
    : `<p class="flex items-center gap-2 text-[clamp(1.8rem,2.8vw,2.3rem)] font-extrabold tracking-tightest leading-none nums">${ico(I.download, '#06748A', 22)}${t.downloads}</p>`;
  return `          <a href="${t.url}" rel="nofollow noopener" class="group flex flex-col gap-4 rounded-2xl sm:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 hover:ring-black/10 transition-shadow duration-300">
            <span class="flex items-center justify-between gap-3">
              <span class="text-[14px] sm:text-[14.5px] font-bold tracking-tight">${NAME[t.key]}</span>
              <span class="text-ink-300 group-hover:text-ink-600 transition-colors duration-300">${ico(I.external, 'currentColor', 16)}</span>
            </span>
            <span class="flex items-center gap-2.5">${stars(t.stars)}${t.reviewsCount ? `<span class="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-600 nums">${ico(I.message, '#6B7280', 13)}${t.reviewsCount}</span>` : ''}</span>
            ${figure}
          </a>`;
};

const section2 = () => `  <!-- ================= 02 · JOIN THOUSANDS =================
       The three platforms as rating tiles, each a link to the platform. The live tiles
       are logos with numbers; here the platform is named, the stars are the system's,
       and the Marketplace tile's two bare numbers each carry an icon — a review bubble,
       a download arrow — in place of a label the live page does not have either. -->
  <section id="join-thousands" data-component="rating-tiles" class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
        <h2 class="${H2}">${esc(D.trust.title)}</h2>
        <p class="${INTRO} max-w-[62ch]">${esc(D.trust.text)}</p>
      </div>
      <div class="rv grid sm:grid-cols-3 gap-3 sm:gap-4">
${D.trust.tiles.map(tile).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ A PLATFORM — SUMMARY, FEATURED QUOTE, CARDS ═══════════════ */
const initial = n => esc([...n.trim()][0].toUpperCase());
const card = (r, i) => `          <figure data-review class="${i >= STEP ? 'more-later ' : ''}flex flex-col rounded-2xl sm:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 outline-none">
            <div class="mb-4"><span class="rt" role="img" aria-label="${r.score} out of 5"><span style="width:${r.score / 5 * 100}%"></span></span></div>
            <blockquote class="flex-1">
              <h3 class="text-[15px] sm:text-[15.5px] font-bold tracking-tight mb-1.5">${esc(r.title)}</h3>
${r.text.map(p => `              <p class="${BODY} text-ink-600 mt-1.5 first-of-type:mt-0">${esc(p)}</p>`).join('\n')}
            </blockquote>
            <figcaption class="mt-5 pt-4 border-t border-ink-100 flex items-center gap-2.5">
              <span class="shrink-0 w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center text-[12.5px] font-bold text-ink-600" aria-hidden="true">${initial(r.name)}</span>
              <span class="min-w-0 text-[13px] sm:text-[13.5px] font-semibold text-ink-800 truncate">${esc(r.name)}</span>
            </figcaption>
          </figure>`;

const platform = (key, bg) => {
  const P = D[key];
  return `  <!-- ================= ${NAME[key].toUpperCase()} =================
       The platform's summary (rating, "Based on N reviews", the text rating where the
       live page has one) and its featured quote on one dark card, then every card the
       live page carries, ${STEP} at a time. -->
  <section id="${key}-reviews" data-component="review-wall" class="relative py-16 sm:py-24 lg:py-32 ${bg}">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">

      <div data-surface="dark" class="rv relative overflow-hidden rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-ink-950 text-white p-6 sm:p-8 lg:p-12 mb-10 sm:mb-12 lg:mb-14">
        <div class="orb absolute w-[520px] h-[520px] -right-40 -top-56 bg-[rgba(243,111,90,.16)]"></div>
        <div class="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-14 items-end">
          <figure>
            <span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-white/10 ring-1 ring-white/15 items-center justify-center mb-5 lg:mb-6">${ico(I.quote, '#F79482', 18)}</span>
            <p class="text-[14px] sm:text-[15px] font-bold tracking-tight text-white/60 mb-2">${esc(P.featured.title)}</p>
            <blockquote class="${P.featured.text.length > 140   /* a paragraph, not a line: quote size, not headline size */
    ? 'text-[clamp(1.05rem,1.6vw,1.3rem)] font-semibold leading-[1.5] max-w-[62ch]'
    : 'text-[clamp(1.35rem,2.4vw,2rem)] font-bold leading-[1.25] max-w-[40ch]'} tracking-tight">${esc(P.featured.text)}</blockquote>
          </figure>
          <div class="lg:justify-self-end grid gap-3 lg:text-right">
            <p class="text-[13px] font-bold tracking-tight text-white/60">${NAME[key]}</p>
            <div class="flex lg:justify-end items-center gap-3">${stars(P.stars, true)}<span class="text-[clamp(1.6rem,2.6vw,2.1rem)] font-extrabold tracking-tightest leading-none nums">${P.rating} <span class="text-white/35 font-bold">/</span> ${P.max}</span></div>
            <p class="flex flex-wrap lg:justify-end items-center gap-x-3 gap-y-1 text-[13.5px] sm:text-[14px] text-white/70">
              <span>Based on <a href="${P.url}" rel="nofollow noopener" class="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white transition-colors duration-300 nums">${P.count} reviews</a></span>${P.textRating ? `
              <span class="w-1 h-1 rounded-full bg-white/30" aria-hidden="true"></span>
              <span class="font-semibold text-white">${esc(P.textRating)}</span>` : ''}
            </p>
          </div>
        </div>
      </div>

      <div data-show-more="${STEP}">
        <h2 class="rv ${H2} mb-8 sm:mb-10">${esc(P.heading)}</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-start">
${P.reviews.map(card).join('\n')}
        </div>
        <div class="mt-8 sm:mt-10 flex justify-center">
          <button type="button" data-show-more-btn class="btn-press inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-ink-100 ring-1 ring-black/10 transition-colors duration-300 text-ink-900 text-[13.5px] sm:text-[14.5px] font-semibold px-6 py-3">
            ${esc(P.showMore)}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>
      </div>
    </div>
  </section>`;
};

/* ═══════════════ VIDEO REVIEWS — THE DARK ACT ═══════════════ */
const section4 = () => `  <!-- ================= VIDEO REVIEWS =================
       Four people on camera, between the two platforms: the dark act. Each is YouTube's
       own still under a play button — a link to the video, and with site.js a
       click-to-play facade (module video). -->
  <section id="video-reviews" data-component="video-reviews" data-surface="dark" class="relative py-16 sm:py-24 lg:py-28 bg-ink-950 text-white overflow-hidden">
    <div class="orb absolute w-[640px] h-[640px] -left-48 -top-56 bg-[rgba(44,195,219,.16)]"></div>
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
        <h2 class="${H2}">${esc(D.videos.title)}</h2>
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/60">${esc(D.videos.text)}</p>
      </div>
      <div class="rv grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
${D.videos.items.map(v => `        <figure class="rounded-2xl sm:rounded-3xl bg-white/[.06] ring-1 ring-white/10 overflow-hidden">
          <a href="https://www.youtube.com/watch?v=${v.youtube}" rel="noopener" data-video="${v.youtube}" data-video-title="${attr(v.name + ': ' + v.line)}" aria-label="${attr(v.name + ': ' + v.line)}" class="relative block bg-ink-900">
            <img src="https://i.ytimg.com/vi/${v.youtube}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360" class="vf-thumb opacity-90">
            <span class="vf-play absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 text-ink-900 flex items-center justify-center shadow-diffuse">${ico(I.play, 'currentColor', 18)}</span>
          </a>
          <figcaption class="p-5 sm:p-6">
            <p class="text-[15.5px] sm:text-[16px] font-bold tracking-tight">${esc(v.name)}</p>
            <p class="mt-1 ${BODY} text-white/60">${esc(v.line)}</p>
          </figcaption>
        </figure>`).join('\n')}
      </div>
    </div>
  </section>`;

/* check-testimonials.js reads the data itself; requiring this file writes nothing */
/* testimonials-v2.js (the illustrated version) reuses the review walls and the videos */
module.exports = { D, NAME, platform, section4 };
if (require.main !== module) return;

const sections = [section1(), section2(), platform('trustpilot', 'bg-[#F7FAFC]'), section4(), platform('sitejabber', 'bg-[#F7FAFC]')];
const html = page.render({ title: esc(D.title), meta: D.meta, canonical: 'https://plagiarismsearch.com/testimonials', sections });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' + count(/<h2\b/g) + ' h2, ' +
            count(/<h3\b/g) + ' h3 (review titles), ' + count(/more-later/g) + ' behind "Show more"');
