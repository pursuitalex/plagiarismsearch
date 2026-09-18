/* Reviews — the data and the card, one copy for every page that shows them.

   Lifted out of build/home-v2.js on 2026-09-18, when the Ukrainian checker page needed
   the same verified reviews: a second transcription of a real person's words is how a
   quote drifts. The homepage renders through this module, byte for byte what it rendered
   before. The carousel that pages them stays with the homepage; a page may lay the cards
   out however it likes.

     const { REVIEWS, SOURCES, reviewCard, stars } = require('./reviews');
     reviewCard(REVIEWS[0], false)   // light skin; true for the dark rail
*/
const CARD = 'rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7';
const CARD_DARK = 'rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white/[.06] ring-1 ring-white/10 p-5 sm:p-6 lg:p-7';
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

/* One card, two skins. Everything a review can carry is optional, so a card with only
   a quote still renders and a card with mark, rating, count and author renders more. */
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

const reviewCard = (r, dark) => {
  const src = SOURCES[r.source];
  const muted = dark ? 'text-white/45' : 'text-ink-400';
  return `<figure class="${dark ? CARD_DARK : CARD} flex flex-col h-full w-full">
            <div class="flex items-center gap-2.5 mb-5">
              ${src.mark
                ? `<img src="${src.mark}" alt="" aria-hidden="true" class="w-5 h-5 shrink-0">`
                : ''}
              <span class="text-[11px] sm:text-[11.5px] font-semibold ${dark ? 'text-white/60' : 'text-ink-500'}">${src.name}</span>
              ${r.rating != null ? `<span class="ml-auto flex items-center gap-2">${stars(r.rating, dark)}<span class="text-[12px] font-bold nums ${dark ? 'text-white' : 'text-ink-900'}">${r.rating.toFixed(1)}</span></span>` : ''}
            </div>

            <blockquote class="flex-1 text-[14.5px] sm:text-[15.5px] leading-relaxed ${dark ? 'text-white/85' : 'text-ink-800'} mb-5">${r.quote}</blockquote>

            <figcaption class="flex items-center justify-between gap-3 pt-4 border-t ${dark ? 'border-white/10' : 'border-ink-100'}">
              <span class="text-[12.5px] sm:text-[13px] font-semibold ${dark ? 'text-white/70' : 'text-ink-700'}">${r.author}</span>
              ${src.url ? `<a href="${src.url}" rel="nofollow noopener" class="text-[11.5px] font-semibold ${muted} hover:${dark ? 'text-white' : 'text-ink-900'} underline decoration-current/30 underline-offset-4 transition-colors duration-300">Read on ${src.name.split(' ')[0]}</a>` : ''}
            </figcaption>
          </figure>`;
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

module.exports = { REVIEWS, SOURCES, reviewCard, stars };
