-- City / service area on free-audit leads.
alter table lead_requests
  add column if not exists city text;
