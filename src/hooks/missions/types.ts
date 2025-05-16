// Mission types and status definitions
export type MissionStatus =
  | "available"
  | "in_progress"
  | "completed"
  | "pending_approval"
  | "pending"; // db string stored for pending submissions

export interface Mission {
  id: string;
  title: string;
  description: string;
  brand?: string;
  type: import("@/hooks/useMissionsTypes").MissionType;
  points: number;
  deadline?: string;
  status: MissionStatus;
  requirements?: string[];
  business_type?: string;
  target_audience_gender?: string;
  target_audience_age_min?: number;
  target_audience_age_max?: number;
  target_audience_region?: string;
  // Reward related fields
  has_badges?: boolean;
  has_lootbox?: boolean;
  streak_bonus?: boolean;
  streak_multiplier?: number;
  // Target filter data
  target_filter?: any;
  // Min purchase for coupon campaigns
  min_purchase?: number;
}

export interface UseMissionsOptions {
  initialFilter?: "available" | "in_progress" | "pending" | "completed";
  // Note: We removed enableNotifications since it's not being used
}
