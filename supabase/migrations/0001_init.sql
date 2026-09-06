-- Maprizz initial schema
-- Run with: supabase db push   (or paste into the Supabase SQL editor)

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
create type tap_link_type as enum ('business_card', 'review_stand', 'qr', 'other');
create type destination_type as enum ('profile', 'website', 'custom_url', 'google_review');
create type package_id as enum ('tap_card', 'smart_card', 'business_kit');
create type payment_status as enum ('unpaid', 'paid', 'cash', 'complimentary');
create type fulfillment_status as enum ('new', 'design', 'production', 'ready', 'delivered');
create type user_role as enum ('customer', 'admin');
create type order_source as enum ('web', 'field_sales');

-- ---------- Roles ----------
create table user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from user_roles where user_id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- Businesses ----------
create table businesses (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users (id) on delete set null,
  name text not null,
  slug text not null unique,
  logo_url text,
  contact_name text,
  phone text,
  email text,
  website_url text,
  address text,
  instagram_url text,
  facebook_url text,
  booking_url text,
  google_business_url text,
  google_review_url text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index businesses_owner_idx on businesses (owner_user_id);
create index businesses_email_idx on businesses (lower(email));

-- ---------- Profiles (digital business profile page) ----------
create table profiles (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references businesses (id) on delete cascade,
  enabled boolean not null default true,
  headline text,
  description text,
  theme text not null default 'dark' check (theme in ('dark', 'light')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Tap links (the permanent short URLs encoded on NFC chips) ----------
create table tap_links (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  code text not null unique check (code = upper(code) and length(code) between 4 and 12),
  type tap_link_type not null default 'business_card',
  destination_type destination_type not null default 'profile',
  destination_url text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tap_links_business_idx on tap_links (business_id);

-- ---------- Tap events (one row per tap/scan; deliberately minimal) ----------
create table tap_events (
  id uuid primary key default gen_random_uuid(),
  tap_link_id uuid not null references tap_links (id) on delete cascade,
  created_at timestamptz not null default now(),
  referrer text,
  user_agent text
);
create index tap_events_link_time_idx on tap_events (tap_link_id, created_at desc);

-- ---------- Orders ----------
create table orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses (id) on delete set null,
  customer_email text not null,
  package package_id not null,
  amount integer not null check (amount >= 0),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  payment_status payment_status not null default 'unpaid',
  fulfillment_status fulfillment_status not null default 'new',
  destination_type destination_type not null default 'profile',
  destination_url text,
  notes text,
  source order_source not null default 'web',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_business_idx on orders (business_id);
create index orders_status_idx on orders (fulfillment_status, created_at desc);

-- ---------- Lead requests (free audit form) ----------
create table lead_requests (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  contact_name text not null,
  phone text,
  email text not null,
  website text,
  google_business_url text,
  -- What they said they're interested in: not_sure | cards | gbp | website | growth
  interest text,
  notes text,
  created_at timestamptz not null default now()
);

-- ---------- updated_at triggers ----------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger businesses_updated_at before update on businesses for each row execute function set_updated_at();
create trigger profiles_updated_at before update on profiles for each row execute function set_updated_at();
create trigger tap_links_updated_at before update on tap_links for each row execute function set_updated_at();
create trigger orders_updated_at before update on orders for each row execute function set_updated_at();

-- ---------- Row Level Security ----------
-- The Next.js server uses the service role (bypasses RLS) and enforces authorization in
-- code. These policies protect the data from every other client: customers see only
-- their own rows, admins see everything, anonymous users see nothing except what the
-- public pages already expose (handled server-side, not via anon access).

alter table user_roles enable row level security;
alter table businesses enable row level security;
alter table profiles enable row level security;
alter table tap_links enable row level security;
alter table tap_events enable row level security;
alter table orders enable row level security;
alter table lead_requests enable row level security;

create policy "roles: read own" on user_roles for select using (auth.uid() = user_id or is_admin());

create policy "businesses: owner read" on businesses for select using (owner_user_id = auth.uid() or is_admin());
create policy "businesses: owner update" on businesses for update using (owner_user_id = auth.uid() or is_admin());
create policy "businesses: admin insert" on businesses for insert with check (is_admin());
create policy "businesses: admin delete" on businesses for delete using (is_admin());

create policy "profiles: owner read" on profiles for select
  using (exists (select 1 from businesses b where b.id = business_id and (b.owner_user_id = auth.uid() or is_admin())));
create policy "profiles: owner write" on profiles for update
  using (exists (select 1 from businesses b where b.id = business_id and (b.owner_user_id = auth.uid() or is_admin())));
create policy "profiles: admin insert" on profiles for insert with check (is_admin());

create policy "tap_links: owner read" on tap_links for select
  using (exists (select 1 from businesses b where b.id = business_id and (b.owner_user_id = auth.uid() or is_admin())));
create policy "tap_links: owner update" on tap_links for update
  using (exists (select 1 from businesses b where b.id = business_id and (b.owner_user_id = auth.uid() or is_admin())));
create policy "tap_links: admin insert" on tap_links for insert with check (is_admin());

create policy "tap_events: owner read" on tap_events for select
  using (exists (
    select 1 from tap_links l join businesses b on b.id = l.business_id
    where l.id = tap_link_id and (b.owner_user_id = auth.uid() or is_admin())
  ));

create policy "orders: owner read" on orders for select
  using (is_admin() or exists (select 1 from businesses b where b.id = business_id and b.owner_user_id = auth.uid()));
create policy "orders: admin write" on orders for all using (is_admin()) with check (is_admin());

create policy "leads: admin only" on lead_requests for all using (is_admin()) with check (is_admin());

-- ---------- Storage: logos ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('logos', 'logos', true, 4194304, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

create policy "logos: public read" on storage.objects for select using (bucket_id = 'logos');
-- Uploads go through the Next.js server (service role), so no anon insert policy is needed.
