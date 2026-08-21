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
| `index-v2.html` | — | no approved path | The DEC-0030 rebuild of the homepage, alongside the current one. Takes over `/` once approved; the old index is retired then, not before. |
| `ai-detector.html` | `/ai-content-detector` | built |  |
| `api.html` | `/plagiarism-api` | built |  |
| `prices.html` | `/prices` | built |  |
| `terms-of-use.html` | `/terms-of-use` | built | Text carried over from the live page word for word; only the styling is new. Built by build/legal.js from the copy in build/legal/. |
| `policy.html` | `/policy` | built | Text carried over from the live page word for word; only the styling is new. Built by build/legal.js from the copy in build/legal/. |
| `cookie-policy.html` | `/cookie-policy` | built | Text carried over from the live page word for word; only the styling is new. Built by build/legal.js from the copy in build/legal/. |
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
| `plagiarism-check.html` | — | no approved path | Confirmed 2026-08-17: the homepage IS the Plagiarism Checker page. So this one has no approved address of its own. It stays on disk and leaves the navigation, the same treatment as the other delisted pages. |
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
| `canvas-integration.html` | `/canvas-integration` | stub | Treated as live: Olex confirmed 2026-08-17 that Canvas is definitely shipping, so it renders as an ordinary navigation item rather than a release gate. The address closed with it — the point-fix brief of 2026-08-20 approves /canvas-integration as final, so the filename is no longer provisional. |
| `plagiarism-checker-for-teachers.html` | `/plagiarism-checker-for-teachers` | stub | The Teachers URL audit closed on 2026-08-20: Educators lands here, and no second educator address is created. The page itself will be rewritten separately around real educator use cases. |

## Counts

- 17 × stub
- 14 × built
- 4 × no approved path
- 4 × built · out of global nav

## Open

- **Educators** — settled 2026-08-20: `/plagiarism-checker-for-teachers`. No open addresses remain.

## Settled

- **Canvas** — 2026-08-17: shipping for certain, so it renders as an ordinary navigation item rather than a release gate. Only its final URL is still to be supplied.
- **plagiarism-check.html** — 2026-08-17: the homepage IS the Plagiarism Checker page, so this one keeps no address of its own and leaves the navigation.
