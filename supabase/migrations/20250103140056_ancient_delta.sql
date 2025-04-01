-- Drop existing session policies
DROP POLICY IF EXISTS "Session access control" ON public.sessions;
DROP POLICY IF EXISTS "Enable session management" ON public.sessions;

-- Create new session policies
CREATE POLICY "Enable session creation"
    ON public.sessions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can access own sessions"
    ON public.sessions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own sessions"
    ON public.sessions FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions"
    ON public.sessions FOR DELETE
    USING (user_id = auth.uid());

-- Ensure proper grants for sessions
GRANT ALL ON public.sessions TO anon, authenticated;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id_expires_v3 
ON public.sessions(user_id, expires_at);