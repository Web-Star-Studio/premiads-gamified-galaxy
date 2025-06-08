
// Tipos para as funções RPC otimizadas
export interface UserStats {
  rifas: number;
  cashback_balance: number;
  missions_completed: number;
  total_earned_rifas: number;
}

export interface OptimizedUserData {
  profile: {
    id: string;
    full_name: string;
    avatar_url?: string;
    rifas: number;
    cashback_balance: number;
    user_type: string;
    profile_completed: boolean;
  };
  recent_rewards: Array<{
    id: string;
    rifas_earned: number;
    cashback_earned: number;
    rewarded_at: string;
    mission_title: string;
    mission_type: string;
  }>;
  active_submissions_count: number;
  completed_missions_count: number;
  total_badges: number;
}

export interface OptimizedMission {
  id: string;
  title: string;
  description: string;
  type: string;
  rifas: number;
  cashback_reward: number;
  has_badge: boolean;
  has_lootbox: boolean;
  end_date: string;
  advertiser_id: string;
  advertiser_name: string;
  advertiser_avatar: string;
}

export interface OptimizedMissionsResponse {
  missions: OptimizedMission[];
  total_count: number;
}
