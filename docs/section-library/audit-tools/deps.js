/* Per snippet: which source stylesheet partials define a class it uses, which shared
   script modules look for a hook it carries, which files outside the page it loads, and
   when the snippet file last changed. Read-only. Writes deps.json. */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const REPO = require('path').resolve(__dirname, '../../..');
const EV = require('path').resolve(__dirname, '../evidence');
const inv = require(EV + '/inv.json');

/* class → partials that define it (a selector naming the class) */
const cssFiles = [
  ...fs.readdirSync(REPO + '/build/assets/css').filter(f => /^\d\d-.*\.css$/.test(f)).map(f => 'build/assets/css/' + f),
  ...fs.readdirSync(REPO + '/build/sections').filter(f => f.endsWith('.css')).map(f => 'build/sections/' + f),
];
const defines = {};
for (const f of cssFiles) {
  const css = fs.readFileSync(path.join(REPO, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of css.matchAll(/([^{}]+)\{/g)) for (const c of m[1].matchAll(/\.([a-zA-Z][\w-]*)/g)) (defines[c[1]] = defines[c[1]] || new Set()).add(f);
}
/* module → how it finds its elements (from reading each module's code) */
const MODULES = [
  ['build/assets/js/20-motion.js', h => /class="[^"]*\b(rv|rv-kids|pen-word|ring-word)\b/.test(h)],
  ['build/assets/js/18-pen-mark.js', h => /\bpen-mark\b/.test(h)],
  ['build/assets/js/22-hero-title.js', h => /data-hero-title/.test(h)],
  ['build/assets/js/24-odometer.js', h => /\bod-num\b/.test(h)],
  ['build/assets/js/26-count-up.js', h => /data-count[\s=>]/.test(h)],
  ['build/assets/js/30-checker.js', h => /data-checker[\s=>]/.test(h)],
  ['build/assets/js/35-form-arrive.js', h => /data-focus-first/.test(h)],
  ['build/assets/js/36-inquiry-form.js', h => /data-inquiry-form/.test(h)],
  ['build/assets/js/37-dropdown.js', h => /<select[^>]*class="[^"]*\b(dd-select|cf-field)\b/.test(h)],
  ['build/assets/js/40-report.js', h => /data-report[\s=>]/.test(h)],
  ['build/assets/js/42-report-pass.js', h => /data-report-scan/.test(h)],
  ['build/assets/js/44-review-rating.js', h => /review-rating[^>]*data-rating|data-rating[^>]*review-rating/.test(h)],
  ['build/assets/js/45-carousel.js', h => /data-carousel[\s=>]/.test(h)],
  ['build/assets/js/45-scroll-fade.js', h => /data-scroll-fade/.test(h)],
  ['build/assets/js/50-faq.js', h => /data-faq[\s=>]/.test(h)],
  ['build/assets/js/52-evidence.js', h => /data-tabs|data-zoom/.test(h)],
  ['build/assets/js/60-pricing.js', h => /data-pricing[\s=>]/.test(h)],
  ['build/assets/js/85-modal.js', h => /data-modal-open/.test(h)],
];
const out = {};
for (const s of inv.snippets) {
  const html = fs.readFileSync(path.join(REPO, s.path), 'utf8');
  const classes = new Set(); for (const m of html.matchAll(/\sclass="([^"]*)"/g)) m[1].split(/\s+/).filter(Boolean).forEach(c => classes.add(c));
  const css = new Set(); const tailwind = [];
  for (const c of classes) { if (defines[c]) defines[c].forEach(f => css.add(f)); else tailwind.push(c); }
  const js = MODULES.filter(([, t]) => t(html)).map(([f]) => f);
  const assets = [...new Set([...html.matchAll(/\s(?:src|poster)="([^"]+)"/g)].map(m => m[1]).concat([...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap(m => m[1].split(',').map(x => x.trim().split(/\s+/)[0]))))];
  const missingAssets = assets.filter(a => a.startsWith('/') && !fs.existsSync(path.join(REPO, 'site', a)));
  const last = execFileSync('git', ['log', '-1', '--format=%h %cs', '--', s.path], { cwd: REPO }).toString().trim();
  out[s.file] = { css: [...css].sort(), tailwindClasses: tailwind.length, js, assets, missingAssets, lastChange: last };
}
fs.writeFileSync(EV + '/deps.json', JSON.stringify(out, null, 1));
for (const [f, d] of Object.entries(out)) console.log(f.padEnd(32) + ' css ' + d.css.length + ' tw ' + d.tailwindClasses + ' js ' + d.js.map(x => x.replace('build/assets/js/', '')).join(',') + ' assets ' + d.assets.length + (d.missingAssets.length ? ' MISSING ' + d.missingAssets.join(' ') : '') + ' ' + d.lastChange);
