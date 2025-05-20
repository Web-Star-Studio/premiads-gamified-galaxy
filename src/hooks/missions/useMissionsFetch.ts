
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { Mission, MissionStatus } from "./types";
import { MissionType } from "@/hooks/useMissionsTypes";

export const useMissionsFetch = () => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { playSound } = useSounds();

  // Fetch missions from Supabase
  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if user is authenticated
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData?.session?.user?.id) {
          console.log("No authenticated user found - using empty mission data");
          setMissions([]);
          setLoading(false);
          playSound("chime");
          return;
        }
        
        const userId = sessionData.session.user.id;
        
        console.log("Fetching missions for user:", userId);
        
        // Get user's submissions first to determine mission status
        const { data: userSubmissions, error: submissionsError } = await supabase
          .from("mission_submissions")
          .select("mission_id, status")
          .eq("user_id", userId);
        
        if (submissionsError) {
          console.error("Error fetching submissions:", submissionsError);
          throw submissionsError;
        }
        
        console.log("User submissions:", userSubmissions?.length || 0);
        
        // Get all active missions
        const { data: missionsData, error: missionsError } = await supabase
          .from("missions")
          .select("*")
          .eq("is_active", true);
        
        if (missionsError) {
          console.error("Error fetching missions:", missionsError);
          throw missionsError;
        }

        console.log("Missions fetched:", missionsData?.length || 0);
        
        // Map missions with their status for the current user
        const mappedMissions: Mission[] = (missionsData || []).map((mission) => {
          const submission = userSubmissions?.find(s => s.mission_id === mission.id);
          
          let status: MissionStatus = "available";
          if (submission) {
            if (submission.status === "approved") {
              status = "completed";
            } else if (submission.status === "pending") {
              status = "pending_approval";
            } else {
              status = "in_progress";
            }
          }

          // Convert requirements from JSON to string array
          const requirementsArray: string[] = mission.requirements 
            ? Array.isArray(mission.requirements) 
              ? mission.requirements.map(req => String(req))
              : typeof mission.requirements === 'object' 
                ? Object.values(mission.requirements).map(req => String(req))
                : [String(mission.requirements)]
            : [];

          // Use type assertion with any to access non-standard fields safely
          const missionData: any = mission;

          return {
            id: mission.id,
            title: mission.title,
            description: mission.description,
            brand: mission.advertiser_id,
            type: mission.type as MissionType,
            points: mission.points,
            deadline: mission.end_date,
            status,
            requirements: requirementsArray,
            business_type: mission.business_type,
            target_audience_gender: mission.target_audience_gender,
            target_audience_age_min: mission.target_audience_age_min,
            target_audience_age_max: mission.target_audience_age_max,
            target_audience_region: mission.target_audience_region,
            // Include reward-related fields with safe access
            has_badge: missionData.has_badge || false,
            has_lootbox: missionData.has_lootbox || false,
            sequence_bonus: missionData.sequence_bonus || false,
            streak_multiplier: missionData.streak_multiplier || 1.0,
            // Target filter with safe access
            target_filter: missionData.target_filter || null,
            // Min purchase amount with safe access
            min_purchase: missionData.min_purchase || 0
          };
        });

        setMissions(mappedMissions);
        console.log("Mapped missions:", mappedMissions.length);
        playSound("chime");
      } catch (error: any) {
        console.error("Error fetching missions:", error);
        setError(error.message || "Erro ao buscar missões");
        toast({
          title: "Erro ao carregar missões",
          description: error.message || "Ocorreu um erro ao buscar as missões",
          variant: "destructive",
        });
        // Return empty array instead of mock data
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [toast, playSound]);

  return { loading, missions, setMissions, error };
};
