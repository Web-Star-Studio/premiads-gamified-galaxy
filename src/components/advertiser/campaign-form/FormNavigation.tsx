
import { Button } from "@/components/ui/button";
import { Check, ChevronRight } from "lucide-react";

interface FormNavigationProps {
  step: number;
  totalSteps: number;
  handleNext: () => void;
  handleBack: () => void;
  onClose: () => void;
  isNextDisabled?: boolean;
}

const FormNavigation = ({ 
  step, 
  totalSteps, 
  handleNext, 
  handleBack, 
  onClose, 
  isNextDisabled = false 
}: FormNavigationProps) => {
  return (
    <div className="flex justify-between mt-8">
      {step > 1 ? (
        <Button variant="outline" onClick={handleBack}>
          Voltar
        </Button>
      ) : (
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      )}

      <Button 
        onClick={handleNext}
        disabled={isNextDisabled}
        className="bg-gradient-to-r from-purple-600/60 to-pink-500/60 hover:from-purple-600/80 hover:to-pink-500/80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {step === totalSteps ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Finalizar
          </>
        ) : (
          <>
            Próximo
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};

export default FormNavigation;
