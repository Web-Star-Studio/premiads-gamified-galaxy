
export interface Mission {
  id: string;
  title: string;
  description: string;
  brand: string;
  type: string;
  tickets_reward: number;
  cashback_reward: number;
  rifas: number;
  status: string;
  requirements: string[];
  has_badge: boolean;
  has_lootbox: boolean;
}

export interface MissionSubmission {
  id: string;
  mission_id: string;
  user_id: string;
  submission_data: any;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress';
  submitted_at: string;
  updated_at: string;
}

export interface MissionFilters {
  status?: string;
  type?: string;
  brand?: string;
}
