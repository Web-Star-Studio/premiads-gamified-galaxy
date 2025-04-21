import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserLevel, UserLevelInfo } from "@/types/auth";

// Default user levels used when the database doesn't have levels table yet
const DEFAULT_USER_LEVELS: UserLevel[] = [
  {
    id: 1,
    name: "Bronze",
    min_points: 0,
    max_points: 499,
    points_multiplier: 1,
    icon: "trophy-bronze",
    color: "#CD7F32",
    description: "Entry level",
    benefits: {
      ticket_discount: 0,
      access_to_exclusive_raffles: false,
      priority_support: false,
      early_access: false
    }
  },
  {
    id: 2,
    name: "Silver",
    min_points: 500,
    max_points: 1999,
    points_multiplier: 1.2,
    icon: "trophy-silver",
    color: "#C0C0C0",
    description: "Intermediate level",
    benefits: {
      ticket_discount: 5,
      access_to_exclusive_raffles: false,
      priority_support: false,
      early_access: true
    }
  },
  {
    id: 3,
    name: "Gold",
    min_points: 2000,
    max_points: 9999,
    points_multiplier: 1.5,
    icon: "trophy-gold",
    color: "#FFD700",
    description: "Advanced level",
    benefits: {
      ticket_discount: 10,
      access_to_exclusive_raffles: true,
      priority_support: false,
      early_access: true
    }
  },
  {
    id: 4,
    name: "Platinum",
    min_points: 10000,
    max_points: null,
    points_multiplier: 2,
    icon: "trophy-platinum",
    color: "#E5E4E2",
    description: "Expert level",
    benefits: {
      ticket_discount: 15,
      access_to_exclusive_raffles: true,
      priority_support: true,
      early_access: true
    }
  }
];

// Check if user levels table exists
async function checkUserLevelsTable(): Promise<boolean> {
  try {
    // Since we can't use check_table_exists function that doesn't exist,
    // let's try a different approach - query for postgres' information_schema
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error("Error checking for user_levels table:", error);
      return false;
    }
    
    // If we can query profiles, we can assume the connection works
    // but we'll always use default levels since we don't have user_levels table
    return false;
  } catch (error) {
    console.error("Error in checkUserLevelsTable:", error);
    return false;
  }
}

export function useUserLevel(points: number, userId?: string) {
  const [loading, setLoading] = useState(true);
  const [levelInfo, setLevelInfo] = useState<UserLevelInfo | null>(null);
  const [levels, setLevels] = useState<UserLevel[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setLoading(true);
        
        // Check if user_levels table exists in the database
        const tableExists = await checkUserLevelsTable();
        
        // Always use default levels since we don't have user_levels table
        const userLevels: UserLevel[] = DEFAULT_USER_LEVELS;
        
        setLevels(userLevels);
        
        // Calculate current level and next level based on points
        const currentLevel = userLevels.find(
          level => points >= level.min_points && 
                 (level.max_points === null || points <= level.max_points)
        );
        
        if (!currentLevel) {
          setLevelInfo({
            currentLevel: userLevels[0],
            nextLevel: userLevels.length > 1 ? userLevels[1] : null,
            progress: 0,
            pointsToNextLevel: userLevels.length > 1 ? userLevels[1].min_points - points : 0
          });
          setLoading(false);
          return;
        }
        
        const currentLevelIndex = userLevels.findIndex(level => level.id === currentLevel.id);
        const nextLevel = currentLevelIndex < userLevels.length - 1 
                        ? userLevels[currentLevelIndex + 1]
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
