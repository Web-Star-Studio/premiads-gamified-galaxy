
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MissionSubmission } from "@/types/missions";
import SubmissionContent from "./components/SubmissionContent";
import SubmissionMetadata from "./components/SubmissionMetadata";
import SubmissionStatusBadge from "./components/SubmissionStatusBadge";
import SubmissionActionButtons from "./components/SubmissionActionButtons";
import SubmissionPreviewDialog from "./components/SubmissionPreviewDialog";
import { useSubmissionActions } from "./hooks/useSubmissionActions";
import { getUserInitials } from "./utils/submissionUtils";

interface SubmissionCardProps {
  submission: MissionSubmission;
  mode: 'pending' | 'approved' | 'rejected';
  onRemove: (id: string) => void;
  isAdminView?: boolean;
}

const SubmissionCard = ({ submission, mode, onRemove, isAdminView = false }: SubmissionCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { processing, handleApprove, handleReject } = useSubmissionActions({ onRemove });
  
  return (
    <div className="border border-gray-700 rounded-lg p-4 transition-all duration-300 hover:border-gray-600 bg-gray-900/60">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 border-2 border-neon-cyan/30">
          <AvatarFallback>{getUserInitials(submission.user_name)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-sm font-medium truncate">{submission.user_name}</h3>
              <p className="text-xs text-gray-400 truncate mb-2">{submission.mission_title}</p>
            </div>
            <SubmissionStatusBadge submission={submission} />
          </div>
          
          <SubmissionContent 
            submission={submission} 
            onClick={() => setDialogOpen(true)} 
          />
          
          <SubmissionMetadata submission={submission} />
          
          {mode === 'pending' && (
            <SubmissionActionButtons 
              processing={processing}
              onApprove={() => handleApprove(submission)}
              onReject={() => handleReject(submission)}
            />
          )}
        </div>
      </div>
      
      <SubmissionPreviewDialog 
        submission={submission}
        mode={mode}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        processing={processing}
        onApprove={() => handleApprove(submission)}
        onReject={() => handleReject(submission)}
      />
    </div>
  );
};

export default SubmissionCard;
