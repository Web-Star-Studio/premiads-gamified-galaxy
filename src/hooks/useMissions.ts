
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";

export type MissionType = "survey" | "photo" | "video" | "social_share" | "visit";
export type MissionStatus = "available" | "in_progress" | "completed" | "pending_approval";

export interface Mission {
  id: string;
  title: string;
  description: string;
  brand?: string;
  type: MissionType;
  points: number;
  deadline?: string;
  status: MissionStatus;
  requirements?: string[];
}

interface UseMissionsOptions {
  initialFilter?: "available" | "in_progress" | "pending" | "completed";
}

export const useMissions = (options: UseMissionsOptions = {}) => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [filter, setFilter] = useState(options.initialFilter || "available");
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
          .select("*, missions(*)")
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
          };
        });

        setMissions(mappedMissions);
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

  // Filter missions based on status
  const filteredMissions = missions.filter(mission => {
    if (filter === "available") return mission.status === "available";
    if (filter === "in_progress") return mission.status === "in_progress";
    if (filter === "pending") return mission.status === "pending_approval";
    if (filter === "completed") return mission.status === "completed";
    return true;
  });

  // Submit a mission
  const submitMission = async (missionId: string, submissionData: any) => {
    setLoading(true);
    
    try {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }
      
      const { error } = await supabase
        .from("mission_submissions")
        .insert({
          mission_id: missionId,
          user_id: userId,
          submission_data: submissionData,
        });
      
      if (error) throw error;
      
      // Update local mission status
      setMissions(prev => 
        prev.map(mission => 
          mission.id === missionId 
            ? { ...mission, status: "pending_approval" } 
            : mission
        )
      );
      
      playSound("reward");
      toast({
        title: "Missão enviada com sucesso!",
        description: "Sua submissão está em análise e será avaliada em breve.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error submitting mission:", error);
      toast({
        title: "Erro ao enviar missão",
        description: error.message || "Ocorreu um erro ao enviar a missão",
        variant: "destructive",
      });
      playSound("error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    missions: filteredMissions,
    allMissions: missions,
    selectedMission,
    setSelectedMission,
    setFilter,
    currentFilter: filter,
    submitMission
  };
};
