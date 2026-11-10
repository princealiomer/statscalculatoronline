# StatsCalc

Free online statistics calculators (Next.js + Vercel) with step-by-step results, APA-style reporting, and SEO-ready pages.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Client-side math (`jstat` + custom TS stats modules)
- Charts via Recharts

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deploy on Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the project in [Vercel](https://vercel.com/new).
3. Set env: `NEXT_PUBLIC_SITE_URL=https://statscalculatoronline.com`
4. Attach custom domain **statscalculatoronline.com** in the host DNS / project settings.
5. Deploy. Framework preset: Next.js (default).

Brand name and URL live in `src/config/site.ts` (default production URL: `https://statscalculatoronline.com`).

## Catalog

Calculators are registered in `src/lib/calculators/registry.ts` and rendered by `/calculators/[category]/[slug]`. Math engines live in `src/lib/calculators/runEngine.ts`.
