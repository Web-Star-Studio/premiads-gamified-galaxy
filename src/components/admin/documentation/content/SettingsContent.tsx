
import React from 'react';

const SettingsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Configurações do Sistema</h3>
        <p>
          O módulo de configurações permite personalizar diversos aspectos da plataforma,
          desde configurações técnicas até definições de interface e comportamento.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Categorias de Configurações</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Configurações Gerais</h4>
            <p className="text-sm text-muted-foreground">
              Definições básicas como nome da plataforma, fuso horário padrão e preferências regionais.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Configurações de Segurança</h4>
            <p className="text-sm text-muted-foreground">
              Políticas de senhas, configurações de autenticação em dois fatores e timeout de sessão.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Configurações de E-mail</h4>
            <p className="text-sm text-muted-foreground">
              Definições de servidores SMTP, templates de e-mail e políticas de envio de mensagens.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Configurações de API</h4>
            <p className="text-sm text-muted-foreground">
              Limites de requisições, gerenciamento de chaves API e configurações de rate limiting.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Personalização de Interface</h3>
        <p>
          Administradores podem personalizar a aparência da plataforma através das configurações de interface:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Esquema de cores e temas</li>
          <li>Logos e identidade visual</li>
          <li>Elementos de navegação</li>
          <li>Mensagens de boas-vindas e tooltips informativos</li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Integrações</h3>
        <p>
          O sistema pode ser integrado com diversas ferramentas externas através da seção de integrações:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Sistemas de pagamento</li>
          <li>Plataformas de marketing</li>
          <li>Serviços de análise de dados</li>
          <li>CRMs e ferramentas de atendimento ao cliente</li>
          <li>Serviços de mensageria e notificações</li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Histórico de Alterações</h3>
        <p>
          Todas as modificações nas configurações do sistema são registradas em um log de auditoria,
          permitindo rastrear quem fez quais alterações e quando.
        </p>
      </div>
    </div>
  );
};

export default SettingsContent;
