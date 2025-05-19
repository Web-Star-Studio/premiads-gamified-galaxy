
// Extended Campaign interface with UI display fields
export interface Campaign {
  id: string;
  title: string;
  description?: string;
  type: string;
  points: number;
  status: string;
  target_audience?: string;
  start_date?: string;
  end_date?: string;
  requirements?: string[] | string;
  
  // Fields for UI display that may be derived or computed
  audience?: string; // Alias for target_audience
  completions?: number; // Count of submissions 
  reward?: string;  // Formatted points like "50 pontos"
  expires?: string; // Formatted end_date
  
  // Reward feature fields from database
  has_badge?: boolean;
  has_lootbox?: boolean;
  sequence_bonus?: boolean;
  streak_multiplier?: number;
  
  // Legacy fields for backward compatibility
  has_badges?: boolean; // Legacy field, use has_badge instead
  streak_bonus?: boolean; // Legacy field, use sequence_bonus instead
  
  // Additional fields that might be needed
  [key: string]: any;
}
