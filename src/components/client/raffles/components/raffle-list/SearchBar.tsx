
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
  return (
    <div className="mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar sorteios..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex justify-end mt-2">
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs flex items-center gap-1 bg-galaxy-deepPurple/30"
        >
          <Filter className="h-3 w-3" />
          Filtros
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
