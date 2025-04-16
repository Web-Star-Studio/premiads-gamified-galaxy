
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion } from "framer-motion";
import ButtonLoadingSpinner from "@/components/ui/ButtonLoadingSpinner";

interface FormNavigationProps {
  /** Current step number */
  step: number;
  /** Total number of steps in the form */
  totalSteps: number;
  /** Handle next button click */
  handleNext: () => void;
  /** Handle back button click */
  handleBack: () => void;
  /** Handle form cancellation */
  onClose: () => void;
  /** Whether the next button should be disabled */
  isNextDisabled?: boolean;
  /** Whether the form is currently submitting */
  isSubmitting?: boolean;
}

export const FormNavigation = ({
  step,
  totalSteps,
  handleNext,
  handleBack,
  onClose,
  isNextDisabled = false,
  isSubmitting = false
}: FormNavigationProps) => {
  const isLastStep = step === totalSteps;
  const isFirstStep = step === 1;
  
  return (
    <div className="mt-8 flex justify-between items-center w-full">
      <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isFirstStep || isSubmitting}
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          aria-label="Voltar para o passo anterior"
        >
          <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
          Voltar
        </Button>
      </motion.div>
      
      <div className="flex gap-2">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white"
            aria-label="Cancelar e fechar formulário"
          >
            <X className="w-4 h-4 mr-1" aria-hidden="true" />
            Cancelar
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleNext}
            disabled={isNextDisabled || isSubmitting}
            className="bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80"
            aria-label={isLastStep ? "Concluir e salvar campanha" : "Avançar para o próximo passo"}
          >
            {isSubmitting ? (
              <>
                <ButtonLoadingSpinner color="cyan" size="sm" />
                <span>{isLastStep ? "Salvando..." : "Processando..."}</span>
              </>
            ) : (
              <>
                {isLastStep ? (
                  <>
                    <Check className="w-4 h-4 mr-1" aria-hidden="true" />
                    Concluir
                  </>
                ) : (
                  <>
                    Próximo
                    <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </>
                )}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
