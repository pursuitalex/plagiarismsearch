/* The controlled preview of a long text in a card — one pattern for every card that
   prints its text whole: the review cards (Reviews v1's cards, the Trustpilot wall of
   v2, the Trustpilot feedback blocks of the tool pages) and the Newsroom's archive items.

   Secondary Pages Design Correction Pack, 2026-10-06: a real feed may return far longer
   text than the page was drawn with, and one such review or update must not distort a
   grid, a wall or an archive. So the text sits in a box of a set height; when it is
   longer, the box fades out at its foot and a quiet button opens the text in place (and
   closes it again). What stands around the text — author, title, rating, date, the
   item's own link — is outside the box and never moves.

     const { clip } = require('./review-clip');
     clip(paragraphsHtml, '              ')   // the <p>s, already indented one step deeper
     clip(html, pad, { cls: 'rc-news', more: 'Read update' })   // another height, another word

   The whole text is always in the HTML. The cap is CSS under html.js only
   (build/assets/css/28-testimonials.css, .rc: about nine lines of a review; a modifier
   class sets another height — .rc-news in 27-news.css), and the button stays hidden until
   site.js (module review-clip, build/assets/js/48-review-clip.js) has measured a text
   that is really longer — one that would hide a line or two is simply shown whole.
   The running SmartCustomer rows do not use this: their cards have one height and their
   own popup (.sc-clip). */
const MORE = 'Read more', LESS = 'Show less';

const clip = (paras, pad = '', o = {}) => [
  `${pad}<div class="rc${o.cls ? ' ' + o.cls : ''}" data-review-clip>`,
  `${pad}  <div class="rc-text">`,
  paras,
  `${pad}  </div>`,
  `${pad}  <button type="button" class="rc-more" data-review-more data-more="${o.more || MORE}" data-less="${o.less || LESS}" aria-expanded="false" hidden>${o.more || MORE}</button>`,
  `${pad}</div>`,
].join('\n');

module.exports = { clip, MORE, LESS };
