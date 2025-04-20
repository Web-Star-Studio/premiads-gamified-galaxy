
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";

interface FormNavigationProps {
  step: number;
  totalSteps: number;
  handleBack: () => void;
  handleNext: () => void;
  onClose: () => void;
  isNextDisabled: boolean;
  isSubmitting?: boolean;
}

export const FormNavigation = ({
  step,
  totalSteps,
  handleBack,
  handleNext,
  onClose,
  isNextDisabled,
  isSubmitting = false
}: FormNavigationProps) => {
  const isFirstStep = step === 1;
  const isLastStep = step === totalSteps;
  
  return (
    <div className="flex justify-between w-full">
      <Button
        variant="ghost"
        onClick={onClose}
        className="text-muted-foreground"
      >
        <X className="w-4 h-4 mr-2" />
        Cancelar
      </Button>
      
      <div className="flex space-x-2">
        {!isFirstStep && (
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={isSubmitting}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        )}
        
        <Button 
          onClick={handleNext}
          disabled={isNextDisabled}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              {isLastStep ? "Finalizar" : "Próximo"}
              {!isLastStep && <ChevronRight className="w-4 h-4 ml-2" />}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
