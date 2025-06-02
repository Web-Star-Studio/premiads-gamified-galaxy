import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { Mission, UseMissionsOptions } from "@/hooks/missions/types";
import { useMissionSubmit } from "@/hooks/missions/useMissionSubmit";

export const useMissions = ({ initialFilter = "available" }: UseMissionsOptions = {}) => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [currentFilter, setFilter] = useState<"available" | "in_progress" | "pending" | "completed">(initialFilter);
  const { toast } = useToast();
  const { playSound } = useSounds();
  const { submitMission, submissionLoading } = useMissionSubmit(setMissions);

  // Define filter to status mapping
  const filterToStatus = {
    available: "available",
    in_progress: "in_progress",
    pending: "pending",
    completed: "completed"
  };

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
          ...mission,
          status,
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
    const statusFilter = filterToStatus[currentFilter];
    
    return missions.filter((mission) => 
      // If the filter is "available", we want missions with status "available"
      // For other filters, match the corresponding status
       mission.status === statusFilter
    );
  }, [missions, currentFilter]);

  // Submit a mission with specific status
  const handleSubmitMission = async (
    missionId: string, 
    submissionData: any, 
    status: "in_progress" | "pending_approval" = "pending_approval"
  ) => {
    const success = await submitMission(missionId, submissionData, status);
    
    if (success) {
      playSound("success");
      
      // Refresh missions after submission
      fetchMissions();
    }
    
    return success;
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
    submissionLoading,
    refreshMissions: fetchMissions
  };
};
