/* Check site/about-us.html against the brief of 2026-09-30, the Core 4 Final Correction
   Pack of 2026-10-05 (new-tasks/new-page-6/) and its own copy (build/about.js COPY):
   every string word for word; the nine profiles in order with their approved roles;
   what the pack removed, gone; the six approved milestones and no other year; the
   placeholders honest (no face images, no invented LinkedIn address); the links the
   brief names and no sales CTA; the wording the brief forbids absent; the page-specific
   components (build/about/) keeping their content contracts; and the global change —
   "About us" once in the desktop menu, once in the mobile menu, once in the footer, on
   every page, with the footer's app badges and ratings as they were.

   Run: node build/check-about.js
*/
const fs = require('fs');
const path = require('path');
const { COPY, OUT } = require('./about');
const { parse } = require('./check-library');   /* the HTML reader only — read, not extended */
const team = require('./about/team');
const CHECKS = [require('./about/team.check'), require('./about/timeline.check')];

const SITE = path.join(__dirname, '..', 'site');
const FILE = process.argv[2] || OUT;
const html = fs.readFileSync(path.join(SITE, FILE), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>') + 7);
const unesc = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const flat = s => unesc(s.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
const text = flat(body);
const words = s => s.trim().split(/\s+/).length;
const sentences = s => (s.match(/[.!?](?=\s|$)/g) || []).length;

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};

console.log('page-level');
{
  const h1 = (html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g) || []).map(flat);
  ok('exactly one H1: "' + COPY.hero.h1 + '"', h1.length === 1 && h1[0] === COPY.hero.h1, h1.join(' | '));
  ok('title', unesc((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '') === COPY.title);
  ok('meta description, ' + COPY.meta.length + ' characters', unesc((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '') === COPY.meta && COPY.meta.length <= 160);
  ok('self-canonical /about-us', html.includes('<link rel="canonical" href="https://plagiarismsearch.com/about-us"'));
  /* the prototype's shared head carries noindex on every page (DESIGN.md); the page adds none of its own */
  const head = fs.readFileSync(path.join(__dirname, 'shell', 'head.html'), 'utf8');
  const robots = s => (s.match(/<meta name="(?:robots|googlebot)"[^>]*>/g) || []).join('');
  ok('no robots meta of its own (only the prototype head\'s)', robots(html) === robots(head));
  const hs = [...body.matchAll(/<h([1-6])\b/g)].map(m => +m[1]);
  ok('heading order: no level skipped, nothing below h3', hs[0] === 1 && hs.every((h, i) => h <= 3 && (!i || h - hs[i - 1] <= 1)), hs.join(''));
}

console.log('\ncopy, verbatim');
{
  const strings = [];
  const walk = (v, k) => {
    if (['title', 'meta', 'canonical', 'photo', 'linkedin', 'ring'].includes(k) || /Href$/.test(k || '')) return;
    if (typeof v === 'string') { if (v) strings.push(v); }
    else if (Array.isArray(v)) v.forEach(x => walk(x));
    else if (v && typeof v === 'object') for (const kk in v) walk(v[kk], kk);
  };
  walk(COPY);
  /* the hero prints the Today line as four chips: the same words without the dots between them */
  const dots = s => s.replace(/ · /g, ' ');
  const missing = strings.filter(s => !dots(text).includes(dots(flat(s))));
  ok(strings.length + ' strings of COPY present word for word', !missing.length, missing.slice(0, 3).join(' | '));
}

console.log('\nfacts and tone (brief §2, §3, §9, §13, §25)');
{
  const all = text + ' ' + COPY.title + ' ' + COPY.meta;
  const banned = [/co-?founder/i, /passionate/i, /\bfamily\b/i, /driven by innovation/i, /world-class/i, /global team/i, /industry-leading/i,
    /best-in-class/i, /team of (9|nine)/i, /small team/i, /cold (e-?mail|outreach)/i, /\bCEO\b/, /\bCTO\b/, /Principal Engineer/i, /Chief Architect/i,
    /SEO Specialist/i, /start checking now/i, /check your paper for free/i, /trustpilot/i, /\bG2\b/, /500k|500,000|half a million/i, /\boffice/i, /careers?\b/i,
    /open positions/i, /countr(y|ies)/i, /Ukraine|Denmark|Spain|United States/i, /revolutioni[sz]/i, /AI[- ]plagiarism/i];
  const hit = banned.filter(re => re.test(all)).map(String);
  ok(banned.length + ' forbidden wordings absent', !hit.length, hit.join(' '));
  ok('"Growth Lead" only as "SEO & Growth Lead"', (all.match(/Growth Lead/g) || []).length === (all.match(/SEO & Growth Lead/g) || []).length);
  ok('Oleksandr Kozuliov: Technical Lead, "from the beginning", never a founder; named in the Story and in his profile, not in the hero', /Oleksandr Kozuliov has guided the technical development of PlagiarismSearch from the beginning/.test(text) && !/Kozuliov[^.]*found/i.test(text) && (text.match(/Kozuliov/g) || []).length === 2 && (text.match(/found(ed|er)\b/gi) || []).length >= 2);
  ok('Pavlo Kucheruk: the founder, actively involved', /launched in 2009 under founder Pavlo Kucheruk/.test(text) && /Pavlo founded PlagiarismSearch and has stayed actively involved/.test(text));
  ok('AI analysis kept separate from plagiarism checking', (text.match(/AI text detection is added as a capability separate from plagiarism detection/g) || []).length === 1 && (text.match(/separate AI-writing analysis/g) || []).length === 2);
  const years = [...new Set(text.match(/\b(?:19|20)\d\d\b/g) || [])].sort();
  ok('no year but the six approved', years.join() === '2009,2013,2017,2018,2023,2026', years.join());
}

console.log('\nthe correction pack of 2026-10-05');
{
  const hero = body.slice(0, body.indexOf('data-component="about-story"'));
  const dts = [...hero.matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>/g)].map(m => flat(m[1]));
  ok('hero fact sheet: three ideas — Launched, Founder, Today', dts.join() === 'Launched,Founder,Today', dts.join());
  ok('hero: 2009, the founder and the product today; nobody else named', /2009/.test(flat(hero)) && /Pavlo Kucheruk/.test(flat(hero)) && !/Kozuliov|Students/.test(flat(hero)));
  const gone = ['This page is about its history', 'First built for', 'Six milestones, in the order they happened', 'led by Oleksandr Kozuliov',
    'rather than any single release', 'How the work connects', 'not separate departments', 'Product direction', 'Growth & communication'];
  const still = gone.filter(g => text.includes(g));
  ok(gone.length + ' removed wordings absent', !still.length, still.join(' | '));
  ok('the Story does not repeat the Timeline\'s milestones', !/Moodle|Canvas|Google Docs|API/.test(COPY.story.paras.join(' ')));
  ok('no line over the Timeline', !/<section[^>]*data-component="timeline"[\s\S]*?class="section-intro"[\s\S]*?<ol class="timeline-list"/.test(body));
}

console.log('\ntimeline (brief §3, §6)');
{
  const items = [...body.matchAll(/<li class="timeline-item[^"]*">\s*<p class="timeline-year">([^<]*)<\/p>\s*<h3 class="timeline-title">([^<]*)<\/h3>\s*<p class="timeline-text">([^<]*)<\/p>/g)].map(m => [m[1], unesc(m[2]), unesc(m[3])]);
  const want = [['2009', 'Launch'], ['2013', 'API'], ['2017', 'Moodle'], ['2018', 'Google Docs'], ['2023', 'AI Detection'], ['2026', 'Canvas']];
  ok('six milestones, the approved years and labels, in order', JSON.stringify(items.map(i => i.slice(0, 2))) === JSON.stringify(want), items.map(i => i[0]).join(' '));
  ok('each with its text from COPY', items.every((i, n) => i[2] === COPY.timeline.items[n].text));
  ok('an ordered list', /<ol class="timeline-list" role="list">/.test(body));
}

console.log('\nteam (brief §7–§10, §22)');
{
  const cards = body.split('<li class="team-card').slice(1).map(c => c.slice(0, c.indexOf('</li>')));
  const P = COPY.team.people;
  const ROLES = [['Pavlo Kucheruk', 'Founder & Product Lead'], ['Oleksandr Kozuliov', 'Technical Lead'], ['Denys Olshtynskyi', 'Senior Software Engineer'],
    ['Viacheslav Hladun', 'SEO & Growth Lead'], ['Viktoriia Bas', 'Customer Success Lead'], ['Melissa Anderson', 'Customer Success Specialist'],
    ['Viola Romanovych', 'Business Development & Outreach Specialist'], ['Tetiana Zoziuk', 'Digital Marketing & Communications Specialist'], ['Oleksandr Bondarenko', 'Product Designer']];
  const got = cards.map(c => [flat((c.match(/<h3 class="team-name">([\s\S]*?)<\/h3>/) || [])[1] || ''), flat((c.match(/<p class="team-role">([\s\S]*?)<\/p>/) || [])[1] || '')]);
  ok('nine profiles, the brief\'s names and roles, in the brief\'s order', JSON.stringify(got) === JSON.stringify(ROLES), got.length + ' cards');
  ok('COPY carries the same nine', JSON.stringify(P.map(p => [p.name, p.role])) === JSON.stringify(ROLES));
  const wc = P.map(p => words(p.bio)), sc = P.map(p => sentences(p.bio));
  /* the brief asked for even bios, 30–55 words; the correction pack took a sentence from two
     of them and said not to write anything in its place, so the floor is theirs now */
  ok('bios 25–55 words', wc.every(n => n >= 25 && n <= 55), wc.join(' '));
  ok('bios 2–3 sentences', sc.every(n => n >= 2 && n <= 3), sc.join(' '));
  ok('each bio on the page, word for word', cards.every((c, i) => flat((c.match(/<p class="team-bio">([\s\S]*?)<\/p>/) || [])[1] || '') === P[i].bio));
  /* every card the same five parts in the same order: nobody larger, nobody first among equals */
  const shape = c => (c.match(/class="(team-(?:photo|name|role|bio|linkedin))["\s]/g) || []).join();
  ok('every card the same five parts, same order, no extra class', cards.every(c => shape(c) === shape(cards[0])) && cards.every(c => /^( rv)?">/.test(c)), shape(cards[0]).replace(/class=|"/g, ''));
  /* placeholders: a photo only when COPY names one (and then it must exist on disk); else the initials */
  const photoOk = cards.every((c, i) => P[i].photo
    ? c.includes(`src="${P[i].photo.src}"`) && fs.existsSync(path.join(SITE, P[i].photo.src)) && /alt="[^"]+"/.test(c)
    : !/<img\b/.test(c) && c.includes(`<span class="team-initials" aria-hidden="true">${team.initials(P[i].name)}</span>`));
  ok(P.filter(p => !p.photo).length + ' portrait placeholders (initials), ' + P.filter(p => p.photo).length + ' real photos; no other image of a person', photoOk && !/<img\b/.test(body.replace(/<li class="team-card[\s\S]*?<\/li>/g, '')));
  const liOk = cards.every((c, i) => P[i].linkedin
    ? c.includes(`<a class="team-linkedin" href="${P[i].linkedin}" rel="noopener" aria-label="LinkedIn profile of ${P[i].name}">`)
    : /<span class="team-linkedin" aria-hidden="true"><svg/.test(c) && !/<a\b/.test(c));
  ok(P.filter(p => !p.linkedin).length + ' inactive LinkedIn marks (not links), ' + P.filter(p => p.linkedin).length + ' real addresses', liOk);
  const li = [...html.matchAll(/href="([^"]*linkedin[^"]*)"/gi)].map(m => m[1]);
  ok('no LinkedIn address on the page that COPY does not hold', li.every(h => P.some(p => p.linkedin === h)), li.join(' '));
  ok('no other social network in a card', !/(twitter|x\.com|facebook|instagram|github)\./i.test(cards.join('')));
}

console.log('\nlinks (brief §12, §16)');
{
  const hrefs = [...body.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(m => [m[1], flat(m[2])]);
  const want = [['#team', COPY.hero.cta], ['why-us.html', COPY.story.more], ['mission.html', COPY.close.primary], ['contact-us.html', COPY.close.secondary], ['plagiarism-checker-for-organization.html', COPY.close.noteLink]];
  ok('exactly the five links of the brief, in page order', JSON.stringify(hrefs) === JSON.stringify(want), hrefs.map(h => h[0]).join(' '));
  ok('every target exists', hrefs.every(([h]) => h.startsWith('#') ? new RegExp('id="' + h.slice(1) + '"').test(body) : fs.existsSync(path.join(SITE, h))));
  const band = body.slice(body.indexOf('data-component="cta-band"'));
  ok('the closing band: Mission & Values first, Contact second, no checker or pricing', band.indexOf('mission.html') > 0 && band.indexOf('mission.html') < band.indexOf('contact-us.html') && !/index\.html|prices\.html|#top/.test(body));
}

console.log('\nstructure');
{
  const secs = [...body.matchAll(/<section\b[^>]*>/g)].map(m => m[0]);
  const comp = secs.map(s => (s.match(/data-component="([^"]+)"/) || [])[1]);
  ok('five sections in the approved order', comp.join() === 'about-hero,about-story,timeline,team,cta-band', comp.join());
  /* the Section Header's pill takes its background from the host section's data-bg */
  const hosts = body.split(/(?=<section\b)/).filter(s => s.includes('class="section-eyebrow"') || s.includes('class="section-title"'));
  ok(hosts.length + ' sections host a Section Header, each with data-bg', hosts.length === 4 && hosts.every(s => /^<section\b[^>]*data-bg="(white|tint)"/.test(s)));
  ok('no eyebrowBg / introSize leftovers', !/class="section-eyebrow"[^>]*data-bg|class="section-intro"[^>]*data-size/.test(body));
  ok('no <style>, no <script>, no inline style, no on* handler', !/<style|<script|\sstyle="|\son[a-z]+="/.test(body));
  ok('no <img> without a file', [...body.matchAll(/<img\b[^>]*src="([^"]+)"/g)].every(m => fs.existsSync(path.join(SITE, m[1]))));
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  ok(ids.length + ' ids, none twice', new Set(ids).size === ids.length, ids.filter((x, i) => ids.indexOf(x) !== i).join(' '));
  ok('standard section padding on the bespoke content section (the components carry theirs in CSS), the hero\'s own',(body.match(/<section[^>]*class="[^"]*py-16 sm:py-24 lg:py-32/g) || []).length === 1 && /pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 lg:pb-28/.test(secs[0]));
  /* the hero's button carries the size itself; the closing band's two are the library's
     pair (build/sections/cta-band.css gives data-layout="pair" the same 48 / 56px) */
  ok('standalone buttons are h-12 sm:h-14: the hero\'s, and the closing band\'s pair', (body.match(/class="btn-press[^"]*"/g) || []).length === 1 && (body.match(/class="btn-press[^"]*"/g) || []).every(c => /\bh-12 sm:h-14\b/.test(c)) &&
    /<div class="cta-actions rv" data-layout="pair">\s*<a [^>]*class="cta-button btn-press group">[\s\S]*?<\/a>\s*<a [^>]*class="cta-button-secondary btn-press">/.test(body));
  ok('root-relative assets, no Play CDN', html.includes('href="/assets/css/site.css"') && html.includes('href="/assets/css/tailwind.css"') && !html.includes('cdn.tailwindcss.com'));
}

console.log('\nthe page-specific components keep their contracts (build/about/*.contract.js)');
{
  const run = h => {
    const { root, problems } = parse(h);
    const ctx = { errors: problems.map(p => ({ line: p.line, msg: 'markup: ' + p.msg })), warnings: [] };
    const found = CHECKS.flatMap(c => c.validate(root, ctx));
    return { found, ...ctx };
  };
  const r = run(html);
  ok('the page: ' + r.found.map(f => `${f.component} (${f.count} ${f.unit})`).join(', '), r.found.length === 2 && !r.errors.length && !r.warnings.length,
     [...r.errors, ...r.warnings].slice(0, 3).map(e => 'line ' + e.line + ': ' + e.msg).join(' | '));
  /* the validator must also say no — and yes — to edits of the page's own sections */
  for (const c of CHECKS) {
    const m = body.match(new RegExp(`<section[^>]*data-component="${c.name}"[\\s\\S]*?</section>`));
    const good = m ? m[0] : '';
    ok(`${c.title}: its section is found on the page`, !!good && !run(good).errors.length);
    for (const [what, mutate] of c.BAD) {
      const bad = mutate(good); const res = bad === good ? null : run(bad);
      ok(`${c.title}: rejects ${what}`, !!res && res.errors.length > 0, res ? (res.errors[0] ? '' : 'accepted!') : 'the edit did not apply');
    }
    for (const [what, mutate] of c.GOOD) {
      const g = mutate(good); const res = g === good ? null : run(g);
      ok(`${c.title}: accepts ${what}`, !!res && !res.errors.length, res ? (res.errors[0] ? res.errors[0].msg.slice(0, 110) : '') : 'the edit did not apply');
    }
  }
}

console.log('\nglobal navigation and footer (brief §23, §24) — every page');
{
  const A = 'href="about-us.html"';
  const cut = (s, tag) => { const a = s.indexOf('<' + tag), b = s.indexOf('</' + tag + '>'); return a < 0 ? '' : s.slice(a, b); };
  const tpl = n => fs.readFileSync(path.join(__dirname, 'shell', n), 'utf8');
  const header = tpl('header-v2.html'), footer = tpl('footer-v2.html');
  const desk = header.slice(header.indexOf('{{NAV_COMPANY}}'), header.indexOf('id="navBurger"'));
  const mob = header.slice(header.indexOf('id="navPanel"'));
  const first = (s, from) => (s.slice(s.indexOf(from)).match(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/) || []).slice(1).join(' ');
  ok('header template: "About us" once in the desktop Company menu, first', desk.split(A).length === 2 && first(desk, '{{NAV_COMPANY}}') === 'about-us.html About us');
  ok('header template: "About us" once in the mobile menu, first under Company', mob.split(A).length === 2 && first(mob, '>Company</div>') === 'about-us.html About us');
  ok('header template: nowhere else, and the rest of the Company group unchanged', header.split(A).length === 3 && !/"[a-zA-Z-]+="/.test(header + footer) /* no attribute glued to the one before it */ &&
     ['why-us.html', 'mission.html', 'testimonials.html', 'contact-us.html'].every(h => desk.split(`href="${h}"`).length === 2 && mob.split(`href="${h}"`).length === 2));
  const company = footer.slice(footer.indexOf('>COMPANY</div>'), footer.indexOf('PLANS &amp; LEGAL'));
  const fl = [...company.matchAll(/<a href="([^"]+)"/g)].map(m => m[1]);
  ok('footer template: "About us" once, first in the Company column, the other six after it', footer.split(A).length === 2 &&
     fl.join() === 'about-us.html,why-us.html,mission.html,testimonials.html,contact-us.html,scholarship.html,affiliate-program-at-plagiarismsearch.html', fl.join(' '));
  const bar = footer.slice(footer.indexOf('&copy; 2026'));
  ok('footer baseline kept: App Store link, Google Play badge and placeholder link, ratings in the bottom bar',
     footer.includes('href="https://apps.apple.com/us/app/plagiarismsearch/id6789566745"') && footer.includes('app-store-badge-black-en.svg') &&
     footer.includes('google-play-badge-en.svg') && footer.includes('href="https://play.google.com/store/search?q=PlagiarismSearch&amp;c=apps"') &&
     /Trustpilot <b[^>]*>4\.7<\/b>/.test(bar) && /SmartCustomer <b[^>]*>4\.0<\/b>/.test(bar) && /G2 <b[^>]*>4\.3<\/b>/.test(bar) &&
     footer.indexOf('app-store-badge') < footer.indexOf('>PRODUCTS<') && footer.indexOf('Trustpilot') > footer.indexOf('PLANS &amp; LEGAL'));
  const SKIP = new Set(['design-system.html', 'pages.html', 'section-library.html']);
  const pages = fs.readdirSync(SITE).filter(f => f.endsWith('.html') && !SKIP.has(f));
  const off = [];
  for (const f of pages) {
    const s = fs.readFileSync(path.join(SITE, f), 'utf8');
    const h = cut(s, 'header'), ft = cut(s, 'footer');
    const hn = h.split(A).length - 1, fn = ft.split(A).length - 1;
    if (!((hn === 2 || (hn === 0 && !/<nav/.test(h))) && fn === 1)) off.push(f + ' (header ' + hn + ', footer ' + fn + ')');
    else if (!ft.includes('apps.apple.com/us/app/plagiarismsearch/id6789566745') || !ft.includes('google-play-badge-en.svg') || !/Trustpilot <b/.test(ft)) off.push(f + ' (footer baseline)');
  }
  ok(pages.length + ' pages: the link twice in the header (desktop + mobile), once in the footer; badges and ratings in place', !off.length, off.slice(0, 5).join(', '));
  const self = cut(html, 'header');
  ok('on this page the Company item is the active one', /<button[^>]*class="[^"]*bg-ink-900\/5 text-ink-900 font-semibold"[^>]*>Company</.test(self));
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok'));
process.exit(failed ? 1 : 0);
