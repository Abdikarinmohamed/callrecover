alter table public.leads
  add column if not exists twilio_call_sid text;

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
