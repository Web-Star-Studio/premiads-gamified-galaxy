
import React from 'react';
import { Button } from "@/components/ui/button";
import { useSounds } from '@/hooks/use-sounds';

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ isSubmitting, onCancel }) => {
  const { playSound } = useSounds();
  
  const handleCancel = () => {
    try {
      playSound('pop');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
    onCancel();
  };
  
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleCancel}
        className="border-neon-cyan/30 text-white transition-all duration-200"
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        className="bg-neon-pink hover:bg-neon-pink/80 transition-all duration-200"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mr-2"></span>
            Criando...
          </>
        ) : (
          'Criar Sorteio'
        )}
      </Button>
    </div>
  );
};

export default FormActions;
