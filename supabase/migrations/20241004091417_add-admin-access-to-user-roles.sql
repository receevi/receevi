grant all
  on table public.user_roles
to authenticated;


CREATE POLICY "Enable all for admin users only on user_roles" ON "public"."user_roles"
AS PERMISSIVE FOR ALL
TO authenticated
USING (
    (select auth.jwt() ->> 'user_role') = 'admin'
)
WITH CHECK (
    (select auth.jwt() ->> 'user_role') = 'admin'
);
