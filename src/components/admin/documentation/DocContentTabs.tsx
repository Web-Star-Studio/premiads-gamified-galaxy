
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import DocSectionContent from './DocSectionContent';

interface DocContentTabsProps {
  activeSection: string;
}

const DocContentTabs: React.FC<DocContentTabsProps> = ({ activeSection }) => {
  return (
    <Tabs defaultValue="content" className="w-full">
      <div className="px-4 pt-3 border-b border-zinc-800">
        <TabsList className="bg-zinc-900">
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="examples">Exemplos</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="content" className="p-0 m-0">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="p-4">
            <DocSectionContent sectionId={activeSection} />
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="examples" className="p-0 m-0">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="p-6 text-center">
            <div className="border border-dashed border-zinc-800 rounded-lg p-8">
              <FileText className="h-10 w-10 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Exemplos de Código</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Os exemplos para esta seção estão em desenvolvimento.
              </p>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors">
                <span className="flex items-center">Baixar Exemplos</span>
              </button>
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="api" className="p-0 m-0">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="p-6">
            <div className="border border-zinc-800 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold mb-2 text-zinc-400">ENDPOINT</h3>
              <div className="bg-zinc-900 p-2 rounded font-mono text-sm mb-3">
                <code className="text-green-500">GET</code> /api/v1/{activeSection}
              </div>
              <h3 className="text-sm font-semibold mb-2 text-zinc-400">AUTHENTICATION</h3>
              <p className="text-sm text-zinc-500">
                Requer token de autenticação JWT no header Authorization
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Documentação da API</h3>
                <p className="text-zinc-400">
                  API REST para interação com o módulo {activeSection}.
                </p>
              </div>
              
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <div className="border-b border-zinc-800 p-3">
                  <h4 className="font-medium">Detalhes da API</h4>
                </div>
                <div className="p-3">
                  <p className="text-sm text-zinc-400">
                    Documentação completa da API em desenvolvimento.
                    Consulte a equipe de desenvolvimento para acesso antecipado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default DocContentTabs;
