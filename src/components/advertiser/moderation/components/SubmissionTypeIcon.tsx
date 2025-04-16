
import { MissionSubmission } from "@/types/missions";
import { FileText, Image, PenTool, Play } from "lucide-react";
import { getSubmissionType } from "../utils/submissionUtils";

interface SubmissionTypeIconProps {
  submission: MissionSubmission;
}

const SubmissionTypeIcon = ({ submission }: SubmissionTypeIconProps) => {
  const type = getSubmissionType(submission);
  
  switch (type) {
    case "image":
      return <Image className="w-4 h-4 text-neon-cyan" />;
    case "video":
      return <Play className="w-4 h-4 text-green-400" />;
    case "creative":
      return <PenTool className="w-4 h-4 text-purple-400" />;
    case "text":
    default:
      return <FileText className="w-4 h-4 text-neon-pink" />;
  }
};

export default SubmissionTypeIcon;
