/* Site integrity checks. Run after any change that touches more than one page.

   These lived in a scratch directory until 2026-08-14, when it was pruned mid-session
   and every one of them was lost. They live in the repo now.

   Usage:  node build/check.js
   Exit 1 if anything fails, so it can gate a commit.
*/
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const pages = fs.readdirSync(SITE).filter(f => f.endsWith('.html'));
const read = f => fs.readFileSync(path.join(SITE, f), 'utf8');

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};

/* ── 1. structure ───────────────────────────────────────────────────────── */
console.log('structure');
{
  const bad = [];
  for (const f of pages) {
    const s = read(f);
    /* a double prefix (sm:sm:, sm:lg:) silently does nothing — Tailwind emits no rule */
    if (/\b(sm:sm:|lg:lg:|sm:lg:|lg:sm:)/.test(s)) bad.push(f + ' double-prefix');
    for (const tag of ['div', 'section', 'header', 'footer', 'nav', 'a', 'p', 'span', 'button']) {
      const open = (s.match(new RegExp('<' + tag + '[\\s>]', 'g')) || []).length;
      const close = (s.match(new RegExp('</' + tag + '>', 'g')) || []).length;
      if (open !== close) bad.push(f + ' <' + tag + '> ' + open + '/' + close);
    }
  }
  ok('tags balanced, no double prefixes', !bad.length, bad.slice(0, 6).join(', '));
}

/* ── 2. the global shell is built, not hand-edited ──────────────────────── */
console.log('\nglobal shell');
{
  let out = '', pass = true;
  try {
    out = execFileSync(process.execPath, [path.join(__dirname, 'shell.js'), '--check'], { encoding: 'utf8' });
  } catch (e) { pass = false; out = (e.stdout || '') + (e.message || ''); }
  const stale = (out.match(/STALE\s+(\S+)/g) || []).map(x => x.split(/\s+/)[1]);
  ok('every header/footer matches build/shell/', pass, stale.length ? 'stale: ' + stale.join(', ') : '');
}

/* ── 3. links and assets resolve ────────────────────────────────────────── */
console.log('\nlinks');
{
  const EXTERNAL = /^(https?:|mailto:|tel:|data:|viber:|tg:|#)/;
  const broken = [];
  let n = 0;
  for (const f of pages) {
    for (const m of read(f).matchAll(/(?:href|src)="([^"]+)"/g)) {
      const t = m[1];
      if (EXTERNAL.test(t)) continue;
      n++;
      const target = t.split('#')[0].split('?')[0];
      if (!fs.existsSync(path.join(SITE, target))) broken.push(f + ' -> ' + t);
    }
  }
  ok(n + ' internal links/assets resolve', !broken.length, broken.slice(0, 8).join(', '));
}

/* ── 4. one design system, not eighteen ─────────────────────────────────── */
console.log('\ndesign system');
{
  const configs = new Set();
  const noConfig = [];
  for (const f of pages) {
    const s = read(f);
    const a = s.indexOf('tailwind.config');
    if (a < 0) { noConfig.push(f); continue; }
    configs.add(crypto.createHash('sha1').update(s.slice(a, s.indexOf('</script>', a))).digest('hex'));
  }
  ok('tailwind.config identical on every page', configs.size === 1 && !noConfig.length,
     configs.size !== 1 ? configs.size + ' variants' : noConfig.join(', '));

  /* Eyebrows are the smallest type on the site and the easiest to drift. Scoped by
     letter-spacing, because 10px is also used throughout the mock UIs, which have their
     own scale on purpose — matching every 10px class conflates the two.

     Scoped by tracking-[0.22em], which is used by the section eyebrow and nothing else
     (verified: 86 uses, all one signature). Wider scopes were tried and abandoned —
     matching by size or by any letter-spacing pulls in the report/dashboard mock labels,
     which run on their own scale by design, so the check compared two different rulers
     and failed on things that were not defects. Narrow and true beats broad and noisy. */
  const sigs = {};
  for (const f of pages) {
    for (const m of read(f).matchAll(/class="([^"]*tracking-\[0\.22em\][^"]*)"/g)) {
      const sig = (m[1].match(/(?:^|\s)(?:(?:sm|lg):)?text-\[[\d.]+px\]/g) || ['(none)'])
        .map(x => x.trim()).join(' ');
      sigs[sig] = (sigs[sig] || 0) + 1;
    }
  }
  const keys = Object.keys(sigs);
  ok('section eyebrow on one scale', keys.length === 1 && keys[0] === 'text-[10px] sm:text-[10.5px]',
     keys.map(k => sigs[k] + '× ' + k).join(' | '));
}

/* ── 5. the responsive ramp ─────────────────────────────────────────────── */
console.log('\nresponsive ramp');
{
  /* Large values must not be flat: a 40px radius or a 30px type size with no breakpoint
     step means the phone gets the desktop value. Small values are left alone on purpose. */
  const flat = { radius: [], type: [] };
  /* design-system.html is the internal spec sheet: it prints type and radius samples at
     fixed sizes deliberately, so a ramp rule applied to it would only ever be noise */
  for (const f of pages.filter(x => x !== 'design-system.html')) {
    const s = read(f);
    for (const m of s.matchAll(/class="([^"]*)"/g)) {
      const cls = m[1];
      const has = re => re.test(cls);
      for (const r of cls.match(/(?:^|\s)rounded-\[(\d+)px\]/g) || []) {
        const px = +r.match(/(\d+)/)[1];
        if (px >= 20 && !has(/\b(sm|lg):rounded-/)) flat.radius.push(f + ' ' + r.trim());
      }
      for (const t of cls.match(/(?:^|\s)text-\[(\d+(?:\.\d)?)px\]/g) || []) {
        const px = parseFloat(t.match(/([\d.]+)/)[1]);
        if (px >= 20 && !has(/\b(sm|lg):text-\[/)) flat.type.push(f + ' ' + t.trim());
      }
    }
  }
  ok('no flat radius >= 20px', !flat.radius.length, flat.radius.slice(0, 5).join(', '));
  ok('no flat type >= 20px', !flat.type.length, flat.type.slice(0, 5).join(', '));
}

/* ── 6. the auth forms stay inert ───────────────────────────────────────── */
console.log('\nprototype safety');
{
  const a = read('account.html');
  const forms = [...a.matchAll(/<form\b[^>]*>/g)].map(x => x[0]);
  ok('account.html forms submit nowhere', forms.length > 0 &&
     forms.every(x => !/\baction=/.test(x) && /onsubmit="return false"/.test(x)),
     forms.length + ' form(s)');
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok') + '  (' + pages.length + ' pages)');
process.exit(failed ? 1 : 0);
