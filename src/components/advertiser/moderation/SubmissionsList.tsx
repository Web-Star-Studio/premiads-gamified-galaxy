
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import SubmissionCard from "./SubmissionCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MissionSubmission } from "@/types/missions";

interface SubmissionsListProps {
  filterStatus: string;
  searchQuery: string;
  tabValue: 'pending' | 'approved' | 'rejected';
}

const SubmissionsList = ({ filterStatus, searchQuery, tabValue }: SubmissionsListProps) => {
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch submissions from database
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
  
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <div className="w-10 h-10 border-4 border-t-neon-cyan border-gray-700 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (submissions.length === 0) {
    return (
      <Card className="min-h-[300px]">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <AlertCircle className="w-12 h-12 text-gray-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhuma submissão encontrada</h3>
            <p className="text-gray-400 max-w-md">
              {tabValue === 'pending' 
                ? "Não há submissões pendentes de aprovação no momento."
                : tabValue === 'approved'
                  ? "Você ainda não aprovou nenhuma submissão."
                  : "Você ainda não rejeitou nenhuma submissão."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>
          {tabValue === 'pending' 
            ? "Submissões Pendentes"
            : tabValue === 'approved'
              ? "Submissões Aprovadas"
              : "Submissões Rejeitadas"
          }
          <span className="text-neon-cyan ml-2">({submissions.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {submissions.map((submission) => (
            <SubmissionCard 
              key={submission.id}
              submission={submission}
              mode={tabValue}
              onRemove={handleRemoveSubmission}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsList;
