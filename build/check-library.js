/* Section Library validator — does this HTML keep the library's content contracts?

   It knows every component in the registry (build/sections/index.js: the FAQ, the CTA
   band, …), each through its contract (build/sections/<name>.contract.js) and the rules
   written from it (build/sections/<name>.check.js). It reads a whole page or a bare
   fragment — the HTML an editor pastes into the CMS — finds every library component in it
   and checks the markup the editor may not change, so a broken paste fails here instead of
   on the live page.

   Usage
     node build/check-library.js                      every site/*.html + the catalogue's snippets
     node build/check-library.js <file.html> …        a page, or a fragment saved to a file
     node build/check-library.js --stdin              HTML piped in (a paste)
     require('./build/check-library').validate(html)  → { roots, errors, warnings }

   Exit 1 if any error. Warnings (e.g. an id the script repairs on load) do not fail.

   What it checks, per component found — the component's own check says how:
     structure   the fixed skeleton, part by part and in order
     classes     only the contract's classes on each part; a Tailwind utility is named as such
     variants    every data-* switch present where required, with an allowed value
     content     text where text is expected; the allowed inline tags; nothing empty
     sealed      <svg> icons and a [data-slot] block are not inspected inside
   And for the whole input, whatever the component:
     safety      no style="", no on* handlers, no <script>/<style> inside a component; no
                 javascript: links, target="_blank" only with rel="noopener"
     strays      no part of a component (.faq-item, .cta-title …) outside a complete one
     ids         unique in the whole input (a copied id the script renumbers only warns)
     placement   a section-level component sits at the top level of <main> (a warning) */
const fs = require('fs');
const path = require('path');
const T = require('./sections/check-tools');
const REGISTRY = require('./sections');
const { parse, kids, cls, has, textOf, walk, label } = T;

/* ── find every library component in the input and check it ─────────────────── */
function validate(html) {
  const { root, problems } = parse(html);
  /* exempt: node → the on* attributes its component's contract names (the inquiry form's
     inert onsubmit); every other handler is refused below */
  const ctx = { errors: problems.map(p => ({ line: p.line, msg: 'markup: ' + p.msg })), warnings: [], exempt: new Map() };
  const roots = [];
  const sealed = new Set();
  const covered = new Map();   /* component name → the nodes inside its roots */
  for (const comp of REGISTRY) {
    const r = comp.check.validate(root, ctx);
    r.sealed.forEach(s => sealed.add(s));
    const set = new Set();
    for (const f of r.found) { walk(f.el, n => set.add(n)); roots.push({ comp, ...f }); }
    covered.set(comp.name, set);
  }
  /* everywhere: safety, and no component part outside a recognised component */
  const isSealed = n => { for (let p = n; p; p = p.parent) if (sealed.has(p)) return true; return false; };
  walk(root, n => {
    if (n.tag === '#text' || n.tag === '#root') return;
    let host = null;
    for (const comp of REGISTRY) {
      if (covered.get(comp.name).has(n)) host = host || comp;
      else if (comp.check.isPart(n)) ctx.errors.push({ line: n.line, msg: `${label(n)}: ${comp.check.outside}` });
    }
    if (!host || isSealed(n)) return;
    if (n.tag === 'script' || n.tag === 'style') ctx.errors.push({ line: n.line, msg: `<${n.tag}> is not allowed inside the ${host.title}` });
    if ('style' in n.attrs) ctx.errors.push({ line: n.line, msg: `${label(n)}: style="" is not allowed — the look comes from the library classes` });
    for (const a of Object.keys(n.attrs)) if (/^on/.test(a) && !(ctx.exempt.get(n) || []).includes(a)) ctx.errors.push({ line: n.line, msg: `${label(n)}: ${a} handlers are not allowed` });
  });
  /* ids unique in the whole input */
  const seen = new Map();
  walk(root, n => {
    if (!n.attrs || !n.attrs.id) return;
    if (!seen.has(n.attrs.id)) { seen.set(n.attrs.id, n.line); return; }
    /* a copied part brings its id with it: where the component's script renumbers it on
       load, the copy is a warning */
    const fix = REGISTRY.find(c => c.check.repaired && c.check.repaired(n));
    (fix ? ctx.warnings : ctx.errors).push({ line: n.line, msg: `id "${n.attrs.id}" is used twice (also line ${seen.get(n.attrs.id)})` + (fix ? ' — ' + fix.check.repairedNote : '') });
  });
  /* a page (not a fragment): a section-level component sits at the top level of <main> */
  roots.filter(r => r.kind === 'section').forEach(r => {
    const p = r.el.parent;
    if (p && p.tag !== 'main' && p.tag !== '#root') ctx.warnings.push({ line: r.el.line, msg: `section.${r.comp.name} is inside <${p.tag}> — a ${r.comp.title} section belongs at the top level of <main>` });
  });
  ctx.errors.sort((a, b) => a.line - b.line);
  return {
    errors: ctx.errors, warnings: ctx.warnings,
    roots: roots.sort((a, b) => a.el.line - b.el.line).map(r => ({ component: r.comp.name, kind: r.kind, line: r.el.line, id: r.el.attrs.id || '',
      count: r.count, items: r.count, unit: r.comp.check.unit || '', note: r.note || '' })),
    ...ctx,
  };
}

/* ── command line ───────────────────────────────────────────────────────────── */
function report(name, html, { quiet = false } = {}) {
  const r = validate(html);
  const one = x => `${x.component} ${x.kind}${x.id ? '#' + x.id : ''}${x.note ? ' ' + x.note : ''}${x.count !== undefined ? ` ${x.count} ${x.unit}` : ''}, line ${x.line}`;
  const head = `${name}: ${r.roots.length} component${r.roots.length === 1 ? '' : 's'}` + (r.roots.length ? ' (' + r.roots.map(one).join('; ') + ')' : '');
  if (!r.errors.length && (quiet || !r.warnings.length)) { console.log('  ok    ' + head); return r; }
  console.log((r.errors.length ? '  FAIL  ' : '  ok    ') + head + (r.errors.length ? ` — ${r.errors.length} error(s)` : ''));
  r.errors.slice(0, 25).forEach(e => console.log(`          line ${e.line}: ${e.msg}`));
  if (r.errors.length > 25) console.log(`          … ${r.errors.length - 25} more`);
  if (!quiet) r.warnings.forEach(w => console.log(`          warn line ${w.line}: ${w.msg}`));
  return r;
}

/* The spec sheet draws showcase renditions of the components inside its own frames
   (build/design-system-banners.js), not sections of a page: it is not validated. */
const SKIP = new Set(['design-system.html']);

if (require.main === module) {
  const args = process.argv.slice(2);
  let failed = 0;
  const run = (name, html, o) => { if (report(name, html, o).errors.length) failed++; };
  if (args.includes('--stdin')) {
    run('stdin', fs.readFileSync(0, 'utf8'));
  } else if (args.length) {
    for (const f of args) run(f, fs.readFileSync(f, 'utf8'));
  } else {
    const SITE = path.join(__dirname, '..', 'site');
    const names = REGISTRY.map(c => c.title).join(', ');
    console.log(`Library contracts (${names}) — every page`);
    let n = 0;
    for (const f of fs.readdirSync(SITE).filter(x => x.endsWith('.html') && !SKIP.has(x)).sort()) {
      const html = fs.readFileSync(path.join(SITE, f), 'utf8');
      if (!REGISTRY.some(c => c.check.mentions(html))) continue;
      n++; run(f, html, { quiet: false });
    }
    console.log(`  (${n} pages with library markup; not validated: ${[...SKIP].join(', ')} — showcase renditions)`);
    /* the catalogue's copy-paste snippets, one by one, as a CMS paste would be */
    const LIB = path.join(__dirname, 'sections', 'snippets');
    const snippet = f => (fs.existsSync(path.join(LIB, f)) ? fs.readFileSync(path.join(LIB, f), 'utf8') : null);
    if (fs.existsSync(LIB)) {
      console.log('\nLibrary contracts — the catalogue snippets (as pasted)');
      for (const f of fs.readdirSync(LIB).filter(x => x.endsWith('.html')).sort()) run('snippets/' + f, fs.readFileSync(path.join(LIB, f), 'utf8'));
    }
    /* the validator must also say no: each known-bad paste has to fail, each allowed
       edit has to pass. An entry: [what, edit, snippet file (default: the component's)] */
    for (const comp of REGISTRY) {
      const K = comp.check;
      if (!K.SNIPPET) continue;
      const edits = (list, wantErrors) => {
        for (const [what, edit, file = K.SNIPPET] of list) {
          const base = snippet(file);
          const out = base === null ? null : edit(base);
          const r = out === null || out === base ? null : validate(out);
          const pass = !!r && (wantErrors ? r.errors.length > 0 : !r.errors.length);
          if (!pass) failed++;
          const why = !r ? (base === null ? `  — no snippet ${file}` : (wantErrors ? '  — mutation did not apply' : '  — edit did not apply'))
            : wantErrors ? (pass ? `  (${r.errors[0].msg.slice(0, 90)})` : '  — accepted!')
              : (pass ? '' : `  — rejected: ${r.errors[0].msg.slice(0, 110)}`);
          console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + (wantErrors ? 'rejects ' : 'accepts ') + what + why);
        }
      };
      console.log(`\n${comp.title} contract — the validator rejects known-bad pastes`);
      edits(K.BAD, true);
      /* …and yes to the edits the contract allows */
      console.log(`\n${comp.title} contract — the validator accepts allowed edits`);
      edits(K.GOOD, false);
    }
  }
  console.log(failed ? `\n${failed} input(s) FAILED the library contract` : '\nall inputs keep the library contract');
  process.exit(failed ? 1 : 0);
}

module.exports = { validate, parse, walk, kids, cls, has, textOf, REGISTRY };
