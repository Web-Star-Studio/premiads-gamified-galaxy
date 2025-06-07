
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserLevel {
  level: number;
  xp: number;
  xpToNext: number;
  title: string;
}

interface LevelInfo {
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

interface UserLevelInfo {
  currentLevel: LevelInfo;
  nextLevel?: LevelInfo;
  progress: number;
  pointsToNextLevel: number;
}

const levels: LevelInfo[] = [
  {
    name: 'Iniciante',
    color: '#10B981',
    icon: 'award',
    description: 'Bem-vindo ao sistema!',
    points_multiplier: 1,
    benefits: {
      ticket_discount: 0,
      priority_support: false,
      early_access: false,
      access_to_exclusive_raffles: false,
    },
  },
  {
    name: 'Experiente',
    color: '#3B82F6',
    icon: 'award-trophy',
    description: 'Você está pegando o jeito!',
    points_multiplier: 1.1,
    benefits: {
      ticket_discount: 5,
      priority_support: false,
      early_access: false,
      access_to_exclusive_raffles: true,
    },
  },
  {
    name: 'Veterano',
    color: '#8B5CF6',
    icon: 'crown',
    description: 'Usuário experiente com muitas conquistas.',
    points_multiplier: 1.2,
    benefits: {
      ticket_discount: 10,
      priority_support: true,
      early_access: false,
      access_to_exclusive_raffles: true,
    },
  },
  {
    name: 'Especialista',
    color: '#F59E0B',
    icon: 'diamond',
    description: 'Expert em missões e sorteios.',
    points_multiplier: 1.3,
    benefits: {
      ticket_discount: 15,
      priority_support: true,
      early_access: true,
      access_to_exclusive_raffles: true,
    },
  },
  {
    name: 'Mestre',
    color: '#EF4444',
    icon: 'crown-jewel',
    description: 'Um dos melhores usuários da plataforma.',
    points_multiplier: 1.5,
    benefits: {
      ticket_discount: 20,
      priority_support: true,
      early_access: true,
      access_to_exclusive_raffles: true,
    },
  },
  {
    name: 'Lendário',
    color: '#F97316',
    icon: 'crown',
    description: 'Status lendário! Você é incrível!',
    points_multiplier: 2,
    benefits: {
      ticket_discount: 25,
      priority_support: true,
      early_access: true,
      access_to_exclusive_raffles: true,
    },
  },
];

export const useUserLevel = (totalPoints?: number) => {
  const { user } = useAuth();
  const [userLevel, setUserLevel] = useState<UserLevel>({
    level: 1,
    xp: 0,
    xpToNext: 100,
    title: 'Iniciante'
  });
  const [levelInfo, setLevelInfo] = useState<UserLevelInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && totalPoints === undefined) {
      setLoading(false);
      return;
    }

    const fetchUserLevel = async () => {
      try {
        let effectivePoints = totalPoints || 0;
        
        if (totalPoints === undefined) {
          // Buscar rifas do usuário na tabela profiles
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('rifas')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          effectivePoints = profile?.rifas || 0;
        }
        
        // Calcular nível baseado em pontos
        const level = Math.floor(effectivePoints / 100) + 1;
        const xpInLevel = effectivePoints % 100;
        const xpToNext = 100 - xpInLevel;

        // Determinar título baseado no nível
        let title = 'Iniciante';
        if (level >= 50) title = 'Lendário';
        else if (level >= 25) title = 'Mestre';
        else if (level >= 15) title = 'Especialista';
        else if (level >= 10) title = 'Veterano';
        else if (level >= 5) title = 'Experiente';

        setUserLevel({
          level,
          xp: xpInLevel,
          xpToNext,
          title
        });

        // Calcular levelInfo
        const currentLevelIndex = Math.min(Math.floor(level / 10), levels.length - 1);
        const nextLevelIndex = currentLevelIndex + 1;
        
        const currentLevel = levels[currentLevelIndex];
        const nextLevel = nextLevelIndex < levels.length ? levels[nextLevelIndex] : undefined;
        
        const pointsToNextLevel = nextLevel ? ((nextLevelIndex + 1) * 1000) - effectivePoints : 0;
        const progress = nextLevel ? Math.min(100, (effectivePoints % 1000) / 10) : 100;

        setLevelInfo({
          currentLevel,
          nextLevel,
          progress,
          pointsToNextLevel
        });
      } catch (error) {
        console.error('Error fetching user level:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLevel();
  }, [user, totalPoints]);

  return { userLevel, levelInfo, loading };
};
