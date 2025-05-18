
import { Calendar, MessageSquare, User, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MissionSubmission, toSubmission } from "@/types/missions";
import SubmissionStatusBadge from "./SubmissionStatusBadge";
import { 
  getFormattedDate, 
  getSubmissionContent, 
  getSubmissionType, 
  getUserInitials 
} from "../utils/submissionUtils";

interface SubmissionPreviewDialogProps {
  submission: MissionSubmission;
  mode: 'pending' | 'approved' | 'rejected';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processing: boolean;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
}

const SubmissionPreviewDialog = ({
  submission,
  mode,
  open,
  onOpenChange,
  processing,
  onApprove,
  onReject
}: SubmissionPreviewDialogProps) => {
  // Convert MissionSubmission to Submission to ensure compatibility
  const fullSubmission = toSubmission(submission);
  const submissionType = getSubmissionType(fullSubmission);
  const content = getSubmissionContent(fullSubmission);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl mx-auto p-6">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{getUserInitials(submission.user_name)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-left">{submission.user_name}</DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{submission.mission_title}</span>
                <SubmissionStatusBadge submission={submission} />
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="my-5">
          {submissionType === 'image' ? (
            <div className="flex items-center justify-center max-h-[65vh] bg-black/20 rounded-lg p-3">
              <img 
                src={content} 
                alt={`Submission by ${submission.user_name}`}
                className="max-w-full max-h-[65vh] object-contain"
              />
            </div>
          ) : (
            <div className="max-h-[65vh] overflow-auto bg-black/20 rounded-lg p-5">
              <p className="whitespace-pre-line">{content}</p>
            </div>
          )}
        </div>
        
        {submission.feedback && (
          <div className="my-5 bg-gray-800/40 p-4 rounded-lg">
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4" />
              Comentário do usuário
            </h4>
            <p className="text-sm text-gray-300">{submission.feedback}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-400 my-4">
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
          <div className="flex justify-end mt-6 gap-3">
            <Button 
              variant="destructive"
              onClick={onReject}
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
              onClick={onApprove}
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
  );
};

export default SubmissionPreviewDialog;
