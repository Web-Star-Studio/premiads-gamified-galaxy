
import { useState } from "react";
import KnowledgeLayout from "@/components/client/knowledge/KnowledgeLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, FileText, Star } from "lucide-react";

const Tutorials = () => {
  const [activeTab, setActiveTab] = useState("iniciantes");
  
  return (
    <KnowledgeLayout 
      title="Tutoriais" 
      subtitle="Aprenda a usar nossa plataforma com guias detalhados"
    >
      <Tabs defaultValue="iniciantes" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-galaxy-deepPurple/40 p-1">
          <TabsTrigger value="iniciantes" className="data-[state=active]:bg-galaxy-purple/40">
            <Star className="mr-2 h-4 w-4" />
            Para iniciantes
          </TabsTrigger>
          <TabsTrigger value="avancado" className="data-[state=active]:bg-galaxy-purple/40">
            <FileText className="mr-2 h-4 w-4" />
            Avançado
          </TabsTrigger>
          <TabsTrigger value="videos" className="data-[state=active]:bg-galaxy-purple/40">
            <PlayCircle className="mr-2 h-4 w-4" />
            Vídeos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="iniciantes">
          <div className="space-y-6">
            <div className="border-b border-galaxy-purple/30 pb-4">
              <h3 className="text-xl font-medium mb-2 text-neon-cyan">Primeiros passos</h3>
              <p className="text-gray-300 mb-4">
                Comece aqui para conhecer os conceitos básicos da plataforma PremiAds.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full mt-2 mr-2"></span>
                  <div>
                    <h4 className="font-medium">Criando sua conta</h4>
                    <p className="text-sm text-gray-400">
                      Aprenda a criar e configurar seu perfil inicial.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full mt-2 mr-2"></span>
                  <div>
                    <h4 className="font-medium">Participando da primeira missão</h4>
                    <p className="text-sm text-gray-400">
                      Como encontrar, participar e completar sua primeira missão.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full mt-2 mr-2"></span>
                  <div>
                    <h4 className="font-medium">Sistema de pontos e recompensas</h4>
                    <p className="text-sm text-gray-400">
                      Entenda como funciona nosso sistema de pontuação e recompensas.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2 text-neon-pink">Explorando o painel</h3>
              <p className="text-gray-300 mb-4">
                Conheça as principais áreas do seu painel de controle.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-neon-pink rounded-full mt-2 mr-2"></span>
                  <div>
                    <h4 className="font-medium">Dashboard principal</h4>
                    <p className="text-sm text-gray-400">
                      Navegando pela visão geral e estatísticas de sua conta.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-neon-pink rounded-full mt-2 mr-2"></span>
                  <div>
                    <h4 className="font-medium">Catálogo de missões</h4>
                    <p className="text-sm text-gray-400">
                      Como filtrar e encontrar as melhores missões para você.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="avancado">
          <div className="space-y-6">
            <div className="border-b border-galaxy-purple/30 pb-4">
              <h3 className="text-xl font-medium mb-2 text-neon-cyan">Técnicas avançadas</h3>
              <p className="text-gray-300 mb-4">
                Maximize seus ganhos com estratégias avançadas.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full mt-2 mr-2"></span>
                  <div>
                    <h4 className="font-medium">Otimizando sua participação em sorteios</h4>
                    <p className="text-sm text-gray-400">
                      Estratégias para aumentar suas chances em sorteios.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full mt-2 mr-2"></span>
                  <div>
                    <h4 className="font-medium">Programa de afiliados</h4>
                    <p className="text-sm text-gray-400">
                      Como ganhar pontos adicionais com indicações.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="videos">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-galaxy-deepPurple/30 rounded-lg overflow-hidden">
                <div className="aspect-video bg-black/50 flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-neon-cyan opacity-70" />
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-1">Tour guiado da plataforma</h4>
                  <p className="text-sm text-gray-400">
                    Uma visão geral de todas as funcionalidades.
                  </p>
                </div>
              </div>
              
              <div className="bg-galaxy-deepPurple/30 rounded-lg overflow-hidden">
                <div className="aspect-video bg-black/50 flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-neon-cyan opacity-70" />
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-1">Como completar missões rapidamente</h4>
                  <p className="text-sm text-gray-400">
                    Dicas para otimizar seu tempo e ganhar mais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </KnowledgeLayout>
  );
};

export default Tutorials;
