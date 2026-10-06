# PlagiarismSearch — Secondary Pages Design Correction Pack for Claude

**Date:** October 6, 2026  
**Scope:** Design-only correction pass for secondary / auto-designed pages  
**Important:** Content copy, product claims, routing, live data, and final text cleanup will be handled later on staging unless explicitly stated below.

---

## Global rules

This is **not a redesign round**.

The current PlagiarismSearch design system and **Section Library V1 remain approved and frozen**.

For this pass:

- apply only the targeted design corrections listed below;
- do not rewrite page copy unless required to make a listed design change work;
- do not perform new product research;
- do not create new visual languages or parallel component systems;
- reuse existing approved components and patterns wherever possible;
- do not normalize unrelated spacing, radii, colors, typography, or section structures;
- do not modify pages listed under **Approved — no Claude changes**;
- keep desktop, tablet, and mobile behavior scalable for real production content.

Where the same UX problem appears across several page types, solve it with **one reusable pattern**, not separate page-specific variants.

---

# 1. `/user-manuals`

## Status

**DESIGN APPROVED WITH 1 TARGETED CORRECTION**

The current 2×2 category-card layout is approved.

### CHANGE — make article lists scalable inside category cards

The number of User Guide articles inside each category will grow over time.

Keep:

- the current card dimensions;
- the 2×2 desktop grid;
- icon area;
- category title;
- article count;
- current visual language.

Change only the article-list area:

- when the list exceeds the available card height, only the **article list inside the card** should become vertically scrollable;
- the icon/header/category title/article count should remain fixed;
- do **not** make the whole card scroll;
- use a subtle but discoverable scrollbar and/or bottom fade so users understand that more items are available;
- the scrollbar should appear only when needed;
- on touch devices, the inner list must remain usable without creating an awkward conflict with page scrolling.

Do not replace this behavior with a required `View all` page unless a future product decision explicitly asks for it.

---

# 2. Shared Long-form Content Template

## Applies to

- User Guide / documentation article pages;
- Blog article pages;
- Legal pages such as Privacy Policy, Terms of Use, Cookie Policy, and similar long-form legal documents.

## Status

**DESIGN APPROVED WITH 1 SHARED STRUCTURAL IMPROVEMENT**

Do **not** create separate TOC/navigation systems for docs, blog articles, and legal pages.

### CHANGE — one reusable scalable `On this page` / TOC pattern

Create one shared long-form navigation behavior.

For long pages on desktop:

- allow the `On this page` navigation to work as a sticky side TOC while the user scrolls the document;
- keep the reading column at its current comfortable width;
- lightly highlight the current section if practical;
- if the TOC is taller than the viewport, allow the TOC itself to scroll within a sensible max-height.

For short pages:

- do not force a sticky sidebar when it is unnecessary;
- the compact current top-of-page TOC treatment can remain.

For tablet/mobile:

- do not use a persistent sticky sidebar;
- use the compact top-of-page TOC, preferably collapsible when the section list is long.

Important:

- this must be **one reusable pattern across all long-form templates**;
- do not create separate `legal TOC`, `blog TOC`, and `docs TOC` components;
- do not change the core reading-width, typography, or document structure.

---

# 3. Blog article template

## Status

**DESIGN APPROVED WITH 1 PAGE-SPECIFIC CORRECTION + SHARED LONG-FORM TOC**

The shared TOC behavior above applies here.

### CHANGE — avoid repeating the H1 inside the hero image

The article template should not automatically use a card thumbnail as the article hero if that thumbnail contains the same large article title that is already shown as the page H1.

For new articles:

- support a clean hero asset without a large duplicated embedded headline; or
- support a separate article-hero image from the archive/card thumbnail.

Do not redesign the article header.

Keep:

- H1;
- author/date/read-time metadata;
- current reading width;
- inline tables;
- pull quotes;
- info callouts;
- author bio;
- `Keep reading` section.

---

# 4. `/newsroom`

## Status

**DESIGN APPROVED WITH 2 TARGETED CORRECTIONS**

### CHANGE 1 — control archive preview length

The archive should remain an index of updates, not become a stream of almost full articles.

Keep the current archive-card design, date/category/title structure, and year grouping.

For archive items:

- limit body copy to a controlled preview length / max-height;
- long paragraphs, numbered steps, and long lists should not expand a card indefinitely;
- provide a clear `Read update` / `Read more` action when more content exists;
- individual cards do not need pixel-identical heights, but a single long update must not dominate the archive.

### CHANGE 2 — make category filters scalable

The category-filter system must support more categories over time.

Desktop:

- current wrapping behavior can remain while it stays clean.

Tablet/mobile:

- use a horizontally scrollable chip row rather than allowing categories to expand into many stacked rows;
- active state must remain clear.

Do not create a separate filter component if the Blog index can use the same responsive filter behavior.

---

# 5. `/blog` index

## Status

**DESIGN APPROVED WITH 2 TARGETED CORRECTIONS**

### CHANGE 1 — scalable category filters

Use the same responsive category-filter behavior as Newsroom.

- desktop wrapping may remain;
- tablet/mobile should use a horizontal scrollable chip row;
- active category must remain visually clear;
- future category growth must not multiply the height of the Blog hero.

### CHANGE 2 — make archive cards resilient to long titles

Keep the current card design and image aspect ratio.

For archive cards:

- constrain very long article titles to a controlled number of lines;
- prevent one long headline from stretching a card far beyond neighboring cards;
- keep metadata and author/date treatment stable.

Do not force every card to an identical height if the current grid can remain visually balanced.

---

# 6. Mission & Values page

## Status

**DESIGN APPROVED WITH 1 TARGETED CORRECTION**

### CHANGE — remove the stacked double-CTA ending

The current lower part of the page has two large conversion sections in sequence:

1. the dark brochure/service block;
2. the `Start with the free check` closing CTA.

Do not keep two large primary CTA sections back-to-back.

Preferred solution:

- remove the large dark brochure block from this page; or
- demote brochure/contact access to a quiet secondary link within the preceding content.

Keep the lighter `Start with the free check` section as the primary closing CTA.

Do not introduce a replacement large section.

Keep the rest of the page architecture unchanged.

---

# 7. Testimonials / Reviews page

## Status

**DESIGN APPROVED WITH 1 TARGETED RESILIENCE CORRECTION**

### KEEP — current SmartCustomer carousel behavior

The current auto-scroll / carousel treatment is approved.

Do **not** redesign it and do not add new controls merely for the sake of changing the interaction.

### CHANGE — make review cards resilient to unusually long review text

Real review feeds may return much longer text than the demo examples.

Across review-card patterns:

- keep author, title, rating, and source information stable;
- use a controlled preview for unusually long review text;
- allow a `Read more` / expand treatment where needed;
- do not allow one extremely long review to distort an entire carousel/grid section.

Do not redesign the Trustpilot masonry, video testimonials, or current SmartCustomer stream.

---

# 8. `/contact-us`

## Status

**DESIGN APPROVED WITH 1 TARGETED CORRECTION**

### CHANGE — reduce duplicated contact-channel UI in the Hero

The page currently repeats the same contact channels in:

1. the Hero;
2. the `Pick whichever suits you` section immediately below.

Simplify only the left side of the Hero.

Keep:

- `Contact Us` H1;
- short intro;
- support availability indicator;
- inquiry form on the right.

Remove or significantly reduce the detailed `Technical Support` and `Services & Billing` cards from the Hero.

The full channel selection should remain in the dedicated `Pick whichever suits you` section.

Do not redesign the form or the lower contact sections.

---

# 9. `/scholarship`

## Status

**DESIGN APPROVED WITH 1 TARGETED CORRECTION**

### CHANGE — remove/demote the mid-page dark application block

The current page has a large dark `Apply for Scholarship` section well before the actual Application Form.

This creates a second visual application destination and interrupts the informational flow.

Preferred solution:

- remove the large dark block entirely; or
- reduce it to a lightweight transition if needed.

Do not use generic product-proof cards such as `500,000 Clients` as the main visual content of this scholarship-specific transition.

Keep the actual Application Form near the end of the page as the **single primary application destination**.

The intended information flow should remain:

Opportunity → quick facts → explanation → eligibility/terms → rules/process → requirements/topics → FAQ → Application Form.

Do not redesign the Hero, eligibility cards, numbered rules/process section, FAQ, or final form.

---

# Approved — no Claude design changes

The following reviewed pages are approved as designed in this batch and should not be changed by Claude.

## `/help-center`

**DESIGN APPROVED**

No Claude design corrections.

Copy cleanup will be handled later on staging.

Keep the current:

- Hero/search structure;
- four resource cards;
- explanatory section;
- dark support block;
- bottom checker CTA;
- overall section rhythm.

## `/vip` / VIP High-volume page

**DESIGN APPROVED**

No Claude design corrections.

Keep the current:

- Hero;
- feature/benefit cards;
- repository/product UI proof;
- Monthly / Yearly pricing composition;
- free-trial form;
- overall page rhythm.

Pricing/product facts and form behavior will be verified separately on staging.

## Legal page visual system

**DESIGN APPROVED**

No separate legal-page-specific redesign.

Use the **shared long-form TOC pattern** defined above. Otherwise keep the current legal-page typography, reading width, numbered sections, and minimal visual treatment.

---

# Final execution rules

1. Make one contained design correction pass for this batch.
2. Do not rewrite page copy unless absolutely necessary for a listed design change.
3. Do not modify approved pages beyond the corrections above.
4. Reuse one shared component/pattern where the same behavior appears across templates.
5. Do not expand Section Library V1 with duplicate variants.
6. After completion, provide a concise changelog grouped by page/template.
7. Flag anything that cannot be completed without developer/backend input instead of inventing a workaround.
