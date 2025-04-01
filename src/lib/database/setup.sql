-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Drop existing bucket if it exists
DROP TABLE IF EXISTS storage.buckets CASCADE;

-- Create buckets table
CREATE TABLE IF NOT EXISTS storage.buckets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  owner UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  public BOOLEAN DEFAULT FALSE,
  avif_autodetection BOOLEAN DEFAULT FALSE,
  file_size_limit BIGINT,
  allowed_mime_types TEXT[]
);

-- Create objects table
CREATE TABLE IF NOT EXISTS storage.objects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bucket_id TEXT NOT NULL REFERENCES storage.buckets(id),
  name TEXT NOT NULL,
  owner UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  path_tokens TEXT[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED,
  UNIQUE (bucket_id, name)
);

-- Enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create sessions table
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

-- Enable RLS on menu_images
ALTER TABLE public.menu_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.menu_images;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.menu_images;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.menu_images;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.menu_images;
DROP POLICY IF EXISTS "Public Access" ON storage.buckets;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Download" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Create policies for menu_images
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

-- Create policies for storage.buckets
CREATE POLICY "Public Access"
ON storage.buckets FOR ALL
USING (true)
WITH CHECK (true);

-- Create policies for storage.objects
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public Download"
ON storage.objects FOR SELECT
USING (true);

CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_menu_images_session_id 
ON public.menu_images(session_id);

CREATE INDEX IF NOT EXISTS idx_menu_images_created_at 
ON public.menu_images(created_at);

-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-images',
  'menu-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types,
  updated_at = NOW();