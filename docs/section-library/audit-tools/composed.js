/* The composed demonstration page, rebuilt for this audit (the one the 5 October report
   describes is not in the repository): one catalogue snippet per component, 13 sections
   in catalogue order, inside the site's own page shell (header and footer from
   build/shell.js's templates are NOT added — the CMS supplies its own chrome), served from
   the repository by interception. Read-only.
     1  the library validator on the composed HTML (as published, and as the CMS
        simulation: each section in an extra <div>, valueless attributes → ="1")
     2  Chrome at 375 / 768 / 1440: errors, PS_READY, overflow, content left invisible,
        each module initialised once per instance (its "ready" flag counted) */
const fs = require('fs');
const path = require('path');
const REPO = require('path').resolve(__dirname, '../../..');
const EV = require('path').resolve(__dirname, '../evidence');
const { chromium } = require(REPO + '/node_modules/playwright-core');
const LIB = require(REPO + '/build/check-library');
const pageShell = require(REPO + '/build/page');
const inv = require(EV + '/inv.json');
const src = fs.readFileSync(__dirname + '/snip-browser.js', 'utf8');
eval(src.match(/function normalise[\s\S]*?\nconst wrapB/)[0].replace(/\nconst wrapB$/, ''));
const ORIGIN = 'http://audit.test';
const TYPES = { html: 'text/html; charset=utf-8', css: 'text/css', js: 'application/javascript', svg: 'image/svg+xml', png: 'image/png', webp: 'image/webp', jpg: 'image/jpeg' };

const pick = inv.components.map(c => inv.snippets.find(s => s.component === c.name && s.isSection));
const parts = pick.map(s => fs.readFileSync(path.join(REPO, s.path), 'utf8').trim());
const htmlA = parts.join('\n\n');
const htmlB = parts.map(h => '<div>\n' + normalise(h) + '\n</div>').join('\n\n');
const pages = {
  '/__audit/composed.A.html': pageShell.render({ title: 'composed A', sections: [htmlA], chrome: false }),
  '/__audit/composed.B.html': pageShell.render({ title: 'composed B', sections: [htmlB], chrome: false }),
};
for (const [k, h] of [['A', htmlA], ['B', htmlB]]) {
  const v = LIB.validate(h);
  console.log('validator ' + k + ': ' + v.roots.length + ' components, ' + v.errors.length + ' errors, ' + v.warnings.length + ' warnings' + (v.errors.length ? ' — ' + v.errors.slice(0, 3).map(e => 'line ' + e.line + ': ' + e.msg).join(' | ') : '') + (v.warnings.length ? ' ; warn: ' + [...new Set(v.warnings.map(w => w.msg.replace(/line \d+/g, '').slice(0, 90)))].slice(0, 3).join(' | ') : ''));
}
console.log('sections: ' + pick.map(s => s.file).join(', '));
(async () => {
  const br = await chromium.launch({ channel: 'chrome' });
  for (const w of [375, 768, 1440]) {
    const ctx = await br.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
    await ctx.route(ORIGIN + '/**', async rt => {
      const u = new URL(rt.request().url());
      if (pages[u.pathname]) return rt.fulfill({ status: 200, contentType: TYPES.html, body: pages[u.pathname] });
      const file = path.join(REPO, 'site', decodeURIComponent(u.pathname));
      if (fs.existsSync(file) && fs.statSync(file).isFile()) return rt.fulfill({ status: 200, contentType: TYPES[path.extname(file).slice(1)] || 'application/octet-stream', body: fs.readFileSync(file) });
      return rt.fulfill({ status: 404, body: 'nf' });
    });
    for (const k of ['A', 'B']) {
      const p = await ctx.newPage(); const errs = [];
      p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
      p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)); });
      p.on('response', q => { if (q.status() >= 400 && q.url().startsWith(ORIGIN)) errs.push(q.status() + ' ' + q.url().replace(ORIGIN, '')); });
      await p.goto(ORIGIN + '/__audit/composed.' + k + '.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
      const r = await p.evaluate(() => {
        const ready = {}; document.querySelectorAll('*').forEach(el => { for (const a of el.getAttributeNames()) if (/^data-.*-ready$/.test(a)) ready[a] = (ready[a] || 0) + 1; });
        const hooks = { 'data-faq-ready': '[data-faq]', 'data-pricing-ready': '[data-pricing]', 'data-report-ready': '[data-report]', 'data-carousel-ready': '[data-carousel]', 'data-inquiry-form-ready': 'form[data-inquiry-form]', 'data-hero-title-ready': '[data-hero-title]' };
        const counts = Object.fromEntries(Object.entries(hooks).map(([f, s]) => [f, document.querySelectorAll(s).length]));
        const ids = [...document.querySelectorAll('[id]')].map(x => x.id);
        return { ready: !!window.PS_READY, sw: document.documentElement.scrollWidth, flags: ready, instances: counts, dupIds: ids.filter((x, i) => ids.indexOf(x) !== i) };
      });
      console.log('@' + w + ' ' + k + ': PS_READY ' + r.ready + ' ; scrollWidth ' + r.sw + ' ; init flags ' + JSON.stringify(r.flags) + ' ; instances ' + JSON.stringify(r.instances) + ' ; repeated ids ' + (r.dupIds.join(',') || 'none') + (errs.length ? ' ; ERR ' + errs.slice(0, 2).join(' | ') : ' ; no errors'));
      await p.close();
    }
    await ctx.close();
  }
  await br.close();
})();
