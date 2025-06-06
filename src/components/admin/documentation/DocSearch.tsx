
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DocSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DocSearch: React.FC<DocSearchProps> = ({ searchQuery, setSearchQuery }) => (
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Pesquisar na documentação..."
        className="w-full pl-8 bg-zinc-900 border-zinc-800"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );

export default DocSearch;
