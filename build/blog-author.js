/* Generate site/blog-author-kelsey-ayton.html — a blog author's page, from the live
   /blog/author/kelsey-ayton (Olex, 2026-10-07).

   There is no brief, so what the page says is the live page's, read from the stored copy:

     curl -sL -A "Mozilla/5.0" https://plagiarismsearch.com/blog/author/kelsey-ayton -o build/legal/blog-author-kelsey-ayton.html
     node build/blog-author.js  →  node build/shell.js  →  node build/check-blog-author.js

   THE LIVE PAGE is a profile card (photograph, name, two lines of bio, a Twitter link)
   over the author's posts, ten to a page, six pages, beside the blog's sidebar
   (search, categories, archives, recent posts).

   THIS PAGE keeps the profile and the posts and takes its dress from the blog index:
   - the hero is the profile: the live heading "Author page: Kelsey Ayton" as the pill and
     the H1, the photograph, the first line of the bio as it is and its second line —
     four roles between bars — as four chips, the Twitter link;
   - the posts are the index's own cards, the newest set as the index sets its newest;
     each keeps its live title and date. The index's card carries no excerpt, so the
     live excerpts are not printed;
   - the pager is the index's, with the live page's six pages;
   - the closing band is the index's own section, read from site/blog.html so the two
     cannot drift apart. The sidebar is not carried, as on the index.

   WHERE A POST LEADS. The prototype holds one article of the ten; that one is linked
   locally, the other nine keep their live addresses.

   PICTURES. Four of the ten posts already had theirs (the index's). The other six, and
   the photograph, are the live blog's files, at the index's size (740×550 WebP). The
   live site serves the photograph at 128px only, so it is shown at 96.

   The article (site/blog-best-checker-2026.html) links its author's name here. */
const fs = require('fs');
const path = require('path');
const page = require('./page');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'blog-author-kelsey-ayton.html';
const LIVE = 'https://plagiarismsearch.com';
const src = fs.readFileSync(path.join(__dirname, 'legal', 'blog-author-kelsey-ayton.html'), 'utf8');

const ent = s => s.replace(/&#0?39;/g, '\'').replace(/&amp;/g, '&').replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ');
const text = s => ent(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pick = (re, what) => { const m = src.match(re); if (!m) throw new Error('blog-author: the live page has no ' + what); return m[1]; };

/* ── the live page ─────────────────────────────────────────────────────────── */
const heading = text(pick(/<div class="pageTitle[^"]*">([\s\S]*?)<\/div>/, 'page title'));           /* "Author page: Kelsey Ayton" */
const name = text(pick(/<div class="p-author-name">([\s\S]*?)<\/div>/, 'author name'));
if (!heading.endsWith(': ' + name)) throw new Error('blog-author: the heading is no longer "<label>: <name>": ' + heading);
const label = heading.slice(0, -name.length - 2);
const bio = pick(/<div class="p-author-bio">([\s\S]*?)<\/div>/, 'bio').split(/<br\s*\/?>/i).map(text).filter(Boolean);
if (bio.length !== 2) throw new Error('blog-author: the bio is drawn as a line and a row of roles, got ' + bio.length + ' lines');
const roles = bio[1].split('|').map(s => s.trim()).filter(Boolean);
const twitter = pick(/<div class="p-author-links[^"]*">\s*<a href="([^"]+)"/, 'social link');
const posts = [...src.matchAll(/<article class="post-item">([\s\S]*?)<\/article>/g)].map(m => {
  const a = m[1];
  return { href: (a.match(/<h4><a href="([^"]+)"/) || [])[1], title: text((a.match(/<h4><a[^>]*>([\s\S]*?)<\/a>/) || [])[1] || ''),
           date: text((a.match(/class="post-date">([^<]*)</) || [])[1] || ''), excerpt: text((a.match(/<p>([\s\S]*?)<\/p>/) || [])[1] || '') };
});
if (posts.length !== 10 || posts.some(p => !p.href || !p.title || !p.date)) throw new Error('blog-author: expected ten posts with a title and a date');
const pages = Math.max(...[...src.matchAll(/\/blog\/author\/kelsey-ayton\/page\/(\d+)"/g)].map(m => +m[1]));

/* ── what the prototype holds ──────────────────────────────────────────────── */
const LOCAL = { '/blog/best-plagiarism-checker-in-2026': 'blog-best-checker-2026.html' };
const PICTURE = {
  'best-plagiarism-checker-in-2026': 'post-02', 'how-to-avoid-plagiarism-guide': 'post-04',
  'changing-attitudes-what-do-young-people-really-think-about-plagiarism': 'post-05',
  'at-what-point-does-ai-help-become-academic-dishonesty': 'post-07',
  'the-role-of-bots-in-safeguarding-intellectual-property': 'post-11',
  'differentiating-intentional-and-unintentional-plagiarism-in-academic-writing': 'post-12',
  'exploring-plagiarism-within-the-digital-neural-network': 'post-13',
  'identifying-ai-in-students-assignments-approaches-for-educators': 'post-14',
  'maximizing-revenue-with-automated-content-generation': 'post-15',
  'ai-journalism-bots-and-their-impact-on-news-production': 'post-16',
};
const to = p => LOCAL[p.href] || LIVE + p.href;
const rel = h => (/^https?:/.test(h) ? ' rel="noopener"' : '');
const pic = p => { const f = PICTURE[p.href.split('/').pop()]; if (!f || !fs.existsSync(path.join(SITE, 'assets/img/blog', f + '.webp'))) throw new Error('blog-author: no picture for ' + p.href); return '/assets/img/blog/' + f + '.webp'; };
const initials = name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

const ARROW = '<svg class="transition-transform duration-300 group-hover:translate-x-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const TWITTER = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>';

/* ═══════════════ 01 · THE AUTHOR ═══════════════ */
const section1 = () => `  <!-- ================= 01 · THE AUTHOR =================
       The blog index's hero, holding the live profile: the heading "${heading}" as the
       pill and the H1, the photograph, the bio's first line, its roles as chips, and
       the Twitter link. -->
  <section id="author" data-component="blog-author" class="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-16 lg:pb-20 bg-[#F2FCFC]">
    <div class="orb w-[620px] h-[620px] bg-teal-500/12 -left-48 -top-40"></div>
    <div class="orb w-[560px] h-[560px] bg-orange-500/10 right-[-150px] top-52"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv text-center max-w-[720px] mx-auto">
        <nav class="flex items-center justify-center gap-2 text-[12.5px] font-medium text-ink-500 mb-6 sm:mb-7" aria-label="Breadcrumb">
          <a href="blog.html" class="hover:text-ink-900 transition-colors duration-300">Blog</a>
          <span class="text-ink-300" aria-hidden="true">/</span>
          <span class="text-ink-700">${esc(name)}</span>
        </nav>
        <img src="/assets/img/blog/authors/kelsey-ayton.webp" alt="${esc(name)}" width="128" height="128" class="w-24 h-24 rounded-full object-cover mx-auto mb-5 sm:mb-6 ring-4 ring-white shadow-diffuse">
        <div class="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5">
          <span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">${esc(label)}</span>
        </div>
        <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 lg:mb-5">${esc(name)}</h1>
        <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] text-ink-600 leading-relaxed">${esc(bio[0])}</p>
        <ul class="flex flex-wrap items-center justify-center gap-2 mt-5 sm:mt-6" role="list">
${roles.map(r => `          <li class="inline-flex items-center rounded-full bg-white ring-1 ring-black/5 px-3.5 py-1.5 text-[12.5px] sm:text-[13px] font-semibold text-ink-700">${esc(r)}</li>`).join('\n')}
        </ul>
        <a href="${twitter}" rel="noopener" aria-label="Twitter" class="btn-press inline-flex items-center justify-center w-11 h-11 mt-5 sm:mt-6 rounded-full bg-white ring-1 ring-black/10 text-ink-700 hover:text-ink-900 hover:ring-black/20 transition-shadow duration-300">${TWITTER}</a>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · THE POSTS ═══════════════ */
const byline = (p, small) => `<span class="${small ? 'w-7 h-7 text-[10px]' : 'w-8 h-8 text-[11px]'} shrink-0 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">${initials}</span>
                <span class="min-w-0 ${small ? 'text-[11.5px]' : 'text-[12.5px]'} font-semibold text-ink-700 truncate">${esc(name)}</span>`;
const card = p => `          <article class="rv min-w-0 rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse overflow-hidden flex flex-col">
            <a href="${to(p)}"${rel(to(p))} class="block overflow-hidden">
              <img src="${pic(p)}" alt="" width="740" height="550" loading="lazy" decoding="async" class="w-full aspect-[740/550] object-cover transition-transform duration-500 hover:scale-[1.03]">
            </a>
            <div class="p-4 sm:p-5 lg:p-6 flex flex-col flex-1">
              <a href="${to(p)}"${rel(to(p))} class="group flex flex-col">
                <h2 class="line-clamp-4 text-[17px] sm:text-[19px] lg:text-[20px] font-bold tracking-tight leading-snug mb-2 group-hover:text-teal-700 transition-colors duration-300">${esc(p.title)}</h2>
                <span class="inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14.5px] font-semibold text-teal-700">Read the article ${ARROW}</span>
              </a>
              <div class="mt-auto flex items-center gap-2.5 pt-4 sm:pt-5 lg:pt-6">
                ${byline(p, true)}
                <span class="ml-auto shrink-0 text-[11.5px] font-medium text-ink-400 whitespace-nowrap">${esc(p.date)}</span>
              </div>
            </div>
          </article>`;
const pager = n => {
  const NUM = 'btn-press inline-flex items-center justify-center w-10 h-10 rounded-full bg-white ring-1 ring-black/5 text-ink-700 text-[13px] font-bold nums hover:bg-ink-50 transition-colors duration-300';
  const at = k => LIVE + '/blog/author/kelsey-ayton/page/' + k;
  const shown = n <= 5 ? Array.from({ length: n - 1 }, (_, i) => i + 2) : [2, 3, 4, null, n];
  return `        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-ink-900 text-white text-[13px] font-bold nums" aria-current="page">1</span>
${shown.map(k => (k === null
    ? '        <span class="px-1 text-[13px] font-bold text-ink-300">&hellip;</span>'
    : `        <a href="${at(k)}" rel="noopener" class="${NUM}">${k}</a>`)).join('\n')}
        <a href="${at(2)}" rel="noopener" class="btn-press group inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-black/5 text-ink-700 text-[13px] font-semibold px-4 h-10 ml-1 hover:bg-ink-50 transition-colors duration-300">Next ${ARROW}</a>`;
};
const [first, ...rest] = posts;
const section2 = () => `  <!-- ================= 02 · THE AUTHOR'S POSTS =================
       The blog index's layout: the newest post set large, the other nine as the index's
       cards. Titles and dates are the live page's. The pager has the live page's
       ${pages} pages; the prototype holds the first, so the others lead to the live site. -->
  <section id="posts" data-component="blog-author-posts" class="relative py-16 sm:py-24 lg:py-32 bg-white overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">

      <div class="rv min-w-0 grid lg:grid-cols-[1.05fr_.95fr] gap-6 sm:gap-8 lg:gap-12 items-center mb-8 sm:mb-10 lg:mb-12">
        <div class="min-w-0 order-2 lg:order-1">
          <div class="flex items-center gap-2.5 mb-4 lg:mb-5">
            <span class="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.18em] text-orange-700">Newest</span>
            <span class="text-[11.5px] font-medium text-ink-400 whitespace-nowrap">${esc(first.date)}</span>
          </div>
          <a href="${to(first)}"${rel(to(first))} class="group block">
            <h2 class="text-[clamp(1.6rem,2.8vw,2.4rem)] font-extrabold tracking-tightest leading-[1.2] mb-4 lg:mb-5 group-hover:text-teal-700 transition-colors duration-300">${esc(first.title)}</h2>
            <span class="inline-flex items-center gap-2 text-[14.5px] sm:text-[15px] lg:text-[15.5px] font-semibold text-teal-700">Read the article ${ARROW}</span>
          </a>
          <div class="flex items-center gap-2.5 pt-6 sm:pt-7 lg:pt-8">
            ${byline(first, false)}
          </div>
        </div>
        <a href="${to(first)}"${rel(to(first))} class="order-1 lg:order-2 block overflow-hidden rounded-3xl sm:rounded-[28px] lg:rounded-4xl shadow-diffuse">
          <img src="${pic(first)}" alt="" width="740" height="550" decoding="async" class="w-full aspect-[740/550] object-cover transition-transform duration-500 hover:scale-[1.03]">
        </a>
      </div>

      <div class="h-px bg-ink-100 mb-8 sm:mb-10 lg:mb-12"></div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
${rest.map(card).join('\n\n')}
      </div>

      <nav class="rv flex flex-wrap items-center justify-center gap-2 mt-8 sm:mt-10 lg:mt-12" aria-label="Pages">
${pager(pages)}
      </nav>
    </div>
  </section>`;

/* ═══════════════ 03 · THE BLOG'S CLOSING BAND ═══════════════ */
const section3 = () => {
  const blog = fs.readFileSync(path.join(SITE, 'blog.html'), 'utf8');
  const a = blog.indexOf('<section data-component="blog-3"'), b = blog.indexOf('</section>', a);
  if (a < 0 || b < 0) throw new Error('blog-author: site/blog.html has no closing section (blog-3)');
  return `  <!-- ================= 03 · CTA =================
       The blog index's own closing section, read from site/blog.html. -->
  ` + blog.slice(a, b + '</section>'.length);
};

module.exports = { OUT, heading, label, name, bio, roles, twitter, posts, pages, LOCAL, LIVE };
if (require.main !== module) return;

const html = page.render({ title: esc(text(pick(/<title>([\s\S]*?)<\/title>/, 'title'))), canonical: LIVE + '/blog/author/kelsey-ayton', sections: [section1(), section2(), section3()] });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  "' + heading + '" · ' + roles.length + ' roles · ' + posts.length + ' posts (' + posts.filter(p => LOCAL[p.href]).length + ' local) · ' + pages + ' pages · ' + count(/<img\b/g) + ' images');
