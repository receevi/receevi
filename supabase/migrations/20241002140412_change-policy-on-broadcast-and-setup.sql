drop policy if exists "Enable all for authenticated users only on broadcast" on "public"."broadcast";
drop policy if exists "Enable all for authenticated users only on broadcast_contact" on "public"."broadcast_contact";
drop policy if exists "Enable all for authenticated users only on broadcast batch" on "public"."broadcast_batch";
drop policy if exists "Enable all for authenticated users only on setup" on "public"."setup";

CREATE POLICY "Enable all for admin users only on broadcast" ON "public"."broadcast"
AS PERMISSIVE FOR ALL
TO authenticated
USING (
    (select auth.jwt() ->> 'user_role') = 'admin'
)
WITH CHECK (
    (select auth.jwt() ->> 'user_role') = 'admin'
);

CREATE POLICY "Enable all for admin users only on broadcast_contact" ON "public"."broadcast_contact"
AS PERMISSIVE FOR ALL
TO authenticated
USING (
    (select auth.jwt() ->> 'user_role') = 'admin'
)
WITH CHECK (
    (select auth.jwt() ->> 'user_role') = 'admin'
);

CREATE POLICY "Enable all for admin users only on broadcast_batch" ON "public"."broadcast_batch"
AS PERMISSIVE FOR ALL
TO authenticated
USING (
    (select auth.jwt() ->> 'user_role') = 'admin'
)
WITH CHECK (
    (select auth.jwt() ->> 'user_role') = 'admin'
);

CREATE POLICY "Enable all for admin users only on setup" ON "public"."setup"
AS PERMISSIVE FOR ALL
TO authenticated
USING (
    (select auth.jwt() ->> 'user_role') = 'admin'
)
WITH CHECK (
    (select auth.jwt() ->> 'user_role') = 'admin'
);
