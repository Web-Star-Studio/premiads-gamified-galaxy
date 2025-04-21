
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
          .select("id")
          .eq("advertiser_id", userId);
          
        if (missionsError) throw missionsError;
        
        if (!missionsData || missionsData.length === 0) {
          setSubmissions([]);
          setLoading(false);
          return;
        }
        
        const missionIds = missionsData.map(mission => mission.id);
        
        // Use the RPC function to get submissions
        const { data: submissionsData, error: submissionsError } = await supabase
          .rpc('get_mission_submissions', {
            mission_ids: missionIds,
            status_filter: filterStatus !== 'all' ? filterStatus : tabValue
          });
          
        if (submissionsError) throw submissionsError;
        
        if (!submissionsData) {
          setSubmissions([]);
          setLoading(false);
          return;
        }
        
        // Apply search filter if needed
        let filteredSubmissions = submissionsData;
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          filteredSubmissions = submissionsData.filter((sub: any) => 
            sub.user_name.toLowerCase().includes(lowerQuery) || 
            sub.mission_title.toLowerCase().includes(lowerQuery)
          );
        }
        
        setSubmissions(filteredSubmissions as MissionSubmission[]);
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
