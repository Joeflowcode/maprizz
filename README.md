# Maprizz

Smart NFC business cards, Google review stands, and digital profiles for local businesses.

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
| `/audit` | Free business audit form |
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
