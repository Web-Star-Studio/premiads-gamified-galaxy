
export type UserType = "participante" | "anunciante" | "admin" | "moderator";

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
  full_name?: string;
  email?: string;
  user_type: UserType;
  active: boolean;
  avatar_url?: string;
  points?: number;
  credits?: number;
  profile_completed?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: any;
  userProfile?: UserProfile;
}
