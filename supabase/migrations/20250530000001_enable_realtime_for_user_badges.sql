
-- Enable realtime for user_badges table
ALTER PUBLICATION supabase_realtime ADD TABLE user_badges;

-- Create publication policy for user_badges
CREATE POLICY "Enable read access for all authenticated users" ON user_badges
  FOR SELECT TO authenticated USING (true);

-- Create policy to allow users to see their own badges
CREATE POLICY "Users can view their own badges" ON user_badges
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime for loot_box_rewards table
ALTER PUBLICATION supabase_realtime ADD TABLE loot_box_rewards;

-- Create publication policy for loot_box_rewards
CREATE POLICY "Enable read access for authenticated users" ON loot_box_rewards
  FOR SELECT TO authenticated USING (true);

-- Create policy to allow users to see their own loot boxes
CREATE POLICY "Users can view their own loot boxes" ON loot_box_rewards
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Set up RLS for user_badges if not already enabled
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Set up RLS for loot_box_rewards if not already enabled
ALTER TABLE loot_box_rewards ENABLE ROW LEVEL SECURITY; 
