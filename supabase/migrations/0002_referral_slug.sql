-- Attribution for free-audit and tap-card leads (e.g. /c/jacqueline).
alter table lead_requests
  add column if not exists referral_slug text;
