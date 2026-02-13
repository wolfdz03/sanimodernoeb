-- Admin email for new order notifications
alter table public.site_settings
  add column if not exists admin_notification_email text;
