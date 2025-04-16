
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MissionSubmission } from "@/types/missions";

interface UseSubmissionsProps {
  filterStatus: string;
  searchQuery: string;
  tabValue: 'pending' | 'approved' | 'rejected';
}

export const useSubmissions = ({ filterStatus, searchQuery, tabValue }: UseSubmissionsProps) => {
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        // Get current user session
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        
        if (!userId) {
          throw new Error("Usuário não autenticado");
        }
        
        // Get missions created by this advertiser
        const { data: missionsData, error: missionsError } = await supabase
          .from("missions")
          .select("id, title")
          .eq("advertiser_id", userId);
          
        if (missionsError) throw missionsError;
        
        if (!missionsData || missionsData.length === 0) {
          setSubmissions([]);
          setLoading(false);
          return;
        }
        
        const missionIds = missionsData.map(mission => mission.id);
        
        // Get submissions for these missions based on status
        let query = supabase
          .from("mission_submissions")
          .select(`
            id, 
            status, 
            submission_data, 
            submitted_at, 
            feedback,
            user_id,
            mission_id
          `)
          .in("mission_id", missionIds);
          
        // Filter by status based on tab
        if (tabValue !== 'pending' || filterStatus !== 'all') {
          const statusToFilter = filterStatus !== 'all' ? filterStatus : tabValue;
          query = query.eq("status", statusToFilter);
        } else {
          query = query.eq("status", "pending");
        }
        
        // Order by date
        query = query.order("submitted_at", { ascending: false });
          
        const { data: submissionsData, error: submissionsError } = await query;
          
        if (submissionsError) throw submissionsError;
        
        if (!submissionsData || submissionsData.length === 0) {
          setSubmissions([]);
          setLoading(false);
          return;
        }
        
        // Get user profiles for submissions
        const userIds = [...new Set(submissionsData.map(sub => sub.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", userIds);
          
        if (profilesError) throw profilesError;
        
        // Map mission titles to an object for easy lookup
        const missionTitles = missionsData.reduce((acc, mission) => {
          acc[mission.id] = mission.title;
          return acc;
        }, {} as Record<string, string>);
        
        // Format submissions for display
        const formattedSubmissions = submissionsData.map(submission => {
          // Find user profile
          const profile = profilesData?.find(profile => profile.id === submission.user_id);
          
          return {
            ...submission,
            user_name: profile?.full_name || "Usuário",
            user_avatar: profile?.avatar_url || "",
            mission_title: missionTitles[submission.mission_id] || "Missão"
          } as MissionSubmission;
        });
        
        // Apply search filter if needed
        let filteredSubmissions = formattedSubmissions;
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          filteredSubmissions = formattedSubmissions.filter(sub => 
            sub.user_name.toLowerCase().includes(lowerQuery) || 
            sub.mission_title.toLowerCase().includes(lowerQuery)
          );
        }
        
        setSubmissions(filteredSubmissions);
      } catch (error: any) {
        console.error("Error fetching submissions:", error);
        toast({
          title: "Erro ao carregar submissões",
          description: error.message || "Ocorreu um erro ao buscar as submissões",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [tabValue, filterStatus, searchQuery, toast]);

  // Remove a submission from the list after action (approve/reject)
  const handleRemoveSubmission = (id: string) => {
    setSubmissions(prevSubmissions => 
      prevSubmissions.filter(submission => submission.id !== id)
    );
  };

  return { 
    submissions, 
    loading, 
    handleRemoveSubmission 
  };
};
