/* Parity harness for the static-assets proof of concept (Students).

   Compares the approved page (Play CDN + inline blocks) with its POC twin (shared
   production assets), then checks the POC on its own, then checks the four sections
   copied into the empty test page. A real Chrome (the installed one, via playwright-core)
   at 375 / 768 / 1440, device scale 1.

     0  CSS         the CSS the Play CDN generates on the approved page, rule by rule, must
                    be contained in the static tailwind.css — same version, same config,
                    same prefixes (ours may add a few harmless extra prefixes, never lose one)
     1  pixels      full-page screenshots, exact pixelmatch (threshold 0), reduced motion
     2  geometry    every rendered element: box + 60 computed properties, reduced motion
     3  behaviour   checker, report, FAQ, reveal, pen, ring, header dock, burger, back-to-top,
                    focus ring — run identically on both pages, results compared
     4  states      reduced motion; JavaScript off; GSAP blocked; site.js blocked
     5  reuse       each copied section vs the same section in the POC page, both laid out
                    alone from y=0 (a section's pixels depend on the fraction of a pixel it
                    starts at, which is a property of the page above it, not of the section):
                    pixels at three widths, and every element inside it — box relative to the
                    section, 65 computed properties. Then the behaviour inside the empty page.

   Run:  node build/parity/students.js      (writes build/parity/out/)
   Exit code 1 if anything differs.
*/
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const { start } = require('./serve');
const postcss = require('postcss');

/* rule → declarations, with formatting noise removed (selector spacing and order,
   quotes in attribute selectors, 0.25 vs .25) */
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

const PORT = 4190;
const BASE = `http://localhost:${PORT}/`;
const A = 'plagiarism-checker-for-students.html';
const B = 'plagiarism-checker-for-students-poc.html';
const T = 'poc-sections.html';
const WIDTHS = [375, 768, 1440];
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const results = [];
let failed = 0;
const ok = (group, label, pass, detail = '') => {
  results.push({ group, label, pass, detail });
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function open(browser, file, { width = 1440, reduced = false, js = true, block = [] } = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height: width < 700 ? 812 : 900 }, deviceScaleFactor: 1,
    reducedMotion: reduced ? 'reduce' : 'no-preference', javaScriptEnabled: js,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  for (const pat of block) await page.route(pat, r => r.abort());
  await page.goto(BASE + file, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await sleep(600);
  return { ctx, page, errors };
}

function diffPng(bufA, bufB, name) {
  const a = PNG.sync.read(bufA), b = PNG.sync.read(bufB);
  if (a.width !== b.width || a.height !== b.height) return { size: `${a.width}×${a.height} vs ${b.width}×${b.height}`, px: -1 };
  const diff = new PNG({ width: a.width, height: a.height });
  const px = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0 });
  if (px) fs.writeFileSync(path.join(OUT, name + '.diff.png'), PNG.sync.write(diff));
  return { size: `${a.width}×${a.height}`, px };
}

/* ── the snapshot: every rendered element, its box and its computed style ───── */
const PROPS = ['display', 'position', 'top', 'right', 'bottom', 'left', 'width', 'height',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'text-align', 'text-transform',
  'text-decoration-line', 'white-space', 'color', 'background-color', 'background-image', 'background-size', 'background-position',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-top-color', 'border-bottom-color',
  'border-top-left-radius', 'border-bottom-right-radius', 'box-shadow', 'outline-style', 'opacity', 'transform', 'filter',
  'backdrop-filter', 'mask-image', 'z-index', 'overflow-x', 'overflow-y', 'visibility', 'grid-template-columns', 'grid-template-rows',
  'column-gap', 'row-gap', 'flex-direction', 'align-items', 'justify-content', 'cursor', 'pointer-events', 'transition-property',
  'transition-duration', 'fill', 'stroke', 'stroke-width', 'object-fit'];
const snapshot = props => {
  const skip = el => ['SCRIPT', 'STYLE', 'NOSCRIPT', 'LINK', 'META', 'TEMPLATE'].includes(el.tagName)
    || (el.closest('svg') && el.tagName.toLowerCase() !== 'svg')
    || (el.tagName.toLowerCase() === 'svg' && el.querySelector('pattern'))   /* the old dot field */
    || el.classList.contains('dot-field');                                    /* the new dot field */
  const els = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (skip(el)) continue;
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    els.push({ tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class') || '').slice(0, 60),
      box: [r.left + scrollX, r.top + scrollY, r.width, r.height].map(n => Math.round(n * 100) / 100),
      s: props.map(p => cs.getPropertyValue(p)) });
  }
  return els;
};

/* ── behaviour: one script, both pages ─────────────────────────────────────── */
async function behaviour(page, width) {
  const r = {};
  /* checker: count, the over-limit colour, the switches */
  await page.fill('textarea.qc-area', 'one two three');
  r.count = await page.evaluate(() => document.querySelector('textarea.qc-area').parentElement.querySelector('span span').textContent);
  await page.fill('textarea.qc-area', Array(151).fill('w').join(' '));
  r.overColour = await page.evaluate(() => document.querySelector('textarea.qc-area').parentElement.querySelector('span span').style.color);
  const aiLabel = page.locator('.sw').nth(1);
  await aiLabel.click();
  r.aiOn = await page.evaluate(() => [...document.querySelectorAll('.sw')].map(s => s.classList.contains('on')).join(','));
  await aiLabel.click();
  r.aiOff = await page.evaluate(() => [...document.querySelectorAll('.sw')].map(s => s.classList.contains('on')).join(','));
  /* report: click, keyboard */
  await page.locator('.cab-mark').nth(1).click();
  r.reportClick = await page.evaluate(() => [...document.querySelectorAll('.cab-mark')].map(m => +m.classList.contains('on')).join('') + '/' + [...document.querySelectorAll('.cab-src')].map(s => +s.classList.contains('on')).join(''));
  await page.locator('.cab-mark').nth(2).focus();
  await page.keyboard.press('Enter');
  r.reportKey = await page.evaluate(() => [...document.querySelectorAll('.cab-mark')].map(m => +m.classList.contains('on')).join(''));
  /* FAQ: open the second, then close it */
  await page.locator('.faq-q').nth(1).click();
  await sleep(600);
  r.faqOpen = await page.evaluate(() => [...document.querySelectorAll('.faq-item')].map(i => +i.classList.contains('open')).join('') + '/' + [...document.querySelectorAll('.faq-q')].map(q => q.getAttribute('aria-expanded')[0]).join(''));
  r.faqHeight = await page.evaluate(() => Math.round(document.querySelectorAll('.faq-a')[1].getBoundingClientRect().height) > 20);
  await page.locator('.faq-q').nth(1).click();
  await sleep(600);
  r.faqClosed = await page.evaluate(() => [...document.querySelectorAll('.faq-item')].map(i => +i.classList.contains('open')).join(''));
  /* a CTA that points at the checker lands the caret in its field */
  await page.locator('#start-free a[href="#student-checker"]').click();
  await sleep(900);
  r.ctaFocus = await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('qc-area'));
  /* reveal, pen, ring: walk the page down, then read the end state */
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += 400) { await page.evaluate(yy => scrollTo(0, yy), y); await sleep(70); }
  await sleep(1800);
  r.hiddenReveals = await page.evaluate(() => [...document.querySelectorAll('.rv, .rv-kids > *')].filter(e => +getComputedStyle(e).opacity < .99).length);
  r.pen = await page.evaluate(() => [...document.querySelectorAll('.pen-word')].map(w => getComputedStyle(w).color + '|' + getComputedStyle(w.querySelector('.pen-underline')).opacity).join(' '));
  r.ring = await page.evaluate(() => { const w = document.querySelector('.ring-word'); return getComputedStyle(w).color + '|' + getComputedStyle(w.querySelector('.ring-path')).opacity; });
  /* back to top: shown once scrolled, returns to 0 */
  r.toTopShown = await page.evaluate(() => { const b = document.querySelector('button[aria-label="Back to top"]'); return !b.classList.contains('opacity-0'); });
  await page.locator('button[aria-label="Back to top"]').click();
  await sleep(1500);
  r.toTopY = await page.evaluate(() => Math.round(scrollY));
  /* focus ring: light section, dark footer */
  r.focusRing = await page.evaluate(() => {
    const light = document.querySelector('#start-free a'); const dark = document.querySelector('footer a');
    light.focus({ focusVisible: true }); const l = getComputedStyle(light).outlineColor;
    dark.focus({ focusVisible: true }); const d = getComputedStyle(dark).outlineColor;
    return l + ' / ' + d;
  });
  /* phone header: dock on scroll, burger */
  if (width < 640) {
    await page.evaluate(() => scrollTo(0, 300)); await sleep(500);
    r.docked = await page.evaluate(() => { const h = document.querySelector('header'); return h.classList.contains('is-docked') + '|' + getComputedStyle(h).top + '|' + getComputedStyle(h.querySelector('.site-nav')).borderTopLeftRadius; });
    await page.evaluate(() => scrollTo(0, 0)); await sleep(500);
    r.undocked = await page.evaluate(() => { const h = document.querySelector('header'); return h.classList.contains('is-docked') + '|' + getComputedStyle(h).top; });
    await page.locator('button[aria-controls="navPanel"]').click(); await sleep(400);
    r.burgerOpen = await page.evaluate(() => { const b = document.querySelector('button[aria-controls="navPanel"]'); const p = document.getElementById('navPanel'); return b.getAttribute('aria-expanded') + '|' + p.classList.contains('open') + '|' + getComputedStyle(b.querySelector('.nav-burger-close')).display + '|' + getComputedStyle(p).visibility; });
    await page.keyboard.press('Escape'); await sleep(400);
    r.burgerClosed = await page.evaluate(() => document.querySelector('button[aria-controls="navPanel"]').getAttribute('aria-expanded'));
  }
  return r;
}

(async () => {
  const server = await start(PORT);
  const browser = await chromium.launch({ channel: 'chrome' });
  const summary = {};

  /* 0 · the CDN's CSS is contained in ours */
  console.log('\n0 · CSS — Play CDN output (approved page) vs static tailwind.css');
  {
    const a = await open(browser, A, { width: 1440 });
    const cdnCss = await a.page.evaluate(() => [...document.querySelectorAll('head style')].pop().textContent);
    await a.ctx.close();
    const cdn = ruleIndex(cdnCss);
    const ours = ruleIndex(fs.readFileSync(path.join(__dirname, '..', '..', 'site', 'assets', 'css', 'tailwind.css'), 'utf8'));
    const missing = [], lacking = [], extra = new Set();
    for (const [k, v] of cdn) {
      const w = ours.get(k);
      if (!w) { missing.push(k); continue; }
      for (const d of v) if (!w.includes(d)) lacking.push(k + ' ← ' + d);
      for (const d of w) if (!v.includes(d)) extra.add(d.split(':')[0]);
    }
    /* four preflight selectors differ only in how the CDN wrote :where()/quotes; their
       declarations are compared by the geometry check below */
    ok('css', `${cdn.size} CDN rules: ${lacking.length} declarations missing from ours, ${missing.length} selectors written differently`, !lacking.length && missing.length <= 4, lacking.slice(0, 3).join(' | ') + (missing.length ? '  [' + missing.join(' · ') + ']' : ''));
    ok('css', 'extra declarations ours adds (harmless prefixes only): ' + [...extra].join(', '), [...extra].every(p => /^-(webkit|moz|o|ms)-/.test(p) || p === 'position'));
  }

  /* 1 + 2 · pixels and geometry, reduced motion (the static final state of both) */
  console.log('\n1 · pixels and 2 · geometry — approved page vs POC, reduced motion');
  for (const w of WIDTHS) {
    const a = await open(browser, A, { width: w, reduced: true });
    const b = await open(browser, B, { width: w, reduced: true });
    /* a throwaway frame first: Chrome's first full-page raster of a cold glyph cache can
       differ by a few levels on text edges (seen once: max delta 8/255) — noise, not CSS */
    await a.page.screenshot({ fullPage: true }); await b.page.screenshot({ fullPage: true });
    const d = diffPng(await a.page.screenshot({ fullPage: true }), await b.page.screenshot({ fullPage: true }), 'fullpage-' + w);
    ok('pixels', `${w}px full page ${d.size}: ${d.px} differing pixels`, d.px === 0, d.px ? 'see build/parity/out/fullpage-' + w + '.diff.png' : '');
    const sa = await a.page.evaluate(snapshot, PROPS), sb = await b.page.evaluate(snapshot, PROPS);
    const tagsA = sa.map(e => e.tag).join(','), tagsB = sb.map(e => e.tag).join(',');
    if (tagsA !== tagsB) { ok('geometry', `${w}px element sequence`, false, sa.length + ' vs ' + sb.length + ' elements'); }
    else {
      const diffs = [];
      sa.forEach((e, i) => {
        const f = sb[i];
        if (e.box.some((v, k) => Math.abs(v - f.box[k]) > .01)) diffs.push(`${e.tag}.${e.cls.split(' ')[0]} box ${e.box} vs ${f.box}`);
        PROPS.forEach((p, k) => { if (e.s[k] !== f.s[k]) diffs.push(`${e.tag}.${e.cls.split(' ')[0]} ${p}: ${e.s[k].slice(0, 160)} ≠ ${f.s[k].slice(0, 160)}`); });
      });
      fs.writeFileSync(path.join(OUT, 'geometry-' + w + '.txt'), diffs.join('\n'));
      ok('geometry', `${w}px ${sa.length} elements × ${PROPS.length} properties + box: ${diffs.length} differences`, !diffs.length, diffs.slice(0, 4).join(' | '));
    }
    ok('errors', `${w}px no script errors`, !a.errors.length && !b.errors.length, [...a.errors, ...b.errors].join(' | '));
    await a.ctx.close(); await b.ctx.close();
  }

  /* 3 · behaviour, motion on — identical results on both pages */
  console.log('\n3 · behaviour — the same script on both pages, motion on');
  for (const w of [1440, 375]) {
    const a = await open(browser, A, { width: w }); const ra = await behaviour(a.page, w); await a.ctx.close();
    const b = await open(browser, B, { width: w }); const rb = await behaviour(b.page, w); await b.ctx.close();
    summary['behaviour-' + w] = { approved: ra, poc: rb };
    for (const k of Object.keys(ra)) ok('behaviour', `${w}px ${k}: ${JSON.stringify(rb[k])}`, JSON.stringify(ra[k]) === JSON.stringify(rb[k]), JSON.stringify(ra[k]) !== JSON.stringify(rb[k]) ? 'approved: ' + JSON.stringify(ra[k]) : '');
  }

  /* 4 · states */
  console.log('\n4 · states — reduced motion, no JavaScript, blocked GSAP, blocked site.js');
  const stateOf = page => page.evaluate(() => ({
    html: document.documentElement.className,
    hidden: [...document.querySelectorAll('.rv, .rv-kids > *')].filter(e => +getComputedStyle(e).opacity < .99).length,
    faqOpen: [...document.querySelectorAll('.faq-a')].filter(a => a.getBoundingClientRect().height > 10).length,
    h1: getComputedStyle(document.querySelector('h1')).fontSize,
    styled: getComputedStyle(document.querySelector('main section')).paddingTop,
  }));
  {
    const b = await open(browser, B, { reduced: true }); const s = await stateOf(b.page); await b.ctx.close();
    ok('states', `reduced motion: html="${s.html}", ${s.hidden} hidden reveals`, /\bjs\b/.test(s.html) && !/js-motion/.test(s.html) && s.hidden === 0);
  }
  {
    const a = await open(browser, A, { js: false }); const sa = await stateOf(a.page);
    fs.writeFileSync(path.join(OUT, 'nojs-approved.png'), await a.page.screenshot()); await a.ctx.close();
    const b = await open(browser, B, { js: false }); const sb = await stateOf(b.page);
    fs.writeFileSync(path.join(OUT, 'nojs-poc.png'), await b.page.screenshot()); await b.ctx.close();
    summary.noJs = { approved: sa, poc: sb };
    ok('states', `no JS — POC: ${sb.hidden} hidden reveals, ${sb.faqOpen}/9 answers open, h1 ${sb.h1}, section padding ${sb.styled}`, sb.hidden === 0 && sb.faqOpen === 9 && sb.h1 !== '32px' && sb.styled !== '0px');
    console.log(`        (for reference, the approved page without JS: ${sa.hidden} hidden reveals, h1 ${sa.h1}, section padding ${sa.styled} — no Tailwind at all)`);
  }
  {
    const b = await open(browser, B, { block: ['**/gsap.min.js', '**/ScrollTrigger.min.js'] }); const s = await stateOf(b.page); await b.ctx.close();
    ok('states', `GSAP blocked: html="${s.html}", ${s.hidden} hidden reveals`, !/js-motion/.test(s.html) && s.hidden === 0);
  }
  {
    const b = await open(browser, B, { block: ['**/assets/js/site.js'] });
    const early = await stateOf(b.page); await sleep(3400); const s = await stateOf(b.page); await b.ctx.close();
    ok('states', `site.js blocked: after the 3.5s fail-safe html="${s.html}", ${s.hidden} hidden reveals, ${s.faqOpen}/9 answers open (before it: ${early.hidden} hidden)`, !/js/.test(s.html) && s.hidden === 0 && s.faqOpen === 9);
  }

  /* 5 · reuse — the copied sections in the empty page */
  console.log('\n5 · reuse — sections copied into an empty page with only the shared assets');
  const SECTIONS = ['hero-checker', 'report-dark', 'faq', 'cta-band'];
  /* the section alone, from y=0, in either page */
  const isolate = name => `.site-header,[data-to-top],.grain,footer,main > section:not([data-component="${name}"]){display:none!important}`;
  const within = ([props, name]) => {
    const root = document.querySelector(`section[data-component="${name}"]`), o = root.getBoundingClientRect();
    return [root, ...root.querySelectorAll('*')].filter(el => !(el.closest('svg') && el.tagName.toLowerCase() !== 'svg')).map(el => {
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      return { tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class') || '').slice(0, 40),
        box: [r.left - o.left, r.top - o.top, r.width, r.height].map(n => Math.round(n * 100) / 100), s: props.map(p => cs.getPropertyValue(p)) };
    });
  };
  for (const w of WIDTHS) {
    for (const name of SECTIONS) {
      const b = await open(browser, B, { width: w, reduced: true });
      const t = await open(browser, T, { width: w, reduced: true });
      for (const x of [b, t]) { await x.page.addStyleTag({ content: isolate(name) }); await x.page.evaluate(() => scrollTo(0, 0)); await sleep(200); }
      const sel = `section[data-component="${name}"]`;
      const d = diffPng(await b.page.locator(sel).screenshot(), await t.page.locator(sel).screenshot(), `reuse-${name}-${w}`);
      const eb = await b.page.evaluate(within, [PROPS, name]);
      const et = await t.page.evaluate(within, [PROPS, name]);
      let diffs = et.length !== eb.length ? [eb.length + ' vs ' + et.length + ' elements'] : [];
      if (!diffs.length) eb.forEach((e, i) => {
        const f = et[i];
        if (e.tag !== f.tag || e.box.some((v, k) => Math.abs(v - f.box[k]) > .01)) diffs.push(`${e.tag}.${e.cls.split(' ')[0]} box`);
        PROPS.forEach((p, k) => { if (e.s[k] !== f.s[k]) diffs.push(`${e.tag}.${e.cls.split(' ')[0]} ${p}`); });
      });
      ok('reuse', `${w}px ${name} ${d.size}: ${d.px} differing pixels, ${eb.length} elements: ${diffs.length} differences`, d.px === 0 && !diffs.length, diffs.slice(0, 4).join(' | '));
      if (t.errors.length) ok('reuse', `${w}px ${name}: script errors in the empty page`, false, t.errors.join(' | '));
      await b.ctx.close(); await t.ctx.close();
    }
  }
  {
    const t = await open(browser, T, { width: 1440 });
    const r = {};
    await t.page.fill('textarea.qc-area', 'one two three four');
    r.count = await t.page.evaluate(() => document.querySelector('[data-checker-count]').textContent);
    await t.page.locator('.cab-mark').nth(1).click();
    r.report = await t.page.evaluate(() => [...document.querySelectorAll('.cab-mark')].map(m => +m.classList.contains('on')).join(''));
    await t.page.locator('.faq-q').nth(2).click(); await sleep(600);
    r.faq = await t.page.evaluate(() => [...document.querySelectorAll('.faq-item')].map(i => +i.classList.contains('open')).join(''));
    await t.page.locator('section[data-component="cta-band"] a[href="#student-checker"]').click(); await sleep(900);
    r.ctaFocus = await t.page.evaluate(() => document.activeElement === document.querySelector('[data-checker-text]'));
    const h = await t.page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= h; y += 400) { await t.page.evaluate(yy => scrollTo(0, yy), y); await sleep(70); }
    await sleep(1800);
    r.ring = await t.page.evaluate(() => getComputedStyle(document.querySelector('.ring-word')).color);
    r.hidden = await t.page.evaluate(() => [...document.querySelectorAll('.rv, .rv-kids > *')].filter(e => +getComputedStyle(e).opacity < .99).length);
    await t.ctx.close();
    ok('reuse', `behaviour in the empty page: count ${r.count}, report ${r.report}, faq ${r.faq}, CTA→field ${r.ctaFocus}, ring ${r.ring}, ${r.hidden} hidden reveals`,
       r.count === '4' && r.report === '11000' && r.faq === '001000000' && r.ctaFocus && r.ring === 'rgb(220, 90, 69)' && r.hidden === 0);
  }

  await browser.close();
  server.close();
  fs.writeFileSync(path.join(OUT, 'students-report.json'), JSON.stringify({ results, summary }, null, 2));
  console.log(failed ? `\n${failed} check(s) FAILED — build/parity/out/` : `\nall ${results.length} checks passed — build/parity/out/`);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
