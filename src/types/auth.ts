
export type UserType = 'admin' | 'employee' | 'client' | 'participante' | 'anunciante' | 'admin-master';

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
  userType?: UserType;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  user_type: UserType;
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

export interface UserLevelInfo {
  currentLevel: UserLevel;
  nextLevel: UserLevel | null;
  progress: number;
  pointsToNextLevel: number;
}

export interface UserLevel {
  id: number;
  name: string;
  min_points: number;
  max_points: number | null;
  points_multiplier: number;
  icon: string;
  color: string;
  description: string;
  benefits: {
    ticket_discount: number;
    access_to_exclusive_raffles: boolean;
    priority_support: boolean;
    early_access: boolean;
  };
}

export interface UserSessionData {
  user: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
    };
  } | null;
  profile: UserProfile | null;
  userType: UserType;
  isAuthenticated: boolean;
}
