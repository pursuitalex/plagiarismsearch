# Audit tools — Section Library audit of 2026-10-14

These scripts produced every number in `../LIBRARY_AUDIT.md` and every row of
`../SECTION_MANIFEST_2026-10-14.csv`. They only **read** the repository (`build/`, `site/`)
and write into `../evidence/` — except `manifest.js`, which writes the manifest and
`SNIPPET_INDEX_2026-10-14.json` into `docs/section-library/`. They are not part of the site
build and change nothing in it.

Browser tools use the project's `playwright-core` with the installed Chrome
(`channel: 'chrome'`) and serve `site/` to the browser by request interception: no server
is started and nothing is written to `site/`.

| Order | Script | Reads | Writes |
|---|---|---|---|
| 1 | `vercel-parity.js` | every tracked `site/` file at HEAD, and the same path on `https://plagiarismsearch.vercel.app/` | `evidence/vercel-parity.json` |
| 2 | `inv.js` | the registry, contracts, catalogue entries, snippets, every `site/*.html` (through the library validator) | `evidence/inv.json` |
| 3 | `instances.js` | `inv.json`, pages, snippets | `evidence/instances.json` |
| 4 | `modules.js` | `build/assets/js/*.js` | `evidence/modules.json` |
| 5 | `deps.js` | `inv.json`, CSS partials, snippets, `git log` | `evidence/deps.json` |
| 6 | `snip-browser.js` | `inv.json`, snippets, `site/` | `evidence/snip-browser.json` (about 25 min) |
| 7 | `validator-cms.js` | `inv.json`, snippets (uses `snip-browser.js`'s attribute rewrite) | `evidence/validator-cms.json` |
| 8 | `catalogue-browser.js` | `site/section-library.html` and four composed pages | `evidence/catalogue-browser.json` |
| 9 | `composed.js` | one snippet per component | console (saved as `evidence/composed.out`) |
| 10 | `sanitizer-cases.js` | four snippets | console (saved as `evidence/sanitizer-cases.out`), `evidence/case-report-*.png` |
| 11 | `manifest.js` | all of the above | `../SECTION_MANIFEST_2026-10-14.csv`, `../SNIPPET_INDEX_2026-10-14.json` |

Run from the repository root, for example:

```bash
node docs/section-library/audit-tools/manifest.js
```

The "CMS simulation" in `snip-browser.js` (an outer `<div>`, valueless attributes given the
value `"1"`) is the behaviour the developer described. It is **not** the CMS. Link
rewriting is not simulated: its rules are unknown.
