
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { Mission, MissionStatus } from "./types";
import { MissionType } from "@/hooks/useMissionsTypes";

export const useMissionsFetch = () => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<Mission[]>([]);
  const { toast } = useToast();
  const { playSound } = useSounds();

  // Fetch missions from Supabase
  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      try {
        // Get current user id
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        
        if (!userId) {
          throw new Error("User not authenticated");
        }
        
        // Get user's submissions first to determine mission status
        const { data: userSubmissions, error: submissionsError } = await supabase
          .from("mission_submissions")
          .select("mission_id, status")
          .eq("user_id", userId);
        
        if (submissionsError) throw submissionsError;
        
        // Get all active missions
        const { data: missionsData, error: missionsError } = await supabase
          .from("missions")
          .select("*")
          .eq("is_active", true);
        
        if (missionsError) throw missionsError;

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
            target_audience_region: mission.target_audience_region
          };
        });

        setMissions(mappedMissions);
        console.log("Fetched missions:", mappedMissions.length);
        playSound("chime");
      } catch (error: any) {
        console.error("Error fetching missions:", error);
        toast({
          title: "Erro ao carregar missões",
          description: error.message || "Ocorreu um erro ao buscar as missões",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [toast, playSound]);

  return { loading, missions, setMissions };
};
