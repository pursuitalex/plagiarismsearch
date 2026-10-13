/* Generate the four pages that prove the Legal and User Guide plain-HTML typography
   (build/assets/css/26-legal-guide-body.css: ".legal-body", ".guide-body"):

     site/legal-plain-cookie-policy.html   the Cookie Policy as the live site holds it —
                                           plain <h2>, <p>, <ul>, <table>, <code>, no class
                                           on anything — in the approved Legal template
     site/legal-elements.html              every element the legal body styles, once
     site/guide-plain-storage.html         a User Guide article from the archive (the
                                           live /plagiarism-database: eleven sections,
                                           lists, three screenshots) in the approved
                                           article template
     site/guide-elements.html              every element the guide body styles, once —
                                           with the archive's own shapes: a screenshot in a
                                           paragraph, one inside a list item, list items
                                           outside a list

   Each page is its approved template with a document handed over as it is: the Legal
   pages through build/legal.js (sheet), the Guide pages through build/article.js (a block
   of type "html"). The templates' own markup is not changed by this build.

   THE DOCUMENTS ARE NOT EDITED. The Cookie Policy is read from build/legal/, where the
   approved Cookie Policy page is built from; the guide article is in
   build/plain/guide-storage.body.html, as served on 2026-10-13. What a template does with
   a document, and so what is done here — none of it a class:
     · the <h1> and, on a legal page, the line the document dates itself with go to the
       masthead, where the template sets them;
     · each <h2> gets an id (the contents needs an anchor per section), unique on the page.
   The guide's screenshots keep their addresses on the live site, where the files are.

   Run:  node build/body-plain.js  →  node build/shell.js  →  node build/check-body-plain.js
*/
const fs = require('fs');
const path = require('path');
const legal = require('./legal');
const article = require('./article');
const shell = require('./page');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const read = f => fs.readFileSync(path.join(__dirname, 'plain', f), 'utf8');
const text = s => s.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

/* ids for the h2s: the only thing added to a document's own markup. `slug` is the
   template's own (the legal pages and the article template cut theirs differently). */
function withIds(body, slug) {
  const unique = legal.uniqueIds(), heads = [];
  const out = body.replace(/<h2>([\s\S]*?)<\/h2>/g, (all, inner) => {
    const id = unique(slug(text(inner)) || 'section');
    heads.push({ id, text: text(inner), html: inner.trim() });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { body: out, heads };
}

/* ── the Legal pages ──────────────────────────────────────────────────────── */
function legalPage(p) {
  const { body, heads } = withIds(p.body, legal.slugOf);
  /* the contents takes plain text, as the approved pages give it */
  /* `as`: the legal page this one stands for, so "Also in legal" lists the other two, as there */
  const html = legal.sheet({ slug: p.as || p.out.replace(/\.html$/, ''), title: p.title, eyebrow: p.eyebrow },
    { h1: p.h1, dated: p.dated, sections: heads.map(h => ({ id: h.id, text: h.text })), markup: body.trim() });
  fs.writeFileSync(path.join(SITE, p.out), html);
  console.log('  site/' + p.out + ' — ' + heads.length + ' sections, ' + html.length + ' bytes');
  return { body, heads };
}

/* the Cookie Policy as the live page holds it, less the two things the masthead takes */
function cookieSource() {
  const page = legal.PAGES.find(x => x.slug === 'cookie-policy');
  let doc = legal.container(page);
  const h1 = doc.match(/<h1>([\s\S]*?)<\/h1>/);
  const dated = doc.match(/<p>\s*<strong>\s*((?:Last\s+Updated|Effective\s+Date)[\s\S]*?)<\/strong>\s*<\/p>/i);
  if (!h1 || !dated) throw new Error('body-plain: the Cookie Policy source has no <h1> or no dated line');
  doc = doc.replace(h1[0], '').replace(dated[0], '');
  return { h1: h1[1].trim(), dated: '<strong class="font-bold text-ink-900">' + dated[1].trim() + '</strong>', body: doc, eyebrow: page.eyebrow };
}

/* ── the Guide pages ──────────────────────────────────────────────────────── */
function guidePage(p) {
  const { body, heads } = withIds(p.body, article.slug);
  const words = (text(body).match(/\S+/g) || []).length;
  const { html } = article.page({
    breadcrumb: [['All guides', 'user-manuals.html'], p.crumb],
    h1: p.h1,
    meta: ['User Guide', '<span class="nums">' + Math.max(1, Math.round(words / 200)) + '</span> min read'],
    blocks: [{ t: 'html', html: body.trim(), headings: heads.map(h => ({ id: h.id, text: h.text })) }],
  });
  const out = shell.render({ title: p.title, sections: [html] });
  fs.writeFileSync(path.join(SITE, p.out), out);
  console.log('  site/' + p.out + ' — ' + heads.length + ' sections, ' + words.toLocaleString('en-US') + ' words, ' + out.length + ' bytes');
  return { body, heads };
}

const COOKIE = cookieSource();
const LEGAL = [
  { out: 'legal-plain-cookie-policy.html', as: 'cookie-policy', title: 'Cookie Policy, from plain HTML', eyebrow: COOKIE.eyebrow, h1: COOKIE.h1, dated: COOKIE.dated, body: COOKIE.body },
  { out: 'legal-elements.html', title: 'Legal typography', eyebrow: 'Reference', h1: 'Legal typography: every element of a legal document',
    dated: 'A reference page, not a legal document', body: read('legal-elements.body.html') },
];
const GUIDE = [
  { out: 'guide-plain-storage.html', title: 'What is Storage Checking? | PlagiarismSearch', crumb: 'Storage Checking',
    h1: 'What is Storage Checking? Get Advantages from a User Private Database', body: read('guide-storage.body.html') },
  { out: 'guide-elements.html', title: 'Guide typography | PlagiarismSearch', crumb: 'Guide typography',
    h1: 'Guide typography: every element of a User Guide article', body: read('guide-elements.body.html') },
];

module.exports = { LEGAL, GUIDE, withIds };
if (require.main !== module) return;
LEGAL.forEach(legalPage);
GUIDE.forEach(guidePage);
