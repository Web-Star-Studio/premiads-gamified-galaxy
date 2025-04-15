
import { memo } from "react";

interface FormProgressProps {
  /** Current step number (1-4) */
  step: number;
  /** Title of the current step */
  title: string;
}

/**
 * Visual progress indicator for multi-step form
 * Shows current step and form title
 */
const FormProgress = ({ step, title }: FormProgressProps) => {
  // Array of step numbers for proper accessibility
  const steps = [1, 2, 3, 4];
  
  return (
    <div aria-live="polite">
      <h3 className="text-xl font-heading" id="form-step-title">{title}</h3>
      <div 
        className="flex items-center mt-2" 
        role="progressbar" 
        aria-valuemin={1} 
        aria-valuemax={4} 
        aria-valuenow={step}
        aria-labelledby="form-step-title"
      >
        {steps.map((stepNumber) => (
          <div 
            key={stepNumber}
            className={`h-1 w-1/4 ${stepNumber <= step ? "bg-neon-cyan" : "bg-gray-700"}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="sr-only">Passo {step} de 4</p>
    </div>
  );
};

export default memo(FormProgress);
