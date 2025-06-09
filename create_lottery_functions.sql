-- Create functions for lottery management
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update the updated_at column
CREATE TRIGGER update_lotteries_updated_at
BEFORE UPDATE ON public.lotteries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lottery_participants_updated_at
BEFORE UPDATE ON public.lottery_participants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

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

-- Set current user as admin
UPDATE public.profiles SET role = 'admin' WHERE id = auth.uid();

-- Display which tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'lotteries', 'lottery_participants', 'lottery_winners'); 