-- Migration to remove min_purchase field from cashback_campaigns table
-- Execute this manually in your Supabase dashboard

-- Remove the min_purchase column from cashback_campaigns table
ALTER TABLE cashback_campaigns DROP COLUMN IF EXISTS min_purchase;

-- Optional: Also remove from missions table if needed
-- ALTER TABLE missions DROP COLUMN IF EXISTS min_purchase; 