create unique index if not exists businesses_owner_id_unique
  on public.businesses (owner_id)
  where owner_id is not null;
