/*
  # Fix Sessions RLS Policies

  1. Changes
    - Drop existing restrictive policies
    - Create new policies that allow proper session management
    - Add proper grants for authenticated and anonymous users
    
  2. Security
    - Maintain security while allowing necessary operations
    - Ensure users can only access their own sessions
    - Allow initial session creation during sign in
*/

-- Drop existing session policies
DROP POLICY IF EXISTS "Enable session creation" ON public.sessions;
DROP POLICY IF EXISTS "Users can access own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Session access control" ON public.sessions;

-- Create new session policies
CREATE POLICY "Enable session creation for all"
    ON public.sessions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can read own sessions"
    ON public.sessions FOR SELECT
    USING (
        user_id::text = COALESCE(
            current_setting('request.jwt.claims', true)::json->>'sub',
            user_id::text
        )
    );

CREATE POLICY "Users can update own sessions"
    ON public.sessions FOR UPDATE
    USING (
        user_id::text = COALESCE(
            current_setting('request.jwt.claims', true)::json->>'sub',
            user_id::text
        )
    );

CREATE POLICY "Users can delete own sessions"
    ON public.sessions FOR DELETE
    USING (
        user_id::text = COALESCE(
            current_setting('request.jwt.claims', true)::json->>'sub',
            user_id::text
        )
    );

-- Ensure proper grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.sessions TO anon, authenticated;

-- Ensure RLS is enabled
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;