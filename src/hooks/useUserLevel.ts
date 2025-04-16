
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
          setLevels(levelsData as UserLevel[]);
          
          // Calculate current level and next level based on points
          const currentLevel = levelsData.find(
            level => points >= level.min_points && 
                   (level.max_points === null || points <= level.max_points)
          ) as UserLevel;
          
          const currentLevelIndex = levelsData.findIndex(level => level.id === currentLevel.id);
          const nextLevel = currentLevelIndex < levelsData.length - 1 
                          ? levelsData[currentLevelIndex + 1] as UserLevel 
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
