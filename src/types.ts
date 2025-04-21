export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  user_type: string;
  points: number;
  credits: number;
  profile_completed: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  description: string | null;
  phone: string | null;
  profile_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string | null;
  type: string | null;
  points: number;
  requirements: Record<string, any> | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  target_audience_gender: string | null;
  advertiser_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface MissionSubmission {
  id: string;
  user_id: string;
  user_name: string;
  mission_id: string;
  mission_title: string;
  submission_data: Record<string, any> | null;
  status: string;
  submitted_at: string | null;
  feedback: number | null;
}
