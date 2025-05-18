
import { Calendar, Clock, Tag, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MissionSubmission, toSubmission } from "@/types/missions";
import SubmissionTypeIcon from "./SubmissionTypeIcon";
import SubmissionStatusBadge from "./SubmissionStatusBadge";
import { getTypeLabel, getSubmissionType, getUserInitials } from "../utils/submissionUtils";

interface SubmissionMetadataProps {
  submission: MissionSubmission;
  compact?: boolean;
}

const SubmissionMetadata = ({ submission, compact = false }: SubmissionMetadataProps) => {
  // Convert to Submission to ensure compatibility
  const fullSubmission = toSubmission(submission);
  const submissionType = getSubmissionType(fullSubmission);
  const typeLabel = getTypeLabel(submissionType);
  
  // Calculate "time ago" string
  const timeAgo = formatDistanceToNow(new Date(submission.submitted_at), { 
    addSuffix: true, 
    locale: ptBR 
  });
  
  return (
    <div className={`flex ${compact ? 'flex-col gap-2' : 'items-center gap-3'}`}>
      {!compact && (
        <Avatar className="h-10 w-10">
          <AvatarFallback>{getUserInitials(submission.user_name)}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col ${compact ? 'w-full' : 'flex-1'}`}>
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm">
            {submission.user_name}
          </span>
          
          {compact && (
            <SubmissionStatusBadge submission={submission} />
          )}
        </div>
        
        <div className="flex items-center gap-3 text-muted-foreground text-xs mt-1">
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>{submission.mission_title}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <SubmissionTypeIcon submission={submission} size={12} />
            <span>{typeLabel}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
      
      {!compact && (
        <SubmissionStatusBadge submission={submission} />
      )}
    </div>
  );
};

export default SubmissionMetadata;
