alter table public.lead_messages
  add column if not exists twilio_message_sid text,
  add column if not exists direction text default 'inbound';

alter table public.lead_messages
  alter column direction set default 'inbound';

update public.lead_messages
set direction = 'inbound'
where direction is null;

alter table public.lead_messages
  drop constraint if exists lead_messages_direction_check;

alter table public.lead_messages
  add constraint lead_messages_direction_check
  check (direction in ('inbound', 'outbound'));

create unique index if not exists lead_messages_twilio_message_sid_key
  on public.lead_messages (twilio_message_sid)
  where twilio_message_sid is not null;

create index if not exists lead_messages_direction_idx
  on public.lead_messages (direction);

alter table public.leads
  add column if not exists last_message_at timestamptz;

create index if not exists leads_last_message_at_desc_idx
  on public.leads (last_message_at desc);
