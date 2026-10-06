# PlagiarismSearch — Core 4 Final Correction Pack for Claude

**Date:** October 5, 2026  
**Scope:** Final acceptance corrections only  
**Pages:**
- `/about-us`
- `/ua/plagiarism-check`
- `/turnitin-checker-alternative`
- `/integration-guide`

---

We have completed the final acceptance review of the four remaining core pages.

This is **not a redesign round**.

Apply only the corrections below. Preserve everything else that has already been approved.

## Global decisions

**Section Library V1 is accepted and frozen.**

Current existing variants are accepted as Section Library V1. No additional visual unification is required unless a concrete correction below exposes a real missing need.

Do not:

- redesign approved sections;
- normalize spacing, radii, or components merely for consistency;
- introduce new variants without a concrete requirement;
- rewrite approved content that is not mentioned below;
- add speculative product claims;
- perform your own external product research to change verified facts.

If something appears uncertain but is not explicitly included below, leave it unchanged and flag it instead of inventing a correction.

---

# 1. `/about-us`

## Status

**TARGETED CORRECTIONS REQUIRED — NO REDESIGN**

The overall architecture is approved:

Hero → Story → Timeline → Team → Mission / Contact.

The page should remain a company/about page, **not a product landing page**. Do not add checker, pricing, sales-oriented CTA, plan cards, or similar commercial sections.

## CHANGE 1 — simplify the Hero

The current Hero fact card carries too many separate ideas and creates unnecessary hierarchy.

Remove:

- `First built for — Students`
- Oleksandr Kozuliov / Technical Lead from the Hero fact card.

Do **not** replace these with headcount, countries, team size, or another team member.

If an individual is named in the Hero, it should be the founder only.

The fact block should contain only three ideas:

**LAUNCHED**  
`2009`

**FOUNDER**  
`Pavlo Kucheruk`

**TODAY**  
A compact description of the current product.

Recommended direction for TODAY:

`Plagiarism checking · separate AI-writing analysis · API · Moodle, Canvas & Google Docs integrations`

You may locally rebalance the existing card after removing the extra rows so it does not look like a large empty table, but **do not create a new component or new visual language**.

## CHANGE 2 — replace the current Hero introduction

Remove the meta-style sentence:

`This page is about its history and the people behind it.`

Use substantive company-oriented copy instead.

Recommended final copy:

**`PlagiarismSearch has been developed since 2009, expanding from plagiarism checking into a broader product with separate AI-writing analysis, API access, and workflow integrations. Meet the people who build and support it today.`**

Keep `Meet the team` as the quiet Hero action.

## CHANGE 3 — shorten the Story section

The current Story repeats information that the Hero and Timeline already communicate.

The Story should explain:

- the 2009 launch;
- Pavlo Kucheruk as founder;
- continuous product development;
- the general evolution of the product.

Do **not** repeat the detailed sequence of:

API → Moodle → Google Docs → AI → Canvas.

Those milestones already belong in the Timeline.

Recommended direction:

**`PlagiarismSearch launched in 2009 under founder Pavlo Kucheruk. Since then, it has remained an actively developed product, expanding as the ways people create, review, and work with content have changed.`**

The exact surrounding copy may be adjusted for flow, but keep the Story concise.

## REMOVE 4 — Timeline helper copy

Keep the Timeline and all approved milestones.

Remove:

`Six milestones, in the order they happened.`

It reads like an internal design note rather than public-facing copy.

Do not replace it unless the section genuinely needs a short editorial introduction.

## CHANGE 5 — strengthen Denys's bio

Remove the sentence:

`He contributes to the engineering work led by Oleksandr Kozuliov.`

It unnecessarily weakens the profile and creates an artificial hierarchy.

Keep the emphasis on:

- complex engineering problems;
- backend work;
- architecture;
- infrastructure;
- technically demanding product work.

Do not invent a new title.

A concise replacement direction is:

**`His work focuses on complex engineering problems across backend systems, architecture, infrastructure, and technically demanding product development.`**

Preserve the already approved factual role/title.

## CHANGE 6 — shorten Pavlo's bio

Remove the sentence:

`His focus is the long-term development of the product rather than any single release.`

Founder status, active product direction, priorities, and major decisions already communicate the necessary point.

Do not expand the bio to compensate for the removed sentence.

## REMOVE 7 — full “How the work connects” section

The current numbered section repeats what the nine team bios have just explained.

Remove the full five-part list:

- Product direction
- Engineering
- Design & experience
- Customer success
- Growth & communication

Also remove:

`These are areas of work, not separate departments.`

Do **not** replace this with another large section.

If a transition is visually necessary between Team and Mission/Contact, use only one short editorial paragraph within the existing page language.

## KEEP

Keep unchanged unless required by the corrections above:

- Timeline design and the six approved milestones;
- 9-person Team grid;
- equal visual hierarchy between team members;
- neutral placeholders until real photographs are supplied;
- Mission & Values destination;
- Contact ending;
- quiet Business & Teams secondary link;
- absence of checker/pricing/sales CTA.

## VERIFY ONLY

Do not redesign the global shell. Confirm after the correction pass that:

- `About us` remains in the Company desktop/mobile navigation;
- `About us` remains in the footer;
- App Store treatment remains intact;
- Google Play placeholder remains intact;
- footer ratings remain intact.

---

# 2. `/ua/plagiarism-check`

## Status

**DESIGN APPROVED — VERY SMALL CONTENT CORRECTIONS ONLY**

Do **not** redesign this page.

Its transactional architecture is approved:

- Ukrainian plagiarism intent owner;
- checker in the Hero;
- report proof;
- source/context explanation;
- interpretation guidance;
- document/storage lifecycle;
- free-use explanation;
- reviews;
- separate AI explanation;
- FAQ;
- final CTA.

The current design and core Ukrainian content should remain intact.

## IMPORTANT — do not change the temporary page shell

The current English/global header/footer implementation around this page is temporary and is being handled separately during developer integration.

Do **not** attempt to:

- redesign or localize the temporary shell in this correction pass;
- change the temporary footer access path;
- change locale routing;
- restructure global navigation for this page.

That is outside this Claude task.

## CHANGE 1 — university proof headline

The proof concept is approved.

Keep:

- the university-domain evidence;
- the focus on students rather than institutional customers;
- the explicit clarification that displayed university identities do **not** imply partnership, endorsement, customer status, or institutional cooperation.

But soften the current broad headline.

Replace the equivalent of:

`PlagiarismSearch користуються студенти з університетів по всій Україні`

with:

**`PlagiarismSearch користуються студенти українських університетів`**

Do not strengthen it beyond what the underlying evidence proves.

## CHANGE 2 — remove the unsupported guest-specific 2 MB limit

Our confirmed product specification is:

- maximum **24 MB per file**;
- up to **10 files per check**;
- minimum **100 characters**.

We do **not** have confirmed support for the current claim that guests are limited to `2 MB` while registered users receive `24 MB`.

Therefore remove that guest/logged-in split.

Where file-size limits are mentioned, use:

**`до 24 МБ на один файл`**

Do not invent a lower guest limit.

The other confirmed limits above can remain.

## CHANGE 3 — make the combined report state explicit

The report example may keep:

- plagiarism/similarity results;
- `Total AI rate`;
- `AI probability`;
- Plagiarism / AI reporting states.

This is intentional. Plagiarism and AI analysis can be used separately or together.

Do **not** remove AI metrics from the report example.

However, because the Hero mockup currently shows the AI check switched off, add one small unobtrusive clarification near the report example:

**`Показники ШІ відображаються, якщо перевірку на ШІ було ввімкнено.`**

This should be supporting caption/note text, not a new callout or section.

Do not imply that AI analysis runs automatically with every plagiarism check.

## KEEP

Keep unchanged:

- H1 `Перевірка на плагіат онлайн`;
- checker-first Hero structure;
- 150-word guest / 300-word registered daily free-use presentation;
- plagiarism and AI as separate analyses;
- report visualization;
- source/context section;
- similarity interpretation section;
- Storage separated from ordinary checking;
- AI banner;
- original-language review quotations;
- FAQ architecture;
- final CTA.

Do not translate genuine review quotes merely to make the section fully Ukrainian.

## VERIFY OUTSIDE THIS CLAUDE PASS

The OCR statement for scanned/image-only PDFs is **not a Claude research task**.

Do not invent or rewrite that product behavior based on assumption. Leave it unchanged for now unless a separately supplied confirmed product fact instructs otherwise.

---

# 3. `/turnitin-checker-alternative`

## Status

**TARGETED CORRECTIONS REQUIRED — NO REDESIGN**

The current direction is approved:

- independent alternative positioning;
- visible non-affiliation disclosure;
- direct self-service distinction;
- objective comparison;
- no claim of equivalent databases/results;
- no claim that PlagiarismSearch produces a Turnitin report;
- separate treatment of AI and plagiarism;
- privacy/storage explanation;
- FAQ;
- self-service pricing path.

The current external factual claims were re-verified by our side against official Turnitin documentation on **October 5, 2026**.

Claude does **not** need to research or independently reinterpret Turnitin facts.

## CHANGE 1 — remove per-row source buttons from the comparison table

Currently individual Turnitin cells contain repeated UI such as:

`Source 1`  
`Source 2`  
`Source 3` etc.

Remove these repeated external source buttons from the table rows.

Do **not** replace them with:

- superscript numbers;
- `¹`, `²`, etc.;
- anchor links;
- jump links to the source block;
- hidden micro-buttons.

We already tested that pattern conceptually and do not want it: when the source block sits only slightly below the comparison table, an anchor can produce little or no visible viewport movement and creates a confusing interaction.

The table should read cleanly as a comparison.

## KEEP ONE source block below the comparison

Keep the existing dedicated **Official Turnitin sources** block directly below the comparison.

The five current official Turnitin source links remain appropriate.

They can remain numbered **inside the source list itself**, but those numbers must not become links/anchors from individual table cells.

This is the only source list needed for the comparison section.

## CHANGE 2 — update the verification date

Replace every occurrence of:

`September 15, 2026`

with:

**`October 5, 2026`**

Where the explanatory sentence currently says the information was reviewed on September 15, update that date as well.

Use exactly:

**`Last verified: October 5, 2026`**

The research has already been performed by us. Do not ask the user to verify it and do not perform a new speculative rewrite of the claims.

## KEEP the verified comparison claims

The existing substance of these Turnitin statements is approved and was rechecked:

- Feedback Studio / Similarity subscriptions are institution-oriented and are not sold directly to individuals;
- individual access can be available through an institution;
- student access to a Similarity Report can depend on institutional/instructor settings;
- Similarity Score is not itself a plagiarism determination;
- Turnitin searches documented source collections including web/publication/submitted-work repositories according to product/settings;
- Turnitin generates its own Similarity Report;
- PlagiarismSearch does not access Turnitin proprietary systems or generate a Turnitin Similarity Report;
- Turnitin AI-writing output is distinct from the Similarity Score and requires human interpretation.

Do not strengthen these claims.

## CHANGE 3 — fix the pricing section implementation

The current page contains page-local placeholder/hardcoded pricing values and plan entitlements even though this section is supposed to use the live/shared PlagiarismSearch pricing data.

This was accidental.

Do not maintain an independent pricing dataset on the Turnitin page.

The pricing preview must use the same approved shared/live pricing source as the main pricing implementation.

Remove page-local hardcoded fallback pricing/plan data where it would create a second source of truth.

The Turnitin Alternative page must not become responsible for maintaining its own:

- prices;
- quotas;
- billing periods;
- plan entitlements.

Keep the section concept and design, but source its actual values from the canonical pricing implementation.

## CHANGE 4 — remove internal implementation wording from pricing intro

Current copy includes:

`Current prices, quotas, billing periods and plan entitlements should always come from the live pricing system.`

That is an implementation instruction, not customer-facing copy.

Replace it with:

**`Choose the PlagiarismSearch plan and billing period that fits your checking needs. Current prices and included usage are shown below.`**

Do not mention a “live pricing system” to users.

## KEEP

Keep unchanged:

- H1 and independent positioning;
- Turnitin® trademark usage;
- non-affiliation disclosure;
- statement that PlagiarismSearch does not generate a Turnitin Similarity Report;
- the core comparison table structure;
- equal visual treatment of the two columns;
- the official source block below the table;
- report interpretation section;
- privacy/storage section;
- FAQ structure;
- direct self-service positioning;
- no “better”, “same score”, “same database”, “cheaper than Turnitin” or similar unsupported language.

A one-off official Turnitin source link in an FAQ answer can remain where it genuinely helps answer that specific FAQ. The prohibition above concerns the repetitive links/markers inside every comparison-table row.

---

# 4. `/integration-guide` — Moodle

## Status

**APPROVED — NO CONTENT OR DESIGN CORRECTIONS REQUIRED**

Do not redesign or rewrite this page as part of the Core 4 pass.

The current implementation is approved, including:

- Moodle Assignment (`mod_assign`) scope;
- Moodle `2.7–5.2` compatibility statement;
- file submissions;
- online-text submissions;
- automatic checking;
- manual checking subject to settings/permissions;
- Web / Storage / Web + Storage separation;
- `Sources` vs `Add to Storage`;
- optional separate AI detection;
- report controls;
- student-access controls;
- URL parsing;
- troubleshooting;
- FAQ;
- real plugin screenshots;
- clear distinction between screenshots and schematic diagrams;
- API credential security note;
- statement that similarity is not an automatic plagiarism/misconduct determination.

## DO NOT CHANGE

Do not change:

- the long-form documentation architecture;
- sticky `On this page` navigation;
- Hero structure;
- quick-facts sheet;
- installation flow;
- settings tables;
- screenshots;
- troubleshooting;
- FAQ;
- source/storage explanation;
- AI separation.

## VERIFY ONLY

Check that the production/staging destinations for the existing links are wired correctly:

- account/API credentials;
- Contact;
- Universities;
- API;
- Moodle Marketplace;
- GitHub Releases.

This is routing QA, not a reason to redesign the page.

---

# Final execution rule

Make this one contained correction pass.

After making the changes:

1. provide a concise changelog grouped by the four URLs;
2. explicitly identify anything you could **not** complete without a product/backend/developer decision;
3. do not modify unrelated approved pages;
4. do not expand Section Library V1 unless one of the corrections above genuinely cannot be implemented with the existing system;
5. do not silently “improve” copy outside the requested changes.
