
export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  points: number;
  brand?: string;
  business_type?: string;
  requirements?: any;
  end_date?: string;
  is_active?: boolean;
}

export type MissionType = 
  | 'survey' 
  | 'photo' 
  | 'video' 
  | 'social_share' 
  | 'visit' 
  | 'other';

export interface MissionSubmission {
  id: string;
  mission_id: string;
  user_id: string;
  submission_data: any;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  user_name?: string;
  user_avatar?: string;
  mission_title?: string;
}

export interface MissionFilter {
  type?: MissionType | null;
  minPoints?: number | null;
  maxPoints?: number | null;
  business_type?: string | null;
  isActive?: boolean;
}

export interface MissionSort {
  field: 'title' | 'points' | 'end_date' | 'type';
  direction: 'asc' | 'desc';
}
