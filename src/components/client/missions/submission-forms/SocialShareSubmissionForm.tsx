
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SocialShareSubmissionFormProps {
  value: string;
  onChange: (value: string) => void;
}

const SocialShareSubmissionForm = ({ value, onChange }: SocialShareSubmissionFormProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="share-link">Link da postagem</Label>
      <Input
        id="share-link"
        placeholder="Cole o link da sua postagem aqui..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-sm text-gray-400">
        Cole o link da sua postagem nas redes sociais contendo a hashtag solicitada.
      </p>
    </div>
  );
};

export default SocialShareSubmissionForm;
