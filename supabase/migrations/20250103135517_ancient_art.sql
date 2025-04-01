-- First drop any conflicting policies
DO $$ 
BEGIN
    -- Drop policies if they exist
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
    DROP POLICY IF EXISTS "Enable insert for signup" ON public.users;
    DROP POLICY IF EXISTS "Enable session management" ON public.sessions;
    DROP POLICY IF EXISTS "Users can update own record" ON public.users;
EXCEPTION
    WHEN undefined_object THEN 
        NULL;
END $$;

-- Ensure extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update users table structure if needed
DO $$ 
BEGIN
    -- Add any missing columns to users table
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'password'
    ) THEN
        ALTER TABLE public.users ADD COLUMN password TEXT NOT NULL DEFAULT '';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.users ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
END $$;

-- Update sessions table structure if needed
DO $$ 
BEGIN
    -- Add any missing columns to sessions table
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'sessions' AND column_name = 'expires_at'
    ) THEN
        ALTER TABLE public.sessions ADD COLUMN expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours');
    END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Users can read all users"
    ON public.users FOR SELECT
    USING (true);

CREATE POLICY "Allow signup"
    ON public.users FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own record"
    ON public.users FOR UPDATE
    USING (id = (SELECT user_id FROM public.sessions WHERE id = current_setting('request.jwt.claims')::json->>'session_id')::uuid);

CREATE POLICY "Session access control"
    ON public.sessions FOR ALL
    USING (user_id = (SELECT id FROM public.users WHERE id = current_setting('request.jwt.claims')::json->>'user_id')::uuid);

-- Create or update indexes
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_sessions_user_id;
DROP INDEX IF EXISTS idx_sessions_expires_at;

CREATE INDEX idx_users_username_new ON public.users(username);
CREATE INDEX idx_sessions_user_id_new ON public.sessions(user_id);
CREATE INDEX idx_sessions_expires_at_new ON public.sessions(expires_at);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.sessions TO anon, authenticated;