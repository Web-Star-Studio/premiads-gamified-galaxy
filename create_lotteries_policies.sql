-- Add RLS policies for lotteries
ALTER TABLE public.lotteries ENABLE ROW LEVEL SECURITY;

-- Anyone can view active lotteries
CREATE POLICY "Anyone can view active lotteries" ON public.lotteries
  FOR SELECT
  USING (status = 'active' OR status = 'completed');

-- Only admins can create lotteries
CREATE POLICY "Only admins can create lotteries" ON public.lotteries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update lotteries
CREATE POLICY "Only admins can update lotteries" ON public.lotteries
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete lotteries
CREATE POLICY "Only admins can delete lotteries" ON public.lotteries
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add RLS policies for lottery_participants
ALTER TABLE public.lottery_participants ENABLE ROW LEVEL SECURITY;

-- Users can view their own participations
CREATE POLICY "Users can view their own participations" ON public.lottery_participants
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can insert their own participations
CREATE POLICY "Users can insert their own participations" ON public.lottery_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own participations
CREATE POLICY "Users can update their own participations" ON public.lottery_participants
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Add RLS policies for lottery_winners
ALTER TABLE public.lottery_winners ENABLE ROW LEVEL SECURITY;

-- Anyone can view lottery winners
CREATE POLICY "Anyone can view lottery winners" ON public.lottery_winners
  FOR SELECT
  USING (true);

-- Only admins can insert lottery winners
CREATE POLICY "Only admins can insert lottery winners" ON public.lottery_winners
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  ); 