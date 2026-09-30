/* Generate site/scholarship.html — the PlagiarismSearch.com 2026 Scholarship page.
   It replaces a stub: no -v2, no switcher.

   There is no brief for this page, so the copy is the live page's, verbatim
   (https://plagiarismsearch.com/scholarship, read 2026-09-30), and only the architecture
   is new: the system's sections in place of the old layout.

   The page is a contest page, and a contest has one path: see the prize, read the
   rules, pick a prompt, apply. So the hero is the prize and its five facts drawn as one
   contest card; the pitch follows as an editorial split and a dark act; the fifteen
   terms are one numbered grid a reader can scan; the five prompts are a numbered list;
   the FAQ closes the questions; and the page ends on the application form, which the
   hero's "Get Started" lands on (#app-form-1, the live fragment).

   Architectural liberties, none in the words:
   - The live "Apply for Scholarship" and "Requirement" headings are h3s under no h2;
     here they are their sections' h2s, and "Terms and Conditions" (the live subheader of
     "What is a Scholarship?") is that section's eyebrow.
   - The winners are links in a sentence on the live page; here they are a row of link
     chips under the same lead-in, each name and round unchanged.
   - "Privacy Policy" in the privacy cell links to the policy page.
   - The hero title runs one step under the system hero scale (3.6rem, not 4rem) with
     a soft break before ".com!": "PlagiarismSearch.com!" is one 21-character word that
     otherwise overruns the column at 1440 and the screen at 375.
   - The form is inert, like every form in the prototype: no action, onsubmit="return
     false". Its fields, labels, file rules and the AI notice are the live form's.

   Run:  node build/scholarship.js  →  node build/shell.js  →  node build/check-scholarship.js
   On the shared production assets (build/assets.js, build/page.js): no <style> or
   <script> of its own, hooks are data-*. */
const fs = require('fs');
const path = require('path');
const page = require('./page');
const { dotField } = require('./dots');

const SITE = path.join(__dirname, '..', 'site');
const OUT = 'scholarship.html';
const FORM = '#app-form-1';

/* ─────────────────────────────────────────────────────────────────────────────
   Copy — the live page's, verbatim. Nothing below this block writes a word of its own.
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  title: 'PlagiarismSearch.com 2026 Scholarship: Your Chance to Win $1,000',
  meta: 'Grab this chance to showcase your writing prowess and win a $1,000 scholarship! Apply now and make your mark!',
  canonical: 'https://plagiarismsearch.com/scholarship',

  hero: {
    eyebrow: 'Scholarship Opportunity',
    h1: 'Write to Win $1,000 with PlagiarismSearch.com!',
    lead: 'Showcase Your Writing Skills in Our 2026 Contest for a Hefty $1,000 Scholarship Reward.',
    winnersLabel: 'Meet our Scholarship Winners:',
    winners: [
      ['Marko Mazepa (2026 - 1)', 'https://plagiarismsearch.com/marko-mazepa-original-thinking'],
      ['Meilan Cobb (2025 - 2)', 'https://plagiarismsearch.com/meilan-cobb-using-ai-responsibly'],
      ['Arina Agayeva (2025 - 1)', 'https://plagiarismsearch.com/finding-my-voice-in-the-age-of-ai'],
      ['Devanshi Panda (2024 - 2)', 'https://plagiarismsearch.com/navigating-ai-in-education-balancing-ethics-innovation-and-critical-thinking'],
      ['Rion Levy (2024 - 1)', 'https://plagiarismsearch.com/ai-as-a-tool-for-academic-and-technical-improvement'],
    ],
    cta: 'Get Started',
    prize: ['Win $1,000', 'PlagiarismSearch.com 2026 Scholarship'],
    facts: [
      ['Submit', ['500-word essay on AI topics'], 'file'],
      ['Deadlines', ['Round 1 - May 20, 2026', 'Round 2 - Dec 10, 2026'], 'calendar'],
      ['Announcement', ['Winners on May 30 & Dec 20, 2026'], 'trophy'],
      ['Payment', ['Via card, PayPal, Bank Transfer'], 'card'],
    ],
  },

  luck: {
    h2: 'So, what should you do to try your luck?',
    lead: 'Let us assume that you are a student or you are just going to enter the college or university of your dream.',
    body: [
      'In that case, you would definitely not refuse from getting as much as One Thousand USD for your talent and brilliant ideas of a writer.',
      'Who would say No if it goes about some support in covering ever-growing expenses of a student? Even if you already get some financial aid or a scholarship, such a generous gift as 1,000 USD can let you obtain more pleasure from life.',
    ],
  },

  apply: {
    h2: 'Apply for Scholarship',
    body: [
      'We have a special offer for you if you are happy to get one of the <strong>scholarships for college students</strong>. Our solution could make a valuable contribution into your daily educational expenses and help you afford the required supplies for your studies. You might have already applied for multiple scholarships for college students, but this one is different from them. If you are good at writing, seize your chance to be awarded with our 2026 Scholarship in the amount of 1,000.00 USD.',
      'Choose one of the five topics presented below that inspires you and voila! Let us know what you think and then we will reward you for the originality of your ideas and gift for writing.',
    ],
    info: [
      ['500,000 Clients', 'Our network of students, professors, and bloggers', 'users'],
      ['Privacy policy', 'We handle uploaded documents under our Privacy Policy', 'shield', ['Privacy Policy', 'policy.html']],
    ],
  },

  terms: {
    h2: 'What is a Scholarship?',
    eyebrow: 'Terms and Conditions',
    items: [
      ['Only for students', 'PlagiarismSearch.com opens the contest only to the students who are attending colleges or universities / will attend colleges or universities in 2026.'],
      ['18+ years old', 'One is eligible for the scholarships for college students only if one is 18+ years old.'],
      ['Problems with the application', 'As a contest participant, one should make sure that a required application form is submitted successfully. Technical malfunctions do not serve as a valid excuse for submission failures. PlagiarismSearch.com is not held accountable for any network glitches or outage which may cause issues with meeting the deadline or compliance with the requirements.'],
      ['Fair competition', 'Employees of PlagiarismSearch.com are not eligible to participation in the contest of scholarships for college students. Neither are their household and family members.'],
      ['Free entrance', 'There are no fees related to granting the scholarships for college students. Entrance is free.'],
      ['Only 1 work', 'Each applicant may submit only one essay.'],
      ['English language', 'Both the essays and application form submissions from the participants must be only in English. Writing in any other languages will be rejected automatically.'],
      ['Clear deadlines', 'Scholarships for college students will be awarded semi-annually: on May 30, 2026 and December 20, 2026.'],
      ['Fair jury', 'The decision of the contest jury is final and non-negotiable. The evaluation criteria comprise: originality, quality of writing, credibility, accuracy, and style.'],
      ['One winner', 'After the winning entry is declared, all the others are discarded. PlagiarismSearch.com does not possess any property rights on the submitted texts. The contest participants retain them immediately after the contest is over.'],
      ['Notification by Email', 'Notification to the winner is emailed after the results of scholarships for college students are summarized. No longer than 10 days after the email is received, the winner should respond with the attached:', ['photograph;', 'signed written statement of eligibility.']],
      ['10 days for the winner\'s application', 'In case PlagiarismSearch.com does not obtain the requested items within 10 days after the email notification is sent to the winner and it is not possible to contact them otherwise, another winner is selected.'],
      ['Awarding the winner', 'The amount of 1,000.00 USD is awarded to the contest winner to the card, Bank Transfer, or PayPal within 4 weeks after the notification is sent. The winner takes responsibility for all the federal, state, and local taxes related to the scholarships for college students. The winner gives their consent to posting their photo, name, and essay on the PlagiarismSearch.com blog.'],
      ['The prize goes directly to the winner', 'The awarded prize is non-transferable.'],
      ['Force majeure', 'PlagiarismSearch.com reserves the right for termination or modification of the contest of scholarships for college students without any prior notice.'],
    ],
  },

  requirement: {
    h2: 'Requirement',
    lead: 'Recognizing plagiarism as one of the burning problems of present time and seeing the potential threat of AI, we announce our Essay-Writing Competition in 2026 on the following prompts:',
    prompts: [
      'How I Turned Creative Struggle into Original Insight',
      'Ethical Storytelling in the Age of AI',
      'Academic Integrity Beyond the Classroom and How It Shapes My Life',
      'Original Thinking in a World Full of Shortcuts',
      'Building Trust Through Original Work and How It Shapes My Future',
    ],
    apply: 'To apply for the PlagiarismSearch.com 2026 Scholarship, all applicants should fill out the form and submit a 500-word essay on one of the prompts given above',
    nb: ['NB:', 'Every applicant must attach any valid document which certifies their student status along with the written essay'],
  },

  faq: {
    h2: 'Frequently Asked Questions',
    items: [
      ['How to get scholarship from PlagiarismSearch.com?', ['Any student can write an essay that is compatible with the requirements set by PlagiarismSearch.com and submit it along with the filled-out application form not later than the scheduled dates. The jury decides on the best essay and the winner gets a notification about the awarded prize by email or phone.']],
      ['When do I apply for scholarship?', [
        'One can apply for the contest of scholarships for college students in either of the two rounds:',
        '<strong>Round 1:</strong> Applications are submitted from January 1, 2026 up to May 20, 2026. The winner is announced on May 30, 2026.',
        '<strong>Round 2:</strong> Applications are submitted from June 1, 2026 up to December 10, 2026. The winner is announced on December 20, 2026.',
      ]],
      ['How do I get my scholarship money?', ['The winner of the writing contest will be awarded 1,000.00 USD, payable by card, PayPal, or Bank Transfer. The money is sent within the period of 4 weeks.']],
      ['How many words are needed for my scholarship essay?', ['Your essay should be 500-700 words to be eligible for the scholarship. You will be asked to edit your essay in case this instruction is not met.']],
      ['What is a proof of my student status?', ['It can be any valid document issued by your educational establishment that has your name on it and year of issue. For example, a letter of acceptance, student ID card, official or unofficial academic records, tuition receipt or invoice.']],
      ['Can I apply for a scholarship if I am outside the US?', ['Yes, students from all over the world are welcome to apply to our scholarship.']],
    ],
  },

  form: {
    h2: 'Application Form',
    /* label, id, type, autocomplete */
    fields: [
      ['Enter your first name', 'first-name', 'text', 'given-name'],
      ['Enter your last name', 'last-name', 'text', 'family-name'],
      ['Enter your phone', 'phone', 'tel', 'tel'],
      ['Enter your email', 'email', 'email', 'email'],
      ['Enter your country', 'country', 'text', 'country-name'],
      ['Educational establishment', 'establishment', 'text', 'organization'],
    ],
    attach: {
      title: 'Add document',
      hint: 'Click on the button and add up to 10 files in 7z, doc, docx, html, jpg, jpeg, odt, pdf, png, ppt, ppsx, pptx, psd, rar, txt, xls, xlsx, zip format. File size up to 24MB',
      button: 'Browse file',
      accept: '.7z,.doc,.docx,.html,.jpg,.jpeg,.odt,.pdf,.png,.ppt,.ppsx,.pptx,.psd,.rar,.txt,.xls,.xlsx,.zip',
    },
    message: 'Message here',
    notice: [
      'Dear Applicants,',
      'Please be advised that all submitted essays will be screened for AI-generated content as the first step of the evaluation process. Essays containing more than 15% of AI-generated text will be automatically disqualified.',
      'Thank you for your understanding and cooperation.',
    ],
    cta: 'Apply Now',
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the system's (build/business.js is the reference page).
   ───────────────────────────────────────────────────────────────────────────── */
const amp = s => s.replace(/&(?!amp;|[a-z]+;)/g, '&amp;');
const eyebrow = (dot, label, ground = 'white') => `        <div class="inline-flex items-center gap-2 rounded-full ${ground === 'white' ? 'bg-white' : 'bg-ink-50'} ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">${label}</span>
        </div>`;

const H2 = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const INTRO = 'mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600';
const BODY = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const CAP = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const H3 = 'text-[16px] sm:text-[17px] lg:text-[18px] font-bold tracking-tight';
const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ext = h => (/^https?:/.test(h) ? ' rel="noopener"' : '');

const btnDark = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
          </a>`;
const inline = (label, href, dark) => `<a href="${href}"${ext(href)} class="font-semibold ${dark ? 'text-white decoration-white/40 hover:decoration-white' : 'text-ink-800 decoration-ink-300 hover:text-ink-900'} underline underline-offset-4 transition-colors duration-300">${label}</a>`;

const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/></svg>`;
  if (!text.includes(phrase)) throw new Error('penMark: "' + phrase + '" not in "' + text + '"');
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};

/* Lucide icons (the system's set) */
const ico = (paths, stroke, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const TINT = { teal: ['bg-teal-100', '#06748A'], ink: ['bg-ink-100', '#374151'], orange: ['bg-orange-100', '#B84431'], mint: ['bg-mint-100', '#1B7A50'] };
const chip = (tint, paths) => `<span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl ${TINT[tint][0]} items-center justify-center shrink-0">${ico(paths, TINT[tint][1])}</span>`;
const I = {
  file:     '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  trophy:   '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  card:     '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  users:    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  shield:   '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  upload:   '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
  info:     '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
};

/* ═══════════════ 01 · HERO — THE PRIZE ═══════════════ */
const section1 = () => `  <!-- ================= 01 · HERO / SCHOLARSHIP =================
       The prize is the visual: one contest card, the $1,000 on a dark head and the four
       facts under it as a definition list. The winners sit under the lead as link chips,
       proof that the contest pays out. -->
  <section id="scholarship" data-component="hero-contest" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    ${dotField()}
    <div class="orb absolute orb-hero-teal"></div>
    <div class="orb absolute orb-hero-coral"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-center">

        <div class="rv min-w-0">
${eyebrow('teal-400', COPY.hero.eyebrow)}
          <h1 class="text-[clamp(2.4rem,5vw,3.6rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 sm:mb-5 lg:mb-6">${penMark(COPY.hero.h1, 'Win $1,000').replace('PlagiarismSearch.com!', 'PlagiarismSearch<wbr>.com!')}</h1>
          <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[58ch] mb-7 lg:mb-8">${COPY.hero.lead}</p>
          <div class="mb-8 lg:mb-10">${btnDark(COPY.hero.cta, FORM)}</div>

          <p class="${CAP} text-ink-500 mb-3">${COPY.hero.winnersLabel}</p>
          <ul class="flex flex-wrap gap-2" role="list">
${COPY.hero.winners.map(([name, href]) => `            <li><a href="${href}" rel="noopener" class="inline-flex items-center gap-2 rounded-full bg-white/80 hover:bg-white ring-1 ring-black/5 px-3.5 py-1.5 text-[12.5px] sm:text-[13px] font-semibold text-ink-800 transition-colors duration-300"><span class="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true"></span>${name}</a></li>`).join('\n')}
          </ul>
        </div>

        <div class="rv min-w-0">
          <div class="rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
            <div class="rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl overflow-hidden">
              <div data-surface="dark" class="bg-ink-950 text-white px-6 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
                <p class="text-[clamp(2.2rem,4.4vw,3.25rem)] font-extrabold tracking-tightest leading-none nums">${COPY.hero.prize[0]}</p>
                <p class="mt-2.5 ${BODY} text-white/60">${COPY.hero.prize[1]}</p>
              </div>
              <dl class="divide-y divide-ink-100">
${COPY.hero.facts.map(([dt, dd, icon], i) => `                <div class="flex items-center gap-4 px-6 py-4 sm:px-7 sm:py-5 lg:px-8">
                  ${chip(['teal', 'orange', 'mint', 'ink'][i], I[icon])}
                  <div class="min-w-0">
                    <dt class="${CAP} text-ink-500 mb-1">${dt}</dt>
${dd.map(line => `                    <dd class="text-[14.5px] sm:text-[15px] font-semibold tracking-tight text-ink-900 nums">${amp(line)}</dd>`).join('\n')}
                  </div>
                </div>`).join('\n')}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · TRY YOUR LUCK ═══════════════ */
const section2 = () => `  <!-- ================= 02 · TRY YOUR LUCK =================
       The live page's two-column pitch, kept as an editorial split: the question and its
       premise on the left, the answer on the right. -->
  <section id="try-your-luck" data-component="editorial-split" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-2 gap-6 lg:gap-16 items-start">
        <div class="rv">
          <h2 class="${H2}">${COPY.luck.h2}</h2>
          <p class="${INTRO} max-w-[52ch]">${COPY.luck.lead}</p>
        </div>
        <div class="rv lg:pt-3 grid gap-4 max-w-[62ch]">
${COPY.luck.body.map(p => `          <p class="text-[15px] sm:text-[15.5px] lg:text-[16.5px] leading-relaxed text-ink-700">${p}</p>`).join('\n')}
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · APPLY FOR SCHOLARSHIP — THE DARK ACT ═══════════════ */
const section3 = () => `  <!-- ================= 03 · APPLY FOR SCHOLARSHIP =================
       The live page's dark block stays dark: the offer on the left, its two facts as
       cells on the right. -->
  <section id="apply-for-scholarship" data-component="dark-act" data-surface="dark" class="relative py-16 sm:py-24 lg:py-28 bg-ink-950 text-white overflow-hidden">
    <div class="orb absolute w-[640px] h-[640px] -right-48 -top-48 bg-[rgba(44,195,219,.16)]"></div>
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-16 items-center">
        <div class="rv">
          <h2 class="${H2} mb-5 lg:mb-6">${COPY.apply.h2}</h2>
${COPY.apply.body.map(p => `          <p class="mt-4 first:mt-0 ${BODY} lg:text-[15.5px] text-white/70 max-w-[66ch] [&_strong]:text-white [&_strong]:font-semibold">${p}</p>`).join('\n')}
        </div>
        <div class="rv grid sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
${COPY.apply.info.map(([head, body, icon, link]) => {
  const text = link ? body.replace(link[0], inline(link[0], link[1], true)) : body;
  if (link && text === body) throw new Error('apply: link phrase not found: ' + link[0]);
  return `          <div class="rounded-2xl sm:rounded-3xl bg-white/[.06] ring-1 ring-white/10 p-5 sm:p-6 flex items-start gap-4">
            <span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-white/10 ring-1 ring-white/15 items-center justify-center shrink-0">${ico(I[icon], '#fff')}</span>
            <div class="min-w-0">
              <p class="text-[20px] sm:text-[22px] lg:text-[24px] font-extrabold tracking-tight leading-tight nums">${head}</p>
              <p class="mt-1 ${BODY} text-white/60">${text}</p>
            </div>
          </div>`;
}).join('\n')}
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · TERMS AND CONDITIONS ═══════════════ */
const section4 = () => `  <!-- ================= 04 · TERMS AND CONDITIONS =================
       Fifteen rules, one numbered grid: each rule's own title and text, nothing merged or
       cut, so a reader can find "18+" or "Only 1 work" at a glance. -->
  <section id="terms-and-conditions" data-component="terms-grid" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('orange-500', COPY.terms.eyebrow)}
        <h2 class="${H2}">${COPY.terms.h2}</h2>
      </div>

      <ol class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" role="list">
${COPY.terms.items.map(([head, body, list], i) => `        <li class="rv rounded-2xl sm:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7">
          <span class="block text-[13px] font-extrabold tracking-tight text-ink-300 nums mb-3" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="${H3} mb-1.5">${head}</h3>
          <p class="${BODY} text-ink-600">${body}</p>${list ? `
          <ul class="mt-2 list-disc pl-5 ${BODY} text-ink-600 marker:text-ink-300">
${list.map(x => `            <li>${x}</li>`).join('\n')}
          </ul>` : ''}
        </li>`).join('\n')}
      </ol>
    </div>
  </section>`;

/* ═══════════════ 05 · REQUIREMENT — THE PROMPTS ═══════════════ */
const section5 = () => `  <!-- ================= 05 · REQUIREMENT =================
       The five prompts are the one choice an applicant makes, so they are the section's
       object: a numbered list on the system's double-bezel sheet. How to apply and the
       NB about proof of status sit beside it. -->
  <section id="requirement" data-component="prompt-list" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-14 items-start">
        <div class="rv lg:sticky lg:top-28">
          <h2 class="${H2}">${COPY.requirement.h2}</h2>
          <p class="${INTRO} max-w-[56ch]">${COPY.requirement.lead}</p>
          <p class="mt-6 lg:mt-7 ${BODY} text-ink-800 font-semibold max-w-[56ch]">${COPY.requirement.apply}</p>
          <div class="mt-5 flex items-start gap-3.5 rounded-2xl bg-orange-50 ring-1 ring-orange-200/60 p-4 sm:p-5 max-w-[56ch]">
            <span class="shrink-0 mt-0.5">${ico(I.info, '#B84431', 18)}</span>
            <p class="${BODY} text-ink-700"><strong class="font-bold text-ink-900">${COPY.requirement.nb[0]}</strong> ${COPY.requirement.nb[1]}</p>
          </div>
        </div>

        <div class="rv rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <ol class="rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl divide-y divide-ink-100" role="list">
${COPY.requirement.prompts.map((p, i) => `            <li class="flex items-center gap-4 sm:gap-6 px-5 py-5 sm:px-7 sm:py-6 lg:px-8 lg:py-7">
              <span class="shrink-0 w-10 sm:w-12 text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold tracking-tightest leading-none text-ink-200 nums" aria-hidden="true">0${i + 1}</span>
              <p class="text-[16px] sm:text-[17.5px] lg:text-[19px] font-bold tracking-tight leading-snug">${p}</p>
            </li>`).join('\n')}
          </ol>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · FAQ ═══════════════ */
const section6 = () => `  <!-- ================= 06 · FAQ =================
       Six questions, full answers in the HTML (the shared faq module). -->
  <section id="scholarship-faq" data-component="faq" class="relative py-16 sm:py-24 lg:py-32 bg-ink-50">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-start">
        <div class="rv lg:sticky lg:top-28">
          <h2 class="${H2}">${COPY.faq.h2}</h2>
        </div>
        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div data-faq class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl divide-y divide-ink-100 overflow-hidden">
${COPY.faq.items.map(([q, a], i) => `            <div class="faq-item${i === 0 ? ' open' : ''}">
              <button type="button" aria-controls="scholarship-faq-a${i + 1}" aria-expanded="${i === 0 ? 'true' : 'false'}" class="faq-q w-full flex items-center justify-between gap-4 sm:gap-5 lg:gap-6 text-left px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6">
                <span class="text-[15.5px] font-bold tracking-tight">${q}</span>
                <span class="faq-chev shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </button>
              <div class="faq-a" id="scholarship-faq-a${i + 1}"><div><div class="px-4 sm:px-5 lg:px-6 pb-5 sm:pb-6 lg:pb-7 grid gap-2.5">${a.map(p => `<p class="text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[72ch] [&_strong]:text-ink-900 [&_strong]:font-semibold">${p}</p>`).join('')}</div></div></div>
            </div>`).join('\n')}
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 07 · APPLICATION FORM ═══════════════ */
const F = COPY.form;
const section7 = () => `  <!-- ================= 07 · APPLICATION FORM =================
       The live form's fields and labels, on the system's inquiry-form recipe (.cf-*), the
       attachment on the checker's drop-zone recipe (.qc-drop). The AI notice sits right
       above the button, where an applicant reads it last. Inert, like every form here. -->
  <section id="app-form-1" data-component="application-form" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[880px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv text-center mb-8 sm:mb-10">
        <h2 class="${H2}">${F.h2}</h2>
      </div>

      <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-8">
        <form data-focus-first="500" onsubmit="return false" novalidate>
          <div class="grid sm:grid-cols-2 gap-4 sm:gap-5">
${F.fields.map(([label, id, type, auto]) => `            <div class="min-w-0">
              <label class="cf-label" for="sc-${id}">${label} <i>*</i></label>
              <input class="cf-field" id="sc-${id}" name="${id}" type="${type}" autocomplete="${auto}" required>
            </div>`).join('\n')}

            <div class="sm:col-span-2">
              <label for="sc-files" class="qc-drop flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-4 p-4 sm:p-5 cursor-pointer focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2">
                <span class="qc-drop-icon">${ico(I.upload, 'currentColor', 18)}</span>
                <span class="min-w-0 flex-1">
                  <span class="qc-drop-title">${F.attach.title}</span>
                  <span class="qc-drop-hint mt-0.5 leading-relaxed">${F.attach.hint}</span>
                </span>
                <span class="self-start sm:self-auto shrink-0 inline-flex items-center rounded-full bg-white ring-1 ring-black/10 px-4 py-2 text-[13px] font-semibold text-ink-900">${F.attach.button}</span>
                <input id="sc-files" name="files" type="file" multiple accept="${F.attach.accept}" class="sr-only">
              </label>
            </div>

            <div class="sm:col-span-2">
              <label class="cf-label" for="sc-message">${F.message} <i>*</i></label>
              <textarea class="cf-field" id="sc-message" name="message" rows="5" required></textarea>
            </div>
          </div>

          <div class="mt-6 lg:mt-7 flex items-start gap-3.5 rounded-2xl bg-teal-50 ring-1 ring-teal-200/70 p-4 sm:p-5">
            <span class="shrink-0 mt-0.5">${ico(I.sparkles, '#06748A', 18)}</span>
            <div class="grid gap-1.5 ${BODY} text-ink-700">
              <p class="font-bold text-ink-900">${F.notice[0]}</p>
              <p>${F.notice[1]}</p>
              <p>${F.notice[2]}</p>
            </div>
          </div>

          <div class="mt-6 lg:mt-7">
            <button type="submit" class="btn-press group flex items-center justify-center sm:justify-start gap-2.5 w-full sm:w-auto rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold pl-5 sm:pl-6 pr-2 py-2">
              ${F.cta}
              <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>`;

/* check-scholarship.js reads COPY; requiring this file must not rewrite the page (the
   page on disk carries the header and footer shell.js filled in) */
/* scholarship-v2.js (the illustrated version) reuses the sections that do not change */
module.exports = { COPY, section4, section5, section6, section7 };
if (require.main !== module) return;

const sections = [section1, section2, section3, section4, section5, section6, section7];
const html = page.render({ title: COPY.title, meta: COPY.meta, canonical: COPY.canonical, sections: sections.map(f => f()) });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' +
            count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' + count(/class="faq-item/g) + ' faq items');
