/* The catalogue page itself (site/section-library.html) and the composed demonstration
   pages, in Chrome at 375 / 768 / 1440, served from the repository by interception
   (read-only): errors, overflow, PS_READY, copy fields, and whether each copy field holds
   exactly the snippet file's HTML. */
const fs = require('fs');
const path = require('path');
const REPO = require('path').resolve(__dirname, '../../..');
const EV = require('path').resolve(__dirname, '../evidence');
const { chromium } = require(REPO + '/node_modules/playwright-core');
const inv = require(EV + '/inv.json');
const ORIGIN = 'http://audit.test';
const TYPES = { html: 'text/html; charset=utf-8', css: 'text/css', js: 'application/javascript', svg: 'image/svg+xml', png: 'image/png', webp: 'image/webp', jpg: 'image/jpeg', json: 'application/json' };
(async () => {
  const br = await chromium.launch({ channel: 'chrome' });
  const out = {};
  for (const w of [375, 768, 1440]) {
    const ctx = await br.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
    await ctx.route(ORIGIN + '/**', async rt => {
      const u = new URL(rt.request().url()); const file = path.join(REPO, 'site', decodeURIComponent(u.pathname));
      if (fs.existsSync(file) && fs.statSync(file).isFile()) return rt.fulfill({ status: 200, contentType: TYPES[path.extname(file).slice(1)] || 'application/octet-stream', body: fs.readFileSync(file) });
      return rt.fulfill({ status: 404, body: 'nf' });
    });
    for (const f of ['section-library.html', 'index.html', 'canvas-integration.html', 'powerpoint-plagiarism-checker.html', 'faq-and-support.html']) {
      const p = await ctx.newPage(); const errs = [];
      p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
      p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)); });
      p.on('response', q => { if (q.status() >= 400 && q.url().startsWith(ORIGIN)) errs.push(q.status() + ' ' + q.url().replace(ORIGIN, '')); });
      await p.goto(ORIGIN + '/' + f, { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
      const r = await p.evaluate(() => ({ ready: !!window.PS_READY, sw: document.documentElement.scrollWidth, vw: innerWidth,
        fields: [...document.querySelectorAll('textarea[id^="snippet-"]')].map(t => ({ id: t.id, len: t.value.length, v: t.value })),
        chapters: [...document.querySelectorAll('section[id^="lib-"]')].map(s => s.id) }));
      let match = null;
      if (f === 'section-library.html') {
        match = r.fields.map((t, i) => { const s = inv.snippets[i]; const file = fs.readFileSync(path.join(REPO, s.path), 'utf8').replace(/\r?\n$/, ''); return t.v === file ? null : s.file; }).filter(Boolean);
      }
      out[f + '@' + w] = { ready: r.ready, sw: r.sw, vw: r.vw, errors: errs, fields: r.fields.length, chapters: r.chapters.length, fieldMismatch: match };
      console.log(f.padEnd(36) + '@' + w + ' ready ' + r.ready + ' scrollWidth ' + r.sw + (f === 'section-library.html' ? ' ; copy fields ' + r.fields.length + ' ; chapters ' + r.chapters.length + ' ; fields ≠ snippet file: ' + (match.length ? match.join(' ') : 'none') : '') + (errs.length ? ' ; ERR ' + errs.slice(0, 2).join(' | ') : ''));
      await p.close();
    }
    await ctx.close();
  }
  fs.writeFileSync(EV + '/catalogue-browser.json', JSON.stringify(out, null, 1));
  await br.close();
})();
