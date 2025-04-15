
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FormFooterProps {
  loading: boolean;
}

export const FormFooter = ({ loading }: FormFooterProps) => {
  return (
    <>
      <div className="mt-6 flex justify-end">
        <Button 
          type="submit" 
          className="neon-button" 
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <span className="mr-2">Salvando...</span>
              <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            </span>
          ) : (
            <span className="flex items-center">
              <span className="mr-2">Salvar Perfil</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </div>

      <div className="text-xs text-gray-400 mt-6 border-t border-galaxy-purple/20 pt-4">
        <p className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>
            Estas informações são utilizadas apenas para personalizar sua experiência e 
            direcionar missões mais relevantes para você. Seus dados são protegidos de acordo 
            com nossa política de privacidade e com a LGPD (Lei Geral de Proteção de Dados).
          </span>
        </p>
      </div>
    </>
  );
};
