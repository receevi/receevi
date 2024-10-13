DROP POLICY IF EXISTS "Enable select for admin users and agent users to their contacts on contacts" ON "public"."contacts";
DROP POLICY IF EXISTS "Enable update for admin users and agent users to their contacts on contacts" ON "public"."contacts";
DROP POLICY IF EXISTS "Enable insert for admin users only on contacts" ON "public"."contacts";
DROP POLICY IF EXISTS "Enable delete for admin users only on contacts" ON "public"."contacts";


CREATE POLICY "Enable select for admin users and agent users to their contacts on contacts" ON "public"."contacts"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin' or ((select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'agent' and auth.uid() = assigned_to)
);

CREATE POLICY "Enable update for admin users and agent users to their contacts on contacts" ON "public"."contacts"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin' or ((select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'agent' and auth.uid() = assigned_to)
)
WITH CHECK (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin' or ((select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'agent' and auth.uid() = assigned_to)
);


CREATE POLICY "Enable insert for admin users only on contacts" ON "public"."contacts"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin'
);



CREATE POLICY "Enable delete for admin users only on contacts" ON "public"."contacts"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin'
);




DROP POLICY IF EXISTS "Enable select for admin users and agent users to their contacts on messages" ON "public"."messages";
DROP POLICY IF EXISTS "Enable update for admin users and agent users to their contacts on messages" ON "public"."messages";
DROP POLICY IF EXISTS "Enable insert for admin users and agent users to their contacts on messages" ON "public"."messages";
DROP POLICY IF EXISTS "Enable delete for admin users only on messages" ON "public"."messages";


CREATE POLICY "Enable select for admin users and agent users to their contacts on messages" ON "public"."messages"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin' or ((select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'agent' and chat_id in (select wa_id from contacts where auth.uid() = assigned_to))
);

CREATE POLICY "Enable update for admin users and agent users to their contacts on messages" ON "public"."messages"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin' or ((select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'agent' and chat_id in (select wa_id from contacts where auth.uid() = assigned_to))
)
WITH CHECK (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin' or ((select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'agent' and chat_id in (select wa_id from contacts where auth.uid() = assigned_to))
);


CREATE POLICY "Enable insert for admin users and agent users to their contacts on messages" ON "public"."messages"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin' or ((select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'agent' and chat_id in (select wa_id from contacts where auth.uid() = assigned_to))
);



CREATE POLICY "Enable delete for admin users only on messages" ON "public"."messages"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin'
);




DROP POLICY IF EXISTS "Enable all for admin users only on broadcast" ON "public"."broadcast";
DROP POLICY IF EXISTS "Enable all for admin users only on broadcast_contact" ON "public"."broadcast_contact";
DROP POLICY IF EXISTS "Enable all for admin users only on broadcast_batch" ON "public"."broadcast_batch";
DROP POLICY IF EXISTS "Enable all for admin users only on setup" ON "public"."setup";



CREATE POLICY "Enable all for admin users only on broadcast" ON "public"."broadcast"
AS PERMISSIVE FOR ALL
TO authenticated
USING (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin'
)
WITH CHECK (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin'
);

CREATE POLICY "Enable all for admin users only on broadcast_contact" ON "public"."broadcast_contact"
AS PERMISSIVE FOR ALL
TO authenticated
USING (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin'
)
WITH CHECK (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin'
);

CREATE POLICY "Enable all for admin users only on broadcast_batch" ON "public"."broadcast_batch"
AS PERMISSIVE FOR ALL
TO authenticated
USING (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin'
)
WITH CHECK (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin'
);

CREATE POLICY "Enable all for admin users only on setup" ON "public"."setup"
AS PERMISSIVE FOR ALL
TO authenticated
USING (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin'
)
WITH CHECK (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin'
);



DROP POLICY IF EXISTS "Enable all for admin users only on profiles" ON "public"."profiles";


CREATE POLICY "Enable all for admin users only on profiles" ON "public"."profiles"
AS PERMISSIVE FOR ALL
TO authenticated
USING (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin'
)
WITH CHECK (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin'
);





DROP POLICY IF EXISTS "Enable all for admin users only on user_roles" ON "public"."user_roles";


CREATE POLICY "Enable all for admin users only on user_roles" ON "public"."user_roles"
AS PERMISSIVE FOR ALL
TO authenticated
USING (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin'
)
WITH CHECK (
    (select auth.jwt() -> 'user_metadata' ->> 'custom_user_role') = 'admin'
);
