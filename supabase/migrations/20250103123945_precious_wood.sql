-- Drop the anonymous session function
DROP FUNCTION IF EXISTS create_anonymous_session();

-- Modify sessions table to require user_id
ALTER TABLE public.sessions 
ALTER COLUMN user_id SET NOT NULL;

-- Remove any existing anonymous sessions
DELETE FROM public.sessions 
WHERE user_id IS NULL;

-- Update sessions policies to strictly enforce user authentication
DROP POLICY IF EXISTS "Enable session management" ON public.sessions;
CREATE POLICY "Enable session management"
    ON public.sessions FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Update RLS policies for related tables to ensure user authentication
DROP POLICY IF EXISTS "Enable chat messages access" ON public.chat_messages;
CREATE POLICY "Enable chat messages access"
    ON public.chat_messages FOR ALL
    USING (
        EXISTS (
            SELECT 1 
            FROM public.sessions s
            WHERE s.id = chat_messages.session_id
            AND s.user_id = auth.uid()
            AND s.user_id IS NOT NULL
        )
    );

DROP POLICY IF EXISTS "Enable business reports access" ON public.business_reports;
CREATE POLICY "Enable business reports access"
    ON public.business_reports FOR ALL
    USING (
        EXISTS (
            SELECT 1 
            FROM public.sessions s
            WHERE s.id = business_reports.session_id
            AND s.user_id = auth.uid()
            AND s.user_id IS NOT NULL
        )
    );

DROP POLICY IF EXISTS "Users can manage own responses" ON public.responses;
CREATE POLICY "Users can manage own responses"
    ON public.responses FOR ALL
    USING (
        EXISTS (
            SELECT 1 
            FROM public.sessions s
            WHERE s.id = responses.session_id
            AND s.user_id = auth.uid()
            AND s.user_id IS NOT NULL
        )
    );

DROP POLICY IF EXISTS "Enable goals access" ON public.goals;
CREATE POLICY "Enable goals access"
    ON public.goals FOR ALL
    USING (
        EXISTS (
            SELECT 1 
            FROM public.sessions s
            WHERE s.id = goals.session_id
            AND s.user_id = auth.uid()
            AND s.user_id IS NOT NULL
        )
    );

-- Add constraints to ensure data integrity
ALTER TABLE public.sessions
ADD CONSTRAINT sessions_user_id_not_null CHECK (user_id IS NOT NULL);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id_expires
ON public.sessions(user_id, expires_at);

-- Clean up any orphaned data
DELETE FROM public.chat_messages
WHERE session_id NOT IN (SELECT id FROM public.sessions);

DELETE FROM public.business_reports
WHERE session_id NOT IN (SELECT id FROM public.sessions);

DELETE FROM public.responses
WHERE session_id NOT IN (SELECT id FROM public.sessions);

DELETE FROM public.goals
WHERE session_id NOT IN (SELECT id FROM public.sessions);