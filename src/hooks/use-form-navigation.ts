
import { useState } from "react";

interface UseFormNavigationProps {
  totalSteps: number;
  initialStep?: number;
  onComplete?: () => void;
}

interface UseFormNavigationReturn {
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
}

export function useFormNavigation({
  totalSteps,
  initialStep = 1,
  onComplete
}: UseFormNavigationProps): UseFormNavigationReturn {
  const [currentStep, setCurrentStep] = useState(initialStep);
  
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const progress = (currentStep / totalSteps) * 100;
  
  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const resetForm = () => {
    setCurrentStep(initialStep);
  };
  
  return {
    currentStep,
    isFirstStep,
    isLastStep,
    progress,
    goToStep,
    nextStep,
    prevStep,
    resetForm
  };
}
