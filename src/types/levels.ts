
export interface UserLevel {
  id: string;
  min_points: number;
  max_points: number;
  name: string;
  color: string;
  icon: string;
  description: string;
  points_multiplier: number;
  benefits: {
    ticket_discount: number;
    priority_support: boolean;
    early_access: boolean;
    access_to_exclusive_raffles: boolean;
  };
}

export interface UserLevelInfo {
  currentLevel: UserLevel;
  nextLevel?: UserLevel;
  progress: number;
  pointsToNextLevel: number;
}
