
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

export interface UserLevelInfo {
  currentLevel: UserLevel;
  nextLevel: UserLevel | null;
  progress: number;
  pointsToNextLevel: number;
}
