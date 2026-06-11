create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  business_name text not null,
  contact_email text,
  phone_number text,
  timezone text default 'America/Phoenix',
  auto_reply_message text,
  booking_link text,
  auto_text_enabled boolean default true,
  twilio_connected boolean default false,
  created_at timestamptz default now()
);

alter table public.businesses
  add column if not exists auto_reply_message text,
  add column if not exists booking_link text,
  add column if not exists auto_text_enabled boolean default true,
  add column if not exists twilio_connected boolean default false;

create unique index if not exists businesses_owner_id_unique
  on public.businesses (owner_id)
  where owner_id is not null;

create table if not exists public.twilio_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  account_sid text not null,
  auth_token text not null,
  phone_number text not null,
  is_connected boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'twilio_settings_business_id_key'
      and conrelid = 'public.twilio_settings'::regclass
  ) then
    alter table public.twilio_settings
      add constraint twilio_settings_business_id_key unique (business_id);
  end if;
end;
$$;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_phone text not null,
  customer_name text,
  status text not null default 'new',
  source text not null default 'missed_call',
  twilio_call_sid text,
  missed_call_at timestamptz default now(),
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.leads
  add column if not exists twilio_call_sid text;

alter table public.leads
  drop constraint if exists leads_status_check;

alter table public.leads
  add constraint leads_status_check
  check (status in ('new', 'needs_reply', 'waiting', 'booked', 'closed', 'lost'));

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_twilio_call_sid_key'
      and conrelid = 'public.leads'::regclass
  ) then
    alter table public.leads
      add constraint leads_twilio_call_sid_key unique (twilio_call_sid);
  end if;
end;
$$;

create table if not exists public.lead_messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  sender text not null,
  body text not null,
  twilio_message_sid text,
  direction text default 'inbound',
  created_at timestamptz default now()
);

alter table public.lead_messages
  add column if not exists twilio_message_sid text,
  add column if not exists direction text default 'inbound';

alter table public.lead_messages
  alter column direction set default 'inbound';

update public.lead_messages
set direction = 'inbound'
where direction is null;

alter table public.lead_messages
  drop constraint if exists lead_messages_sender_check;

alter table public.lead_messages
  add constraint lead_messages_sender_check
  check (sender in ('business', 'customer', 'system'));

alter table public.lead_messages
  drop constraint if exists lead_messages_direction_check;

alter table public.lead_messages
  add constraint lead_messages_direction_check
  check (direction in ('inbound', 'outbound'));

create index if not exists leads_business_id_idx
  on public.leads (business_id);

create index if not exists leads_status_idx
  on public.leads (status);

create index if not exists leads_created_at_desc_idx
  on public.leads (created_at desc);

create index if not exists leads_last_message_at_desc_idx
  on public.leads (last_message_at desc);

create index if not exists lead_messages_lead_id_idx
  on public.lead_messages (lead_id);

create index if not exists lead_messages_created_at_idx
  on public.lead_messages (created_at);

create unique index if not exists lead_messages_twilio_message_sid_key
  on public.lead_messages (twilio_message_sid)
  where twilio_message_sid is not null;

create index if not exists lead_messages_direction_idx
  on public.lead_messages (direction);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
  before update on public.leads
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_twilio_settings_updated_at on public.twilio_settings;
create trigger set_twilio_settings_updated_at
  before update on public.twilio_settings
  for each row
  execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.twilio_settings enable row level security;
alter table public.leads enable row level security;
alter table public.lead_messages enable row level security;

drop policy if exists "Users can select their own profile" on public.profiles;
create policy "Users can select their own profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "Users can select their own businesses" on public.businesses;
create policy "Users can select their own businesses"
  on public.businesses
  for select
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists "Users can insert their own businesses" on public.businesses;
create policy "Users can insert their own businesses"
  on public.businesses
  for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "Users can update their own businesses" on public.businesses;
create policy "Users can update their own businesses"
  on public.businesses
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "Users can select own twilio settings" on public.twilio_settings;
create policy "Users can select own twilio settings"
  on public.twilio_settings
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.businesses
      where businesses.id = twilio_settings.business_id
        and businesses.owner_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own twilio settings" on public.twilio_settings;
create policy "Users can insert own twilio settings"
  on public.twilio_settings
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.businesses
      where businesses.id = twilio_settings.business_id
        and businesses.owner_id = auth.uid()
    )
  );

drop policy if exists "Users can update own twilio settings" on public.twilio_settings;
create policy "Users can update own twilio settings"
  on public.twilio_settings
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.businesses
      where businesses.id = twilio_settings.business_id
        and businesses.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.businesses
      where businesses.id = twilio_settings.business_id
        and businesses.owner_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own twilio settings" on public.twilio_settings;
create policy "Users can delete own twilio settings"
  on public.twilio_settings
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.businesses
      where businesses.id = twilio_settings.business_id
        and businesses.owner_id = auth.uid()
    )
  );

drop policy if exists "Users can select own leads" on public.leads;
create policy "Users can select own leads"
  on public.leads
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.businesses
      where businesses.id = leads.business_id
        and businesses.owner_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own leads" on public.leads;
create policy "Users can insert own leads"
  on public.leads
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.businesses
      where businesses.id = leads.business_id
        and businesses.owner_id = auth.uid()
    )
  );

drop policy if exists "Users can update own leads" on public.leads;
create policy "Users can update own leads"
  on public.leads
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.businesses
      where businesses.id = leads.business_id
        and businesses.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.businesses
      where businesses.id = leads.business_id
        and businesses.owner_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own leads" on public.leads;
create policy "Users can delete own leads"
  on public.leads
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.businesses
      where businesses.id = leads.business_id
        and businesses.owner_id = auth.uid()
    )
  );

drop policy if exists "Users can select own lead messages" on public.lead_messages;
create policy "Users can select own lead messages"
  on public.lead_messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.leads
      inner join public.businesses on businesses.id = leads.business_id
      where leads.id = lead_messages.lead_id
        and businesses.owner_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own lead messages" on public.lead_messages;
create policy "Users can insert own lead messages"
  on public.lead_messages
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.leads
      inner join public.businesses on businesses.id = leads.business_id
      where leads.id = lead_messages.lead_id
        and businesses.owner_id = auth.uid()
    )
  );

drop policy if exists "Users can update own lead messages" on public.lead_messages;
create policy "Users can update own lead messages"
  on public.lead_messages
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.leads
      inner join public.businesses on businesses.id = leads.business_id
      where leads.id = lead_messages.lead_id
        and businesses.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.leads
      inner join public.businesses on businesses.id = leads.business_id
      where leads.id = lead_messages.lead_id
        and businesses.owner_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own lead messages" on public.lead_messages;
create policy "Users can delete own lead messages"
  on public.lead_messages
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.leads
      inner join public.businesses on businesses.id = leads.business_id
      where leads.id = lead_messages.lead_id
        and businesses.owner_id = auth.uid()
    )
  );

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user_profile();
