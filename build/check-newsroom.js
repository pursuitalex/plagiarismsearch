/* Does site/newsroom.html still say what the live archive says?

   The other page checkers encode a brief. This page has none — it is a migration, so
   the thing worth guarding is fidelity: every one of the 68 items, its date, its
   heading and every sentence of its body, present and unreworded, with every
   destination it offered still reachable. build/newsroom-data.json is the reference,
   because that file is itself verified against the live markup by
   build/newsroom-fetch.js before it is written.

     node build/check-newsroom.js
*/
const fs = require('fs');
const path = require('path');

const FILE = 'newsroom.html';
const html = fs.readFileSync(path.join(__dirname, '..', 'site', FILE), 'utf8');
const data = require('./newsroom-data.json');

const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const text = body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')
                 .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ')
                 .replace(/&#39;|&apos;/g, "'").replace(/&hellip;/g, '…')
                 .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
                 .replace(/\s+/g, ' ')
                 /* stripping a tag leaves a space where it stood, so a sentence that ends
                    on a link reads "Data Hub ." here while the page renders "Data Hub."
                    Close that gap, or every linked sentence looks reworded — but only
                    where the mark ends a word, or this eats the space in ".docx". */
                 .replace(/\s+([,.;:!?])(?=\s|$)/g, '$1')
                 .trim();

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};
const has = s => text.includes(s.replace(/\s+/g, ' ').trim());

console.log('\n' + FILE + ' — the live archive, carried over\n');

/* ── every item, whole ────────────────────────────────────────────────────── */
{
  const missingTitle = data.filter(it => !has(it.h));
  ok(data.length + ' headings present, unreworded', !missingTitle.length,
     missingTitle.map(x => '"' + x.h.slice(0, 40) + '…"').join(' · '));

  const paras = data.flatMap(it => it.paras.map(p => ({ h: it.h, t: p.t, items: p.items })));
  /* a list's own `t` is its items run together, so check the items instead */
  const flat = paras.filter(p => !p.items || !p.items.length);
  const missingBody = flat.filter(p => !has(p.t));
  ok(flat.length + ' body paragraphs present, unreworded', !missingBody.length,
     missingBody.map(p => '[' + p.h.slice(0, 26) + '] "' + p.t.slice(0, 40) + '…"').join(' · '));

  const lis = paras.filter(p => p.items && p.items.length).flatMap(p => p.items.map(t => ({ h: p.h, t })));
  const missingLi = lis.filter(l => !has(l.t));
  ok(lis.length + ' list items present', !missingLi.length,
     missingLi.map(l => '"' + l.t.slice(0, 34) + '…"').join(' · '));
}

/* ── dates ────────────────────────────────────────────────────────────────── */
{
  const missing = data.filter(it => !new RegExp('datetime="' + it.m.split(' ')[1] + '-\\d\\d-' + it.d + '"').test(body));
  ok(data.length + ' machine-readable dates', !missing.length,
     missing.map(x => x.d + ' ' + x.m).join(' · '));

  const years = [...new Set(data.map(it => it.m.split(' ')[1]))];
  const shown = years.filter(y => new RegExp('>' + y + '<').test(body));
  ok(years.length + ' years all on the page', shown.length === years.length,
     years.filter(y => !shown.includes(y)).join(' · '));
}

/* ── nothing added, nothing lost ──────────────────────────────────────────── */
{
  const articles = (body.match(/<article\b/g) || []).length;
  ok('one article per item', articles === data.length, articles + ' articles vs ' + data.length + ' items');

  /* the fetch used to drag the live page's own furniture in with the last item */
  const CHROME = ['We Use Cookies', 'Sign in with Google', 'All right reserved',
                  'Need PlagiarismSearch account?', 'You can login using your social profile'];
  const leaked = CHROME.filter(has);
  ok('no page furniture scraped in with the items', !leaked.length, leaked.join(' · '));

  /* the archive is newest-first and stays that way: no item may appear before one
     that is newer than it */
  const order = data.map(it => text.indexOf(it.h.replace(/\s+/g, ' ')));
  const outOfOrder = order.filter((pos, i) => i && pos >= 0 && order[i - 1] >= 0 && pos < order[i - 1]);
  ok('items in the order the archive runs', !outOfOrder.length, outOfOrder.length + ' out of sequence');
}

/* ── destinations ─────────────────────────────────────────────────────────── */
{
  const RENAMED = { 'plagiarism-checker-app': 'chat-bot.html', 'spell-checker': 'spell-check.html',
                    'rate-my-paper': 'paper-analysis.html', 'readability-checker': 'readability-check.html',
                    'vip-plagiarism-checker': 'vip.html' };
  const SITE = path.join(__dirname, '..', 'site');
  const expected = new Set();
  const wanted = [];
  for (const it of data) {
    for (const p of it.paras) for (const [, href] of p.links) wanted.push(href);
    if (it.more) wanted.push(it.more.href);
  }
  for (const raw of wanted) {
    /* one href on the live site holds two URLs separated by a space; the page takes the
       first, so the check has to as well */
    let u; try { u = new URL(raw.replace(/&amp;/g, '&').trim().split(/\s+/)[0], 'https://plagiarismsearch.com'); } catch { continue; }
    const slug = u.pathname.replace(/^\/+|\/+$/g, '');
    if (/(^|\.)plagiarismsearch\.com$/.test(u.hostname)) {
      if (RENAMED[slug] && fs.existsSync(path.join(SITE, RENAMED[slug]))) { expected.add(RENAMED[slug]); continue; }
      if (/^[a-z0-9-]+$/.test(slug) && fs.existsSync(path.join(SITE, slug + '.html'))) { expected.add(slug + '.html'); continue; }
    }
    expected.add(u.href);
  }
  const hrefs = new Set([...body.matchAll(/href="([^"]*)"/g)].map(m => m[1].replace(/&amp;/g, '&')));
  const gone = [...expected].filter(e => ![...hrefs].some(h => h.replace(/&amp;/g, '&') === e));
  ok(expected.size + ' destinations still reachable', !gone.length, gone.slice(0, 4).join(' · '));

  const offsite = [...body.matchAll(/<a[^>]+href="https?:[^"]*"[^>]*>/g)];
  const unmarked = offsite.filter(a => !/rel="noopener"/.test(a[0]));
  ok('every outbound link carries rel="noopener"', !unmarked.length, unmarked.length + ' without');
}

/* ── structure ────────────────────────────────────────────────────────────── */
{
  const ids = [...body.matchAll(/<section[^>]+id="([^"]+)"/g)].map(m => m[1]);
  ok('sections in order', ids.join(',') === 'newsroom,latest,news-archive', ids.join(', '));

  ok('one h1, and it is the live heading',
     (body.match(/<h1\b/g) || []).length === 1 && /<h1[^>]*>Our News<\/h1>/.test(body));

  ok('the live meta description is the support line',
     has('Learn about the most recent news and improvements at PlagiarismSearch to keep up with the website updates'));

  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
  const idsAll = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
  const dead = [...new Set(anchors)].filter(a => !idsAll.has(a));
  ok('every in-page anchor resolves', !dead.length, dead.join(' · '));

  const topics = [...new Set([...body.matchAll(/data-topic="([^"]+)"/g)].map(m => m[1]))].filter(t => t !== 'all');
  const filed = (body.match(/<article[^>]+data-topic=/g) || []).length;
  ok('every archived item carries a topic', filed === data.length - 2,
     filed + ' filed of ' + (data.length - 2) + ' archived, ' + topics.length + ' topics');
}

/* ── what this page must not do ───────────────────────────────────────────── */
{
  ok('no photograph stands in for a news item', !/<img[^>]+src="assets\/img\/(news|hero)/i.test(body));
  ok('no "read more" that goes nowhere', !/href="#"[^>]*>\s*Read more/i.test(body));
}

console.log('\n' + (failed
  ? '  ' + failed + ' FAILED\n'
  : FILE + ' carries the live archive whole\n'));
process.exit(failed ? 1 : 0);
