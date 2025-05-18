
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
  updated_at: string; // Make updated_at required for Submission but optional for MissionSubmission
}

// Utility function to convert MissionSubmission to Submission
export function toSubmission(submission: MissionSubmission): Submission {
  return {
    ...submission,
    updated_at: submission.updated_at || submission.submitted_at, // Ensure updated_at is always defined
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
