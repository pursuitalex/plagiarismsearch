/* The shared script modules (build/assets/js/*.js): each module's name and the selectors
   it looks its elements up by — the strings handed to querySelector(All), closest, matches.
   Read-only. Writes modules.json. */
const fs = require('fs');
const path = require('path');
const REPO = require('path').resolve(__dirname, '../../..');
const EV = require('path').resolve(__dirname, '../evidence');
const DIR = REPO + '/build/assets/js';
const out = [];
for (const f of fs.readdirSync(DIR).filter(x => /^\d\d-.*\.js$/.test(x)).sort()) {
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');
  const name = (src.match(/PS\.module\('([^']+)'/) || [])[1] || '(no PS.module)';
  const sels = new Set();
  for (const m of src.matchAll(/(?:querySelectorAll|querySelector|closest|matches)\(\s*(['"`])([^'"`]+)\1/g)) sels.add(m[2]);
  /* selectors kept in a constant: const SEL = '…' */
  for (const m of src.matchAll(/const\s+[A-Z_]+\s*=\s*(['"])([^'"]*[\[.#][^'"]*)\1/g)) sels.add(m[2]);
  /* exact-value tests on attributes: el.dataset.x === '…' , getAttribute('x') === '…' */
  const exact = [...src.matchAll(/(dataset\.\w+|getAttribute\('[^']+'\))\s*(===|!==|==|!=)\s*(['"][^'"]*['"]|true|false)/g)].map(m => m[0]);
  const emptyAttr = [...src.matchAll(/\[(data-[\w-]+)=(""|'')\]/g)].map(m => m[0]);
  const scope = /:scope/.test(src);
  const directChild = [...sels].filter(s => />/.test(s));
  const json = /application\/json/.test(src);
  const hash = /location\.hash|hashchange/.test(src);
  const observer = /(Intersection|Mutation|Resize)Observer/.test(src);
  out.push({ file: 'build/assets/js/' + f, module: name, selectors: [...sels], exact, emptyAttr, scope, directChild, json, hash, observer, lines: src.split('\n').length });
}
fs.writeFileSync(EV + '/modules.json', JSON.stringify(out, null, 1));
out.forEach(m => console.log(m.module.padEnd(16) + ' ' + m.file.replace('build/assets/js/', '').padEnd(24) + ' sel ' + m.selectors.length + (m.exact.length ? ' EXACT ' + m.exact.join(' ; ') : '') + (m.emptyAttr.length ? ' EMPTY ' + m.emptyAttr.join(',') : '') + (m.scope ? ' :scope' : '') + (m.directChild.length ? ' > ' + m.directChild.length : '') + (m.json ? ' json' : '') + (m.hash ? ' hash' : '') + (m.observer ? ' observer' : '')));
