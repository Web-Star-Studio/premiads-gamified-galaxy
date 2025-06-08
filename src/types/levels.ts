
export interface LevelInfo {
  level: number;
  name: string;
  icon: string;
  color: string;
  requiredPoints: number;
  description?: string;
  points_multiplier?: number;
  benefits?: {
    ticket_discount: number;
    access_to_exclusive_raffles: boolean;
    priority_support: boolean;
    early_access: boolean;
  };
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
    description?: string;
    points_multiplier?: number;
    benefits?: {
      ticket_discount: number;
      access_to_exclusive_raffles: boolean;
      priority_support: boolean;
      early_access: boolean;
    };
  };
  nextLevel?: {
    id: number;
    min_points: number;
    max_points: number;
    name: string;
    icon: string;
    color: string;
    level: number;
    description?: string;
    points_multiplier?: number;
    benefits?: {
      ticket_discount: number;
      access_to_exclusive_raffles: boolean;
      priority_support: boolean;
      early_access: boolean;
    };
  };
  progress: number;
  pointsToNext: number;
  pointsToNextLevel: number;
}

export const LEVEL_SYSTEM = [
  { 
    level: 1, 
    name: "Iniciante", 
    icon: "🌱", 
    color: "#10B981", 
    requiredPoints: 0,
    description: "Bem-vindo ao sistema de níveis!",
    points_multiplier: 1.0,
    benefits: {
      ticket_discount: 0,
      access_to_exclusive_raffles: false,
      priority_support: false,
      early_access: false
    }
  },
  { 
    level: 2, 
    name: "Explorador", 
    icon: "🧭", 
    color: "#3B82F6", 
    requiredPoints: 100,
    description: "Você está explorando novas oportunidades!",
    points_multiplier: 1.1,
    benefits: {
      ticket_discount: 5,
      access_to_exclusive_raffles: false,
      priority_support: false,
      early_access: false
    }
  },
  { 
    level: 3, 
    name: "Aventureiro", 
    icon: "⚔️", 
    color: "#8B5CF6", 
    requiredPoints: 250,
    description: "Um verdadeiro aventureiro em busca de recompensas!",
    points_multiplier: 1.2,
    benefits: {
      ticket_discount: 10,
      access_to_exclusive_raffles: true,
      priority_support: false,
      early_access: false
    }
  },
  { 
    level: 4, 
    name: "Especialista", 
    icon: "🏆", 
    color: "#F59E0B", 
    requiredPoints: 500,
    description: "Você domina o sistema de recompensas!",
    points_multiplier: 1.3,
    benefits: {
      ticket_discount: 15,
      access_to_exclusive_raffles: true,
      priority_support: true,
      early_access: false
    }
  },
  { 
    level: 5, 
    name: "Mestre", 
    icon: "👑", 
    color: "#EF4444", 
    requiredPoints: 1000,
    description: "O nível máximo de maestria!",
    points_multiplier: 1.5,
    benefits: {
      ticket_discount: 20,
      access_to_exclusive_raffles: true,
      priority_support: true,
      early_access: true
    }
  }
];
