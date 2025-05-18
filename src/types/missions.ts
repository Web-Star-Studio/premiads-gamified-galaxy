
export interface MissionSubmission {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  mission_id: string;
  mission_title: string;
  submission_data: any;
  feedback?: string;
  status: 'pending' | 'approved' | 'rejected' | 'second_instance_pending' | 'returned_to_advertiser';
  submitted_at: string;
  updated_at: string; 
  second_instance?: boolean;
  review_stage?: string;
  second_instance_status?: string;
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

// Utility function to convert MissionSubmission to Submission
export function toSubmission(submission: MissionSubmission): Submission {
  return {
    ...submission,
    updated_at: submission.updated_at || submission.submitted_at, // Fallback to submitted_at if updated_at is missing
    user: {
      name: submission.user_name,
      id: submission.user_id,
      avatar_url: submission.user_avatar
    },
    missions: {
      title: submission.mission_title
    }
  };
}

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
  rewarded_at: string;
}
