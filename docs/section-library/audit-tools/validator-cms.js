/* The library validator on every snippet after the CMS simulation (an outer <div>, and
   valueless attributes given the value "1"), and on each change alone. Read-only.
   Writes validator-cms.json. */
const fs = require('fs');
const path = require('path');
const REPO = require('path').resolve(__dirname, '../../..');
const EV = require('path').resolve(__dirname, '../evidence');
const LIB = require(REPO + '/build/check-library');
const inv = require(EV + '/inv.json');
const src = fs.readFileSync(__dirname + '/snip-browser.js', 'utf8');
eval(src.match(/function normalise[\s\S]*?\nconst wrapB/)[0].replace(/\nconst wrapB$/, ''));
const agg = {}; let failing = 0;
const out = inv.snippets.map(s => {
  const h = fs.readFileSync(path.join(REPO, s.path), 'utf8');
  const both = LIB.validate('<div>' + normalise(h) + '</div>'), norm = LIB.validate(normalise(h)), wrap = LIB.validate('<div>' + h + '</div>');
  if (both.errors.length) failing++;
  both.errors.forEach(e => { const k = e.msg.replace(/\(line \d+\)/, '').replace(/<[^>]*>/, '').trim(); (agg[k] = agg[k] || new Set()).add(s.file); });
  return { file: s.file, errors: both.errors.length, errorsNormaliseOnly: norm.errors.length, errorsWrapOnly: wrap.errors.length, warnings: both.warnings.length };
});
fs.writeFileSync(EV + '/validator-cms.json', JSON.stringify(out, null, 1));
console.log('snippets failing the validator after the CMS simulation: ' + failing + ' of ' + out.length + ' ; wrapper alone: ' + out.filter(x => x.errorsWrapOnly).length + ' ; ="1" alone: ' + out.filter(x => x.errorsNormaliseOnly).length);
Object.entries(agg).forEach(([k, v]) => console.log('  ' + k + '  ← ' + [...v].join(', ')));
