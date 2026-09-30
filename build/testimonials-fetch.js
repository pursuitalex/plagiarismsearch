/* Pull the testimonials page off the live site into build/testimonials-data.json.
   ────────────────────────────────────────────────────────────────────────────
   Run by hand, not by the page build: build/testimonials.js reads the JSON, so the
   page builds offline and the hundred reviews are a reviewable artefact rather than
   something re-scraped on every run (the pattern of build/newsroom-fetch.js).

       node build/testimonials-fetch.js

   What it takes, all of it the live page's own words and numbers:
     - the heading block and the three rating tiles (Trustpilot, Sitejabber, Google
       Workspace Marketplace),
     - per platform: the featured quote, the rating, "Based on N reviews", the text
       rating where there is one, and every review card — name, score, title, text —
       including the ones the live page hides behind "Show more",
     - the four video reviews: name, line, YouTube id.

   Reviews are people's words: they are kept exactly as published, typos included. The
   one normalisation is the apostrophe — the live titles are HTML-escaped (&#039;) and
   the bodies are not, and both are the same straight apostrophe, so both stay one.
   Guards throw rather than write a half-scraped file. */
const fs = require('fs');
const path = require('path');
const { decode, get } = require('./scrape');

const URL = 'https://plagiarismsearch.com/testimonials';
const OUT = path.join(__dirname, 'testimonials-data.json');

/* decode() knows the punctuation entities; reviews also carry accented letters as named
   entities (&iacute; in a Spanish one), which a browser shows as the letter. Any other
   named entity stops the run rather than reaching the page as literal text. */
const LETTERS = { aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', ntilde: 'ñ', ccedil: 'ç',
  auml: 'ä', ouml: 'ö', uuml: 'ü', agrave: 'à', egrave: 'è', Aacute: 'Á', Eacute: 'É', Oacute: 'Ó', szlig: 'ß' };
const txt = s => {
  const out = decode(String(s).replace(/&#0?39;/g, '\'')).replace(/&([A-Za-z]+);/g, (m, n) => {
    if (!LETTERS[n]) throw new Error('testimonials-fetch: unknown entity ' + m);
    return LETTERS[n];
  });
  return out;
};
const one = (re, s, label) => {
  const m = s.match(re);
  if (!m) throw new Error('testimonials-fetch: not found — ' + label);
  return m[1];
};
/* a section's markup, from its opening tag to the next <section */
const section = (html, cls) => {
  const i = html.indexOf('<section class="' + cls + '"');
  if (i < 0) throw new Error('testimonials-fetch: no section .' + cls);
  const j = html.indexOf('<section', i + 10);
  return html.slice(i, j < 0 ? undefined : j);
};
/* the stars row as a number: full stars, a half, empty ones */
const starValue = row => (row.match(/-star\.svg/g) || []).length + ((row.match(/-star-half\.svg/g) || []).length ? .5 : 0);

function reviews(html) {
  return html.split(/<div class="latest-feedbacks-item[ "]/).slice(1).map((c, i) => {
    const name = txt(one(/<p class="name">([\s\S]*?)<\/p>/, c, 'review ' + i + ' name'));
    const score = +one(/<div class="stars" title="Score: (\d+(?:\.\d+)?)"/, c, 'review ' + i + ' score');
    const title = txt(one(/<p class="title">([\s\S]*?)<\/p>/, c, 'review ' + i + ' title'));
    const body = one(/<div class="text">([\s\S]*?)<\/div>/, c, 'review ' + i + ' text');
    const text = [...body.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => txt(m[1])).filter(Boolean);
    if (!text.length && txt(body)) text.push(txt(body));
    if (!name || !text.length) throw new Error('testimonials-fetch: empty review ' + i);
    return { name, score, title, text };
  });
}

function platform(html, key) {
  const head = section(html, 'content-box content-box-reviews ' + key);
  const list = section(html, 'content-box content-box-3 latest-feedbacks ' + key);
  const block = head.slice(head.indexOf('review-block-2'));
  return {
    featured: {
      title: txt(one(/<p class="block-title">([\s\S]*?)<\/p>/, head, key + ' featured title')),
      text: txt(one(/<div class="block-subtitle">([\s\S]*?)<\/div>/, head, key + ' featured text')),
    },
    rating: +one(/<span class="value">([\d.]+)<\/span>/, block, key + ' rating'),
    max: +one(/<span class="max-value">([\d.]+)<\/span>/, block, key + ' max'),
    stars: starValue(one(/<div class="stars">([\s\S]*?)<\/div>/, block, key + ' stars')),
    count: +one(/Based on <a[^>]*><span class="value">(\d+)<\/span> reviews<\/a>/, block, key + ' count'),
    url: one(/Based on <a href="([^"]+)"/, block, key + ' url'),
    textRating: (block.match(/<span class="text-rating">([\s\S]*?)<\/span>/) || [, null])[1],
    heading: txt(one(/<p class="block-title">([\s\S]*?)<\/p>/, list, key + ' list heading')),
    showMore: txt(one(/<button class="show-more">([\s\S]*?)<\/button>/, list, key + ' show more')),
    reviews: reviews(list),
  };
}

(async () => {
  const html = await get(URL);

  const intro = section(html, 'content-box content-box-1');
  const tiles = [...intro.matchAll(/<a href="([^"]+)" target="_blank" class="review-block ([a-z-]+)">([\s\S]*?)<\/a>/g)].map(([, url, key, body]) => ({
    key, url,
    logoAlt: one(/<img[^>]*alt="([^"]*)"/, body, key + ' logo'),
    stars: starValue(one(/<div class="stars">([\s\S]*?)<\/div>/, body, key + ' tile stars')),
    rating: (body.match(/<span class="value">([\d.]+)<\/span>/) || [, null])[1],
    max: (body.match(/<span class="max-value">([\d.]+)<\/span>/) || [, null])[1],
    reviewsCount: (body.match(/<span class="reviews-count">([^<]+)<\/span>/) || [, null])[1],
    downloads: (body.match(/<p class="downloads-count">([^<]+)<\/p>/) || [, null])[1],
  }));
  if (tiles.length !== 3) throw new Error('testimonials-fetch: expected 3 rating tiles, got ' + tiles.length);

  const video = section(html, 'content-box content-box-video-reviews');
  const videos = video.split('<div class="video-reviews-item item-').slice(1).map((v, i) => ({
    name: txt(one(/<div class="item-title">([\s\S]*?)<\/div>/, v, 'video ' + i + ' name')),
    line: txt(one(/<div class="item-subtitle">([\s\S]*?)<\/div>/, v, 'video ' + i + ' line')),
    youtube: one(/youtube\.com\/embed\/([\w-]+)/, v, 'video ' + i + ' id'),
  }));

  const data = {
    source: URL,
    fetched: new Date().toISOString().slice(0, 10),
    title: txt(one(/<title>([\s\S]*?)<\/title>/, html, 'title')),
    meta: txt(one(/<meta name="description" content="([^"]*)"/, html, 'meta')),
    h1: txt(one(/<h1[^>]*>([\s\S]*?)<\/h1>/, html, 'h1')),
    lead: txt(one(/<\/h1>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/, html, 'lead')),
    trust: {
      title: txt(one(/<p class="block-title">([\s\S]*?)<\/p>/, intro, 'trust title').replace(/<br\s*\/?>/g, ' ')),
      text: txt(one(/<p class="block-subtitle">([\s\S]*?)<\/p>/, intro, 'trust text')),
      tiles,
    },
    videos: {
      title: txt(one(/<p class="block-title">([\s\S]*?)<\/p>/, video, 'video title')),
      text: txt(one(/<p class="block-subtitle">([\s\S]*?)<\/p>/, video, 'video text')),
      items: videos,
    },
    trustpilot: platform(html, 'trustpilot'),
    sitejabber: platform(html, 'sitejabber'),
  };

  /* the counts the live page states about itself */
  const n = { trustpilot: data.trustpilot.reviews.length, sitejabber: data.sitejabber.reviews.length };
  if (n.trustpilot < 10 || n.sitejabber < 10 || videos.length !== 4) throw new Error('testimonials-fetch: short scrape ' + JSON.stringify(n) + ' videos ' + videos.length);

  fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log('  build/testimonials-data.json — ' + n.trustpilot + ' Trustpilot, ' + n.sitejabber + ' Sitejabber, ' + videos.length + ' videos');
  console.log('  Trustpilot ' + data.trustpilot.rating + '/' + data.trustpilot.max + ' based on ' + data.trustpilot.count +
              ' · Sitejabber ' + data.sitejabber.rating + '/' + data.sitejabber.max + ' based on ' + data.sitejabber.count);
})().catch(e => { console.error(e.message); process.exit(1); });
