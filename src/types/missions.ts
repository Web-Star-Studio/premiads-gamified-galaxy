export interface MissionSubmission {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  mission_id: string;
  mission_title: string;
  submission_data: any;
  feedback?: string;
  status: 'pending' | 'pending_approval' | 'approved' | 'rejected' | 'second_instance_pending' | 'returned_to_advertiser' | 'in_progress';
  submitted_at: string;
  updated_at: string; 
  second_instance?: boolean;
  review_stage?: string;
  second_instance_status?: string;
  admin_validated?: boolean;
  validated_by?: string;
}

// Expanded Submission interface with additional properties needed for the UI components
export interface Submission extends MissionSubmission {
  missions?: {
    title: string;
  };
  proof_url?: string[];
  proof_text?: string;
  user?: {
    name: string;
    avatar_url?: string;
    id: string;
  };
}

// Mission interface with types that match the database schema
export interface LegacyMission {
  id: string;
  title: string;
  description?: string;
  type: string;
  points: number;
  created_by?: string;
  advertiser_id?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
  cost_in_tokens?: number;
  target_audience?: string;
  target_audience_gender?: string;
  target_audience_age_min?: number;
  target_audience_age_max?: number;
  target_audience_region?: string;
  requirements?: any;
  target_filter?: any;
  business_type?: string;
  streak_bonus?: boolean;
  streak_multiplier?: number;
  expires_at?: string; // For compatibility with old code, use an alias
  // Compatibility fields
  audience?: string; // Alias for target_audience
  reward?: number; // Alias for points
  completions?: number; // For UI display purposes
}

// Utility function to convert database submission to UI Submission
export function toSubmission(submission: any): Submission {
  // Handle case where submission might not have user_name or other required fields
  const user_name = submission.user_name || 
                    (submission.user?.profiles?.[0]?.full_name || submission.user?.name) || 
                    "Usuário";
  
  const mission_title = submission.mission_title || 
                       (submission.missions?.title) || 
                       "Missão";
                       
  return {
    ...submission,
    user_name,
    mission_title,
    updated_at: submission.updated_at || submission.submitted_at,
    user: {
      name: user_name,
      id: submission.user_id,
      avatar_url: submission.user_avatar || submission.user?.avatar_url
    },
    missions: {
      title: mission_title
    }
  };
}

// Mission type mapping
export type MissionType = 'engagement' | 'content' | 'survey' | 'referral' | 'daily' | 'streak' | 'participation';

// Mission type descriptions for UI
export const missionTypeDescriptions: Record<MissionType, string> = {
  engagement: 'Engajamento',
  content: 'Conteúdo',
  survey: 'Pesquisa',
  referral: 'Indicação',
  daily: 'Diária',
  streak: 'Sequência',
  participation: 'Participação'
};

// Add other mission-related types
export interface UserTokens {
  user_id: string;
  total_tokens: number;
  used_tokens: number;
  updated_at: string;
}

export interface ValidationLog {
  id: string;
  submission_id: string;
  validated_by: string;
  is_admin: boolean;
  result: string;
  notes?: string;
  created_at: string;
}

export interface MissionReward {
  id: string;
  user_id: string;
  mission_id: string;
  submission_id: string;
  points_earned: number;
  tokens_earned: number;
  rewarded_at: string;
}

export interface FilterOptions {
  status: string;
  searchQuery: string;
}
