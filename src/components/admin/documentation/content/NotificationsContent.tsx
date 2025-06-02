
import React from 'react';

const NotificationsContent: React.FC = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Sistema de Notificações</h3>
        <p>
          O módulo de notificações permite enviar mensagens tanto para usuários individuais quanto para
          grupos de usuários com base em critérios específicos. As notificações podem ser enviadas através
          de múltiplos canais.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Canais de Notificação</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Notificações In-App</h4>
            <p className="text-sm text-muted-foreground">
              Mensagens exibidas diretamente na interface do usuário, com diferentes níveis de prioridade.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">E-mail</h4>
            <p className="text-sm text-muted-foreground">
              Mensagens enviadas para o endereço de e-mail do usuário, com suporte para templates personalizados.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Push Mobile</h4>
            <p className="text-sm text-muted-foreground">
              Notificações enviadas para dispositivos móveis dos usuários, mesmo quando não estão usando o aplicativo.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">SMS</h4>
            <p className="text-sm text-muted-foreground">
              Mensagens de texto enviadas para o número de telefone do usuário (usado apenas para comunicações críticas).
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Tipos de Notificações</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Atualizações do sistema</li>
          <li>Alertas de segurança</li>
          <li>Confirmações de ações</li>
          <li>Notificações de sorteios e premiações</li>
          <li>Lembretes e mensagens programadas</li>
          <li>Comunicações de marketing (apenas para usuários que optaram por recebê-las)</li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Personalização e Segmentação</h3>
        <p>
          As notificações podem ser personalizadas com dados específicos do usuário e segmentadas com
          base em diversos critérios, como:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Dados demográficos</li>
          <li>Atividade recente</li>
          <li>Preferências de comunicação</li>
          <li>Comportamento na plataforma</li>
          <li>Histórico de interações</li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Agendamento e Automação</h3>
        <p>
          O sistema permite agendar notificações para envio futuro e configurar regras de automação
          para disparo de mensagens com base em eventos ou condições específicas.
        </p>
      </div>
    </div>
  );

export default NotificationsContent;
