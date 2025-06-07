
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserLevel {
  level: number;
  xp: number;
  xpToNext: number;
  title: string;
}

export const useUserLevel = () => {
  const { user } = useAuth();
  const [userLevel, setUserLevel] = useState<UserLevel>({
    level: 1,
    xp: 0,
    xpToNext: 100,
    title: 'Iniciante'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserLevel = async () => {
      try {
        // Buscar pontos do usuário na tabela profiles
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('points, rifas')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        const points = profile?.points || 0;
        const rifas = profile?.rifas || 0;
        
        // Calcular nível baseado em pontos + rifas
        const totalXP = points + (rifas * 10); // 1 rifa = 10 XP
        const level = Math.floor(totalXP / 100) + 1;
        const xpInLevel = totalXP % 100;
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
      } catch (error) {
        console.error('Error fetching user level:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLevel();
  }, [user]);

  return { userLevel, loading };
};
