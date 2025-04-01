-- Drop existing policies
DROP POLICY IF EXISTS "Users can access own data" ON public.user_data;
DROP POLICY IF EXISTS "Enable insert for signup" ON public.user_data;
DROP POLICY IF EXISTS "Users can update own data" ON public.user_data;

-- Create new policies with proper permissions
CREATE POLICY "Enable insert on signup"
    ON public.user_data FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can read own data"
    ON public.user_data FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own data"
    ON public.user_data FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Ensure proper grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_data TO anon, authenticated;

-- Update users table policies
DROP POLICY IF EXISTS "Users can read all users" ON public.users;
DROP POLICY IF EXISTS "Allow signup" ON public.users;

CREATE POLICY "Enable user signup"
    ON public.users FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can read all users"
    ON public.users FOR SELECT
    USING (true);

-- Ensure proper sequence permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;