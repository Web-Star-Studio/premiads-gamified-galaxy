
import { FileText, Image, Music, Play, PenTool } from "lucide-react";
import { MissionSubmission, toSubmission } from "@/types/missions";
import { getSubmissionType } from "../utils/submissionUtils";

interface SubmissionTypeIconProps {
  submission: MissionSubmission;
  className?: string;
  size?: number;
}

const SubmissionTypeIcon = ({ submission, className = "", size = 16 }: SubmissionTypeIconProps) => {
  // Convert to full submission to ensure compatibility
  const fullSubmission = toSubmission(submission);
  const type = getSubmissionType(fullSubmission);
  
  // Map types to icons
  switch (type) {
    case "image":
      return <Image size={size} className={`text-blue-400 ${className}`} />;
    case "video":
      return <Play size={size} className={`text-red-400 ${className}`} />;
    case "audio":
      return <Music size={size} className={`text-purple-400 ${className}`} />;
    case "creative":
      return <PenTool size={size} className={`text-pink-400 ${className}`} />;
    case "text":
    default:
      return <FileText size={size} className={`text-green-400 ${className}`} />;
  }
};

export default SubmissionTypeIcon;
