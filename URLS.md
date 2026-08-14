# URL map

Prototype filename ↔ approved production path.

The prototype keeps flat `.html` filenames so the local server, every relative link and
`build/check.js` keep working. The production paths from the approved briefs (DEC-0027
navigation, DEC-0030 homepage) live here. Switching to clean paths later is a rename
driven by this table.

**Generated — run `node build/urlmap.js` after adding a page. Do not edit by hand.**

| Prototype file | Production path | Status | Note |
|---|---|---|---|
| `index.html` | `/` | built | The Plagiarism Checker page. DEC-0030 governs its content. |
| `ai-detector.html` | `/ai-content-detector` | built |  |
| `api.html` | `/plagiarism-api` | built |  |
| `prices.html` | `/prices` | built |  |
| `why-us.html` | `/why-us` | built |  |
| `mission.html` | `/plagiarismsearch-mission-and-core-values` | built |  |
| `contact-us.html` | `/contact-us` | built |  |
| `help-center.html` | `/help-center` | built |  |
| `blog.html` | `/blog` | built |  |
| `blog-best-checker-2026.html` | `/blog/best-plagiarism-checker-in-2026` | built |  |
| `vip.html` | `/vip-plagiarism-checker` | built | Footer only, under Plans & Legal. Not a core product; stays out of the header. |
| `paper-analysis.html` | `/rate-my-paper` | built · out of global nav |  |
| `spell-check.html` | `/spell-checker` | built · out of global nav |  |
| `readability-check.html` | `/readability-checker` | built · out of global nav |  |
| `chat-bot.html` | `/plagiarism-checker-app` | built · out of global nav |  |
| `plagiarism-check.html` | — | no approved path | DEC-0027 puts Plagiarism Checker at `/`, so this separate page has no approved address. Decide whether it folds into the homepage or is retired. |
| `account.html` | — | no approved path | Log in / create account. The brief says only "keep existing authentication behavior" and names no path. |
| `design-system.html` | — | no approved path | Internal reference sheet. Never part of the public site. |
| `integration-guide.html` | `/integration-guide` | stub | Approved destination, page not designed yet. |
| `how-to-use-plagiarismsearch-google-add-on.html` | `/how-to-use-plagiarismsearch-google-add-on` | stub | Approved destination, page not designed yet. |
| `university-plagiarism-checker.html` | `/university-plagiarism-checker` | stub | Existing URL; the brief says the page content will be completely rebuilt. |
| `plagiarism-checker-for-organization.html` | `/plagiarism-checker-for-organization` | stub | Existing URL; the brief says the page content will be completely rebuilt. |
| `plagiarism-checker-for-students.html` | `/plagiarism-checker-for-students` | stub | Existing URL; a substantial rewrite is planned. |
| `testimonials.html` | `/testimonials` | stub | Approved destination, page not designed yet. |
| `powerpoint-plagiarism-checker.html` | `/powerpoint-plagiarism-checker` | stub | Footer only. The brief keeps it out of the header and out of the homepage body. |
| `pdf-plagiarism-checker.html` | `/pdf-plagiarism-checker` | stub | Footer only. The brief keeps it out of the header and out of the homepage body. |
| `quote-checker-at-plagiarismsearch.html` | `/quote-checker-at-plagiarismsearch` | stub | Footer only. The brief keeps it out of the header and out of the homepage body. |
| `turnitin-checker-alternative.html` | `/turnitin-checker-alternative` | stub | Footer only. The brief keeps it out of the header and out of the homepage body. |
| `user-manuals.html` | `/user-manuals` | stub | Approved destination, page not designed yet. |
| `newsroom.html` | `/newsroom` | stub | Approved destination, page not designed yet. |
| `originality-badges.html` | `/originality-badges` | stub | Footer only — the brief keeps it out of the header. |
| `scholarship.html` | `/scholarship` | stub | Approved destination, page not designed yet. |
| `affiliate-program-at-plagiarismsearch.html` | `/affiliate-program-at-plagiarismsearch` | stub | Approved destination, page not designed yet. |
| `policy.html` | `/policy` | stub | The homepage privacy section links here. The brief forbids inventing a new privacy URL. |
| `terms-of-use.html` | `/terms-of-use` | stub | Approved destination, page not designed yet. |
| `cookie-policy.html` | `/cookie-policy` | stub | Approved destination, page not designed yet. |
| `canvas-integration.html` | — | stub · path NOT approved | Provisional filename. Release-gated. The navigation brief says hide it until the integration is live; the homepage brief expects it live at launch. We show it as coming soon and Olex is clearing that with the brief author. The final URL is supplied at implementation. |
| `educators.html` | — | stub · path NOT approved | Provisional filename. The destination stays configurable until the Teachers URL audit closes. This filename is provisional and must not be treated as the production path. |

## Counts

- 18 × stub
- 11 × built
- 4 × built · out of global nav
- 3 × no approved path
- 2 × stub · path NOT approved

## Open

- **Canvas** — DEC-0027 says hide until the integration is live; DEC-0030 expects it live at launch. Shown as "coming soon" pending the brief author's ruling.
- **Educators** — destination stays configurable until the Teachers URL audit closes.
- **plagiarism-check.html** — superseded by `/`. Fold in or retire.
