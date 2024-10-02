DROP POLICY IF EXISTS "Enable all for authenticated users only on messages" ON "public"."messages";


CREATE POLICY "Enable select for admin users and agent users to their contacts on messages" ON "public"."messages"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (
    (select auth.jwt() ->> 'user_role') = 'admin' or ((select auth.jwt() ->> 'user_role') = 'agent' and chat_id in (select wa_id from contacts where auth.uid() = assigned_to))
);

CREATE POLICY "Enable update for admin users and agent users to their contacts on messages" ON "public"."messages"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (
    (select auth.jwt() ->> 'user_role') = 'admin' or ((select auth.jwt() ->> 'user_role') = 'agent' and chat_id in (select wa_id from contacts where auth.uid() = assigned_to))
)
WITH CHECK (
    (select auth.jwt() ->> 'user_role') = 'admin' or ((select auth.jwt() ->> 'user_role') = 'agent' and chat_id in (select wa_id from contacts where auth.uid() = assigned_to))
);


CREATE POLICY "Enable insert for admin users and agent users to their contacts on messages" ON "public"."messages"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (
    (select auth.jwt() ->> 'user_role') = 'admin' or ((select auth.jwt() ->> 'user_role') = 'agent' and chat_id in (select wa_id from contacts where auth.uid() = assigned_to))
);



CREATE POLICY "Enable delete for admin users only on messages" ON "public"."messages"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (
    (select auth.jwt() ->> 'user_role') = 'admin'
);


