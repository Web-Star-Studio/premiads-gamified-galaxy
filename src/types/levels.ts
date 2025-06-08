
export interface UserLevel {
  id: number;
  min_points: number;
  max_points: number;
  name: string;
  icon: string;
  color: string;
  level: number;
  description?: string;
  benefits?: string[];
  points_multiplier?: number;
}

export interface LevelInfo {
  id: number;
  min_points: number;
  max_points: number;
  name: string;
  icon: string;
  color: string;
  level: number;
  description?: string;
  benefits?: string[];
  points_multiplier?: number;
}

export interface UserLevelInfo {
  currentLevel: UserLevel;
  nextLevel: UserLevel | null;
  progress: number;
  pointsToNext: number;
  pointsInCurrentLevel: number;
}

export const levels: UserLevel[] = [
  {
    id: 1,
    level: 1,
    name: "Iniciante",
    min_points: 0,
    max_points: 99,
    icon: "🌱",
    color: "#10B981",
    description: "Bem-vindo ao PremiAds! Complete suas primeiras missões.",
    benefits: ["Acesso às missões básicas", "Recompensas iniciais"],
    points_multiplier: 1.0
  },
  {
    id: 2,
    level: 2,
    name: "Explorador",
    min_points: 100,
    max_points: 299,
    icon: "🔍",
    color: "#3B82F6",
    description: "Continue explorando e descobrindo novas oportunidades.",
    benefits: ["Missões de nível médio", "Bonus de streak", "Badges especiais"],
    points_multiplier: 1.1
  },
  {
    id: 3,
    level: 3,
    name: "Aventureiro",
    min_points: 300,
    max_points: 599,
    icon: "⚡",
    color: "#8B5CF6",
    description: "Você está se tornando um verdadeiro aventureiro!",
    benefits: ["Missões avançadas", "Loot boxes", "Cashback aumentado"],
    points_multiplier: 1.2
  },
  {
    id: 4,
    level: 4,
    name: "Expert",
    min_points: 600,
    max_points: 999,
    icon: "🏆",
    color: "#F59E0B",
    description: "Expert em completar missões com excelência.",
    benefits: ["Missões exclusivas", "Recompensas premium", "Acesso VIP"],
    points_multiplier: 1.3
  },
  {
    id: 5,
    level: 5,
    name: "Mestre",
    min_points: 1000,
    max_points: 1999,
    icon: "👑",
    color: "#EF4444",
    description: "Um verdadeiro mestre das recompensas!",
    benefits: ["Todas as missões", "Multiplicador máximo", "Status premium"],
    points_multiplier: 1.5
  },
  {
    id: 6,
    level: 6,
    name: "Lenda",
    min_points: 2000,
    max_points: 999999,
    icon: "🌟",
    color: "#A855F7",
    description: "Você alcançou o status de lenda no PremiAds!",
    benefits: ["Acesso total", "Recompensas exclusivas", "Reconhecimento especial"],
    points_multiplier: 2.0
  }
];
