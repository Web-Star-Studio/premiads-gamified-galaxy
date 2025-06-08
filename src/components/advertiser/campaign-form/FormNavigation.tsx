
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface FormNavigationProps {
  step: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  step,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  isSubmitting
}) => {
  const isFirstStep = step === 0;
  const isLastStep = step === totalSteps - 1;

  return (
    <div className="flex justify-between pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Anterior
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Criando..."
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Criar Campanha
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
        >
          Próximo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
