
import React from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchAndFilter = ({ searchTerm, onSearchChange }: SearchAndFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar missões..."
          className="pl-10"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <Button variant="outline" className="md:w-auto">
        <Filter className="w-4 h-4 mr-2" />
        Filtros
      </Button>
      <Button variant="outline" className="md:w-auto">
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        Ordenar
      </Button>
    </div>
  );
};

export default SearchAndFilter;
