
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SurveySubmissionFormProps {
  value: string;
  onChange: (value: string) => void;
}

const SurveySubmissionForm = ({ value, onChange }: SurveySubmissionFormProps) => {
  return (
    <div className="form-container">
      <Label className="form-label">
        Sua resposta
      </Label>
      <Textarea
        placeholder="Digite sua resposta detalhada aqui..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-textarea"
      />
      <p className="text-medium-contrast text-sm mt-2">
        Seja detalhado e específico em sua resposta para melhor avaliação.
      </p>
    </div>
  );
};

export default SurveySubmissionForm;
