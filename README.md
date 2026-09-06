# Maprizz

Local marketing services, Google Business Profile management, websites, and review tools for local businesses.

Recovered from the live [maprizz.com](https://maprizz.com) deployment (Next.js on Netlify). This repo contains the marketing site, interactive demo, order flow shell, audit form, profile pages, and short-link redirects.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Lucide icons
- Netlify (`@netlify/plugin-nextjs`)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:4317](http://localhost:4317).

## Build

```bash
npm run build
npm start
```

## Key routes

| Route | Purpose |
| --- | --- |
| `/` | Marketing homepage |
| `/demo` | Interactive NFC demo |
| `/order` | Card order wizard (step 1) |
| `/services` | Monthly GBP / website / growth plans |
| `/audit` | Business audit request → Netlify Forms |
| `/p/cascade-auto-detail` | Sample Smart Business Card profile |
| `/t/DEMO01` | Tap redirect → profile |
| `/r/DEMO02` | Review stand redirect → Google review form |
| `/api/vcard/[id]` | vCard download |

## Environment variables

Optional for production integrations:

- `NEXT_PUBLIC_ANALYTICS_ID` — analytics script ID
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — checkout (not wired in this recovery yet)
- Supabase credentials — auth, orders, tap analytics (not wired in this recovery yet)

## Deploy

Configured for Netlify via `netlify.toml`. Connect this repo to Netlify or run:

```bash
npx netlify deploy --build
```

## Notes

- Customer login and dashboard are stubbed until Supabase auth is configured.
- No Barber John / unrelated project files are included.
- Original cloud agent source was not accessible from this environment; this codebase was reconstructed from the public production site.

## Growth redesign

See [docs/GROWTH-PLAN.md](docs/GROWTH-PLAN.md) for proposed pricing, scope, revenue math, and the sales plan. This branch prioritizes monthly services and preserves the existing product routes.

The audit form uses Netlify Forms with a detection skeleton in `public/__forms.html`. Enable form detection before redeploying, configure submission notifications, and verify one accepted submission in Netlify before routing customer traffic. The local production build does not verify the hosted form processor. The form does not show success on a failed response or if a static host simply serves the skeleton.

Hero image: original AI-generated editorial illustration of local craftsmanship; not a testimonial or client photograph.
