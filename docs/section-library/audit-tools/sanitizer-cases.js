/* What happens if the CMS (or the editor) changes a snippet in ways the developer did not
   rule out. SIMULATIONS in Chrome, read-only, served by interception:
     1  pricing preview with its <script type="application/json"> island removed
        (a sanitizer that strips every <script>)
     2  report showcase with every style="" removed (a sanitizer that strips inline styles)
     3  FAQ copied from the browser's rendered DOM (DevTools "Copy outerHTML") instead of
        the page source: it carries data-faq-ready="1" and the repaired attributes
     4  reviews carousel copied from the rendered DOM the same way
   Each case is compared with the snippet as published: does it still work, what changes. */
const fs = require('fs');
const path = require('path');
const REPO = require('path').resolve(__dirname, '../../..');
const EV = require('path').resolve(__dirname, '../evidence');
const { chromium } = require(REPO + '/node_modules/playwright-core');
const { PNG } = require(REPO + '/node_modules/pngjs');
const pixelmatch = require(REPO + '/node_modules/pixelmatch');
const pageShell = require(REPO + '/build/page');
const ORIGIN = 'http://audit.test';
const TYPES = { html: 'text/html; charset=utf-8', css: 'text/css', js: 'application/javascript', svg: 'image/svg+xml', png: 'image/png', webp: 'image/webp', jpg: 'image/jpeg' };
const snip = f => fs.readFileSync(path.join(REPO, 'build/sections/snippets', f), 'utf8').trim();
const pages = {};
const put = (name, html) => { pages['/__audit/' + name + '.html'] = pageShell.render({ title: name, sections: [html], chrome: false }); return ORIGIN + '/__audit/' + name + '.html'; };

(async () => {
  const br = await chromium.launch({ channel: 'chrome' });
  const ctx = await br.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await ctx.route(ORIGIN + '/**', async rt => {
    const u = new URL(rt.request().url());
    if (pages[u.pathname]) return rt.fulfill({ status: 200, contentType: TYPES.html, body: pages[u.pathname] });
    const file = path.join(REPO, 'site', decodeURIComponent(u.pathname));
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return rt.fulfill({ status: 200, contentType: TYPES[path.extname(file).slice(1)] || 'application/octet-stream', body: fs.readFileSync(file) });
    return rt.fulfill({ status: 404, body: 'nf' });
  });
  const open = async url => { const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 120))); await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(400); return { p, errs }; };
  const shot = async p => PNG.sync.read(await p.screenshot({ fullPage: true }));
  const diff = (a, b) => (a.width === b.width && a.height === b.height ? pixelmatch(a.data, b.data, null, a.width, a.height, { threshold: 0.1 }) + ' px' : 'size ' + a.height + ' → ' + b.height);

  /* 1 · pricing without its island */
  {
    const html = snip('pricing-preview-center.html');
    const a = await open(put('pricing-a', html));
    const b = await open(put('pricing-noisland', html.replace(/<script type="application\/json"[^>]*>[\s\S]*?<\/script>/, '')));
    const run = p => p.evaluate(async () => { const pr = document.querySelector('[data-pricing]'); const price = () => [...pr.querySelectorAll('[data-tier]')].map(c => c.textContent.replace(/\s+/g, ' ').trim().slice(0, 60)).join(' | '); const p0 = price(); const t = [...pr.querySelectorAll('.period-btn')].find(x => !x.classList.contains('active')); t.click(); await new Promise(r => setTimeout(r, 500)); return { ready: pr.dataset.pricingReady || null, switched: price() !== p0, firstPaint: p0.slice(0, 120) }; });
    const ra = await run(a.p), rb = await run(b.p);
    console.log('1 pricing, island removed: published ' + JSON.stringify(ra) + '\n                           stripped  ' + JSON.stringify(rb) + ' ; errors ' + (b.errs.join(' | ') || 'none'));
    await a.p.close(); await b.p.close();
  }
  /* 2 · report without inline styles */
  for (const f of ['report-showcase-dark.html', 'report-showcase-light.html']) {
    const html = snip(f);
    const n = (html.match(/\sstyle="/g) || []).length;
    const a = await open(put('rep-a', html)); const b = await open(put('rep-nostyle', html.replace(/\sstyle="[^"]*"/g, '')));
    const sa = await shot(a.p), sb = await shot(b.p);
    console.log('2 ' + f + ': ' + n + ' style="" attributes ; stripped → ' + diff(sa, sb) + ' differ');
    if (f === 'report-showcase-dark.html') {
      const box = await b.p.evaluate(() => { const r = document.querySelector('[data-report]').getBoundingClientRect(); return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height }; });
      for (const [k, pg] of [['published', a.p], ['stripped', b.p]]) await pg.screenshot({ path: EV + '/case-report-' + k + '.png', fullPage: true, clip: { x: box.x, y: box.y, width: box.w, height: Math.min(box.h, 900) } });
    }
    await a.p.close(); await b.p.close();
  }
  /* 3, 4 · copied from the rendered DOM */
  for (const [f, sel, act] of [['faq-fluid.html', '[data-faq]', 'faq'], ['reviews-carousel.html', '[data-carousel]', 'carousel']]) {
    const first = await open(put('dom-src', snip(f)));
    const rendered = await first.p.evaluate(() => document.querySelector('main').innerHTML);
    await first.p.close();
    const c = await open(put('dom-copy', rendered));
    const r = await c.p.evaluate(async (act) => {
      const wait = ms => new Promise(f => setTimeout(f, ms));
      if (act === 'faq') { const q = document.querySelectorAll('.faq-q')[1]; const b = q.getAttribute('aria-expanded'); q.click(); await wait(450); return { carriedReadyFlag: !!document.querySelector('[data-faq-ready]'), toggles: q.getAttribute('aria-expanded') !== b }; }
      const car = document.querySelector('[data-carousel]'); const tr = car.querySelector('[data-carousel-track]'); const x = tr.scrollLeft; car.querySelector('[data-carousel-next]').click(); await wait(900);
      return { carriedReadyFlag: !!document.querySelector('[data-carousel-ready]'), dots: car.querySelectorAll('[data-carousel-dots] > *').length, moves: tr.scrollLeft !== x };
    }, act);
    console.log((act === 'faq' ? '3' : '4') + ' ' + f + ' copied from the rendered DOM: ' + JSON.stringify(r) + ' ; errors ' + (c.errs.join(' | ') || 'none'));
    await c.p.close();
  }
  await br.close();
})();
