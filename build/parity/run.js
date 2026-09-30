/* Parity harness — any master page, approved version vs migrated version.

   The approved version is the page as committed at REF (the last commit by default, or
   --ref=<commit>), served from build/parity/out/baseline/. The migrated
   version is the page in site/ now. A real Chrome (installed, via playwright-core) at
   375 / 768 / 1440, device scale 1.

     0  CSS         the CSS the Play CDN generated for the approved page is contained, rule
                    by rule, in the static tailwind.css (ours may add harmless prefixes)
     1  content     title, description, canonical, lang, and the text of <main>: identical
     2  pixels      full-page screenshots, exact (threshold 0), reduced motion
     3  geometry    every rendered element: box + 65 computed properties, reduced motion
     4  behaviour   whatever the page has — checker, report, FAQ, pricing periods, reveals,
                    pen and ring marks, back-to-top, focus rings on dark grounds, the phone
                    header — run identically on both, results compared; plus page extras
                    from build/parity/pages.js
     5  states      the migrated page with reduced motion, without JS, with GSAP blocked,
                    with site.js blocked: no content hidden, every FAQ answer reachable
     6  reuse       EVERY top-level [data-component] of <main> served alone in an empty page (the page's
                    own <head>, i.e. the shared assets, and nothing else): pixels and every
                    element vs the same section isolated in the full page, at three widths;
                    then its behaviour on its own

   Run:  node build/parity/run.js <page.html> [--quick]      (--quick: 1440 only, no reuse)
   Exit code 1 if anything differs. Output: build/parity/out/<page>/
*/
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright-core');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const postcss = require('postcss');
const { start } = require('./serve');

/* The approved state is the last commit: a refactor must not change what was committed.
   (The static-assets migration was checked against 04c8e24, the last page on the CDN,
   and the design-system page against db7d735: pass --ref= to rerun those comparisons.) */
const DEFAULT_REF = 'HEAD';
const ROOT = path.join(__dirname, '..', '..');
const FILE = process.argv[2];
if (!FILE) { console.error('usage: node build/parity/run.js <page.html> [--quick]'); process.exit(2); }
const QUICK = process.argv.includes('--quick');
/* --section=<name>: only the reuse test, only that section (a quick look while debugging) */
const ONLY = (process.argv.find(a => a.startsWith('--section=')) || '').slice('--section='.length);
const WIDTHS = QUICK ? [1440] : [375, 768, 1440];
const PORT = 4200 + Math.floor(Math.random() * 400);
const URL = `http://localhost:${PORT}/`;
const OUT = path.join(__dirname, 'out', FILE.replace(/\.html$/, ''));
fs.mkdirSync(OUT, { recursive: true });
const EXTRA = { ...(require('./pages')[FILE] || {}) };
/* a page approved after 04c8e24 (the design-system page) names its own approved commit */
/* --ref=<commit>: compare against another approved state (e.g. the commit before a design fix) */
const REF = (process.argv.find(a => a.startsWith('--ref=')) || '').slice('--ref='.length) || EXTRA.ref || DEFAULT_REF;
/* acceptances recorded against this baseline (build/parity/pages.js, byRef) */
Object.assign(EXTRA, (EXTRA.byRef || {})[REF] || {});

/* the approved page, from git */
const baseDir = path.join(__dirname, 'out', 'baseline');
fs.mkdirSync(baseDir, { recursive: true });
/* A baseline already on the static assets links /assets/css/… and /assets/js/…, which
   would resolve to the files in site/ now — both pages would load the same CSS and JS,
   and a change to them could never show. So the baseline's own site.css, tailwind.css
   and site.js (and ds.*) are taken from REF and its links pointed at those copies. */
{
  /* --from=<file>: the approved page had another name at REF (a v2 page before it took the v1 name) */
  const FROM = (process.argv.find(a => a.startsWith('--from=')) || '').slice('--from='.length) || FILE;
  let html = execFileSync('git', ['show', REF + ':site/' + FROM], { cwd: ROOT, maxBuffer: 64 << 20 }).toString();
  if (/(href|src)="\/assets\/(css|js)\//.test(html)) {
    for (const f of ['css/site.css', 'css/tailwind.css', 'css/ds.css', 'js/site.js', 'js/ds.js']) {
      let body;
      try { body = execFileSync('git', ['show', REF + ':site/assets/' + f], { cwd: ROOT, maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] }); }
      catch { continue; }                                   /* not in that commit */
      const to = path.join(baseDir, '__ref-assets', f);
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.writeFileSync(to, body);
    }
    html = html.replace(/(href|src)="\/assets\/(css|js)\//g, (m, a, k) => `${a}="/__base/__ref-assets/${k}/`);
  }
  fs.writeFileSync(path.join(baseDir, FILE), html);
}
const current = fs.readFileSync(path.join(ROOT, 'site', FILE), 'utf8');

/* the reuse pages: each section alone, under the page's own <head> */
/* The components are the top-level elements of <main> — a <section> usually, but a
   wrapper that holds sections of its own (the documentation guide) is one component too.
   Walked by depth, so nested sections stay inside their component; comments and script
   bodies (a JSON island may hold markup in its strings) are skipped whole. */
const sections = [];
const topLevel = [];
if (EXTRA.reuse !== false) {
  const mainOpen = current.match(/<main\b[^>]*>/);
  const main = current.slice(mainOpen.index + mainOpen[0].length, current.indexOf('</main>'));
  const VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/i;
  const re = /<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script>|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b(?:[^>"']|"[^"]*"|'[^']*')*?(\/?)>/g;
  let depth = 0, start = -1, open = '';
  for (const m of main.matchAll(re)) {
    if (m[2] === undefined) {                       /* a comment or a whole script */
      if (depth === 0 && m[0].startsWith('<script')) topLevel.push({ open: m[0], html: m[0] });
      continue;
    }
    if (m[1]) {
      if (--depth === 0) topLevel.push({ open, html: main.slice(start, m.index + m[0].length) });
    } else if (VOID.test(m[2]) || m[3]) {
      if (depth === 0) topLevel.push({ open: m[0], html: m[0] });
    } else {
      if (depth++ === 0) { start = m.index; open = m[0]; }
    }
  }
  if (depth !== 0) throw new Error('<main> does not balance: depth ' + depth);
  for (const t of topLevel) {
    const n = t.open.match(/\bdata-component="([^"]+)"/);
    if (n) sections.push({ name: n[1], html: t.html });
  }
}
const pageHead = current.slice(0, current.indexOf('</head>') + '</head>'.length);
const bodyTag = current.slice(current.indexOf('<body'), current.indexOf('>', current.indexOf('<body')) + 1);
const virtual = p => {
  const m = p.match(/^\/__reuse\/(.+)$/);
  if (!m) return;
  const s = sections.find(x => x.name === m[1]);
  return s && `${pageHead}\n${bodyTag}\n<main>\n${s.html}\n</main>\n</body>\n</html>\n`;
};

const results = [];
let failed = 0;
const ok = (group, label, pass, detail = '') => {
  results.push({ group, label, pass, detail });
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const THIRD = new Map();
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

async function open(browser, url, { width = 1440, reduced = false, js = true, block = [] } = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height: width < 700 ? 812 : 900 }, deviceScaleFactor: 1,
    reducedMotion: reduced ? 'reduce' : 'no-preference', javaScriptEnabled: js,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  /* Third-party files (Google Fonts, the Play CDN, GSAP on jsDelivr) are fetched once per run
     and replayed byte-identical to every page. Fetched live per page, a font subset could
     differ between the two loads, and text measured 0.02–0.05px apart, run to run. */
  await ctx.route(/^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.tailwindcss\.com|cdn\.jsdelivr\.net)\//, async route => {
    const u = route.request().url();
    if (!THIRD.has(u)) {
      const resp = await route.fetch();
      THIRD.set(u, { status: resp.status(), headers: resp.headers(), body: await resp.body() });
    }
    await route.fulfill(THIRD.get(u));
  });
  for (const pat of block) await page.route(pat, r => r.abort());
  await page.goto(URL + url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await sleep(600);
  /* An endless CSS animation (the pulsing dot) is caught at whatever phase the load
     happened to land on. For the measured states, stop each one on its first frame, in
     both pages alike. */
  if (reduced) await page.evaluate(() => document.getAnimations().forEach(a => {
    if (a.constructor.name === 'CSSAnimation' && a.effect && a.effect.getTiming().iterations === Infinity) { a.pause(); a.currentTime = 0; }
  }));
  return { ctx, page, errors };
}

function diffPng(bufA, bufB, name) {
  const a = PNG.sync.read(bufA), b = PNG.sync.read(bufB);
  if (a.width !== b.width || a.height !== b.height) return { size: `${a.width}×${a.height} vs ${b.width}×${b.height}`, px: -1 };
  const diff = new PNG({ width: a.width, height: a.height });
  const px = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0 });
  if (px) fs.writeFileSync(path.join(OUT, name + '.diff.png'), PNG.sync.write(diff));
  /* the largest difference in any one colour channel, 0–255 */
  let maxDelta = 0;
  if (px) for (let i = 0; i < a.data.length; i += 4)
    for (let c = 0; c < 3; c++) { const d = Math.abs(a.data[i + c] - b.data[i + c]); if (d > maxDelta) maxDelta = d; }
  return { size: `${a.width}×${a.height}`, px, maxDelta };
}

/* ── CSS rule index, formatting noise removed ──────────────────────────────── */
const normSel = s => s.replace(/['"]/g, '').split(',').map(x => x.trim().replace(/\s+/g, ' ')).sort().join(',');
const normVal = v => v.replace(/\s+/g, ' ').replace(/(^|[^0-9.])\.(\d)/g, '$10.$2').trim();
const ruleIndex = css => {
  const m = new Map();
  postcss.parse(css).walkRules(r => {
    const ctx = r.parent && r.parent.type === 'atrule' ? '@' + r.parent.name + ' ' + r.parent.params.replace(/\s+/g, '') + ' ' : '';
    const key = ctx + normSel(r.selector);
    const decls = [];
    r.walkDecls(d => decls.push(d.prop + ':' + normVal(d.value) + (d.important ? '!' : '')));
    m.set(key, (m.get(key) || []).concat(decls));
  });
  return m;
};

/* ── the snapshot ───────────────────────────────────────────────────────────── */
const PROPS = ['display', 'position', 'top', 'right', 'bottom', 'left', 'width', 'height',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'text-align', 'text-transform',
  'text-decoration-line', 'white-space', 'color', 'background-color', 'background-image', 'background-size', 'background-position',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-top-color', 'border-bottom-color',
  'border-top-left-radius', 'border-bottom-right-radius', 'box-shadow', 'outline-style', 'opacity', 'transform', 'filter',
  'backdrop-filter', 'mask-image', 'z-index', 'overflow-x', 'overflow-y', 'visibility', 'grid-template-columns', 'grid-template-rows',
  'column-gap', 'row-gap', 'flex-direction', 'align-items', 'justify-content', 'cursor', 'pointer-events', 'transition-property',
  'transition-duration', 'fill', 'stroke', 'stroke-width', 'object-fit'];
/* root: a selector, or null for the whole body. Boxes are relative to the root. */
const snapshot = ([props, rootSel]) => {
  const root = rootSel ? document.querySelector(rootSel) : document.body;
  const o = rootSel ? root.getBoundingClientRect() : { left: -scrollX, top: -scrollY };
  const skip = el => ['SCRIPT', 'STYLE', 'NOSCRIPT', 'LINK', 'META', 'TEMPLATE'].includes(el.tagName)
    || (el.closest('svg') && el.tagName.toLowerCase() !== 'svg')
    || (el.tagName.toLowerCase() === 'svg' && el.querySelector('pattern'))   /* the old dot field */
    || el.classList.contains('dot-field');                                    /* the new dot field */
  const all = rootSel ? [root, ...root.querySelectorAll('*')] : [...root.querySelectorAll('*')];
  return all.filter(el => !skip(el)).map(el => {
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    return { tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class') || '').slice(0, 50),
      box: [r.left - o.left, r.top - o.top, r.width, r.height].map(n => Math.round(n * 100) / 100),
      s: props.map(p => cs.getPropertyValue(p)) };
  });
};
const compareSnaps = (sa, sb) => {
  if (sa.map(e => e.tag).join() !== sb.map(e => e.tag).join()) {
    let i = 0; while (i < sa.length && sa[i].tag === sb[i]?.tag) i++;
    return [`element sequence differs at #${i}: ${sa[i]?.tag}.${(sa[i]?.cls || '').split(' ')[0]} vs ${sb[i]?.tag}.${(sb[i]?.cls || '').split(' ')[0]} (${sa.length} vs ${sb.length})`];
  }
  const diffs = [];
  /* a border colour on a border of zero width is never painted (an .sr-only label reset
     with border:0 on one page and border-width:0 on another), so it is not compared */
  const width = { 'border-top-color': PROPS.indexOf('border-top-width'), 'border-bottom-color': PROPS.indexOf('border-bottom-width') };
  /* nor is a gradient whose every stop is fully transparent: it paints what none paints */
  const clear = v => v === 'none' ||
    (/^(linear|radial)-gradient\(/.test(v) && !/rgba?\(|#[0-9a-f]{3,8}/i.test(v.replace(/rgba\([^()]*,\s*0\)/g, '')));
  const unpainted = (p, e, f) => (p in width && e.s[width[p]] === '0px' && f.s[width[p]] === '0px')
    || (p === 'background-image' && clear(e.s[PROPS.indexOf(p)]) && clear(f.s[PROPS.indexOf(p)]));
  sa.forEach((e, i) => {
    const f = sb[i];
    if (e.box.some((v, k) => Math.abs(v - f.box[k]) > .01)) diffs.push(`${e.tag}.${e.cls.split(' ')[0]} box ${e.box} vs ${f.box}`);
    PROPS.forEach((p, k) => { if (e.s[k] !== f.s[k] && !unpainted(p, e, f)) diffs.push(`${e.tag}.${e.cls.split(' ')[0]} ${p}: ${e.s[k].slice(0, 140)} ≠ ${f.s[k].slice(0, 140)}`); });
  });
  return diffs;
};

/* ── behaviour: one script, both pages, whatever the page has ──────────────── */
async function behaviour(page, width, { walk = true, chrome = true } = {}) {
  const r = {};
  const has = sel => page.evaluate(s => !!document.querySelector(s), sel);
  /* the first screen, untouched: what is revealed without any scrolling */
  await sleep(2400);
  r.firstView = await page.evaluate(() => [...document.querySelectorAll('.rv, .rv-kids > *')]
    .filter(e => e.getBoundingClientRect().top < innerHeight)
    .map(e => (+getComputedStyle(e).opacity > .99 ? 1 : 0)).join(''));
  /* the quick-check form: its word count (where it has one) and its two switches */
  if (await has('textarea.qc-area')) {
    const counter = () => page.evaluate(() => { const c = document.querySelector('textarea.qc-area').parentElement.querySelector('span span'); return c ? [c.textContent, c.style.color] : null; });
    await page.fill('textarea.qc-area', 'one two three');
    r.count = await counter();
    await page.fill('textarea.qc-area', Array(151).fill('w').join(' '));
    r.overColour = await counter();
    if (await page.locator('form .sw').count() > 1) {
      const sw = page.locator('form .sw').nth(1);
      await sw.click(); r.switchOn = await page.evaluate(() => [...document.querySelectorAll('form .sw')].map(s => +s.classList.contains('on')).join(''));
      await sw.click(); r.switchOff = await page.evaluate(() => [...document.querySelectorAll('form .sw')].map(s => +s.classList.contains('on')).join(''));
    }
    await page.fill('textarea.qc-area', '');
  }
  if (await has('.cab-mark')) {
    const n = await page.locator('.cab-mark').count();
    await page.locator('.cab-mark').nth(Math.min(1, n - 1)).click();
    r.reportClick = await page.evaluate(() => [...document.querySelectorAll('.cab-mark')].map(m => +m.classList.contains('on')).join('') + '/' + [...document.querySelectorAll('.cab-src')].map(s => +s.classList.contains('on')).join(''));
    await page.locator('.cab-mark').nth(Math.min(2, n - 1)).focus();
    await page.keyboard.press('Enter');
    r.reportKey = await page.evaluate(() => [...document.querySelectorAll('.cab-mark')].map(m => +m.classList.contains('on')).join(''));
  }
  if (await has('.faq-q')) {
    const q = page.locator('.faq-q').nth(1);
    await q.click(); await sleep(600);
    r.faqOpen = await page.evaluate(() => [...document.querySelectorAll('.faq-item')].map(i => +i.classList.contains('open')).join(''));
    r.faqAria = await page.evaluate(() => [...document.querySelectorAll('.faq-q')].map(q => (q.getAttribute('aria-expanded') || '-')[0]).join(''));
    await q.click(); await sleep(600);
    r.faqClosed = await page.evaluate(() => [...document.querySelectorAll('.faq-item')].map(i => +i.classList.contains('open')).join(''));
  }
  if (await has('.period-btn')) {
    const n = await page.locator('.period-btn').count();
    r.periods = [];
    for (let i = 0; i < n; i++) {
      await page.locator('.period-btn').nth(i).click(); await sleep(450);
      r.periods.push(await page.evaluate(() => [...document.querySelectorAll('[data-tier]')].map(c => c.innerText.replace(/\s+/g, ' ').trim()).join(' | ')));
    }
  }
  if (await has('.code-tab')) {
    const n = await page.locator('.code-tab').count();
    r.codeTabs = [];
    for (let i = n - 1; i >= 0; i--) {
      await page.locator('.code-tab').nth(i).click(); await sleep(150);
      r.codeTabs.push(await page.evaluate(() => [...document.querySelectorAll('.code-tab')].map(t => +t.classList.contains('on') + (t.getAttribute('aria-current') || '')).join(',') + '/' +
        [...document.querySelectorAll('.code-panel')].map(p => +(getComputedStyle(p).display !== 'none')).join('')));
    }
  }
  /* a link whose target holds a checker puts the caret in its field */
  const ctaSel = await page.evaluate(() => {
    const links = [...document.querySelectorAll('main a[href^="#"]')].filter(a => {
      const t = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
      return t && t.querySelector('textarea.qc-area') && !a.closest('form');
    });
    if (!links.length) return null;
    links[links.length - 1].setAttribute('data-parity-cta', '');
    return '[data-parity-cta]';
  });
  if (ctaSel) {
    await page.locator(ctaSel).click(); await sleep(900);
    r.ctaFocus = await page.evaluate(() => !!document.activeElement && document.activeElement.classList.contains('qc-area'));
  }
  if (EXTRA.behaviour) Object.assign(r, await EXTRA.behaviour(page, width, { sleep }));
  if (walk) {
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= h; y += 400) { await page.evaluate(yy => scrollTo(0, yy), y); await sleep(70); }
    await sleep(1800);
    r.hiddenReveals = await page.evaluate(() => [...document.querySelectorAll('.rv, .rv-kids > *')].filter(e => +getComputedStyle(e).opacity < .99).length);
    r.pen = await page.evaluate(() => [...document.querySelectorAll('.pen-word')].map(w => getComputedStyle(w).color + '|' + (w.querySelector('.pen-underline') ? getComputedStyle(w.querySelector('.pen-underline')).opacity : '-')).join(' '));
    r.ring = await page.evaluate(() => [...document.querySelectorAll('.ring-word')].map(w => getComputedStyle(w).color + '|' + getComputedStyle(w.querySelector('.ring-path')).opacity).join(' '));
  }
  if (chrome) {
    r.toTopShown = await page.evaluate(() => { const b = document.querySelector('button[aria-label="Back to top"]'); return !!b && !b.classList.contains('opacity-0'); });
    if (r.toTopShown) {
      await page.locator('button[aria-label="Back to top"]').click();
      /* wait for the smooth scroll to settle (up to 4s), not a fixed beat */
      let last = -1;
      for (let i = 0; i < 20; i++) { await sleep(200); const y = await page.evaluate(() => scrollY); if (y === last) break; last = y; }
      r.toTopY = await page.evaluate(() => Math.round(scrollY));
    }
    /* focus rings: every link/button on a dark ground, a few on light, the footer */
    r.focusRings = await page.evaluate(() => {
      const dark = [...document.querySelectorAll('main .bg-ink-950 a, main .bg-ink-950 button')].slice(0, 20);
      const light = [...document.querySelectorAll('main a')].filter(a => !a.closest('.bg-ink-950')).slice(0, 4);
      const foot = [...document.querySelectorAll('footer a')].slice(0, 3);
      return [...dark, ...light, ...foot].map(el => { el.focus({ focusVisible: true }); return getComputedStyle(el).outlineColor; }).join(' ');
    });
    /* the site shell's phone header: only where the page has it (the design-system page has its own) */
    if (width < 640 && await has('[data-site-header], header.site-header, button[aria-controls="navPanel"]')) {
      await page.evaluate(() => scrollTo(0, 300)); await sleep(500);
      r.docked = await page.evaluate(() => { const h = document.querySelector('header'); return h.classList.contains('is-docked') + '|' + getComputedStyle(h).top + '|' + getComputedStyle(h.querySelector('.site-nav')).borderTopLeftRadius; });
      await page.evaluate(() => scrollTo(0, 0)); await sleep(500);
      r.undocked = await page.evaluate(() => { const h = document.querySelector('header'); return h.classList.contains('is-docked') + '|' + getComputedStyle(h).top; });
      await page.locator('button[aria-controls="navPanel"]').click(); await sleep(400);
      r.burgerOpen = await page.evaluate(() => { const b = document.querySelector('button[aria-controls="navPanel"]'); const p = document.getElementById('navPanel'); return b.getAttribute('aria-expanded') + '|' + p.classList.contains('open') + '|' + getComputedStyle(b.querySelector('.nav-burger-close')).display + '|' + getComputedStyle(p).visibility; });
      await page.keyboard.press('Escape'); await sleep(400);
      r.burgerClosed = await page.evaluate(() => document.querySelector('button[aria-controls="navPanel"]').getAttribute('aria-expanded'));
    }
  }
  return r;
}

(async () => {
  const server = await start(PORT, { virtual });
  const browser = await chromium.launch({ channel: 'chrome' });
  const A = '__base/' + FILE, B = FILE;
  console.log(`parity · ${FILE} · approved @${REF} vs site/ now · ${sections.length} sections with data-component`);

  if (!ONLY) {
  /* 0 · CSS */
  console.log('\n0 · CSS — Play CDN output of the approved page vs static tailwind.css');
  {
    const a = await open(browser, A);
    const cdnCss = await a.page.evaluate(() => { const s = [...document.querySelectorAll('head style')].find(x => /--tw-border-spacing-x/.test(x.textContent)); return s ? s.textContent : ''; });
    await a.ctx.close();
    /* a baseline that is already on the static assets has no CDN sheet to contain */
    if (!cdnCss) console.log('  note   the approved page already uses the static tailwind.css — nothing to compare');
    else {
    const cdn = ruleIndex(cdnCss);
    const ours = ruleIndex(fs.readFileSync(path.join(ROOT, 'site', 'assets', 'css', 'tailwind.css'), 'utf8'));
    fs.writeFileSync(path.join(OUT, 'cdn.css'), cdnCss);
    const missing = [], lacking = [], extra = new Set(), where = [];
    for (const [k, v] of cdn) {
      const w = ours.get(k);
      if (!w) { missing.push(k); continue; }
      for (const d of v) if (!w.includes(d)) lacking.push(k + ' ← ' + d);
      for (const d of w) if (!v.includes(d)) {
        extra.add(d.split(':')[0]);
        /* harmless: a prefixed property, a prefixed value fallback (width:-webkit-max-content
           before width:max-content), or the position Tailwind's CLI repeats */
        if (!/^-(webkit|moz|o|ms)-/.test(d) && !/^[a-z-]+:-(webkit|moz|o|ms)-/.test(d) && !/^position:/.test(d)) where.push(k + ' → ' + d);
      }
    }
    ok('css', `${cdn.size} CDN rules: ${lacking.length} declarations missing from ours, ${missing.length} selectors not found`, cdn.size > 0 && !lacking.length && !missing.length, [...lacking.slice(0, 3), ...missing.slice(0, 3)].join(' | '));
    ok('css', 'extra declarations are harmless prefixes only: ' + ([...extra].join(', ') || 'none'), !where.length, where.slice(0, 4).join(' | '));
    }
  }

  /* 1 · content */
  console.log('\n1 · content');
  {
    const base = fs.readFileSync(path.join(baseDir, FILE), 'utf8');
    const meta = h => ['<title>([\\s\\S]*?)</title>', 'name="description" content="([^"]*)"', 'rel="canonical" href="([^"]*)"', '<html[^>]*lang="([^"]*)"']
      .map(re => (h.match(new RegExp(re)) || [])[1]);
    ok('content', 'title, description, canonical, lang identical', same(meta(base), meta(current)), JSON.stringify(meta(current)));
    /* The text as served: scripts and <template> contents are not text. */
    const text = h => h.slice(h.indexOf('<main'), h.indexOf('</main>')).replace(/<script[\s\S]*?<\/script>|<template[\s\S]*?<\/template>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const same0 = text(base) === text(current);
    /* The text as rendered, after the scripts ran (reduced motion, so no odometer is mid-roll).
       This is the check that must hold. The served text may differ in one approved way only:
       figures the approved page filled in by script (the pricing cards) are now rendered
       from the pricing data source into the HTML (Olex, 2026-09-25). */
    const domText = async url => {
      const x = await open(browser, url, { reduced: true });
      const t = await x.page.evaluate(() => {
        const out = [];
        const w = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT, {
          acceptNode: n => n.parentElement.closest('script, template, style') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
        while (w.nextNode()) out.push(w.currentNode.nodeValue);
        return out.join(' ').replace(/\s+/g, ' ').trim();
      });
      await x.ctx.close();
      return t;
    };
    const ta = await domText(A), tb = await domText(B);
    ok('content', `rendered text of <main> identical (${tb.length} chars)`, ta === tb);
    if (same0) ok('content', `served text of <main> identical (${text(current).length} chars)`, true);
    else {
      /* empty the price slots the script used to fill; everything else must match exactly */
      const unfilled = h => h
        .replace(/(class="[^"]*\bjs-(?:price|term|rate)\b[^"]*">)[^<]*</g, '$1<')
        .replace(/(class="[^"]*\bjs-feats\b[^"]*">)[\s\S]*?(<\/ul>)/g, '$1$2')
        .replace(/(data-period-note(?:="[^"]*")?[^>]*>)[^<]*</g, '$1<');
      const eq = text(unfilled(current)) === text(unfilled(base));
      ok('content', 'served text identical except the price slots, now rendered from the pricing data source', eq,
         eq ? '' : 'served text differs outside the price slots');
    }
  }

  /* 2 + 3 · pixels and geometry */
  console.log('\n2 · pixels and 3 · geometry — reduced motion');
  for (const w of WIDTHS) {
    const a = await open(browser, A, { width: w, reduced: true });
    const b = await open(browser, B, { width: w, reduced: true });
    await a.page.screenshot({ fullPage: true }); await b.page.screenshot({ fullPage: true });   /* warm the glyph cache */
    let d = diffPng(await a.page.screenshot({ fullPage: true }), await b.page.screenshot({ fullPage: true }), 'fullpage-' + w);
    /* Rasterisation under load is not perfectly repeatable: a run can catch a few pixels
       of noise that no second load shows (Turnitin failed a different spot on each busy
       run while repeated screenshots of both pages hashed identically). A difference is
       therefore measured twice, in fresh contexts; it passes only if the second
       measurement is exactly 0. A real difference fails both times. */
    if (d.px) {
      const a2 = await open(browser, A, { width: w, reduced: true }), b2 = await open(browser, B, { width: w, reduced: true });
      await a2.page.screenshot({ fullPage: true }); await b2.page.screenshot({ fullPage: true });
      const d2 = diffPng(await a2.page.screenshot({ fullPage: true }), await b2.page.screenshot({ fullPage: true }), 'fullpage-' + w + '-retry');
      await a2.ctx.close(); await b2.ctx.close();
      if (!d2.px) { console.log(`  note   ${w}px full page: ${d.px} px on the first load, 0 on a fresh one (noise)`); d = d2; }
    }
    const sa = await a.page.evaluate(snapshot, [PROPS, null]), sb = await b.page.evaluate(snapshot, [PROPS, null]);
    const diffs = compareSnaps(sa, sb);
    /* EXTRA.acceptPixels[width] = { maxPx, maxDelta, reason }: an anti-aliasing difference
       measured and bounded for one page at one width. It holds only while the geometry is
       identical and both bounds hold; anything more fails as usual. */
    /* EXTRA.acceptGeometry = { props, reason }: a page whose approved version drew its
       components with stale copies of their CSS, and now gets the real ones. Every
       difference must be in a listed property (box, width, height and position are the
       layout that follows); one outside the list fails the run, and so do the pixels. */
    const geo = EXTRA.acceptGeometry;
    const propOf = line => / box [\d.,-]+ vs /.test(line) ? 'box' : (line.match(/^\S+ ([a-z-]+):/) || [])[1];
    const unlisted = geo ? diffs.filter(l => !['box', 'width', 'height', 'left', 'top', 'right', 'bottom', ...geo.props].includes(propOf(l))) : diffs;
    const geoAccepted = geo && diffs.length && !unlisted.length;
    const tol = (EXTRA.acceptPixels || {})[w];
    if (d.px && tol && !diffs.length && d.px <= tol.maxPx && d.maxDelta <= tol.maxDelta) {
      console.log(`  ACCEPT ${w}px full page: ${d.px} px, max channel delta ${d.maxDelta}/255 — ${tol.reason}`);
      results.push({ group: 'pixels', label: `${w}px full page ${d.px} px (accepted)`, pass: true });
    } else if (d.px && geoAccepted) {
      console.log(`  ACCEPT ${w}px full page ${d.size}: ${d.px} px — follows from the accepted geometry below`);
      results.push({ group: 'pixels', label: `${w}px full page ${d.px} px (accepted with the geometry)`, pass: true });
    } else ok('pixels', `${w}px full page ${d.size}: ${d.px} differing pixels` + (d.px ? `, max channel delta ${d.maxDelta}/255` : ''), d.px === 0);
    fs.writeFileSync(path.join(OUT, 'geometry-' + w + '.txt'), diffs.join('\n'));
    if (geoAccepted) {
      const count = {}; diffs.forEach(l => { const p = propOf(l); count[p] = (count[p] || 0) + 1; });
      console.log(`  ACCEPT ${w}px ${diffs.length} differences, all in listed properties (${Object.entries(count).map(([k, v]) => k + ' ' + v).join(', ')}) — ${geo.reason}`);
      results.push({ group: 'geometry', label: `${w}px ${diffs.length} differences in listed properties (accepted)`, pass: true });
    } else ok('geometry', `${w}px ${sa.length} elements × ${PROPS.length} properties + box: ${diffs.length} differences` + (geo && unlisted.length ? `, ${unlisted.length} outside the accepted properties` : ''), !diffs.length, unlisted.slice(0, 3).join(' | '));
    ok('errors', `${w}px no script errors`, !b.errors.length, b.errors.join(' | '));
    await a.ctx.close(); await b.ctx.close();
  }

  /* 4 · behaviour */
  console.log('\n4 · behaviour — the same script on both, motion on');
  for (const w of QUICK ? [1440] : [1440, 375]) {
    const a = await open(browser, A, { width: w }); const ra = await behaviour(a.page, w); await a.ctx.close();
    const b = await open(browser, B, { width: w }); const rb = await behaviour(b.page, w); await b.ctx.close();
    /* EXTRA.accept names a difference that was decided, not missed (build/parity/pages.js):
       it is reported as accepted, with its reason, and does not fail the run */
    const accept = EXTRA.accept || {};
    for (const k of Object.keys(ra)) {
      const eq = same(ra[k], rb[k]);
      if (!eq && accept[k]) { console.log(`  ACCEPT ${w}px ${k}: ${accept[k]}\n         approved ${JSON.stringify(ra[k]).slice(0, 90)}\n         now      ${JSON.stringify(rb[k]).slice(0, 90)}`); results.push({ group: 'behaviour', label: `${w}px ${k} (accepted: ${accept[k]})`, pass: true }); continue; }
      ok('behaviour', `${w}px ${k}: ${JSON.stringify(rb[k]).slice(0, 110)}`, eq, eq ? '' : 'approved: ' + JSON.stringify(ra[k]).slice(0, 200));
    }
    ok('behaviour', `${w}px no script errors`, !b.errors.length, b.errors.join(' | '));
  }

  /* 5 · states */
  console.log('\n5 · states — reduced motion, no JavaScript, blocked GSAP, blocked site.js');
  const stateOf = page => page.evaluate(() => ({
    html: document.documentElement.className,
    hidden: [...document.querySelectorAll('.rv, .rv-kids > *')].filter(e => +getComputedStyle(e).opacity < .99).length,
    faq: [...document.querySelectorAll('.faq-a')].length,
    faqOpen: [...document.querySelectorAll('.faq-a')].filter(a => a.getBoundingClientRect().height > 10).length,
    h1: getComputedStyle(document.querySelector('h1')).fontSize,
  }));
  {
    const b = await open(browser, B, { reduced: true }); const s = await stateOf(b.page); await b.ctx.close();
    ok('states', `reduced motion: html="${s.html}", ${s.hidden} hidden reveals`, /\bjs\b/.test(s.html) && !/js-motion/.test(s.html) && s.hidden === 0);
  }
  {
    const b = await open(browser, B, { js: false }); const s = await stateOf(b.page); await b.ctx.close();
    ok('states', `no JS: ${s.hidden} hidden reveals, ${s.faqOpen}/${s.faq} answers open, h1 ${s.h1} (styled)`, s.hidden === 0 && s.faqOpen === s.faq && s.h1 !== '32px');
  }
  {
    const b = await open(browser, B, { block: ['**/gsap.min.js', '**/ScrollTrigger.min.js'] }); const s = await stateOf(b.page); await b.ctx.close();
    ok('states', `GSAP blocked: html="${s.html}", ${s.hidden} hidden reveals`, !/js-motion/.test(s.html) && s.hidden === 0);
  }
  {
    const b = await open(browser, B, { block: ['**/assets/js/site.js'] }); await sleep(3400); const s = await stateOf(b.page); await b.ctx.close();
    ok('states', `site.js blocked: after the fail-safe html="${s.html}", ${s.hidden} hidden, ${s.faqOpen}/${s.faq} answers open`, !/\bjs\b/.test(s.html) && s.hidden === 0 && s.faqOpen === s.faq);
  }

  }

  /* 6 · reuse */
  if (!QUICK && EXTRA.reuse !== false) {
    if (ONLY) sections.splice(0, sections.length, ...sections.filter(s => s.name === ONLY));
    console.log(`\n6 · reuse — each of ${sections.length} sections alone in an empty page with only the shared assets`);
    ok('reuse', `every top-level element of <main> carries data-component (${topLevel.length})`, topLevel.length === sections.length && new Set(sections.map(s => s.name)).size === sections.length);
    /* Sticky elements are set static in both pages. At scroll 0 an unstuck sticky element
       sits exactly where a static one would, but Chrome may paint it on its own layer,
       with different text anti-aliasing, in one context and not the other: the Pricing AI
       packages column differed by 5,262 anti-aliased pixels at identical geometry, and by
       0 once both were static. */
    const hide = name => `.site-header,[data-to-top],.grain,footer,body > div[class*="z-[100]"],main > :not([data-component="${name}"]){display:none!important} .sticky,.sm\\:sticky,.md\\:sticky,.lg\\:sticky,.xl\\:sticky{position:static!important}`;
    for (const w of WIDTHS) {
      for (const s of sections) {
        const b = await open(browser, B, { width: w, reduced: true });
        const t = await open(browser, '__reuse/' + s.name, { width: w, reduced: true });
        for (const x of [b, t]) { await x.page.addStyleTag({ content: hide(s.name) }); await x.page.evaluate(() => scrollTo(0, 0)); await sleep(200); }
        const sel = `main > [data-component="${s.name}"]`;
        let d = diffPng(await b.page.locator(sel).screenshot(), await t.page.locator(sel).screenshot(), `reuse-${s.name}-${w}`);
        if (d.px) {   /* measured twice, as the full page is (see there) */
          const b2 = await open(browser, B, { width: w, reduced: true }), t2 = await open(browser, '__reuse/' + s.name, { width: w, reduced: true });
          for (const x of [b2, t2]) { await x.page.addStyleTag({ content: hide(s.name) }); await x.page.evaluate(() => scrollTo(0, 0)); await sleep(200); }
          const d2 = diffPng(await b2.page.locator(sel).screenshot(), await t2.page.locator(sel).screenshot(), `reuse-${s.name}-${w}-retry`);
          await b2.ctx.close(); await t2.ctx.close();
          if (!d2.px) { console.log(`  note   ${w}px ${s.name}: ${d.px} px on the first load, 0 on a fresh one (noise)`); d = d2; }
        }
        const diffs = compareSnaps(await b.page.evaluate(snapshot, [PROPS, sel]), await t.page.evaluate(snapshot, [PROPS, sel]));
        ok('reuse', `${w}px ${s.name} ${d.size}: ${d.px} px, ${diffs.length} element differences`, d.px === 0 && !diffs.length, diffs.slice(0, 3).join(' | '));
        if (t.errors.length) ok('reuse', `${w}px ${s.name}: script errors alone`, false, t.errors.join(' | '));
        await b.ctx.close(); await t.ctx.close();
      }
    }
    for (const s of sections) {
      const t = await open(browser, '__reuse/' + s.name, { width: 1440 });
      const r = await behaviour(t.page, 1440, { chrome: false });
      await t.ctx.close();
      const interactive = Object.keys(r).filter(k => !['hiddenReveals', 'pen', 'ring'].includes(k));
      ok('reuse', `${s.name} alone: ${r.hiddenReveals} hidden reveals` + (interactive.length ? ', ' + interactive.map(k => k + '=' + JSON.stringify(r[k]).slice(0, 40)).join(' ') : ''), r.hiddenReveals === 0 && !t.errors.length, t.errors.join(' | '));
    }
  }

  await browser.close();
  server.close();
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(results, null, 2));
  console.log(failed ? `\n${failed} check(s) FAILED — ${path.relative(ROOT, OUT)}/` : `\nall ${results.length} checks passed — ${path.relative(ROOT, OUT)}/`);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
