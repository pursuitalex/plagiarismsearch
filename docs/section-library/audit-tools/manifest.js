/* Write docs/section-library/SECTION_MANIFEST_2026-10-14.csv and SNIPPET_INDEX_2026-10-14.json
   from the audit's measurements (inv.json, deps.json, instances.json, validator-cms.json,
   snip-browser.json). One row per catalogue snippet. Only the two docs files are written. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const REPO = require('path').resolve(__dirname, '../../..');
const EV = require('path').resolve(__dirname, '../evidence');
const OUT = REPO + '/docs/section-library/';
const inv = require(EV + '/inv.json'), deps = require(EV + '/deps.json'), inst = require(EV + '/instances.json');
const vcms = Object.fromEntries(require(EV + '/validator-cms.json').map(x => [x.file, x]));
const sb = Object.fromEntries(require(EV + '/snip-browser.json').map(x => [x.file, x]));
const HEAD = '76d63e5';
const PROTO = 'https://plagiarismsearch.vercel.app/';

const KEPT = new Set(['feature-cards-inline-head.html', 'steps-rows-icon.html']);
const SEALED_RENDERER = { checker: 'build/checker.js', report: 'build/report.js', 'pricing-periods': 'build/pricing.js', 'pricing-plans': 'build/pricing.js', media: '(page diagram; rendered by the template from the calling generator)' };

/* readiness — primary class, from what the snippet depends on */
function readiness(s) {
  const d = deps[s.file];
  if (s.component === 'inquiry-form' || s.component === 'pricing-preview') return 'WIDGET_INTEGRATION';
  if (s.component === 'hero' && s.slots.includes('checker')) return 'WIDGET_INTEGRATION';
  if (s.component === 'report-showcase') return 'CMS_TEST_REQUIRED';
  const js = d.js.filter(f => !/20-motion\.js$/.test(f));
  return js.length ? 'READY_WITH_SHARED_JS' : 'READY_STATIC';
}
const KEEPSIG = /^(data-layout|data-size|data-cols|data-marker|data-link|data-variant|data-span|data-glow)=/;
const sig = c => c.split(' ').filter(x => KEEPSIG.test(x)).sort().join(' ');
const conf = Object.fromEntries(inst.snippetConfigs.map(x => [x.file, x.config]));

function backend(s) {
  if (s.component === 'inquiry-form') return 'Form submission endpoint + server-side validation: NOT FOUND (form has onsubmit="return false", no action). Success block present (hidden, role=status).';
  if (s.component === 'pricing-preview') return 'Production pricing source: NOT FOUND in repo (prototype data build/pricing-data.js via JSON island; Recommended plan hard-wired to standard in build/pricing.js); order links to payment.html#plan=…';
  if (s.component === 'hero' && s.slots.includes('checker')) return 'Production checker widget for data-slot="checker": NOT FOUND (prototype form, onsubmit="return false"; 30-checker.js counts words only).';
  if (s.component === 'report-showcase') return 'None at runtime (static sample report, build/report.js); figures are product illustration.';
  if (s.component === 'reviews') return 'None at runtime (curated quotes, build/reviews.js); words checked by build/check-home.js and build/check-ua.js.';
  if (s.component === 'stat-rail') return 'None at runtime; figures are product claims.';
  return 'none';
}
function editable(c) { return (c.editable || []).map(e => e.field).join('; '); }
function variants(c) { const out = []; for (const [part, set] of Object.entries(c.variants || {})) for (const [a, spec] of Object.entries(set)) out.push(part + ':' + a + '=' + spec.values.join('|') + (spec.required ? '(req)' : '')); return out.join('; '); }
function linkRisk(s) {
  const frag = s.hrefs.filter(h => h.startsWith('#')), rel = s.hrefs.filter(h => /\.html/.test(h)), abs = s.hrefs.filter(h => /^https?:/.test(h)), mail = s.hrefs.filter(h => h.startsWith('mailto:'));
  const parts = [];
  if (rel.length) parts.push(rel.length + ' prototype .html link(s) to map to production URLs (' + [...new Set(rel)].join(' ') + ')');
  if (frag.length) parts.push(frag.length + ' in-page #fragment link(s) (' + [...new Set(frag)].join(' ') + '): target id must exist on the page; keep href="#id" form (scripts select a[href^="#"])');
  if (abs.length) parts.push(abs.length + ' absolute link(s)');
  if (mail.length) parts.push(mail.length + ' mailto');
  if (s.useRefs.length && !frag.length) parts.push('fragment refs: ' + s.useRefs.join(' '));
  return (parts.join(' | ') || 'no links') + ' | CMS rewrite rule UNKNOWN: NOT TESTED';
}
/* attributes written without a value, read from the file with every quoted value blanked
   first (so words inside aria-label="…" are not taken for attributes) */
function valueless(file) {
  const h = fs.readFileSync(path.join(REPO, file), 'utf8').replace(/<script[\s\S]*?<\/script>/g, m => m.replace(/>[\s\S]*<\//, '></'));
  const set = new Set();
  for (const m of h.matchAll(/<([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g)) {
    const a = m[2].replace(/"[^"]*"|'[^']*'/g, '""');
    for (const x of a.matchAll(/\s([a-zA-Z][\w:-]*)(?=\s|\/?$)(?!\s*=)/g)) set.add(m[1].toLowerCase() + '[' + x[1] + ']');
  }
  return [...set];
}
function bareRisk(s) {
  const bare = valueless(s.path);
  const v = vcms[s.file];
  const val = v.errorsNormaliseOnly ? 'VALIDATOR REJECTS after ="1" (' + v.errorsNormaliseOnly + ' errors) — decision B4' : 'validator accepts ="1"';
  return (bare.length ? bare.length + ' valueless attr(s): ' + bare.join(' ') + '; scripts/CSS read them by presence (code read; simulated OK)' : 'no valueless attributes') + ' | ' + val;
}
function wrapRisk(s) {
  const r = sb[s.file];
  const px = r ? [375, 768, 1440].map(w => r.widths[w].pixelsAB).join('/') : 'n/a';
  const same = r ? [375, 768, 1440].every(w => r.widths[w].behaviourSame) : null;
  return 'validator: placement warning only; CSS has no main>/sibling section selectors; simulated wrapper+="1": pixels A→B ' + px + ' at 375/768/1440; behaviour ' + (same ? 'identical' : 'DIFFERS') + ' | real CMS NOT TESTED';
}
function jsRisk(s) {
  const d = deps[s.file];
  const js = d.js.map(f => path.basename(f)).join(', ');
  const notes = ['initialises once at DOMContentLoaded (PS.start); later-injected HTML needs PS.start() again', 'copy from source/catalogue only: a DOM copy carries data-*-ready flags and stays inert (tested on FAQ, carousel)'];
  if (s.component === 'pricing-preview') notes.push('needs the inline JSON island; island stripped → tabs inert, first-paint one-time prices stay (tested)');
  if (s.component === 'report-showcase') notes.push('8 inline style="" in the sealed report; stripped → meters/legend blank (tested)');
  return (js || 'none') + ' — ' + notes.join('; ');
}
function verification(s) {
  const r = sb[s.file];
  if (!r) return ['NOT TESTED in browser', 'n/a'];
  const flags = [];
  for (const w of [375, 768, 1440]) for (const m of ['A', 'B']) { const x = r.widths[w][m]; if (x.errors.length) flags.push(w + m + ' errors'); if (!x.ready) flags.push(w + m + ' PS_READY false'); if (x.sw > x.vw) flags.push(w + m + ' overflow'); }
  const inv = r.widths[1440].A.invisible;
  const beh = JSON.stringify(r.widths[1440].A.behaviour);
  const status = 'VALIDATOR PASS (HEAD ' + HEAD + '); CHROME 375/768/1440 ' + (flags.length ? 'ISSUES: ' + flags.join(', ') : 'PASS') + ' as published and CMS-simulated; no-JS content visible: ' + (r.noJs.invisible ? 'NO (' + r.noJs.invisible + ' hidden — see evidence)' : 'yes') + '; REAL CMS NOT TESTED';
  const ev = 'node build/check-library.js (exit 0); audit-tools/snip-browser.js → evidence/snip-browser.json; behaviour@1440: ' + beh + (inv ? '; ' + inv + ' element(s) at opacity 0 by design (hover/focus arrows)' : '');
  return [status, ev];
}
function action(s, st) {
  const out = [];
  let pr = 'P3';
  if (st === 'WIDGET_INTEGRATION') { out.push('Developer: bind widget/backend before public use'); pr = 'P0'; }
  if (st === 'CMS_TEST_REQUIRED') { out.push('Owner+developer: decide B5 (inline styles) or prove style survives; include in CMS trial'); pr = 'P1'; }
  if (vcms[s.file].errorsNormaliseOnly) { out.push('Owner: decide B4 (validator vs ="1")'); if (pr === 'P3') pr = 'P1'; }
  if (KEPT.has(s.file)) { out.push('Owner: keep or retire stored rendering (B10)'); if (pr === 'P3') pr = 'P2'; }
  if (s.hrefs.some(h => /\.html/.test(h))) out.push('Owner: map prototype links to production URLs on paste');
  if (s.ids.some(i => /^example-/.test(i))) out.push('Owner: rename example-* id on paste');
  if (!out.length) out.push('none beyond the copy procedure');
  return [out.join('; '), pr];
}
const csv = v => { const t = String(v === undefined || v === null ? '' : v); return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };
const COLS = 'component_id,variant_id,catalogue_anchor,section_label,readiness_status,approved,source_template_path,source_contract_path,source_validator_path,source_catalogue_path,source_css_path,generated_html_path,source_page_urls,shared_js_paths,asset_paths,sealed_slots,editable_fields,allowed_variants,required_attrs,unique_id_rules,cms_wrap_risk,cms_link_risk,cms_bare_attribute_risk,js_init_risk,backend_dependency,verification_status,verification_evidence,owner_action,priority'.split(',');
const rows = [];
const index = [];
for (const s of inv.snippets) {
  const c = inv.components.find(x => x.name === s.component);
  const d = deps[s.file];
  const st = readiness(s);
  const twins = [...new Set(inst.instances.filter(i => i.component === s.component && sig(i.config) === sig(conf[s.file])).map(i => i.page))];
  const tmpl = [c.files.template, ...new Set(s.slots.map(x => SEALED_RENDERER[x]).filter(x => x && x.startsWith('build/')))].join(' + ');
  const approved = KEPT.has(s.file) ? 'yes — V1 (2026-10-05); stored rendering, source page removed 2026-10-07 (' + 'build/sections/kept/' + s.file + ')'
    : 'yes — V1 (2026-10-05)' + (d.lastChange.split(' ')[1] > '2026-10-05' ? '; re-rendered ' + d.lastChange + ' with an approved page change' : '');
  const required = [...new Set(variants(c).split('; ').filter(x => /\(req\)$/.test(x)).map(x => x.replace(/\(req\)$/, '')))].concat([...new Set(valueless(s.path).filter(b => /data-/.test(b)).map(b => b.replace(/^.*\[|\]$/g, '')))]).join('; ');
  const idRule = (s.ids.length ? s.ids.length + ' id(s): ' + s.ids.slice(0, 6).join(' ') + (s.ids.length > 6 ? ' …' : '') + '. ' : 'no ids. ') +
    (s.component === 'faq' ? 'Answer ids/aria-controls repaired by 50-faq.js; section id must be unique by hand.' :
      s.component === 'inquiry-form' ? 'Field ids/label for repaired by 36-inquiry-form.js; section id and success-block id unique by hand.' : 'Every id unique on the page by hand; rename example-* ids.') +
    (s.aria.length ? ' aria/for pairs: ' + s.aria.length : '');
  const [vs, ve] = verification(s);
  const [act, pr] = action(s, st);
  /* the stylesheets a snippet draws on, by the classes and slots it carries:
     build/sections/*.css are compiled into site/assets/css/tailwind.css (tailwind.src.css
     @imports them); build/assets/css/NN-*.css are concatenated into site/assets/css/site.css */
  const html0 = fs.readFileSync(path.join(REPO, s.path), 'utf8');
  const lib = ['build/sections/' + s.component + '.css'];
  if (/class="[^"]*\bsection-(eyebrow|title|intro|link|more)\b/.test(html0)) lib.push('build/sections/section-head.css');
  if (/class="[^"]*\baction-(button|link)\b/.test(html0)) lib.push('build/sections/action.css');
  if (/class="[^"]*\bicon-tile\b/.test(html0)) lib.push('build/sections/icon-tile.css');
  const base = ['build/assets/css/01-base.css', 'build/assets/css/02-motion.css', 'build/assets/css/04-buttons.css'];
  if (s.slots.includes('checker')) base.push('build/assets/css/06-controls-phone.css', 'build/assets/css/08-checker.css');
  if (s.slots.includes('report')) base.push('build/assets/css/09-report.css');
  if (s.slots.includes('pricing-plans')) base.push('build/assets/css/17-pricing.css');
  if (s.component === 'inquiry-form') base.push('build/assets/css/06-controls-phone.css', 'build/assets/css/14-forms.css');
  if (/<select[^>]*class="[^"]*\b(dd-select|cf-field)\b/.test(html0)) base.push('build/assets/css/15-dropdown.css');
  for (const f of lib.concat(base)) if (!fs.existsSync(path.join(REPO, f))) throw new Error('missing ' + f);
  const cssPaths = lib.join(' ') + ' → site/assets/css/tailwind.css ; ' + [...new Set(base)].join(' ') + ' → site/assets/css/site.css' + (d.tailwindClasses ? ' ; ' + d.tailwindClasses + ' Tailwind utility classes (sealed blocks) → site/assets/css/tailwind.css' : '');
  rows.push({
    component_id: s.component, variant_id: s.file.replace(/\.html$/, ''),
    catalogue_anchor: 'section-library.html#' + s.anchor + ' (chapter #lib-' + s.component + '; copy action: select all in the read-only textarea)',
    section_label: s.name, readiness_status: st, approved,
    source_template_path: tmpl, source_contract_path: c.files.contract, source_validator_path: c.files.check + ' + build/check-library.js + build/sections/check-tools.js',
    source_catalogue_path: c.files.catalogue + ' + build/section-library.js', source_css_path: cssPaths,
    generated_html_path: s.path + ' ; site/section-library.html',
    source_page_urls: twins.length ? twins.map(p => PROTO + p).join(' ') : 'none — no live page uses this configuration',
    shared_js_paths: d.js.join(' ') + ' (bundled in site/assets/js/site.js)',
    asset_paths: (d.assets.length ? d.assets.join(' ') : 'none') + ' ; global: Google Fonts (Manrope, Newsreader, Flow Circular), site/assets/vendor/gsap/3.12.5/*',
    sealed_slots: s.slots.length ? [...new Set(s.slots)].map(x => 'data-slot="' + x + '"').join(' ') : 'none',
    editable_fields: editable(c), allowed_variants: variants(c), required_attrs: required, unique_id_rules: idRule,
    cms_wrap_risk: wrapRisk(s), cms_link_risk: linkRisk(s), cms_bare_attribute_risk: bareRisk(s), js_init_risk: jsRisk(s),
    backend_dependency: backend(s), verification_status: vs, verification_evidence: ve, owner_action: act, priority: pr,
  });
  const html = fs.readFileSync(path.join(REPO, s.path));
  index.push({ id: s.component + '/' + s.file.replace(/\.html$/, ''), file: s.path, catalogue: 'site/section-library.html#' + s.anchor, sha256: crypto.createHash('sha256').update(html).digest('hex'), bytes: html.length, readiness: st });
}
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(OUT + 'SECTION_MANIFEST_2026-10-14.csv', COLS.join(',') + '\n' + rows.map(r => COLS.map(k => csv(r[k])).join(',')).join('\n') + '\n');
fs.writeFileSync(OUT + 'SNIPPET_INDEX_2026-10-14.json', JSON.stringify({ commit: '76d63e568a05a626159e60a5e219c316dcea196c', generated: '2026-10-14', note: 'Read-only index of the catalogue snippets as committed. The HTML itself is in the listed files; compare a copy against sha256 to detect drift.', snippets: index }, null, 1) + '\n');
const count = {}; rows.forEach(r => count[r.readiness_status] = (count[r.readiness_status] || 0) + 1);
console.log('rows ' + rows.length + ' ; ' + JSON.stringify(count) + ' ; priorities ' + JSON.stringify(rows.reduce((a, r) => (a[r.priority] = (a[r.priority] || 0) + 1, a), {})));
