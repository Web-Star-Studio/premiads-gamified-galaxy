
import React from 'react';
import { HelpCircle } from "lucide-react";

const DashboardContent: React.FC = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Visão Geral do Dashboard</h3>
        <p>
          O painel principal fornece um resumo das atividades da plataforma em tempo real. As métricas são atualizadas 
          a cada 5 minutos e apresentam indicadores-chave de desempenho.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Componentes do Dashboard</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">System Metrics</h4>
            <p className="text-sm text-muted-foreground">
              Apresenta métricas de desempenho do sistema, incluindo tempo de resposta, utilização de recursos e contadores de erros.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">System Status</h4>
            <p className="text-sm text-muted-foreground">
              Exibe o estado atual dos vários subsistemas e serviços, com alertas para quaisquer problemas detectados.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Recent Activities</h4>
            <p className="text-sm text-muted-foreground">
              Mostra as atividades recentes de usuários administradores, incluindo ações realizadas e timestamps.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Key Metrics</h4>
            <p className="text-sm text-muted-foreground">
              Visualizações de dados mostrando tendências de crescimento, engajamento e conversões.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Customização do Dashboard</h3>
        <p>
          Administradores podem personalizar quais widgets são exibidos no dashboard principal através do menu
          de configurações acessível pelo ícone de engrenagem no topo direito de cada widget.
        </p>
      </div>
      
      <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
        <h4 className="font-medium flex items-center gap-2">
          <HelpCircle size={16} />
          Dica
        </h4>
        <p className="text-sm mt-1">
          Você pode definir alertas personalizados para métricas importantes, que serão exibidos como notificações
          quando os limiares especificados forem ultrapassados.
        </p>
      </div>
    </div>
  );

export default DashboardContent;
