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
  status: MissionStatus | string;
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
  cost_in_tokens?: number;
  start_date?: string;
  end_date?: string;
}

export interface UseMissionsOptions {
  initialFilter?: "available" | "in_progress" | "pending" | "completed";
}
