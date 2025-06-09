
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Serviços otimizados que aproveitam as novas políticas RLS consolidadas
export class OptimizedSupabaseService {
  
  // ==========================================
  // PROFILES - Otimizado com nova política
  // ==========================================
  
  static async getCurrentUserProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
  
  static async updateProfile(profileData: Partial<Database['public']['Tables']['profiles']['Update']>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ==========================================
  // MISSIONS - Aproveitando índices otimizados
  // ==========================================
  
  static async getActiveMissions() {
    const { data, error } = await supabase
      .from('missions')
      .select(`
        *,
        profiles!missions_advertiser_id_fkey(full_name, avatar_url)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  static async getUserMissions(userId: string) {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('advertiser_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // ==========================================
  // MISSION SUBMISSIONS - Política consolidada
  // ==========================================
  
  static async createMissionSubmission(submission: Database['public']['Tables']['mission_submissions']['Insert']) {
    const { data, error } = await supabase
      .from('mission_submissions')
      .insert(submission)
      .select(`
        *,
        missions(title, advertiser_id)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async getUserSubmissions(userId: string) {
    const { data, error } = await supabase
      .from('mission_submissions')
      .select(`
        *,
        missions(title, description, advertiser_id)
      `)
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  static async getAdvertiserSubmissions(advertiserId: string) {
    const { data, error } = await supabase
      .from('mission_submissions')
      .select(`
        *,
        missions!inner(title, advertiser_id),
        profiles!mission_submissions_user_id_fkey(full_name, email)
      `)
      .eq('missions.advertiser_id', advertiserId)
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // ==========================================
  // MISSION REWARDS - Otimizado para performance
  // ==========================================
  
  static async getUserRewards(userId: string) {
    const { data, error } = await supabase
      .from('mission_rewards')
      .select(`
        *,
        missions(title, type)
      `)
      .eq('user_id', userId)
      .order('rewarded_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // ==========================================
  // USER BADGES - Política pública otimizada
  // ==========================================
  
  static async getUserBadges(userId: string) {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        missions(title, type)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // ==========================================
  // DAILY STREAKS - Política consolidada
  // ==========================================
  
  static async getUserStreaks(userId: string) {
    const { data, error } = await supabase
      .from('daily_streaks')
      .select(`
        *,
        missions(title, type)
      `)
      .eq('user_id', userId)
      .order('last_completion_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  static async updateStreak(userId: string, missionId: string, streakData: Partial<Database['public']['Tables']['daily_streaks']['Update']>) {
    const { data, error } = await supabase
      .from('daily_streaks')
      .upsert({
        user_id: userId,
        mission_id: missionId,
        ...streakData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ==========================================
  // PARTICIPATIONS - Política otimizada
  // ==========================================
  
  static async createParticipation(participation: Database['public']['Tables']['participations']['Insert']) {
    const { data, error } = await supabase
      .from('participations')
      .insert(participation)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async getUserParticipations(userId: string) {
    const { data, error } = await supabase
      .from('participations')
      .select(`
        *,
        missions(title, description, type)
      `)
      .eq('user_id', userId)
      .order('started_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // ==========================================
  // RAFFLE NUMBERS - Política consolidada
  // ==========================================
  
  static async getUserRaffleNumbers(userId: string) {
    const { data, error } = await supabase
      .from('raffle_numbers')
      .select(`
        *,
        raffles(title, description, draw_date)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  static async createRaffleNumber(raffleNumber: Database['public']['Tables']['raffle_numbers']['Insert']) {
    const { data, error } = await supabase
      .from('raffle_numbers')
      .insert(raffleNumber)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ==========================================
  // ANALYTICS - Consultas otimizadas com índices
  // ==========================================
  
  static async getDashboardMetrics(userId: string) {
    const [profileData, rewardsData, submissionsData, participationsData] = await Promise.all([
      this.getCurrentUserProfile(),
      this.getUserRewards(userId),
      this.getUserSubmissions(userId),
      this.getUserParticipations(userId)
    ]);
    
    return {
      profile: profileData,
      totalRewards: rewardsData?.length || 0,
      totalSubmissions: submissionsData?.length || 0,
      totalParticipations: participationsData?.length || 0,
      totalRifas: profileData?.rifas || 0,
      totalCashback: profileData?.cashback_balance || 0
    };
  }
  
  // ==========================================
  // REAL-TIME SUBSCRIPTIONS - Otimizadas
  // ==========================================
  
  static subscribeToUserRewards(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user-rewards-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mission_rewards',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }
  
  static subscribeToUserSubmissions(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user-submissions-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mission_submissions',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }
}
