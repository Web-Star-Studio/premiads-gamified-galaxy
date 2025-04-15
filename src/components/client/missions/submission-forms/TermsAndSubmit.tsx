
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface TermsAndSubmitProps {
  loading: boolean;
  agreedToTerms: boolean;
  setAgreedToTerms: (value: boolean) => void;
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
    <div className="form-container mt-6">
      <div className="flex items-start space-x-3 mb-4">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={() => setAgreedToTerms(!agreedToTerms)}
          className="mt-1"
        />
        <label
          htmlFor="terms"
          className="text-medium-contrast text-base leading-relaxed"
        >
          Confirmo que li e aceito os termos e condições desta missão. Entendo que o conteúdo enviado será analisado pelo anunciante antes da aprovação.
        </label>
      </div>
      
      <div className="flex gap-3 mt-6">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 py-2.5 text-base"
        >
          Cancelar
        </Button>
        
        <Button
          onClick={onSubmit}
          disabled={isDisabled || loading}
          className="flex-1 bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80 py-2.5 text-base"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Concluir Missão"
          )}
        </Button>
      </div>
    </div>
  );
};

export default TermsAndSubmit;
