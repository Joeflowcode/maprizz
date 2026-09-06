-- Demo data: Cascade Auto Detail (fictional). Flagged is_demo so it never appears as a
-- customer. Keep in sync with src/lib/db/seed.ts.

insert into businesses (id, name, slug, contact_name, phone, email, website_url, address, instagram_url, booking_url, google_business_url, google_review_url, is_demo)
values (
  '00000000-0000-4000-8000-000000000001',
  'Cascade Auto Detail',
  'cascade-auto-detail',
  'Jordan Reyes',
  '+1 (541) 555-0148',
  'hello@cascadeautodetail.example',
  'https://cascadeautodetail.example',
  '1250 NE 3rd St, Bend, OR 97701',
  'https://instagram.com/cascadeautodetail',
  'https://cascadeautodetail.example/book',
  'https://maps.google.com/?cid=0000000000000000000',
  'https://search.google.com/local/writereview?placeid=DEMO_PLACE_ID',
  true
)
on conflict (id) do nothing;

insert into profiles (id, business_id, enabled, headline, description, theme)
values (
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000001',
  true,
  'Premium mobile detailing in Bend, Oregon.',
  'Interior, exterior, ceramic coatings and paint correction. We come to your driveway or office.',
  'dark'
)
on conflict (id) do nothing;

insert into tap_links (id, business_id, code, type, destination_type, enabled)
values
  ('00000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', 'DEMO01', 'business_card', 'profile', true),
  ('00000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', 'DEMO02', 'review_stand', 'google_review', true)
on conflict (id) do nothing;
