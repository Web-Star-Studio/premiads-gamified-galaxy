-- Create mission-attachments bucket for storing submission files
INSERT INTO storage.buckets (id, name, public)
VALUES ('mission-attachments', 'mission-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to mission-attachments
CREATE POLICY "Allow authenticated users to upload mission attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'mission-attachments'
  AND auth.uid() IS NOT NULL
);

-- Allow public read access to mission attachments
CREATE POLICY "Public read access for mission attachments"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'mission-attachments');

-- Allow users to update their own uploads
CREATE POLICY "Allow users to update their own mission attachments"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'mission-attachments' 
  AND auth.uid() = owner
)
WITH CHECK (
  bucket_id = 'mission-attachments' 
  AND auth.uid() = owner
);

-- Allow users to delete their own uploads
CREATE POLICY "Allow users to delete their own mission attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'mission-attachments' 
  AND auth.uid() = owner
);

-- Allow advertisers to view attachments for their missions
CREATE POLICY "Allow advertisers to view mission attachments for their missions"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'mission-attachments'
  AND (
    -- Allow file owner to view their own files
    auth.uid() = owner
    OR
    -- Allow advertisers to view files for their missions
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN missions m ON m.advertiser_id = p.id
      WHERE p.id = auth.uid() 
      AND p.user_type = 'anunciante'
      AND name LIKE 'submissions/' || m.id::text || '/%'
    )
    OR
    -- Allow admins to view all files
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.user_type = 'admin'
    )
  )
); 