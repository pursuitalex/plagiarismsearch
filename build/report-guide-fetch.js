/* Pull plagiarismsearch.com/plagiarism-and-ai-check-report into
   build/report-guide-data.json.

   Run by hand, not by the page build — build/report-guide.js reads the JSON, so the
   page builds offline and the copy stays a reviewable artefact.

       node build/report-guide-fetch.js

   One container, one h1, then a flat run of <p> and <ul>. There are no sub-headings on
   the live page at all: 27 blocks in a single column, which is why the redesign has to
   find the structure that is already in the writing rather than invent one.

   Every block is numbered in the JSON in the order it appears, so the page can be
   rearranged into sections while the checker still proves the sequence is intact.
*/
const fs = require('fs');
const path = require('path');
const { decode, blocks, driftCheck, get } = require('./scrape');

const URL = 'https://plagiarismsearch.com/plagiarism-and-ai-check-report';
const MARKER = 'static-page-plagiarism-and-ai-check-report';

(async () => {
  const html = await get(URL);

  /* the article container, closed by div depth rather than by guesswork */
  const open = new RegExp('<div\\s+class="[^"]*' + MARKER + '[^"]*"[^>]*>', 'i').exec(html);
  if (!open) throw new Error('no .' + MARKER + ' container — markup changed?');
  let depth = 1, end = -1;
  const tag = /<\/?div\b[^>]*>/gi;
  tag.lastIndex = open.index + open[0].length;
  let m;
  while ((m = tag.exec(html))) { depth += m[0][1] === '/' ? -1 : 1; if (depth === 0) { end = m.index; break; } }
  if (end < 0) throw new Error('container never closes');
  const article = html.slice(open.index + open[0].length, end);

  const h1 = decode((article.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '');
  if (!h1) throw new Error('no h1');

  const body = article.slice(article.indexOf('</h1>') + 5);
  const paras = blocks(body, /^(p|ul|ol)$/i).map((b, i) => ({ i, ...b }));

  /* guards — every one of these was read off the rendered page first */
  if (paras.length !== 26) throw new Error('expected 26 blocks after the h1, parsed ' + paras.length);
  const lists = paras.filter(p => p.items && p.items.length);
  if (lists.length !== 3) throw new Error('expected 3 lists, parsed ' + lists.length);
  const empty = paras.filter(p => !p.t);
  if (empty.length) throw new Error(empty.length + ' empty block(s)');

  const stray = paras.filter(p => /<(?!\/?a[\s>])/.test(p.html || ''));
  if (stray.length) throw new Error('markup other than <a> survived: ' + stray[0].html.slice(0, 120));

  const drift = driftCheck(paras);
  if (drift.length) throw new Error('html and text disagree in ' + drift.length + ' block(s)\n' +
    '    text: ' + drift[0].t.slice(-90) + '\n' +
    '    html: ' + drift[0].html.replace(/<[^>]+>/g, '').slice(-90));

  /* the live page's own head, so the rebuild keeps its title and description */
  const meta = {
    title: decode((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || ''),
    description: (html.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || '',
  };
  if (!meta.title || !meta.description) throw new Error('title or description missing');

  const out = { url: URL, h1, meta, paras };
  const file = path.join(__dirname, 'report-guide-data.json');
  fs.writeFileSync(file, JSON.stringify(out, null, 1));

  console.log('  build/report-guide-data.json  ' + paras.length + ' blocks, ' +
              Math.round(fs.statSync(file).size / 1024) + ' KB');
  console.log('  h1        ' + h1);
  console.log('  lists     ' + lists.map(l => l.items.length + ' items').join(', '));
  console.log('  links     ' + paras.reduce((n, p) => n + p.links.length, 0));
  console.log('  longest   ' + Math.max(...paras.map(p => p.t.length)) + ' chars, ' +
              'shortest ' + Math.min(...paras.map(p => p.t.length)));
})();
