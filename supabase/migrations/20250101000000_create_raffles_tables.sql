-- Enable the pg_cron extension if it's not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the lotteries table
CREATE TABLE IF NOT EXISTS public.lotteries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  detailed_description TEXT NOT NULL,
  prize_type VARCHAR(100) NOT NULL,
  prize_value DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  draw_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  numbers_total INTEGER NOT NULL,
  points_per_number INTEGER NOT NULL,
  min_points INTEGER NOT NULL DEFAULT 0,
  number_range JSONB NOT NULL DEFAULT '{"min": 1, "max": 10000}'::jsonb,
  is_auto_scheduled BOOLEAN NOT NULL DEFAULT true,
  winner JSONB,
  winning_number INTEGER,
  progress INTEGER NOT NULL DEFAULT 0,
  numbers_sold INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create the lottery participants table
CREATE TABLE IF NOT EXISTS public.lottery_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lottery_id UUID NOT NULL REFERENCES public.lotteries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  numbers INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(lottery_id, user_id)
);

-- Create the lottery winners table
CREATE TABLE IF NOT EXISTS public.lottery_winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lottery_id UUID NOT NULL REFERENCES public.lotteries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  winning_number INTEGER NOT NULL,
  prize_name VARCHAR(255) NOT NULL,
  prize_value DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(lottery_id)
);

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

-- Create a function to check raffle deadlines
CREATE OR REPLACE FUNCTION check_raffle_deadlines()
RETURNS VOID AS $$
BEGIN
  -- Update raffles that have reached their end date
  UPDATE public.lotteries
  SET status = 'completed'
  WHERE status = 'active'
  AND end_date <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Note: This function will be called by a scheduled Edge Function
-- instead of using pg_cron which might not be available in all tiers

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lotteries_updated_at
BEFORE UPDATE ON public.lotteries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lottery_participants_updated_at
BEFORE UPDATE ON public.lottery_participants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 