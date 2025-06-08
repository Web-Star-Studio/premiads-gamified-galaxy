
export interface LevelInfo {
  level: number;
  name: string;
  icon: string;
  color: string;
  requiredPoints: number;
}

export interface UserLevelInfo {
  currentLevel: {
    id: number;
    min_points: number;
    max_points: number;
    name: string;
    icon: string;
    color: string;
    level: number;
  };
  nextLevel?: {
    id: number;
    min_points: number;
    max_points: number;
    name: string;
    icon: string;
    color: string;
    level: number;
  };
  progress: number;
  pointsToNext: number;
  pointsToNextLevel: number;
}

export const LEVEL_SYSTEM = [
  { level: 1, name: "Iniciante", icon: "🌱", color: "#10B981", requiredPoints: 0 },
  { level: 2, name: "Explorador", icon: "🧭", color: "#3B82F6", requiredPoints: 100 },
  { level: 3, name: "Aventureiro", icon: "⚔️", color: "#8B5CF6", requiredPoints: 250 },
  { level: 4, name: "Especialista", icon: "🏆", color: "#F59E0B", requiredPoints: 500 },
  { level: 5, name: "Mestre", icon: "👑", color: "#EF4444", requiredPoints: 1000 }
];
