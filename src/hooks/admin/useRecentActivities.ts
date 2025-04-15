
import { useState, useEffect } from 'react';

export interface Activity {
  id: number;
  event: string;
  user: string;
  timestamp: string;
  type: 'user' | 'permission' | 'raffle' | 'moderation' | 'system';
}

export const useRecentActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be an API call in a real application
    const fetchActivities = async () => {
      setLoading(true);
      
      // Mock data for demonstration purposes
      const mockData = [
        { 
          id: 1, 
          event: "Novo administrador adicionado", 
          user: "Carlos Silva", 
          timestamp: "Há 10 minutos",
          type: "user" as const
        },
        { 
          id: 2, 
          event: "Alteração de permissões", 
          user: "Maria Oliveira", 
          timestamp: "Há 45 minutos",
          type: "permission" as const
        },
        { 
          id: 3, 
          event: "Novo sorteio criado", 
          user: "João Pereira", 
          timestamp: "Há 2 horas",
          type: "raffle" as const
        },
        { 
          id: 4, 
          event: "Submissão aprovada", 
          user: "Ana Santos", 
          timestamp: "Há 3 horas",
          type: "moderation" as const
        },
        { 
          id: 5, 
          event: "Alerta de sistema", 
          user: "Sistema", 
          timestamp: "Há 5 horas",
          type: "system" as const
        }
      ];
      
      setTimeout(() => {
        setActivities(mockData);
        setLoading(false);
      }, 800);
    };

    fetchActivities();
  }, []);

  return { activities, loading };
};
