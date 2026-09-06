-- Recurring monthly plans (Stripe subscriptions)
create type retainer_plan as enum ('gbp', 'website', 'growth');
create type subscription_status as enum ('incomplete', 'active', 'past_due', 'canceled', 'unpaid');

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  plan retainer_plan not null,
  status subscription_status not null default 'incomplete',
  monthly_amount integer not null check (monthly_amount >= 0),
  customer_email text not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_checkout_session_id text unique,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_business_idx on subscriptions (business_id);
create index subscriptions_status_idx on subscriptions (status, created_at desc);

create trigger subscriptions_updated_at before update on subscriptions for each row execute function set_updated_at();

alter table subscriptions enable row level security;

create policy "subscriptions: owner read" on subscriptions for select
  using (is_admin() or exists (select 1 from businesses b where b.id = business_id and b.owner_user_id = auth.uid()));
create policy "subscriptions: admin write" on subscriptions for all using (is_admin()) with check (is_admin());
