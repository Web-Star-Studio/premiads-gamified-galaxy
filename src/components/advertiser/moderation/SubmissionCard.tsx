
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { MissionSubmission } from "@/types/missions";
import SubmissionMetadata from "./components/SubmissionMetadata";
import SubmissionContent from "./components/SubmissionContent";
import SubmissionActionButtons from "./components/SubmissionActionButtons";
import SubmissionPreviewDialog from "./components/SubmissionPreviewDialog";
import { useSubmissionActions } from "./hooks/useSubmissionActions";

interface SubmissionCardProps {
  submission: MissionSubmission;
  mode: 'pending' | 'approved' | 'rejected';
  onRemove: (id: string) => void;
}

const SubmissionCard = ({ submission, mode, onRemove }: SubmissionCardProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { processing, handleApprove, handleReject } = useSubmissionActions({ onRemove });
  
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
          <SubmissionMetadata submission={submission} />
          
          {/* Submission content preview */}
          <div className="flex-1 min-w-0">
            <SubmissionContent 
              submission={submission} 
              onClick={() => setPreviewOpen(true)} 
            />
            
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
          <SubmissionActionButtons
            processing={processing}
            onApprove={() => handleApprove(submission)}
            onReject={() => handleReject(submission)}
          />
        )}
      </motion.div>
      
      {/* Full content preview dialog */}
      <SubmissionPreviewDialog
        submission={submission}
        mode={mode}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        processing={processing}
        onApprove={() => handleApprove(submission)}
        onReject={() => handleReject(submission)}
      />
    </>
  );
};

export default SubmissionCard;
