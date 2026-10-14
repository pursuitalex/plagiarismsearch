/* Every catalogue snippet, alone in an empty page that loads only the shared assets, in a
   real Chrome (playwright-core, channel chrome), read-only. Files are served from the
   repository's site/ by request interception: nothing is written to the repository.

   For each snippet:
     A  "as published"  <main> + the snippet as the catalogue gives it
     B  "CMS SIMULATION" — NOT a CMS: <main><div> + the snippet </div>, and every attribute
        written without a value given the value "1" (the behaviour the developer described:
        <div data-x> → <div data-x="1">). Links are NOT rewritten: the CMS rule is unknown.
   At 375 / 768 / 1440, reduced motion: script errors, PS_READY, horizontal overflow,
   content left invisible, A vs B pixel by pixel, and the component's own behaviour
   (FAQ, carousel, pricing switch, report selection, checker count, inquiry form) on A and
   on B. Then once at 1440: JavaScript off, and motion on (reveals must finish).
   node snip-browser.js [filter]  → snip-browser.json */
const fs = require('fs');
const path = require('path');
const REPO = require('path').resolve(__dirname, '../../..');
const EV = require('path').resolve(__dirname, '../evidence');
const { chromium } = require(REPO + '/node_modules/playwright-core');
const { PNG } = require(REPO + '/node_modules/pngjs');
const pixelmatch = require(REPO + '/node_modules/pixelmatch');
const pageShell = require(REPO + '/build/page');
const inv = require(EV + '/inv.json');
const ORIGIN = 'http://audit.test';
const TYPES = { html: 'text/html; charset=utf-8', css: 'text/css', js: 'application/javascript', svg: 'image/svg+xml', png: 'image/png', webp: 'image/webp', jpg: 'image/jpeg', json: 'application/json', woff2: 'font/woff2', txt: 'text/plain' };
const filter = process.argv[2] || '';

/* valueless attributes → ="1", in tags only (never inside a <script> or <style> body) */
function normalise(html) {
  const parts = html.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>)/i);
  return parts.map((p, i) => {
    if (i % 2) return p.replace(/^<script\b([^>]*)>/i, (m, a) => '<script' + fixAttrs(a) + '>');
    return p.replace(/<([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g, (m, tag, a) => '<' + tag + fixAttrs(a) + '>');
  }).join('');
}
function fixAttrs(a) {
  /* walk the attribute string token by token so quoted values are left alone */
  let out = '', i = 0;
  const re = /(\s+)([^\s=/"'>]+)(\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?|(\s*\/?\s*)$/g;
  let m;
  while ((m = re.exec(a)) && m[0] !== '') {
    if (m[2]) out += m[1] + m[2] + (m[3] !== undefined ? m[3] : '="1"');
    else out += m[0];
    if (re.lastIndex >= a.length) break;
  }
  return out;
}
const wrapB = html => '<div>\n' + normalise(html) + '\n</div>';

function pageFor(s, mode) {
  const body = mode === 'B' ? wrapB(s.html) : s.html;
  /* a block that lives inside another component gets a plain container standing in for its host, as in the catalogue */
  const host = s.isSection ? body : `<div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-10">\n${body}\n</div>`;
  return pageShell.render({ title: 'audit ' + s.file + ' ' + mode, sections: [host], chrome: false });
}

/* runs in the page: the state worth comparing */
const probe = () => {
  const main = document.querySelector('main');
  const vis = el => { const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.02; };
  const invisible = [...main.querySelectorAll('h1,h2,h3,p,li,a,button,img,blockquote')].filter(el => {
    if (el.closest('[hidden], [aria-hidden="true"], .sr-only, template, details:not([open]) > :not(summary)')) return false;
    if (el.closest('.faq-a') && !el.closest('.faq-item.open')) return false;
    let n = el; while (n && n !== main) { if (!vis(n)) return true; n = n.parentElement; } return false;
  }).length;
  return { ready: !!window.PS_READY, sw: document.documentElement.scrollWidth, vw: innerWidth, invisible, height: document.documentElement.scrollHeight };
};

/* runs in the page: exercise the component, return what happened */
const behave = async () => {
  const r = {};
  const wait = ms => new Promise(f => setTimeout(f, ms));
  /* FAQ */
  const faq = document.querySelector('[data-faq]');
  if (faq) {
    const qs = [...faq.querySelectorAll('.faq-q')];
    const pairs = qs.map(q => { const id = q.getAttribute('aria-controls'); const a = id && document.getElementById(id); return !!a && a.classList.contains('faq-a') && document.querySelectorAll('[id="' + CSS.escape(id) + '"]').length === 1; });
    const q = qs[qs.length > 1 ? 1 : 0];
    const before = q.getAttribute('aria-expanded');
    q.click(); await wait(450);
    const after = q.getAttribute('aria-expanded');
    q.focus(); q.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    r.faq = { items: qs.length, pairsOk: pairs.every(Boolean), toggled: before !== after, focusable: document.activeElement === q };
  }
  /* carousel */
  const car = document.querySelector('[data-carousel]');
  if (car) {
    const track = car.querySelector('[data-carousel-track]');
    const dots = car.querySelectorAll('[data-carousel-dots] > *').length;
    const x0 = track.scrollLeft; car.querySelector('[data-carousel-next]').click(); await wait(900);
    r.carousel = { dots, moved: track.scrollLeft !== x0 || track.scrollWidth <= track.clientWidth + 2 };
  }
  /* pricing */
  const pr = document.querySelector('[data-pricing]');
  if (pr) {
    const tabs = [...pr.querySelectorAll('.period-btn')];
    const price = () => [...pr.querySelectorAll('[data-tier]')].map(c => c.textContent.replace(/\s+/g, ' ').trim()).join('|');
    const p0 = price(); const t = tabs.find(b => !b.classList.contains('active')); if (t) t.click(); await wait(500);
    const p1 = price();
    const rec = pr.querySelector('input[data-recurring]');
    let recurFlip = null;
    if (rec && !rec.disabled) { const a = price(); rec.click(); await wait(400); recurFlip = price() !== a; rec.click(); await wait(300); }
    r.pricing = { ready: pr.dataset.pricingReady === '1', tabs: tabs.length, switched: p0 !== p1, recurFlip };
  }
  /* report */
  const rep = document.querySelector('[data-report]');
  if (rep) {
    const marks = [...rep.querySelectorAll('.cab-mark')];
    const last = marks.find(m => m.dataset.match !== (marks[0] && marks[0].dataset.match));
    const onBefore = rep.querySelectorAll('.cab-src.on').length;
    if (last) { last.click(); await wait(200); }
    r.report = { marks: marks.length, initial: onBefore > 0, picked: last ? last.classList.contains('on') : null };
  }
  /* checker */
  const ck = document.querySelector('form[data-checker]');
  if (ck) {
    const ta = ck.querySelector('[data-checker-text]'), cnt = ck.querySelector('[data-checker-count]');
    const c0 = cnt ? cnt.textContent : null;
    ta.value = 'one two three four five six seven'; ta.dispatchEvent(new Event('input', { bubbles: true })); await wait(150);
    r.checker = { counted: cnt ? cnt.textContent !== c0 : null };
  }
  /* inquiry form */
  const f = document.querySelector('form[data-inquiry-form]');
  if (f) {
    const labels = [...f.querySelectorAll('label[for]')];
    const ok = labels.every(l => { const c = document.getElementById(l.htmlFor); return !!c && f.contains(c); });
    const href0 = location.href; let navigated = false;
    window.addEventListener('beforeunload', () => { navigated = true; });
    const btn = f.querySelector('[type="submit"]'); if (btn) btn.click(); await wait(300);
    r.inquiry = { labels: labels.length, pairsOk: ok, stayed: !navigated && location.href === href0, successHidden: [...f.querySelectorAll('[role="status"]')].every(s => s.hidden || s.closest('[hidden]')) };
  }
  /* any fragment link inside the snippet: its target exists once */
  const frags = [...document.querySelectorAll('main a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(Boolean);
  r.fragments = { links: frags.length, resolved: frags.filter(id => document.querySelectorAll('[id="' + CSS.escape(id) + '"]').length === 1).length };
  /* ids unique */
  const ids = [...document.querySelectorAll('[id]')].map(x => x.id);
  r.idsUnique = new Set(ids).size === ids.length;
  return r;
};

(async () => {
  const snippets = inv.snippets.filter(s => !filter || s.file.includes(filter)).map(s => ({ ...s, html: fs.readFileSync(path.join(REPO, s.path), 'utf8').trim() }));
  const br = await chromium.launch({ channel: 'chrome' });
  const generated = {};
  const route = async (ctx) => ctx.route(ORIGIN + '/**', async rt => {
    const u = new URL(rt.request().url());
    if (generated[u.pathname]) return rt.fulfill({ status: 200, contentType: TYPES.html, body: generated[u.pathname] });
    const file = path.join(REPO, 'site', decodeURIComponent(u.pathname));
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return rt.fulfill({ status: 200, contentType: TYPES[path.extname(file).slice(1)] || 'application/octet-stream', body: fs.readFileSync(file) });
    return rt.fulfill({ status: 404, body: 'not found' });
  });
  const results = [];
  for (const s of snippets) {
    const res = { file: s.file, component: s.component, widths: {}, noJs: null, motion: null };
    for (const mode of ['A', 'B']) generated['/__audit/' + s.file + '.' + mode + '.html'] = pageFor(s, mode);
    for (const w of [375, 768, 1440]) {
      const ctx = await br.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' }); await route(ctx);
      const shots = {}, row = {};
      for (const mode of ['A', 'B']) {
        const p = await ctx.newPage(); const errs = [];
        p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
        p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
        p.on('requestfailed', q => errs.push('request failed ' + q.url()));
        p.on('response', q => { if (q.status() >= 400 && q.url().startsWith(ORIGIN)) errs.push(q.status() + ' ' + q.url().replace(ORIGIN, '')); });
        await p.goto(ORIGIN + '/__audit/' + s.file + '.' + mode + '.html', { waitUntil: 'networkidle' });
        await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
        const st = await p.evaluate(probe);
        shots[mode] = PNG.sync.read(await p.screenshot({ fullPage: true }));
        const b = await p.evaluate(behave);
        row[mode] = { ...st, errors: errs, behaviour: b };
        await p.close();
      }
      const A = shots.A, B = shots.B;
      let px = null;
      if (A.width === B.width && A.height === B.height) px = pixelmatch(A.data, B.data, null, A.width, A.height, { threshold: 0.1 });
      row.pixelsAB = px === null ? 'size ' + A.width + 'x' + A.height + ' vs ' + B.width + 'x' + B.height : px;
      row.behaviourSame = JSON.stringify(row.A.behaviour) === JSON.stringify(row.B.behaviour);
      res.widths[w] = row;
      await ctx.close();
    }
    /* JavaScript off */
    { const ctx = await br.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false }); await route(ctx);
      const p = await ctx.newPage(); await p.goto(ORIGIN + '/__audit/' + s.file + '.A.html', { waitUntil: 'networkidle' });
      res.noJs = await p.evaluate(probe); await ctx.close(); }
    /* motion on: scroll through, the reveals must finish */
    { const ctx = await br.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' }); await route(ctx);
      const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
      await p.goto(ORIGIN + '/__audit/' + s.file + '.B.html', { waitUntil: 'networkidle' });
      const h = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y <= h; y += 400) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(120); }
      await p.waitForTimeout(1600);
      res.motion = { ...(await p.evaluate(probe)), errors: errs, mode: 'B' }; await ctx.close(); }
    results.push(res);
    const w = res.widths;
    const flags = [];
    for (const k of [375, 768, 1440]) {
      for (const m of ['A', 'B']) { const x = w[k][m]; if (x.errors.length) flags.push(k + m + ' errors: ' + x.errors[0]); if (!x.ready) flags.push(k + m + ' PS_READY false'); if (x.sw > x.vw) flags.push(k + m + ' overflow ' + x.sw); if (x.invisible) flags.push(k + m + ' invisible ' + x.invisible); }
      if (w[k].pixelsAB !== 0) flags.push(k + ' A≠B pixels ' + w[k].pixelsAB);
      if (!w[k].behaviourSame) flags.push(k + ' behaviour A≠B');
    }
    if (res.noJs.invisible) flags.push('noJS invisible ' + res.noJs.invisible);
    if (res.noJs.sw > res.noJs.vw) flags.push('noJS overflow');
    if (res.motion.invisible) flags.push('motion invisible ' + res.motion.invisible);
    if (res.motion.errors.length) flags.push('motion errors ' + res.motion.errors[0]);
    console.log((flags.length ? 'LOOK ' : 'ok   ') + s.file.padEnd(32) + ' ' + JSON.stringify(w[1440].A.behaviour).slice(0, 200) + (flags.length ? '\n       ' + flags.join(' | ') : ''));
  }
  fs.writeFileSync(EV + '/snip-browser' + (filter ? '-' + filter : '') + '.json', JSON.stringify(results, null, 1));
  await br.close();
})();
