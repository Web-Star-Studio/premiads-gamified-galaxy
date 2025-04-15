
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SocialShareSubmissionFormProps {
  value: string;
  onChange: (value: string) => void;
}

const SocialShareSubmissionForm = ({ value, onChange }: SocialShareSubmissionFormProps) => {
  return (
    <div className="form-container">
      <Label className="form-label">
        Link da publicação
      </Label>
      <Input
        type="text"
        placeholder="https://exemplo.com/sua-publicacao"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input"
      />
      <p className="text-medium-contrast text-sm mt-2">
        Cole o link direto da sua publicação nas redes sociais.
      </p>
    </div>
  );
};

export default SocialShareSubmissionForm;
