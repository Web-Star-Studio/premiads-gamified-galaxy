
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmissionActionButtonsProps {
  processing: boolean;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
}

const SubmissionActionButtons = ({ processing, onApprove, onReject }: SubmissionActionButtonsProps) => {
  return (
    <div className="flex justify-end mt-4 gap-3">
      <Button 
        variant="destructive"
        size="sm"
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
        size="sm"
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
  );
};

export default SubmissionActionButtons;
