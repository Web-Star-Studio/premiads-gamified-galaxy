
import React from 'react';
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ isSubmitting, onCancel }) => {
  return (
    <div className="flex justify-end space-x-2 mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="border-galaxy-purple/20"
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Criando...' : 'Criar Sorteio'}
      </Button>
    </div>
  );
};

export default FormActions;
