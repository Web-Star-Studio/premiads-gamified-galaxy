import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Image, FileText, PenTool, Play, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { finalizeMissionSubmission } from "@/lib/submissions/missionModeration";

interface Submission {
  id: string;
  user: {
    name: string;
    id: string;
  };
  mission: {
    id: string;
    title: string;
  };
  type: "image" | "text" | "creative" | "video";
  content: string;
  date: string;
  comment: string;
}

const SubmissionsApproval = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { playSound } = useSounds();
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
          .eq("created_by", userId);
          
        if (missionsError) throw missionsError;
        
        if (!missionsData || missionsData.length === 0) {
          setSubmissions([]);
          setLoading(false);
          return;
        }
        
        const missionIds = missionsData.map(mission => mission.id);
        
        // Fixed: Remove 'feedback' column reference - it doesn't exist
        const { data: submissionsData, error: submissionsError } = await supabase
          .from("mission_submissions")
          .select(`
            id, 
            status, 
            submission_data, 
            submitted_at, 
            user_id,
            mission_id
          `)
          .in("mission_id", missionIds)
          .eq("status", "pending_approval")
          .order("submitted_at", { ascending: false });
          
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
          .select("id, full_name")
          .in("id", userIds);
          
        if (profilesError) throw profilesError;
        
        // Map mission titles to an object for easy lookup
        const missionTitles = missionsData.reduce((acc, mission) => {
          acc[mission.id] = mission.title;
          return acc;
        }, {} as Record<string, string>);
        
        // Map user names to an object for easy lookup
        const userNames = (profilesData || []).reduce((acc, profile) => {
          acc[profile.id] = profile.full_name;
          return acc;
        }, {} as Record<string, string>);
        
        // Format submissions for display
        const formattedSubmissions: Submission[] = submissionsData.map(submission => {
          const submissionType = determineSubmissionType(submission.submission_data);
          const submissionContent = getSubmissionContent(submission.submission_data, submissionType);
          
          return {
            id: submission.id,
            user: {
              name: userNames[submission.user_id] || "Usuário",
              id: submission.user_id
            },
            mission: {
              id: submission.mission_id,
              title: missionTitles[submission.mission_id] || "Missão"
            },
            type: submissionType,
            content: submissionContent,
            date: new Date(submission.submitted_at).toLocaleDateString('pt-BR'),
            comment: getCommentFromData(submission.submission_data) || "Sem comentários adicionais."
          };
        });
        
        setSubmissions(formattedSubmissions);
      } catch (error: any) {
        console.error("Error fetching submissions:", error);
        toast({
          title: "Erro ao carregar submissões",
          description: error.message || "Ocorreu um erro ao buscar as submissões pendentes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [toast]);
  
  // Helper function to determine submission type
  const determineSubmissionType = (data: any): "image" | "text" | "creative" | "video" => {
    if (!data) return "text";
    
    if (data.image_url || data.photos || data.photo_url) {
      return "image";
    } else if (data.video_url) {
      return "video";
    } else if (data.creative_content) {
      return "creative";
    } else {
      return "text";
    }
  };
  
  // Helper function to get submission content
  const getSubmissionContent = (data: any, type: "image" | "text" | "creative" | "video"): string => {
    if (!data) return "Sem conteúdo disponível";
    
    switch (type) {
      case "image":
        return data.image_url || data.photos?.[0] || data.photo_url || "";
      case "video":
        return data.video_url || "";
      case "creative":
        return data.creative_content || "";
      case "text":
      default:
        return data.text || data.answer || JSON.stringify(data);
    }
  };

  // Helper function to extract comments from submission data
  const getCommentFromData = (data: any): string => {
    if (!data) return "";
    return data.comment || data.notes || data.description || "";
  };
  
  const handleApprove = async () => {
    if (submissions.length === 0) return;
    
    setProcessing(true);
    try {
      const submission = submissions[currentIndex];
      
      // Use the finalizeMissionSubmission function for approval
      const result = await finalizeMissionSubmission({
        submissionId: submission.id,
        decision: 'approve',
        stage: 'advertiser_first'
      });
      
      if (!result.success) {
        throw new Error(result.error || "Erro ao aprovar submissão");
      }
      
      // Remove from local state
      const newSubmissions = [...submissions];
      newSubmissions.splice(currentIndex, 1);
      setSubmissions(newSubmissions);
      
      // Adjust current index if needed
      if (currentIndex >= newSubmissions.length) {
        setCurrentIndex(Math.max(0, newSubmissions.length - 1));
      }
      
      playSound("reward");
      toast({
        title: "Submissão aprovada",
        description: `Submissão de ${submission.user.name} foi aprovada com sucesso!`,
      });
    } catch (error: any) {
      console.error("Error approving submission:", error);
      toast({
        title: "Erro na aprovação",
        description: error.message || "Ocorreu um erro ao aprovar a submissão",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const handleReject = async () => {
    if (submissions.length === 0) return;
    
    setProcessing(true);
    try {
      const submission = submissions[currentIndex];
      
      // Use the finalizeMissionSubmission function for rejection
      const result = await finalizeMissionSubmission({
        submissionId: submission.id,
        decision: 'reject',
        stage: 'advertiser_first'
      });
      
      if (!result.success) {
        throw new Error(result.error || "Erro ao rejeitar submissão");
      }
      
      // Remove from local state
      const newSubmissions = [...submissions];
      newSubmissions.splice(currentIndex, 1);
      setSubmissions(newSubmissions);
      
      // Adjust current index if needed
      if (currentIndex >= newSubmissions.length) {
        setCurrentIndex(Math.max(0, newSubmissions.length - 1));
      }
      
      playSound("error");
      toast({
        title: "Submissão rejeitada",
        description: `Submissão de ${submission.user.name} foi rejeitada.`,
        variant: "destructive",
      });
    } catch (error: any) {
      console.error("Error rejecting submission:", error);
      toast({
        title: "Erro na rejeição",
        description: error.message || "Ocorreu um erro ao rejeitar a submissão",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const goToNext = () => {
    if (currentIndex < submissions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(submissions.length - 1);
    }
  };
  
  const getSubmissionIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-5 h-5 text-neon-cyan" />;
      case "text":
        return <FileText className="w-5 h-5 text-neon-pink" />;
      case "creative":
        return <PenTool className="w-5 h-5 text-purple-400" />;
      case "video":
        return <Play className="w-5 h-5 text-green-400" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };
  
  const currentSubmission = submissions[currentIndex];
  
  return (
    <Card className="border-neon-cyan/30 shadow-[0_0_20px_rgba(0,255,231,0.1)]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Aprovar Submissões</span>
          {submissions.length > 0 && (
            <div className="text-sm font-normal text-gray-400">
              {currentIndex + 1} de {submissions.length}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-t-neon-cyan border-gray-700 rounded-full animate-spin"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <AlertCircle className="w-12 h-12 text-gray-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhuma submissão pendente</h3>
            <p className="text-gray-400 max-w-md">
              Não há submissões pendentes de aprovação no momento. Verifique novamente mais tarde ou crie novas missões para engajar seus usuários.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 border border-gray-700 rounded-md bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
                  {currentSubmission.user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{currentSubmission.user.name}</p>
                  <p className="text-xs text-gray-400">
                    {currentSubmission.mission.title} • {currentSubmission.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getSubmissionIcon(currentSubmission.type)}
                <span className="text-xs text-gray-400 capitalize">{currentSubmission.type}</span>
              </div>
            </div>
            
            <div className="min-h-[250px] p-4 border border-gray-700 rounded-md bg-gray-800/20">
              {currentSubmission.type === "image" ? (
                <div className="flex items-center justify-center h-full">
                  <motion.img
                    key={currentSubmission.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={currentSubmission.content}
                    alt={`Submission by ${currentSubmission.user.name}`}
                    className="max-h-[250px] rounded-md object-contain"
                  />
                </div>
              ) : (
                <motion.div
                  key={currentSubmission.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="h-full overflow-y-auto fancy-scrollbar p-1"
                >
                  <p className="text-sm">{currentSubmission.content}</p>
                </motion.div>
              )}
            </div>
            
            <div className="p-3 border border-gray-700 rounded-md bg-gray-800/30">
              <p className="text-sm text-gray-300 mb-1">Comentário:</p>
              <p className="text-sm">{currentSubmission.comment}</p>
            </div>
            
            <div className="flex justify-between pt-2">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={goToPrevious}
                  className="h-10 w-10 rounded-full border border-gray-700"
                  disabled={submissions.length <= 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={goToNext}
                  className="h-10 w-10 rounded-full border border-gray-700"
                  disabled={submissions.length <= 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="destructive"
                  onClick={handleReject}
                  className="gap-2"
                  disabled={processing}
                >
                  {processing ? (
                    <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  Rejeitar
                </Button>
                <Button 
                  onClick={handleApprove}
                  className="gap-2 bg-gradient-to-r from-green-600/60 to-teal-500/60 hover:from-green-600/80 hover:to-teal-500/80"
                  disabled={processing}
                >
                  {processing ? (
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Aprovar
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubmissionsApproval;
