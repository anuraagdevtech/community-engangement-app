-- Mohalla — initial schema
-- Run this in the Supabase SQL editor, or via `supabase db push` once linked.

create extension if not exists postgis with schema extensions;

-- ─────────────────────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Neighbour',
  avatar_url text,
  trust_tier smallint not null default 0 check (trust_tier between 0 and 2),
  karma_score integer not null default 0,
  home_geofence_id uuid,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by any signed-in resident"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- auto-create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', 'Neighbour'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- geofences — a saved point + radius (home address, a custom zone, …)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.geofences (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  pincode text,
  center geography(point, 4326) not null,
  radius_m integer not null default 1000,
  type text not null default 'home' check (type in ('home', 'custom')),
  created_by uuid references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.geofences enable row level security;

create policy "geofences are readable by any signed-in resident"
  on public.geofences for select
  to authenticated
  using (true);

create policy "users manage their own geofences"
  on public.geofences for all
  to authenticated
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

alter table public.profiles
  add constraint profiles_home_geofence_fk
  foreign key (home_geofence_id) references public.geofences (id) on delete set null;

-- ─────────────────────────────────────────────────────────────
-- posts — the neighbourhood feed
-- ─────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  channel text not null default 'general'
    check (channel in ('general', 'safety', 'buy_sell', 'lost_found', 'events')),
  title text not null,
  body text,
  location geography(point, 4326) not null,
  image_url text,
  moderation_state text not null default 'visible'
    check (moderation_state in ('visible', 'pending_review', 'hidden')),
  created_at timestamptz not null default now()
);

create index if not exists posts_location_gix on public.posts using gist (location);
create index if not exists posts_channel_idx on public.posts (channel);

alter table public.posts enable row level security;

create policy "visible posts are readable by any signed-in resident"
  on public.posts for select
  to authenticated
  using (moderation_state = 'visible' or author_id = auth.uid());

create policy "residents can create posts"
  on public.posts for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "authors manage their own posts"
  on public.posts for update
  to authenticated
  using (auth.uid() = author_id);

create policy "authors can delete their own posts"
  on public.posts for delete
  to authenticated
  using (auth.uid() = author_id);

-- ─────────────────────────────────────────────────────────────
-- service_providers — the local services directory
-- ─────────────────────────────────────────────────────────────
create table if not exists public.service_providers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles (id) on delete set null,
  name text not null,
  category text not null
    check (category in ('home_services', 'health', 'education', 'community_faith', 'government')),
  description text,
  phone text,
  address text,
  location geography(point, 4326) not null,
  verification_tier smallint not null default 0 check (verification_tier between 0 and 2),
  image_url text,
  rating_avg numeric(2, 1) not null default 0,
  rating_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists providers_location_gix on public.service_providers using gist (location);
create index if not exists providers_category_idx on public.service_providers (category);

alter table public.service_providers enable row level security;

create policy "providers are readable by any signed-in resident"
  on public.service_providers for select
  to authenticated
  using (true);

create policy "residents can list a provider"
  on public.service_providers for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "owners manage their own listing"
  on public.service_providers for update
  to authenticated
  using (auth.uid() = owner_id);

-- ─────────────────────────────────────────────────────────────
-- service_reviews
-- ─────────────────────────────────────────────────────────────
create table if not exists public.service_reviews (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.service_providers (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (provider_id, author_id)
);

alter table public.service_reviews enable row level security;

create policy "reviews are readable by any signed-in resident"
  on public.service_reviews for select
  to authenticated
  using (true);

create policy "residents can review a provider"
  on public.service_reviews for insert
  to authenticated
  with check (auth.uid() = author_id);

-- keep rating_avg / rating_count in sync
create or replace function public.refresh_provider_rating()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.service_providers p
  set rating_count = agg.cnt,
      rating_avg = agg.avg_rating
  from (
    select provider_id, count(*) as cnt, round(avg(rating)::numeric, 1) as avg_rating
    from public.service_reviews
    where provider_id = coalesce(new.provider_id, old.provider_id)
    group by provider_id
  ) agg
  where p.id = agg.provider_id;
  return coalesce(new, old);
end;
$$;

drop trigger if exists on_review_change on public.service_reviews;
create trigger on_review_change
  after insert or update or delete on public.service_reviews
  for each row execute procedure public.refresh_provider_rating();

-- ─────────────────────────────────────────────────────────────
-- geo RPCs — the radius queries the whole app is built around
-- ─────────────────────────────────────────────────────────────
create or replace function public.nearby_posts(
  lat double precision,
  lng double precision,
  radius_m integer default 1000,
  channel_filter text default null
)
returns table (
  id uuid,
  author_id uuid,
  channel text,
  title text,
  body text,
  lat double precision,
  lng double precision,
  image_url text,
  created_at timestamptz,
  distance_m double precision,
  author_display_name text,
  author_avatar_url text
)
language sql
stable
as $$
  select
    p.id, p.author_id, p.channel, p.title, p.body,
    st_y(p.location::geometry) as lat,
    st_x(p.location::geometry) as lng,
    p.image_url, p.created_at,
    st_distance(p.location, st_makepoint(lng, lat)::geography) as distance_m,
    pr.display_name as author_display_name,
    pr.avatar_url as author_avatar_url
  from public.posts p
  join public.profiles pr on pr.id = p.author_id
  where p.moderation_state = 'visible'
    and st_dwithin(p.location, st_makepoint(lng, lat)::geography, radius_m)
    and (channel_filter is null or p.channel = channel_filter)
  order by p.created_at desc;
$$;

create or replace function public.nearby_providers(
  lat double precision,
  lng double precision,
  radius_m integer default 3000,
  category_filter text default null
)
returns table (
  id uuid,
  name text,
  category text,
  description text,
  phone text,
  address text,
  lat double precision,
  lng double precision,
  verification_tier smallint,
  image_url text,
  rating_avg numeric,
  rating_count integer,
  distance_m double precision
)
language sql
stable
as $$
  select
    sp.id, sp.name, sp.category, sp.description, sp.phone, sp.address,
    st_y(sp.location::geometry) as lat,
    st_x(sp.location::geometry) as lng,
    sp.verification_tier, sp.image_url, sp.rating_avg, sp.rating_count,
    st_distance(sp.location, st_makepoint(lng, lat)::geography) as distance_m
  from public.service_providers sp
  where st_dwithin(sp.location, st_makepoint(lng, lat)::geography, radius_m)
    and (category_filter is null or sp.category = category_filter)
  order by distance_m asc;
$$;

create or replace function public.get_provider(provider_id uuid)
returns table (
  id uuid,
  owner_id uuid,
  name text,
  category text,
  description text,
  phone text,
  address text,
  lat double precision,
  lng double precision,
  verification_tier smallint,
  image_url text,
  rating_avg numeric,
  rating_count integer,
  created_at timestamptz
)
language sql
stable
as $$
  select
    sp.id, sp.owner_id, sp.name, sp.category, sp.description, sp.phone, sp.address,
    st_y(sp.location::geometry) as lat,
    st_x(sp.location::geometry) as lng,
    sp.verification_tier, sp.image_url, sp.rating_avg, sp.rating_count, sp.created_at
  from public.service_providers sp
  where sp.id = provider_id;
$$;

grant execute on function public.nearby_posts to authenticated;
grant execute on function public.nearby_providers to authenticated;
grant execute on function public.get_provider to authenticated;
