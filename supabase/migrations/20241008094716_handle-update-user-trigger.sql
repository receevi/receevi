drop trigger if exists on_auth_user_updated on auth.users;
drop function if exists public.handle_update_user;
create function public.handle_update_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.profiles
  set email = new.email,
      first_name = new.raw_user_meta_data ->> 'first_name',
      last_name = new.raw_user_meta_data ->> 'last_name',
      last_updated = now()
  where id = new.id;

  if new.raw_user_meta_data ->> 'custom_user_role' is not null then
    update public.user_roles
    set role = cast(new.raw_user_meta_data ->> 'custom_user_role' as public.app_role)
    where user_id = new.id;
  end if;
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_update_user();
