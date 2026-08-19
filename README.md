# Shkelqim Hajrizi — Portfolio

A conversion-focused developer portfolio built with Next.js App Router, TypeScript, and Tailwind CSS. The homepage is designed for agencies and product teams seeking ongoing development capacity across websites, e-commerce, custom software, backend systems, and automation.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

## Edit portfolio content

Personal details, contact links, capabilities, technology groups, engagement models, and project entries are centralized in `src/data/portfolio.ts`.

Before publishing, replace:

- `YOUR_EMAIL`, `YOUR_LINKEDIN_URL`, `YOUR_GITHUB_URL`, and `YOUR_DOMAIN`
- the project placeholder entries and their screenshots in `public/projects/`
- the empty CV path after adding `public/cv.pdf`
- the empty profile image path after adding a real image to `public/`

Placeholder social links and CV buttons are not rendered, and placeholder case studies are marked `noindex`.

## Deploy to Vercel

Push the project to a Git repository, import it at [vercel.com/new](https://vercel.com/new), and accept the detected Next.js defaults. No environment variables or backend services are required for V1.
