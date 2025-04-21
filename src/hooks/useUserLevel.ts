
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserLevel, UserLevelInfo } from "@/types/auth";

export function useUserLevel(points: number, userId?: string) {
  const [loading, setLoading] = useState(true);
  const [levelInfo, setLevelInfo] = useState<UserLevelInfo | null>(null);
  const [levels, setLevels] = useState<UserLevel[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setLoading(true);
        
        // Use a custom query to get user_levels, since our Database object doesn't know about them yet
        const { data: levelsData, error: levelsError } = await supabase
          .from('user_levels')
          .select('*')
          .order('min_points', { ascending: true });
        
        if (levelsError) throw levelsError;
        
        if (levelsData && levelsData.length > 0) {
          // Type assertion to handle the conversion
          const typedLevels = levelsData.map(level => ({
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
          })) as UserLevel[];
          
          setLevels(typedLevels);
          
          // Calculate current level and next level based on points
          const currentLevel = typedLevels.find(
            level => points >= level.min_points && 
                   (level.max_points === null || points <= level.max_points)
          );
          
          if (!currentLevel) {
            setLevelInfo({
              currentLevel: typedLevels[0],
              nextLevel: typedLevels.length > 1 ? typedLevels[1] : null,
              progress: 0,
              pointsToNextLevel: typedLevels.length > 1 ? typedLevels[1].min_points - points : 0
            });
            setLoading(false);
            return;
          }
          
          const currentLevelIndex = typedLevels.findIndex(level => level.id === currentLevel.id);
          const nextLevel = currentLevelIndex < typedLevels.length - 1 
                          ? typedLevels[currentLevelIndex + 1]
                          : null;
          
          let progress = 0;
          let pointsToNextLevel = 0;
          
          if (nextLevel) {
            const rangeSize = nextLevel.min_points - currentLevel.min_points;
            const pointsInLevel = points - currentLevel.min_points;
            progress = Math.min(Math.round((pointsInLevel / rangeSize) * 100), 100);
            pointsToNextLevel = nextLevel.min_points - points;
          } else {
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
        setError("Couldn't load level data.");
      } finally {
        setLoading(false);
      }
    };

    if (points !== undefined) {
      fetchLevels();
    }
  }, [points, userId]);

  return { levelInfo, levels, loading, error };
}
