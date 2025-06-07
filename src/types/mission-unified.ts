
export interface Mission {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  rifas: number;
  cashback_reward: number;
  tickets_reward: number;
  points: number;
  deadline: string;
  type: string;
  business_type: string;
  target_audience_gender: string;
  target_audience_age_min: number;
  target_audience_age_max: number;
  target_audience_region: string;
  start_date: string;
  end_date: string;
  has_badge: boolean;
  has_lootbox: boolean;
  sequence_bonus: boolean;
  badge_image_url?: string;
  selected_lootbox_rewards?: string[];
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  advertiser_id?: string;
}
