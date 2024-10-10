ALTER TABLE "public"."contacts" 
ADD COLUMN "assigned_to" UUID REFERENCES "auth"."users" ("id") ON DELETE SET NULL;

DROP POLICY IF EXISTS "Enable all for authenticated users only on contacts" ON "public"."contacts";


CREATE POLICY "Enable select for admin users and agent users to their contacts on contacts" ON "public"."contacts"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (
    (select auth.jwt() ->> 'user_role') = 'admin' or ((select auth.jwt() ->> 'user_role') = 'agent' and auth.uid() = assigned_to)
);

CREATE POLICY "Enable update for admin users and agent users to their contacts on contacts" ON "public"."contacts"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (
    (select auth.jwt() ->> 'user_role') = 'admin' or ((select auth.jwt() ->> 'user_role') = 'agent' and auth.uid() = assigned_to)
)
WITH CHECK (
    (select auth.jwt() ->> 'user_role') = 'admin' or ((select auth.jwt() ->> 'user_role') = 'agent' and auth.uid() = assigned_to)
);


CREATE POLICY "Enable insert for admin users only on contacts" ON "public"."contacts"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (
    (select auth.jwt() ->> 'user_role') = 'admin'
);



CREATE POLICY "Enable delete for admin users only on contacts" ON "public"."contacts"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (
    (select auth.jwt() ->> 'user_role') = 'admin'
);


