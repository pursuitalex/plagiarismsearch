/* The catalogue's shared helper: a component as an approved page has it.

   A catalogue snippet is not written by hand: it is the section the template rendered
   for an approved page, read back from site/ — the approved copy in the approved
   configuration — with only its anchor id renamed (two sections on the catalogue page
   must not share one, and an editor gives it the page's own). */
const fs = require('fs');
const path = require('path');
const { parse, walk, has } = require('./check-tools');

const SITE = path.join(__dirname, '..', '..', 'site');

/* the first <section class="<cls> …"> of site/<file>, under the id `id`; `pick`: a
   further test on the node (e.g. its id), when the page has several */
function sectionOf(file, cls, id, pick = () => true) {
  const html = fs.readFileSync(path.join(SITE, file), 'utf8');
  const { root } = parse(html);
  let el = null;
  walk(root, n => { if (!el && n.tag === 'section' && has(n, cls) && pick(n)) el = n; });
  if (!el) throw new Error(`section-library: no section.${cls} in ${file}`);
  const start = html.lastIndexOf('<section', el.innerStart);
  const open = html.slice(start, el.innerStart).replace(/ id="[^"]*"/, '').replace('<section', `<section id="${id}"`);
  const out = open + html.slice(el.innerStart, el.innerEnd) + '</section>';
  /* a page may indent its sections; a snippet starts at the margin */
  const pad = (html.slice(0, start).match(/[ \t]*$/) || [''])[0];
  return pad ? out.split('\n').map(l => (l.startsWith(pad) ? l.slice(pad.length) : l)).join('\n') : out;
}

module.exports = { sectionOf, SITE };
