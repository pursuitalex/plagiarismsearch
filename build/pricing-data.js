/* Plan data for the shared pricing widget — one copy, two pages.

   It lived inside build/home-v2.js until the Pricing page needed the same figures.
   Two generators holding their own price list is the drift the shell builder exists to
   prevent, and prices are the worst possible thing to let drift: a stale number here is
   not a cosmetic bug, it is a wrong price on a purchase page.

   PLACEHOLDER, both pages. DEC-0042 is explicit that plan names, prices, quotas, billing
   periods, validity, entitlements, checkout actions and the Recommended state are all
   backend-driven, and that none of it may be frozen into page copy. This object exists
   so the visual shell has something to render until the developer connects the
   authoritative widget. When that lands, delete this file and the markup that reads it.

   The `note` strings are the homepage's. DEC-0042 forbids them on the Pricing page —
   "Do not add a static subtitle such as Recurring billing · cancel anytime unless that
   exact helper is already returned by the authoritative pricing widget" — so the Pricing
   renderer ignores them and uses only its own approved one-time helper.
*/
/* PLAN DATA — a deliberate departure from DEC-0030, decided by Olex on 2026-08-18. */
/*  */
/* The brief previews one-time plans only, forbids Monthly / 3-Month / Yearly matrices */
/* on the homepage, and forbids hardcoding price or quota values. All three are set */
/* aside here so the block can be evaluated as a design: the whole section becomes a */
/* widget with live integrations later, and these numbers go with it. */
/*  */
/* Lifted verbatim from site/prices.html, which scraped plagiarismsearch.com/prices on */
/* 2026-07-22. Nothing below was invented. When the widget lands, delete this object and */
/* the switcher markup that reads it — nothing else in the section depends on it. */

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
const TAGLINE = { light: 'For occasional checks', standard: 'For regular work', premium: 'For higher-volume checks' };

module.exports = { PLANS, LABEL, TAGLINE };
