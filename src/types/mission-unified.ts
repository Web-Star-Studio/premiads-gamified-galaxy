
import { MissionType } from '@/hooks/useMissionsTypes';

export interface SupabaseMission {
  id: string;
  title: string;
  description: string | null;
  type: string;
  requirements: string[] | null;
  rifas: number;
  has_badge: boolean;
  has_lootbox: boolean;
  badge_image_url: string | null;
  status: string;
  deadline: string | null;
  created_at: string;
  advertiser_id: string;
  brand: string | null;
  cost_in_tokens: number | null;
  business_type: string | null;
  cashback_reward: number | null;
  tickets_reward: number | null;

  start_date: string | null;
  end_date: string | null;
  max_participants: number | null;
}

export const mapSupabaseMissionToMission = (mission: SupabaseMission): Mission => ({
  ...mission,
  description: mission.description || '',
  brand: mission.brand || '',
  requirements: Array.isArray(mission.requirements) ? mission.requirements : [],
  has_badge: mission.has_badge || false,
  has_lootbox: mission.has_lootbox || false,
  cost_in_tokens: mission.cost_in_tokens || 0,
  max_participants: mission.max_participants || 0,
  cashback_reward: mission.cashback_reward || 0,
  tickets_reward: mission.tickets_reward || 0,
  hasUserSubmission: false,
  type: mission.type as MissionType,
});

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  requirements: string[];
  rifas: number;
  points?: number;
  tickets_reward: number;
  cashback_reward: number;
  brand: string;
  has_badge: boolean;
  has_lootbox: boolean;
  badge_image_url?: string;
  status: string;
  deadline?: string;
  created_at?: string;
  advertiser_id?: string;
  cost_in_tokens: number;
  business_type?: string;
  hasUserSubmission?: boolean;

  start_date?: string;
  end_date?: string;
  max_participants?: number;
  
  // Additional targeting properties
  target_audience_gender?: string;
  target_audience_age_min?: number;
  target_audience_age_max?: number;
  target_audience_region?: string;
}
