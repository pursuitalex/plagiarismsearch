/* The Section Library registry — every library component, in catalogue order.

   One entry per component; build/check-library.js (the validator) and
   build/section-library.js (the catalogue) both run this list, so a component that is in
   the library is validated and shown, and nothing else is.

     name       the data-component value and the file stem: build/sections/<name>.js (the
                template), <name>.css, <name>.contract.js, <name>.check.js
     title      what the validator and the catalogue call it
     contract   variants, the classes of each part, allowed inline markup, the editable /
                locked lists the catalogue prints
     check      the validator's rules for it, written from the contract with the shared
                toolkit (build/sections/check-tools.js):
                  validate(root, ctx) → { found: [{ el, kind, count?, note? }], sealed }
                  isPart(node), outside     a part of it found outside a complete one
                  repaired(node)            an id its script renumbers (a copy only warns)
                  mentions(html)            the page filter of the default run
                  SNIPPET, BAD, GOOD        the self-test: edits of a catalogue snippet that
                                            must be rejected, and edits that must pass

   The Section Header (section-head.js / .css) is a primitive hosted by components, not a
   component of its own: each host's check validates the head it holds. */
module.exports = [
  { name: 'faq', title: 'FAQ', contract: require('./faq.contract'), check: require('./faq.check') },
  { name: 'cta-band', title: 'CTA band', contract: require('./cta-band.contract'), check: require('./cta-band.check') },
  { name: 'banner', title: 'Banner', contract: require('./banner.contract'), check: require('./banner.check') },
];
