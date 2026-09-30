# URL map

Prototype filename ↔ approved production path.

The prototype keeps flat `.html` filenames so the local server, every relative link and
`build/check.js` keep working. The production paths from the approved briefs (DEC-0027
navigation, DEC-0030 homepage) live here. Switching to clean paths later is a rename
driven by this table.

**Generated — run `node build/urlmap.js` after adding a page. Do not edit by hand.**

| Prototype file | Production path | Status | Note |
|---|---|---|---|
| `index.html` | `/` | built | The Plagiarism Checker page, to DEC-0030. Built by build/home-v2.js, checked by build/check-home.js. Its plan cards take their figures from build/pricing-data.js. |
| `ai-detector.html` | `/ai-content-detector` | built | The AI Detector, to DEC-0038. Built by build/ai-v2.js, checked by build/check-ai.js. |
| `api.html` | `/plagiarism-api` | built | The API page, to DEC-0041. Built by build/api-v2.js, checked by build/check-api.js. |
| `prices.html` | `/prices` | built | The Pricing page, to DEC-0042. Built by build/prices-v2.js, checked by build/check-prices.js. Its plan cards are a shell for the backend pricing widget; figures come from build/pricing-data.js, shared with the homepage. |
| `terms-of-use.html` | `/terms-of-use` | built | Text carried over from the live page word for word; only the styling is new. Built by build/legal.js from the copy in build/legal/. |
| `policy.html` | `/policy` | built | Text carried over from the live page word for word; only the styling is new. Built by build/legal.js from the copy in build/legal/. |
| `cookie-policy.html` | `/cookie-policy` | built | Text carried over from the live page word for word; only the styling is new. Built by build/legal.js from the copy in build/legal/. |
| `originality-badges.html` | `/originality-badges` | built | Copy and artwork carried over from the live page unchanged; the 129 badge images live in site/assets/img/badges/. Built by build/badges.js. |
| `user-manuals.html` | `/user-manuals` | built | Category names and all twenty guide titles carried over unchanged; the arrangement is new. Built by build/manuals.js. Most guides still live on the production site and keep absolute addresses. |
| `newsroom.html` | `/newsroom` | built | The news archive. All 68 items carried over from the seven live pages with their dates, wording and destinations intact; the arrangement is new. Built by build/newsroom.js from build/newsroom-data.json, which build/newsroom-fetch.js refreshes. |
| `plagiarism-and-ai-check-report.html` | `/plagiarism-and-ai-check-report` | built | A User Guide article, rendered through build/article.js — the template lifted from the blog post: one centred 700px column, a contents box, and semantic blocks styled once. Built by build/report-guide-v2.js from build/report-guide-data.json (refreshed by build/report-guide-fetch.js), checked by build/check-report-guide-v2.js. |
| `why-us.html` | `/why-us` | built |  |
| `mission.html` | `/plagiarismsearch-mission-and-core-values` | built |  |
| `contact-us.html` | `/contact-us` | built |  |
| `help-center.html` | `/help-center` | built |  |
| `blog.html` | `/blog` | built |  |
| `blog-best-checker-2026.html` | `/blog/best-plagiarism-checker-in-2026` | built |  |
| `university-plagiarism-checker.html` | `/university-plagiarism-checker` | built | The University page to the v2 brief of 2026-09-04: nine sections, a proof type per act (hub, report, relationship map, source map, decision tree). Built by build/university-v2.js, checked by build/check-university-v2.js. |
| `plagiarism-checker-for-students.html` | `/plagiarism-checker-for-students` | built | The Students page to the 2026-09-15 brief: the real checker in a two-column hero, the shared report with the student principle, a decision-shaped review workflow. Replaced the stub. Built by build/students.js, checked by build/check-students.js. |
| `turnitin-checker-alternative.html` | `/turnitin-checker-alternative` | built | The Turnitin Alternative page to the 2026-09-15 brief: the real checker, a semantic comparison table with official Turnitin sources and a last-verified date, the non-equivalence act, a balanced fit section, the shared report, a pricing preview, the trademark notice. Footer only. Replaced the stub. Built by build/turnitin.js, checked by build/check-turnitin.js. |
| `integration-guide.html` | `/integration-guide` | built | The Moodle Integration guide to the 2026-09-15 brief: a documentation-led page — compact product header, quick facts, a sticky On-this-page rail, definition tables, masked crops of the real plugin screens, troubleshooting, FAQ, support handoff. Replaced the stub. Built by build/moodle.js, checked by build/check-moodle.js. |
| `ua-plagiarism-check.html` | `/ua/plagiarism-check` | built | The Ukrainian dedicated checker to the 2026-09-16 brief — the AR-03 master. Ukrainian content, English shell and product UI by decision. Flat file in the prototype; the production path is /ua/plagiarism-check. Built by build/ua.js, checked by build/check-ua.js. |
| `pdf-plagiarism-checker.html` | `/pdf-plagiarism-checker` | built | The PDF Plagiarism Checker to the 2026-09-15 brief: protect-first — title and route kept, the real checker first, the text-based / scan-only / mixed extraction act as the signature, no OCR. Replaced the stub. Built by build/pdf.js, checked by build/check-pdf.js. |
| `affiliate-program-at-plagiarismsearch.html` | `/affiliate-program-at-plagiarismsearch` | built | The Affiliate Program. No brief: the live page's copy word for word, the architecture new — a facts hero, the three tools, the steps as the editorial list, the two programs as an offer pair with the cash model dark, five reasons, the FAQ, the closing band. Footer only. Replaced the stub. Built by build/affiliate.js, checked by build/check-affiliate.js. |
| `testimonials.html` | `/testimonials` | built | Reviews. No brief: everything is the live page's, read into build/testimonials-data.json by build/testimonials-fetch.js — the three rating tiles, Trustpilot and Sitejabber each as a summary with a featured quote and all their cards (58 and 42, nine at a time behind "Show more"), the four video reviews as click-to-play facades. Built by build/testimonials.js, checked by build/check-testimonials.js. |
| `scholarship.html` | `/scholarship` | built | The 2026 Scholarship. No brief: the live page's copy word for word, the architecture new — the prize as a contest card in the hero with the winners as link chips, an editorial split, the dark act, the fifteen terms as a numbered grid, the five prompts as a numbered list, the FAQ, the application form (#app-form-1, inert). Footer only. Replaced the stub. Built by build/scholarship.js, checked by build/check-scholarship.js. |
| `affiliate-program-at-plagiarismsearch-v2.html` | — | no approved path | The Affiliate Program, illustrated — version 2 beside v1 until one is picked (the 1–2 switcher). Same live copy; photographs in the bithide "Revenue Infrastructure" manner with HTML chips, duotone spot icons on white plates (the Mission/Contact recipes). Built by build/affiliate-v2.js, checked by build/check-affiliate.js with the file name. |
| `readability-check-v2.html` | — | no approved path | The Readability Score Checker, illustrated — version 2 beside v1 until one is picked (the 1–2 switcher). Every word the live page's (build/readability-data.json); the working Flesch calculator with the live upload controls and a drop zone; the two charts the live page shows as pictures drawn from their own numbers; the Trustpilot feedback from the Reviews data; photographs and spot icons (IMAGES.md §8). Built by build/readability-v2.js, checked by build/check-readability-v2.js. |
| `testimonials-v2.html` | — | no approved path | Reviews, illustrated — version 2 beside v1 until one is picked (the 1–2 switcher). Same live data; a hero photograph with the two platforms' ratings as chips, the platform tiles with spot icons beside a photograph, Trustpilot in its own manner as a masonry wall, SmartCustomer (the live Sitejabber, renamed with its profile figures) as two running rows of equal cards with a zoom popup, the four videos on a stage with a playlist (IMAGES.md §8, wardrobe law). Built by build/testimonials-v2.js, checked by build/check-testimonials.js with the file name. |
| `scholarship-v2.html` | — | no approved path | The Scholarship, illustrated — version 2 beside v1 until one is picked (the 1–2 switcher). Same live copy; the prize as a chip over the hero photograph, the four contest facts as spot-icon cards, a photograph for "try your luck", spot icons in the dark act (IMAGES.md §8). Built by build/scholarship-v2.js, checked by build/check-scholarship.js with the file name. |
| `plagiarism-checker-for-organization.html` | `/plagiarism-checker-for-organization` | built | Business & Teams to the 2026-09-15 brief: no checker; the managed organization in the hero, Organization Management as a bento led by the personal-vs-organization separation, Storage as two tracks, workspace-vs-API as one split card, the business inquiry as the conversion. Replaced the stub. Built by build/business.js, checked by build/check-business.js. |
| `vip.html` | `/vip-plagiarism-checker` | built | Footer only, under Plans & Legal. Not a core product; stays out of the header. |
| `paper-analysis.html` | `/rate-my-paper` | built · out of global nav |  |
| `spell-check.html` | `/spell-checker` | built · out of global nav |  |
| `readability-check.html` | `/readability-checker` | built · out of global nav |  |
| `chat-bot.html` | `/plagiarism-checker-app` | built · out of global nav |  |
| `plagiarism-check.html` | — | no approved path | Confirmed 2026-08-17: the homepage IS the Plagiarism Checker page. So this one has no approved address of its own. It stays on disk and leaves the navigation, the same treatment as the other delisted pages. |
| `account.html` | — | no approved path | Log in / create account. The brief says only "keep existing authentication behavior" and names no path. |
| `design-system.html` | — | no approved path | Internal reference sheet. Never part of the public site. |
| `section-library.html` | — | no approved path | Internal: the Section Library catalogue — each library component and variant, live, with its copy-paste HTML and content contract. Never part of the public site. Built by build/section-library.js; validated by build/check-library.js. |
| `how-to-use-plagiarismsearch-google-add-on.html` | `/how-to-use-plagiarismsearch-google-add-on` | stub | Approved destination, page not designed yet. |
| `powerpoint-plagiarism-checker.html` | `/powerpoint-plagiarism-checker` | stub | Footer only. The brief keeps it out of the header and out of the homepage body. |
| `quote-checker-at-plagiarismsearch.html` | `/quote-checker-at-plagiarismsearch` | stub | Footer only. The brief keeps it out of the header and out of the homepage body. |
| `canvas-integration.html` | `/canvas-integration` | stub | Treated as live: Olex confirmed 2026-08-17 that Canvas is definitely shipping, so it renders as an ordinary navigation item rather than a release gate. The address closed with it — the point-fix brief of 2026-08-20 approves /canvas-integration as final, so the filename is no longer provisional. |
| `plagiarism-checker-for-teachers.html` | `/plagiarism-checker-for-teachers` | stub | The Teachers URL audit closed on 2026-08-20: Educators lands here, and no second educator address is created. The page itself will be rewritten separately around real educator use cases. |

## Counts

- 28 × built
- 8 × no approved path
- 5 × stub
- 4 × built · out of global nav

## Open

- **Educators** — settled 2026-08-20: `/plagiarism-checker-for-teachers`. No open addresses remain.

## Settled

- **Canvas** — 2026-08-17: shipping for certain, so it renders as an ordinary navigation item rather than a release gate. Only its final URL is still to be supplied.
- **plagiarism-check.html** — 2026-08-17: the homepage IS the Plagiarism Checker page, so this one keeps no address of its own and leaves the navigation.
