
import React from 'react';
import { Button } from '@/components/ui/button';
import { SheetClose } from "@/components/ui/sheet";

interface FilterActionsProps {
  clearFilters: () => void;
}

const FilterActions: React.FC<FilterActionsProps> = ({ clearFilters }) => {
  return (
    <>
      <Button 
        variant="outline" 
        onClick={clearFilters}
        className="w-full"
      >
        Limpar Filtros
      </Button>
      <SheetClose asChild>
        <Button className="w-full">Aplicar Filtros</Button>
      </SheetClose>
    </>
  );
};

export default FilterActions;
