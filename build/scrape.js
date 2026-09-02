/* Reading copy off the live site.

   Extracted when the second page needed it — build/newsroom-fetch.js set the rules and
   build/report-guide-fetch.js follows them. Nothing here knows about either page; it
   only turns the live site's markup into text that reads the same as the rendered page.

   The live markup is hand-authored in a CMS and carries inline colour styles, gmail
   classes, empty spans and &nbsp; runs. All of that goes. Anchors survive, rebuilt from
   scratch so no attribute from the live page reaches ours.
*/

const decode = s => s
  .replace(/<br\s*\/?>/gi, ' ')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;| /g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;|&rsquo;/g, '’')
  .replace(/&lsquo;/g, '‘').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”')
  .replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&hellip;/g, '…')
  .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
  .replace(/\s+/g, ' ')
  .trim();

const esc = s => s
  .replace(/&(?!(amp|lt|gt|quot|#\d+|nbsp);)/g, '&amp;')
  .replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* One href on the live site holds two URLs separated by a space, which is broken there
   too — a browser resolves the whole string as one relative path. Take the first. */
const href1 = h => h.trim().split(/\s+/)[0];

const linksIn = html => [...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)]
  .map(m => [decode(m[2]), m[1]])
  .filter(([t, h]) => t && h && !/^javascript:/i.test(h));

/* the same words as decode(), with the anchors kept */
const richText = html => {
  const parts = [];
  let last = 0;
  for (const m of html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    parts.push(esc(decode(html.slice(last, m.index))));
    const label = decode(m[2]);
    const to = href1(m[1]);
    parts.push(label && to && !/^javascript:/i.test(to)
      ? '<a href="' + esc(to) + '">' + esc(label) + '</a>'
      : esc(label));
    last = m.index + m[0].length;
  }
  parts.push(esc(decode(html.slice(last))));
  /* decode() trimmed each fragment, so put back the single space between them — then
     close the gap this leaves in front of a full stop that followed a link. Only where
     the mark ends a word: without the lookahead this ate the space in ".docx". */
  return parts.filter(Boolean).join(' ')
    .replace(/\s+([,.;:!?])(?=\s|$)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
};

/* every <p>/<div>/<ul>/<ol> in a chunk of markup, as text + linked text + list items */
const blocks = (html, tags = /^(p|ul|ol)$/i) => {
  const got = [];
  for (const [, tag, attrs, inner] of html.matchAll(/<(p|div|ul|ol)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
    if (!tags.test(tag)) continue;
    if (/news-date-mobile/.test(attrs)) continue;
    const t = decode(inner);
    if (!t) continue;
    if (got.some(p => p.t === t || p.t.includes(t))) continue;
    const li = /^(ul|ol)$/i.test(tag)
      ? [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
          .map(m => ({ t: decode(m[1]), html: richText(m[1]) })).filter(x => x.t)
      : null;
    got.push({
      tag: tag.toUpperCase(),
      t,
      html: richText(inner),
      items: li ? li.map(x => x.t) : null,
      itemsHtml: li ? li.map(x => x.html) : null,
      links: linksIn(inner),
    });
  }
  return got;
};

/* the linked form of a block must read exactly like its plain form. This caught a real
   bug once: the punctuation cleanup closed the space in "speed in .docx format". */
const driftCheck = list => list
  .filter(p => !(p.items && p.items.length))
  .filter(p => p.html.replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim() !== p.t.replace(/\s+/g, ' ').trim());

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const get = async url => {
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'text/html' } });
  if (!res.ok) throw new Error(url + ' -> HTTP ' + res.status);
  return res.text();
};

module.exports = { decode, esc, href1, linksIn, richText, blocks, driftCheck, get, UA };
