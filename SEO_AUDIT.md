# SEO and analytics implementation audit

Audit date: 3 November 2026. Production inspected: `https://hajrizi.dev/`.
This report describes implemented code and local verification. It does not claim
the feature branch is deployed, connected to Google properties or indexed.

## Findings and implemented fixes

| Area | Actual baseline finding | Implementation |
| --- | --- | --- |
| Framework/hosting | Next.js App Router, static export, Netlify `out/` deployment | Retained; a Netlify Function handles private server work |
| Canonicals | Live domain was correct; source fallback could produce localhost URLs without configuration | Production HTTPS default and origin validation |
| Titles/descriptions | Basic metadata existed; route intent and case-study social descriptions were incomplete | Central metadata helper with eight unique page titles/descriptions |
| Social sharing | Case studies inherited home sharing presentation | Seven 1200×630 cards, absolute image URLs and complete OG/Twitter fields |
| Sitemap | All existing routes listed, but each build fabricated new `lastModified` values | Eight canonical public routes, no invented lastmod, private/utility routes excluded |
| Structured data | No JSON-LD implementation found | Person, WebSite, ProfilePage, CollectionPage, CreativeWork and breadcrumbs |
| Crawlability | Existing public routes returned 200, unknown route returned 404; redirects already worked live | Preserved and explicit HTTPS/non-www configuration; no SPA 200 fallback |
| Internal links | Case studies had limited cross-linking; footer anchors needed to work off-home | Related work, all-project navigation and consistent home/footer links |
| Images | Several referenced PNG screenshots exceeded 500 KB; one was about 1.5 MB | Seventeen WebP versions, approximately 89% smaller in total; original assets retained |
| Loading | Homepage preloaded an image in a below-the-fold project section | Removed unnecessary preload; visible case-study hero images keep priority |
| Accessibility | Automated scans found low-contrast footer text and case-study sidebar labels | Corrected contrast within existing palette; skip link and reduced-motion support |
| Analytics | No GA4 integration or interaction collection | Consent-gated Google tag, manual route views and controlled, non-PII event vocabulary |
| Authentication | No existing owner authentication/backend | Google sign-in with verified email allowlist, state/nonce/PKCE and secure one-hour sessions |
| Private data | Static export could not securely hold/report Google credentials | Protected Function APIs and dashboard assets outside the public export |
| Reporting | No real analytics data access layer | Read-only GA4/Search Console reports, bounded filters, comparisons, caching and independent source errors |
| Dependencies | Existing framework/dependency audit reported high/critical advisories | Updated Next.js/matching config and compatible dependencies; production audit reports zero advisories |

Existing public layout, agency messaging, navigation, services and projects are
preserved. Kosovo/Europe wording reflects the owner's stated location. No client
metrics, reviews, certifications or employment claims were invented.

The full dependency audit still lists 20 moderate development-toolchain
advisories in ESLint/Lighthouse globbing dependencies. Compatible fixes were
applied; forced breaking downgrades were not. This is separate from the clean
production dependency audit.

## Verification completed

- TypeScript, ESLint, production build and Function ESM bundle smoke check pass.
- 21 unit/security/reporting tests pass, including all published external project
  event destinations, consent URL sanitization, authenticated APIs, OAuth
  controls, session validation, API failures, comparisons and cache behavior.
- 32 desktop/mobile browser scenarios pass: public routes, accessibility, layout,
  consent/revocation, no duplicate page views, owner opt-out/GPC, private access,
  dashboard setup/empty/error/connected chart and table states. Connected test
  data exists only in test fixtures, never as a live application fallback.
- Export checks validate eight unique metadata/canonical sets, one H1 per page,
  heading hierarchy, internal links/anchors, descriptive image alt text, OG image
  dimensions, JSON-LD presence/syntax, sitemap coverage, noindex 404s, exclusion of
  private dashboard files and absence of credential markers in public bundles.
- The supplied Google verification HTML asset is copied unchanged into `public/`
  and included in the export, not the sitemap. The root original is left untouched.
- Live HTTP/link audit checked the seven existing public pages, robots, sitemap,
  a real unknown-route 404, redirects and outbound project/profile destinations.
  All destinations reached in this audit returned expected successful responses;
  this does not guarantee continued availability of third-party services.

## Mobile Lighthouse lab results

Lighthouse 13.6.0, simulated mobile defaults, local production static export,
isolated from other browser scans. The preview used Brotli compression consistent
with the live Netlify response observed during the audit. Uncompressed-preview
and CPU-contended preliminary runs were not used as the final benchmark. The
isolated run started at `2026-11-03T00:35:42.850Z`.

| Route | Performance | Accessibility | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 100 | 100 | 100 | 0.845 s | 0 | 34 ms |
| `/work/` | 99 | 100 | 100 | 0.861 s | 0 | 122 ms |
| `/privacy/` | 98 | 100 | 100 | 0.821 s | 0 | 176 ms |
| `/work/hyrjedalje/` | 99 | 100 | 100 | 1.261 s | 0 | 137 ms |
| `/work/wondertales/` | 99 | 100 | 100 | 1.175 s | 0 | 96 ms |
| `/work/kosovo-police/` | 99 | 100 | 100 | 1.255 s | 0 | 99 ms |
| `/work/menmin-made/` | 100 | 100 | 100 | 1.166 s | 0 | 71 ms |
| `/work/order-extraction/` | 97 | 100 | 100 | 1.184 s | 0 | 191 ms |

Best Practices also scored 100 on all eight routes. These measurements do not
establish field INP/Core Web Vitals, CDN performance, indexing, rich-result
eligibility, traffic improvement or conversion gains. Raw reports and setup-state
dashboard screenshots are in the ignored local `artifacts/` directory.

## Key changed and added files

| Responsibility | Files |
| --- | --- |
| SEO helpers and schemas | `src/lib/seo.ts`, `src/lib/site-url.ts`, `src/components/json-ld.tsx` |
| Page metadata and semantic navigation | `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/work/page.tsx`, `src/app/work/[slug]/page.tsx`, `src/app/not-found.tsx` |
| Crawling | `src/app/robots.ts`, `src/app/sitemap.ts`, `netlify.toml` |
| Consent and events | `src/components/analytics-consent.tsx`, `src/lib/analytics/client.ts`, `src/lib/analytics/events.ts`, `src/app/privacy/page.tsx` |
| Public presentation refinements | `src/app/globals.css`, `src/components/about.tsx`, `src/components/footer.tsx`, `src/components/selected-work.tsx`, `src/data/portfolio.ts` |
| Shared reporting types | `src/lib/analytics/contracts.ts` |
| Server authentication and data | `netlify/functions/analytics.mts`, `server/app.ts`, `server/lib/auth.ts`, `server/lib/google.ts`, `server/lib/range.ts`, `server/lib/reports.ts` |
| Private UI | `server/dashboard/app.tsx`, `server/dashboard/styles.css`, `server/dashboard/index.html` |
| Public assets | `public/social/*.png`, referenced `public/projects/**/*.webp`, `public/google7f5a80bf3cfdbe16.html`; legacy root OG image replaced with redirect |
| Build and audits | `scripts/build-dashboard.mjs`, `scripts/prepare-assets.mjs`, `scripts/check-seo.ts`, `scripts/check-function.mjs`, `scripts/preview.ts`, `scripts/test-browser.mjs`, `scripts/lighthouse.mjs`, `scripts/audit-live.ts` |
| Tests/configuration | `tests/*.test.ts`, `tests/browser/portfolio.spec.ts`, `playwright.config.ts`, `package.json`, `package-lock.json`, `eslint.config.mjs`, `.gitignore`, `.env.example` |
| Handoff | `SEO_ANALYTICS_SETUP.md`, `SEO_AUDIT.md`, `README.md` |

## Remaining external verification and owner actions

Google properties, credentials and owner sign-in are not connected without the
owner's secrets and permissions. Supply those through Netlify, configure GA4's
Enhanced Measurement settings to avoid duplicate automatic collection, verify
Search Console ownership, and approve production deployment. Then inspect live
API responses, DebugView, Google URL Inspection and social previews.

Local JSON-LD checks pass. Google's Rich Results Test and Schema.org Validator
were opened, but the connected browser service was unavailable to submit the new
code, and the branch has not been deployed to production. Their external results
remain unverified. Google indexing and social-cache rendering are likewise not
claimed. See `SEO_ANALYTICS_SETUP.md` for exact setup and verification steps.
