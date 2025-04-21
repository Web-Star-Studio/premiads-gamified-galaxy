
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserLevel, UserLevelInfo } from "@/types/levels";

export function useUserLevel(points: number, userId?: string) {
  const [loading, setLoading] = useState(true);
  const [levelInfo, setLevelInfo] = useState<UserLevelInfo | null>(null);
  const [levels, setLevels] = useState<UserLevel[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setLoading(true);
        
        // Fetch all level definitions
        const { data: levelsData, error: levelsError } = await supabase
          .from('user_levels')
          .select('*')
          .order('min_points', { ascending: true });
        
        if (levelsError) throw levelsError;
        
        if (levelsData && levelsData.length > 0) {
          // Convert the benefits JSON to the correct type
          const typedLevelsData: UserLevel[] = levelsData.map(level => ({
            id: level.id,
            name: level.name,
            min_points: level.min_points,
            max_points: level.max_points,
            points_multiplier: level.points_multiplier,
            icon: level.icon,
            color: level.color,
            description: level.description,
            benefits: {
              ticket_discount: level.benefits?.ticket_discount ?? 0,
              access_to_exclusive_raffles: level.benefits?.access_to_exclusive_raffles ?? false,
              priority_support: level.benefits?.priority_support ?? false,
              early_access: level.benefits?.early_access ?? false
            }
          }));
          
          setLevels(typedLevelsData);
          
          // Calculate current level and next level based on points
          const currentLevel = typedLevelsData.find(
            level => points >= level.min_points && 
                   (level.max_points === null || points <= level.max_points)
          ) as UserLevel;
          
          if (!currentLevel) {
            // Fallback to the first level if nothing else matches
            setLevelInfo({
              currentLevel: typedLevelsData[0],
              nextLevel: typedLevelsData.length > 1 ? typedLevelsData[1] : null,
              progress: 0,
              pointsToNextLevel: typedLevelsData.length > 1 ? typedLevelsData[1].min_points - points : 0
            });
            setLoading(false);
            return;
          }
          
          const currentLevelIndex = typedLevelsData.findIndex(level => level.id === currentLevel.id);
          const nextLevel = currentLevelIndex < typedLevelsData.length - 1 
                          ? typedLevelsData[currentLevelIndex + 1] as UserLevel 
                          : null;
          
          // Calculate progress as percentage within current level range
          let progress = 0;
          let pointsToNextLevel = 0;
          
          if (nextLevel) {
            const rangeSize = nextLevel.min_points - currentLevel.min_points;
            const pointsInLevel = points - currentLevel.min_points;
            progress = Math.min(Math.round((pointsInLevel / rangeSize) * 100), 100);
            pointsToNextLevel = nextLevel.min_points - points;
          } else {
            // User is at max level
            progress = 100;
            pointsToNextLevel = 0;
          }
          
          setLevelInfo({
            currentLevel,
            nextLevel,
            progress,
            pointsToNextLevel
          });
        }
      } catch (err) {
        console.error("Error fetching level data:", err);
        setError("Não foi possível carregar os dados de nível.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have points
    if (points !== undefined) {
      fetchLevels();
    }
  }, [points, userId]);

  return { levelInfo, levels, loading, error };
}
