/* Every library instance on the site, with its variant configuration, and whether a
   catalogue snippet carries the same configuration. Read-only. Writes instances.json.
   A configuration = the component's contract variant attributes (data-*) found anywhere
   inside the instance, as a sorted "attr=value" list. */
const fs = require('fs');
const path = require('path');
const REPO = require('path').resolve(__dirname, '../../..');
const EV = require('path').resolve(__dirname, '../evidence');
const LIB = require(REPO + '/build/check-library');
const { parse, walk } = require(REPO + '/build/sections/check-tools');
const inv = require(EV + '/inv.json');
const VAR = Object.fromEntries(inv.components.map(c => [c.name, c.variantAttrs]));

const config = (node, comp) => {
  const set = new Set();
  walk(node, n => { if (!n.attrs) return; for (const a of VAR[comp]) if (a in n.attrs) set.add(a + '=' + n.attrs[a]); });
  return [...set].sort().join(' ');
};
const nodeAt = (root, line, comp) => { let hit = null; walk(root, n => { if (!hit && n.line === line && n.tag && n.tag[0] !== '#') hit = n; }); return hit; };

/* the snippets' configurations */
const snipConf = {};
for (const s of inv.snippets) {
  const html = fs.readFileSync(path.join(REPO, s.path), 'utf8');
  const v = LIB.validate(html);
  const { root } = parse(html);
  const r = v.roots[0];
  const n = r ? nodeAt(root, r.line) : null;
  s.config = n ? config(n, s.component) : '';
  (snipConf[s.component] = snipConf[s.component] || new Set()).add(s.config);
}
const out = [];
for (const p of inv.pages) {
  if (p.file === 'section-library.html' || !p.roots.length) continue;
  const html = fs.readFileSync(path.join(REPO, 'site', p.file), 'utf8');
  const { root } = parse(html);
  for (const r of p.roots) {
    const n = nodeAt(root, r.line);
    const conf = n ? config(n, r.component) : '';
    out.push({ page: p.file, component: r.component, kind: r.kind, line: r.line, id: r.id, config: conf, inCatalogue: snipConf[r.component] ? snipConf[r.component].has(conf) : false });
  }
}
fs.writeFileSync(EV + '/instances.json', JSON.stringify({ instances: out, snippetConfigs: inv.snippets.map(s => ({ file: s.file, component: s.component, config: s.config })) }, null, 1));
const miss = out.filter(x => !x.inCatalogue);
console.log('instances ' + out.length + ' ; configuration also in a catalogue snippet: ' + (out.length - miss.length) + ' ; not: ' + miss.length);
miss.forEach(x => console.log('   ' + x.page + ' ' + x.component + ' [' + x.config + ']'));
