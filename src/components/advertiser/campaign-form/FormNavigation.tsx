
import { Button } from "@/components/ui/button";
import { Check, ChevronRight } from "lucide-react";

interface FormNavigationProps {
  step: number;
  handleNext: () => void;
  handleBack: () => void;
  onClose: () => void;
}

const FormNavigation = ({ step, handleNext, handleBack, onClose }: FormNavigationProps) => {
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
        className="bg-gradient-to-r from-purple-600/60 to-pink-500/60 hover:from-purple-600/80 hover:to-pink-500/80"
      >
        {step === 3 ? (
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
