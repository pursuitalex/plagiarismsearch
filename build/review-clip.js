/* The controlled preview of a review's text — one pattern for every review card that
   prints its text whole (Reviews v1's cards, the Trustpilot wall of v2, the Trustpilot
   feedback blocks of the tool pages).

   Secondary Pages Design Correction Pack, 2026-10-06: a real review feed may return far
   longer text than the reviews the page was drawn with, and one such review must not
   distort a grid or a wall. So the text sits in a box of about nine lines; when it is
   longer, the box fades out at its foot and a quiet "Read more" opens the review in
   place ("Show less" closes it). Author, title, rating and source are outside the box
   and never move.

     const { clip } = require('./review-clip');
     clip(paragraphsHtml, '              ')   // the <p>s, already indented one step deeper

   The whole text is always in the HTML. The cap is CSS under html.js only
   (build/assets/css/28-testimonials.css, .rc), and the button stays hidden until
   site.js (module review-clip, build/assets/js/48-review-clip.js) has measured a text
   that is really longer — a review that would hide a line or two is simply shown whole.
   The running SmartCustomer rows do not use this: their cards have one height and their
   own popup (.sc-clip). */
const MORE = 'Read more', LESS = 'Show less';

const clip = (paras, pad = '') => [
  `${pad}<div class="rc" data-review-clip>`,
  `${pad}  <div class="rc-text">`,
  paras,
  `${pad}  </div>`,
  `${pad}  <button type="button" class="rc-more" data-review-more data-more="${MORE}" data-less="${LESS}" aria-expanded="false" hidden>${MORE}</button>`,
  `${pad}</div>`,
].join('\n');

module.exports = { clip, MORE, LESS };
