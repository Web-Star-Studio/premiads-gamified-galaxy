-- Fix cashback image upload policy
-- Execute this manually in your Supabase dashboard

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Only admins can upload to raffle-images" ON storage.objects;

-- Create new policy allowing both admins and advertisers to upload
CREATE POLICY "Allow admins and advertisers to upload to raffle-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'raffle-images' 
  AND (
    -- Allow users with admin role
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
    OR
    -- Allow users with anunciante user_type
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'anunciante'
    )
  )
);

-- Also ensure public read access for raffle-images
CREATE POLICY IF NOT EXISTS "Public read access for raffle-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'raffle-images');

-- Allow users to update their own uploads
CREATE POLICY IF NOT EXISTS "Allow users to update their own raffle-images uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'raffle-images' 
  AND auth.uid() = owner
)
WITH CHECK (
  bucket_id = 'raffle-images' 
  AND auth.uid() = owner
);

-- Allow users to delete their own uploads
CREATE POLICY IF NOT EXISTS "Allow users to delete their own raffle-images uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'raffle-images' 
  AND auth.uid() = owner
); 