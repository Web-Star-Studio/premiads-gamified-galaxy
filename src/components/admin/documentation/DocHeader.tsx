import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import DocSearch from './DocSearch';
import { useDocumentationDownload } from '@/hooks/admin/useDocumentationDownload';

interface DocHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DocHeader: React.FC<DocHeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const { isDownloading, downloadDocumentation } = useDocumentationDownload();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex-1">
        <CardTitle className="text-xl font-semibold">
          Documentação Técnica
        </CardTitle>
        <CardDescription className="mt-2">
          Guia completo de funcionamento e configuração do sistema PremiAds
        </CardDescription>
      </div>
      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <DocSearch 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <Button
          onClick={downloadDocumentation}
          disabled={isDownloading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                     text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl 
                     transition-all duration-200 transform hover:scale-105 disabled:opacity-50 
                     disabled:cursor-not-allowed disabled:transform-none"
          size="sm"
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Baixando...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              <FileText className="mr-1 h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocHeader;
