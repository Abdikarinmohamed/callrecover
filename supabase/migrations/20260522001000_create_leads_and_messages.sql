create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_phone text not null,
  customer_name text,
  status text not null default 'new',
  source text not null default 'missed_call',
  missed_call_at timestamptz default now(),
  last_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.leads
  alter column status set default 'new',
  alter column source set default 'missed_call',
  alter column missed_call_at set default now(),
  alter column created_at set default now(),
  alter column updated_at set default now();

update public.leads
set status = 'waiting'
where status = 'contacted';

update public.leads
set status = 'new'
where status not in ('new', 'needs_reply', 'waiting', 'booked', 'closed', 'lost');

alter table public.leads
  drop constraint if exists leads_status_check;

alter table public.leads
  add constraint leads_status_check
  check (status in ('new', 'needs_reply', 'waiting', 'booked', 'closed', 'lost'));

create table if not exists public.lead_messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  sender text not null,
  body text not null,
  created_at timestamptz default now()
);

update public.lead_messages
set sender = 'system'
where sender not in ('business', 'customer', 'system');

alter table public.lead_messages
  drop constraint if exists lead_messages_sender_check;

alter table public.lead_messages
  add constraint lead_messages_sender_check
  check (sender in ('business', 'customer', 'system'));

create index if not exists leads_business_id_idx
  on public.leads (business_id);

create index if not exists leads_status_idx
  on public.leads (status);

create index if not exists leads_created_at_desc_idx
  on public.leads (created_at desc);

create index if not exists lead_messages_lead_id_idx
  on public.lead_messages (lead_id);

create index if not exists lead_messages_created_at_idx
  on public.lead_messages (created_at);

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

alter table public.leads enable row level security;
alter table public.lead_messages enable row level security;

drop policy if exists "Users can select leads for their businesses" on public.leads;
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

drop policy if exists "Users can insert leads for their businesses" on public.leads;
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

drop policy if exists "Users can update leads for their businesses" on public.leads;
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

drop policy if exists "Users can select messages for their business leads" on public.lead_messages;
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

drop policy if exists "Users can insert messages for their business leads" on public.lead_messages;
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

drop policy if exists "Users can update messages for their business leads" on public.lead_messages;
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
