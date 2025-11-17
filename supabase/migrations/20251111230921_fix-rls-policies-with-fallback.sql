-- Fix RLS policies to work with Supabase SSR
-- Issue: auth.jwt() ->> 'user_role' doesn't always work in RLS context
-- Solution: Add fallback to check user_roles table directly

-- ========================================
-- CONTACTS TABLE POLICIES
-- ========================================

DROP POLICY IF EXISTS "Enable select for admin users and agent users to their contacts on contacts" ON "public"."contacts";

CREATE POLICY "Enable select for admin and agent users"
ON "public"."contacts"
FOR SELECT
TO authenticated
USING (
    -- Admin via JWT or user_roles table
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
    -- Agent via JWT or user_roles table (only for their assigned contacts)
    OR (
        (COALESCE((auth.jwt() ->> 'user_role') = 'agent', false)
         OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'agent'))
        AND auth.uid() = assigned_to
    )
);

DROP POLICY IF EXISTS "Enable update for admin users and agent users to their contacts on contacts" ON "public"."contacts";

CREATE POLICY "Enable update for admin and agent users"
ON "public"."contacts"
FOR UPDATE
TO authenticated
USING (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
    OR (
        (COALESCE((auth.jwt() ->> 'user_role') = 'agent', false)
         OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'agent'))
        AND auth.uid() = assigned_to
    )
)
WITH CHECK (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
    OR (
        (COALESCE((auth.jwt() ->> 'user_role') = 'agent', false)
         OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'agent'))
        AND auth.uid() = assigned_to
    )
);

DROP POLICY IF EXISTS "Enable insert for admin users only on contacts" ON "public"."contacts";

CREATE POLICY "Enable insert for admin users"
ON "public"."contacts"
FOR INSERT
TO authenticated
WITH CHECK (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
);

DROP POLICY IF EXISTS "Enable delete for admin users only on contacts" ON "public"."contacts";

CREATE POLICY "Enable delete for admin users"
ON "public"."contacts"
FOR DELETE
TO authenticated
USING (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
);

-- ========================================
-- MESSAGES TABLE POLICIES
-- ========================================

DROP POLICY IF EXISTS "Enable select for admin users and agent users to their contacts on messages" ON "public"."messages";

CREATE POLICY "Enable select for admin and agent users"
ON "public"."messages"
FOR SELECT
TO authenticated
USING (
    -- Admin via JWT or user_roles table
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
    -- Agent via JWT or user_roles table (only for their assigned contacts)
    OR (
        (COALESCE((auth.jwt() ->> 'user_role') = 'agent', false)
         OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'agent'))
        AND chat_id::text IN (SELECT wa_id::text FROM contacts WHERE auth.uid() = assigned_to)
    )
);

DROP POLICY IF EXISTS "Enable update for admin users and agent users to their contacts on messages" ON "public"."messages";

CREATE POLICY "Enable update for admin and agent users"
ON "public"."messages"
FOR UPDATE
TO authenticated
USING (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
    OR (
        (COALESCE((auth.jwt() ->> 'user_role') = 'agent', false)
         OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'agent'))
        AND chat_id::text IN (SELECT wa_id::text FROM contacts WHERE auth.uid() = assigned_to)
    )
)
WITH CHECK (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
    OR (
        (COALESCE((auth.jwt() ->> 'user_role') = 'agent', false)
         OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'agent'))
        AND chat_id::text IN (SELECT wa_id::text FROM contacts WHERE auth.uid() = assigned_to)
    )
);

DROP POLICY IF EXISTS "Enable insert for admin users and agent users to their contacts on messages" ON "public"."messages";

CREATE POLICY "Enable insert for admin and agent users"
ON "public"."messages"
FOR INSERT
TO authenticated
WITH CHECK (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
    OR (
        (COALESCE((auth.jwt() ->> 'user_role') = 'agent', false)
         OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'agent'))
        AND chat_id::text IN (SELECT wa_id::text FROM contacts WHERE auth.uid() = assigned_to)
    )
);

DROP POLICY IF EXISTS "Enable delete for admin users only on messages" ON "public"."messages";

CREATE POLICY "Enable delete for admin users"
ON "public"."messages"
FOR DELETE
TO authenticated
USING (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
);

-- ========================================
-- BROADCAST TABLE POLICIES
-- ========================================

DROP POLICY IF EXISTS "Enable all for admin users only on broadcast" ON "public"."broadcast";

CREATE POLICY "Enable all for admin users on broadcast"
ON "public"."broadcast"
FOR ALL
TO authenticated
USING (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
)
WITH CHECK (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
);

-- ========================================
-- BROADCAST_CONTACT TABLE POLICIES
-- ========================================

DROP POLICY IF EXISTS "Enable all for admin users only on broadcast_contact" ON "public"."broadcast_contact";

CREATE POLICY "Enable all for admin users on broadcast_contact"
ON "public"."broadcast_contact"
FOR ALL
TO authenticated
USING (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
)
WITH CHECK (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
);

-- ========================================
-- BROADCAST_BATCH TABLE POLICIES
-- ========================================

DROP POLICY IF EXISTS "Enable all for admin users only on broadcast_batch" ON "public"."broadcast_batch";

CREATE POLICY "Enable all for admin users on broadcast_batch"
ON "public"."broadcast_batch"
FOR ALL
TO authenticated
USING (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
)
WITH CHECK (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
);

-- ========================================
-- SETUP TABLE POLICIES
-- ========================================

DROP POLICY IF EXISTS "Enable all for admin users only on setup" ON "public"."setup";

CREATE POLICY "Enable all for admin users on setup"
ON "public"."setup"
FOR ALL
TO authenticated
USING (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
)
WITH CHECK (
    COALESCE((auth.jwt() ->> 'user_role') = 'admin', false)
    OR (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
);
