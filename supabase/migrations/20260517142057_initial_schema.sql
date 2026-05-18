-- watchlist_items
create table watchlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  coin_id text not null,
  position integer not null default 0,
  added_at timestamptz default now()
);

-- alerts
create table alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  coin_id text not null,
  condition text check (condition in ('above', 'below')) not null,
  target_price numeric not null,
  status text check (status in ('active', 'triggered', 'dismissed')) not null default 'active',
  created_at timestamptz default now(),
  triggered_at timestamptz
);

-- RLS for watchlist_items
alter table watchlist_items enable row level security;
create policy "Users manage own watchlist" on watchlist_items
  for all using (auth.uid() = user_id);

-- RLS for alerts
alter table alerts enable row level security;
create policy "Users manage own alerts" on alerts
  for all using (auth.uid() = user_id);
