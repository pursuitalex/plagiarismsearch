/* The modal — one recipe for every popup on the site.

   The recipe is the badge popup's (build/badges.js), the site's first: a dimmed, blurred
   backdrop; a white card, rounded-3xl / 28px, shadow-diffuse-lg; a close button in the
   corner. It closes on the backdrop, the button and Escape, keeps Tab inside itself, and
   puts focus back where it came from.

     const modal = require('./modal');
     modal.shell({ id, title, body })   // the overlay, hidden until opened
     modal.card({ id, title, body })    // the card alone — the design-system page shows it inline
     modal.signup(copy)                 // body: the "See your full report" sign-up offer
     modal.script                       // [data-modal-open="id"] opens; [data-close] closes

   The overlay starts hidden and opens with .is-open, not with the hidden attribute, so the
   card can fade in. Below 640 it keeps the same centred card with a 16px gutter. */

const X = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';
const LOCK_OPEN = '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>';
const GIFT = '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>';
const MAIL = '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>';
const svg = (p, s, w = 1.75, extra = '') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${p}</svg>`;

/* the card: close button, then whatever the modal carries */
const card = ({ id, title, body, width = 440 }) => `<div class="md-card relative w-full max-w-[${width}px] max-h-[88vh] overflow-y-auto rounded-3xl sm:rounded-[28px] bg-white shadow-diffuse-lg px-6 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8 text-center">
      <button type="button" data-close aria-label="Close" class="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-ink-400 hover:bg-ink-100 hover:text-ink-900 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-500">
        ${svg(X, 18, 1.9)}
      </button>
${body(`${id}-title`, title)}
    </div>`;

/* the overlay around it */
const shell = o => `  <div id="${o.id}" class="md fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="${o.id}-title" hidden>
    <div class="md-backdrop absolute inset-0 bg-ink-950/60 backdrop-blur-sm" data-close></div>
    ${card(o)}
  </div>`;

/* ── the sign-up offer: after a guest check, the way to the full report ─────────────
   copy: { title, lead: [link, rest], signupHref, cta, secondary, secondaryHref,
           bonus, offers: [{ how, get, icon: 'mail' | 'google' }] }               */
const signup = (S, root = '') => (titleId, title) => `      <span class="inline-flex w-12 h-12 rounded-2xl bg-teal-50 ring-1 ring-teal-100 items-center justify-center mb-4 sm:mb-5 text-teal-600">${svg(LOCK_OPEN, 22)}</span>
      <h2 id="${titleId}" class="text-[21px] sm:text-[24px] font-extrabold tracking-tightest leading-tight mb-2.5">${title}</h2>
      <p class="text-[13.5px] sm:text-[14.5px] text-ink-600 leading-relaxed max-w-[38ch] mx-auto"><a href="${S.signupHref}" class="font-semibold text-ink-900 underline decoration-ink-300 underline-offset-4 hover:decoration-ink-900 transition-colors duration-300">${S.lead[0]}</a> ${S.lead[1]}</p>

      <div class="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
        <a href="${S.secondaryHref}" class="btn-press inline-flex items-center justify-center h-11 px-5 rounded-full bg-white ring-1 ring-ink-200 hover:ring-ink-300 hover:bg-ink-50 text-ink-900 text-[14px] font-semibold transition-colors duration-300">${S.secondary}</a>
        <a href="${S.signupHref}" data-autofocus class="btn-press inline-flex items-center justify-center h-11 px-6 rounded-full bg-ink-900 hover:bg-ink-800 text-white text-[14px] font-semibold transition-colors duration-300">${S.cta}</a>
      </div>

      <div class="mt-7 pt-6 border-t border-ink-100 text-left">
        <p class="flex items-center justify-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-ink-500 mb-3.5">
          <span class="text-orange-600">${svg(GIFT, 16, 1.9)}</span>${S.bonus}
        </p>
        <ul class="space-y-2">
${S.offers.map(o => `          <li class="flex items-center gap-3 rounded-2xl bg-ink-50 ring-1 ring-black/[.04] px-3.5 py-3">
            <span class="w-9 h-9 shrink-0 rounded-xl bg-white ring-1 ring-black/5 flex items-center justify-center text-ink-600">${o.icon === 'google'
              ? `<img src="${root}assets/svg/google-icon.svg" alt="" aria-hidden="true" class="w-[18px] h-[18px]">`
              : svg(MAIL, 17)}</span>
            <span class="min-w-0 flex-1">
              <span class="block text-[13.5px] font-bold tracking-tight text-ink-900">${o.how}</span>
              <span class="block text-[12.5px] text-ink-600 leading-snug">${o.get}</span>
            </span>
          </li>`).join('\n')}
        </ul>
      </div>`;

const style = `  /* ---------- modal (build/modal.js) ---------- */
  .md { transition:visibility 0s linear .2s; }
  .md[hidden] { display:flex; visibility:hidden; pointer-events:none; }
  .md-backdrop { opacity:0; transition:opacity .2s ease; }
  .md-card { opacity:0; transform:translateY(8px) scale(.98); transition:opacity .2s ease, transform .25s cubic-bezier(.32,.72,0,1); }
  .md.is-open { transition:none; }
  .md.is-open .md-backdrop { opacity:1; }
  .md.is-open .md-card { opacity:1; transform:none; }
  @media (prefers-reduced-motion: reduce) { .md-card { transform:none; transition:opacity .15s ease; } }`;

/* open, close, trap, return focus, lock the page behind */
const script = `
  /* modals (build/modal.js) */
  (function () {
    var opener = null, open = null;
    var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';
    function show(m, from) {
      opener = from || document.activeElement; open = m;
      m.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      /* read a layout value so the closed styles apply first and the card animates in,
         then focus once .is-open has made it visible — a hidden element takes no focus */
      void m.offsetWidth;
      m.classList.add('is-open');
      (m.querySelector('[data-autofocus]') || m.querySelector(FOCUSABLE)).focus();
    }
    function hide() {
      if (!open) return;
      var m = open; open = null;
      m.classList.remove('is-open');
      m.hidden = true;
      document.documentElement.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    }
    document.addEventListener('click', function (e) {
      var o = e.target.closest('[data-modal-open]');
      if (o) { e.preventDefault(); show(document.getElementById(o.getAttribute('data-modal-open')), o); return; }
      if (open && e.target.closest('[data-close]') && open.contains(e.target)) hide();
    });
    document.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') { hide(); return; }
      if (e.key !== 'Tab') return;
      var f = [].slice.call(open.querySelectorAll(FOCUSABLE)).filter(function (x) { return x.offsetParent !== null; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  })();`;

/* the offer's copy, as the product shows it today */
const SIGNUP = {
  title: 'See Your Full Report',
  lead: ['Sign up now', 'to run a full plagiarism &amp; AI scan, see all sources, and enable downloads &amp; sharing.'],
  signupHref: 'account.html',
  cta: 'Sign Up Free',
  secondary: 'See Prices',
  secondaryHref: 'prices-v2.html',
  bonus: 'Bonus',
  offers: [
    { how: 'Register for free', get: 'Get 1,000 plagiarism words + 1,000 AI words', icon: 'mail' },
    { how: 'Sign up with Google', get: 'Get 5,000 plagiarism words + 1,000 AI words', icon: 'google' },
  ],
};

module.exports = { shell, card, signup, style, script, SIGNUP };
