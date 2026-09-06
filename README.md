# Maprizz — maprizz.com

**Tap. Get found. Get reviews. Get customers.**

Maprizz sells smart NFC products to local businesses: the **Tap Card** ($49), the **Smart Business
Card** ($79) and the **Business Kit** ($149, card + Google review stand). Every physical product is
programmed with a permanent Maprizz short URL (`maprizz.com/t/ABC123`, `maprizz.com/r/ABC123`).
Maprizz logs the tap and redirects to wherever the customer wants today — their website, their
Maprizz digital profile, a booking page or their Google review form — so the chip never needs to
be reprogrammed.

**Stack:** Next.js 16 (App Router, Server Components, Server Actions) · TypeScript · Tailwind CSS v4 ·
Supabase (Postgres, Auth, Storage) · Stripe Checkout · Zod · `qrcode` · Lucide icons · Resend.

Alongside the one-time products, Maprizz sells **monthly plans** billed through Stripe
subscriptions: Google Foundations ($299/mo), Website + Local SEO ($599/mo) and Local Growth
($799/mo). Plans are described on `/services` and priced in `src/lib/services.ts`. Plan CTAs go
to `/subscribe` (Stripe Checkout in subscription mode). The free audit at `/audit` is still the
softer first step. See `docs/GROWTH-PLAN.md` for delivery limits and positioning.

**Tap-card referrals:** hand someone `maprizz.com/c/jacqueline` (NFC or QR). They see Joey's landing
page. If they request an audit, the lead is stored as referred by Jacqueline. Joey's own card is
`/card` (same as `/c/joey`). Seeded cards: `joey`, `jacqueline`, `doug`. Create more from
**Admin → Tap Cards**. Locally, visits and leads are saved to `.data/tap-cards.json`. On Netlify they
use site-scoped Blobs. `/c/*` and `/card` are `noindex` and canonical to maprizz.com.

Runs with **zero configuration** in DEV/MOCK mode (file-backed database, development login,
simulated checkout) and switches to Supabase + Stripe when the environment variables are present.

---

## Contents

1. [Install dependencies](#1-install-dependencies)
2. [Environment variables](#2-environment-variables)
3. [Supabase setup](#3-supabase-setup)
4. [Database migrations and seed](#4-database-migrations-and-seed)
5. [Stripe setup](#5-stripe-setup)
6. [Local development](#6-local-development)
7. [How to create an admin](#7-how-to-create-an-admin)
8. [How NFC cards work](#8-how-nfc-cards-work)
9. [How to program a physical NFC card](#9-how-to-program-a-physical-nfc-card)
10. [Deployment to Vercel](#10-deployment-to-vercel)
11. [Connecting maprizz.com](#11-connecting-maprizzcom)
12. [Project structure](#12-project-structure)
13. [Routes](#13-routes)
14. [Security model](#14-security-model)

---

## 1. Install dependencies

Requires Node 20+ (22 recommended) and npm.

```bash
npm install
cp .env.example .env.local   # optional for local dev; see section 2
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run lint    # ESLint (zero warnings policy)
npm run build   # production build, also type-checks
npm start       # serve the production build
npx tsc --noEmit -p .   # type-check only
```

## 2. Environment variables

All variables are documented in [`.env.example`](.env.example). Nothing is hard-coded; secrets are
read only in server code.

| Variable                        | Required in prod | Purpose                                                                                      |
| ------------------------------- | ---------------- | -------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | Yes              | Public origin (`https://maprizz.com`). Used for short URLs, QR codes, vCards, Stripe returns. |
| `ADMIN_EMAILS`                  | Yes              | Comma-separated emails that become admins on first sign-in (see section 7).                  |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes              | Supabase project URL.                                                                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes              | Supabase anon key (used for auth cookies only).                                              |
| `SUPABASE_SERVICE_ROLE_KEY`     | Yes              | Server-only key used by the data layer after authorization checks.                           |
| `STRIPE_SECRET_KEY`             | Yes              | Server-created Checkout Sessions.                                                            |
| `STRIPE_WEBHOOK_SECRET`         | Yes              | Verifies `checkout.session.completed` webhooks.                                              |
| `RESEND_API_KEY`                | No               | Emails you a copy of each free-audit request (they are always saved to the database).        |
| `CONTACT_TO_EMAIL`              | No               | Inbox for audit-request notifications.                                                       |
| `CONTACT_FROM_EMAIL`            | No               | Verified Resend sender.                                                                      |
| `NEXT_PUBLIC_ANALYTICS_ID`      | No               | GA4 measurement ID. Analytics is off when empty.                                             |
| `NEXT_PUBLIC_JOEY_PHONE`        | No               | Enables Call / Text on `/card` and `/c/[slug]`.                                              |
| `NEXT_PUBLIC_JOEY_EMAIL`        | No               | Defaults to hello@maprizz.com on tap-card pages.                                             |
| `NEXT_PUBLIC_JOEY_INSTAGRAM`    | No               | Handle or full URL for the Instagram button on tap-card pages.                               |
| `MAPRIZZ_ALLOW_DEV_MODE`        | Never on prod    | Permits mock auth/payments in a production build. Only for throwaway previews.               |

**How modes are decided** (`src/lib/env.ts`):

- Supabase missing → mock database (`.dev-data/db.json`) and, outside production, the development
  login screen. In production with Supabase missing, login is disabled entirely (nobody can act as
  admin by accident).
- Stripe missing → outside production, the clearly labelled **mock checkout** page. In production,
  `/api/checkout` returns a friendly 503 instead of pretending to sell.

## 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com) (any region; US West is closest to Bend).
2. **Project Settings → API**: copy the project URL, anon key and service-role key into `.env.local`.
3. **Authentication → URL configuration**: set **Site URL** to `https://maprizz.com` and add
   redirect URLs `https://maprizz.com/auth/callback` and `http://localhost:3000/auth/callback`.
4. **Authentication → Providers → Email**: keep Email enabled. Maprizz uses magic links (OTP via
   email), so passwords are never involved. Turn **Confirm email** off if you want first login to be
   one click.
5. **Authentication → Email templates → Magic Link**: optional, but rename the template to say
   "Log in to Maprizz".
6. Run the migration (next section). It also creates the public `logos` storage bucket.

The Supabase CLI config in `supabase/config.toml` mirrors these auth settings for `supabase start`.

## 4. Database migrations and seed

Schema lives in `supabase/migrations/0001_init.sql` — tables `businesses`, `profiles`, `tap_links`,
`tap_events`, `orders`, `lead_requests`, `user_roles`; enums for link type, destination, package,
payment and fulfillment status; `updated_at` triggers; Row Level Security policies; the `logos`
bucket. Row types are mirrored by hand in `src/types/database.ts` — keep both in sync.

**Option A — Supabase CLI (recommended):**

```bash
npm i -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase db push                       # applies supabase/migrations/*
psql "$SUPABASE_DB_URL" -f supabase/seed.sql   # optional: demo business (see below)
```

**Option B — SQL editor:** paste `0001_init.sql`, then `0002_referral_slug.sql` and
`0003_lead_city.sql`, then `seed.sql` if you want the demo business.

**Seed / demo data.** `supabase/seed.sql` inserts **Cascade Auto Detail**, a fictional business
flagged `is_demo = true`, with a profile, a card link (`DEMO01`) and a review link (`DEMO02`). The
homepage and `/demo` render this profile and label it as a demo; it is never described as a
customer. The mock database ships with the same seed (`src/lib/db/seed.ts`).

## 5. Stripe setup

1. Create a Stripe account, switch to **Test mode** while developing.
2. **Developers → API keys**: copy the secret key (`sk_test_…`) to `STRIPE_SECRET_KEY`.
3. Prices are **not** configured in Stripe — the catalog lives in `src/lib/packages.ts` and the
   server creates each Checkout Session with `price_data` from that file. The client never sends an
   amount.
4. Webhook: **Developers → Webhooks → Add endpoint** with URL
   `https://maprizz.com/api/stripe/webhook` and events `checkout.session.completed` and
   `checkout.session.async_payment_succeeded`. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
5. Locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook` prints a `whsec_…`
   secret for `.env.local`.
6. Go live: repeat with live keys in your host's environment variables.

What happens on payment: the webhook (or the success page, whichever arrives first — both are
idempotent) marks the order `paid`, stores the Stripe session and payment-intent IDs, and provisions
the business: profile, `business_card` tap link, and a `review_stand` link for the Business Kit.

Field sales (`/admin/sell`) use the same Checkout Sessions: **Take Payment** creates a session and
shows the link plus a QR the customer can scan on their own phone. Admins can also mark orders
`cash` or `complimentary`.

## 6. Local development

```bash
npm run dev
```

With no `.env.local` you are in **mock mode**:

- Data persists in `.dev-data/db.json` (git-ignored). Delete the folder to reset.
- Logo uploads go to `.dev-data/uploads/` and are served from `/api/dev-files/*`.
- `/login` shows a **Development login** where you pick an email and a role (admin or customer).
- Checkout ends on `/order/mock-checkout`, a dashed-border page labelled *Development only*.

Suggested first run:

1. Visit `/`, `/demo`, `/p/cascade-auto-detail`, and open `http://localhost:3000/t/DEMO01`.
2. Order a Smart Business Card at `/order`, simulate payment, note the tap URL on the success page.
3. Log in as **customer** with the email you used; the dashboard claims the business and shows the
   tap you just made.
4. Log in as **admin**; use `/admin/sell` to create a Business Kit customer, then `/admin/orders`.

## 7. How to create an admin

Set `ADMIN_EMAILS` (comma-separated). The first time any of those addresses signs in — magic link in
production, development login locally — `ensureUser` writes `role = 'admin'` to `user_roles`. From
then on the role is stored in the database, so you can also promote someone with SQL:

```sql
update user_roles set role = 'admin' where email = 'teammate@maprizz.com';
```

Admin routes (`/admin/*`) and admin server actions call `requireAdmin()` on the server; hiding
navigation is never the only guard.

## 8. How NFC cards work

An NFC card holds a tiny NDEF record — for Maprizz, a URL. When a phone with NFC is held near the
card, the phone reads the URL and shows an "open link" prompt (iPhone XS or newer and most modern
Android phones do this without any app). The QR code printed on the card is the fallback for phones
without NFC or with it turned off.

Maprizz never writes the customer's website onto the chip. Each product gets a **tap link** with a
short code; the chip carries `https://maprizz.com/t/CODE` (cards) or `https://maprizz.com/r/CODE`
(review stands). When tapped:

1. `/t/[code]` looks up the code, checks it is enabled, records a `tap_events` row (timestamp,
   referrer, user agent — no IP, no fingerprinting) after the response, and 302-redirects to the
   current destination: the Maprizz profile `/p/[slug]`, the website, a custom URL, or the Google
   review form.
2. Unknown or paused codes redirect to `/link-unavailable`, a tasteful page rather than an error.

Because the destination is stored in the database, customers (and admins) change it from the
dashboard at any time and the physical card keeps working. Review stands track **review-link
taps**; Maprizz cannot know whether a review was actually submitted and never claims to.

## 9. How to program a physical NFC card

You need blank NTAG213/215/216 cards (NTAG215 or 216 recommended for headroom) and a phone with
NFC.

1. Open the customer in **Admin → Businesses**, or the **Customer ready** screen right after a
   field sale, and tap **Copy NFC URL**. It looks like `https://maprizz.com/t/A91XKD`.
   For a review stand copy the `/r/…` URL.
2. Install **NFC Tools** (iOS / Android). Tap **Write → Add a record → URL/URI**, paste the Maprizz
   URL, then **Write** and hold the card to the top of the phone until it confirms.
3. Optional: **Other → Lock tag** so it cannot be overwritten. Do this only after testing.
4. Test: hold the card to a second phone; it should open the customer's profile or website. Every
   test tap shows up in the dashboard analytics, so mention that to the customer.
5. Print the QR from the fulfillment sheet (**Admin → Orders → order → PNG/SVG**) on the card back.

**Encode the Maprizz short URL, not the client's website.** That is the whole point: the
destination can change later without touching the card.

## 10. Deployment to Vercel

1. Push this project to GitHub/GitLab/Bitbucket. It can be the repo root or a subfolder.
2. In Vercel, **Add New → Project → Import**. If the code is in a subfolder set **Root Directory**
   (e.g. `maprizz`). Framework preset is detected as Next.js; no build overrides needed.
3. **Settings → Environment Variables**: add everything from section 2 for Production (and Preview
   if you want previews to use test-mode Stripe and a separate Supabase project).
4. Deploy. Then add the Stripe webhook endpoint (section 5) pointing at the production URL and set
   `STRIPE_WEBHOOK_SECRET`; redeploy or use "Redeploy with existing build cache" so functions pick it
   up.
5. In Supabase, add the Vercel production and preview URLs to **Auth → Redirect URLs**.

### Netlify (current host)

This folder is linked to the Netlify project `maprizz` (`.netlify/state.json`) and includes a
`netlify.toml`; Netlify's Next.js runtime handles the App Router, route handlers and server actions.
Connect the Git repository in the Netlify dashboard (Base directory `maprizz` if in a subfolder) and
set the same environment variables under **Site configuration → Environment variables**.

CLI deploys from a subfolder of a larger Git repo must be run from a standalone copy, otherwise the
CLI skips the server function and every route 404s:

```bash
rm -rf /tmp/maprizz-deploy && mkdir /tmp/maprizz-deploy
tar --exclude=.next --exclude=.netlify --exclude=.dev-data --exclude=node_modules -cf - . | (cd /tmp/maprizz-deploy && tar -xf -)
mkdir -p /tmp/maprizz-deploy/.netlify && cp .netlify/state.json /tmp/maprizz-deploy/.netlify/
cd /tmp/maprizz-deploy && git init -q && npm ci && npx netlify deploy --prod
```

## 11. Connecting maprizz.com

**Vercel:** Project → **Settings → Domains** → add `maprizz.com` and `www.maprizz.com`. At your
registrar (Namecheap → Advanced DNS) add an `A` record for `@` → `76.76.21.21` and a `CNAME` for
`www` → `cname.vercel-dns.com`, then set `www` to redirect to the apex in Vercel. SSL is automatic.

**Netlify:** Domain management → add `maprizz.com`; either use Netlify DNS or add an `A`/`ALIAS`
for the apex and a `CNAME` for `www` pointing at `maprizz.netlify.app`.

After DNS resolves, set `NEXT_PUBLIC_SITE_URL=https://maprizz.com` so short URLs and QR codes carry
the real domain (existing codes keep working — only the printed origin changes).

## 12. Project structure

```
src/
  app/
    (marketing)/   homepage, /demo, /order (+ success, mock-checkout), /audit, /privacy, /terms
    (bare)/        /p/[slug] profile, /login, /link-unavailable   (no site chrome)
    (card)/        /card, /c/[slug] referral landing pages        (no site chrome)
    (app)/         /dashboard/**, /admin/**                        (auth shell)
    t/[code]       tap redirect          r/[code]  review-stand redirect
    api/           checkout, stripe/webhook, qr/[code], qr-url, vcard/[businessId], upload, lead, card-lead, dev-files
    auth/callback  Supabase magic-link exchange
  components/      ui/, forms/, profile/, demo/, order/, app/, admin/, visuals/
  lib/
    env.ts         mode detection (mock vs real), site origin, admin emails
    db/            Db interface, Supabase implementation, JSON mock, seed, stats
    auth.ts        getSession / requireUser / requireAdmin / authorizeBusiness
    tap.ts         codes, slugs, short URLs, destination resolution, provisioning
    tap-handler.ts shared logic for /t and /r
    actions/       server actions for dashboard (business.ts) and admin (admin.ts)
    validation.ts  Zod schemas (URLs are normalized and restricted to http/https)
    packages.ts    the $49 / $79 / $149 catalog (single source of truth for prices)
    services.ts    monthly plan catalog ($299 / $599 / $799), lead interests, retainer copy
    tap-cards/     Joey referral cards, visits, leads (file store locally, Netlify Blobs in prod)
    stripe.ts, uploads.ts, qr.ts, mail.ts, seo.ts, site-config.ts, content.ts
  types/database.ts
supabase/          migrations/0001_init.sql, 0002_referral_slug.sql, 0003_lead_city.sql, seed.sql, config.toml
public/            static assets
```

## 13. Routes

| Route                              | Who       | Purpose                                                                 |
| ---------------------------------- | --------- | ----------------------------------------------------------------------- |
| `/`                                | public    | Landing: hero, how it works, mini demo, pricing, audit CTA, FAQ         |
| `/demo`                            | public    | Interactive tap demo (Cascade Auto Detail, labelled demo)               |
| `/order`                           | public    | 7-step order wizard → Stripe Checkout → `/order/success`                |
| `/services`                        | public    | Monthly plans: Google Foundations, Website + Local SEO, Local Growth    |
| `/audit`                           | public    | Free business audit lead form → `lead_requests` (with plan interest)    |
| `/card`, `/c/[slug]`               | public    | Joey's tap-card landing page; unique slugs attribute leads to a referrer |
| `/p/[slug]`                        | public    | Digital business profile (iPhone-optimized)                             |
| `/t/[code]`, `/r/[code]`           | public    | Tap / review-stand redirects with event logging                         |
| `/api/vcard/[businessId]`          | public    | vCard download                                                          |
| `/api/qr/[code]`                   | public    | QR PNG/SVG for the short URL (`?format=svg&download=1&size=1024`)       |
| `/login`, `/auth/callback`         | public    | Magic-link login (dev login in mock mode)                               |
| `/dashboard`, `/dashboard/[id]/**` | customer  | Analytics (card vs review taps, 7/30 days, daily chart), edit business, profile, destinations, QR |
| `/admin/sell`                      | admin     | Field sales: create customer + order + links in one screen; Take Payment |
| `/admin/orders`, `/admin/orders/[id]` | admin  | Fulfillment queue, statuses, printable fulfillment sheet                |
| `/admin/businesses`, `/admin/businesses/[id]` | admin | Edit any business, profile and tap links; test links; download QR |
| `/admin/leads`                     | admin     | Audit requests                                                          |
| `/admin/cards`, `/admin/cards/[slug]` | admin  | Referral tap cards: taps, leads, conversion, copy URL, download QR      |
| `/api/checkout`, `/api/stripe/webhook`, `/api/upload`, `/api/lead`, `/api/card-lead`, `/api/qr-url` | server | Checkout, webhook, logo upload, leads, tap-card leads, admin QR |

## 14. Security model

- **Authorization on the server.** Every page and server action under `/dashboard` and `/admin`
  calls `requireUser()` / `requireAdmin()`; business access goes through `authorizeBusiness()`
  (owner or admin). UI visibility is never the only guard.
- **Row Level Security** is enabled on every table (`0001_init.sql`). Customers can read/update only
  their own rows; admins (via `is_admin()`) can access everything; anonymous users see nothing. The
  app's data layer uses the service-role key **after** those server-side checks, so RLS is defense in
  depth for any direct-to-Supabase access.
- **Input validation** with Zod everywhere data enters (`src/lib/validation.ts`). URLs are
  normalized and restricted to `http`/`https`; open redirects via `custom_url` cannot target
  `javascript:` or other schemes.
- **File uploads** (`src/lib/uploads.ts`): 4 MB limit, magic-byte sniffing for PNG/JPG/WEBP, SVG
  accepted only when free of scripts, event handlers and external references.
- **Stripe**: prices from the server catalog; webhook signatures verified; Stripe IDs stored on the
  order.
- **Mock mode** is disabled in production unless `MAPRIZZ_ALLOW_DEV_MODE=true` is set on purpose.
- **Privacy**: tap events store timestamp, referrer and user agent only.
