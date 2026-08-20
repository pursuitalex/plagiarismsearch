# CLAUDE — POINT FIXES ONLY / NO REDESIGN

The current EN homepage visual concept is approved.

**Do not redesign the page. Do not change the approved visual direction, section composition, checker, report, scan controls, AI section, privacy section, audience cards, reviews layout, pricing card layout, FAQ layout, final CTA, header or footer structure unless specifically instructed below.**

Apply only the following changes.

## 1. Keep the current report exactly as implemented

The current report UI is approved because it reproduces the real product interface.

Keep:

- real product labels, including `Plagiarism X%`;
- current report visual structure;
- current report legend;
- current interaction where selecting a matching passage highlights/reveals the corresponding source;
- the integrations rail below the report.

Do not revert to explanatory mock labels such as `Matched passage / Matching source / Source context` if the real product UI already communicates the relationship.

Do not alter the report interaction in this patch.

## 2. Update integrations priority

New approved business/product priority:

**Moodle + Canvas = co-primary**  
**API = next**  
**Google Docs = secondary**

Update the compact integrations rail order to:

**Moodle · Canvas · API · Google Docs**

The current full integrations layout with strong Moodle and Canvas prominence is approved.

Approved final URLs:

- Moodle → `/integration-guide`
- Canvas → `/canvas-integration`
- API → `/plagiarism-api`
- Google Docs → `/how-to-use-plagiarismsearch-google-add-on`

Do not create `/integrations`.

## 3. Pricing section — keep layout, update copy and states

The current pricing visual design, period switcher and three-card layout are approved.

Keep tabs:

**One-time · Monthly · 3-Months · Yearly**

Replace eyebrow:

**ONE-TIME PLANS**

with:

**PLANS & PRICING**

Replace H2:

**Choose a one-time plan**

with:

**Choose a plan**

Replace supporting copy with:

**Need more than the free check? Compare one-time and subscription options, or view all pricing details.**

Keep:

**See all pricing options**

→ `/prices`

### Plan descriptors

Use:

- Light — **For occasional checks**
- Standard — **For regular work**
- Premium — **For higher-volume checks**

Replace:

**MOST POPULAR**

with:

**RECOMMENDED**

### Expiry rule

For **One-time** plans only:

- `No expiry` is confirmed and may remain.
- `One payment · packages never expire` may remain.

Do not carry that wording into Monthly / 3-Months / Yearly states.

### Prototype data rule

Hardcoded prices, quotas and entitlements are allowed in this design prototype.

For production, the developer will replace them with a backend-driven pricing component.

Do not redesign the cards to solve backend integration.

## 4. FAQ — add supporting content without changing layout

Keep H2:

**Plagiarism Checker FAQ**

Add this supporting paragraph under the H2:

**Answers to common questions about plagiarism checking, sources, privacy, AI analysis, supported languages, file types, and free use.**

Add a small secondary contextual link below it:

**More questions? Visit the Help Center.**

Target:

`/help-center`

Do not restore the old FAQ copy about:

- 3 anonymous checks per IP/day;
- $7.96/mo;
- 17 languages;
- 4-hour average support reply;
- AI accuracy by model;
- money-back guarantees.

Keep the current approved 9-question FAQ content.

## 5. Reviews — replace placeholders with real reviews

Keep the current dark-section carousel design.

Remove all:

- `SAMPLE TEXT`;
- placeholder reviewer names;
- placeholder review copy;
- `Approved source pool` helper text from the public design.

Use real verified review excerpts.

Approved initial set:

### Trustpilot — Tersia Gouws

> User-friendly and ticks all the boxes for me as a writer.

### SmartCustomer — Maybelle R.

> This flexibility has saved me countless hours of converting files or dealing with compatibility issues…

### G2 — Verified User in Higher Education

> It provides detailed reports, clearly identifying matched sources, and the user interface is intuitive, making the whole process seamless.

### SmartCustomer — Clarissa C.

> Thanks to the quick and high-quality review, I sent the edited term paper to my teacher on time.

Keep proper platform attribution on every card.

Do not invent reviewer role, organization or identity.

The owner may replace these with other verified reviews before production.

## 6. Footer ratings

Replace **Sitejabber** with **SmartCustomer** everywhere.

Current approved ratings for the mock/update:

- **Trustpilot — 4.7**
- **SmartCustomer — 4.0**
- **G2 — 4.3**

Replace:

**Verified ratings pending.**

with:

**Ratings on review platforms**

If possible, make each rating/platform item link to its corresponding public review profile.

Before production, ratings will be re-verified and updated if necessary.

Never ship `--`, `pending`, or placeholder values.

## 7. Educators destination

Use the existing approved URL:

**Educators → `/plagiarism-checker-for-teachers`**

Do not create:

- `/for-educators`;
- another educator landing URL;
- a redirect to the university page as part of this homepage task.

The teacher page will be rewritten separately around real educator use cases.

## 8. Leave all other approved sections untouched

Do not modify as part of this patch:

- Hero / real checker;
- trust rail;
- report section;
- report interaction;
- scan controls;
- 500M academic-text proof;
- Plagiarism vs AI section;
- privacy lifecycle;
- full integration cards except approved URL/priority changes;
- three audience pathways;
- review component structure;
- pricing visual design;
- FAQ accordion structure;
- final CTA;
- global header/footer IA.

Do not add new sections, URLs, claims, audiences or homepage body links.

## Acceptance checks

After applying the patch, confirm:

1. No major section was redesigned.
2. Report behavior is unchanged.
3. Compact integrations order is `Moodle → Canvas → API → Google Docs`.
4. Canvas points to `/canvas-integration`.
5. Educators points to `/plagiarism-checker-for-teachers`.
6. Pricing H2 is `Choose a plan`.
7. Pricing supports all four periods without One-time-only wording leaking into subscription states.
8. `Most popular` is replaced by `Recommended`.
9. FAQ has the new supporting paragraph and Help Center link.
10. No review placeholders remain.
11. Footer uses SmartCustomer, not Sitejabber.
12. Footer ratings show Trustpilot 4.7 / SmartCustomer 4.0 / G2 4.3.
13. No new unsupported claims or URLs were introduced.
