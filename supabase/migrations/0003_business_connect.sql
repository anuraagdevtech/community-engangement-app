-- Mohalla — Business Connect
-- Adds retail/food_beverage categories, a website field, and resident→business follows.

-- ─────────────────────────────────────────────────────────────
-- Extend service_providers with website + new categories
-- ─────────────────────────────────────────────────────────────
alter table public.service_providers
  add column if not exists website text;

-- Widen the category check to include the two new business types
alter table public.service_providers
  drop constraint if exists service_providers_category_check;

alter table public.service_providers
  add constraint service_providers_category_check
  check (category in (
    'home_services', 'health', 'education', 'community_faith', 'government',
    'retail', 'food_beverage'
  ));

-- ─────────────────────────────────────────────────────────────
-- business_follows — residents follow local businesses/providers
-- ─────────────────────────────────────────────────────────────
create table if not exists public.business_follows (
  follower_id  uuid not null references public.profiles (id) on delete cascade,
  provider_id  uuid not null references public.service_providers (id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (follower_id, provider_id)
);

alter table public.business_follows enable row level security;

create policy "residents can read their own follows"
  on public.business_follows for select
  to authenticated
  using (auth.uid() = follower_id);

create policy "residents can follow a business"
  on public.business_follows for insert
  to authenticated
  with check (auth.uid() = follower_id);

create policy "residents can unfollow a business"
  on public.business_follows for delete
  to authenticated
  using (auth.uid() = follower_id);

-- ─────────────────────────────────────────────────────────────
-- RPC: providers followed by the current user, with geo-distance
-- ─────────────────────────────────────────────────────────────
create or replace function public.followed_providers(
  lat double precision,
  lng double precision
)
returns table (
  id               uuid,
  name             text,
  category         text,
  description      text,
  phone            text,
  website          text,
  address          text,
  lat              double precision,
  lng              double precision,
  verification_tier smallint,
  image_url        text,
  rating_avg       numeric,
  rating_count     integer,
  distance_m       double precision
)
language sql
stable
security definer
set search_path = public
as $$
  select
    sp.id, sp.name, sp.category, sp.description, sp.phone, sp.website, sp.address,
    st_y(sp.location::geometry) as lat,
    st_x(sp.location::geometry) as lng,
    sp.verification_tier, sp.image_url, sp.rating_avg, sp.rating_count,
    st_distance(sp.location, st_makepoint(lng, lat)::geography) as distance_m
  from public.business_follows bf
  join public.service_providers sp on sp.id = bf.provider_id
  where bf.follower_id = auth.uid()
  order by bf.created_at desc;
$$;

grant execute on function public.followed_providers to authenticated;

-- ─────────────────────────────────────────────────────────────
-- Update nearby_providers to surface the website field
-- ─────────────────────────────────────────────────────────────
create or replace function public.nearby_providers(
  lat double precision,
  lng double precision,
  radius_m integer default 3000,
  category_filter text default null
)
returns table (
  id               uuid,
  name             text,
  category         text,
  description      text,
  phone            text,
  website          text,
  address          text,
  lat              double precision,
  lng              double precision,
  verification_tier smallint,
  image_url        text,
  rating_avg       numeric,
  rating_count     integer,
  distance_m       double precision
)
language sql
stable
as $$
  select
    sp.id, sp.name, sp.category, sp.description, sp.phone, sp.website, sp.address,
    st_y(sp.location::geometry) as lat,
    st_x(sp.location::geometry) as lng,
    sp.verification_tier, sp.image_url, sp.rating_avg, sp.rating_count,
    st_distance(sp.location, st_makepoint(lng, lat)::geography) as distance_m
  from public.service_providers sp
  where st_dwithin(sp.location, st_makepoint(lng, lat)::geography, radius_m)
    and (category_filter is null or sp.category = category_filter)
  order by distance_m asc;
$$;

-- ─────────────────────────────────────────────────────────────
-- Update get_provider to surface the website field
-- ─────────────────────────────────────────────────────────────
create or replace function public.get_provider(provider_id uuid)
returns table (
  id               uuid,
  owner_id         uuid,
  name             text,
  category         text,
  description      text,
  phone            text,
  website          text,
  address          text,
  lat              double precision,
  lng              double precision,
  verification_tier smallint,
  image_url        text,
  rating_avg       numeric,
  rating_count     integer,
  created_at       timestamptz
)
language sql
stable
as $$
  select
    sp.id, sp.owner_id, sp.name, sp.category, sp.description, sp.phone, sp.website, sp.address,
    st_y(sp.location::geometry) as lat,
    st_x(sp.location::geometry) as lng,
    sp.verification_tier, sp.image_url, sp.rating_avg, sp.rating_count, sp.created_at
  from public.service_providers sp
  where sp.id = provider_id;
$$;
