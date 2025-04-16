
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { Check, X, Image, FileText, PenTool, Play, MessageSquare, Calendar, User, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MissionSubmission } from "@/types/missions";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";

interface SubmissionCardProps {
  submission: MissionSubmission;
  mode: 'pending' | 'approved' | 'rejected';
  onRemove: (id: string) => void;
}

const SubmissionCard = ({ submission, mode, onRemove }: SubmissionCardProps) => {
  const [processing, setProcessing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSounds();
  
  // Determine submission type
  const getSubmissionType = (): 'image' | 'text' | 'creative' | 'video' => {
    const data = submission.submission_data;
    
    if (!data) return 'text';
    
    if (data.image_url || data.photos || data.photo_url) {
      return 'image';
    } else if (data.video_url) {
      return 'video';
    } else if (data.creative_content) {
      return 'creative';
    } else {
      return 'text';
    }
  };
  
  // Get submission content
  const getSubmissionContent = (): string => {
    const data = submission.submission_data;
    const type = getSubmissionType();
    
    if (!data) return 'Sem conteúdo disponível';
    
    switch (type) {
      case 'image':
        return data.image_url || data.photos?.[0] || data.photo_url || '';
      case 'video':
        return data.video_url || '';
      case 'creative':
        return data.creative_content || '';
      case 'text':
      default:
        return data.text || data.feedback || data.answer || JSON.stringify(data);
    }
  };
  
  // Get formatted date
  const getFormattedDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  // Get submission type icon
  const getSubmissionIcon = () => {
    const type = getSubmissionType();
    
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5 text-neon-cyan" />;
      case 'text':
        return <FileText className="w-5 h-5 text-neon-pink" />;
      case 'creative':
        return <PenTool className="w-5 h-5 text-purple-400" />;
      case 'video':
        return <Play className="w-5 h-5 text-green-400" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };
  
  // Get the submission type label
  const getTypeLabel = (): string => {
    const type = getSubmissionType();
    
    switch (type) {
      case 'image':
        return 'Imagem';
      case 'video':
        return 'Vídeo';
      case 'creative':
        return 'Conteúdo Criativo';
      case 'text':
      default:
        return 'Texto';
    }
  };
  
  // Get status badge for the submission
  const getStatusBadge = () => {
    switch (submission.status) {
      case 'approved':
        return <Badge variant="success">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="warning">Rejeitado</Badge>;
      case 'pending':
      default:
        return <Badge variant="glow">Pendente</Badge>;
    }
  };
  
  // Get user initials for avatar
  const getUserInitials = (): string => {
    if (!submission.user_name) return '?';
    
    const nameParts = submission.user_name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Handle approve submission
  const handleApprove = async () => {
    setProcessing(true);
    
    try {
      // Update submission status in database
      const { error } = await supabase
        .from("mission_submissions")
        .update({ status: "approved" })
        .eq("id", submission.id);
        
      if (error) throw error;
      
      playSound("reward");
      toast({
        title: "Submissão aprovada",
        description: `Submissão de ${submission.user_name} foi aprovada com sucesso!`,
      });
      
      // Remove from list
      onRemove(submission.id);
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
  
  // Handle reject submission
  const handleReject = async () => {
    setProcessing(true);
    
    try {
      // Update submission status in database
      const { error } = await supabase
        .from("mission_submissions")
        .update({ status: "rejected" })
        .eq("id", submission.id);
        
      if (error) throw error;
      
      playSound("error");
      toast({
        title: "Submissão rejeitada",
        description: `Submissão de ${submission.user_name} foi rejeitada.`,
        variant: "destructive",
      });
      
      // Remove from list
      onRemove(submission.id);
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

  const submissionType = getSubmissionType();
  const content = getSubmissionContent();
  
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="p-4 border border-gray-700 rounded-lg bg-gray-800/20 hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* User info and submission metadata */}
          <div className="flex items-start gap-3 sm:w-64">
            <Avatar className="h-12 w-12 rounded-xl border border-gray-700 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-galaxy-blue to-galaxy-purple rounded-xl">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{submission.user_name}</h4>
              <p className="text-sm text-gray-400 truncate">{submission.mission_title}</p>
              
              <div className="flex items-center gap-2 mt-1">
                {getSubmissionIcon()}
                <span className="text-xs text-gray-400">{getTypeLabel()}</span>
                {getStatusBadge()}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                <Calendar className="w-3 h-3" />
                <span>{getFormattedDate(submission.submitted_at)}</span>
              </div>
            </div>
          </div>
          
          {/* Submission content preview */}
          <div className="flex-1 min-w-0">
            {submissionType === 'image' ? (
              <div 
                className="h-36 sm:h-48 overflow-hidden rounded-md bg-gray-900 cursor-pointer relative group"
                onClick={() => setPreviewOpen(true)}
              >
                <img 
                  src={content} 
                  alt={`Submission by ${submission.user_name}`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Eye className="w-8 h-8 text-white" />
                </div>
              </div>
            ) : (
              <div 
                className="h-36 sm:h-48 overflow-hidden rounded-md bg-gray-900 p-3 cursor-pointer relative group"
                onClick={() => setPreviewOpen(true)}
              >
                <p className="text-sm line-clamp-5 sm:line-clamp-8">{content}</p>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Eye className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
            
            {submission.feedback && (
              <div className="mt-3 flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                <p className="text-xs text-gray-300 line-clamp-2">
                  {submission.feedback}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons - only show for pending submissions */}
        {mode === 'pending' && (
          <div className="flex justify-end mt-4 gap-3">
            <Button 
              variant="destructive"
              size="sm"
              onClick={handleReject}
              disabled={processing}
              className="gap-2"
            >
              {processing ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
              ) : (
                <X className="w-4 h-4" />
              )}
              Rejeitar
            </Button>
            
            <Button 
              size="sm"
              onClick={handleApprove}
              disabled={processing}
              className="gap-2 bg-gradient-to-r from-green-600/60 to-teal-500/60 hover:from-green-600/80 hover:to-teal-500/80"
            >
              {processing ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <Check className="w-4 h-4" />
              )}
              Aprovar
            </Button>
          </div>
        )}
      </motion.div>
      
      {/* Full content preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-left">{submission.user_name}</DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{submission.mission_title}</span>
                  {getStatusBadge()}
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="mt-4">
            {submissionType === 'image' ? (
              <div className="flex items-center justify-center max-h-[70vh] bg-black/20 rounded-lg p-2">
                <img 
                  src={content} 
                  alt={`Submission by ${submission.user_name}`}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
            ) : (
              <div className="max-h-[70vh] overflow-auto bg-black/20 rounded-lg p-4">
                <p className="whitespace-pre-line">{content}</p>
              </div>
            )}
          </div>
          
          {submission.feedback && (
            <div className="mt-4 bg-gray-800/40 p-4 rounded-lg">
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4" />
                Comentário do usuário
              </h4>
              <p className="text-sm text-gray-300">{submission.feedback}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>ID: {submission.user_id.substring(0, 8)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{getFormattedDate(submission.submitted_at)}</span>
            </div>
          </div>
          
          {mode === 'pending' && (
            <div className="flex justify-end mt-4 gap-3">
              <Button 
                variant="destructive"
                onClick={handleReject}
                disabled={processing}
                className="gap-2"
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
                disabled={processing}
                className="gap-2 bg-gradient-to-r from-green-600/60 to-teal-500/60 hover:from-green-600/80 hover:to-teal-500/80"
              >
                {processing ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Aprovar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubmissionCard;
