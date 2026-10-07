/* Generate site/about-us.html — About us, to the brief of 2026-09-30
   (new-tasks/new-page-5/PlagiarismSearch_About_Us_Claude_Brief_2026-09-30.md).

   A company / trust page: who is behind PlagiarismSearch, how the product developed from
   2009, and which people answer for which part of it today. Not a product page and not a
   second "Why us": no checker, no ratings, no user counts, no pricing, no sales CTA.

   CORRECTED to the Core 4 Final Correction Pack of 2026-10-05 (new-tasks/new-page-6/): the
   hero's fact sheet down to three ideas (launched, founder, today), a new hero lead, a
   shorter Story (no milestone sequence), no line over the Timeline, two bios a sentence shorter, and the section
   "How the work connects" gone with nothing in its place. The architecture is the
   approved one: Hero → Story → Timeline → Team → Mission / Contact.

   THE COPY is an English draft written inside the brief's facts (§3, §9) and tone rules
   (§2, §25), with the pack's wording where it gives one. All of it lives in COPY below, and
   build/check-about.js holds the page to it word for word. Two rules the copy never
   breaks: Oleksandr Kozuliov is never a co-founder, and AI text detection is never
   presented as plagiarism detection.

   FIVE SECTIONS
     01  hero        bespoke     the title, two sentences, an anchor to the team, and the
                                 three facts drawn as a path instead of a product mock-up
     02  story       bespoke     Section Header + three short paragraphs
     03  timeline    build/about/timeline.js   the six approved milestones
     04  team        build/about/team.js       nine profiles, all the same size
     05  closing     build/sections/cta-band.js, the shared band — Mission & Values, then Contact

   The team grid and the timeline are PAGE-SPECIFIC components (build/about/): written in
   the Section Library's manner — semantic classes, a content contract, a validator — but
   not library members; they are library candidates after the pilot review.

   PLACEHOLDERS (brief §22, §26). No photographs of people are generated or bought: every
   portrait plate shows initials until the real photo arrives. No LinkedIn address is
   invented: every icon is the inactive mark until the real address arrives. Both are one
   field per person in COPY.team.people — `photo` and `linkedin` — and nothing else changes.

   Run:  node build/assets.js  →  node build/about.js  →  node build/shell.js  →  node build/check-about.js */
const fs = require('fs');
const path = require('path');
const page = require('./page');
const { dotField } = require('./dots');
const cta = require('./sections/cta-band');
const sh = require('./sections/section-head');
const tile = require('./sections/icon-tile');
const team = require('./about/team');
const timeline = require('./about/timeline');

const SITE = path.join(__dirname, '..', 'site');
const OUT = 'about-us.html';

/* ─────────────────────────────────────────────────────────────────────────────
   The copy — one object, so the check can hold the page to it.
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  title: 'About PlagiarismSearch | Our Team & Story',
  meta: 'PlagiarismSearch launched in 2009. Read how the product has developed since then and meet the people who build, design and support it today.',
  canonical: 'https://plagiarismsearch.com/about-us',

  hero: {
    eyebrow: 'About us',
    h1: 'About PlagiarismSearch',
    lead: 'PlagiarismSearch has been developed since 2009, expanding from plagiarism checking into a broader product with separate AI-writing analysis, API access, and workflow integrations. Meet the people who build and support it today.',
    cta: 'Meet the team',
    ctaHref: '#team',
    factsLabel: 'At a glance',
    /* [label, value, note] — the value is the bold line, the note the plain one under it */
    facts: [
      ['Launched', '2009', ''],
      ['Founder', 'Pavlo Kucheruk', ''],
      ['Today', '', 'Plagiarism checking · separate AI-writing analysis · API · Moodle, Canvas & Google Docs integrations'],
    ],
  },

  story: {
    eyebrow: 'Our story',
    h2: 'The story behind PlagiarismSearch',
    paras: [
      'PlagiarismSearch launched in 2009 under founder Pavlo Kucheruk.',
      /* the approved paragraph about the technical lead stays: the pack shortened the Story
         around it (the milestone sequence went) and did not ask for it to go */
      'Oleksandr Kozuliov has guided the technical development of PlagiarismSearch from the beginning and, as Technical Lead, is responsible for the whole technical side of the product.',
      'Since then, it has remained an actively developed product, expanding as the ways people create, review, and work with content have changed.',
    ],
    more: 'Why people choose PlagiarismSearch',
    moreHref: 'why-us.html',
  },

  timeline: {
    eyebrow: 'Timeline',
    h2: 'Built and evolving since 2009',
    items: [
      { year: '2009', title: 'Launch', text: 'PlagiarismSearch launches with an initial focus on student plagiarism checking.' },
      { year: '2013', title: 'API', text: 'The Plagiarism API becomes available for integrations and external workflows.' },
      { year: '2017', title: 'Moodle', text: 'The Moodle integration extends PlagiarismSearch into learning-management workflows.' },
      { year: '2018', title: 'Google Docs', text: 'The Google Docs integration brings plagiarism checking closer to document workflows.' },
      { year: '2023', title: 'AI Detection', text: 'AI text detection is added as a capability separate from plagiarism detection.' },
      { year: '2026', title: 'Canvas', text: 'The Canvas integration expands LMS support.' },
    ],
  },

  team: {
    eyebrow: 'People',
    h2: 'Meet the team',
    intro: 'The people who direct, build, design, support and grow PlagiarismSearch, and what each of them is responsible for.',
    /* photo: { src: '/assets/img/team/<name>.webp', alt: '<Name Surname>', width: 800, height: 1000 }
       linkedin: 'https://www.linkedin.com/in/<profile>'
       Both stay empty until the real ones are supplied (brief §26). */
    people: [
      { name: 'Pavlo Kucheruk', role: 'Founder & Product Lead', photo: null, linkedin: '',
        bio: 'Pavlo founded PlagiarismSearch and has stayed actively involved since its launch in 2009. He sets the product’s direction and priorities and takes part in the major product decisions.' },
      { name: 'Oleksandr Kozuliov', role: 'Technical Lead', photo: null, linkedin: '',
        bio: 'Oleksandr has worked on PlagiarismSearch since the beginning and is responsible for the entire technical side of the product. That covers its architecture, day-to-day development and integrations, as well as reliability. He also guides how the technology evolves as new capabilities are added.' },
      { name: 'Denys Olshtynskyi', role: 'Senior Software Engineer', photo: null, linkedin: '',
        /* the second sentence is the correction pack's own (2026-10-05, CHANGE 5), word for word */
        bio: 'Denys works on the technically demanding parts of PlagiarismSearch. His work focuses on complex engineering problems across backend systems, architecture, infrastructure, and technically demanding product development.' },
      { name: 'Viacheslav Hladun', role: 'SEO & Growth Lead', photo: null, linkedin: '',
        bio: 'Viacheslav leads organic search strategy and analytics, and his role extends well beyond technical SEO. He works on site and information architecture, content and localization strategy, product positioning, landing pages and conversion, and competitor research, and coordinates growth-related work on the website.' },
      { name: 'Viktoriia Bas', role: 'Customer Success Lead', photo: null, linkedin: '',
        bio: 'Viktoriia leads customer success at PlagiarismSearch. She is responsible for client communication, customer support and onboarding, and she handles inquiries from institutions and businesses. She also follows up with users after their first contact and helps them find answers to questions about the product.' },
      { name: 'Melissa Anderson', role: 'Customer Success Specialist', photo: null, linkedin: '',
        bio: 'Melissa works with Viktoriia on customer success. She answers user questions, provides support and helps new users with onboarding. Much of her work is day-to-day communication with clients, making sure they can use the product successfully and know where to turn when something is unclear.' },
      { name: 'Viola Romanovych', role: 'Business Development & Outreach Specialist', photo: null, linkedin: '',
        bio: 'Viola develops new business contacts for PlagiarismSearch. Her work covers lead generation, outreach and commercial communication with prospective clients and partners. She stays in touch with the organizations she contacts and helps early conversations grow into working relationships.' },
      { name: 'Tetiana Zoziuk', role: 'Digital Marketing & Communications Specialist', photo: null, linkedin: '',
        bio: 'Tetiana works across several areas of marketing and communications. She manages social media, runs outreach and link acquisition, and prepares email campaigns. She also handles localization and translations and provides communication support for the rest of the team.' },
      { name: 'Oleksandr Bondarenko', role: 'Product Designer', photo: null, linkedin: '',
        bio: 'Oleksandr is responsible for UX and UI design at PlagiarismSearch. He maps user flows, builds prototypes and maintains the component and design system. His job is to turn product requirements into interfaces that are clear and straightforward to use.' },
    ],
  },

  close: {
    h2: 'The principles behind the product',
    ring: 'principles',
    support: 'Our mission and core values describe why we work the way we do. And if you have a question for the team, we are glad to hear from you.',
    primary: 'Our Mission & Values',
    primaryHref: 'mission.html',
    secondary: 'Contact our team',
    secondaryHref: 'contact-us.html',
    note: 'Working with an organization?',
    noteLink: 'See Business & Teams',
    noteHref: 'plagiarism-checker-for-organization.html',
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the system's (DESIGN.md), as the other generators write it.
   ───────────────────────────────────────────────────────────────────────────── */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/* a hyphenated word stays on one line ("AI-writing" was breaking after "AI-") */
const whole = s => esc(s).replace(/\b\w+-\w+\b/g, m => `<span class="whitespace-nowrap">${m}</span>`);
const CAP = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const WRAP = 'relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10';
const SMALL = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
/* the standalone button, 48 / 56px (DESIGN.md → Standalone button) */
const btnDark = (label, href) => `<a href="${href}" class="btn-press group inline-flex items-center gap-2.5 rounded-full h-12 sm:h-14 bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[14px] sm:text-[15px] font-semibold pl-5 sm:pl-7 pr-2.5">
            ${esc(label)}
            <span class="icon-orb w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">${ARROW}</span>
          </a>`;
const btnLight = (label, href) => `<a href="${href}" class="btn-press inline-flex items-center rounded-full h-12 sm:h-14 bg-white ring-1 ring-ink-200 hover:ring-ink-300 transition-shadow duration-300 text-ink-900 text-[14px] sm:text-[15px] font-semibold px-5 sm:px-6 lg:px-7">${esc(label)}</a>`;

/* ═══════════════ 01 · HERO ═══════════════ */
const H = COPY.hero;
/* The three facts as a drawing, not a table (Olex, 2026-10-07: the first hero set them as
   rows in a card; of the two options he kept this one). In the manner of the Affiliate
   page's opening — chips on dashed lines over the tint. Still a <dl>: three terms, three
   definitions. The words are COPY.hero.facts; the Today line is split on " · " for its
   four chips, not retyped. CSS: build/assets/css/33-about-hero.css — under 1024px the
   three stand in a column and the path is not drawn. */
const fact = label => { const f = H.facts.find(x => x[0] === label); if (!f) throw new Error('about: no fact "' + label + '"'); return f; };
const [, YEAR] = fact('Launched');
const [, FOUNDER] = fact('Founder');
const TODAY = fact('Today')[2].split(' · ');
if (TODAY.length !== 4) throw new Error('about: the Today line is drawn as four chips, got ' + TODAY.length);
const initials = n => n.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

/* one Lucide icon and one tone per part of the Today line, in its order */
const PARTS = [
  ['teal',   '<path d="m8 11 2 2 4-4"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'],
  ['orange', '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>'],
  ['ink',    '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>'],
  ['mint',   '<rect width="7" height="7" x="14" y="3" rx="1"/><path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"/>'],
];

const section1 = () => `  <!-- ================= 01 · HERO / ABOUT PLAGIARISMSEARCH =================
       A company page says so at once: the title, two plain sentences, one neutral
       action (down to the team), and beside them the page's three facts — launched,
       founder, today — drawn as one dashed path: the year is the large object, the
       founder and the four parts of "today" are chips. No checker, no sales CTA, no
       photograph. The tint and the dot field are every hero's. -->
  <section id="about-us" data-component="about-hero" data-bg="tint" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 lg:pb-28 bg-[#F2FCFC] overflow-hidden">
    ${dotField()}
    <div class="orb absolute orb-hero-teal"></div>
    <div class="orb absolute orb-hero-coral"></div>

    <div class="${WRAP}">
      <div class="grid lg:grid-cols-[1.1fr_.9fr] gap-10 sm:gap-12 lg:gap-16 items-center">
        <div class="rv min-w-0">
${sh.eyebrow(esc(H.eyebrow)).split('\n').map(l => '          ' + l).join('\n')}
          <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 sm:mb-5 lg:mb-6">${esc(H.h1)}</h1>
          <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[560px] mb-6 sm:mb-7 lg:mb-8">${whole(H.lead)}</p>
          ${btnDark(H.cta, H.ctaHref)}
        </div>

        <div class="rv min-w-0">
          <h2 class="sr-only">${esc(H.factsLabel)}</h2>
          <dl class="abh">
            <svg class="abh-path" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M57 16 H 73 Q 80 16 80 23 V 31"/><path d="M80 47 V 59"/></svg>
            <span class="abh-dot abh-dot-a" aria-hidden="true"></span>
            <span class="abh-dot abh-dot-b" aria-hidden="true"></span>

            <div class="abh-year">
              <dt class="${CAP} text-ink-500">${esc(fact('Launched')[0])}</dt>
              <dd class="abh-num nums">${esc(YEAR)}</dd>
            </div>

            <div class="abh-founder">
              <span class="abh-avatar" aria-hidden="true">${initials(FOUNDER)}</span>
              <div class="flex flex-col-reverse">
                <dt class="${CAP} text-ink-500">${esc(fact('Founder')[0])}</dt>
                <dd class="text-[16px] sm:text-[17px] font-bold tracking-tight leading-tight text-ink-900">${esc(FOUNDER)}</dd>
              </div>
            </div>

            <div class="abh-today">
              <dt class="${CAP} text-ink-500 mb-3">${esc(fact('Today')[0])}</dt>
              <dd>
                <ul class="grid sm:grid-cols-2 gap-2.5" role="list">
${TODAY.map((t, i) => `                  <li class="abh-chip">${tile.render({ tone: PARTS[i][0], icon: PARTS[i][1], size: 18 })}<span class="first-letter:uppercase">${whole(t)}</span></li>`).join('\n')}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · THE STORY ═══════════════ */
const S = COPY.story;
const section2 = () => `  <!-- ================= 02 · THE STORY BEHIND PLAGIARISMSEARCH =================
       The history in three short paragraphs, the first set as the lead (the milestones
       are the Timeline's, not repeated here). The head
       sits left and the prose right, so nothing leaves a gap down one side. The quiet
       link after the prose is the one contextual way to Why us — this page is who, that
       page is why. -->
  <section id="story" data-component="about-story" data-bg="white" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="${WRAP}">
      <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-start">
        <div class="rv min-w-0">
${sh.render({ eyebrow: esc(S.eyebrow), title: esc(S.h2) }, '          ')}
        </div>
        <div class="rv min-w-0 max-w-[700px]">
          <div class="grid gap-4 sm:gap-5">
${S.paras.map((p, i) => `            <p class="${i === 0 ? 'text-[18px] sm:text-[20px] lg:text-[22px] font-semibold tracking-tight leading-snug text-ink-900' : 'text-[15.5px] sm:text-[16px] lg:text-[17px] leading-[1.72] text-ink-600'}">${esc(p)}</p>`).join('\n')}
          </div>
          ${sh.more({ label: esc(S.more), href: S.moreHref })}
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · TIMELINE ═══════════════ */
const T = COPY.timeline;
const section3 = () => `  <!-- ================= 03 · PRODUCT TIMELINE =================
       The six approved milestones and no others (brief §3, §6). build/about/timeline.js:
       one row on a desktop, three across on a tablet, a single column down a rail on a
       phone — never a sideways scroll. -->
${timeline.section({ id: 'timeline', bg: 'tint', head: { eyebrow: T.eyebrow, title: esc(T.h2) }, items: T.items }).split('\n').map(l => '  ' + l).join('\n')}`;

/* ═══════════════ 04 · THE TEAM ═══════════════ */
const TM = COPY.team;
const section4 = () => `  <!-- ================= 04 · MEET THE TEAM =================
       The page's main section. Nine profiles of one size (brief §8): no larger founder
       card, no leadership row. build/about/team.js. The portrait plates carry initials
       and the LinkedIn marks are inactive until the real photos and addresses arrive —
       one field each per person in build/about.js COPY.team.people. -->
${team.section({ id: 'team', bg: 'white', head: { eyebrow: TM.eyebrow, title: esc(TM.h2), intro: esc(TM.intro) }, people: TM.people }).split('\n').map(l => '  ' + l).join('\n')}`;

/* ═══════════════ 05 · MISSION / CONTACT — THE CLOSING BAND ═══════════════ */
const CL = COPY.close;
const section5 = () => `  <!-- ================= 05 · MISSION & CONTACT =================
       The shared closing band (build/sections/cta-band.js), ending the page on the company rather than
       on a sale (brief §12): Mission & Values first, Contact second, Business & Teams as
       a quiet line. No checker, no pricing. -->
${cta.section({
  id: 'about-next',
  title: esc(CL.h2), ring: CL.ring,
  lead: esc(CL.support), measure: '560px',
  actions: { layout: 'pair', button: { label: esc(CL.primary), href: CL.primaryHref }, secondary: { label: esc(CL.secondary), href: CL.secondaryHref } },
  note: { text: esc(CL.note), link: { label: esc(CL.noteLink), href: CL.noteHref } },
})}`;

module.exports = { COPY, OUT };
if (require.main !== module) return;

const sections = [section1, section2, section3, section4, section5].map(f => f());
const html = page.render({ title: esc(COPY.title), meta: COPY.meta, canonical: COPY.canonical, sections });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' + count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' +
            count(/class="team-card/g) + ' profiles, ' + count(/class="timeline-item/g) + ' milestones, ' + count(/<img\b/g) + ' images');
