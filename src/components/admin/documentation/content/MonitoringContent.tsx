
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Server } from "lucide-react";

const MonitoringContent: React.FC = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Sistema de Monitoramento</h3>
        <p>
          O módulo de monitoramento fornece visibilidade em tempo real do desempenho da plataforma,
          uso de recursos, erros e atividades de usuários.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Principais Métricas Monitoradas</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Tempo de Resposta</h4>
            <p className="text-sm text-muted-foreground">
              Mede o tempo que o sistema leva para responder às solicitações dos usuários, com alertas para lentidão.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Utilização de Recursos</h4>
            <p className="text-sm text-muted-foreground">
              Monitora o uso de CPU, memória, disco e rede pelos servidores da plataforma.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Taxa de Erros</h4>
            <p className="text-sm text-muted-foreground">
              Acompanha a frequência e tipos de erros que ocorrem, com categorização por severidade.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Atividade de Usuários</h4>
            <p className="text-sm text-muted-foreground">
              Monitora o número de usuários ativos, sessões concorrentes e ações realizadas.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Sistema de Alertas</h3>
        <p>
          O sistema pode enviar alertas automáticos quando determinadas métricas excedem limites predefinidos.
          Os alertas podem ser enviados por email, SMS ou notificações no próprio sistema.
        </p>
        <div className="mt-4 p-4 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
          <h4 className="font-medium mb-2">Níveis de Alerta:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">Informativo</Badge>
              <span className="text-sm">Indicação de eventos normais mas dignos de nota</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Aviso</Badge>
              <span className="text-sm">Situações que podem exigir atenção, mas não são críticas</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">Importante</Badge>
              <span className="text-sm">Problemas que exigem atenção imediata</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">Crítico</Badge>
              <span className="text-sm">Falhas graves que ameaçam a disponibilidade ou integridade do sistema</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-neon-cyan/10 p-4 rounded-lg border border-neon-cyan/30">
        <h4 className="font-medium flex items-center gap-2">
          <Server size={16} />
          Prática Recomendada
        </h4>
        <p className="text-sm mt-1">
          Configure limites de alerta com uma margem de segurança para permitir tempo de resposta adequado.
          Estabeleça procedimentos de escalonamento para alertas que não são resolvidos dentro de prazos predefinidos.
        </p>
      </div>
    </div>
  );

export default MonitoringContent;
