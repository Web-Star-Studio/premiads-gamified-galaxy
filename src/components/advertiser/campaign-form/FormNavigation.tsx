
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";

interface FormNavigationProps {
  step: number;
  totalSteps: number;
  handleNext: () => void;
  handleBack: () => void;
  onClose: () => void;
  isNextDisabled?: boolean;
}

const FormNavigation: FC<FormNavigationProps> = ({
  step,
  totalSteps,
  handleNext,
  handleBack,
  onClose,
  isNextDisabled = false
}) => {
  const isLastStep = step === totalSteps;
  
  return (
    <div className="mt-8 flex justify-between items-center">
      <Button
        variant="outline"
        onClick={handleBack}
        disabled={step === 1}
        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Voltar
      </Button>
      
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4 mr-1" />
          Cancelar
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={isNextDisabled}
          className="bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80"
        >
          {isLastStep ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Concluir
            </>
          ) : (
            <>
              Próximo
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FormNavigation;
