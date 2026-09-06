# Open this Maprizz copy in Cursor

This package is the **full latest Maprizz app**, not the marketing-only site currently on GitHub.

It includes:

- Dashboard, admin, Stripe, Supabase, order wizard, tap analytics
- Tap-card referrals (`/card`, `/c/[slug]`, Admin → Tap Cards)
- Growth-plan redesign: Google Foundations **$299**, Website + Local SEO **$599**, Local Growth **$799**
- Honest delivery limits and 6-month website terms
- City / service area on audit and tap-card leads

Card prices are still $49 / $79 / $149.

## What’s in this folder

| File | What it is |
| --- | --- |
| `maprizz-full-latest.zip` | Source you can unzip and open |
| `maprizz-full-latest.bundle` | Git history (optional, keeps our commits) |
| `HOW-TO-OPEN-MAPRIZZ.md` | These instructions |

## Option A — Zip (easiest)

1. Download `maprizz-full-latest.zip`.
2. Unzip it. You should get a folder named `maprizz`.
3. In Cursor: **File → Open Folder** → choose that `maprizz` folder.
4. In the terminal:

```bash
npm install
npm run dev
```

5. Open http://localhost:3000

There is no `.env` in the zip (secrets were never included). Copy `.env.example` to `.env.local` only if you want Stripe/Supabase. Without those, it runs in mock mode with a development login.

## Option B — Git bundle (keeps commit history)

```bash
git clone maprizz-full-latest.bundle maprizz
cd maprizz
git checkout cursor/growth-plan-pricing-0260
```

Then open the `maprizz` folder in Cursor and run `npm install` / `npm run dev` as above.

## Put it on your GitHub repo

GitHub `Joeflowcode/maprizz` currently has a **marketing-only** recovery. This package should **replace** that, not merge into it.

From the unzipped or cloned folder:

```bash
git init
git add .
git commit -m "Add full Maprizz app with growth-plan pricing"
git branch -M main
git remote add origin https://github.com/Joeflowcode/maprizz.git
git push -u origin main --force
```

`--force` overwrites the stub on `main`. Only do that if you are sure you want this full app as the real repo.

If you used the git bundle, you already have commits. Then:

```bash
git remote remove origin
git remote add origin https://github.com/Joeflowcode/maprizz.git
git checkout -B main
git push -u origin main --force
```

After it is on GitHub, start a new Cursor Cloud Agent **attached to `Joeflowcode/maprizz`** and keep working from there.

## Production notes

- Apply `supabase/migrations/0003_lead_city.sql` before using the city field against a live database.
- Apply `0002_referral_slug.sql` if that column is not already there.
- Set `NEXT_PUBLIC_JOEY_PHONE` and `NEXT_PUBLIC_JOEY_INSTAGRAM` for tap-card CTAs.
- Do not treat the current GitHub `main` as the product until you have replaced it with this tree.
