drop policy if exists "Enable select for authenticated users only" on "public"."contacts";
drop policy if exists "Enable select for authenticated users only" on "public"."messages";

CREATE POLICY "Enable all for authenticated users only on contacts" ON "public"."contacts"
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users only on messages" ON "public"."messages"
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
