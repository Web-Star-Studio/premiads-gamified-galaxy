
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SurveySubmissionFormProps {
  value: string;
  onChange: (value: string) => void;
}

const SurveySubmissionForm = ({ value, onChange }: SurveySubmissionFormProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="answer">Sua resposta</Label>
      <Textarea 
        id="answer"
        placeholder="Digite sua resposta aqui..."
        className="min-h-[150px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SurveySubmissionForm;
