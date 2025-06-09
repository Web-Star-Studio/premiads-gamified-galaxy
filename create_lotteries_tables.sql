-- Create the lotteries table if it doesn't exist
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

-- Create the lottery participants table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.lottery_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lottery_id UUID NOT NULL REFERENCES public.lotteries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  numbers INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(lottery_id, user_id)
);

-- Create the lottery winners table if it doesn't exist
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