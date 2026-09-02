/* Pull the newsroom archive off the live site into build/newsroom-data.json.
   ────────────────────────────────────────────────────────────────────────────
   Run by hand, not by the page build: build/newsroom.js reads the JSON, so the
   page builds offline and the copy is a reviewable artefact rather than
   something re-scraped on every run.

       node build/newsroom-fetch.js

   The markup is machine-generated and identical on every one of the 7 pages —
   .news-box wrapping .news-date-day / .news-date-month / h3 and then a run of
   <p>, <div>, <ul> and <ol> — so it is parsed with anchored regex rather than a
   DOM library the repo does not have. Every field is verified against the live
   page afterwards; see the counts printed at the end and the guards below,
   which throw rather than write a half-scraped file. */
const fs = require('fs');
const path = require('path');

const PAGES = 7;

const { decode, blocks, driftCheck, get } = require('./scrape');

function parse(html) {
  const out = [];
  /* Every item is one .news-box, ended by the next one's opening tag — except the
     last on each page, which otherwise runs to the end of the document and drags in
     the pagination, the footer and the cookie banner. That mattered: an item authored
     entirely in <div>s takes the <div> fallback below, and the fallback would have
     swallowed the whole page chrome as body copy. Close the last box at whichever
     comes first of the pagination block and the footer. */
  const boxes = html.split(/<div class="news-box"/).slice(1);
  for (const raw of boxes) {
    let box = raw.split(/<div class="news-box"/)[0];
    const stop = [box.indexOf('class="pagination'), box.indexOf('<footer')].filter(i => i >= 0);
    if (stop.length) box = box.slice(0, Math.min(...stop));
    const day = (box.match(/class="news-date-day"[^>]*>([\s\S]*?)<\//) || [])[1];
    const month = (box.match(/class="news-date-month"[^>]*>([\s\S]*?)<\//) || [])[1];
    const title = (box.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i) || [])[1];
    if (!day || !month || !title) continue;

    const body = box.slice(box.indexOf('</h3>') + 5);
    const take = tags => blocks(body, tags);

    /* Two authoring styles in their CMS, and a few items carry BOTH: the body in
       <p>/<ol>, and the same text again flattened into bare <div>s. Nothing is
       hidden — the live page really does print it twice. Prefer the <p> family,
       which is the version that keeps its list markup, and fall back to <div>
       only for the items authored entirely that way. */
    const paras = take(/^(p|ul|ol)$/i);
    const final = paras.length ? paras : take(/^div$/i);

    /* Five of the 68 carry a "Read more" link in a .news-more block that sits outside
       the body, so it is not in any paragraph and the first pass dropped all five. They
       are the only items on the archive with a destination of their own. */
    const moreBlock = box.match(/<div class="news-more">([\s\S]*?)<\/div>/i);
    const moreLink = moreBlock && moreBlock[1].match(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
    const more = moreLink ? { href: moreLink[1].trim().split(/\s+/)[0], label: decode(moreLink[2]) } : null;

    if (final.length) out.push({ d: decode(day), m: decode(month), h: decode(title), paras: final, more });
  }
  return out;
}

(async () => {
  const all = [];
  for (let p = 1; p <= PAGES; p++) {
    const url = 'https://plagiarismsearch.com/newsroom' + (p > 1 ? '/page/' + p : '');
    const items = parse(await get(url));
    console.log('  page ' + p + '  ' + String(items.length).padStart(2) + ' items');
    if (!items.length) throw new Error('page ' + p + ' parsed to nothing — markup changed?');
    all.push(...items);
  }

  /* guards: these numbers were read off the rendered pages in a real browser */
  if (all.length !== 68) throw new Error('expected 68 items, parsed ' + all.length);
  const empty = all.filter(x => !x.paras.length);
  if (empty.length) throw new Error('items with no body: ' + empty.map(x => x.h).join(', '));
  const titles = all.map(x => x.h);
  const dupes = titles.filter((t, i) => titles.indexOf(t) !== i);
  if (dupes.length) throw new Error('duplicate titles: ' + dupes.join(' | '));

  /* the rich text carries anchors and nothing else — no inline styles, no gmail spans */
  const stray = all.flatMap(x => x.paras).filter(p => /<(?!\/?a[\s>])/.test(p.html || ''));
  if (stray.length) throw new Error('markup other than <a> survived into html: ' + stray[0].html.slice(0, 120));

  /* the linked version must read exactly like the plain one. This caught a real bug:
     the punctuation cleanup above closed the space in "speed in .docx format". */
  const drift = all.flatMap(x => driftCheck(x.paras).map(p => ({ h: x.h, p })));
  if (drift.length) throw new Error('html and text disagree in ' + drift.length +
    ' paragraph(s), first in "' + drift[0].h + '"\n' +
    '    text: ' + drift[0].p.t.slice(-90) + '\n' +
    '    html: ' + drift[0].p.html.replace(/<[^>]+>/g, '').slice(-90));

  const perYear = {};
  all.forEach(x => { const y = x.m.split(' ')[1]; perYear[y] = (perYear[y] || 0) + 1; });
  const EXPECT = { 2026: 2, 2025: 6, 2024: 9, 2023: 12, 2022: 23, 2021: 16 };
  for (const [y, n] of Object.entries(EXPECT))
    if (perYear[y] !== n) throw new Error('year ' + y + ': expected ' + n + ', parsed ' + perYear[y]);

  const file = path.join(__dirname, 'newsroom-data.json');
  fs.writeFileSync(file, JSON.stringify(all, null, 1));
  console.log('\n  build/newsroom-data.json  ' + all.length + ' items, ' +
              Math.round(fs.statSync(file).size / 1024) + ' KB');
  console.log('  per year  ' + Object.entries(perYear).sort((a, b) => b[0] - a[0]).map(([y, n]) => y + ':' + n).join('  '));
  console.log('  newest    ' + all[0].d + ' ' + all[0].m + ' · ' + all[0].h);
  console.log('  oldest    ' + all.at(-1).d + ' ' + all.at(-1).m + ' · ' + all.at(-1).h);
})();
