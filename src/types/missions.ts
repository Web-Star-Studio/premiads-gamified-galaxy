
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
  updated_at?: string;
  second_instance?: boolean;
  review_stage?: string;
  second_instance_status?: string;
}

// Add additional types to match what's in the database
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
