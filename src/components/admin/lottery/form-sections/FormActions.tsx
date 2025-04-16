
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  submitLabel?: string;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isSubmitting, 
  onCancel,
  submitLabel = "Criar Sorteio"
}) => {
  return (
    <motion.div 
      className="flex justify-end space-x-3 mt-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="border-galaxy-purple/20 px-4"
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
        className="bg-neon-pink hover:bg-neon-pink/90 px-4"
      >
        {isSubmitting ? 'Salvando...' : submitLabel}
      </Button>
    </motion.div>
  );
};

export default FormActions;
