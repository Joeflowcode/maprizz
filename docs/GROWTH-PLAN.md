# Maprizz: a practical route to $10k/month

Prepared September 6, 2026. Proposed positioning and pricing for review; this does not change existing customer agreements.

This document lives in the **full Maprizz app** (dashboard, admin, Stripe, Supabase, tap analytics, and tap-card referrals). Plan prices and honest delivery limits are implemented in `src/lib/services.ts`. Card prices stay in `src/lib/packages.ts`.

## The main decision

Lead with helping local businesses get found, trusted, and contacted. Use the free audit to start a service conversation. Keep tap cards as a useful entry product and add-on.

The two highest-priority conversion changes: make the service offer easier to understand, and make sure every inquiry is stored and reachable (audit form → `lead_requests` in Admin → Leads, plus email when Resend is configured).

## The offer (live in the app)

| Plan | Monthly price | Delivery boundaries |
| --- | ---: | --- |
| Google Foundations | $299 | One location; profile setup; 4 posts using client material; up to 20 review replies; one review stand; available profile activity report |
| Website + Local SEO | $599 | Up to 5 initial pages; hosting; service-area content within that allowance; up to 2 small content edits each month; quote/contact links; available analytics |
| Local Growth | $799 | Both plans, one smart card and one review stand total, one new or improved service page per month, monthly 30-minute call |

Setup is included. Google Foundations is month to month. The two website plans have a six-month initial term and then continue month to month. No ad spend is included. Card prices remain $49 / $79 / $149.

Before sending a proposal, define one “small edit” as one existing text/image/hours change of up to 30 minutes. New functionality, integrations, additional locations, and substantial rewrites require separate scope. Agree on who supplies photos/content and a launch date after access and materials are ready. Do not promise weekly photography visits, unlimited edits, instant replies, or unlimited pages.

These prices are a hypothesis to test with qualified prospects, not proven willingness to pay. Start with home-service businesses and contractors where a booked job can be valuable enough to justify ongoing marketing support. Offer the $299 scope when a business already has a suitable website or needs a smaller starting point.

## Revenue math

| Scenario | Active clients needed | Monthly revenue |
| --- | ---: | ---: |
| Previous $399 Growth Plan | 26 | $10,374 |
| Proposed $799 Local Growth | 13 | $10,387 |
| Mixed: 8 Local Growth, 4 Website, 5 Foundations | 17 total | $10,283 |

This is revenue, not take-home pay. Hardware, hosting, software, payment fees, contractors, delivery time, and taxes still have to be covered. Card orders and setup project income are not recurring revenue. Count paid, active clients rather than proposals or verbal commitments.

Capacity example, not a forecast: at 3–5 delivery hours per Growth client per month, 13 clients require 39–65 monthly delivery hours before sales/admin and new website builds. Track actual time on the first three clients. Limit concurrent website builds to two until delivery is repeatable.

## The next four weeks

1. Choose one main audience for prospecting: Bend-area contractors or home-service businesses. Keep the website broad enough for the barbers and shops you already meet.
2. Personally research and contact 10 relevant businesses per working day. Record one specific issue that is visible on each business's profile or website. Use your card demo as an opener when it fits; transition to the business problem.
3. Give interested owners a short audit with the three most useful fixes, screenshots when authorized, and a clear proposed scope. No invented SEO scores or ranking promises.
4. Follow up after two working days and again the following week, unless the person declines. Present one recommended plan and a smaller option only when it solves their problem.
5. Close and deliver for the first 2–3 clients, collect baseline measures, and document what changed. Ask permission to use finished work and an honest testimonial. Add real proof to the homepage as soon as it exists.

Illustrative funnel only: 200 relevant conversations × 20% accepting an audit × 20% of audits becoming clients = 8 new clients. Those rates are assumptions to replace with observed results; 200 attempts will not necessarily become 200 conversations. There is no promised timeline to $10k.

## Track every Friday

Qualified conversations → audit requests → completed audits → proposals → paid clients → active monthly revenue. Also track hours per client, total direct costs, cancellations, and why prospects say no. A strong-looking site supports sales; it does not create a reliable pipeline by itself.

For client reports, distinguish website clicks, calls/actions reported by platforms, form requests, review-link taps, public review counts, and confirmed booked jobs. Connect conversions where feasible and explain measurement limits. Google says local ranking depends on relevance, distance, and popularity; no one can pay Google for a better local ranking: https://support.google.com/business/answer/7091?hl=en

## Product notes (this codebase)

- Monthly prices and plan names: `src/lib/services.ts`
- Card catalog: `src/lib/packages.ts`
- Audit leads: `/audit` → `/api/lead` → `lead_requests` (Admin → Leads)
- Tap-card referrals: `/card`, `/c/[slug]`, Admin → Tap Cards
- Plan billing is still off-site (invoice or Stripe subscription link after the audit). No plan checkout in the app yet.
