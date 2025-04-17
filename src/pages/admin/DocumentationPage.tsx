
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { 
  Search, ChevronRight, BookOpen, Server, Shield, Users, Settings,
  Database, BarChart4, Bell, Ticket, FileText, HelpCircle, Download, Printer
} from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toastInfo } from "@/utils/toast";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/admin/DashboardHeader";
import { useMediaQuery } from "@/hooks/use-mobile";

const DocumentationPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [filteredContent, setFilteredContent] = useState<any[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Define documentation sections with IDs for navigation
  const docSections = [
    { id: "overview", title: "Visão Geral", icon: BookOpen },
    { id: "dashboard", title: "Painel Principal", icon: BarChart4 },
    { id: "users", title: "Gestão de Usuários", icon: Users },
    { id: "access", title: "Controle de Acesso", icon: Shield },
    { id: "rules", title: "Configuração de Regras", icon: FileText },
    { id: "monitoring", title: "Monitoramento", icon: Server },
    { id: "reports", title: "Relatórios", icon: BarChart4 },
    { id: "raffles", title: "Gestão de Sorteios", icon: Ticket },
    { id: "notifications", title: "Notificações", icon: Bell },
    { id: "settings", title: "Configurações", icon: Settings },
    { id: "database", title: "Banco de Dados", icon: Database },
    { id: "faq", title: "FAQ Técnico", icon: HelpCircle }
  ];

  // Documentation content organized by section
  const docContent = [
    {
      id: "overview",
      title: "Visão Geral do Sistema",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sobre o PremiAds</h3>
            <p>
              O PremiAds é uma plataforma de marketing digital que combina anúncios com mecânicas de gamificação e sorteios. 
              O sistema conecta três tipos principais de usuários: administradores, anunciantes e participantes.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Arquitetura do Sistema</h3>
            <p>
              A plataforma é construída com uma arquitetura moderna baseada em React no frontend e uma API RESTful no backend. 
              Os dados são armazenados em um banco de dados relacional com camadas de cache para otimização de desempenho.
            </p>
            <div className="mt-4 p-4 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
              <h4 className="font-medium mb-2">Componentes Principais:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Interface de administração (Painel Admin)</li>
                <li>Portal de anunciantes</li>
                <li>Aplicação para participantes</li>
                <li>Serviço de autenticação e controle de acesso</li>
                <li>Sistema de sorteios e premiações</li>
                <li>Motor de análise de dados</li>
                <li>API de integração</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Fluxo de Dados</h3>
            <p>
              O sistema processa informações de campanhas publicitárias, interações de usuários, 
              análises de engajamento e sorteios, utilizando filas de processamento para operações assíncronas.
            </p>
          </div>
          
          <div className="p-4 bg-neon-cyan/10 rounded-lg border border-neon-cyan/30">
            <h3 className="text-lg font-semibold mb-2">Versão Atual</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Versão: <span className="font-mono">1.5.2</span></p>
                <p className="text-sm">Data da atualização: <span className="font-mono">17/04/2025</span></p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download size={14} />
                Changelog
              </Button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "dashboard",
      title: "Painel Principal",
      content: (
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
      )
    },
    {
      id: "users",
      title: "Gestão de Usuários",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Visão Geral do Gerenciamento de Usuários</h3>
            <p>
              O módulo de gerenciamento de usuários permite criar, editar, desativar e gerenciar todos os usuários da plataforma.
              O sistema usa um modelo de permissões baseado em papéis.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Tipos de Usuários</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-neon-pink text-white">Admin</Badge>
                <span>Acesso total à plataforma e configurações do sistema</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-neon-cyan text-galaxy-dark">Moderador</Badge>
                <span>Pode moderar conteúdo e gerenciar certos aspectos do sistema</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-neon-lime/80 text-galaxy-dark">Anunciante</Badge>
                <span>Pode criar e gerenciar campanhas publicitárias</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Participante</Badge>
                <span>Usuário final que interage com as campanhas e participa de sorteios</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Operações Principais</h3>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Criação de Usuários</h4>
                <p className="text-sm text-muted-foreground">
                  Administradores podem criar novos usuários, definir seus papéis e configurar suas permissões iniciais.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Edição de Usuários</h4>
                <p className="text-sm text-muted-foreground">
                  Modificar perfis de usuários existentes, alterar papéis ou ajustar permissões.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Desativação/Reativação</h4>
                <p className="text-sm text-muted-foreground">
                  Desativar temporariamente ou reativar contas de usuário sem excluí-las permanentemente.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Exclusão de Usuários</h4>
                <p className="text-sm text-muted-foreground">
                  Excluir permanentemente um usuário e todos os seus dados associados (requer confirmação em múltiplas etapas).
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
            <h4 className="font-medium flex items-center gap-2 text-red-400">
              <Shield size={16} />
              Importante
            </h4>
            <p className="text-sm mt-1">
              A exclusão de usuários é irreversível e pode afetar a integridade dos dados do sistema. Recomenda-se 
              desativar contas em vez de excluí-las permanentemente sempre que possível.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "access",
      title: "Controle de Acesso",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sistema de Permissões</h3>
            <p>
              O controle de acesso é baseado em um modelo RBAC (Role-Based Access Control) com permissões granulares
              que podem ser atribuídas a papéis específicos.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Matriz de Permissões</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-galaxy-deepPurple/30">
                    <th className="border border-galaxy-purple/30 px-4 py-2 text-left">Recurso</th>
                    <th className="border border-galaxy-purple/30 px-4 py-2 text-center">Admin</th>
                    <th className="border border-galaxy-purple/30 px-4 py-2 text-center">Moderador</th>
                    <th className="border border-galaxy-purple/30 px-4 py-2 text-center">Anunciante</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-galaxy-purple/30 px-4 py-2">Dashboard Administrativo</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓ (limitado)</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✕</td>
                  </tr>
                  <tr>
                    <td className="border border-galaxy-purple/30 px-4 py-2">Gerenciamento de Usuários</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✕</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✕</td>
                  </tr>
                  <tr>
                    <td className="border border-galaxy-purple/30 px-4 py-2">Moderação de Conteúdo</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✕</td>
                  </tr>
                  <tr>
                    <td className="border border-galaxy-purple/30 px-4 py-2">Gestão de Campanhas</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓ (visualizar)</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓ (próprias)</td>
                  </tr>
                  <tr>
                    <td className="border border-galaxy-purple/30 px-4 py-2">Configurações do Sistema</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✕</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✕</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Registro de Auditoria</h3>
            <p>
              Todas as ações de administradores e moderadores são registradas em um log de auditoria para 
              garantir conformidade e rastreabilidade. Os logs incluem o usuário, ação realizada, timestamp e endereço IP.
            </p>
          </div>
          
          <div className="bg-neon-cyan/10 p-4 rounded-lg border border-neon-cyan/30">
            <h4 className="font-medium flex items-center gap-2">
              <Shield size={16} />
              Prática Recomendada
            </h4>
            <p className="text-sm mt-1">
              Aplique o princípio do privilégio mínimo: atribua apenas as permissões que um usuário precisa para 
              realizar suas funções específicas, evitando acesso desnecessário a recursos sensíveis.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "rules",
      title: "Configuração de Regras",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Motor de Regras</h3>
            <p>
              O sistema utiliza um motor de regras configurável para definir lógicas de negócio que controlam 
              diversos aspectos da plataforma, desde a elegibilidade para participação em sorteios até regras de moderação.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Tipos de Regras</h3>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Regras de Participação</h4>
                <p className="text-sm text-muted-foreground">
                  Definem quem pode participar de sorteios, missões ou outras atividades da plataforma.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Regras de Conteúdo</h4>
                <p className="text-sm text-muted-foreground">
                  Controlam o que pode ser publicado, incluindo filtros para conteúdo impróprio e restrições.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Regras de Premiação</h4>
                <p className="text-sm text-muted-foreground">
                  Definem como os prêmios são distribuídos, incluindo probabilidades e requisitos.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Regras de Negócios</h4>
                <p className="text-sm text-muted-foreground">
                  Controlam processos internos, como aprovação de campanhas e processamento de pagamentos.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Estrutura de Regras</h3>
            <p>
              As regras são definidas usando um formato condicional (SE-ENTÃO-SENÃO) e podem ser combinadas usando 
              operadores lógicos para criar regras complexas baseadas em múltiplos critérios.
            </p>
            <div className="mt-4 p-4 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30 font-mono text-sm overflow-x-auto">
              <pre>{`{
  "id": "rule_eligibility_001",
  "name": "Participação em Sorteio Premium",
  "conditions": [
    { "field": "user.status", "operator": "equals", "value": "active" },
    { "field": "user.points", "operator": "greaterThan", "value": 1000 },
    { "field": "user.age", "operator": "greaterThanOrEqual", "value": 18 }
  ],
  "conditionLogic": "AND",
  "actions": [
    { "type": "setEligible", "value": true },
    { "type": "addBonus", "value": 50 }
  ]
}`}</pre>
            </div>
          </div>
          
          <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
            <h4 className="font-medium flex items-center gap-2">
              <HelpCircle size={16} />
              Importante
            </h4>
            <p className="text-sm mt-1">
              Alterações nas regras podem ter efeitos amplos no comportamento do sistema. Sempre teste novas regras 
              em um ambiente de homologação antes de aplicá-las ao ambiente de produção.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "monitoring",
      title: "Monitoramento",
      content: (
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
      )
    },
    {
      id: "reports",
      title: "Relatórios",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sistema de Relatórios</h3>
            <p>
              O módulo de relatórios permite gerar análises detalhadas sobre diversos aspectos da plataforma,
              incluindo desempenho de campanhas, comportamento dos usuários e métricas financeiras.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Relatórios Disponíveis</h3>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Relatório de Desempenho de Campanhas</h4>
                <p className="text-sm text-muted-foreground">
                  Análise completa do desempenho de campanhas publicitárias, incluindo visualizações, cliques e conversões.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Relatório de Engajamento de Usuários</h4>
                <p className="text-sm text-muted-foreground">
                  Dados sobre como os usuários estão interagindo com a plataforma, incluindo tempo de sessão e ações realizadas.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Relatório Financeiro</h4>
                <p className="text-sm text-muted-foreground">
                  Visão geral das transações financeiras, receitas de anunciantes e pagamentos de prêmios.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Relatório de Sorteios</h4>
                <p className="text-sm text-muted-foreground">
                  Dados sobre participação em sorteios, número de bilhetes gerados e prêmios distribuídos.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Exportação de Dados</h3>
            <p>
              Os relatórios podem ser exportados em vários formatos, incluindo PDF, Excel e CSV,
              para análise posterior ou compartilhamento com stakeholders.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download size={14} />
                Exportar PDF
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download size={14} />
                Exportar Excel
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download size={14} />
                Exportar CSV
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Printer size={14} />
                Imprimir
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Relatórios Agendados</h3>
            <p>
              Administradores podem configurar relatórios para serem gerados e enviados automaticamente
              em intervalos predefinidos, como diariamente, semanalmente ou mensalmente.
            </p>
          </div>
          
          <div className="bg-neon-cyan/10 p-4 rounded-lg border border-neon-cyan/30">
            <h4 className="font-medium flex items-center gap-2">
              <BarChart4 size={16} />
              Dica de Uso
            </h4>
            <p className="text-sm mt-1">
              Utilize filtros avançados para refinar os dados exibidos nos relatórios. Os relatórios podem
              ser filtrados por data, tipo de campanha, segmento de usuário e muitos outros critérios.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "raffles",
      title: "Gestão de Sorteios",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sistema de Sorteios</h3>
            <p>
              O módulo de gestão de sorteios permite criar, configurar e gerenciar diferentes tipos de sorteios
              na plataforma, desde sorteios simples até mecânicas complexas de premiação.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Tipos de Sorteios</h3>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Sorteio Padrão</h4>
                <p className="text-sm text-muted-foreground">
                  Sorteio tradicional onde os usuários adquirem bilhetes para concorrer a prêmios específicos.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Sorteio Instantâneo</h4>
                <p className="text-sm text-muted-foreground">
                  Usuários descobrem imediatamente se ganharam ao participar, similar a uma raspadinha digital.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Sorteio de Missões</h4>
                <p className="text-sm text-muted-foreground">
                  Prêmios são sorteados entre usuários que completaram determinadas missões ou desafios.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Sorteio de Fidelidade</h4>
                <p className="text-sm text-muted-foreground">
                  Premiação exclusiva para usuários que mantêm um determinado nível de atividade contínua.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Configuração de Sorteios</h3>
            <p>
              Ao criar um novo sorteio, os administradores podem configurar diversos parâmetros, incluindo:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Datas de início e término do sorteio</li>
              <li>Prêmios disponíveis e suas quantidades</li>
              <li>Regras de elegibilidade para participação</li>
              <li>Método de sorteio e algoritmo utilizado</li>
              <li>Mecânicas de aquisição de bilhetes</li>
              <li>Recursos visuais e branding do sorteio</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Realização do Sorteio</h3>
            <p>
              O sistema utiliza um gerador de números aleatórios criptograficamente seguro para garantir a
              imparcialidade dos sorteios. Todos os sorteios são automaticamente auditados, com registros
              detalhados de cada etapa do processo.
            </p>
          </div>
          
          <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
            <h4 className="font-medium flex items-center gap-2 text-red-400">
              <Shield size={16} />
              Importante
            </h4>
            <p className="text-sm mt-1">
              A integridade do processo de sorteio é fundamental para a credibilidade da plataforma.
              Qualquer modificação no algoritmo de sorteio deve ser cuidadosamente documentada e auditada.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950/90">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          title="Documentação" 
          subtitle="Base de conhecimento técnico" 
        />
        
        <div className="p-6">
          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-800 pb-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-xl font-semibold">
                  Documentação Técnica
                </CardTitle>
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
              </div>
              <CardDescription className="mt-2">
                Guia completo de funcionamento e configuração do sistema PremiAds
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <aside className="w-full md:w-64 border-r border-zinc-800 shrink-0">
                  <ScrollArea className="h-[calc(100vh-13rem)]">
                    <div className="p-4 space-y-1">
                      {docSections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        
                        return (
                          <Button
                            key={section.id}
                            variant="ghost"
                            className={`w-full justify-start ${
                              isActive 
                                ? "bg-galaxy-deepPurple/40 hover:bg-galaxy-deepPurple/50 text-white" 
                                : "hover:bg-zinc-900 text-zinc-400 hover:text-white"
                            }`}
                            onClick={() => {
                              setActiveSection(section.id);
                              toastInfo(`Seção "${section.title}" carregada`);
                            }}
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            {section.title}
                            {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                          </Button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </aside>
                
                <div className="flex-1">
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
                          {docContent.find(item => item.id === activeSection)?.content || (
                            <div className="flex flex-col items-center justify-center h-64">
                              <FileText className="h-12 w-12 text-zinc-700 mb-4" />
                              <p className="text-zinc-500 text-center">
                                Selecione uma seção da documentação para visualizar o conteúdo
                              </p>
                            </div>
                          )}
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
                            <Button variant="outline">
                              <div className="flex items-center">
                                <Download className="mr-2 h-4 w-4" />
                                Baixar Exemplos
                              </div>
                            </Button>
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
                                API REST para interação com o módulo {docContent.find(item => item.id === activeSection)?.title || activeSection}.
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
