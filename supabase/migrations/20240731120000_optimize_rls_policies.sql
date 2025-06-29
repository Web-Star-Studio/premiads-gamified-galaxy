-- This migration optimizes Row Level Security (RLS) policies to improve query performance
-- by ensuring that authentication checks like `auth.uid()` are evaluated only once per query.
-- It also standardizes the administrator check to use `user_type = 'admin'`.

BEGIN;

-- Step 1: Optimize the is_admin() helper function.
-- This changes it to a stable SQL function for better inlining by the query planner.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND user_type = 'admin'
  );
$$;

-- Step 2: Optimize policies for the 'profiles' table.
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin());

-- Step 3: Optimize policies for the 'missions' table.
-- The policy "Participants can view active missions" from the report seems to be "Anyone can view active missions"
-- which doesn't use auth functions and needs no change.
-- We will fix the other ones.

DROP POLICY IF EXISTS "Anunciantes can manage their own missions" ON public.missions;
CREATE POLICY "Anunciantes can manage their own missions"
ON public.missions
FOR ALL
USING (
  (select auth.uid()) = advertiser_id AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (select auth.uid()) AND user_type = 'anunciante'
  )
);

DROP POLICY IF EXISTS "Admins can manage all missions" ON public.missions;
CREATE POLICY "Admins can manage all missions"
ON public.missions
FOR ALL
USING (public.is_admin());

-- Step 4: Optimize policies for the 'mission_submissions' table.
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.mission_submissions;
CREATE POLICY "Users can view their own submissions"
ON public.mission_submissions
FOR SELECT
USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own submissions" ON public.mission_submissions;
CREATE POLICY "Users can create their own submissions"
ON public.mission_submissions
FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Anunciantes can view submissions for their missions" ON public.mission_submissions;
CREATE POLICY "Anunciantes can view submissions for their missions"
ON public.mission_submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.missions m
    WHERE m.id = mission_id AND m.advertiser_id = (select auth.uid()) AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND user_type = 'anunciante'
    )
  )
);

DROP POLICY IF EXISTS "Anunciantes can update submissions for their missions" ON public.mission_submissions;
CREATE POLICY "Anunciantes can update submissions for their missions"
ON public.mission_submissions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.missions m
    WHERE m.id = mission_id AND m.advertiser_id = (select auth.uid()) AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND user_type = 'anunciante'
    )
  )
);

DROP POLICY IF EXISTS "Admins can manage all submissions" ON public.mission_submissions;
CREATE POLICY "Admins can manage all submissions"
ON public.mission_submissions
FOR ALL
USING (public.is_admin());


-- Step 5: Optimize policies for 'lotteries' and related tables, unifying admin checks.
-- Note: These policies used 'role = 'admin'', which is being standardized to 'user_type = 'admin'' via is_admin().
DROP POLICY IF EXISTS "Only admins can create lotteries" ON public.lotteries;
CREATE POLICY "Only admins can create lotteries" ON public.lotteries
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can update lotteries" ON public.lotteries;
CREATE POLICY "Only admins can update lotteries" ON public.lotteries
  FOR UPDATE
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete lotteries" ON public.lotteries;
CREATE POLICY "Only admins can delete lotteries" ON public.lotteries
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Users can view their own participations" ON public.lottery_participants;
CREATE POLICY "Users can view their own participations" ON public.lottery_participants
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()) OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert their own participations" ON public.lottery_participants;
CREATE POLICY "Users can insert their own participations" ON public.lottery_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own participations" ON public.lottery_participants;
CREATE POLICY "Users can update their own participations" ON public.lottery_participants
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Only admins can insert lottery winners" ON public.lottery_winners;
CREATE POLICY "Only admins can insert lottery winners" ON public.lottery_winners
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());


-- Step 6: Optimize policies for the 'rifa_purchases' table.
DROP POLICY IF EXISTS "Users can view their own rifa purchases" ON public.rifa_purchases;
CREATE POLICY "Users can view their own rifa purchases"
ON public.rifa_purchases FOR SELECT
USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own rifa purchases" ON public.rifa_purchases;
CREATE POLICY "Users can create their own rifa purchases"
ON public.rifa_purchases FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

COMMIT; 