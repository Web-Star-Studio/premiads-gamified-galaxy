import { supabase } from '@/integrations/supabase/client';

export interface DailyStreakData {
  user_id: string;
  mission_id: string;
  current_streak?: number;
  max_streak?: number;
  last_completion_date: string;
  created_at?: string;
  updated_at?: string;
  id?: string;
}

export const upsertDailyStreak = async (data: DailyStreakData) => {
  try {
    const insertData = {
      user_id: data.user_id,
      mission_id: data.mission_id,
      current_streak: data.current_streak || 1,
      max_streak: data.max_streak || 1,
      last_completion_date: data.last_completion_date,
      created_at: data.created_at,
      id: data.id
    };

    const { data: result, error } = await supabase
      .from('daily_streaks')
      .upsert(insertData, {
        onConflict: 'user_id,mission_id'
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: result };
  } catch (error) {
    console.error('Error upserting daily streak:', error);
    return { success: false, error };
  }
};
