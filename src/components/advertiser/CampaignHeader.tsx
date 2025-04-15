
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, Plus, Search, X, Check } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface CampaignHeaderProps {
  onCreateNew: () => void;
  onSearchChange: (term: string) => void;
  onFilterChange: (status: string | null) => void;
}

const CampaignHeader = ({ onCreateNew, onSearchChange, onFilterChange }: CampaignHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearchChange(term);
  };
  
  const handleFilterSelect = (status: string | null) => {
    setActiveFilter(status);
    onFilterChange(status);
  };
  
  const clearSearch = () => {
    setSearchTerm("");
    onSearchChange("");
  };
  
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h2 className="text-xl font-bold font-heading">Gerenciar Campanhas</h2>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchInput}
            placeholder="Buscar campanha..."
            className="w-full pl-9 pr-9 py-2 bg-gray-800/50 rounded-md border border-gray-700 focus:border-neon-cyan focus:outline-none text-sm"
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className={`neon-border ${activeFilter ? 'bg-neon-pink/20 text-neon-pink' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 border border-gray-700">
            <DropdownMenuCheckboxItem 
              checked={activeFilter === null}
              onCheckedChange={() => handleFilterSelect(null)}
            >
              Todas
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={activeFilter === "ativa"}
              onCheckedChange={() => handleFilterSelect("ativa")}
            >
              Ativas
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={activeFilter === "pendente"}
              onCheckedChange={() => handleFilterSelect("pendente")}
            >
              Pendentes
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={activeFilter === "encerrada"}
              onCheckedChange={() => handleFilterSelect("encerrada")}
            >
              Encerradas
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          onClick={onCreateNew}
          className="neon-button bg-gradient-to-r from-purple-600/40 to-pink-500/40"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>
    </div>
  );
};

export default CampaignHeader;
