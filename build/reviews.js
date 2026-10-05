/* Reviews — the data, one copy for every page that shows them.

   Lifted out of build/home-v2.js on 2026-09-18, when the Ukrainian checker page needed
   the same verified reviews: a second transcription of a real person's words is how a
   quote drifts. The homepage renders through this module, byte for byte what it rendered
   before.

   Since the Section Library's wave 3 the card itself is the library's
   (build/sections/reviews.js: figure.review-card, in a rail or a grid); this file is the
   DATA — the reviews as read off the platforms — and item() hands one to that template:

     const { REVIEWS, item } = require('./reviews');
     reviews.section({ …, items: REVIEWS.map(item) })

   stars() is the earlier utility-markup star strip (its lit width an inline style): the
   Reviews pages (build/testimonials*.js), which are page-specific compositions, still
   draw their platform summaries with it. The library card lights its stars from
   data-rating instead (build/sections/reviews.css).
*/
const I = { star: '<path d="m12 2 2.9 6.26 6.6.83-4.9 4.6 1.3 6.31L12 16.9 6.1 20l1.3-6.31L2.5 9.09l6.6-.83z"/>' };

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
  g2: {
    name: 'G2',
    mark: 'assets/svg/partners/g2.svg',
    url: 'https://www.g2.com/sellers/plagiarismsearch-com',
    rating: null, count: null,
  },
};

/* Half stars matter here: the value is one person's rating, and G2 publishes halves.

   The lit row sits in a box narrowed to the rating and must be CLIPPED by it, never
   fitted to it: as plain flex children the stars shrank to the narrower box instead,
   so four-and-a-half read as five squashed ones drifting off the row beneath. w-max
   on the row and shrink-0 on each star keep the two rows in register.
   Two rows, the lit one clipped to the exact percentage, so 4.5 renders as four and a
   half rather than rounding to a number nobody gave. */
const stars = (value, dark) => {
  const pct = value == null ? 0 : Math.max(0, Math.min(100, (value / 5) * 100));
  const star = '<svg class="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + I.star + '</svg>';
  return `<span class="relative inline-flex shrink-0" role="img" aria-label="${value == null ? 'Rating pending' : value + ' out of 5'}">
            <span class="flex gap-px ${dark ? 'text-white/20' : 'text-ink-200'}">${star.repeat(5)}</span>
            <span class="absolute inset-y-0 left-0 overflow-hidden text-orange-500" style="width:${pct}%"><span class="flex gap-px w-max">${star.repeat(5)}</span></span>
          </span>`;
};

/* Eight reviews, two from each platform, read off the live profiles on 2026-08-20:

     Trustpilot   4.7 / 61 reviews   trustpilot.com/review/plagiarismsearch.com
     G2           4.3 / 13 reviews   g2.com/sellers/plagiarismsearch-com
     SmartCustomer 4.0 / 41 reviews  smartcustomer.com/reviews/plagiarismsearch.com
     Google Workspace Marketplace    the add-on listing's Reviews tab

   Quoted as published, names as the platforms print them. An ellipsis marks where a
   longer review is cut and nothing else is altered — not spelling, not punctuation.
   Reviews carrying a criticism were left out rather than trimmed down to the praise
   inside them, which would misrepresent what the person wrote. Nothing beyond a name
   is asserted: no role, no organisation, no identity the platform did not publish.

   The G2 pair are marked by G2 as invited and incentivised reviews; that disclosure
   lives on their profile, which every card links to. */
const REVIEWS = [
  { source: 'trustpilot',    author: 'Tersia Gouws',
    rating: 5,
    quote: 'Best plagiarism-checker around. User-friendly and ticks all the boxes for me as a writer.' },

  { source: 'g2',            author: 'Verified User in Higher Education',
    rating: 4,
    quote: 'I appreciate the accuracy and speed of the PlagiarismSearch Checker. It provides detailed reports, clearly identifying matched sources, and the user interface is intuitive, making the whole process seamless.' },

  { source: 'smartcustomer', author: 'Maybelle R.',
    rating: 5,
    quote: 'One of the biggest advantages of this plagiarism checker is its ability to analyze documents in different formats. This flexibility has saved me countless hours of converting files or dealing with compatibility issues…' },

  { source: 'marketplace',   author: 'Carmel Smith',
    rating: 5,
    quote: 'It is a modern multifunctional tool that I use not only to check for plagiarism in various written works, but also to identify the generated content.' },

  { source: 'trustpilot',    author: 'Chioma Isaac Asiwaju',
    rating: 5,
    quote: 'PlagiarismSearch is by far the best plagiarism checkers I&rsquo;ve ever seen. And, I&rsquo;ve used quite a number of them. In fact, they are so good I had to subscribe.' },

  { source: 'smartcustomer', author: 'Clarissa C.',
    rating: 5,
    quote: 'I am glad that I decided to use the tool for checking the presence of plagiarism. Thanks to the quick and high-quality review, I sent the edited term paper to my teacher on time.' },

  { source: 'marketplace',   author: 'Madison Lambret',
    rating: 5,
    quote: 'The interface is user-friendly and intuitive, making it easy for even non-tech-savvy individuals to navigate effortlessly. The speed at which it scans and analyzes content is truly remarkable…' },

  { source: 'g2',            author: 'Sukhpreet K.',
    rating: 4.5,
    quote: 'It is very helpful in-depth research for bloggers and content writers. The content quality seems very genuine and authentic.' },
];

/* A review as the Section Library's Reviews template takes it (build/sections/reviews.js):
   the quote, the name and the rating as they stand above, and the platform it was read
   on. The mark's path is root-relative (pages on the shared assets). */
const item = r => {
  const src = SOURCES[r.source];
  return { quote: r.quote, author: r.author, rating: r.rating,
    source: { name: src.name, mark: src.mark ? '/' + src.mark : null, url: src.url, linkLabel: 'Read on ' + src.name.split(' ')[0] } };
};

module.exports = { REVIEWS, SOURCES, stars, item };
