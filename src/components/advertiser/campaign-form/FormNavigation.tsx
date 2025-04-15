
import { FC, memo } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";

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
}

/**
 * Navigation controls for multi-step form
 * Handles back, next, cancel and submit actions
 */
const FormNavigation: FC<FormNavigationProps> = ({
  step,
  totalSteps,
  handleNext,
  handleBack,
  onClose,
  isNextDisabled = false
}) => {
  const isLastStep = step === totalSteps;
  const isFirstStep = step === 1;
  
  return (
    <div className="mt-8 flex justify-between items-center">
      <Button
        variant="outline"
        onClick={handleBack}
        disabled={isFirstStep}
        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
        aria-label="Voltar para o passo anterior"
      >
        <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
        Voltar
      </Button>
      
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
          aria-label="Cancelar e fechar formulário"
        >
          <X className="w-4 h-4 mr-1" aria-hidden="true" />
          Cancelar
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={isNextDisabled}
          className="bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80"
          aria-label={isLastStep ? "Concluir e salvar missão" : "Avançar para o próximo passo"}
        >
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
        </Button>
      </div>
    </div>
  );
};

export default memo(FormNavigation);
