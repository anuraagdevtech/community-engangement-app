-- Mohalla — broaden sign-up to Google, Facebook, and phone OTP.
-- Run this after 0001_init.sql. Provider-side setup (OAuth app credentials, SMS
-- provider) happens in the Supabase dashboard — see README.md.

-- Google/Facebook populate `full_name` / `name` / `avatar_url` in raw_user_meta_data
-- instead of our own `display_name` key; phone sign-ups have no email at all.
-- Fall back sensibly through all of them instead of always landing on "Neighbour".
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Neighbour'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;
