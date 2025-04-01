-- First drop any conflicting policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can read all users" ON public.users;
    DROP POLICY IF EXISTS "Allow signup" ON public.users;
    DROP POLICY IF EXISTS "Users can update their own record" ON public.users;
    DROP POLICY IF EXISTS "Session access control" ON public.sessions;
EXCEPTION
    WHEN undefined_object THEN 
        NULL;
END $$;

-- Create new policies with proper type casting
CREATE POLICY "Users can read all users"
    ON public.users FOR SELECT
    USING (true);

CREATE POLICY "Allow signup"
    ON public.users FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own record"
    ON public.users FOR UPDATE
    USING (id::text = COALESCE(current_setting('request.jwt.claims', true)::json->>'user_id', ''));

CREATE POLICY "Session access control"
    ON public.sessions FOR ALL
    USING (
        user_id::text = COALESCE(current_setting('request.jwt.claims', true)::json->>'user_id', '')
    );

-- Recreate indexes with proper names
DROP INDEX IF EXISTS idx_users_username_new;
DROP INDEX IF EXISTS idx_sessions_user_id_new;
DROP INDEX IF EXISTS idx_sessions_expires_at_new;

CREATE INDEX IF NOT EXISTS idx_users_username_v2 ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id_v2 ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at_v2 ON public.sessions(expires_at);