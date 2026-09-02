/* Build site/newsroom.html — the news archive — from build/newsroom-data.json.

   The live page is 7 paginated pages of 68 updates: a narrow date column, a blue
   heading and a paragraph, repeated. Every word of every item is carried over
   unchanged, and so is every destination it links to. What is new is the
   arrangement — the site's standard centred top, the newest year raised into a
   dark block, then the rest in the order the archive runs, twenty to a page
   behind a topic filter.

   The whole archive is in the delivered HTML; the pager only hides. A reader
   without JavaScript, and a crawler, still get all 68.

   No photographs: the live items have none, and inventing them would be
   inventing evidence.

   Refresh the source deliberately, it is not part of the page build:
     node build/newsroom-fetch.js  →  node build/newsroom.js
     →  node build/shell.js  →  node build/check-newsroom.js  →  node build/check.js

   ── What is written here, and nothing else is ─────────────────────────────
   The live page gives one heading ("Our News"), one meta description and the 68
   items. Everything below that needs a label had to be written, so here they all
   are, in one place: the eyebrows "Newsroom", "Latest" and "Archive", the H2
   "Earlier updates", the filter's "All", and the pager's "Previous" and "Next".
   They are structural labels in eyebrow and section-heading register. No
   marketing sentence was added — which is also why the page has no closing CTA
   band: that band's heading is a sentence, and there is no approved one for this
   page. Say the word and it goes in.
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'newsroom.html';

const items = require('./newsroom-data.json');
if (!Array.isArray(items) || items.length !== 68)
  throw new Error('newsroom-data.json holds ' + (items || []).length + ' items, expected 68 — run build/newsroom-fetch.js');

/* ─────────────────────────────────────────────────────────────────────────────
   Copy that is the live page's own
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  h1: 'Our News',                                                     /* the live <h1> */
  /* the live <meta name="description"> for this page, verbatim */
  support: 'Learn about the most recent news and improvements at PlagiarismSearch to keep up with the website updates',
  title: 'PlagiarismSearch News and Updates',                         /* the live <title> */
  meta: 'Learn about the most recent news and improvements at PlagiarismSearch to keep up with the website updates',
  canonical: 'https://plagiarismsearch.com/newsroom',
};

/* ─────────────────────────────────────────────────────────────────────────────
   Destinations
   Links keep the address the item gave them. The exception is a handful that
   this prototype actually holds a page for, which are pointed at it — the same
   rule build/manuals.js follows, and the app-page mapping is lifted from there.
   Anything else stays absolute, because that is where it really is.
   ───────────────────────────────────────────────────────────────────────────── */
const RENAMED = {
  'plagiarism-checker-app': 'chat-bot.html',       /* as mapped in build/manuals.js */
  'spell-checker': 'spell-check.html',
  'rate-my-paper': 'paper-analysis.html',
  'readability-checker': 'readability-check.html',
  'vip-plagiarism-checker': 'vip.html',
};

const localise = href => {
  let u;
  try { u = new URL(href, 'https://plagiarismsearch.com'); } catch { return href; }
  if (!/(^|\.)plagiarismsearch\.com$/.test(u.hostname)) return href;
  const slug = u.pathname.replace(/^\/+|\/+$/g, '');
  if (!slug) return href;
  if (RENAMED[slug] && fs.existsSync(path.join(SITE, RENAMED[slug]))) return RENAMED[slug];
  if (/^[a-z0-9-]+$/.test(slug) && fs.existsSync(path.join(SITE, slug + '.html'))) return slug + '.html';
  return u.href;
};

/* rewrite the anchors inside a stored paragraph, and mark the ones that leave */
const OUTBOUND = '<svg class="inline-block align-[-1px] ml-1 shrink-0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>';

const rich = html => html.replace(/<a href="([^"]*)">([\s\S]*?)<\/a>/g, (_, href, label) => {
  const to = localise(href.replace(/&amp;/g, '&'));
  const away = /^https?:/i.test(to);
  return '<a href="' + to.replace(/&(?!amp;)/g, '&amp;') + '"' + (away ? ' target="_blank" rel="noopener"' : '') +
    ' class="nl">' + label + (away ? OUTBOUND : '') + '</a>';
});

/* ─────────────────────────────────────────────────────────────────────────────
   Topics
   ────────────────────────────────────────────────────────────────────────────
   THE ONE THING ON THIS PAGE THAT IS A JUDGEMENT RATHER THAN A FACT.

   The live archive has no categories — 68 items in one chronological run. Sixty-eight
   short announcements read as a wall, so they are grouped by what they are about. The
   grouping is editorial: I read each item and filed it. Nothing is reworded, reordered
   within a topic, or left out, and every item keeps its date, so the chronology is
   still on the page — but if a filing looks wrong, it is wrong here and nowhere else.

   Keyed by title on purpose: re-running build/newsroom-fetch.js and getting a new item
   throws below rather than dropping it into a bucket by guesswork.
   ───────────────────────────────────────────────────────────────────────────── */
const TOPICS = [
  ['api', 'API', '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>'],
  ['integrations', 'Integrations', '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>'],
  ['detection', 'Detection & reports', '<path d="m8 11 2 2 4-4"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'],
  ['accounts', 'Accounts & storage', '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>'],
  ['billing', 'Plans & payments', '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>'],
  ['services', 'Services', '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>'],
  ['scholarship', 'Scholarships', '<path d="m22 10-10-5L2 10l10 5 10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'],
  ['company', 'Company & press', '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>'],
];

const FILED = {
  /* API — the interface itself: endpoints, auth, formats, documentation, limits */
  'Readability Score Is Now Available via API': 'api',
  'Access Usage Statistics with Our API': 'api',
  'Interactive Swagger Documentation Available through Our Updated API': 'api',
  'Recent API Update: Support for JSON Request and Response': 'api',
  'Adding a New API Feature: Authorization by Authorization Token': 'api',
  'We Are Ready to Introduce our Updated and Standardized API': 'api',
  'Choosing Your Timezone via API': 'api',
  'New Parameters to Set Up Storage Check via API': 'api',
  'PlagiarismSearch API FAQs - New Manual in Our User Guide': 'api',
  'One of our API Advantages: Fair Words': 'api',

  /* Integrations — checking from inside somebody else's product */
  'Editable Plagiarism Report in Moodle': 'integrations',
  'Updated Version Of Our Plugin Is Available': 'integrations',
  'Plugin Version for Moodle 4.3: Most Recent Release': 'integrations',
  'Checking Text Submitted Through the Links Using Our Moodle Plugin': 'integrations',
  'Moodle Plugin Options and their Meaning': 'integrations',
  'The Most Recent Release of Moodle Plugin': 'integrations',
  'The Latest Release of Moodle Plugin': 'integrations',
  'Gain Considerable Advantage of Plagiarism Check via Our Google Ad-On': 'integrations',
  'Viber and Telegram Bot': 'integrations',

  /* Detection & reports — what the checker finds and how the report shows it */
  'Plagiarism and AI Reports Now Available in Multiple Languages!': 'detection',
  'Allow Other Users to View the Highlighted Sources': 'detection',
  'Explaining the Results of Plagiarism and AI Check Report': 'detection',
  'Try Our Solution to Detect AI-Written Content': 'detection',
  'Video "Interpreting PlagiarismSearch Similarity Report"': 'detection',
  'Know the Benefit of Searching for Plagiarism Within the Storage': 'detection',
  'Implementation of STRICT Option for Plagiarism Check': 'detection',
  'Search for References in the Body of the Text': 'detection',
  'Plagiarism Detection Through Archived PDF Files': 'detection',
  'Additional Layer for Detecting Web Sources': 'detection',
  'Increased Search Speed and Quality Optimization': 'detection',
  'Right-to-Left Plagiarism Report': 'detection',
  'Improved Parsing Algorithms': 'detection',

  /* Accounts & storage — the account, the organization, the storage, the notifications */
  'United Storage for Organization Members': 'accounts',
  'Share Your Customized Plagiarism Check Package by Creating an Organization': 'accounts',
  'How to View Your Words and Submissions Statistics?': 'accounts',
  'Informative Greeting Email': 'accounts',
  'Getting Email Notification When Your Balance is Running Low': 'accounts',
  'Simplified Data Load for Storage Users and Private Customers': 'accounts',
  'Default Timezone in User Profile': 'accounts',

  /* Plans & payments — what it costs and how it is paid for */
  'Important Notice: Price Increase for Plagiarism Check Services': 'billing',
  'Updated Price List': 'billing',
  'Get More Free Submissions': 'billing',
  'Pay for Your Plagiarism Check Package via Zen': 'billing',
  'New Payment Method - EcommPay': 'billing',
  'Want More Discounts - Follow Us on Social Media': 'billing',

  /* Services — the products beside the plagiarism checker */
  'Content Readability Is Critical for Website Owners': 'services',
  'VIP Services Are Gaining Popularity Among Our Users': 'services',
  'Paper Analysis Video Tutorial': 'services',
  'Create Perfect Content with Our Grammar, Style, and Spell Checker': 'services',
  'Try Our Newly Upgraded Paper Analysis Service': 'services',
  'Readability Check Service Launch': 'services',

  /* Scholarships — the student programme and the contests run alongside it */
  'Announcing Our Second 2025 Scholarship Round – $1,000 Up for Grabs!': 'scholarship',
  'Share What Makes Your University Unique and Win $1,000!': 'scholarship',
  'Giveaway Alert': 'scholarship',
  'PlagiarismSearch Launches 2025 Scholarship Program': 'scholarship',
  'Congratulations to Our Scholarship Winner!': 'scholarship',
  'Scholarship Opportunity Alert!': 'scholarship',

  /* Company & press — research, the site itself, partners, coverage */
  'PlagiarismSearch.com Publishes Global Plagiarism Trends 2018–2025': 'company',
  'Global Plagiarism Trends Report (2018–2024) Now Live': 'company',
  'Introducing Our New Homepage Design': 'company',
  'Creating Effective Business Content with PlagiarismSearch.com': 'company',
  'Multiple Languages Available for Our Home Page': 'company',
  'PlagiarismSearch Features in the List of Best Software by Cybernews.com': 'company',
  'PlagiarismSearch Offers an Opportunity for Resellers': 'company',
  'PlagiarismSearch Proves to Be a Reliable Software for Teachers': 'company',
  'Read Our Interview at Cybernews': 'company',
  'Welcome to Join Our Affiliate Program': 'company',
  'Now Available: Arabic Version of Our Homepage': 'company',
};

{
  const unfiled = items.filter(it => !FILED[it.h]);
  if (unfiled.length) throw new Error('not filed under a topic: ' + unfiled.map(x => x.h).join(' | '));
  const known = new Set(TOPICS.map(t => t[0]));
  const wrong = Object.entries(FILED).filter(([, k]) => !known.has(k));
  if (wrong.length) throw new Error('unknown topic key: ' + wrong.map(w => w.join(' -> ')).join(', '));
  const stale = Object.keys(FILED).filter(h => !items.some(it => it.h === h));
  if (stale.length) throw new Error('filed but no longer in the data: ' + stale.join(' | '));
}

/* ─────────────────────────────────────────────────────────────────────────────
   The archive, by year
   ───────────────────────────────────────────────────────────────────────────── */
const yearOf = it => it.m.split(' ')[1];
const YEARS = [...new Set(items.map(yearOf))].sort((a, b) => b - a);
const byYear = y => items.filter(it => yearOf(it) === y);

const LATEST_YEAR = YEARS[0];
const latest = byYear(LATEST_YEAR);
const archiveYears = YEARS.slice(1);
const archive = items.filter(it => yearOf(it) !== LATEST_YEAR);
if (latest.length + archive.length !== items.length) throw new Error('archive split lost an item');

const MONTHS = { Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June',
                 Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December' };
const longDate = it => MONTHS[it.m.split(' ')[0]] + ' ' + Number(it.d) + ', ' + yearOf(it);
const iso = it => {
  const mi = Object.keys(MONTHS).indexOf(it.m.split(' ')[0]) + 1;
  return yearOf(it) + '-' + String(mi).padStart(2, '0') + '-' + it.d.padStart(2, '0');
};

/* ─────────────────────────────────────────────────────────────────────────────
   Shared bits, in the idioms the v2 pages already use
   ───────────────────────────────────────────────────────────────────────────── */
/* ── The article scheme, per DESIGN.md "Text pages" ──────────────────────────
   Olex: the news pages are too wide as well. Measured, they were the worst on the
   site — item bodies 1027px carrying 153 to 160 characters a line, twice the band
   and well past even the 88 the blog post trades for.

   COL is the established 880 rather than the article's 700, because a news item is
   a card with a date column beside it: at 880 the prose inside lands at ~720px,
   which is the same measure the blog and the report guide read at. The body takes
   the blog's ramp for the same reason the report guide does — a news item is short
   prose, and the site should not carry a second set of sizes for it. */
const COL = 'max-w-[880px] mx-auto';
const BODY = 'text-[15.5px] sm:text-[16px] lg:text-[17px] leading-[1.72]';

const eyebrow = (dot, label) => `        <div class="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">${label}</span>
        </div>`;

const eyebrowDark = (dot, label) => `        <div class="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/80">${label}</span>
        </div>`;

const h2 = t => `<h2 class="text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]">${t}</h2>`;

/* one item's body — the stored paragraphs, their lists, and the read-more link */
const body = (it, dark) => {
  const p = dark ? BODY + ' text-white/75' : BODY + ' text-ink-700';
  const out = [];
  for (const para of it.paras) {
    if (para.itemsHtml && para.itemsHtml.length) {
      const tag = para.tag === 'OL' ? 'ol' : 'ul';
      const marker = tag === 'ol' ? 'list-decimal' : 'list-disc';
      out.push(`            <${tag} class="${marker} pl-5 space-y-1.5 my-3 ${p}">
${para.itemsHtml.map(li => `              <li class="pl-1">${rich(li)}</li>`).join('\n')}
            </${tag}>`);
    } else {
      out.push(`            <p class="${p} mt-3 first:mt-0">${rich(para.html)}</p>`);
    }
  }
  if (it.more) {
    const to = localise(it.more.href);
    const away = /^https?:/i.test(to);
    out.push(`            <p class="mt-4"><a href="${to}"${away ? ' target="_blank" rel="noopener"' : ''} class="nl inline-flex items-center gap-1.5 text-[13px] sm:text-[13.5px]">${it.more.label}${away ? OUTBOUND : ''}</a></p>`);
  }
  return out.join('\n');
};

/* ═══════════════ 01 · HERO ═══════════════ */
const section1 = () => {
  const oldest = items[items.length - 1];
  const newest = items[0];
  return `  <!-- ================= 01 · HERO =================
       The blog's hero, because the top of a page is the same everywhere on this site and
       a news index has no reason to be the exception: two orbs, a centred 620px block,
       eyebrow over an H1 over one line, then the archive's own counts.

       The year panel that used to sit on the right is gone with it. It was a second
       navigation for a page that now has pagination, and it made the hero the only
       asymmetric top on the site. -->
  <section id="newsroom" class="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-16 lg:pb-20 bg-[#F2FCFC]">
    <div class="orb w-[620px] h-[620px] bg-teal-500/12 -left-48 -top-40"></div>
    <div class="orb w-[560px] h-[560px] bg-orange-500/10 right-[-150px] top-52"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv text-center max-w-[620px] mx-auto">
        <div class="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">Newsroom</span>
        </div>
        <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 lg:mb-5">${COPY.h1}</h1>
        <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] text-ink-600 leading-relaxed">${COPY.support}</p>

        <!-- the counts are the archive's own, not decoration -->
        <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-5 sm:mt-6 lg:mt-7 text-[12.5px] font-medium text-ink-500">
          <span><span class="font-bold text-ink-900 tabular-nums">${items.length}</span> updates</span>
          <span class="w-1 h-1 rounded-full bg-ink-300" aria-hidden="true"></span>
          <span><span class="font-bold text-ink-900 tabular-nums">${YEARS.length}</span> years</span>
          <span class="w-1 h-1 rounded-full bg-ink-300" aria-hidden="true"></span>
          <span>${longDate(oldest)} – ${longDate(newest)}</span>
        </div>
      </div>
    </div>
  </section>`;
};

/* ═══════════════ 02 · LATEST ═══════════════ */
const section2 = () => `  <!-- ================= 02 · LATEST =================
       The most recent year, raised out of the list and set on the dark ground so the
       page opens on what is new rather than on an archive. These items appear here
       and nowhere else — section 03 begins the year below, so nothing is printed
       twice. -->
  <section id="latest" class="relative py-14 sm:py-16 lg:py-20 bg-ink-950 overflow-hidden">
    <div class="orb absolute" style="width:760px;height:700px;right:-12%;top:-280px;background:rgba(154,106,222,.18)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv">
${eyebrowDark('teal-400', 'Latest')}
      </div>

      <div class="rv-kids grid ${latest.length > 1 ? 'lg:grid-cols-2' : ''} gap-4 sm:gap-5 lg:gap-6">
${latest.map(it => `        <article class="on-dark min-w-0 rounded-3xl sm:rounded-4xl bg-white/[.05] ring-1 ring-white/10 p-6 sm:p-7 lg:p-8">
          <div class="flex items-center gap-2.5 mb-4">
            <span class="w-1.5 h-1.5 rounded-full bg-teal-400" aria-hidden="true"></span>
            <time datetime="${iso(it)}" class="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-white/60">${longDate(it)}</time>
          </div>
          <h3 class="text-[18px] sm:text-[19px] lg:text-[20px] font-bold tracking-tight leading-[1.3] text-white mb-3">${it.h}</h3>
          <div class="min-w-0">
${body(it, true)}
          </div>
        </article>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · ARCHIVE ═══════════════ */
const topicMeta = key => TOPICS.find(t => t[0] === key);

const section3 = () => `  <!-- ================= 03 · ARCHIVE =================
       Seven pages of Next, replaced by one list. The blocks are the years, in the order
       the archive already runs — newest first, month by month. That sequence is the
       whole logic of a newsroom, so nothing here reorders it: the topic chips FILTER,
       they do not regroup. Turn one on and the same list stays in the same order with
       fewer items in it; a year whose items are all filtered out steps aside, and
       stepping back to All puts it back exactly where it was.

       The topic on each item is the one editorial judgement on the page — see the note
       over FILED in build/newsroom.js. It is an attribute on the card, never a heading,
       precisely so it can be ignored.

       The chips are a segmented switcher, which DESIGN.md files as a control rather
       than a button — same shape as the pricing period tabs. -->
  <section id="news-archive" class="relative py-16 sm:py-20 lg:py-24 bg-[#F7F9FA]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">

      <div class="rv ${COL} mb-6 sm:mb-7">
${eyebrow('teal-400', 'Archive')}
        ${h2('Earlier updates')}
      </div>

      <div class="rv sticky top-[74px] z-20 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-3 mb-7 lg:mb-9 bg-[#F7F9FA]/92 backdrop-blur">
        <!-- the sticky band above is full-bleed on purpose, so the blur reaches the
             page edges; the chips inside it sit on the column like everything else -->
        <div class="${COL} overflow-x-auto tp-scroll">
          <div id="topicTabs" class="flex flex-nowrap lg:flex-wrap gap-1.5 w-max lg:w-auto" role="group" aria-label="Filter updates by topic">
          <button type="button" data-topic="all" aria-pressed="true" class="tp-btn active inline-flex items-center gap-2 whitespace-nowrap rounded-full ring-1 ring-black/5 px-3.5 py-2 text-[13px] sm:text-[13.5px] font-semibold text-ink-600">All <span class="tp-n tabular-nums text-ink-500">${archive.length}</span></button>
${TOPICS.map(([key, label, icon]) => {
  const n = archive.filter(it => FILED[it.h] === key).length;
  if (!n) return '';
  return `          <button type="button" data-topic="${key}" aria-pressed="false" class="tp-btn inline-flex items-center gap-2 whitespace-nowrap rounded-full ring-1 ring-black/5 px-3.5 py-2 text-[13px] sm:text-[13.5px] font-semibold text-ink-600">
            <svg class="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>
            ${label} <span class="tp-n tabular-nums text-ink-500">${n}</span>
          </button>`;
}).filter(Boolean).join('\n')}
          </div>
        </div>
      </div>

${archiveYears.map(y => `      <div class="yr-group ${COL}" data-year="${y}">
        <div class="flex items-baseline gap-4 mb-4 lg:mb-5" id="y${y}">
          <h3 class="text-[22px] sm:text-[26px] font-extrabold tracking-tightest tabular-nums">${y}</h3>
          <span class="yr-count text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-500 tabular-nums" data-total="${byYear(y).length}">${byYear(y).length} updates</span>
          <span class="flex-1 h-px bg-ink-200"></span>
        </div>

        <div class="rv-kids space-y-4 sm:space-y-5 mb-10 sm:mb-12 lg:mb-14">
${byYear(y).map(it => {
  const [key, label, icon] = topicMeta(FILED[it.h]);
  return `          <article class="news-item rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7" data-topic="${key}">
            <div class="flex flex-col sm:flex-row gap-4 sm:gap-7">
              <div class="shrink-0 sm:w-[74px]">
                <div class="flex sm:flex-col items-baseline sm:items-start gap-2 sm:gap-0.5">
                  <span class="text-[24px] sm:text-[28px] font-extrabold tracking-tightest tabular-nums leading-none">${Number(it.d)}</span>
                  <time datetime="${iso(it)}" class="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500">${it.m}</time>
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <!-- The topic sat on the heading's line, sharing it with the title as if
                     the two were the same kind of thing. It is a label, so it goes where
                     every other label on this site goes: above the heading it labels. -->
                <span class="inline-flex items-center gap-1.5 rounded-full bg-ink-50 ring-1 ring-black/5 px-2.5 py-1 mb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                  <svg class="shrink-0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>
                  ${label}
                </span>
                <h4 class="text-[16px] sm:text-[17px] lg:text-[17.5px] font-bold tracking-tight leading-[1.32] mb-2">${it.h}</h4>
${body(it, false)}
              </div>
            </div>
          </article>`;
}).join('\n')}
        </div>
      </div>`).join('\n\n')}

      <!-- The pager. Twenty to a page, and it pages the FILTERED set — pick a topic
           and you page through that topic, not through the whole archive with gaps in
           it. Rendered by the script, because how many pages there are depends on
           which topic is on. -->
      <nav id="pager" class="rv ${COL} flex flex-wrap items-center justify-between gap-4 pt-2" aria-label="Archive pages">
        <p id="pagerCount" class="text-[13px] sm:text-[13.5px] text-ink-500"></p>
        <div class="flex items-center gap-1.5">
          <button type="button" id="pagePrev" class="pg-step inline-flex items-center gap-1.5 rounded-full bg-white ring-1 ring-black/5 px-3.5 py-2 text-[13px] font-semibold text-ink-600">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
            Previous
          </button>
          <div id="pageNums" class="flex items-center gap-1.5"></div>
          <button type="button" id="pageNext" class="pg-step inline-flex items-center gap-1.5 rounded-full bg-white ring-1 ring-black/5 px-3.5 py-2 text-[13px] font-semibold text-ink-600">
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </nav>

      <p id="topicEmpty" hidden class="rv ${COL} text-[13.5px] sm:text-[14.5px] text-ink-500"></p>
    </div>
  </section>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Style and behaviour
   ───────────────────────────────────────────────────────────────────────────── */
const STYLE = `
<style>
  [hidden] { display: none !important; }
  section[id] { scroll-margin-top: 100px; }
  [id^="y20"] { scroll-margin-top: 150px; }

  a:focus-visible, button:focus-visible,
  [tabindex]:focus-visible { outline: 2px solid #0CA9C3; outline-offset: 3px; border-radius: 4px; }
  .bg-ink-950 a:focus-visible, .bg-ink-950 button:focus-visible { outline-color: #6ED7E8; }

  .rv-kids > * { opacity:0; transform:translateY(40px); }
  .no-motion .rv-kids > * { opacity:1 !important; transform:none !important; }

  /* the pricing switcher, in the two rules that make it work */
  /* the scrolling chip row keeps no visible scrollbar; it is a control, not a pane */
  .tp-scroll { scrollbar-width:none; -ms-overflow-style:none; }
  .tp-scroll::-webkit-scrollbar { display:none; }

  .pg-step, .pg-num { transition:background-color .25s ease, color .25s ease, box-shadow .25s ease; }
  .pg-step:hover:not(:disabled), .pg-num:hover:not(.on) { background:#F1F2F6; color:#111827; }
  .pg-step:disabled { opacity:.4; cursor:default; }
  .pg-num { min-width:36px; height:36px; display:inline-flex; align-items:center; justify-content:center;
    border-radius:9999px; background:#fff; box-shadow:inset 0 0 0 1px rgba(0,0,0,.05);
    font-size:13px; font-weight:600; color:#4B5563; font-variant-numeric:tabular-nums; }
  .pg-num.on { background:#111827; color:#fff; box-shadow:none; }
  .pg-gap { min-width:20px; text-align:center; color:#9CA3AF; font-size:13px; }

  .tp-btn { background:#fff; transition:background-color .3s ease, color .3s ease, box-shadow .3s ease; }
  .tp-btn:hover { background:#F1F2F6; }
  .tp-btn.active { background:#111827; color:#fff; box-shadow:0 1px 2px rgba(0,0,0,.08); }
  .tp-btn.active .tp-n { color:rgba(255,255,255,.62); }

  /* a link inside an item's body. One weight and one shape; the ground picks the
     colour, because the same paragraphs are printed on white and on ink-950. */
  .nl { font-weight:600; text-decoration:underline; text-underline-offset:2px;
        transition:color .2s ease, text-decoration-color .2s ease; }
  .nl { color:#06748A; text-decoration-color:rgba(6,116,138,.32); }
  .nl:hover { color:#111827; text-decoration-color:rgba(17,24,39,.45); }
  .on-dark .nl { color:#6ED7E8; text-decoration-color:rgba(110,215,232,.35); }
  .on-dark .nl:hover { color:#fff; text-decoration-color:rgba(255,255,255,.6); }
</style>`;

const SCRIPT = `<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script>
(() => {
  'use strict';

  /* ---- filter, then page. The filter hides; the pager hides further. Neither ever
          moves an item, so what you read is always the archive in its own order. ---- */
  const PER_PAGE = 20;
  const tabs = [...document.querySelectorAll('#topicTabs .tp-btn')];
  const groups = [...document.querySelectorAll('.yr-group')];
  const all = [...document.querySelectorAll('.news-item')];
  const empty = document.getElementById('yearEmpty') || document.getElementById('topicEmpty');
  const pager = document.getElementById('pager');
  const pagerCount = document.getElementById('pagerCount');
  const pageNums = document.getElementById('pageNums');
  const prev = document.getElementById('pagePrev');
  const next = document.getElementById('pageNext');

  let topic = 'all';
  let page = 1;

  const numbers = (current, total) => {
    /* 1 … c-1 c c+1 … n, without ever printing a gap that hides a single page */
    const want = new Set([1, total, current, current - 1, current + 1]);
    if (current <= 3) [2, 3, 4].forEach(n => want.add(n));
    if (current >= total - 2) [total - 1, total - 2, total - 3].forEach(n => want.add(n));
    const list = [...want].filter(n => n >= 1 && n <= total).sort((x, y) => x - y);
    const out = [];
    list.forEach((n, i) => {
      if (i && n - list[i - 1] > 1) out.push(n - list[i - 1] === 2 ? list[i - 1] + 1 : null);
      out.push(n);
    });
    return out;
  };

  const render = (scroll) => {
    const set = all.filter(el => topic === 'all' || el.dataset.topic === topic);
    const total = Math.max(1, Math.ceil(set.length / PER_PAGE));
    if (page > total) page = total;
    const from = (page - 1) * PER_PAGE;
    const shown = set.slice(from, from + PER_PAGE);
    const on = new Set(shown);

    all.forEach(el => { el.hidden = !on.has(el); });

    groups.forEach(g => {
      const n = [...g.querySelectorAll('.news-item')].filter(el => !el.hidden).length;
      g.hidden = n === 0;
      const c = g.querySelector('.yr-count');
      if (c) {
        const all_ = c.dataset.total;
        c.textContent = (n === +all_ ? all_ : n + ' of ' + all_) + ' updates';
      }
    });

    tabs.forEach(t => {
      const active = t.dataset.topic === topic;
      t.classList.toggle('active', active);
      t.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    empty.hidden = set.length > 0;
    if (!set.length) empty.textContent = 'Nothing filed under that topic yet.';

    pager.hidden = set.length <= PER_PAGE;
    pagerCount.textContent = set.length
      ? (from + 1) + '–' + (from + shown.length) + ' of ' + set.length + ' updates'
      : '';
    prev.disabled = page === 1;
    next.disabled = page === total;

    pageNums.innerHTML = '';
    numbers(page, total).forEach(n => {
      if (n === null) {
        const s = document.createElement('span');
        s.className = 'pg-gap'; s.textContent = '…'; s.setAttribute('aria-hidden', 'true');
        pageNums.appendChild(s);
        return;
      }
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pg-num' + (n === page ? ' on' : '');
      b.textContent = n;
      b.setAttribute('aria-label', 'Page ' + n);
      if (n === page) b.setAttribute('aria-current', 'page');
      b.addEventListener('click', () => { page = n; render(true); });
      pageNums.appendChild(b);
    });

    if (window.ScrollTrigger) ScrollTrigger.refresh();
    if (scroll) {
      const top = document.getElementById('news-archive');
      if (top) top.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  };

  tabs.forEach(t => t.addEventListener('click', () => { topic = t.dataset.topic; page = 1; render(false); }));
  prev.addEventListener('click', () => { if (page > 1) { page--; render(true); } });
  next.addEventListener('click', () => { page++; render(true); });
  render(false);


  /* ---- reveals ---- */
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.gsap) { document.documentElement.classList.add('no-motion'); return; }

  gsap.registerPlugin(ScrollTrigger);

  const rvs = gsap.utils.toArray('.rv');
  const inView = rvs.filter(el => el.getBoundingClientRect().top < innerHeight * .9);
  inView.forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      delay: .1 + (el.getBoundingClientRect().top / innerHeight) * .3 });
  });
  rvs.filter(el => !inView.includes(el)).forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 70%' } });
  });

  gsap.utils.toArray('.rv-kids').forEach(group => {
    gsap.to(group.children, { opacity: 1, y: 0, duration: .7, ease: 'power2.out', stagger: .07,
      scrollTrigger: { trigger: group, start: 'top 80%' } });
  });
})();
<\/script>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Assemble
   ───────────────────────────────────────────────────────────────────────────── */
const donor = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
let head = donor.slice(0, donor.indexOf('<body'));
head = head.replace(/<title>[\s\S]*?<\/title>/, '<title>' + COPY.title + '</title>');
if (/name="description"/.test(head)) {
  head = head.replace(/<meta name="description"[^>]*>/,
    '<meta name="description" content="' + COPY.meta + '" />');
} else {
  head = head.replace('<title>', '<meta name="description" content="' + COPY.meta + '" />\n<title>');
}
head = head.replace('<title>', '<link rel="canonical" href="' + COPY.canonical + '" />\n<title>');

const bodyTag = donor.slice(donor.indexOf('<body'), donor.indexOf('>', donor.indexOf('<body')) + 1);

const html = head + STYLE + '\n' + bodyTag + `
<div class="grain"></div>

<header></header>

<main>
${[section1, section2, section3].map(f => f()).join('\n\n')}
</main>

<footer></footer>

${SCRIPT}
</body>
</html>
`;

fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' +
            count(/<article\b/g) + ' items (' + latest.length + ' latest + ' + archive.length + ' archived), ' +
            count(/<time\b/g) + ' datetimes');
console.log('  years ' + YEARS.join(' ') + '   local links ' +
            count(/href="(?!https?:|#|mailto:)/g) + '   outbound ' + count(/target="_blank"/g));
