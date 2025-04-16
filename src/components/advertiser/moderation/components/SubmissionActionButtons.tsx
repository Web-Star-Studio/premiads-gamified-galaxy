
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ButtonLoadingSpinner from "@/components/ui/ButtonLoadingSpinner";
import { motion } from "framer-motion";

interface SubmissionActionButtonsProps {
  processing: boolean;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
}

const SubmissionActionButtons = ({ processing, onApprove, onReject }: SubmissionActionButtonsProps) => {
  return (
    <div className="flex justify-end mt-4 gap-3">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button 
          variant="destructive"
          size="sm"
          onClick={onReject}
          disabled={processing}
          className="gap-2"
        >
          {processing ? (
            <ButtonLoadingSpinner color="white" size="sm" />
          ) : (
            <X className="w-4 h-4" />
          )}
          Rejeitar
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button 
          size="sm"
          onClick={onApprove}
          disabled={processing}
          className="gap-2 bg-gradient-to-r from-green-600/60 to-teal-500/60 hover:from-green-600/80 hover:to-teal-500/80"
        >
          {processing ? (
            <ButtonLoadingSpinner color="white" size="sm" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Aprovar
        </Button>
      </motion.div>
    </div>
  );
};

export default SubmissionActionButtons;
