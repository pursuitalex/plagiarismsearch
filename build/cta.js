/* The closing CTA band — the one before the footer, on every page that has one.

   Single source so the band cannot drift page to page. index-v2.html established it and
   still carries its own inline copy of these rules; this module is where new pages get
   them, and where the recipe is written down.

   THE BAND HAS FOUR PARTS, and all four are load-bearing:

   1. DOT FIELD. An SVG pattern, 22px cell, a 2×2 rounded square in #DAE7ED. It is what
      keeps the band from reading as an empty coloured rectangle — the section is mostly
      air, and the dots give that air a texture to sit on. Rendered as <pattern> rather
      than a repeating background-image so it stays crisp at any zoom and costs one
      rasterisation. It must sit UNDER the glows: dots over glow reads as dirt on glass.

   2. TWO GLOWS, warm upper-left and cool lower-right. Masked gradients on a solid fill,
      never blur() — the project measured blur filters as the single biggest source of
      jank and replaced all thirteen orbs with masks. Every knob is a custom property on
      #cta-* so a page tunes numbers, not selectors, and the two media queries below are
      not optional: the warm glow is 1138px wide, which on a 390px phone is three
      viewports of coral washing the whole screen.

   3. ONE RING MARK in the heading. The closing act loops a word instead of underlining
      it — same trick as the pen mark, longer path, slower draw, and it waits until the
      word is well inside the viewport (top 75%) because it is the last thing the page
      says. One per heading, like the pen mark: it is emphasis, not decoration.

   4. The heading runs at HERO scale here, clamp(2.4rem,5.5vw,4.35rem), which is the one
      place a non-hero heading is allowed to. DESIGN.md records why: a closing CTA is
      deliberately roomier than a section.

   Reduced motion: both the ring colour and its path are scripted, so the CSS fallback is
   mandatory or the emphasis simply vanishes for anyone who asked the site to stop moving.
*/

/* ── 1 + 2 · the background layer ─────────────────────────────────────────────
   `id` scopes the pattern so two bands on one page cannot collide over the same
   fragment reference. Returns the absolutely-positioned layer; the section itself
   supplies `relative overflow-hidden`. */
const background = (id = 'cta') => `      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <svg class="absolute inset-0 w-full h-full" aria-hidden="true">
          <defs>
            <pattern id="${id}Dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <rect width="2" height="2" rx="0.65" fill="#DAE7ED"></rect>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#${id}Dots)"></rect>
        </svg>
        <div id="${id}GlowWarm" class="orb"></div>
        <div id="${id}GlowCool" class="orb"></div>
      </div>`;

/* ── 3 · the ring mark ────────────────────────────────────────────────────────
   Applied at render, never stored in the approved-copy object: the briefs freeze the
   heading as one plain string, and every page checker compares it with tags stripped.

   The loop is drawn for a word of about ten characters — "plagiarism" on the homepage.
   The SVG is sized in percentages of the span, so the viewBox stretches to whatever it
   wraps; a much shorter or much longer phrase distorts the loop into an egg. Pick a
   fragment near that length rather than rescaling the path. */
const ringMark = (text, phrase) => {
  const svg = '<svg class="ring-mark absolute pointer-events-none" viewBox="0 0 230 100" fill="none" aria-hidden="true" style="left:-9%; top:-26%; width:118%; height:152%; transform:rotate(-2deg);">' +
    '<path class="ring-path" d="M30,62 C22,30 78,8 128,10 C182,12 216,32 212,58 C207,86 142,96 88,92 C44,88 18,76 26,50 C30,36 48,24 66,20" ' +
    'stroke="#F36F5A" stroke-opacity=".5" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" opacity="0"/></svg>';
  if (!text.includes(phrase)) throw new Error('ringMark: "' + phrase + '" not in "' + text + '"');
  return text.replace(phrase, `<span class="ring-word relative inline-block">${phrase}${svg}</span>`);
};

/* ── 2 · the glow knobs ───────────────────────────────────────────────────────
   Numbers carried over from index-v2 unchanged, including both breakpoint steps. */
const style = (id = 'cta') => `
  /* ===== closing CTA · one place for every knob — see build/cta.js ===== */
  #${id} {
    --cta-bg: #F2FCFC;
    /* warm, upper left */
    --cta-o1-rgb: 243,111,90;   --cta-o1-alpha: .25;
    --cta-o1-w: 1138px;         --cta-o1-h: 1040px;
    --cta-o1-x: -22.2%;         --cta-o1-y: -546px;
    --cta-o1-mid: 54.1%;        --cta-o1-end: 83.2%;
    /* cool, lower right */
    --cta-o2-rgb: 13,168,194;   --cta-o2-alpha: .15;
    --cta-o2-w: 954px;          --cta-o2-h: 950px;
    --cta-o2-x: 74.2%;          --cta-o2-y: 374px;
    --cta-o2-mid: 65%;          --cta-o2-end: 100%;
    background-color: var(--cta-bg);
  }
  #${id}GlowWarm { width:var(--cta-o1-w); height:var(--cta-o1-h); left:var(--cta-o1-x); top:var(--cta-o1-y);
    background:rgba(var(--cta-o1-rgb), var(--cta-o1-alpha));
    -webkit-mask-image:radial-gradient(circle closest-side, rgba(0,0,0,1) 0%, rgba(0,0,0,.5) var(--cta-o1-mid), transparent var(--cta-o1-end));
            mask-image:radial-gradient(circle closest-side, rgba(0,0,0,1) 0%, rgba(0,0,0,.5) var(--cta-o1-mid), transparent var(--cta-o1-end)); }
  #${id}GlowCool { width:var(--cta-o2-w); height:var(--cta-o2-h); left:var(--cta-o2-x); top:var(--cta-o2-y);
    background:rgba(var(--cta-o2-rgb), var(--cta-o2-alpha));
    -webkit-mask-image:radial-gradient(circle closest-side, rgba(0,0,0,1) 0%, rgba(0,0,0,.5) var(--cta-o2-mid), transparent var(--cta-o2-end));
            mask-image:radial-gradient(circle closest-side, rgba(0,0,0,1) 0%, rgba(0,0,0,.5) var(--cta-o2-mid), transparent var(--cta-o2-end)); }

  /* tablet — about three quarters of the desktop figure */
  @media (max-width:1023px) {
    #${id} {
      --cta-o1-w: 840px;  --cta-o1-h: 770px;
      --cta-o1-x: -28%;   --cta-o1-y: -400px;
      --cta-o2-w: 700px;  --cta-o2-h: 700px;
      --cta-o2-x: 64%;    --cta-o2-y: 300px;
    }
  }
  /* phone — half the size, softer, hard against the edges so the middle stays readable */
  @media (max-width:639px) {
    #${id} {
      --cta-o1-alpha: .20;
      --cta-o1-w: 560px;  --cta-o1-h: 520px;
      --cta-o1-x: -38%;   --cta-o1-y: -250px;
      --cta-o2-alpha: .12;
      --cta-o2-w: 470px;  --cta-o2-h: 470px;
      --cta-o2-x: 52%;    --cta-o2-y: 210px;
    }
  }

  /* the ring's reduced-motion fallback is mandatory: colour and path are both scripted */
  .no-motion .ring-word { color:#DC5A45; }
  .no-motion .ring-path { opacity:1; }`;

/* ── 3 · the ring animation ───────────────────────────────────────────────────
   `once: true` and `top 75%`: the band is the last thing on the page, so the mark
   should land while the reader is looking at it, not before they arrive. */
const script = `
  /* ring mark — the closing act loops a word instead of underlining it. Same trick as
     the pen mark, longer path, and it waits until the word is well inside the viewport. */
  gsap.utils.toArray('.ring-word').forEach(word => {
    const path = word.querySelector('.ring-path');
    if (!path) return;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.timeline({ scrollTrigger: { trigger: word, start: 'top 75%', once: true } })
      .to(word, { color: '#DC5A45', duration: .4, ease: 'power2.out' })
      .set(path, { opacity: 1 }, .15)
      .to(path, { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut' }, .15);
  });`;

/* the heading scale the band is allowed, and only here */
const HEADING = 'text-[clamp(2.4rem,5.5vw,4.35rem)] font-extrabold tracking-tightest leading-[1.02]';

module.exports = { background, ringMark, style, script, HEADING };
