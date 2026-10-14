/* The Section Library inventory, read from the repository (read-only; requires the
   library's own modules, which only read site/). Writes inv.json next to this file.
     components   the registry, each with its catalogue entry (files, pages) and contract
     snippets     every catalogue snippet: its root, variant attributes, slots, ids, links,
                  assets, scripts, aria pairs, headings — read from the snippet file
     pages        every site/*.html: the top-level sections of <main> and the library roots
                  the validator finds in it */
const fs = require('fs');
const path = require('path');
const REPO = require('path').resolve(__dirname, '../../..');
const EV = require('path').resolve(__dirname, '../evidence');
const REGISTRY = require(REPO + '/build/sections');
const LIB = require(REPO + '/build/check-library');
const T = require(REPO + '/build/sections/check-tools');
const { parse, walk, kids, cls } = T;
const SITE = REPO + '/site';
const SNIP = REPO + '/build/sections/snippets';
const exists = p => fs.existsSync(path.join(REPO, p));

/* the contract's variant switches, as data-* attribute names */
const variantAttrs = C => [...new Set(Object.values(C.variants || {}).flatMap(set => Object.keys(set)))];

const components = REGISTRY.map(c => {
  const cat = require(REPO + '/build/sections/' + c.name + '.catalogue');
  const files = {
    template: 'build/sections/' + c.name + '.js', css: 'build/sections/' + c.name + '.css',
    contract: 'build/sections/' + c.name + '.contract.js', check: 'build/sections/' + c.name + '.check.js',
    catalogue: 'build/sections/' + c.name + '.catalogue.js',
  };
  for (const k in files) if (!exists(files[k])) files[k] = 'NOT FOUND (' + files[k] + ')';
  return { name: c.name, title: c.title, files, catFiles: cat.files, lead: cat.lead,
    pages: cat.pages, variants: c.contract.variants, variantAttrs: variantAttrs(c.contract),
    editable: c.contract.editable, locked: c.contract.locked, snippetFiles: cat.snippets.map(s => s.file) };
});

/* one snippet, read from its file */
function readSnippet(comp, s, index) {
  const file = 'build/sections/snippets/' + s.file;
  const html = fs.readFileSync(path.join(REPO, file), 'utf8');
  const { root } = parse(html);
  const top = kids(root);
  const r = top[0];
  const all = []; walk(root, n => { if (n.tag && n.tag[0] !== '#') all.push(n); });
  const attrList = (n, re) => Object.keys(n.attrs || {}).filter(a => re.test(a));
  const ids = all.filter(n => n.attrs.id).map(n => n.attrs.id);
  const hrefs = all.filter(n => n.tag === 'a' && 'href' in n.attrs).map(n => n.attrs.href);
  const assets = [...new Set(all.flatMap(n => ['src', 'srcset', 'poster', 'data-src'].filter(a => n.attrs[a]).flatMap(a => n.attrs[a].split(',').map(x => x.trim().split(/\s+/)[0]))))];
  const useRefs = [...new Set((html.match(/(?:href|xlink:href)="(#[^"]+)"/g) || []).map(x => x.replace(/.*="/, '').replace('"', '')))];
  const scripts = all.filter(n => n.tag === 'script').map(n => n.attrs.type || 'text/javascript');
  const styles = all.filter(n => n.tag === 'style').length + all.filter(n => 'style' in n.attrs).length;
  const slots = all.filter(n => 'data-slot' in n.attrs).map(n => n.attrs['data-slot']);
  const dataAttrs = {};
  all.forEach(n => attrList(n, /^data-/).forEach(a => { (dataAttrs[a] = dataAttrs[a] || new Set()).add(n.attrs[a]); }));
  const bare = [];   /* data-* written with no value — the CMS turns these into ="1" */
  for (const m of html.matchAll(/<([a-z][\w-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi)) for (const a of m[2].matchAll(/\s(data-[\w-]+|hidden|open|disabled|required|readonly|checked|selected|novalidate|inert|aria-[\w-]+)(?=[\s/>]|$)(?!\s*=)/g)) bare.push(m[1].toLowerCase() + '[' + a[1] + ']');
  const aria = all.filter(n => n.attrs['aria-controls'] || n.attrs['aria-labelledby'] || n.attrs['aria-describedby'] || n.attrs.for).map(n => (n.attrs['aria-controls'] ? 'aria-controls=' + n.attrs['aria-controls'] : '') + (n.attrs['aria-labelledby'] ? 'aria-labelledby=' + n.attrs['aria-labelledby'] : '') + (n.attrs['aria-describedby'] ? 'aria-describedby=' + n.attrs['aria-describedby'] : '') + (n.attrs.for ? 'for=' + n.attrs.for : ''));
  const headings = all.filter(n => /^h[1-6]$/.test(n.tag)).map(n => n.tag);
  const forms = all.filter(n => n.tag === 'form').map(n => Object.entries(n.attrs).map(([k, v]) => k + (v ? '=' + v : '')).join(' '));
  const inputs = all.filter(n => ['input', 'select', 'textarea', 'button'].includes(n.tag)).map(n => n.tag + (n.attrs.type ? '[' + n.attrs.type + ']' : '') + (n.attrs.name ? '@' + n.attrs.name : '') + ('required' in n.attrs ? '*' : ''));
  return {
    component: comp.name, index: index + 1, file: s.file, path: file, name: s.name, about: s.about, uses: s.uses,
    bytes: html.length, topLevel: top.length, rootTag: r ? r.tag : '', rootClass: r ? cls(r).join(' ') : '',
    rootComponent: r ? r.attrs['data-component'] || '' : '', rootId: r ? r.attrs.id || '' : '',
    isSection: !!r && r.tag === 'section',
    variantValues: Object.fromEntries(comp.variantAttrs.map(a => [a, [...(dataAttrs[a] || [])]]).filter(([, v]) => v.length)),
    dataAttrs: Object.fromEntries(Object.entries(dataAttrs).map(([k, v]) => [k, [...v]])),
    slots, ids, hrefs, assets, useRefs, scripts, styles, bare, aria, headings, forms, inputs,
  };
}
let k = 0;
const snippets = [];
for (const comp of components) {
  const cat = require(REPO + '/build/sections/' + comp.name + '.catalogue');
  cat.snippets.forEach((s, i) => { k++; snippets.push({ catalogueIndex: k, anchor: 'snippet-' + k, ...readSnippet(comp, s, i) }); });
}

/* pages: top-level sections of <main>, and the library roots in each */
const pages = fs.readdirSync(SITE).filter(f => f.endsWith('.html')).sort().map(f => {
  const html = fs.readFileSync(path.join(SITE, f), 'utf8');
  const { root } = parse(html);
  let main = null; walk(root, n => { if (!main && n.tag === 'main') main = n; });
  const top = main ? kids(main).map(n => ({ tag: n.tag, component: n.attrs['data-component'] || '', id: n.attrs.id || '', line: n.line })) : [];
  let v = null;
  try { v = f === 'design-system.html' ? null : LIB.validate(html); } catch (e) { v = { error: String(e) }; }
  return { file: f, chrome: /<header\b/.test(html), topSections: top, roots: v && v.roots ? v.roots : [], errors: v && v.errors ? v.errors.length : null, warnings: v && v.warnings ? v.warnings.length : null };
});

fs.writeFileSync(EV + '/inv.json', JSON.stringify({ components, snippets, pages }, null, 1));
console.log('components ' + components.length + ' ; snippets ' + snippets.length + ' ; pages ' + pages.length);
console.log(components.map(c => c.name + ' ' + c.snippetFiles.length).join(' · '));
