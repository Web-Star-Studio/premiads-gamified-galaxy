-- Alternative solution: Create a dedicated cashback-images bucket
-- Execute this if the previous solution doesn't work

-- Create a new bucket specifically for cashback images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cashback-images', 'cashback-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for the cashback-images bucket
CREATE POLICY "Allow advertisers to upload cashback images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cashback-images' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'anunciante'
  )
);

-- Public read access
CREATE POLICY "Public read access for cashback images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cashback-images');

-- Allow users to update their own uploads
CREATE POLICY "Allow users to update their own cashback uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'cashback-images' 
  AND auth.uid() = owner
);

-- Allow users to delete their own uploads
CREATE POLICY "Allow users to delete their own cashback uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'cashback-images' 
  AND auth.uid() = owner
); 