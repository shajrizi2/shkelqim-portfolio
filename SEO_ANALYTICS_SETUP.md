# SEO and private analytics setup

## Architecture and implementation

The public portfolio remains a Next.js App Router static export on Netlify. All
existing sections and projects remain. Next.js is updated to 16.4.4 with its
matching lint configuration; public pages do not depend on a running Next server.

- `src/lib/seo.ts` centralizes unique titles, descriptions, HTTPS canonicals,
  Open Graph and Twitter cards. Each case study has a 1200×630 share image.
- Metadata is present in prerendered HTML. JSON-LD describes the real Person,
  WebSite, home ProfilePage, work CollectionPage, case-study CreativeWorks and
  breadcrumbs. It contains no ratings, invented metrics or credentials.
- `/robots.txt` allows public pages and excludes dashboard/API paths.
  `/sitemap.xml` lists eight canonical public pages, without fabricated lastmod
  dates. Netlify previews use noindex and disallow crawling.
- Case studies link to other work. Images retain descriptive alt text. Seventeen
  referenced PNG screenshots have WebP delivery versions capped at 1440px:
  approximately 6.57 MB of originals becomes 0.75 MB of referenced WebPs. Original
  client screenshots remain in the repository. Rebuild these with `npm run prepare:assets`.
- The public visual identity is preserved. Changes include a skip link, reduced
  motion support, readable footer/sidebar contrast, privacy controls and case-study
  footer navigation. The original social-image URL redirects to the new asset.
- Static assets have appropriate cache headers. Unknown routes use the exported
  404 page rather than a catch-all 200 rewrite.

The private `/dashboard/analytics` application is a separate React bundle served
by a **Netlify Function**, not a publicly exported Next.js route. Its HTML, JS
and reporting endpoints pass through server authorization. Only the login page
and its presentation stylesheet are available without a session. No database,
visitor-tracking backend, paid analytics provider or paid add-on is introduced.
Netlify Functions still consume your existing plan's usage allowance; review
usage limits and spending settings before approving production deployment.

## Routes, intent and keyword focus

Titles below are the actual titles set by the metadata helper. Descriptions are
centralized in that helper or the existing project entries.

| Route | Primary intent / natural keyword cluster | SEO title |
| --- | --- | --- |
| `/` | Name/identity; senior full-stack developer, AI automation engineer, remote technical partner for agencies, Kosovo/Europe | Shkelqim Hajrizi \| Senior Full-Stack & AI Engineer |
| `/work/` | Evaluate engineering experience; software portfolio, SaaS, AI automation, WordPress, Shopify | Software & AI Automation Projects \| Shkelqim Hajrizi |
| `/work/hyrjedalje/` | Workforce SaaS architecture; Next.js, NestJS, PostgreSQL, Prisma, AWS | HyrjeDalje: NestJS Workforce SaaS \| Shkelqim Hajrizi |
| `/work/wondertales/` | AI product engineering; Next.js, generative AI, serverless jobs | WonderTales: Next.js AI Story Platform \| Shkelqim Hajrizi |
| `/work/kosovo-police/` | Public-sector WordPress/PHP engineering and data integrations | Kosovo Police: WordPress Engineering \| Shkelqim Hajrizi |
| `/work/menmin-made/` | Shopify development, AI integration and administration workflows | Menmin Made: Shopify & AI Integration \| Shkelqim Hajrizi |
| `/work/order-extraction/` | AI automation, Chatwoot webhooks, n8n/API integrations, order extraction | AI Order Extraction & Automation \| Shkelqim Hajrizi |
| `/privacy/` | Understand analytics, consent, contact services and data handling | Privacy & Analytics \| Shkelqim Hajrizi |

Every page has one H1. Existing agency positioning, 6+ years of experience,
remote availability and US-hour overlap are preserved. Kosovo/Europe positioning
does not imply a US location. No new project results or achievements are claimed.
Login, dashboard, private APIs and 404 utility pages are not sitemap entries.

## Required configuration

Copy `.env.example` to `.env.local` for local work. Do not commit real values.
For Netlify, configure public values for **Builds** and server values for
**Functions** in Project configuration → Environment variables. Keep private
values out of `NEXT_PUBLIC_*`, `netlify.toml`, browser code and `public/`.
Private Google variables can be limited to the production context. Rebuild after
changing public values or authentication/reporting configuration.

| Variable | Scope | Example / purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Build, public | `https://hajrizi.dev` (the default) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Build, public | `G-XXXXXXXXXX`; blank disables collection |
| `NEXT_PUBLIC_ANALYTICS_HOSTNAME` | Build, public | `hajrizi.dev`; excludes other hosts and development |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Build, public | HTML verification token only; optional for DNS verification |
| `DASHBOARD_AUTH_ENABLED` | Function, private | `true` only after auth is configured; defaults closed |
| `DASHBOARD_ORIGIN` | Function, private | `https://hajrizi.dev`; trusted origin for login/session/API |
| `DASHBOARD_ALLOWED_EMAILS` | Function, private | Exact approved Google account emails, e.g. `you@example.com` |
| `DASHBOARD_SESSION_SECRET` | Function, secret | At least 32 random bytes; generate with `openssl rand -hex 32` |
| `GOOGLE_OAUTH_CLIENT_ID` | Function | Web OAuth client ID for owner sign-in |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Function, secret | That OAuth client's secret |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Function, secret | Single-line JSON service-account credentials; never a public file |
| `GA4_PROPERTY_ID` | Function | Numeric property ID, e.g. `123456789`; not the measurement ID |
| `ANALYTICS_SITE_ORIGIN` | Function | `https://hajrizi.dev`; reporting hostname independent of dashboard host |
| `SEARCH_CONSOLE_SITE_URL` | Function | `sc-domain:hajrizi.dev` or exact `https://hajrizi.dev/` property |

`NODE_VERSION=22` is configured for Netlify builds. Use Node 22.19+ locally.
Set the Functions runtime to a supported Node 22+ runtime if an older Netlify
project has a runtime override. No browser SDK can read Function environment values.

## Google Analytics 4 collection

1. Create/select your GA4 property in [Google Analytics](https://analytics.google.com/).
2. In Admin → Data streams, create/select the Web stream for `https://hajrizi.dev`.
   Copy its **Measurement ID** (`G-…`) into `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
3. In Admin → Property details/settings, copy the numeric **Property ID** to
   `GA4_PROPERTY_ID`. The Data API uses this ID, not the web stream ID.
4. **Disable Enhanced Measurement page views/history-based page changes** for
   this stream. This implementation sends one explicit `page_view` at initial
   consent and on public pathname changes using `send_page_view: false`.
   Enabling a second page-view source causes duplicates. Do not add another GA
   snippet, Google Tag Manager GA tag or Netlify analytics injection.
5. Disable Enhanced Measurement automatic form interactions, outbound clicks,
   downloads and site-search tracking; use this site's controlled event vocabulary.
   Do not enable Google Signals or advertising personalization for this setup.
6. Configure the property's reporting timezone, retention period and internal
   traffic rules deliberately. Review the public privacy text against these
   choices and your applicable obligations before enabling collection.

The Google tag loads only after acceptance. All advertising consent categories
remain denied. Reject and accept are equally available. Preferences are kept
locally for 180 days, with a preferences control on every public page. Revocation
disables tracking, clears this site's GA cookies and reloads to unload the tag.
Cross-tab preference changes are respected. DNT/GPC, a non-production hostname,
development builds and the dashboard disable tracking.

To exclude your own browser without affecting others, run
`localStorage.setItem('analytics-exclude', 'true')` in that browser and reload.
Remove that key to opt in again. Successful dashboard sign-in also sets a
non-sensitive owner-exclusion cookie; signing out does not remove that opt-out.
The private session cookie remains HttpOnly. You can additionally use GA4's
property-level internal-traffic filters; test them before activating permanently.

### Events and conversion semantics

| Event | Meaning | Optional non-sensitive parameter |
| --- | --- | --- |
| `contact_click` | Link to the contact section | `page_path` |
| `email_click` | Email-link click | `page_path`; no email address |
| `calendly_click` | Booking-link click, **not a completed booking** | `page_path` |
| `phone_click` | Phone-link click | `page_path`; no phone number |
| `github_click` | Owner GitHub profile click | `page_path` |
| `linkedin_click` | Owner LinkedIn profile click | `page_path` |
| `portfolio_project_click` | Open a known case study | `page_path`, controlled `project_slug` |
| `external_project_click` | Open a recognized external project | `page_path`, controlled `project_slug` |
| `resume_download` | Click `/cv.pdf`, if a resume link is added | `page_path` |

There is no contact form or published resume currently, so no successful form
submission or actual resume download is claimed. Event names are selected from
an allowlist. Link text, mail/phone destinations, form contents, arbitrary URLs
and arbitrary query parameters are not event parameters. Page URLs discard
fragments and unrelated queries. Only slug-like `utm_*` values are retained;
never put names, email addresses, identifiers or confidential data in campaigns.

Contact actions sum contact/email/phone/Calendly **click events**, including
repeat clicks. GA4 `keyEvents` are shown as **configured key events**, not
confirmed leads. Mark an event as a key event only if that definition matches
your business purpose. No completed-booking integration is present. Add a real,
verified booking-success or lead-success integration before measuring confirmed
conversions; do not rename a click to `generate_lead` or a completed booking.

### Verify collection

Use a production build on the configured hostname, a browser without blockers
or owner opt-out, and a temporary test/property stream where appropriate.

- Before accepting, Network must show no `gtag.js` or GA collection requests.
- Accept and check a single Google tag load. In GA4 DebugView/Tag Assistant,
  verify one page view at consent and one per route change. The stream's
  Enhanced Measurement history setting must remain off.
- Click email, Calendly, profiles and project links. Inspect the allowlisted
  event names and parameters. Do not send real private message content as a test.
- Reject in preferences and confirm collection stops after reload. Test DNT/GPC
  and the owner opt-out independently.
- Standard GA4 reports can take 24–48 hours. Consent choices, ad blockers,
  geography estimates and reporting identity affect measured totals.

## Search Console verification and indexing

1. Open [Google Search Console](https://search.google.com/search-console/).
2. Add the **Domain** property `hajrizi.dev` (recommended). Copy Google's DNS TXT
   token into your domain provider's DNS zone at the host Google specifies.
   Leave the verification record in place and verify after DNS propagates.
   Registrar/DNS access requires the owner's participation.
3. Alternatively, add the exact URL-prefix property `https://hajrizi.dev/` and
   use an accepted verification method. For HTML-tag verification, put only the
   token's content in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and rebuild.
   The supplied `google7f5a80bf3cfdbe16.html` file has also been copied unchanged
   into `public/`. After approved deployment, Google's HTML-file method can fetch
   `https://hajrizi.dev/google7f5a80bf3cfdbe16.html`. Keep the file there; it is
   excluded from the sitemap and has a noindex header. Adding the file does not
   itself confirm account ownership. A Domain property still needs DNS verification.
4. Submit `https://hajrizi.dev/sitemap.xml` in Sitemaps. This aids discovery;
   submission does **not** guarantee crawling, indexing, ranking or rich results.
5. Use URL Inspection for the homepage, archive and five case studies. Test live
   URLs, check Google's selected canonical and crawl availability, and request
   indexing when appropriate after production deployment.
6. Monitor Page indexing, Crawl stats, submitted sitemap status and Performance.
   Exclude `/dashboard`, `/api`, login and utility pages. Authentication, not
   robots.txt, protects private analytics.

The live audit confirmed the existing HTTPS/non-www behavior and real 404 status.
The repository makes these redirects explicit. Keep `hajrizi.dev` as Netlify's
primary domain and attach `www.hajrizi.dev` as its redirect alias. Deployment and
branch previews must not replace the production canonical origin.

## Google reporting APIs and read-only credentials

1. Create/select a Google Cloud project. Enable **Google Analytics Data API**
   (`analyticsdata.googleapis.com`) and **Google Search Console API**
   (`searchconsole.googleapis.com`). Enabling these APIs and granting property
   access require the account owner. No Google Cloud billing activation is
   required by this implementation; do not enable paid services automatically.
2. Create a dedicated service account for read-only reporting. Do not grant it
   broad Google Cloud project Owner/Editor roles. Create a JSON key if your
   organization's policy permits; store the complete JSON in
   `GOOGLE_SERVICE_ACCOUNT_JSON` using Netlify's secret configuration. Revoke
   unused keys and rotate keys according to your organization's policy.
3. GA4 Admin → Property access management: add the service-account email as
   **Viewer** for the desired property. Do not give edit/manage-user access.
4. Search Console → Settings → Users and permissions: add the same account with
   **Restricted/read-only access** sufficient for Performance reports. If your
   organizational policy requires a different read role, grant only the
   minimum required to query performance; no owner delegation is needed.
5. Set numeric `GA4_PROPERTY_ID` and exact `SEARCH_CONSOLE_SITE_URL`. A domain
   property uses `sc-domain:hajrizi.dev`; a URL-prefix property uses the exact
   verified origin including the trailing slash. These are not interchangeable.

The official Google authentication library requests only
`analytics.readonly` and `webmasters.readonly` for reporting. Access tokens stay
in the Function process. The client receives only report data and sanitized
connection states; no credential JSON, private key, token or Google error body.
Owner sign-in is separate and requests only `openid email`, not reporting scopes.

## Private dashboard sign-in

1. In Google Cloud, configure an OAuth consent screen for your own application.
   Choose an audience appropriate to the owner account. If the app is in testing,
   add your exact owner Google account to the permitted test users.
2. Create an **OAuth 2.0 Web application** client. Register exactly
   `https://hajrizi.dev/dashboard/auth/callback` as an authorized redirect URI.
   Keep HTTPS. The owner may need to complete Google's audience/publishing steps;
   this code does not claim Google application verification.
3. Set `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`,
   `DASHBOARD_ALLOWED_EMAILS`, `DASHBOARD_ORIGIN` and a random
   `DASHBOARD_SESSION_SECRET` in Function environment variables. Set
   `DASHBOARD_AUTH_ENABLED=true` only after all are present.
4. After an approved deployment, visit `/dashboard/analytics`. Sign in using an
   allowlisted Google account. Use strong account security/MFA with Google.
   Unapproved or unverified accounts are refused.

Sign-in validates the verified Google identity, exact owner allowlist, browser
state, nonce, PKCE and the configured callback audience. Signed sessions last
one hour and use `__Host-` Secure, HttpOnly, SameSite=Strict cookies with Path=/.
OAuth state cookies use SameSite=Lax for Google's cross-site callback and expire
after ten minutes. All private responses use no-store, noindex and a restrictive
CSP. Logout requires a same-origin POST. Removing an email from the allowlist or
rotating the session secret invalidates that identity's sessions after the
configuration is deployed. No shared browser password or development auth bypass
exists. Serverless instances have short-lived replay/rate controls; Google
authorization codes, PKCE, cookies and verified tokens are the primary controls.

## Dashboard reports, comparisons and limits

- GA4: period active/new users, sessions, page views, engaged sessions, engagement
  rate, configured key events, daily traffic, channels, source/medium, referring
  domains, countries, devices, pages, landing pages and tracked actions.
- Search Console: Google Web Search clicks, impressions, CTR and average
  position; dates, queries, landing pages, countries, devices, low-CTR queries
  and changes in page visibility. It is **Google Search data**, not overall traffic.
- 7/30/90-day presets and 1–366-day custom ranges compare against the immediately
  preceding, equally long period. Complete UTC dates are validated at the API.
  GA4 buckets use the property's timezone; Search Console uses Pacific dates
  and finalized data only. Recently finalized data can lag the selected end date.
- Device and page filters apply to both sources. Channel filtering is GA4-only
  and is labeled that way. Tables support local row search and bounded expansion.
- Period unique active users come from a totals query, not a sum of daily users.
  Referrer domains aggregate page views, not unique sessions. Engagement time is
  total recorded engagement seconds. Position is averaged by Google, not summed;
  lower positions are better. Zero-impression position is unavailable, not zero.
- GA4 requests use batches of at most five reports. Search requests are bounded,
  with at most three in flight per source. Each request has a timeout. Authorized
  requests are rate-limited within each warm Function instance.
- Five-minute **server memory** caches coalesce identical requests and retain at
  most 30 selections. Private browser/CDN responses are never cached. Cold starts
  reset the memory cache; there is no claim of a global persistent cache. Error
  states have a short retry cache. Reload can use the cached result, labeled in UI.
- Breakdowns return at most 1,000 rows, not a complete export. Google may suppress
  query data for privacy and threshold GA4 rows; notices describe these limits.
  Search Console historical limits and GA4 retention can limit old comparisons.
- Missing credentials show setup states with no metric values. Connected but
  empty results show real zeros and no-data states. One source can fail without
  hiding the other. Sync timestamps reflect successful API fetches only.

## Build, tests and deployment

```bash
npm ci
npx playwright install chromium
npm run lint
npm test
npm run build
npm run test:seo
npm run test:function
npm run test:browser
npm run preview
```

`npm run build` runs TypeScript validation, exports the public site to `out/`,
and builds the private dashboard into `server/dashboard/dist/`. Netlify bundles
`netlify/functions/analytics.mts` plus those private assets. They must **not** be
copied into `public/` or `out/`. `npm start` does not serve the static export.
The preview runs on `http://127.0.0.1:4317` and uses the real private handler with
no auth bypass; OAuth requires an approved HTTPS origin. Use unit tests or a
separately approved HTTPS preview origin for authentication verification.

The browser test wrapper builds with a test-only measurement ID and local
hostname, intercepts Google scripts to prevent collection, then rebuilds the
normal export even if tests fail. Dashboard API fixtures live only in tests and
are never fallback data in the application. Never deploy a manually instrumented
test export. A fresh normal build is always required for an approved deployment.

With the preview running, additional audits are:

```bash
npm run audit:lighthouse
npm run audit:live
```

Lighthouse HTML/JSON, test screenshots and live HTTP/link audit output go to
ignored `artifacts/`. These are lab measurements, not production field Core Web
Vitals. Lighthouse's total blocking time is not field INP. Use Search Console's
Core Web Vitals/CrUX after enough real traffic, without inventing field metrics.
The local preview uses HTTP compression, matching the Brotli delivery observed on
the live Netlify site. Run Lighthouse without simultaneous browser tests to avoid
CPU contention; do not interpret these local numbers as guaranteed CDN timings.

**Production deployment requires the owner's approval.** Review the feature
branch/PR and configuration first. Then, after approval, deploy through the
existing Netlify pipeline. Keep `out/` as the publish directory and Functions
enabled. Do not change to an SPA wildcard rewrite. Previews have GA disabled
and noindex by configuration. To test Google login on a preview, use a separate,
explicitly approved HTTPS dashboard origin and matching OAuth callback; keep
`ANALYTICS_SITE_ORIGIN=https://hajrizi.dev` for production reports.

### Verify protected API responses

- Without a session, `GET /api/private/analytics?start=YYYY-MM-DD&end=YYYY-MM-DD`
  must return 401 (503 while auth is unconfigured), never data. Dashboard HTML
  and JS must redirect to login when unauthenticated. Private headers must include
  `X-Robots-Tag: noindex` and `Cache-Control: private, no-store`.
- Sign in in the browser, use Network to inspect the same-origin report request,
  and check date/filter values, source labels and synchronization timestamps.
  Test an invalid date for 400, cross-origin requests for rejection and logout
  followed by a fresh API request for 401.
- A 403 connection state points to missing Google API/property permission; a
  quota error is distinct from a zero-data result. Never paste session cookies,
  private report data or Google tokens into public bug reports.

### Validate indexing and sharing after approved deployment

- Re-run the live audit and inspect canonical, robots, sitemap, 404 and redirects.
- Use [Google Rich Results Test](https://search.google.com/test/rich-results)
  for supported types and [Schema.org Validator](https://validator.schema.org/)
  for the full JSON-LD graph. Local tests validate JSON syntax, graph presence
  and route consistency. URL-based validation of this branch must wait for an
  approved deployment. Code-input testing is also available in those tools; the
  connected browser service was unavailable during implementation, so an external
  validator result is not claimed. CreativeWork/WebSite markup is not a promise
  of a Google rich result.
- Check LinkedIn Post Inspector and Facebook Sharing Debugger, and share a URL
  in WhatsApp/X to refresh cached previews. Confirm each image is public, returns
  200, is 1200×630, and uses an absolute HTTPS URL. Platform rendering and cache
  refreshes require live verification; local metadata checks do not prove them.

## Remaining account-level actions

The owner must verify DNS/domain ownership, select/create Google properties,
enable APIs, grant read-only permissions, configure OAuth and allowlisted
identities, supply secrets, confirm analytics retention/privacy settings, disable
duplicate Enhanced Measurement tracking, submit the sitemap and approve the
production deployment. No Google property connection, Google indexing, ranking
improvement, confirmed booking conversion or production deployment is claimed
before those steps are actually verified.

## Primary references

- [Next.js metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
  and [static exports](https://nextjs.org/docs/app/guides/static-exports)
- [Netlify Function routing/configuration](https://docs.netlify.com/build/functions/configuration/)
- [Google consent mode](https://developers.google.com/tag-platform/security/guides/consent)
  and [SPA measurement](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications)
- [GA4 Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
  and [Search Analytics API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- [OAuth web server flow](https://developers.google.com/identity/protocols/oauth2/web-server)
