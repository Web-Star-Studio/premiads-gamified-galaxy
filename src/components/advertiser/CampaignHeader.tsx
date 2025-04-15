
import { Button } from "@/components/ui/button";
import { Filter, Plus, Search } from "lucide-react";

interface CampaignHeaderProps {
  onCreateNew: () => void;
}

const CampaignHeader = ({ onCreateNew }: CampaignHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h2 className="text-xl font-bold font-heading">Gerenciar Campanhas</h2>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar campanha..."
            className="w-full pl-9 pr-4 py-2 bg-gray-800/50 rounded-md border border-gray-700 focus:border-neon-cyan focus:outline-none text-sm"
          />
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="neon-border bg-gray-800/50 hover:bg-gray-700/50"
        >
          <Filter className="w-4 h-4" />
        </Button>
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
