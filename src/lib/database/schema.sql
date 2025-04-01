-- Create sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create menu_images table
CREATE TABLE IF NOT EXISTS public.menu_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.sessions(id),
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size BIGINT NOT NULL,
  extracted_text TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.menu_images;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.menu_images
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.menu_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.menu_images;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.menu_images;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.menu_images;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.menu_images;

-- Create new policies
CREATE POLICY "Enable read access for all users" 
ON public.menu_images FOR SELECT 
USING (NOT is_deleted);

CREATE POLICY "Enable insert access for all users" 
ON public.menu_images FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users" 
ON public.menu_images FOR UPDATE 
USING (NOT is_deleted);

CREATE POLICY "Enable delete access for all users" 
ON public.menu_images FOR DELETE 
USING (is_deleted);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_menu_images_session_id 
ON public.menu_images(session_id);

CREATE INDEX IF NOT EXISTS idx_menu_images_created_at 
ON public.menu_images(created_at);