
import { MissionSubmission, toSubmission } from "@/types/missions";
import { getSubmissionContent, getSubmissionType } from "../utils/submissionUtils";

interface SubmissionContentProps {
  submission: MissionSubmission;
  maxHeight?: number;
}

const SubmissionContent = ({ submission, maxHeight = 0 }: SubmissionContentProps) => {
  // Convert to Submission to fix type compatibility
  const fullSubmission = toSubmission(submission);
  const type = getSubmissionType(fullSubmission);
  const content = getSubmissionContent(fullSubmission);
  
  const style = maxHeight ? { maxHeight: `${maxHeight}px` } : {};
  
  // Render different content based on submission type
  if (type === "image") {
    return (
      <div className="flex items-center justify-center bg-black/20 rounded-lg overflow-hidden" style={style}>
        <img 
          src={content} 
          alt={`Submission by ${submission.user_name}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }
  
  if (type === "video") {
    return (
      <div className="bg-black/20 rounded-lg overflow-hidden" style={style}>
        <video 
          src={content} 
          controls 
          className="w-full h-full"
        />
      </div>
    );
  }
  
  // Default to text display
  return (
    <div 
      className="bg-black/20 rounded-lg p-4 overflow-auto fancy-scrollbar" 
      style={style}
    >
      <p className="whitespace-pre-line">{content}</p>
    </div>
  );
};

export default SubmissionContent;
