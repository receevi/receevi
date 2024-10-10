drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.raw_user_meta_data ->> 'first_name' is not null and new.raw_user_meta_data ->> 'last_name' is not null then
  insert into public.profiles (id, email, first_name, last_name, last_updated)
    values (new.id, new.email, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', now());
  end if;
  if new.raw_user_meta_data ->> 'custom_user_role' is not null then
    insert into public.user_roles (user_id, role)
    values (new.id,
            cast(new.raw_user_meta_data ->> 'custom_user_role' as public.app_role));
  end if;

  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
