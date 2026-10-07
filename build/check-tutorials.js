/* Check site/video-on-plagiarism-tutorial.html against the live page's copy.

   There is no brief for this page: the words are the live page's, verbatim, and only the
   architecture is new (two typos corrected, see build/tutorials.js). So the checker holds
   every string in build/tutorials.js COPY to
   the rendered text, the six tutorials to their YouTube ids in the live order, and the
   stage to the contract the video modules read (89-video.js, 90-video-stage.js).

   Run: node build/check-tutorials.js
*/
const fs = require('fs');
const path = require('path');

const FILE = 'video-on-plagiarism-tutorial.html';
const html = fs.readFileSync(path.join(__dirname, '..', 'site', FILE), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const flat = s => s.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ').trim();
const text = flat(body);
const { COPY } = require('./tutorials');

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};
const times = (hay, needle) => hay.split(needle).length - 1;

console.log('page-level');
{
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1, the live one', h1s.length === 1 && h1s[0] === COPY.h1, h1s.join(' | '));
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('title', title === COPY.title, title);
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('self-canonical to the live URL', canon === COPY.canonical, canon);
  ok('the live line, once, as the H2', [...body.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map(m => flat(m[1])).join('|') === COPY.lead);
  ok('no H4+', !/<h[4-6]\b/.test(body));
}

console.log('\nthe six tutorials');
{
  const picks = [...body.matchAll(/<a\b[^>]*data-video-pick="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  ok('six cards, in the live order', picks.map(m => m[1]).join(',') === COPY.videos.map(v => v[0]).join(','), picks.map(m => m[1]).join(','));
  COPY.videos.forEach(([id, name, desc], i) => {
    const m = picks[i];
    if (!m) return ok(id + ': a card', false);
    const tag = m[0].slice(0, m[0].indexOf('>') + 1);
    const h3 = flat((m[2].match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/) || [, ''])[1]);
    const p = flat((m[2].match(/<p\b[^>]*>([\s\S]*?)<\/p>/) || [, ''])[1]);
    ok(id + ': name and description word for word', h3 === name && p === desc, h3 === name ? '' : h3);
    ok(id + ': a link to the video on YouTube, rel="noopener"',
      tag.includes('href="https://www.youtube.com/watch?v=' + id + '"') && tag.includes('rel="noopener"'));
    ok(id + ': its own still', m[2].includes('https://i.ytimg.com/vi/' + id + '/'));
  });
  ok('one card marked current — the first', times(body, 'aria-current="true"') === 1 && /data-video-pick="[^"]+"[^>]*aria-current="true"/.test(picks[0] ? picks[0][0] : ''));
  ok('every description once', COPY.videos.every(v => times(text, v[2]) === 1));
}

console.log('\nthe stage');
{
  const root = (body.match(/<div\b[^>]*data-video-stage="([^"]*)"/) || [])[1];
  ok('one [data-video-stage], marked "scroll"', times(body, 'data-video-stage=') === 1 && root === 'scroll', root);
  ok('one [data-stage] with the first tutorial as a facade', times(body, 'data-stage') === 1 &&
    new RegExp('data-stage[\\s\\S]{0,200}data-video="' + COPY.videos[0][0] + '"').test(body));
  ok('the caption holds the first name', new RegExp('data-caption-name[^>]*>' + COPY.videos[0][1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '<').test(body.replace(/&amp;/g, '&')));
  ok('no player loaded up front', !/<iframe\b/.test(body));
  /* the list is paged by the script; the HTML holds every tutorial and a hidden pager */
  const per = +(body.match(/data-paged-list="(\d+)"/) || [])[1];
  ok('the list is paged, ' + per + ' to a page: every card is a paged item', per > 0 && times(body, '<li data-paged-item>') === COPY.videos.length && times(body, 'data-paged-list=') === 1);
  ok('the pager is in the page, hidden until the script pages the list, with every part the module reads',
     /<nav data-pager hidden [^>]*aria-label="Tutorial pages"/.test(body) && ['data-pager-count data-format="{from}–{to} of {total} tutorials"', 'data-pager-prev', 'data-pager-next', 'data-pager-nums data-page-label="Page"'].every(h => body.includes(h)));
}

console.log('\nstructure');
{
  const sections = [...body.matchAll(/<section\b[^>]*>/g)].map(m => m[0]);
  ok(sections.length + ' section, with data-component', sections.length === 1 && sections.every(s => /data-component="/.test(s)));
  ok('no <style> or <script> in the body', !/<style\b|<script\b/.test(body));
  ok('no inline style', !/\sstyle="/.test(body));
}

console.log(failed ? '\n' + failed + ' FAILED' : '\nall ok');
process.exit(failed ? 1 : 0);
