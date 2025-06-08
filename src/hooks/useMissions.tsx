
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: string;
  rifas: number;
  cashback_reward: number;
  status: "available" | "in_progress" | "pending" | "completed";
  requirements: string[];
  has_badge: boolean;
  has_lootbox: boolean;
  sequence_bonus: boolean;
  brand?: string;
  tickets_reward?: number;
}

export interface UseMissionsOptions {
  initialFilter?: "available" | "in_progress" | "pending" | "completed";
}

export const useMissions = ({ initialFilter = "available" }: UseMissionsOptions = {}) => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [currentFilter, setFilter] = useState<"available" | "in_progress" | "pending" | "completed">(initialFilter);
  const { toast } = useToast();
  const { playSound } = useSounds();

  // Fetch missions based on current filter
  const fetchMissions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session?.user?.id) {
        console.error("No authenticated user found");
        return;
      }
      
      const userId = sessionData.session.user.id;
      
      // First get all active missions
      const { data: missionData, error: missionError } = await supabase
        .from("missions")
        .select("*")
        .eq("is_active", true);
      
      if (missionError) {
        throw missionError;
      }
      
      // Then get user's mission submissions
      const { data: submissionData, error: submissionError } = await supabase
        .from("mission_submissions")
        .select("*")
        .eq("user_id", userId);
      
      if (submissionError) {
        throw submissionError;
      }
      
      // Process missions to determine their status for this user
      const processedMissions = missionData.map((mission) => {
        const userSubmission = submissionData.find(
          (sub) => sub.mission_id === mission.id
        );
        
        // Determine status based on user's submission
        let status: Mission["status"] = "available";
        
        if (userSubmission) {
          status = userSubmission.status as Mission["status"];
        }
        
        return {
          id: mission.id,
          title: mission.title,
          description: mission.description || '',
          type: mission.type,
          rifas: mission.rifas || 0,
          cashback_reward: mission.cashback_reward || 0,
          status,
          requirements: mission.requirements || [],
          has_badge: mission.has_badge || false,
          has_lootbox: mission.has_lootbox || false,
          sequence_bonus: mission.sequence_bonus || false,
          tickets_reward: mission.rifas || 0
        } as Mission;
      });
      
      setMissions(processedMissions);
      
      // If a mission was previously selected, update its data
      if (selectedMission) {
        const updatedMission = processedMissions.find(
          (m) => m.id === selectedMission.id
        );
        
        if (updatedMission) {
          setSelectedMission(updatedMission);
        }
      }
      
    } catch (error) {
      console.error("Error fetching missions:", error);
      toast({
        title: "Erro ao carregar missões",
        description: "Não foi possível carregar as missões. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedMission, toast]);

  // Fetch missions when component mounts or filter changes
  useEffect(() => {
    fetchMissions();
  }, [fetchMissions, currentFilter]);

  // Get missions filtered by current filter
  const getFilteredMissions = useCallback(() => {
    return missions.filter((mission) => mission.status === currentFilter);
  }, [missions, currentFilter]);

  // Submit a mission with specific status
  const handleSubmitMission = async (
    missionId: string, 
    submissionData: any, 
    status: "in_progress" | "pending_approval" = "pending_approval"
  ) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("mission_submissions")
        .insert({
          mission_id: missionId,
          user_id: sessionData.session.user.id,
          submission_data: submissionData,
          status: status === "pending_approval" ? "pending" : status
        });

      if (error) throw error;

      playSound("success");
      toast({
        title: "Missão enviada!",
        description: "Sua submissão foi enviada para análise.",
      });

      // Refresh missions after submission
      fetchMissions();
      return true;
    } catch (error) {
      console.error("Error submitting mission:", error);
      toast({
        title: "Erro ao enviar missão",
        description: "Não foi possível enviar sua submissão. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    loading,
    missions: getFilteredMissions(),
    allMissions: missions,
    selectedMission,
    setSelectedMission,
    currentFilter,
    setFilter,
    submitMission: handleSubmitMission,
    submissionLoading: false,
    refreshMissions: fetchMissions
  };
};
