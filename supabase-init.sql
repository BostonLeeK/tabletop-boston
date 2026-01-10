create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists games (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  name_en text,
  short_description text,
  full_description text,
  description text not null,
  rating numeric(3,1) not null,
  min_players integer not null,
  max_players integer not null,
  play_time integer not null,
  image text,
  category_id uuid references categories(id) on delete set null,
  video_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table categories enable row level security;
alter table games enable row level security;

drop policy if exists "Allow public read access" on categories;
create policy "Allow public read access" on categories
  for select using (true);

drop policy if exists "Allow authenticated insert" on categories;
create policy "Allow authenticated insert" on categories
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated update" on categories;
create policy "Allow authenticated update" on categories
  for update using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated delete" on categories;
create policy "Allow authenticated delete" on categories
  for delete using (auth.role() = 'authenticated');

drop policy if exists "Allow public read access" on games;
create policy "Allow public read access" on games
  for select using (true);

drop policy if exists "Allow authenticated insert" on games;
create policy "Allow authenticated insert" on games
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated update" on games;
create policy "Allow authenticated update" on games
  for update using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated delete" on games;
create policy "Allow authenticated delete" on games
  for delete using (auth.role() = 'authenticated');

create index if not exists idx_games_category_id on games(category_id);
create index if not exists idx_games_rating on games(rating);
create index if not exists idx_games_created_at on games(created_at);

insert into storage.buckets (id, name, public)
values ('game-images', 'game-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read access for game images" on storage.objects;
create policy "Public read access for game images" on storage.objects
  for select
  using (bucket_id = 'game-images');

drop policy if exists "Authenticated upload access for game images" on storage.objects;
create policy "Authenticated upload access for game images"
on storage.objects for insert
with check (
  bucket_id = 'game-images' 
  and auth.role() = 'authenticated'
);

drop policy if exists "Authenticated update access for game images" on storage.objects;
create policy "Authenticated update access for game images"
on storage.objects for update
using (
  bucket_id = 'game-images' 
  and auth.role() = 'authenticated'
);

drop policy if exists "Authenticated delete access for game images" on storage.objects;
create policy "Authenticated delete access for game images"
on storage.objects for delete
using (
  bucket_id = 'game-images' 
  and auth.role() = 'authenticated'
);

