-- Add review tracking columns to mission_submissions
ALTER TABLE public.mission_submissions
  ADD COLUMN IF NOT EXISTS second_instance boolean NOT NULL DEFAULT false;
ALTER TABLE public.mission_submissions
  ADD COLUMN IF NOT EXISTS second_instance_status text;
ALTER TABLE public.mission_submissions
  ADD COLUMN IF NOT EXISTS review_stage text;
