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
  without it, the fallback is `http://localhost:3000`.

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

No automated test suite is configured in `package.json`. Check rendered desktop
and mobile pages, keyboard navigation, project links and contact destinations
before publishing; the commands above do not verify external services or client
case-study outcomes.

## Deployment

Use a hosting provider that supports this Next.js version and its build output.
Set `NEXT_PUBLIC_SITE_URL` to the final public origin in the build environment,
then run `npm run build`. `npm start` runs the built Next.js server. Public
`NEXT_PUBLIC_*` values may be included in browser output and must not contain
secrets. `.env.example` documents the current site-URL setting; it is not a
production secret store. No public deployment is established by these instructions.

## Case-study and asset ownership

Case-study descriptions are authored portfolio content, not verification of the
linked applications' source, usage or commercial results. Keep role descriptions
and outcomes accurate and supported by evidence. Only publish client names,
branding, screenshots and work that you have permission to share. Use synthetic
examples or an authorized private walkthrough for confidential material, and
exclude customer data, personal details and credentials from assets.
