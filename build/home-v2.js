/* Generate site/index-v2.html — the DEC-0030 homepage.

   The approved baseline is the source of copy. Every string the brief fixes is held in
   COPY below, verbatim, so it can be diffed against the brief line by line instead of
   being hunted through markup. Nothing here paraphrases, shortens or "improves" it.

   Placeholders are deliberate. The brief lists exactly which fields are dynamic —
   review quotes and ratings, prices and quotas, the final Canvas URL — and anything
   NOT on that list is an omission, not a placeholder. That is why the ESL and accuracy
   figures the old homepage carried are simply absent rather than dashed out.

   Run:  node build/home-v2.js  →  node build/shell.js  →  node build/check.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'index-v2.html';

/* ─────────────────────────────────────────────────────────────────────────────
   APPROVED COPY — DEC-0030, 2026-08-14. Verbatim.
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  title: 'Plagiarism Checker – Check Text Online | PlagiarismSearch',
  meta: 'Check text for plagiarism online. Find matching passages and sources, review similarity, citations, and source context in a clear report.',

  s1: {
    h1: 'Plagiarism Checker',
    support: 'Find matching passages and sources, review similarity in context, and see citations and references in a clear report.',
    placeholder: 'Paste or type your text here',
    /* The brief fixes the labels; the icons are ours. Dropbox and OneDrive carry their
       own marks because recognising a service you already use is the whole point of
       listing it — the other two are actions, not brands, so they stay in UI ink. */
    inputs: [
      { label: 'Attach file', icon: 'lucide', path: '<path d="M13.234 20.252 21 12.3"/><path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"/>' },
      { label: 'Dropbox',     icon: 'brand',  file: 'dropbox.svg' },
      { label: 'OneDrive',    icon: 'brand',  file: 'onedrive.svg' },
      { label: 'By URL',      icon: 'lucide', path: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>' },
    ],
    checkPlagiarism: 'Check for plagiarism',
    checkAI: 'Check for AI writing',
    cta: 'Check for plagiarism',
    free: '150 words free — no registration required.',
    formats: 'Supports DOC/DOCX, PDF, TXT, PPT/PPTX, XLS/XLSX and other file formats.',
  },

  s2: {
    fixed: ['500,000+ users', 'Plagiarism checking in 80+ languages', 'BBB Accredited'],
    dynamic: 'INSERT CURRENT VERIFIED REVIEW-PLATFORM RATING/COUNT',
  },

  s3: { label: 'Integrations & API', items: ['Moodle', 'API', 'Canvas', 'Google Docs'] },

  s4: {
    h2: 'See the evidence behind every match',
    intro: 'A similarity score is only the starting point. Open a highlighted passage to see the matching source and its context, then review citations, references, and other report signals before deciding how the match should be interpreted.',
    callout: 'PlagiarismSearch surfaces matching text and sources for review. It does not make the final plagiarism judgment for you.',
    labels: ['Matched passage', 'Matching source', 'Source context', 'Similarity', 'Citations', 'References', 'AI probability'],
  },

  s5: {
    h2: 'Control what your plagiarism check includes',
    intro: 'Choose the source collections and exclusions that fit your document before you interpret the result. Search the web, academic databases, your storage, or organization storage, and exclude references or in-text citations when appropriate.',
    coverage: 'When academic database search is enabled, PlagiarismSearch can search over 500 million indexed academic texts.',
    sources: ['Web', 'Academic databases', 'My storage', 'Organization storage'],
    settings: ['Exclude references', 'Exclude in-text citations', 'Character normalization', 'Add to storage'],
  },

  s6: {
    h2: 'Plagiarism and AI checks answer different questions',
    plagiarism: 'Finds text that matches available sources and shows where those matches come from, so you can review similarity and citation context.',
    ai: 'Provides a separate AI-writing indicator for the text you choose to analyze. It does not replace source matching and does not prove authorship.',
    bridge: 'You can run plagiarism checking on its own or add AI writing analysis in the same check. AI-generated text is not automatically plagiarism, and low similarity does not prove that a text was written by a human.',
    cta: 'Explore AI Detector',
    ctaHref: 'ai-detector.html',
  },

  s7: {
    h2: 'Know what happens to your document',
    intro: 'Your document is processed to perform the checks you select. The file you upload is not retained as a stored source document, while a generated report may remain in your account for convenient access.',
    steps: [
      ['Upload &amp; process', 'Your document is processed for the checks you select.'],
      ['Source document', 'The uploaded file is not retained as a stored source document.'],
      ['Report', 'Your generated report may remain in your account for convenient access.'],
      ['Delete', 'You can permanently delete reports from your account.'],
    ],
    storage: 'If you choose Add to storage, that is a separate action you control.',
    infra: 'AI checks are processed on PlagiarismSearch infrastructure.',
    cta: 'Read our Privacy Policy',
    ctaHref: 'policy.html',
  },

  s8: {
    h2: 'Use PlagiarismSearch in the workflow you already have',
    intro: 'Check a document in the web app, bring plagiarism checking into Moodle or Canvas, work from Google Docs, or connect your own system through the API.',
    /* The brief fixes the visual priority as Moodle → API → Canvas → Google Docs.
       Olex swapped the last two on 2026-08-20, so the page reads Moodle, API, Google
       Docs, Canvas. Canvas lands in the wide slot, which weights it above Google Docs
       as the brief intends — but it now follows Google Docs in reading order, which
       the brief does not. Recorded rather than quietly reordered. */
    cards: [
      ['Moodle', 'Run plagiarism checks where Moodle courses and submissions already live. Keep report access, source settings, and citation/reference exclusions inside the LMS workflow.', 'View Moodle integration', 'integration-guide.html', 'moodle.svg'],
      ['API', 'Connect plagiarism checking to your own product, platform, or internal workflow through the PlagiarismSearch API.', 'Explore API', 'api.html', null],
      ['Google Docs', 'Use the PlagiarismSearch add-on from your Google Docs workflow when you want to check document text without switching to the main web form.', 'Google Docs add-on', 'how-to-use-plagiarismsearch-google-add-on.html', 'google-docs.svg'],
      ['Canvas', 'Bring plagiarism checking into Canvas course workflows through a full LMS integration, with the same core role as the Moodle integration.', 'Canvas integration', 'canvas-integration.html', 'canvas.svg'],
    ],
  },

  s9: {
    h2: 'For individual checks, education, and teams',
    intro: 'Start with a single document, or use PlagiarismSearch across organization and LMS workflows when more people need shared access, storage, or administration.',
    cards: [
      ['Students &amp; individual users', 'Check essays, papers, assignments, presentations, and other documents before submission. Review matched passages, sources, citations, and references in one report.', 'For students', 'plagiarism-checker-for-students.html'],
      ['Education &amp; Institutions', 'Bring plagiarism checking into institutional workflows with Moodle and Canvas, organization management, shared storage, and member permissions.', 'Education &amp; Institutions', 'university-plagiarism-checker.html'],
      ['Business &amp; Teams', 'Invite team members, manage permissions, share organization storage, and connect plagiarism checking through the API when needed.', 'Business &amp; Teams', 'plagiarism-checker-for-organization.html'],
    ],
  },

  s10: {
    h2: 'What users say about PlagiarismSearch',
    placeholder: 'INSERT 3–5 EXACT SHORT REVIEWS FROZEN FROM APPROVED SOURCES',
    pool: 'Trustpilot · SmartCustomer · G2 · owned testimonials',
    cta: 'Read more reviews',
    ctaHref: 'testimonials.html',
  },

  s11: {
    h2: 'Choose a one-time plan',
    intro: 'Need more than the free check? Choose a one-time plan, or compare all available pricing options.',
    tiers: ['Light', 'Standard', 'Premium'],
    placeholder: 'BACKEND-SUPPLIED CURRENT PRICE / WORD QUOTA / APPROVED ENTITLEMENT FIELDS',
    cta: 'See all pricing options',
    ctaHref: 'prices.html',
  },

  s12: {
    h2: 'Plagiarism Checker FAQ',
    items: [
      ['What does PlagiarismSearch check for?', 'PlagiarismSearch compares the text you submit with the source collections enabled for your check and highlights matching or similar passages in the report. Depending on your settings, the check can include web sources, academic databases, personal storage, or organization storage. The report gives you evidence to review rather than an automatic plagiarism verdict.'],
      ['Does similarity automatically mean plagiarism?', 'No. Similarity means that some text matches or closely resembles text found in the sources checked. A match can come from a quotation, reference, common phrasing, or material that needs closer review, so source context and citation information matter.'],
      ['What sources can the plagiarism checker search?', 'Depending on your settings and access, the checker can search web sources, academic databases, personal storage, and organization storage. When academic database search is enabled, PlagiarismSearch can search over 500 million indexed academic texts. Not every source collection is necessarily included in every check.'],
      ['Can I exclude references and in-text citations?', 'Yes. The checker includes settings to exclude references and in-text citations when appropriate. Because exclusions change what is checked and reported, review your settings before interpreting the result.'],
      ['Is my uploaded document stored?', 'Uploaded source documents are not retained as documents after processing. Generated reports may remain in your account for convenience, and you can permanently delete them. If you choose Add to storage, that is a separate action you control.'],
      ['Can I check for AI-written text at the same time?', 'Yes. Keep Check for plagiarism on and optionally add Check for AI writing. The two analyses answer different questions: plagiarism checking looks for source matches and similarity, while AI detection provides a separate AI-writing indicator. An AI result does not by itself mean plagiarism or prove authorship.'],
      ['Which languages does the plagiarism checker support?', 'PlagiarismSearch supports plagiarism checking in 80+ languages.'],
      ['Which file types can I upload?', 'The checker accepts common file types such as DOC/DOCX, PDF, TXT, PPT/PPTX, and XLS/XLSX, along with other supported document formats. The uploader shows the formats accepted by the current checker.'],
      ['Can I try the plagiarism checker without registration?', 'Yes. You can check up to 150 words for plagiarism without registering.'],
    ],
  },

  s13: {
    h2: 'Check your text for plagiarism',
    support: 'Paste your text or upload a document to review matching passages and sources in a clear report.',
    cta: 'Check for plagiarism',
    free: '150 words free — no registration required.',
  },
};

/* The report demo. One precomputed report, using only the labels the brief approves.
   No global "Plagiarism X%" verdict, no threshold or colour logic, and the AI signal
   is kept visually separate from source matching. */
const REPORT = {
  paragraphs: [
    { text: 'The economic implications of climate change extend beyond environmental damage and touch every part of modern agricultural systems.', match: null },
    { text: 'Recent studies have shown that rising global temperatures correlate with decreased yields in rain-fed regions.', match: 0 },
    { text: 'However, smallholder farmers in West Africa have adapted through diversified cropping patterns and drought-resistant millet varieties.', match: 1 },
    { text: 'Field data from recent seasons supports this approach across tropical zones worldwide.', match: null },
  ],
  matches: [
    { source: 'Climate volatility and agriculture vulnerability', where: 'Nature Climate Change · 2023', context: '…measurements across rain-fed systems indicate that rising global temperatures correlate with decreased yields, particularly where irrigation is unavailable…', similarity: '92%', cited: false },
    { source: 'Adaptation strategies in West African smallholding', where: 'Cambridge J. Agricultural Econ. · 2022', context: '…smallholder farmers have adapted through diversified cropping patterns, with drought-resistant millet varieties among the most widely adopted responses…', similarity: '78%', cited: true },
  ],
  aiProbability: 'Low',
};

/* ─────────────────────────────────────────────────────────────────────────────
   PLAN DATA — a deliberate departure from DEC-0030, decided by Olex on 2026-08-18.

   The brief previews one-time plans only, forbids Monthly / 3-Month / Yearly matrices
   on the homepage, and forbids hardcoding price or quota values. All three are set
   aside here so the block can be evaluated as a design: the whole section becomes a
   widget with live integrations later, and these numbers go with it.

   Lifted verbatim from site/prices.html, which scraped plagiarismsearch.com/prices on
   2026-07-22. Nothing below was invented. When the widget lands, delete this object and
   the switcher markup that reads it — nothing else in the section depends on it.
   ───────────────────────────────────────────────────────────────────────────── */
const PLANS = {
  onetime: {
    note: 'One payment · packages never expire',
    term: '/ one-time',
    light:    { price: '$9.95',   rate: '$1.00', feats: ['1 plagiarism check', '1 AI check', 'No expiry'] },
    standard: { price: '$17.95',  rate: '$0.90', feats: ['10 plagiarism checks', '10 AI checks', 'No expiry'] },
    premium:  { price: '$41.95',  rate: '$0.42', feats: ['50 plagiarism checks', '50 AI checks', 'No expiry'] }
  },
  monthly: {
    note: 'Recurring billing · cancel anytime',
    term: '/ month',
    light:    { price: '$22.95',  rate: '$0.23', feats: ['100 plagiarism checks', '30-day validity'] },
    standard: { price: '$34.95',  rate: '$0.12', feats: ['300 plagiarism checks', 'API access', 'Report storage', '30-day validity'] },
    premium:  { price: '$54.95',  rate: '$0.09', feats: ['300 plagiarism checks', '300 AI checks', 'API access', 'Report storage', '30-day validity'] }
  },
  quarterly: {
    note: 'Recurring billing every 3 months · cancel anytime',
    term: '/ 3 months',
    light:    { price: '$34.95',  rate: '$0.17', feats: ['100 plagiarism checks', '100 AI checks', '90-day validity'] },
    standard: { price: '$64.95',  rate: '$0.10', feats: ['300 plagiarism checks', '300 AI checks', 'API access', 'Report storage', '90-day validity'] },
    premium:  { price: '$89.95',  rate: '$0.07', feats: ['500 plagiarism checks', '500 AI checks', 'API access', 'Report storage', '90-day validity'] }
  },
  yearly: {
    note: 'Recurring billing yearly · best per-word rate',
    term: '/ year',
    light:    { price: '$114.95', rate: '$0.11', feats: ['1,000 plagiarism checks', '365-day validity'] },
    standard: { price: '$174.95', rate: '$0.06', feats: ['3,000 plagiarism checks', 'API access', 'Report storage', '365-day validity'] },
    premium:  { price: '$259.95', rate: '$0.04', feats: ['3,000 plagiarism checks', '3,000 AI checks', 'API access', 'Report storage', '365-day validity'] }
  }
};

const LABEL = { light: 'Light', standard: 'Standard', premium: 'Premium' };
const TAGLINE = { light: 'For occasional checks', standard: 'For regular work', premium: 'For heavy use and teams' };

/* ── page-specific styles ────────────────────────────────────────────────── */
const STYLE = `
<style>
  /* ---------- the report demo, on the dark act ---------- */
  .hl { cursor:pointer; border-radius:.35rem; padding:.05em .18em; margin:-.05em -.18em;
        background:rgba(243,111,90,.18); box-shadow:inset 0 -2px 0 rgba(243,111,90,.5);
        transition:background .25s ease, box-shadow .25s ease; }
  .hl:hover { background:rgba(243,111,90,.3); }
  .hl.on { background:rgba(243,111,90,.42); box-shadow:inset 0 -2px 0 rgba(243,111,90,1); }
  .match-panel { display:none; }
  .match-panel.on { display:block; animation:mIn .3s cubic-bezier(.32,.72,0,1); }
  @keyframes mIn { from { opacity:0; transform:translateY(8px); } }

  /* ---------- hero variant B: the quick-check form from the v1 product pages ---------- */
  /* The base .qc-chip rule, brought over from the product pages. The shared head has
     only the small-breakpoint override for it, so without this the chips lose their
     pill entirely and fall back to plain text. */
  /* Same story as .qc-chip: the head carries only the small-breakpoint override for
     .qc-area, so without the base rule the field ignores width:100% and falls back to
     its default column count — 285px inside an 796px form, with the placeholder
     wrapping mid-phrase and the word count stranded far to its right. */
  .qc-area { width:100%; border:0; outline:none; background:transparent; resize:none;
    font-size:15px; line-height:1.6; font-weight:500; color:#111827; }
  .qc-area::placeholder { color:#9CA3AF; font-weight:400; }

  .qc-chip { display:inline-flex; align-items:center; gap:7px; height:38px; padding:0 14px;
    border-radius:9999px; background:#F1F2F6; color:#4B5563; font-size:12.5px; font-weight:600;
    transition:background-color .2s ease, color .2s ease; }
  .qc-chip:hover { background:#E5E7EB; color:#111827; }
  .qc-drop { border:1.5px dashed #A7E3ED; border-radius:16px; background:#F8FDFE;
    transition:border-color .2s ease, background-color .2s ease; }
  .qc-drop:hover { border-color:#2CC3DB; background:#F0FAFC; }

  /* ================= CLOSING CTA · one place for every knob =================
     Ported from v1's act 7, where both media queries were written and left empty. They
     are filled here, and it mattered: the warm glow is 1138px wide, which on a 390px
     phone is nearly three viewports of coral washing the whole screen.

     Each breakpoint scales the pair and pushes them back toward the edges, so the
     composition — warm upper left, cool lower right — survives at every width instead
     of one glow swallowing the section. Alpha comes down on small screens as well: the
     same opacity spread over a third of the area reads far heavier. */
  #cta {
    --cta-bg: #F2FCFC;

    /* warm, upper left */
    --cta-o1-rgb: 243,111,90;   --cta-o1-alpha: .25;
    --cta-o1-w: 1138px;         --cta-o1-h: 1040px;
    --cta-o1-x: -22.2%;         --cta-o1-y: -546px;
    --cta-o1-mid: 54.1%;        --cta-o1-end: 83.2%;

    /* cool, lower right */
    --cta-o2-rgb: 13,168,194;   --cta-o2-alpha: .15;
    --cta-o2-w: 954px;          --cta-o2-h: 950px;
    --cta-o2-x: 74.2%;          --cta-o2-y: 374px;
    --cta-o2-mid: 65%;          --cta-o2-end: 100%;

    background-color: var(--cta-bg);
  }
  #ctaGlowWarm { width:var(--cta-o1-w); height:var(--cta-o1-h); left:var(--cta-o1-x); top:var(--cta-o1-y);
    background:rgba(var(--cta-o1-rgb), var(--cta-o1-alpha));
    -webkit-mask-image:radial-gradient(circle closest-side, rgba(0,0,0,1) 0%, rgba(0,0,0,.5) var(--cta-o1-mid), transparent var(--cta-o1-end));
            mask-image:radial-gradient(circle closest-side, rgba(0,0,0,1) 0%, rgba(0,0,0,.5) var(--cta-o1-mid), transparent var(--cta-o1-end)); }
  #ctaGlowCool { width:var(--cta-o2-w); height:var(--cta-o2-h); left:var(--cta-o2-x); top:var(--cta-o2-y);
    background:rgba(var(--cta-o2-rgb), var(--cta-o2-alpha));
    -webkit-mask-image:radial-gradient(circle closest-side, rgba(0,0,0,1) 0%, rgba(0,0,0,.5) var(--cta-o2-mid), transparent var(--cta-o2-end));
            mask-image:radial-gradient(circle closest-side, rgba(0,0,0,1) 0%, rgba(0,0,0,.5) var(--cta-o2-mid), transparent var(--cta-o2-end)); }

  /* tablet — about three quarters of the desktop figure */
  @media (max-width:1023px) {
    #cta {
      --cta-o1-w: 840px;  --cta-o1-h: 770px;
      --cta-o1-x: -28%;   --cta-o1-y: -400px;
      --cta-o2-w: 700px;  --cta-o2-h: 700px;
      --cta-o2-x: 64%;    --cta-o2-y: 300px;
    }
  }
  /* phone — half the size, softer, hard against the edges so the middle stays readable */
  @media (max-width:639px) {
    #cta {
      --cta-o1-alpha: .20;
      --cta-o1-w: 560px;  --cta-o1-h: 520px;
      --cta-o1-x: -38%;   --cta-o1-y: -250px;
      --cta-o2-alpha: .12;
      --cta-o2-w: 470px;  --cta-o2-h: 470px;
      --cta-o2-x: 52%;    --cta-o2-y: 210px;
    }
  }

  /* ---------- closing ring ---------- */
  .no-motion .ring-word { color:#DC5A45; }
  .no-motion .ring-path { opacity:1; }

  /* ---------- the hero's two checkboxes ---------- */
  .sw { width:38px; height:22px; border-radius:999px; background:rgba(16,24,40,.14);
        position:relative; transition:background .25s cubic-bezier(.32,.72,0,1); flex:none; }
  .sw::after { content:''; position:absolute; top:3px; left:3px; width:16px; height:16px;
        border-radius:999px; background:#fff; box-shadow:0 1px 3px rgba(16,24,40,.3);
        transition:transform .25s cubic-bezier(.32,.72,0,1); }
  .sw.on { background:#0D9488; }
  .sw.on::after { transform:translateX(16px); }

  /* ---------- reviews carousel ---------- */
  .no-bar { scrollbar-width:none; -ms-overflow-style:none; }
  .no-bar::-webkit-scrollbar { display:none; }
  /* the arrows are a hover affordance, but focus must reach them too, or the control
     is mouse-only. Hidden entirely when there is nothing to scroll. */
  .rev-nav { opacity:0; pointer-events:none;
             transition:opacity .3s ease, transform .3s cubic-bezier(.32,.72,0,1); }
  .group:hover .rev-nav, .rev-nav:focus-visible { opacity:1; pointer-events:auto; }
  .rev-nav[hidden] { display:none; }
  .rev-nav:hover { transform:translateY(-50%) scale(1.06); }
  .rev-dot { width:7px; height:7px; border-radius:999px; background:rgba(255,255,255,.22);
             transition:width .3s cubic-bezier(.32,.72,0,1), background-color .3s ease; }
  .rev-dot.on { width:22px; background:#fff; }
  @media (hover: none) { .rev-nav { opacity:1; pointer-events:auto; } }

  /* ---------- period switcher (same control as the pricing page) ---------- */
  .period-btn { transition:background-color .3s ease, color .3s ease, box-shadow .3s ease; }
  .period-btn.active { background:#fff; color:#111827; box-shadow:0 1px 2px rgba(0,0,0,.06); }

  /* ---------- FAQ chevron ----------
     Grey until its answer is open. v1 baked the two states into the markup per item,
     which meant the colour never followed a click; driving it from .faq-item.open keeps
     the accent on the question you are actually reading.
     The transform stays in the transition list — the shared head sets it, and redeclaring
     transition here would otherwise drop the chevron's rotation. */
  .faq-chev { background:#F1F2F6; color:#4B5563;
              transition:transform .45s cubic-bezier(.32,.72,0,1), background-color .3s ease, color .3s ease; }
  .faq-item.open .faq-chev { background:#FDE5E0; color:#B84431; }
  .faq-item.open .faq-q > span:first-child { font-weight:700; }

  /* ---------- placeholder chrome — anything wearing this waits on production data ---------- */
  .ph { border:1px dashed rgba(16,24,40,.22); border-radius:.75rem; }
  .ph-dark { border:1px dashed rgba(255,255,255,.22); border-radius:.75rem; }

  @media (prefers-reduced-motion: reduce) {
    .match-panel.on { animation:none; }
    .hl, .sw, .sw::after { transition:none; }
  }
</style>`;

/* ─────────────────────────────────────────────────────────────────────────────
   The site's visual vocabulary, so the sections below read as content.
   Everything here is v1's language: the eyebrow chip, the pen underline, tinted
   icon chips, dark acts between light ones, partner marks, oversized numerals.
   ───────────────────────────────────────────────────────────────────────────── */
const ICON = 'w-[14px] h-[14px] sm:w-4 sm:h-4';
const H2 = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const LEAD = 'text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed';
const BODY = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const TILE_SUB = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const CARD = 'rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7';
const CARD_DARK = 'rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white/[.06] ring-1 ring-white/10 p-5 sm:p-6 lg:p-7';

/* the section marker: orange dot on a white chip, wide-tracked label */
const eyebrow = (text, dark = false) => `<div class="inline-flex items-center gap-2 rounded-full ${dark ? 'bg-white/[.07] ring-1 ring-white/10' : 'bg-white ring-1 ring-black/5'} px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] ${dark ? 'text-white/70' : 'text-ink-700'}">${text}</span>
        </div>`;

/* one word takes the accent colour, then its underline draws itself */
const pen = w => `<span class="pen-word relative inline-block">${w}<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c30-7 80-7 114-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round" opacity="0"/></svg></span>`;

/* v1 closes by ringing a word rather than underlining it. Same idea as pen(), drawn
   as a loop, and reserved for the last thing on the page. */
const ring = w => `<span class="ring-word relative inline-block">${w}<svg class="ring-mark absolute pointer-events-none" viewBox="0 0 230 100" fill="none" aria-hidden="true" style="left:-9%; top:-26%; width:118%; height:152%; transform:rotate(-2deg);"><path class="ring-path" d="M30,62 C22,30 78,8 128,10 C182,12 216,32 212,58 C207,86 142,96 88,92 C44,88 18,76 26,50 C30,36 48,24 66,20" stroke="#F36F5A" stroke-opacity=".5" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" opacity="0"/></svg></span>`;

const grad = w => `<span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-teal-600">${w}</span>`;

const I = {
  search:   '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  sliders:  '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/>',
  upload:   '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  file:     '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  report:   '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 17v-3"/><path d="M12 17v-6"/><path d="M16 17v-4"/>',
  trash:    '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  shield:   '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  cap:      '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/>',
  users:    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  code:     '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
  star:     '<path d="m12 2 2.9 6.26 6.6.83-4.9 4.6 1.3 6.31L12 16.9 6.1 20l1.3-6.31L2.5 9.09l6.6-.83z"/>',
  globe:    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  info:     '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  tag:      '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
};

/* tinted chip; the three tints rotate so a row of cards is not monotone */
const TINTS = [
  ['bg-teal-50', 'ring-teal-500/15', 'text-teal-700'],
  ['bg-orange-100', 'ring-orange-500/15', 'text-orange-700'],
  ['bg-mint-100', 'ring-mint-500/20', 'text-mint-700'],
];
const chip = (icon, i = 0, dark = false) => {
  const [bg, ring, fg] = TINTS[i % TINTS.length];
  return `<span class="w-11 h-11 rounded-xl sm:rounded-[14px] ${dark ? 'bg-white/10 ring-1 ring-white/15 text-white' : bg + ' ring-1 ' + ring + ' ' + fg} flex items-center justify-center shrink-0">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>
          </span>`;
};

const btn = (label, href, tone = 'dark') => {
  const skin = tone === 'dark' ? 'bg-ink-900 text-white hover:bg-ink-800'
             : tone === 'onDark' ? 'bg-white text-ink-900 hover:bg-white/90'
             : 'ring-1 ring-black/10 text-ink-900 hover:bg-ink-900/5';
  const orb = tone === 'dark' ? 'bg-white/15' : tone === 'onDark' ? 'bg-ink-900/10' : 'bg-ink-900/5';
  return `<a href="${href}" class="group btn-press inline-flex items-center gap-2 h-12 sm:h-14 pl-5 sm:pl-7 pr-2.5 rounded-full ${skin} text-[14px] sm:text-[15px] font-semibold transition-colors duration-300">
          ${label}
          <span class="icon-orb w-9 h-9 rounded-full ${orb} flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>`;
};

/* The site's tick, the one the pricing feature lists already use. */
const tick = label => `<li class="flex items-center gap-3 py-2.5">
              <svg class="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2AA46C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
              <span class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-800">${label}</span>
            </li>`;

const placeholder = (text, dark = false) => `<span class="${dark ? 'ph-dark text-white/45' : 'ph text-ink-400'} inline-block px-3 py-2 text-[11px] sm:text-[11.5px] font-semibold uppercase tracking-[0.14em]">${text}</span>`;

/* partner mark on its own plate, the treatment already used on the current homepage */
const partner = (file, alt) => `<span class="rounded-xl bg-ink-50 aspect-[324/113] w-full flex items-center justify-center overflow-hidden">
            <img src="assets/svg/partners/${file}" alt="${alt}" loading="lazy" decoding="async" class="w-full h-full object-contain">
          </span>`;

/* ── review sources ──────────────────────────────────────────────────────────
   The three platforms Olex named. Quotes, names and ratings are NOT here: the brief
   lists them as dynamic fields and forbids browsing for them, and a mistranscribed
   review is a fabricated quote with a real person's name on it. The cards below take
   whatever is dropped into this array; nothing else has to change.

   'rating' and 'count' render whatever they are given, including halves — leave them
   null and the card simply omits the strip. */
const SOURCES = {
  trustpilot: {
    name: 'Trustpilot',
    mark: 'assets/svg/trustpilot-icon.svg',
    url: 'https://www.trustpilot.com/review/plagiarismsearch.com',
    rating: null, count: null,
  },
  smartcustomer: {
    name: 'SmartCustomer',
    mark: 'assets/svg/partners/smartcustomer-icon.svg',
    url: 'https://www.smartcustomer.com/reviews/plagiarismsearch.com',
    rating: null, count: null,
  },
  marketplace: {
    name: 'Google Workspace Marketplace',
    mark: 'assets/svg/google-icon.svg',           /* the Google mark, not the Marketplace one */
    url: 'https://workspace.google.com/marketplace/app/check_for_plagiarism_in_google_docs/347088629827',
    rating: null, count: null,
  },
};

/* One card, two skins. Everything a review can carry is optional, so a card with only
   a quote still renders and a card with mark, rating, count and author renders more. */
const stars = (value, dark) => {
  const pct = value == null ? 0 : Math.max(0, Math.min(100, (value / 5) * 100));
  const star = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + I.star + '</svg>';
  return `<span class="relative inline-flex shrink-0" role="img" aria-label="${value == null ? 'Rating pending' : value + ' out of 5'}">
            <span class="flex gap-0.5 ${dark ? 'text-white/20' : 'text-ink-200'}">${star.repeat(5)}</span>
            <span class="absolute inset-0 overflow-hidden text-[#00B67A]" style="width:${pct}%"><span class="flex gap-0.5">${star.repeat(5)}</span></span>
          </span>`;
};

const reviewCard = (r, dark) => {
  const src = SOURCES[r.source];
  const muted = dark ? 'text-white/45' : 'text-ink-400';
  return `<figure class="${dark ? CARD_DARK : CARD} flex flex-col h-full w-full">
            <div class="flex items-center gap-2.5 mb-5">
              ${src.mark
                ? `<img src="${src.mark}" alt="" aria-hidden="true" class="w-5 h-5 shrink-0">`
                : `<span class="w-4 h-4 rounded-[5px] shrink-0 ${dark ? 'bg-white/15' : 'bg-ink-200'}"></span>`}
              <span class="text-[11px] sm:text-[11.5px] font-semibold ${dark ? 'text-white/60' : 'text-ink-500'}">${src.name}</span>
              ${src.rating != null ? `<span class="ml-auto flex items-center gap-2">${stars(src.rating, dark)}<span class="text-[12px] font-bold nums ${dark ? 'text-white' : 'text-ink-900'}">${src.rating}</span></span>` : `<span class="ml-auto">${stars(null, dark)}</span>`}
            </div>

            <blockquote class="flex-1 text-[14.5px] sm:text-[15.5px] leading-relaxed ${dark ? 'text-white/85' : 'text-ink-800'} mb-5">${r.quote}</blockquote>

            <figcaption class="flex items-center justify-between gap-3 pt-4 border-t ${dark ? 'border-white/10' : 'border-ink-100'}">
              <span class="text-[12.5px] sm:text-[13px] font-semibold ${dark ? 'text-white/70' : 'text-ink-700'}">${r.author}</span>
              <a href="${src.url}" rel="nofollow noopener" class="text-[11.5px] font-semibold ${muted} hover:${dark ? 'text-white' : 'text-ink-900'} underline decoration-current/30 underline-offset-4 transition-colors duration-300">Read on ${src.name.split(' ')[0]}</a>
            </figcaption>
          </figure>`;
};

/* Sample text, written to be unmistakable for a review: it describes the slot it sits
   in. It is here so the card's typography can be judged at a realistic length, and it
   goes the moment frozen quotes arrive. */
const SAMPLE = [
  { source: 'trustpilot',    author: 'Reviewer name', quote: 'Sample text at the length a two-line review occupies, so the measure and leading can be judged before real quotes arrive.' },
  { source: 'smartcustomer', author: 'Reviewer name', quote: 'Sample text at the length a three-line review occupies. Cards stretch to the tallest in view, so a short quote and a long one still align at the foot.' },
  { source: 'marketplace',   author: 'Reviewer name', quote: 'Sample text at the length a two-line review occupies, so the measure and leading can be judged before real quotes arrive.' },
  { source: 'trustpilot',    author: 'Reviewer name', quote: 'A fourth and fifth slot exist only so the carousel has something to scroll to. They leave with the rest of the sample text.' },
  { source: 'marketplace',   author: 'Reviewer name', quote: 'Sample text at the length a two-line review occupies, so the measure and leading can be judged before real quotes arrive.' },
];

/* Dark-theme plate and marks, from Figma node 5545-515. The light sections keep the
   colour logos on white; only this rail uses the reversed set — Canvas in white,
   Moodle in orange on white, Google Docs with its grey wordmark.

   The marks are Figma's own exports, not redrawn. Figma bakes every ancestor fill into
   a node export, so each arrived carrying three background rects — the page plate, the
   section and the card. Those were removed; every glyph path is untouched. */
const partnerDark = (file, alt) => `<span class="rounded-xl bg-[#1B1F29] aspect-[324/113] w-full flex items-center justify-center overflow-hidden">
            <img src="assets/svg/partners/${file}" alt="${alt}" loading="lazy" decoding="async" class="w-[60%] h-auto max-h-[57%] object-contain">
          </span>`;

/* the four input methods, drawn once for both hero variants */
const NL12 = String.fromCharCode(10) + '            ';
const chipGlyph = i => {
  const glyph = i.icon === 'brand'
    ? `<img src="assets/svg/partners/${i.file}" alt="" aria-hidden="true" class="${ICON} shrink-0">`
    : `<svg class="${ICON} shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${i.path}</svg>`;
  return `<button type="button" class="qc-chip">${glyph}${i.label}</button>`;
};

const S = COPY;

/* ─────────────────────────────────────────────────────────────────────────────
   Sections. Light and dark alternate so the page has a pulse rather than one
   long scroll: the report, the reviews and the closing CTA are the dark acts.
   ───────────────────────────────────────────────────────────────────────────── */

const section1 = () => `
  <!-- ================= 01 · HERO / REAL CHECKER =================
       The quick-check form from the product pages, chosen over the plainer one on
       2026-08-20. Field with its count in the corner, drop zone, input chips, then
       the two checks beside the button under a rule.

       It is the page's primary object, per the hero rule: no decorative report
       stands in for it. Inert — no action, submit returns false. -->
  <section id="checker" class="relative pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-16 lg:pb-20 bg-[#F2FCFC] overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="orb w-[620px] h-[620px] bg-teal-500/12 -left-48 -top-40"></div>
      <div class="orb w-[520px] h-[520px] bg-orange-500/10 right-[-140px] top-40"></div>
    </div>
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="max-w-[760px] mx-auto text-center mb-8 sm:mb-10 lg:mb-12">
        <h1 class="${H2} mb-5 lg:mb-6">Plagiarism ${pen('Checker')}</h1>
        <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] text-ink-600 leading-relaxed">${S.s1.support}</p>
      </div>

      <div class="rv max-w-[860px] mx-auto rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.025] ring-1 ring-black/[.12] p-1.5 sm:p-2 shadow-diffuse">
        <form class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl p-4 sm:p-5 lg:p-6" onsubmit="return false">

          <label for="checkText" class="sr-only">${S.s1.placeholder}</label>
          <!-- the count belongs to the text, so it sits in the corner of the field
               rather than in a footer two rows away from what it counts -->
          <div class="relative mb-4">
            <textarea id="checkText" rows="4" class="qc-area block pr-24" placeholder="${S.s1.placeholder}"></textarea>
            <span class="pointer-events-none absolute bottom-0 right-0 text-[12px] font-medium text-ink-400 nums"><span id="wordCount">0</span> / 150 words</span>
          </div>

          <div class="qc-drop flex flex-wrap items-center gap-3 sm:gap-4 px-4 py-3.5 mb-3">
            <span class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 ring-1 ring-black/5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0991A8" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I.upload}</svg>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-[13.5px] font-bold tracking-tight">Drag and drop a file here</span>
              <span class="block text-[12px] text-ink-500">${S.s1.formats}</span>
            </span>
          </div>

          <div class="flex flex-wrap gap-2 mb-4 lg:mb-5">
            ${S.s1.inputs.map(chipGlyph).join(NL12)}
          </div>

          <!-- the two checks sit beside the button they modify, not in a row of their own -->
          <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pt-4 mt-1 border-t border-ink-100">
            <div class="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" id="optPlag" checked class="sr-only peer">
                <span class="sw on" data-for="optPlag"></span>
                <span class="text-[13px] sm:text-[13.5px] font-semibold text-ink-900">${S.s1.checkPlagiarism}</span>
              </label>
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" id="optAI" class="sr-only peer">
                <span class="sw" data-for="optAI"></span>
                <span class="text-[13px] sm:text-[13.5px] font-medium text-ink-600">${S.s1.checkAI}</span>
              </label>
            </div>
            <a href="#checker" class="btn-press group flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold pl-5 sm:pl-6 pr-2 py-2">
              ${S.s1.cta}
              <span class="icon-orb w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </a>
          </div>
        </form>
      </div>

      <p class="mt-5 sm:mt-6 flex items-center justify-center gap-2 text-[13.5px] sm:text-[14.5px] font-semibold text-ink-700">
        <svg class="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC5A45" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I.sparkles}</svg>
        ${S.s1.free}
      </p>
    </div>
  </section>`;

const section2 = () => `
  <!-- ================= 02 · COMPACT TRUST RAIL =================
       Each column is one element, in reading order, because the approved strings
       have to survive as sentences: "500,000+ users" and "Plagiarism checking in
       80+ languages" are read whole by a crawler and a screen reader, and laying
       the rail out row-by-row across a grid shreds both.

       The middle column carries a lead-in the other two do not — that is the copy,
       not the layout: one sentence puts words before its number, the other does
       not. An empty row of the same height at the top of columns 1 and 3 puts the
       three figures on one baseline without adding a word to either.

       Visible headings on all three would need three words the brief does not
       supply. Ask before inventing them.

       NOTE: the brief lists a fourth item here, the verified review-platform rating
       and count. Olex removed its placeholder on 2026-08-18. The slot went with it,
       so restoring the item means putting a fourth column back. -->
  <section class="relative py-10 sm:py-12 lg:py-14 bg-white border-b border-ink-100">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv flex flex-wrap items-start justify-center gap-x-12 sm:gap-x-16 lg:gap-x-24 gap-y-8 text-center">

        <div class="flex flex-col items-center">
          <div class="hidden sm:block h-[17px]" aria-hidden="true"></div>
          <div class="h-[63px] sm:h-[78px] lg:h-[90px] flex items-center"><div class="text-[clamp(1.7rem,3vw,2.6rem)] font-extrabold tracking-tightest nums leading-none">500,000+</div></div>
          <div class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400 mt-2">users</div>
        </div>

        <div class="flex flex-col items-center">
          <div class="text-[11px] sm:text-[11.5px] font-medium text-ink-400 h-[17px] leading-[17px]">Plagiarism checking in</div>
          <div class="h-[63px] sm:h-[78px] lg:h-[90px] flex items-center"><div class="text-[clamp(1.7rem,3vw,2.6rem)] font-extrabold tracking-tightest nums leading-none">80+</div></div>
          <div class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400 mt-2">languages</div>
        </div>

        <div class="flex flex-col items-center">
          <div class="hidden sm:block h-[17px]" aria-hidden="true"></div>
          <div class="h-[63px] sm:h-[78px] lg:h-[90px] flex items-center"><img src="assets/svg/partners/bbb.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" class="h-full w-auto object-contain"></div>
          <div class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400 mt-2">BBB Accredited</div>
        </div>
      </div>
    </div>
  </section>`;

const section4 = () => `
  <!-- ================= 04 · SIGNATURE · INTERACTIVE REPORT =================
       The first dark act. This is the page's centrepiece, so it gets the break in
       rhythm and the accent colour on the matched text. -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-ink-950 text-white overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="orb w-[620px] h-[620px] bg-teal-500/12 -left-52 top-10"></div>
      <div class="orb w-[520px] h-[520px] bg-orange-500/10 right-[-160px] bottom-[-120px]"></div>
    </div>
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        ${eyebrow('The report', true)}
        <h2 class="${H2} mb-4 lg:mb-5">See the ${pen('evidence')} behind every match</h2>
        <p class="${LEAD} text-white/60">${S.s4.intro}</p>
      </div>

      <div class="rv grid lg:grid-cols-[1.35fr_1fr] gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-7 lg:mb-8">
        <div class="${CARD_DARK}">
          <div class="flex items-center gap-3 mb-5">
            ${chip(I.file, 0, true)}
            <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/45">${S.s4.labels[0]}</span>
          </div>
          <div class="space-y-3.5 text-[14.5px] sm:text-[15.5px] leading-relaxed text-white/85">
            ${REPORT.paragraphs.map(p => p.match === null
              ? `<p>${p.text}</p>`
              : `<p><span class="hl" role="button" tabindex="0" data-match="${p.match}">${p.text}</span></p>`).join('\n            ')}
          </div>
          <p class="mt-5 pt-4 border-t border-white/10 text-[12.5px] sm:text-[13px] font-medium text-white/40">Select a highlighted passage to open its source.</p>
        </div>

        <div>
          ${REPORT.matches.map((m, i) => `
          <div class="match-panel${i === 0 ? ' on' : ''} ${CARD_DARK}" data-panel="${i}">
            <div class="flex items-center gap-3 mb-4">
              ${chip(I.search, 1, true)}
              <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/45">${S.s4.labels[1]}</span>
            </div>
            <p class="text-[14.5px] sm:text-[15.5px] font-bold tracking-tight mb-1">${m.source}</p>
            <p class="text-[12.5px] sm:text-[13px] font-medium text-white/40 mb-5">${m.where}</p>

            <div class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/45 mb-2">${S.s4.labels[2]}</div>
            <p class="${BODY} text-white/60 mb-5">${m.context}</p>

            <dl class="divide-y divide-white/10 border-t border-white/10">
              <div class="flex items-center justify-between py-2.5">
                <dt class="text-[13.5px] sm:text-[14.5px] text-white/50">${S.s4.labels[3]}</dt>
                <dd class="text-[17px] sm:text-[19px] font-extrabold tracking-tightest nums text-orange-400">${m.similarity}</dd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <dt class="text-[13.5px] sm:text-[14.5px] text-white/50">${S.s4.labels[4]}</dt>
                <dd class="text-[13.5px] sm:text-[14.5px] font-semibold">${m.cited ? 'Present for this passage' : 'None for this passage'}</dd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <dt class="text-[13.5px] sm:text-[14.5px] text-white/50">${S.s4.labels[5]}</dt>
                <dd class="text-[13.5px] sm:text-[14.5px] font-semibold">Listed in the report</dd>
              </div>
            </dl>
          </div>`).join('\n          ')}

          <!-- its own frame, away from the source-matching signals, because the brief
               requires the AI signal to read as separate rather than as a verdict -->
          <div class="mt-4 sm:mt-5 rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-teal-500/10 ring-1 ring-teal-400/20 p-5 sm:p-6">
            <div class="flex items-center gap-3 mb-3">
              ${chip(I.sparkles, 0, true)}
              <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/45">${S.s4.labels[6]}</span>
            </div>
            <p class="text-[17px] sm:text-[19px] font-extrabold tracking-tight mb-1.5">${REPORT.aiProbability}</p>
            <p class="${BODY} text-white/55">Reported as a separate signal. It is not part of source matching.</p>
          </div>
        </div>
      </div>

      <!-- Demoted from a white card to a footnote. It is a caveat about how to read the
           report, not a claim, and as a full-width white slab on a dark act it was
           shouting louder than the report it qualifies. -->
      <p class="rv flex items-start gap-2.5 text-[12.5px] sm:text-[13px] leading-relaxed text-white/45 max-w-[76ch] mb-10 sm:mb-12 lg:mb-14">
        <svg class="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I.shield}</svg>
        ${S.s4.callout}
      </p>

      <!-- The integrations rail, moved here from its own section at Olex's request.
           NOTE: the brief's page story puts the integrations proof at block 3 and the
           report at block 4, so sitting at the foot of the report act reverses the two.
           Moving this above the report heading would restore the order and keep the
           visual merge — one move of this block. -->
      <div class="rv">
        <div class="flex items-center gap-4 mb-6 sm:mb-7 lg:mb-8">
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/40 shrink-0">${S.s3.label}</span>
          <span class="h-px flex-1 bg-white/10"></span>
        </div>
        <ul class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          <li>${partnerDark('moodle-on-dark.svg', 'Moodle')}</li>
          <li>
            <span class="rounded-xl bg-[#1B1F29] aspect-[324/113] w-full flex items-center justify-center gap-2 text-white/80">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I.code}</svg>
              <span class="text-[15px] sm:text-[17px] font-extrabold tracking-tight">API</span>
            </span>
          </li>
          <li>${partnerDark('canvas-on-dark.svg', 'Canvas')}</li>
          <li>${partnerDark('google-docs-on-dark.svg', 'Google Docs')}</li>
        </ul>
      </div>
    </div>
  </section>`;

const section5 = () => `
  <!-- ================= 05 · SIGNATURE · SOURCES & SCAN CONTROLS ================= -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-[#F7FAFC]">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        ${eyebrow('Scan controls')}
        <h2 class="${H2} mb-4 lg:mb-5">${S.s5.h2}</h2>
        <p class="${LEAD} text-ink-600">${S.s5.intro}</p>
      </div>

      <!-- Ticks, not switches. These are a list of what a check can include, so a
           control that moves invites you to set something the page cannot act on. The
           coverage card no longer dims with a toggle for the same reason — its sentence
           already carries the condition. -->
      <div class="rv grid lg:grid-cols-[1fr_1fr_.9fr] gap-4 sm:gap-5 lg:gap-6">
        <div class="${CARD}">
          <div class="flex items-center gap-3 mb-5">
            ${chip(I.search, 0)}
            <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400">Search sources</span>
          </div>
          <ul class="space-y-1">
            ${S.s5.sources.map(tick).join('\n            ')}
          </ul>
        </div>

        <div class="${CARD}">
          <div class="flex items-center gap-3 mb-5">
            ${chip(I.sliders, 1)}
            <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400">Review settings</span>
          </div>
          <ul class="space-y-1">
            ${S.s5.settings.map(tick).join('\n            ')}
          </ul>
        </div>

        <div class="rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-ink-900 text-white p-5 sm:p-6 lg:p-7 flex flex-col justify-center">
          ${chip(I.database, 0, true)}
          <div class="text-[clamp(1.7rem,3vw,2.6rem)] font-extrabold tracking-tightest nums leading-none mt-5 mb-3">500 million</div>
          <p class="${BODY} text-white/60">${S.s5.coverage}</p>
        </div>
      </div>
    </div>
  </section>`;

const section6 = () => `
  <!-- ================= 06 · SIGNATURE · PLAGIARISM VS AI =================
       One type size across all three blocks. They had been running at 17.5, 14.5
       and 15.5 with nothing to explain the difference, which reads as three
       accidents rather than a hierarchy. They are peers — two answers and the
       sentence that ties them — so they share the section-body step.

       Plagiarism stays primary, as the brief requires, but through the things that
       actually rank a block: the dark surface and the wider column. Type size was
       doing that job badly and inconsistently.

       The bridge gets a chip of its own, so it stands beside the cards rather than
       reading as a leftover paragraph under them. -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[760px] mb-8 sm:mb-10 lg:mb-12">
        ${eyebrow('Two analyses')}
        <h2 class="${H2}">Plagiarism and AI checks answer ${grad('different questions')}</h2>
      </div>

      <div class="rv grid lg:grid-cols-[1.25fr_1fr] gap-4 sm:gap-5 lg:gap-6 mb-4 sm:mb-5 lg:mb-6">
        <div class="rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-ink-900 text-white p-6 sm:p-7 lg:p-8">
          <div class="flex items-center gap-3 mb-5 lg:mb-6">
            ${chip(I.search, 0, true)}
            <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/45">Plagiarism check</span>
          </div>
          <p class="${LEAD} text-white/85 max-w-[58ch]">${S.s6.plagiarism}</p>
        </div>
        <div class="${CARD} flex flex-col">
          <div class="flex items-center gap-3 mb-5 lg:mb-6">
            ${chip(I.sparkles, 1)}
            <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400">AI writing check</span>
          </div>
          <p class="${LEAD} text-ink-600 mb-6">${S.s6.ai}</p>
          <div class="mt-auto">${btn(S.s6.cta, S.s6.ctaHref, 'light')}</div>
        </div>
      </div>

      <div class="rv rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-orange-50 ring-1 ring-orange-500/10 p-5 sm:p-6 lg:p-7 flex items-start gap-4 sm:gap-5">
        ${chip(I.info, 1)}
        <p class="${LEAD} text-ink-700 max-w-[76ch]">${S.s6.bridge}</p>
      </div>
    </div>
  </section>`;

const section7 = () => `
  <!-- ================= 07 · DOCUMENT & REPORT PRIVACY LIFECYCLE ================= -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-[#F2FCFC] overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="orb w-[540px] h-[540px] bg-teal-500/10 right-[-160px] top-20"></div>
    </div>
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        ${eyebrow('Document handling')}
        <h2 class="${H2} mb-4 lg:mb-5">${S.s7.h2}</h2>
        <p class="${LEAD} text-ink-600">${S.s7.intro}</p>
      </div>

      <ol class="rv grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-7 lg:mb-8">
        ${S.s7.steps.map(([t, d], i) => `<li class="${CARD}">
          ${chip([I.upload, I.file, I.report, I.trash][i], i)}
          <div class="flex items-baseline gap-2 mt-5 mb-2">
            <span class="text-[11px] font-bold tracking-[0.2em] text-ink-300 nums">0${i + 1}</span>
            <p class="text-[15.5px] sm:text-[16.5px] font-bold tracking-tight text-ink-900">${t}</p>
          </div>
          <p class="${TILE_SUB} text-ink-600">${d}</p>
        </li>`).join('\n        ')}
      </ol>

      <div class="rv flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7">
        <div class="min-w-0">
          <p class="${BODY} text-ink-600 mb-1.5">${S.s7.storage}</p>
          <p class="${BODY} text-ink-600">${S.s7.infra}</p>
        </div>
        <div class="shrink-0 sm:ml-auto">${btn(S.s7.cta, S.s7.ctaHref, 'light')}</div>
      </div>
    </div>
  </section>`;

const section8 = () => `
  <!-- ================= 08 · FULL WORKFLOW / INTEGRATIONS =================
       Bento, weighted to the brief's visual priority: Moodle wide, then API, Canvas,
       Google Docs. The marks come back here at full size. -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        ${eyebrow('Workflow')}
        <h2 class="${H2} mb-4 lg:mb-5">${S.s8.h2}</h2>
        <p class="${LEAD} text-ink-600">${S.s8.intro}</p>
      </div>

      <div class="rv grid lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        ${S.s8.cards.map(([t, d, cta, href, mark], i) => {
          const wide = i === 0 || i === 3;
          return `<div class="${CARD} flex flex-col${wide ? ' lg:col-span-2' : ''}">
          <div class="w-[208px] mb-5">${mark
            ? partner(mark, t)
            : `<span class="rounded-xl bg-ink-50 aspect-[324/113] w-full flex items-center justify-center gap-3 text-ink-700"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I.code}</svg><span class="text-[18px] sm:text-[20px] lg:text-[22px] font-extrabold tracking-tight">API</span></span>`}</div>
          <p class="text-[17.5px] sm:text-[19px] lg:text-[20px] font-bold tracking-tight text-ink-900 mb-3">${t}</p>
          <p class="${TILE_SUB} text-ink-600 mb-6${wide ? ' max-w-[62ch]' : ''}">${d}</p>
          <div class="mt-auto">${btn(cta, href, 'light')}</div>
        </div>`;
        }).join('\n        ')}
      </div>
    </div>
  </section>`;

const section9 = () => `
  <!-- ================= 09 · AUDIENCE PATHWAYS ================= -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-[#F7FAFC]">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        ${eyebrow('Pathways')}
        <h2 class="${H2} mb-4 lg:mb-5">${S.s9.h2}</h2>
        <p class="${LEAD} text-ink-600">${S.s9.intro}</p>
      </div>

      <div class="rv grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        ${S.s9.cards.map(([t, d, cta, href], i) => `<div class="${CARD} flex flex-col">
          ${chip([I.cap, I.building, I.users][i], i)}
          <p class="text-[17.5px] sm:text-[19px] lg:text-[20px] font-bold tracking-tight text-ink-900 mt-5 mb-3">${t}</p>
          <p class="${TILE_SUB} text-ink-600 mb-6">${d}</p>
          <div class="mt-auto">${btn(cta, href, 'light')}</div>
        </div>`).join('\n        ')}
      </div>
    </div>
  </section>`;

const section10 = () => `
  <!-- ================= 10 · REVIEWS =================
       A carousel rather than a fixed three: the number of reviews is not ours to
       decide, and a row that only ever holds three would have to be rebuilt the
       moment a fourth arrives.

       Controls hide themselves when there is nothing to scroll — on a wide screen
       with three reviews the arrows and dots simply do not appear.

       No quote, name or rating is filled in. The brief lists them as dynamic and
       says not to browse for them; beyond that, a mistranscribed review is an
       invented quote with a real person's name under it. -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-ink-950 text-white overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="orb w-[560px] h-[560px] bg-orange-500/12 left-[-160px] bottom-[-140px]"></div>
    </div>
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv flex flex-wrap items-end justify-between gap-5 mb-8 sm:mb-10 lg:mb-12">
        <div class="max-w-[720px]">
          ${eyebrow('Reviews', true)}
          <h2 class="${H2}">${S.s10.h2}</h2>
        </div>
        <span class="ph-dark text-white/45 inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">Sample text</span>
      </div>

      <div class="rv group relative">
        <div id="revTrack" class="flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory no-bar -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          ${SAMPLE.map(r => `<div class="snap-start shrink-0 flex basis-[86%] sm:basis-[54%] lg:basis-[calc((100%-3rem)/3)]">${reviewCard(r, true)}</div>`).join('\n          ')}
        </div>

        <!-- shown on hover, and always once focused, so the control is reachable
             from the keyboard rather than being a mouse-only affordance -->
        <button type="button" id="revPrev" aria-label="Previous reviews"
          class="rev-nav absolute left-0 sm:-left-2 lg:-left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white text-ink-900 shadow-diffuse-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button type="button" id="revNext" aria-label="More reviews"
          class="rev-nav absolute right-0 sm:-right-2 lg:-right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white text-ink-900 shadow-diffuse-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      <div id="revDots" class="flex justify-center items-center gap-2 mt-6 sm:mt-7 lg:mt-8"></div>

      <div class="rv flex flex-wrap items-center gap-5 sm:gap-8 mt-8 sm:mt-10 lg:mt-12">
        <p class="${BODY} text-white/50">Approved source pool: ${S.s10.pool}</p>
        <div class="sm:ml-auto">${btn(S.s10.cta, S.s10.ctaHref, 'onDark')}</div>
      </div>
    </div>
  </section>`;

const section11 = () => `
  <!-- ================= 11 · PRICING PREVIEW =================
       v1's card architecture with the four-period switcher from the pricing page.
       The header copy is the brief's; the numbers are not — see the note on PLANS. -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-ink-50 overflow-hidden">
    <div class="orb w-[520px] h-[520px] bg-teal-500/8 right-[-140px] top-10"></div>
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv text-center max-w-[560px] mx-auto mb-8 sm:mb-10 lg:mb-12">
        ${eyebrow('One-time plans')}
        <h2 class="${H2} mb-4 lg:mb-5">${S.s11.h2}</h2>
        <p class="${LEAD} text-ink-600">${S.s11.intro}</p>
      </div>

      <div class="rv flex justify-center mb-8 sm:mb-10 lg:mb-12">
        <div class="inline-flex items-center rounded-full bg-ink-100 p-1 max-w-full overflow-x-auto" id="periodTabs">
          ${[['onetime','One-time'],['monthly','Monthly'],['quarterly','3-Months'],['yearly','Yearly']]
            .map(([k, label]) => `<button type="button" data-period="${k}" class="period-btn whitespace-nowrap rounded-full px-3.5 sm:px-5 lg:px-6 py-2.5 text-[13px] sm:text-[14px] font-semibold text-ink-500">${label}</button>`)
            .join('\n          ')}
        </div>
      </div>

      <div class="rv grid lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-center max-w-[1180px] mx-auto mb-8 sm:mb-10 lg:mb-12">
        ${['light','standard','premium'].map(tier => {
          const dark = tier === 'standard';
          return `<div data-tier="${tier}" class="${dark
            ? 'relative rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-ink-950 text-white ring-1 ring-white/10 shadow-diffuse-lg p-5 sm:p-6 lg:p-8 lg:-my-6 overflow-hidden'
            : 'rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7'}">
          ${dark ? '<div class="orb w-[300px] h-[300px] bg-orange-500/15 -right-20 -top-24"></div>' : ''}
          <div class="relative">
            <div class="flex items-center justify-between gap-3 mb-1.5">
              <span class="text-[11px] font-bold tracking-[0.16em] uppercase ${dark ? 'text-teal-300' : 'text-orange-600'}">${tier}</span>
              ${dark ? `<span class="flex items-center gap-1.5 text-[9.5px] font-bold tracking-widest bg-orange-500 rounded-full px-2.5 py-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I.sparkles}</svg>
                MOST POPULAR
              </span>` : ''}
            </div>
            <div class="text-[13.5px] ${dark ? 'text-white/50' : 'text-ink-500'} mb-4 sm:mb-5 lg:mb-6">${TAGLINE[tier]}</div>
            <div class="flex items-end gap-1.5 mb-3">
              <span class="text-[29px] sm:text-[34px] lg:text-[40px] font-extrabold tracking-tightest leading-none nums js-price"></span>
              <span class="text-[12.5px] font-medium ${dark ? 'text-white/40' : 'text-ink-400'} pb-1.5 js-term"></span>
            </div>
            <div class="inline-flex items-center rounded-full ${dark ? 'bg-white/10 text-white/70' : 'bg-ink-50 text-ink-500'} px-3 py-1 text-[11.5px] font-bold nums mb-5 sm:mb-6 lg:mb-7"><span class="js-rate"></span>&nbsp;/ 1,000 words</div>
            <div class="h-px ${dark ? 'bg-white/10' : 'bg-ink-100'} mb-5 sm:mb-6 lg:mb-7"></div>
            <ul class="space-y-3.5 text-[13.5px] font-medium ${dark ? 'text-white/80' : 'text-ink-700'} min-h-[9rem] mb-6 sm:mb-7 lg:mb-8 js-feats"></ul>
            <a href="${S.s11.ctaHref}" class="btn-press block text-center rounded-full ${dark
              ? 'bg-white text-ink-900 hover:bg-ink-50'
              : 'ring-1 ring-ink-200 text-ink-900 hover:bg-ink-50'} text-[13.5px] sm:text-[14.5px] font-semibold py-3 sm:py-3.5 transition-colors duration-300">Start ${LABEL[tier]}</a>
          </div>
        </div>`;
        }).join('\n        ')}
      </div>

      <!-- The brief calls this the primary CTA; Olex asked for it as a quiet text link,
           since each card now carries its own button. The label and destination are the
           brief's, only the weight changed. -->
      <div class="rv flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12.5px] sm:text-[13px] font-medium">
        <span class="text-ink-400" id="periodNote"></span>
        <span class="hidden sm:block w-1 h-1 rounded-full bg-ink-300"></span>
        <a href="${S.s11.ctaHref}" class="font-semibold text-ink-700 underline decoration-ink-300 underline-offset-4 hover:text-ink-900 hover:decoration-ink-500 transition-colors duration-300">${S.s11.cta}</a>
      </div>
    </div>
  </section>`;

const section12 = () => `
  <!-- ================= 12 · FAQ ================= -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <!-- Heading left, questions right: a long accordion under a centred heading pushes
           the last question a screen and a half from its own title. The left column sticks,
           so the section keeps its name in view while you read down the list. -->
      <div class="grid lg:grid-cols-[380px_1fr] gap-10 sm:gap-12 lg:gap-14 items-start">
      <div class="rv lg:sticky lg:top-32">
        ${eyebrow('Questions')}
        <h2 class="${H2}">${S.s12.h2}</h2>
      </div>

      <!-- every answer is in the rendered HTML, not fetched on click -->
      <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse" id="faqList">
        <div class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl divide-y divide-ink-100 overflow-hidden">
          ${S.s12.items.map(([q, a], i) => `<div class="faq-item${i === 0 ? ' open' : ''}">
            <button type="button" class="faq-q w-full flex items-center justify-between gap-4 sm:gap-5 lg:gap-6 text-left px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6">
              <span class="text-[15.5px] font-semibold tracking-tight">${q}</span>
              <span class="faq-chev shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </button>
            <div class="faq-a"><div><p class="px-4 sm:px-5 lg:px-6 pb-5 sm:pb-6 lg:pb-7 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[72ch]">${a}</p></div></div>
          </div>`).join('\n          ')}
        </div>
      </div>
      </div>
    </div>
  </section>`;

const section13 = () => `
  <!-- ================= 13 · FINAL CTA =================
       Built on v1's closing act: the tinted wash the hero opens on, two soft orbs,
       a pill with a pulsing dot, an oversized heading and the word ringed rather
       than underlined. The page opens and closes on the same colour.

       What did not come across from v1: its second button (talk to sales) and its
       trust strip (G2 Leader, Trustpilot 4.7, Capterra 4.8, 7-day money-back). The
       brief supplies neither, and the ratings are dynamic fields besides.

       Sends you back to the real checker in section 1; no second form is rendered. -->
  <section id="cta" class="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div id="ctaGlowWarm" class="orb"></div>
      <div id="ctaGlowCool" class="orb"></div>
    </div>
    <div class="relative max-w-[880px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
      <div class="rv inline-flex items-center gap-2 rounded-full bg-white/70 ring-1 ring-black/5 backdrop-blur px-3.5 py-1.5 mb-6 sm:mb-7 lg:mb-8">
        <span class="w-1.5 h-1.5 rounded-full bg-orange-500 pulse-dot"></span>
        <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">Free check</span>
      </div>
      <h2 class="rv text-[clamp(2.4rem,5.5vw,4.35rem)] font-extrabold tracking-tightest leading-[1.02] mb-5 sm:mb-6 lg:mb-7">Check your text for ${ring('plagiarism')}</h2>
      <p class="rv ${LEAD} text-ink-600 max-w-[52ch] mx-auto mb-8 sm:mb-10 lg:mb-11">${S.s13.support}</p>
      <div class="rv flex justify-center mb-6 sm:mb-7">
        <a href="#checker" class="btn-press group flex items-center gap-3 rounded-full h-13 sm:h-15 bg-ink-900 hover:bg-ink-800 text-white text-[15px] sm:text-[16px] font-semibold pl-6 sm:pl-7 lg:pl-8 pr-2.5 py-3.5 transition-colors duration-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F58971" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I.sparkles}</svg>
          ${S.s13.cta}
          <span class="icon-orb w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
      <p class="rv text-[13.5px] sm:text-[14.5px] font-semibold text-ink-700">${S.s13.free}</p>
    </div>
  </section>`;

/* ── behaviour ───────────────────────────────────────────────────────────── */
const SCRIPT = `
<script>
(() => {
  'use strict';

  /* word counter — the free allowance is 150 words, so the count is the useful readout */
  /* the free allowance is 150 words, so the count is the useful readout */
  [['checkText', 'wordCount']].forEach(pair => {
    const ta = document.getElementById(pair[0]), wc = document.getElementById(pair[1]);
    if (!ta || !wc) return;
    ta.addEventListener('input', () => {
      const w = ta.value.trim() ? ta.value.trim().split(/\\s+/).length : 0;
      wc.textContent = w;
      wc.style.color = w > 150 ? '#B84431' : '';
    });
  });

  /* switches: the visual state follows the real checkbox, so the control stays a control */
  document.querySelectorAll('.sw[data-for]').forEach(sw => {
    const input = document.getElementById(sw.dataset.for);
    if (!input) return;
    input.addEventListener('change', () => sw.classList.toggle('on', input.checked));
  });

  /* report: selecting a highlighted passage opens its source and context */
  const hls = [...document.querySelectorAll('.hl')];
  const panels = [...document.querySelectorAll('.match-panel')];
  const show = i => {
    hls.forEach(h => h.classList.toggle('on', h.dataset.match === String(i)));
    panels.forEach(p => p.classList.toggle('on', p.dataset.panel === String(i)));
  };
  hls.forEach(h => {
    h.addEventListener('click', () => show(h.dataset.match));
    h.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(h.dataset.match); }
    });
  });
  if (hls.length) show(0);

  /* Pricing periods. The data object is inlined below rather than fetched: this whole
     section becomes a widget later, and until then the numbers only have to look right. */
  const PLANS = {
    "onetime": {
      "note": "One payment · packages never expire",
      "term": "/ one-time",
      "light": {
        "price": "$9.95",
        "rate": "$1.00",
        "feats": [
          "1 plagiarism check",
          "1 AI check",
          "No expiry"
        ]
      },
      "standard": {
        "price": "$17.95",
        "rate": "$0.90",
        "feats": [
          "10 plagiarism checks",
          "10 AI checks",
          "No expiry"
        ]
      },
      "premium": {
        "price": "$41.95",
        "rate": "$0.42",
        "feats": [
          "50 plagiarism checks",
          "50 AI checks",
          "No expiry"
        ]
      }
    },
    "monthly": {
      "note": "Recurring billing · cancel anytime",
      "term": "/ month",
      "light": {
        "price": "$22.95",
        "rate": "$0.23",
        "feats": [
          "100 plagiarism checks",
          "30-day validity"
        ]
      },
      "standard": {
        "price": "$34.95",
        "rate": "$0.12",
        "feats": [
          "300 plagiarism checks",
          "API access",
          "Report storage",
          "30-day validity"
        ]
      },
      "premium": {
        "price": "$54.95",
        "rate": "$0.09",
        "feats": [
          "300 plagiarism checks",
          "300 AI checks",
          "API access",
          "Report storage",
          "30-day validity"
        ]
      }
    },
    "quarterly": {
      "note": "Recurring billing every 3 months · cancel anytime",
      "term": "/ 3 months",
      "light": {
        "price": "$34.95",
        "rate": "$0.17",
        "feats": [
          "100 plagiarism checks",
          "100 AI checks",
          "90-day validity"
        ]
      },
      "standard": {
        "price": "$64.95",
        "rate": "$0.10",
        "feats": [
          "300 plagiarism checks",
          "300 AI checks",
          "API access",
          "Report storage",
          "90-day validity"
        ]
      },
      "premium": {
        "price": "$89.95",
        "rate": "$0.07",
        "feats": [
          "500 plagiarism checks",
          "500 AI checks",
          "API access",
          "Report storage",
          "90-day validity"
        ]
      }
    },
    "yearly": {
      "note": "Recurring billing yearly · best per-word rate",
      "term": "/ year",
      "light": {
        "price": "$114.95",
        "rate": "$0.11",
        "feats": [
          "1,000 plagiarism checks",
          "365-day validity"
        ]
      },
      "standard": {
        "price": "$174.95",
        "rate": "$0.06",
        "feats": [
          "3,000 plagiarism checks",
          "API access",
          "Report storage",
          "365-day validity"
        ]
      },
      "premium": {
        "price": "$259.95",
        "rate": "$0.04",
        "feats": [
          "3,000 plagiarism checks",
          "3,000 AI checks",
          "API access",
          "Report storage",
          "365-day validity"
        ]
      }
    }
  };

  const tabs = [...document.querySelectorAll("#periodTabs .period-btn")];
  const cards = [...document.querySelectorAll("[data-tier]")];
  const periodNote = document.getElementById("periodNote");
  /* concatenated rather than interpolated: this whole script is itself a template
     literal in build/home-v2.js, so a backtick here would end it early */
  const tick = c => '<svg class="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="' + c + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

  if (tabs.length && cards.length) {
    const render = (key, animate) => {
      const period = PLANS[key];
      periodNote.textContent = period.note;
      cards.forEach(card => {
        const tier = period[card.dataset.tier];
        const dark = card.dataset.tier === "standard";
        const feats = card.querySelector(".js-feats");
        /* values first, motion second — a price must never wait on an animation frame */
        card.querySelector(".js-price").textContent = tier.price;
        card.querySelector(".js-term").textContent = period.term;
        card.querySelector(".js-rate").textContent = tier.rate;
        feats.innerHTML = tier.feats
          .map(f => '<li class="flex gap-3">' + tick(dark ? "#6ED7E8" : "#2AA46C") + f + '</li>')
          .join("");
        if (animate && window.gsap && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
          gsap.fromTo([card.querySelector(".js-price"), card.querySelector(".js-rate"), feats],
            { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .28, ease: "power2.out", overwrite: "auto" });
        }
      });
      tabs.forEach(b => b.classList.toggle("active", b.dataset.period === key));
    };
    tabs.forEach(b => b.addEventListener("click", () => render(b.dataset.period, true)));
    /* one-time leads: it is the mode the brief puts on the homepage */
    render("onetime", false);
  }

  /* Reviews carousel. Pages are measured, not assumed: the card count is not ours to
     fix, and the number visible changes with the breakpoint. */
  const track = document.getElementById("revTrack");
  const dots = document.getElementById("revDots");
  if (track && dots) {
    const prev = document.getElementById("revPrev");
    const next = document.getElementById("revNext");
    const pages = () => Math.max(1, Math.round(track.scrollWidth / track.clientWidth));
    const page = () => Math.round(track.scrollLeft / track.clientWidth);

    const build = () => {
      const n = pages();
      const scrollable = track.scrollWidth > track.clientWidth + 1;
      prev.hidden = next.hidden = !scrollable;
      dots.innerHTML = scrollable
        ? Array.from({ length: n }, (_, i) =>
            '<button type="button" class="rev-dot' + (i === page() ? ' on' : '') +
            '" data-page="' + i + '" aria-label="Reviews page ' + (i + 1) + '"></button>').join("")
        : "";
    };

    const mark = () => {
      const cur = page();
      [...dots.children].forEach((d, i) => d.classList.toggle("on", i === cur));
    };

    const go = dir => track.scrollBy({ left: dir * track.clientWidth, behavior: "smooth" });
    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    dots.addEventListener("click", e => {
      const b = e.target.closest(".rev-dot");
      if (b) track.scrollTo({ left: b.dataset.page * track.clientWidth, behavior: "smooth" });
    });
    track.addEventListener("scroll", mark, { passive: true });
    addEventListener("resize", build);
    build();
  }

  /* FAQ: answers are already in the DOM; this only opens and closes them */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(x => x.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
})();
</script>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Assemble
   ───────────────────────────────────────────────────────────────────────────── */
const donor = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
let head = donor.slice(0, donor.indexOf('<body'));
head = head
  .replace(/<title>[\s\S]*?<\/title>/, '<title>' + COPY.title + '</title>')
  .replace(/<meta name="description"[^>]*>/, '<meta name="description" content="' + COPY.meta + '" />');
if (!/name="description"/.test(head)) {
  head = head.replace('<title>', '<meta name="description" content="' + COPY.meta + '" />\n<title>');
}
const bodyTag = donor.slice(donor.indexOf('<body'), donor.indexOf('>', donor.indexOf('<body')) + 1);

/* twelve, not thirteen: the integrations rail folded into the report act */
const sections = [section1, section2, section4, section5, section6, section7,
                  section8, section9, section10, section11, section12, section13];

/* The reveal and burger behaviours are written out here rather than sliced out of
   index.html. An earlier version scraped them by string search and produced a page with
   three broken <script> tags and an invisible checker form — cutting someone else's
   script out by indexOf is a trick that works until it silently doesn't. */
const revealBlock = `<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script>
(() => {
  'use strict';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.gsap) { document.documentElement.classList.add('no-motion'); return; }

  gsap.registerPlugin(ScrollTrigger);

  const rvs = gsap.utils.toArray('.rv');
  const inView = rvs.filter(el => el.getBoundingClientRect().top < innerHeight * .9);

  // first viewport: top-down cascade on load
  inView.forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      delay: .1 + (el.getBoundingClientRect().top / innerHeight) * .3 });
  });
  // the rest reveal as they reach mid-screen
  rvs.filter(el => !inView.includes(el)).forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 70%' } });
  });

  /* ring marks — the closing act loops a word instead of underlining it. Same trick,
     longer path, and it waits until the word is well inside the viewport. */
  gsap.utils.toArray('.ring-word').forEach(word => {
    const path = word.querySelector('.ring-path');
    if (!path) return;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.timeline({ scrollTrigger: { trigger: word, start: 'top 75%', once: true } })
      .to(word, { color: '#DC5A45', duration: .4, ease: 'power2.out' })
      .set(path, { opacity: 1 }, .15)
      .to(path, { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut' }, .15);
  });

  /* pen marks — the word takes the accent colour, then its underline draws itself.
     Without this the underline stays at opacity 0 forever, since the path ships hidden. */
  gsap.utils.toArray('.pen-word').forEach(word => {
    const line = word.querySelector('.pen-underline');
    if (!line) return;
    const len = line.getTotalLength();
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    const inFirstView = word.getBoundingClientRect().top < innerHeight * .9;
    const tl = gsap.timeline(inFirstView
      ? { delay: 1 }
      : { scrollTrigger: { trigger: word, start: 'top 80%', once: true } });
    tl.to(word, { color: '#DC5A45', duration: .45, ease: 'power2.out' })
      .set(line, { opacity: 1 }, .35)
      .to(line, { strokeDashoffset: 0, duration: .7, ease: 'power2.inOut' }, .35);
  });
})();
</script>`;

const navScript = `<script>
(() => {
  'use strict';
  const btn = document.getElementById('navBurger');
  const panel = document.getElementById('navPanel');
  if (!btn || !panel) return;

  const setOpen = on => {
    btn.setAttribute('aria-expanded', String(on));
    panel.classList.toggle('open', on);
    btn.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
  };

  btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });
  // the desktop menu takes over at lg — never leave the panel hanging open across it
  addEventListener('resize', () => { if (innerWidth >= 1024) setOpen(false); });
})();
</script>`;

const html = head + STYLE + '\n' + bodyTag + `
<div class="grain"></div>

<header></header>

<main>
${sections.map(f => f()).join('\n')}
</main>

<footer></footer>

${revealBlock}
${navScript}
${SCRIPT}
</body>
</html>
`;

fs.writeFileSync(path.join(SITE, OUT), html);

const h1s = (html.match(/<h1\b/g) || []).length;
const h2s = (html.match(/<h2\b/g) || []).length;
const secs = (html.match(/<section\b/g) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + secs + ' sections, ' + h1s + ' h1, ' + h2s + ' h2');
