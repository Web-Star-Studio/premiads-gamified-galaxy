-- Row Level Security (RLS) policies for the profiles table

-- First, enable RLS on profiles table if not already enabled
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for profiles if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND user_type = 'admin'
  );
END;
$$;

-- 1. Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- 3. Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin() = true);

-- 4. Admins can update all profiles
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (is_admin() = true);

-- 5. Anunciantes can view inactive user profiles for moderation
-- This policy already exists, so we're commenting it out
/*
CREATE POLICY "Anunciantes can view profiles for moderation"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND user_type = 'anunciante'
  )
);
*/

-- Enable RLS on missions table
ALTER TABLE IF EXISTS public.missions ENABLE ROW LEVEL SECURITY;

-- Create policies for missions
DROP POLICY IF EXISTS "Anyone can view active missions" ON public.missions;
DROP POLICY IF EXISTS "Anunciantes can manage their own missions" ON public.missions;
DROP POLICY IF EXISTS "Admins can manage all missions" ON public.missions;

-- 1. Anyone can view active missions
CREATE POLICY "Anyone can view active missions"
ON public.missions
FOR SELECT
USING (is_active = true);

-- 2. Anunciantes can manage their own missions
CREATE POLICY "Anunciantes can manage their own missions"
ON public.missions
FOR ALL
USING (
  auth.uid() = advertiser_id AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND user_type = 'anunciante'
  )
);

-- 3. Admins can manage all missions
CREATE POLICY "Admins can manage all missions"
ON public.missions
FOR ALL
USING (is_admin() = true);

-- Enable RLS on mission_submissions table
ALTER TABLE IF EXISTS public.mission_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for mission_submissions
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.mission_submissions;
DROP POLICY IF EXISTS "Users can create their own submissions" ON public.mission_submissions;
DROP POLICY IF EXISTS "Anunciantes can view submissions for their missions" ON public.mission_submissions;
DROP POLICY IF EXISTS "Admins can manage all submissions" ON public.mission_submissions;

-- 1. Users can view their own submissions
CREATE POLICY "Users can view their own submissions"
ON public.mission_submissions
FOR SELECT
USING (auth.uid() = user_id);

-- 2. Users can create their own submissions
CREATE POLICY "Users can create their own submissions"
ON public.mission_submissions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Anunciantes can view submissions for their missions
CREATE POLICY "Anunciantes can view submissions for their missions"
ON public.mission_submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM missions m
    WHERE m.id = mission_id AND m.advertiser_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'anunciante'
    )
  )
);

-- 4. Anunciantes can update submissions for their missions
CREATE POLICY "Anunciantes can update submissions for their missions"
ON public.mission_submissions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM missions m
    WHERE m.id = mission_id AND m.advertiser_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'anunciante'
    )
  )
);

-- 5. Admins can manage all submissions
CREATE POLICY "Admins can manage all submissions"
ON public.mission_submissions
FOR ALL
USING (is_admin() = true);
