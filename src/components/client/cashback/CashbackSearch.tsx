
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CashbackSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const CashbackSearch: React.FC<CashbackSearchProps> = ({ searchTerm, setSearchTerm }) => (
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Buscar cupons..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 bg-galaxy-deepPurple/50 border-galaxy-purple/30"
      />
      {searchTerm && (
        <button 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          onClick={() => setSearchTerm('')}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );

export default CashbackSearch;
