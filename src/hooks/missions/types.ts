
export type MissionStatus = "available" | "in_progress" | "pending_approval" | "completed";

export interface Mission {
  id: string;
  title: string;
  description: string;
  brand?: string;
  type: string;
  tickets_reward: number;
  cashback_reward: number;
  deadline?: string;
  status: MissionStatus;
  requirements: string[];
  business_type?: string;
  target_audience_gender?: string;
  target_audience_age_min?: number;
  target_audience_age_max?: number;
  target_audience_region?: string;
  has_badge?: boolean;
  has_lootbox?: boolean;
  sequence_bonus?: boolean;
  streak_multiplier?: number;
  target_filter?: any;
  min_purchase?: number;
}

export interface UseMissionsOptions {
  initialFilter?: "available" | "in_progress" | "pending" | "completed";
}
