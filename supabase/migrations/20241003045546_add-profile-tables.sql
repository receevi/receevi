create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email varchar,
  first_name text,
  last_name text,

  primary key (id)
);

alter table public.profiles enable row level security;
CREATE POLICY "Enable all for admin users only on profiles" ON "public"."profiles"
AS PERMISSIVE FOR ALL
TO authenticated
USING (
    (select auth.jwt() ->> 'user_role') = 'admin'
)
WITH CHECK (
    (select auth.jwt() ->> 'user_role') = 'admin'
);
