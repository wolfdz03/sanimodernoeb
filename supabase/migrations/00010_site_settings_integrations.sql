-- Editable integration/config settings (email, URLs, API keys)
alter table public.site_settings
  add column if not exists email_from text,
  add column if not exists site_url text,
  add column if not exists resend_api_key text,
  add column if not exists mistral_api_key text;
