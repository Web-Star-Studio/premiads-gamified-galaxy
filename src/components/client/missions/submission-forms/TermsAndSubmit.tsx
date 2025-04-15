
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface TermsAndSubmitProps {
  loading: boolean;
  agreedToTerms: boolean;
  setAgreedToTerms: (agreed: boolean) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isDisabled: boolean;
}

const TermsAndSubmit = ({
  loading,
  agreedToTerms,
  setAgreedToTerms,
  onCancel,
  onSubmit,
  isDisabled
}: TermsAndSubmitProps) => {
  return (
    <>
      <div className="flex items-start space-x-2 pt-4">
        <Checkbox 
          id="terms" 
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Declaro que li e concordo com os termos de submissão
          </Label>
          <p className="text-sm text-gray-400">
            Autorizo o uso do conteúdo enviado para fins promocionais.
          </p>
        </div>
      </div>
      
      <div className="pt-4 flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={isDisabled || loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </>
  );
};

export default TermsAndSubmit;
