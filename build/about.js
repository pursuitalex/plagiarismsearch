/* Generate site/about-us.html — About us, to the brief of 2026-09-30
   (new-tasks/new-page-5/PlagiarismSearch_About_Us_Claude_Brief_2026-09-30.md).

   A company / trust page: who is behind PlagiarismSearch, how the product developed from
   2009, and which people answer for which part of it today. Not a product page and not a
   second "Why us": no checker, no ratings, no user counts, no pricing, no sales CTA.

   THE COPY is an English draft written inside the brief's facts (§3, §9) and tone rules
   (§2, §25); it waits for approval (§26). All of it lives in COPY below, and
   build/check-about.js holds the page to it word for word. Two rules the copy never
   breaks: Oleksandr Kozuliov is never a co-founder, and AI text detection is never
   presented as plagiarism detection.

   SIX SECTIONS
     01  hero        bespoke     the title, three sentences, an anchor to the team, and a
                                 fact sheet instead of a product mock-up
     02  story       bespoke     Section Header + three paragraphs
     03  timeline    build/about/timeline.js   the six approved milestones
     04  team        build/about/team.js       nine profiles, all the same size
     05  bridge      bespoke     five areas of work — not departments, no headcount
     06  closing     build/sections/cta-band.js, the shared band — Mission & Values, then Contact

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
    lead: 'PlagiarismSearch launched in 2009 as a plagiarism checker for students. It has been built and developed year by year since then, and today it is a much broader product. This page is about its history and the people behind it.',
    cta: 'Meet the team',
    ctaHref: '#team',
    factsLabel: 'At a glance',
    /* [label, value, note] — the value is the bold line, the note the plain one under it */
    facts: [
      ['Launched', '2009', ''],
      ['First built for', 'Students', ''],
      ['Founder', 'Pavlo Kucheruk', ''],
      ['Technical lead', 'Oleksandr Kozuliov', 'With the product from the beginning'],
      ['Today', '', 'Plagiarism checking, AI text detection, an API, and integrations with Moodle, Google Docs and Canvas'],
    ],
  },

  story: {
    eyebrow: 'Our story',
    h2: 'The story behind PlagiarismSearch',
    paras: [
      'PlagiarismSearch launched in 2009 as a plagiarism-checking product for students. Its founder and owner, Pavlo Kucheruk, remains actively involved in the product and its direction.',
      'Oleksandr Kozuliov has guided the technical development of PlagiarismSearch from the beginning and, as Technical Lead, is responsible for the whole technical side of the product.',
      'Since then the product has grown beyond its first audience. A Plagiarism API, Moodle and Google Docs integrations, AI text detection as a capability separate from plagiarism detection, and a Canvas integration were each added along the way.',
    ],
    more: 'Why people choose PlagiarismSearch',
    moreHref: 'why-us.html',
  },

  timeline: {
    eyebrow: 'Timeline',
    h2: 'Built and evolving since 2009',
    intro: 'Six milestones, in the order they happened.',
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
        bio: 'Pavlo founded PlagiarismSearch and has stayed actively involved since its launch in 2009. He sets the product’s direction and priorities and takes part in the major product decisions. His focus is the long-term development of the product rather than any single release.' },
      { name: 'Oleksandr Kozuliov', role: 'Technical Lead', photo: null, linkedin: '',
        bio: 'Oleksandr has worked on PlagiarismSearch since the beginning and is responsible for the entire technical side of the product. That covers its architecture, day-to-day development and integrations, as well as reliability. He also guides how the technology evolves as new capabilities are added.' },
      { name: 'Denys Olshtynskyi', role: 'Senior Software Engineer', photo: null, linkedin: '',
        bio: 'Denys works on the technically demanding parts of PlagiarismSearch. His areas include backend systems, architecture and infrastructure, along with complex engineering problems that come up as the product grows. He contributes to the engineering work led by Oleksandr Kozuliov.' },
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

  bridge: {
    eyebrow: 'How we work',
    h2: 'How the work connects',
    intro: 'The people above cover different parts of one product’s life: deciding what to build, building it, making it clear to use, helping the people who use it, and telling others about it. These are areas of work, not separate departments.',
    areas: [
      ['Product direction', 'Priorities, major product decisions and the long-term development of the product.'],
      ['Engineering', 'Architecture, development, integrations and the reliability of the product.'],
      ['Design & experience', 'User flows, prototypes, the interface and the design system behind it.'],
      ['Customer success', 'Support, onboarding and answers for individual users, institutions and businesses.'],
      ['Growth & communication', 'Search, content, localization, outreach, partnerships and marketing communication.'],
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
const section1 = () => `  <!-- ================= 01 · HERO / ABOUT PLAGIARISMSEARCH =================
       A company page says so at once: the title, three plain sentences, one neutral
       action (down to the team) and a fact sheet where a product page would put its
       mock-up. No checker, no sales CTA. The tint and the dot field are every hero's. -->
  <section id="about-us" data-component="about-hero" data-bg="tint" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 lg:pb-28 bg-[#F2FCFC] overflow-hidden">
    ${dotField()}
    <div class="orb absolute orb-hero-teal"></div>
    <div class="orb absolute orb-hero-coral"></div>

    <div class="${WRAP}">
      <div class="grid lg:grid-cols-[1.1fr_.9fr] gap-10 sm:gap-12 lg:gap-16 items-center">
        <div class="rv min-w-0">
${sh.eyebrow(esc(H.eyebrow)).split('\n').map(l => '          ' + l).join('\n')}
          <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 sm:mb-5 lg:mb-6">${esc(H.h1)}</h1>
          <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[560px] mb-6 sm:mb-7 lg:mb-8">${esc(H.lead)}</p>
          ${btnDark(H.cta, H.ctaHref)}
        </div>

        <div class="rv min-w-0 rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl px-5 sm:px-6 lg:px-8 py-2 sm:py-3">
            <h2 class="sr-only">${esc(H.factsLabel)}</h2>
            <dl class="divide-y divide-ink-100">
${H.facts.map(([k, v, note], i) => `              <div class="grid sm:grid-cols-[9.5rem_1fr] gap-1.5 sm:gap-6 sm:items-baseline py-4 sm:py-5">
                <dt class="${CAP} text-ink-500">${esc(k)}</dt>
                <dd class="min-w-0">${v ? `<span class="block ${i === 0 ? 'text-[clamp(2.2rem,3.2vw,2.9rem)] font-extrabold tracking-tightest leading-none nums' : 'text-[16px] sm:text-[17px] font-bold tracking-tight'}">${esc(v)}</span>` : ''}${note ? `<span class="block ${v ? 'mt-0.5 ' : ''}${SMALL} text-ink-600">${esc(note)}</span>` : ''}</dd>
              </div>`).join('\n')}
            </dl>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · THE STORY ═══════════════ */
const S = COPY.story;
const section2 = () => `  <!-- ================= 02 · THE STORY BEHIND PLAGIARISMSEARCH =================
       The history in facts: three compact paragraphs, the first set as the lead. The head
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
${timeline.section({ id: 'timeline', bg: 'tint', head: { eyebrow: T.eyebrow, title: esc(T.h2), intro: esc(T.intro) }, items: T.items }).split('\n').map(l => '  ' + l).join('\n')}`;

/* ═══════════════ 04 · THE TEAM ═══════════════ */
const TM = COPY.team;
const section4 = () => `  <!-- ================= 04 · MEET THE TEAM =================
       The page's main section. Nine profiles of one size (brief §8): no larger founder
       card, no leadership row. build/about/team.js. The portrait plates carry initials
       and the LinkedIn marks are inactive until the real photos and addresses arrive —
       one field each per person in build/about.js COPY.team.people. -->
${team.section({ id: 'team', bg: 'white', head: { eyebrow: TM.eyebrow, title: esc(TM.h2), intro: esc(TM.intro) }, people: TM.people }).split('\n').map(l => '  ' + l).join('\n')}`;

/* ═══════════════ 05 · HOW THE WORK CONNECTS ═══════════════ */
const B = COPY.bridge;
const section5 = () => `  <!-- ================= 05 · HOW THE WORK CONNECTS =================
       A compact bridge after the team (brief §11): five areas of work across the product's
       life, as one list. No departments, no headcount, no names against boxes. The card is
       white on the tint (IMAGES.md §8.5). -->
  <section id="how-we-work" data-component="about-bridge" data-bg="tint" class="relative py-16 sm:py-24 lg:py-32 bg-ink-50">
    <div class="${WRAP}">
      <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-start">
        <div class="rv min-w-0">
${sh.render({ eyebrow: esc(B.eyebrow), title: esc(B.h2), intro: esc(B.intro) }, '          ')}
        </div>
        <ol class="rv min-w-0 rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white ring-1 ring-black/[.05] divide-y divide-ink-100 px-5 sm:px-6 lg:px-8 py-1 sm:py-2" role="list">
${B.areas.map(([t, d], i) => `          <li class="grid grid-cols-[2rem_1fr] sm:grid-cols-[2.5rem_12.5rem_1fr] gap-x-3 sm:gap-x-4 gap-y-1 sm:items-baseline py-4 sm:py-5 lg:py-6">
            <span class="text-[11px] font-bold tracking-[0.2em] text-ink-400 nums pt-1 sm:pt-0" aria-hidden="true">0${i + 1}</span>
            <h3 class="text-[15px] sm:text-[16px] font-bold tracking-tight">${esc(t)}</h3>
            <p class="col-start-2 sm:col-start-3 ${SMALL} text-ink-600">${esc(d)}</p>
          </li>`).join('\n')}
        </ol>
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · MISSION / CONTACT — THE CLOSING BAND ═══════════════ */
const CL = COPY.close;
const section6 = () => `  <!-- ================= 06 · MISSION & CONTACT =================
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

const sections = [section1, section2, section3, section4, section5, section6].map(f => f());
const html = page.render({ title: esc(COPY.title), meta: COPY.meta, canonical: COPY.canonical, sections });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' + count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' +
            count(/class="team-card/g) + ' profiles, ' + count(/class="timeline-item/g) + ' milestones, ' + count(/<img\b/g) + ' images');
