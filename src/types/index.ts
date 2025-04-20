export * from './auth';
export * from './missions';

// Additional type declarations for the app
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  user_type: 'participante' | 'anunciante' | 'admin';
}

export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  points: number;
  credits?: number;
  email_notifications?: boolean;
  push_notifications?: boolean;
  website?: string;
  description?: string;
  phone?: string;
  profile_completed?: boolean;
  user_type: 'participante' | 'anunciante' | 'admin';
}

export interface Raffle {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  ticket_cost: number;
  total_tickets: number;
  image_url?: string;
  is_active: boolean;
  prizes: Prize[];
}

export interface Prize {
  id: string;
  raffle_id: string;
  name: string;
  description?: string;
  image_url?: string;
  value: number;
  position: number;
}

export interface Ticket {
  id: string;
  user_id: string;
  raffle_id: string;
  quantity: number;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id?: string;
  referral_code: string;
  status: 'pending' | 'completed';
  points_awarded: boolean;
  created_at: string;
  completed_at?: string;
}

