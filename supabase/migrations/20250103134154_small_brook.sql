-- Create function to handle user_data creation on user signup
CREATE OR REPLACE FUNCTION public.create_user_data()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_data (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can access own data" ON public.user_data;
DROP POLICY IF EXISTS "Enable insert for signup" ON public.user_data;

-- Create new policies
CREATE POLICY "Users can access own data"
    ON public.user_data FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Enable insert for signup"
    ON public.user_data FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own data"
    ON public.user_data FOR UPDATE
    USING (user_id = auth.uid());

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_user_created ON public.users;
CREATE TRIGGER on_user_created
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_data();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON public.user_data TO anon;
GRANT ALL ON public.users TO anon;