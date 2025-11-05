-- ============================================================================
-- Supabase Storage Setup for Profile Images
-- ============================================================================
-- Run this in your Supabase SQL Editor after running the main migrations

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for profile images
-- Allow authenticated users to upload their own profile image
CREATE POLICY "Users can upload their profile image"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to all profile images
CREATE POLICY "Public read access to profile images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-images');

-- Allow users to update their own images
CREATE POLICY "Users can update their own profile images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own profile images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Add profile_image_url column to profile_updates table
ALTER TABLE profile_updates
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profile_updates_image
ON profile_updates(profile_image_url)
WHERE profile_image_url IS NOT NULL;
