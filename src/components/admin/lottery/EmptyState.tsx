
import React from 'react';
import { Gift, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground">
      <Gift className="h-16 w-16 mb-4 text-galaxy-purple/40" />
      <p>Selecione um sorteio para visualizar seus detalhes.</p>
      <Button
        variant="outline"
        className="mt-4 border-galaxy-purple/30"
      >
        <Plus className="h-4 w-4 mr-1" />
        Criar Novo Sorteio
      </Button>
    </div>
  );
};

export default EmptyState;
