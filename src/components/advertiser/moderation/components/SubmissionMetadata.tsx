
import { Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MissionSubmission } from "@/types/missions";
import SubmissionTypeIcon from "./SubmissionTypeIcon";
import SubmissionStatusBadge from "./SubmissionStatusBadge";
import { getFormattedDate, getTypeLabel, getUserInitials } from "../utils/submissionUtils";

interface SubmissionMetadataProps {
  submission: MissionSubmission;
}

const SubmissionMetadata = ({ submission }: SubmissionMetadataProps) => {
  return (
    <div className="flex items-start gap-3 sm:w-64">
      <Avatar className="h-12 w-12 rounded-xl border border-gray-700 flex-shrink-0">
        <AvatarFallback className="bg-gradient-to-br from-galaxy-blue to-galaxy-purple rounded-xl">
          {getUserInitials(submission.user_name)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{submission.user_name}</h4>
        <p className="text-sm text-gray-400 truncate">{submission.mission_title}</p>
        
        <div className="flex items-center gap-2 mt-1">
          <SubmissionTypeIcon submission={submission} />
          <span className="text-xs text-gray-400">{getTypeLabel(submission)}</span>
          <SubmissionStatusBadge submission={submission} />
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
          <Calendar className="w-3 h-3" />
          <span>{getFormattedDate(submission.submitted_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default SubmissionMetadata;
