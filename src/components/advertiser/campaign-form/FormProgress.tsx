
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface FormProgressProps {
  step: number;
  totalSteps: number;
}

const FormProgress: React.FC<FormProgressProps> = ({ step, totalSteps }) => {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>Passo {step + 1} de {totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
};

export default FormProgress;
