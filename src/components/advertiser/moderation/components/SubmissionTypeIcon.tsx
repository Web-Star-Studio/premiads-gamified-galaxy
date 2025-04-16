
import { FileText, Image, PenTool, Play } from "lucide-react";
import { MissionSubmission } from "@/types/missions";
import { getSubmissionType } from "../utils/submissionUtils";

interface SubmissionTypeIconProps {
  submission: MissionSubmission;
}

const SubmissionTypeIcon = ({ submission }: SubmissionTypeIconProps) => {
  const type = getSubmissionType(submission);
  
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

export default SubmissionTypeIcon;
