
import React from 'react';
import { SheetTitle, SheetDescription } from "@/components/ui/sheet";

const FilterHeader: React.FC = () => {
  return (
    <>
      <SheetTitle>Filtros</SheetTitle>
      <SheetDescription>
        Filtre os cupons de cashback por diferentes critérios
      </SheetDescription>
    </>
  );
};

export default FilterHeader;
