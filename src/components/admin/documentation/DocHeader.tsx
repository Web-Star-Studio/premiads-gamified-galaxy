
import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";
import DocSearch from './DocSearch';

interface DocHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DocHeader: React.FC<DocHeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <CardTitle className="text-xl font-semibold">
          Documentação Técnica
        </CardTitle>
        <CardDescription className="mt-2">
          Guia completo de funcionamento e configuração do sistema PremiAds
        </CardDescription>
      </div>
      <DocSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
    </div>
  );
};

export default DocHeader;
