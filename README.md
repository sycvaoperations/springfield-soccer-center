# Springfield Soccer Center — Push Bundle

Drop these into the repo root of `sycvaoperations/springfield-soccer-center`
(branch `main`), overwriting where they already exist, then commit + push.

## Files in this bundle

| File | What it is | New? |
|------|-----------|------|
| `index.html` | Site page — adds SEO `<head>`, JSON-LD schema, GTM snippet, Notify Me capture, analytics include | changed |
| `styles.css` | Adds the Notify/waitlist capture module styles | changed |
| `app.js` | Adds the status-driven lightbox footer + Web3Forms submit logic | changed |
| `data.js` | Program catalog loader (reads content/programs.json) | unchanged-ish |
| `analytics.js` | dataLayer event instrumentation (the tracking contract) | NEW |
| `sitemap.xml` | Search engine sitemap | NEW |
| `robots.txt` | Crawler directives | NEW |
| `.pages.yml` | Pages CMS collection config (dashboard view) | changed |
| `content/programs.json` | Bundled catalog the site reads | — |
| `content/programs/*.json` | One file per program (CMS edits these) | — |
| `scripts/build-programs.mjs` | Re-bundles per-program files → programs.json | NEW |
| `.github/workflows/build-programs.yml` | Runs the bundler on every CMS save | NEW |

## Before / after pushing — values to fill in

These are placeholders, flagged in-code with `TODO`:

1. **GTM container ID** — in `index.html`, replace both `GTM-XXXXXXX` (head script + noscript).
2. **Web3Forms access key** — in `index.html`, the `data-web3forms-key="REPLACE_WITH_WEB3FORMS_ACCESS_KEY"`
   on the `#pmNotify` form. Get a free key at https://web3forms.com (no account; the key is emailed).
3. **Production domain** — confirm `www.springfieldsoccer.com` across `index.html` (canonical/og),
   `sitemap.xml`, and `robots.txt`.
4. **Registration URL** — the external sign-up link for the "Register" button (currently `#register`).
5. **Business details** — street address, ZIP, phone, social URLs in the JSON-LD in `index.html`.

## One-time GitHub setting (for the CMS auto-bundler)

Settings → Actions → General → Workflow permissions → **Read and write permissions** → Save.
This lets the build action commit the rebuilt `programs.json`.

## Notes

- The GTM snippet is **guarded** — it makes no network request until a real `GTM-` id is set,
  so the placeholder won't 404 in production.
- The Notify Me flow works without a key (shows success for testing) but only **delivers**
  emails once the Web3Forms key is added.
