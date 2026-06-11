alter table public.businesses
  add column if not exists auto_reply_message text,
  add column if not exists booking_link text,
  add column if not exists auto_text_enabled boolean default true,
  add column if not exists twilio_connected boolean default false;
