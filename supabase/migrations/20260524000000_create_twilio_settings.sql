create extension if not exists "pgcrypto";

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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_twilio_settings_updated_at on public.twilio_settings;
create trigger set_twilio_settings_updated_at
  before update on public.twilio_settings
  for each row
  execute function public.set_updated_at();

alter table public.twilio_settings enable row level security;

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
