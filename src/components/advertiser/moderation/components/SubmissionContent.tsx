
import { Eye } from "lucide-react";
import { MissionSubmission } from "@/types/missions";
import { getSubmissionContent, getSubmissionType } from "../utils/submissionUtils";

interface SubmissionContentProps {
  submission: MissionSubmission;
  onClick: () => void;
}

const SubmissionContent = ({ submission, onClick }: SubmissionContentProps) => {
  const submissionType = getSubmissionType(submission);
  const content = getSubmissionContent(submission);
  
  if (submissionType === 'image') {
    return (
      <div 
        className="h-36 sm:h-48 overflow-hidden rounded-md bg-gray-900 cursor-pointer relative group"
        onClick={onClick}
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
    );
  }
  
  return (
    <div 
      className="h-36 sm:h-48 overflow-hidden rounded-md bg-gray-900 p-3 cursor-pointer relative group"
      onClick={onClick}
    >
      <p className="text-sm line-clamp-5 sm:line-clamp-8">{content}</p>
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <Eye className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};

export default SubmissionContent;
