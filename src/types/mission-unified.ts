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

  start_date: string | null;
  end_date: string | null;
  max_participants: number | null;
}

export const mapSupabaseMissionToMission = (mission: SupabaseMission): Mission => ({
  ...mission,
  requirements: Array.isArray(mission.requirements) ? mission.requirements : [],
  has_badge: mission.has_badge || false,
  has_lootbox: mission.has_lootbox || false,
  cost_in_tokens: mission.cost_in_tokens || 0,
  max_participants: mission.max_participants || 0,
  hasUserSubmission: false,
});

export interface Mission {
  id: string;
  title: string;
  description?: string;
  type: string;
  requirements: string[];
  rifas: number;
  points?: number;
  tickets_reward?: number;
  has_badge?: boolean;
  has_lootbox?: boolean;
  badge_image_url?: string;
  status: string;
  deadline?: string;
  created_at?: string;
  advertiser_id?: string;
  brand?: string;
  cost_in_tokens?: number;
  business_type?: string;
  hasUserSubmission?: boolean;

  start_date?: string;
  end_date?: string;
  max_participants?: number;
}
