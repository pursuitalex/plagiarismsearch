/* Banner — library component. One template for the compact dark banner.

   CSS  build/sections/banner.css (compiled into tailwind.css, see section-head.css)
   JS   none of its own
   Contract + validator  build/sections/banner.contract.js, banner.check.js
   Copy-paste catalogue  site/section-library.html (build/section-library.js)

   The site has three dark blocks, and this is the smallest: a block that sits BETWEEN
   sections, says one thing about a capability that lives on another page, and links
   there. The AI Detector page's API block, the University page's AI block, the Pricing
   page's high-volume block are all this. The closing band before the footer is
   build/sections/cta-band.js, and the tall double-bezel card inside a section is the
   dark accent card (DESIGN.md § Card recipes); the three must not be confused. A banner
   between sections is a heading block (DESIGN.md § Support lines), not a smaller act.

   Measured on 2026-09-15: three pages carried three versions of this block, two of them
   identical and one — Pricing — with a bigger heading, a smaller support line and wider
   padding. Nobody chose that; it drifted because the shell lived in each builder. So it
   lives in one template, and the validator holds every page to it.

     const banner = require('./sections/banner');
     banner.section({
       id: 'ai-api',
       glow: 'teal',                       // 'teal' | 'coral' | 'coral-soft' | 'violet'; the pill's dot follows it
       eyebrow: 'API',                     // optional pill
       title: '…',                         // the h2
       lead: '…',  measure: '54',          // the support line and its longest line (default 62)
       pill: '…',                          // optional: the point of the block, raised into a pill
       callout: '…',                       // optional: a caution, boxed, with the info icon
       detail: '…',  detailMeasure: '58',  // optional: the quieter second paragraph (default 60)
       action: { label, href },            // the one action: the white button
       link: { label, href },              // optional quiet link under the button (row only)
       branch: {                           // optional schematic → the split layout
         parent: { label, icon },          //   icon: the inner markup of a 24×24 <svg>
         children: [{ label, icon, tone }, { … }],   // exactly two; tone: 'teal' | 'coral'
       },
     })

   Two layouts, chosen by whether there is a branch: with one, text left and the panel
   right (1.4fr / 1fr), the action under the panel; without one, the action itself takes
   the right-hand slot so the block still reads as two halves.

   Every external href gets rel="noopener". The text is written as given. */
const C = require('./banner.contract');

const GLOWS = C.variants.section['data-glow'].values;
const MEASURES = C.variants.lead['data-measure'].values;
const DETAIL_MEASURES = C.variants.detail['data-measure'].values;
const TONES = { teal: '#5AD3E4', coral: '#F58971' };

const ARROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const INFO = '<svg class="banner-callout-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F58971" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';

const need = (cond, msg) => { if (!cond) throw new Error('banner: ' + msg); };
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
const attr = (name, value) => (value ? ` ${name}="${value}"` : '');
const rel = href => (/^https?:/.test(href) ? ' rel="noopener"' : '');

/* the action on a dark ground: the white button */
const button = a => {
  need(a && a.label && a.href, 'action: { label, href } is required');
  return `<a href="${a.href}"${rel(a.href)} class="banner-button btn-press group">
  ${a.label}
  <span class="banner-button-orb icon-orb">${ARROW}</span>
</a>`;
};

const eyebrow = label => `<div class="section-eyebrow">
  <span class="section-eyebrow-dot"></span>
  <span class="section-eyebrow-label">${label}</span>
</div>`;

/* the schematic: one parent, two children joined to it by a drawn bracket */
function branch(b) {
  need(b.parent && b.parent.label && b.parent.icon, 'branch.parent: { label, icon }');
  need(Array.isArray(b.children) && b.children.length === 2, 'branch.children: exactly two');
  const child = c => {
    need(c.label && c.icon && TONES[c.tone], 'branch child: { label, icon, tone: teal | coral }');
    return `<div class="banner-branch-child">
  <span class="banner-branch-line"></span>
  <span class="banner-branch-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${TONES[c.tone]}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${c.icon}</svg></span>
  <span class="banner-branch-label">${c.label}</span>
</div>`;
  };
  return `<div class="banner-branch" aria-hidden="true">
  <p class="banner-branch-parent">
    <svg class="banner-branch-parent-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${b.parent.icon}</svg>
    ${b.parent.label}
  </p>
  <div class="banner-branch-children">
${indent(b.children.map(child).join('\n'), '    ')}
  </div>
</div>`;
}

function section(o) {
  need(o && o.title && o.lead, 'title and lead are required');
  need(GLOWS.includes(o.glow), 'glow must be one of ' + GLOWS.join(', '));
  need(o.measure === undefined || MEASURES.includes(String(o.measure)), 'measure must be one of ' + MEASURES.join(', '));
  need(o.detailMeasure === undefined || (o.detail && DETAIL_MEASURES.includes(String(o.detailMeasure))), 'detailMeasure (with a detail) must be one of ' + DETAIL_MEASURES.join(', '));
  need(!(o.branch && o.link), 'the quiet link goes with the row layout (no branch)');
  const text = [];
  if (o.eyebrow) text.push(eyebrow(o.eyebrow));
  text.push(`<h2 class="banner-title">${o.title}</h2>`);
  text.push(`<p class="banner-lead"${attr('data-measure', o.measure)}>${o.lead}</p>`);
  if (o.pill) text.push(`<p class="banner-pill">\n  <span class="banner-pill-dot"></span>${o.pill}\n</p>`);
  if (o.callout) text.push(`<p class="banner-callout">\n  ${INFO}\n  ${o.callout}\n</p>`);
  if (o.detail) text.push(`<p class="banner-detail"${attr('data-measure', o.detailMeasure)}>${o.detail}</p>`);
  const act = o.link
    ? `<div class="banner-action"><div class="banner-actions">${button(o.action)}<a href="${o.link.href}"${rel(o.link.href)} class="banner-link">${o.link.label}</a></div></div>`
    : `<div class="banner-action">${button(o.action)}</div>`;
  const right = o.branch
    ? `<div class="banner-aside">
${indent(branch(o.branch), '  ')}
${indent(act, '  ')}
</div>`
    : act;
  return `<section${attr('id', o.id)} data-component="banner" class="banner" data-glow="${o.glow}"${o.branch ? ' data-layout="split"' : ''}>
  <div class="banner-inner">
    <div class="banner-box rv" data-surface="dark">
      <div class="orb banner-glow"></div>
      <div class="banner-grid">
        <div class="banner-text">
${indent(text.join('\n'), '          ')}
        </div>
${indent(right, '        ')}
      </div>
    </div>
  </div>
</section>`;
}

module.exports = { section, button };
