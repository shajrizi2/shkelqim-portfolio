# Shkelqim Hajrizi — Portfolio

A developer portfolio built with Next.js App Router, React, TypeScript and
Tailwind CSS. It presents full-stack engineering, AI automation and integration
work for remote roles, agency partnerships and B2B collaboration.

## Run locally

Install Node.js compatible with the pinned Next.js release and npm, then run:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content and architecture

- `src/data/portfolio.ts` contains personal details, contact links, capabilities,
  engagement models and project/case-study entries. Existing profile and social
  links are configured there; they are not template placeholders to replace.
- `src/app` contains the App Router pages; `src/components` contains reusable
  presentation sections, including `contact-cta.tsx`.
- `public/projects/` contains project assets. Keep image paths and alternative
  text consistent with the entries in the content file.
- `src/lib/site-url.ts` builds absolute URLs for metadata. Set
  `NEXT_PUBLIC_SITE_URL` to the public origin before building for deployment;
  without it, the canonical origin is `https://hajrizi.dev`.
- Project `awsArchitecture` entries describe integrated AWS services, processing
  flows and engineering decisions. Keep these descriptions consistent with the
  technology lists and project summaries. The shared rendering lives in
  `src/components/aws-architecture.tsx`.

## Contact behavior

The contact section links to an email client through `mailto:`, a configured
Calendly page, LinkedIn, a phone link and GitHub. There is no contact-form email
service in that component. Delivery and booking are handled by those external
applications; changing portfolio content does not configure an email backend.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

Run `npm test` for authentication, reporting and event tests. After a build,
`npm run test:seo` verifies the exported metadata, sitemap, JSON-LD and internal
links. `npm run test:browser` builds an isolated analytics test configuration,
runs desktop/mobile accessibility and consent checks, then restores the normal
production build. Install Chromium with `npx playwright install chromium` first.

See [SEO_ANALYTICS_SETUP.md](SEO_ANALYTICS_SETUP.md) for Google Analytics,
Search Console, private dashboard authentication, environment variables,
performance audits and the production approval checklist. These checks do not
prove Google indexing, client outcomes or an account connection without credentials.

## Deployment

The site uses Next.js static export (`output: 'export'`). `npm run build`
generates the deployable site in `out/`; `netlify.toml` configures Netlify to use
that build command and publish directory. Netlify Functions serve the private
dashboard and read-only Google APIs. The public export stays static. For a local
preview of both public pages and the protected handler, run `npm run preview` and
open [http://127.0.0.1:4317](http://127.0.0.1:4317). `npm start` is not the preview
command for this static export.

Set `NEXT_PUBLIC_SITE_URL` to the final public origin in the build environment
and rebuild after changing it. Public `NEXT_PUBLIC_*` values may be included in
browser output and must not contain secrets. `.env.example` documents the
current site-URL setting; it is not a production secret store.

## Case-study and asset ownership

Case-study descriptions are authored portfolio content, not verification of the
linked applications' source, usage or commercial results. Keep role descriptions
and outcomes accurate and supported by evidence. Only publish client names,
branding, screenshots and work that you have permission to share. Use synthetic
examples or an authorized private walkthrough for confidential material, and
exclude customer data, personal details and credentials from assets.
