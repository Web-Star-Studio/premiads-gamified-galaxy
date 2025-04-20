
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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { playSound } = useSounds();
  const { submitMission, submissionLoading } = useMissionSubmit(setMissions);

  // Define filter to status mapping
  const filterToStatus = {
    available: "available",
    in_progress: "in_progress",
    pending: "pending_approval",
    completed: "completed"
  };

  // Helper function to get mission type label
  const getMissionTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      photo: "Foto",
      video: "Vídeo",
      survey: "Pesquisa",
      visit: "Visita",
      purchase: "Compra",
      review: "Avaliação",
      social: "Mídia Social",
      quiz: "Quiz"
    };
    
    return typeLabels[type] || type;
  };

  // Fetch missions based on current filter
  const fetchMissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session?.user?.id) {
        console.error("No authenticated user found");
        setError("Você precisa estar logado para ver missões");
        setLoading(false);
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
      
    } catch (error: any) {
      console.error("Error fetching missions:", error);
      setError(error.message || "Erro ao carregar missões");
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

  // Set up real-time updates for mission submissions
  useEffect(() => {
    // Only set up realtime if we have a valid session
    const checkForSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;
      
      const channel = supabase
        .channel('mission-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'mission_submissions',
            filter: `user_id=eq.${session.user.id}`
          },
          (payload) => {
            console.log('Mission submission changed:', payload);
            // Refresh missions when any mission submission changes
            fetchMissions();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };
    
    const cleanup = checkForSession();
    
    return () => {
      cleanup.then(unsub => {
        if (unsub) unsub();
      });
    };
  }, [fetchMissions]);

  // Get missions filtered by current filter
  const getFilteredMissions = useCallback(() => {
    const statusFilter = filterToStatus[currentFilter];
    
    return missions.filter((mission) => {
      // If the filter is "available", we want missions with status "available"
      // For other filters, match the corresponding status
      return mission.status === statusFilter;
    });
  }, [missions, currentFilter, filterToStatus]);

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
    error,
    missions: getFilteredMissions(),
    allMissions: missions,
    selectedMission,
    setSelectedMission,
    currentFilter,
    setFilter,
    submitMission: handleSubmitMission,
    submissionLoading,
    refreshMissions: fetchMissions,
    getMissionTypeLabel
  };
};
