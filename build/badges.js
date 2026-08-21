/* Build site/originality-badges.html from the live page, styled to this design system.

   Same contract as build/legal.js: the text and the artwork are the client's own and are
   carried over unchanged. The images were pulled into site/assets/img/badges/ keeping the
   language folders the source uses, so a badge's address stays predictable and nothing
   depends on the live site at render time.

   Refresh the source deliberately:
     curl -sL -A "Mozilla/5.0" https://plagiarismsearch.com/originality-badges \
       -o build/legal/originality-badges.html
     node build/badges.js  →  node build/shell.js  →  node build/check.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const SRC  = path.join(__dirname, 'legal', 'originality-badges.html');

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'de', label: 'German' },
  { code: 'pt', label: 'Portuguese' },
];

/* The eight designs, in the order the source lays them out. Row one is the wide banners,
   row two the square badges; the names are the source's own filenames. */
const GROUPS = [
  { row: 1, key: 'protected-light',       name: 'Protected',            size: '200 &times; 25' },
  { row: 1, key: 'originality-shield',    name: 'Originality shield',   size: '140 &times; 36' },
  { row: 1, key: 'protected-locked',      name: 'Protected &middot; locked', size: '140 &times; 40' },
  { row: 1, key: 'smart-protection',      name: 'Smart protection',     size: '160 &times; 40' },
  { row: 2, key: 'badge-originality',     name: 'Originality',          size: '90 &times; 90' },
  { row: 2, key: 'think-before-you-copy', name: 'Think before you copy', size: '90 &times; 90' },
  { row: 2, key: 'copy-warning-circle',   name: 'Content monitoring',   size: '90 &times; 90' },
  { row: 2, key: 'monitored-secured',     name: 'Monitored &amp; secured', size: '90 &times; 90' },
];

const src = fs.readFileSync(SRC, 'utf8');

/* ── the document, by div depth ───────────────────────────────────────────── */
let m = null;
const opens = /<div\s+class="([^"]*)"[^>]*>/gi;
let o;
while ((o = opens.exec(src))) {
  if (o[1].split(/\s+/).includes('static-page-originality-badges')) { m = o; break; }
}
if (!m) throw new Error('no .static-page-originality-badges container');
let depth = 1, end = -1;
const tag = /<\/?div\b[^>]*>/gi;
tag.lastIndex = m.index + m[0].length;
let t;
while ((t = tag.exec(src))) {
  depth += t[0][1] === '/' ? -1 : 1;
  if (depth === 0) { end = t.index; break; }
}
const doc = src.slice(m.index + m[0].length, end);

/* ── copy, taken as written ───────────────────────────────────────────────── */
const h1 = (doc.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [, ''])[1].replace(/<[^>]+>/g, '').trim();
const paras = [...doc.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
  .map(p => p[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
  .filter(Boolean);
if (paras.length < 3) throw new Error('expected three paragraphs, found ' + paras.length);

/* ── every badge, per language, with the alt and title the source gives it ─── */
const badges = {};
/* All four language blocks share one <section>, so the closing tag is not the boundary
   — the next block's opening div is. */
const MARK = '<div class="marks-examples-content ';
const chunks = doc.split(MARK).slice(1);
LANGS.forEach(l => {
  const chunk = chunks.find(c => c.slice(0, 40).split('"')[0].split(/\s+/).includes(l.code));
  if (!chunk) throw new Error('no badge block for ' + l.code);
  badges[l.code] = [...chunk.matchAll(/<img([^>]+)>/gi)].map(img => {
    const at = n => ((img[1].match(new RegExp(n + '="([^"]*)"')) || [, ''])[1]);
    return { src: at('src'), file: at('src').split('/').pop(), w: at('width'), h: at('height'),
             alt: at('alt'), title: at('title') };
  /* The last chunk runs to the end of the page and picks up the modal's own preview
     image, so take only what lives in this language's folder. */
  }).filter(b => b.src.includes('/originality-badges/' + l.code + '/'));
  const n = badges[l.code].length;
  if (n !== 32) throw new Error(l.code + ': expected 32 badges, found ' + n);
});

/* ── the head, borrowed so the tailwind config stays one config ───────────── */
const donor = fs.readFileSync(path.join(SITE, 'help-center.html'), 'utf8');
const head = donor.slice(0, donor.indexOf('<body'));
const bodyTag = donor.slice(donor.indexOf('<body'), donor.indexOf('>', donor.indexOf('<body')) + 1);

/* A badge sits on the colour it was drawn for: the white variants disappear on white,
   the black ones on black, so each plate is tinted to show its own artwork honestly. */
const plate = file =>
  /-white\./.test(file) ? 'bg-ink-800'
  : /-black\./.test(file) ? 'bg-ink-100'
  : /-grey\./.test(file) ? 'bg-white ring-1 ring-black/5'
  : 'bg-white ring-1 ring-black/5';

const card = (b, lang) => `              <button type="button" class="badge-pick group flex flex-col items-center justify-center gap-3 rounded-2xl p-4 sm:p-5 ${plate(b.file)} transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                data-file="assets/img/badges/${lang}/${b.file}" data-w="${b.w}" data-h="${b.h}"
                data-alt="${b.alt}" data-title="${b.title}" data-lang="${lang}">
                <img src="assets/img/badges/${lang}/${b.file}" alt="${b.alt}" title="${b.title}" width="${b.w}" height="${b.h}" loading="lazy" decoding="async" class="max-w-full h-auto">
                <span class="text-[10.5px] font-semibold tabular-nums ${/-white\./.test(b.file) ? 'text-white/50' : 'text-ink-400'}">${b.w} &times; ${b.h}</span>
              </button>`;

const group = (g, lang) => {
  const mine = badges[lang].filter(b => b.file.startsWith(g.key + '-'));
  if (!mine.length) return '';
  return `          <div class="mb-8 sm:mb-10">
            <div class="flex items-baseline gap-3 mb-3 sm:mb-4">
              <h3 class="text-[14px] sm:text-[15px] font-bold tracking-tight">${g.name}</h3>
              <span class="text-[11.5px] font-medium text-ink-400 tabular-nums">${g.size} px</span>
              <span class="h-px flex-1 bg-ink-100"></span>
            </div>
            <div class="grid grid-cols-1 ${g.row === 1 ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'} gap-3 sm:gap-4">
${mine.map(b => card(b, lang)).join('\n')}
            </div>
          </div>`;
};

const panel = l => `        <div class="badge-lang${l.code === 'en' ? '' : ' hidden'}" data-lang="${l.code}">
${GROUPS.map(g => group(g, l.code)).filter(Boolean).join('\n')}
        </div>`;

const html = head.replace(/<title>[\s\S]*?<\/title>/, '<title>Trust Badges for Website | PlagiarismSearch</title>') + `
${bodyTag}
<div class="grain"></div>

<header></header>

<main>
  <!-- The badge gallery. Artwork and copy are the site's own, carried over unchanged;
       the images live in assets/img/badges/<lang>/ so nothing here calls the live site.

       Every badge is a button rather than an image in a link: clicking one hands you the
       embed code, which is an action on this page, not a journey to another. -->
  <section class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 lg:pb-28 bg-white">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="orb w-[560px] h-[560px] bg-teal-500/10 -left-44 -top-40"></div>
    </div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">

      <div class="max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        <div class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400 mb-4 lg:mb-5">Resources</div>
        <h1 class="text-[clamp(2.1rem,4vw,3rem)] font-extrabold tracking-tightest leading-[1.06] mb-4 lg:mb-5">${h1}</h1>
        <p class="text-[15.5px] sm:text-[16px] lg:text-[17px] text-ink-600 leading-relaxed">${paras[0]}</p>
      </div>

      <!-- Two ways to hand over the embed code, side by side so they can be compared:
           a popup over the gallery, which is what the live site does, or a panel below
           it. The choice is a review control and goes once one of them wins. -->
      <div class="flex flex-wrap items-center gap-2 mb-5 sm:mb-6">
        <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400 mr-1">Code opens</span>
        <button type="button" class="mode-tab rounded-full px-4 py-2 text-[13px] sm:text-[13.5px] font-semibold bg-ink-900 text-white transition-colors duration-300" data-mode="popup">In a popup</button>
        <button type="button" class="mode-tab rounded-full px-4 py-2 text-[13px] sm:text-[13.5px] font-semibold bg-ink-100 text-ink-600 hover:bg-ink-200 transition-colors duration-300" data-mode="panel">In a panel below</button>
      </div>

      <!-- language: a row of pills rather than a select, since there are four of them
           and they are the page's main control -->
      <div class="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
        <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400 mr-1">Banner language</span>
${LANGS.map(l => `        <button type="button" class="badge-tab rounded-full px-4 py-2 text-[13px] sm:text-[13.5px] font-semibold transition-colors duration-300 ${l.code === 'en' ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}" data-lang="${l.code}">${l.label}</button>`).join('\n')}
      </div>

${LANGS.map(panel).join('\n')}

      <!-- the embed code, revealed by picking a badge rather than living in a modal -->
      <div id="badgeEmbed" class="hidden mt-10 sm:mt-12 rounded-3xl sm:rounded-[28px] bg-ink-50 p-5 sm:p-6 lg:p-7">
        <div class="flex flex-wrap items-baseline gap-3 mb-4">
          <h2 class="text-[16px] sm:text-[17px] font-bold tracking-tight">Embed this badge</h2>
          <span id="badgeSize" class="text-[12px] font-semibold text-ink-400 tabular-nums"></span>
        </div>
        <p class="text-[14px] sm:text-[14.5px] text-ink-600 leading-relaxed mb-4">${paras[1]}</p>
        <textarea id="badgeCode" readonly rows="3" class="w-full rounded-2xl bg-white ring-1 ring-black/5 p-4 text-[12.5px] font-mono text-ink-700 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"></textarea>
        <div class="flex flex-wrap items-center gap-3 mt-4">
          <button type="button" id="badgeCopy" class="btn-press inline-flex items-center gap-2 rounded-full bg-ink-900 hover:bg-ink-800 text-white px-5 py-2.5 text-[13.5px] font-semibold transition-colors duration-300">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span id="badgeCopyLabel">Copy code</span>
          </button>
          <p class="text-[13px] text-ink-500">${paras[2]}</p>
        </div>
      </div>

    </div>
  </section>
  <!-- The popup. Same copy and the same generated markup as the panel; only the way it
       reaches you differs. Closes on the backdrop, on the button and on Escape, and puts
       focus back on the badge that opened it. -->
  <div id="badgeModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="badgeModalTitle">
    <div class="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" data-close></div>
    <div class="relative w-full max-w-[560px] max-h-[88vh] overflow-y-auto rounded-3xl sm:rounded-[28px] bg-white shadow-diffuse-lg p-6 sm:p-8 text-center">
      <button type="button" data-close aria-label="Close" class="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-ink-400 hover:bg-ink-100 hover:text-ink-900 transition-colors duration-300">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>

      <h2 id="badgeModalTitle" class="text-[19px] sm:text-[22px] font-extrabold tracking-tightest leading-tight mb-3">Embed this badge on your website</h2>
      <p class="text-[14px] sm:text-[14.5px] text-ink-600 leading-relaxed max-w-[46ch] mx-auto">${paras[1]}</p>

      <div class="my-6 pt-6 border-t border-ink-100">
        <div id="modalPlate" class="inline-flex items-center justify-center rounded-2xl px-6 py-5"></div>
        <p id="modalSize" class="mt-3 text-[13px] font-semibold text-ink-500 tabular-nums"></p>
      </div>

      <textarea id="modalCode" readonly rows="3" class="w-full rounded-2xl bg-ink-50 ring-1 ring-black/5 p-4 text-[12.5px] font-mono text-left text-ink-700 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"></textarea>

      <button type="button" id="modalCopy" class="btn-press inline-flex items-center gap-2 rounded-full bg-ink-900 hover:bg-ink-800 text-white px-5 py-2.5 mt-4 text-[13.5px] font-semibold transition-colors duration-300">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        <span id="modalCopyLabel">Copy code</span>
      </button>

      <p class="mt-6 pt-5 border-t border-ink-100 text-[13px] text-ink-500">${paras[2]}</p>
    </div>
  </div>
</main>

<footer></footer>

<script>
(() => {
  const tabs = [...document.querySelectorAll('.badge-tab')];
  const panels = [...document.querySelectorAll('.badge-lang')];
  const embed = document.getElementById('badgeEmbed');
  const code = document.getElementById('badgeCode');
  const size = document.getElementById('badgeSize');
  const copy = document.getElementById('badgeCopy');
  const label = document.getElementById('badgeCopyLabel');

  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => {
      const on = x === t;
      x.classList.toggle('bg-ink-900', on);
      x.classList.toggle('text-white', on);
      x.classList.toggle('bg-ink-100', !on);
      x.classList.toggle('text-ink-600', !on);
      x.classList.toggle('hover:bg-ink-200', !on);
    });
    panels.forEach(p => p.classList.toggle('hidden', p.dataset.lang !== t.dataset.lang));
    embed.classList.add('hidden');
  }));

  /* The embed code points at the live site, because a badge on someone else's page has
     to: a relative path would resolve against their domain, not ours. */
  const HOST = 'https://plagiarismsearch.com';
  /* One builder, two destinations: the panel and the popup show the same string, so
     whichever wins there is nothing to reconcile. */
  const buildCode = d => {
    const href = d.lang === 'en' ? HOST + '/' : HOST + '/' + d.lang + '/';
    return '<a href="' + href + '"><img src="' + HOST + '/files/images/originality-badges/'
      + d.lang + '/' + d.file.split('/').pop() + '" alt="' + d.alt + '" title="' + d.title
      + '" width="' + d.w + '" height="' + d.h + '"></a>';
  };

  const modal = document.getElementById('badgeModal');
  const mPlate = document.getElementById('modalPlate');
  const mSize = document.getElementById('modalSize');
  const mCode = document.getElementById('modalCode');
  const mCopy = document.getElementById('modalCopy');
  const mLabel = document.getElementById('modalCopyLabel');
  let mode = 'popup';
  let opener = null;

  document.querySelectorAll('.mode-tab').forEach(t => t.addEventListener('click', () => {
    mode = t.dataset.mode;
    document.querySelectorAll('.mode-tab').forEach(x => {
      const on = x === t;
      x.classList.toggle('bg-ink-900', on);
      x.classList.toggle('text-white', on);
      x.classList.toggle('bg-ink-100', !on);
      x.classList.toggle('text-ink-600', !on);
      x.classList.toggle('hover:bg-ink-200', !on);
    });
    embed.classList.add('hidden');
    closeModal();
  }));

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    if (opener) { opener.focus(); opener = null; }
  }
  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); });

  document.querySelectorAll('.badge-pick').forEach(b => b.addEventListener('click', () => {
    const d = b.dataset;
    const text = buildCode(d);
    const px = d.w + ' \\u00d7 ' + d.h + ' pixels';

    if (mode === 'panel') {
      code.value = text;
      size.textContent = px;
      embed.classList.remove('hidden');
      embed.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      label.textContent = 'Copy code';
      return;
    }

    opener = b;
    /* the badge keeps the plate it was shown on, or a white variant vanishes here too */
    mPlate.className = 'inline-flex items-center justify-center rounded-2xl px-6 py-5 ' +
      [...b.classList].filter(c => /^bg-|^ring/.test(c)).join(' ');
    mPlate.innerHTML = '';
    mPlate.appendChild(b.querySelector('img').cloneNode(true));
    mSize.textContent = px;
    mCode.value = text;
    mLabel.textContent = 'Copy code';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    mCopy.focus();
  }));

  mCopy.addEventListener('click', async () => {
    mCode.select();
    try { await navigator.clipboard.writeText(mCode.value); }
    catch { document.execCommand('copy'); }
    mLabel.textContent = 'Copied';
    setTimeout(() => { mLabel.textContent = 'Copy code'; }, 1800);
  });

  copy.addEventListener('click', async () => {
    code.select();
    try { await navigator.clipboard.writeText(code.value); }
    catch { document.execCommand('copy'); }
    label.textContent = 'Copied';
    setTimeout(() => { label.textContent = 'Copy code'; }, 1800);
  });
})();
<\/script>
</body>
</html>
`;

fs.writeFileSync(path.join(SITE, 'originality-badges.html'), html);
const total = LANGS.reduce((n, l) => n + badges[l.code].length, 0);
console.log('  ok  site/originality-badges.html  ' + total + ' badges, ' +
            LANGS.length + ' languages, ' + GROUPS.length + ' designs');
