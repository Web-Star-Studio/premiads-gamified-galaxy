
import { useState, useEffect } from "react";
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
              Conformidade Legal
            </h4>
            <p className="text-sm mt-1">
              Todos os sorteios devem estar em conformidade com a legislação local aplicável. O sistema
              implementa verificações automáticas de conformidade, mas é responsabilidade do administrador
              garantir que todas as regras legais sejam seguidas.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "notifications",
      title: "Notificações",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sistema de Notificações</h3>
            <p>
              O módulo de notificações permite configurar, gerenciar e enviar diferentes tipos de notificações
              para usuários da plataforma, através de múltiplos canais.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Canais de Notificação</h3>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Notificações In-App</h4>
                <p className="text-sm text-muted-foreground">
                  Mensagens exibidas dentro da plataforma quando o usuário está online.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Email</h4>
                <p className="text-sm text-muted-foreground">
                  Mensagens enviadas para o endereço de email registrado do usuário.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Alertas enviados para dispositivos móveis mesmo quando o usuário não está usando o aplicativo.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">SMS</h4>
                <p className="text-sm text-muted-foreground">
                  Mensagens de texto enviadas para o número de telefone registrado do usuário.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Tipos de Notificações</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Notificações de sistema (manutenção, atualizações)</li>
              <li>Notificações de conta (verificação, segurança)</li>
              <li>Notificações de campanhas (novas campanhas, missões)</li>
              <li>Notificações de sorteios (participação, resultados)</li>
              <li>Notificações de prêmios (ganhos, resgates)</li>
              <li>Notificações de engajamento (lembretes, marcos)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Templates de Notificação</h3>
            <p>
              Administradores podem criar e gerenciar templates para diferentes tipos de notificações,
              com suporte a personalização de conteúdo usando variáveis dinâmicas.
            </p>
            <div className="mt-4 p-4 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30 font-mono text-sm overflow-x-auto">
              <pre>{`Olá {{user.firstName}},

Parabéns! Você acaba de ganhar {{prize.amount}} pontos por completar a missão "{{mission.name}}".

Continue participando para acumular mais pontos e aumentar suas chances no sorteio {{raffle.name}} que encerra em {{raffle.endDate}}.

Equipe PremiAds`}</pre>
            </div>
          </div>
          
          <div className="bg-neon-cyan/10 p-4 rounded-lg border border-neon-cyan/30">
            <h4 className="font-medium flex items-center gap-2">
              <Bell size={16} />
              Prática Recomendada
            </h4>
            <p className="text-sm mt-1">
              Respeite as preferências de notificação dos usuários e evite o envio excessivo de mensagens.
              Permita que os usuários configurem quais tipos de notificações desejam receber e por quais canais.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "settings",
      title: "Configurações",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Configurações do Sistema</h3>
            <p>
              O módulo de configurações permite ajustar diversos parâmetros da plataforma para personalizar
              seu comportamento e aparência.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Categorias de Configuração</h3>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Configurações Gerais</h4>
                <p className="text-sm text-muted-foreground">
                  Nome da plataforma, fuso horário padrão, dados de contato e outras configurações básicas.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Aparência</h4>
                <p className="text-sm text-muted-foreground">
                  Personalização de cores, logos, fontes e outros elementos visuais da plataforma.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Segurança</h4>
                <p className="text-sm text-muted-foreground">
                  Política de senhas, requisitos de autenticação e configurações de proteção contra fraudes.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Integrações</h4>
                <p className="text-sm text-muted-foreground">
                  Configurações para serviços de terceiros, como gateways de pagamento, provedores de email e análise.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Parâmetros do Sistema</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-galaxy-deepPurple/30">
                    <th className="border border-galaxy-purple/30 px-4 py-2 text-left">Parâmetro</th>
                    <th className="border border-galaxy-purple/30 px-4 py-2 text-left">Descrição</th>
                    <th className="border border-galaxy-purple/30 px-4 py-2 text-left">Valor Padrão</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-galaxy-purple/30 px-4 py-2 font-mono">SESSION_TIMEOUT</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2">Tempo de inatividade antes de encerrar a sessão (minutos)</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2">30</td>
                  </tr>
                  <tr>
                    <td className="border border-galaxy-purple/30 px-4 py-2 font-mono">PASSWORD_EXPIRY_DAYS</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2">Número de dias antes da expiração da senha</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2">90</td>
                  </tr>
                  <tr>
                    <td className="border border-galaxy-purple/30 px-4 py-2 font-mono">MAX_LOGIN_ATTEMPTS</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2">Tentativas de login antes do bloqueio temporário</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2">5</td>
                  </tr>
                  <tr>
                    <td className="border border-galaxy-purple/30 px-4 py-2 font-mono">POINTS_EXCHANGE_RATE</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2">Taxa de conversão de pontos para bilhetes de sorteio</td>
                    <td className="border border-galaxy-purple/30 px-4 py-2">100:1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
            <h4 className="font-medium flex items-center gap-2">
              <Settings size={16} />
              Importante
            </h4>
            <p className="text-sm mt-1">
              Alterações em configurações críticas do sistema podem afetar seu funcionamento. Sempre faça
              backup das configurações atuais antes de realizar mudanças significativas e teste as alterações
              em um ambiente de homologação primeiro.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "database",
      title: "Banco de Dados",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Estrutura do Banco de Dados</h3>
            <p>
              O sistema utiliza um banco de dados relacional para armazenar informações sobre usuários, campanhas, sorteios e outras entidades.
              A estrutura foi projetada para otimizar a performance e garantir a integridade dos dados.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Principais Tabelas</h3>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">users</h4>
                <p className="text-sm text-muted-foreground">
                  Armazena informações sobre todos os usuários da plataforma, incluindo perfil e credenciais.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">campaigns</h4>
                <p className="text-sm text-muted-foreground">
                  Contém dados sobre campanhas publicitárias, incluindo configurações, metas e orçamentos.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">raffles</h4>
                <p className="text-sm text-muted-foreground">
                  Armazena informações sobre sorteios, incluindo regras, prêmios e participantes.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">points_transactions</h4>
                <p className="text-sm text-muted-foreground">
                  Registra todas as transações de pontos, incluindo ganhos, gastos e transferências.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">missions</h4>
                <p className="text-sm text-muted-foreground">
                  Contém informações sobre missões disponíveis para os usuários completarem.
                </p>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">mission_submissions</h4>
                <p className="text-sm text-muted-foreground">
                  Armazena as submissões dos usuários para completar missões.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Modelo de Relações</h3>
            <p>
              As tabelas do banco de dados são conectadas através de chaves estrangeiras que estabelecem
              relações entre diferentes entidades no sistema.
            </p>
            <div className="mt-4 p-4 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
              <p className="text-sm">Exemplos de relações importantes:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                <li>Um <strong>usuário</strong> pode criar várias <strong>campanhas</strong> (um-para-muitos)</li>
                <li>Um <strong>usuário</strong> pode participar de vários <strong>sorteios</strong> e um <strong>sorteio</strong> pode ter vários <strong>participantes</strong> (muitos-para-muitos)</li>
                <li>Uma <strong>campanha</strong> pode ter várias <strong>missões</strong> associadas (um-para-muitos)</li>
                <li>Um <strong>usuário</strong> pode completar várias <strong>missões</strong> e uma <strong>missão</strong> pode ser completada por vários <strong>usuários</strong> (muitos-para-muitos)</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Backups e Recuperação</h3>
            <p>
              O sistema realiza backups automáticos do banco de dados em intervalos regulares para garantir
              a segurança dos dados. Os backups são armazenados em locais seguros e podem ser usados para
              recuperar o sistema em caso de falhas.
            </p>
            <div className="mt-4 p-4 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
              <h4 className="font-medium mb-2">Política de Backups:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Backups completos diários (realizados durante a madrugada)</li>
                <li>Backups incrementais a cada 4 horas</li>
                <li>Retenção de backups por 30 dias</li>
                <li>Teste de restauração mensal para validar a integridade dos backups</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
            <h4 className="font-medium flex items-center gap-2 text-red-400">
              <Database size={16} />
              Alerta de Segurança
            </h4>
            <p className="text-sm mt-1">
              O acesso direto ao banco de dados deve ser estritamente controlado e limitado apenas a 
              administradores autorizados. Todas as operações de banco de dados devem ser realizadas
              através das interfaces administrativas ou APIs seguras.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "faq",
      title: "FAQ Técnico",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Perguntas Frequentes</h3>
            <p>
              Esta seção contém respostas para perguntas técnicas frequentes sobre a plataforma.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
              <h4 className="font-medium mb-2">Como redefinir um usuário bloqueado?</h4>
              <p className="text-sm">
                Para redefinir um usuário que foi bloqueado após várias tentativas de login incorretas,
                acesse a página de Gerenciamento de Usuários, localize o usuário, clique no botão de edição
                e marque a opção "Desbloquear conta". O sistema também oferece a opção de enviar um email
                de redefinição de senha automaticamente.
              </p>
            </div>
            
            <div className="p-4 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
              <h4 className="font-medium mb-2">Como configurar um novo sorteio?</h4>
              <p className="text-sm">
                Acesse a seção de Gestão de Sorteios, clique em "Novo Sorteio" e siga o assistente de criação.
                Você precisará definir o nome, datas, prêmios, regras de participação e outros parâmetros.
                Todos os sorteios passam por uma validação automática para garantir conformidade com as regras
                configuradas no sistema.
              </p>
            </div>
            
            <div className="p-4 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
              <h4 className="font-medium mb-2">O que fazer em caso de falha no sistema?</h4>
              <p className="text-sm">
                Em caso de falha no sistema, siga o procedimento de recuperação:
              </p>
              <ol className="list-decimal pl-5 space-y-1 mt-2 text-sm">
                <li>Verifique os logs de erro para identificar a causa do problema</li>
                <li>Consulte o painel de monitoramento para avaliar o impacto</li>
                <li>Se necessário, reinicie o serviço afetado usando o painel de controle</li>
                <li>Se a falha persistir, entre em contato com o suporte técnico</li>
              </ol>
            </div>
            
            <div className="p-4 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
              <h4 className="font-medium mb-2">Como configurar novas notificações?</h4>
              <p className="text-sm">
                Para criar uma nova notificação, acesse a seção de Notificações e clique em "Novo Template".
                Defina o tipo de notificação, canais de envio e conteúdo da mensagem. Você pode usar variáveis
                dinâmicas para personalizar o conteúdo para cada usuário. Após criar o template, você pode
                configurar regras de disparo automático ou enviar notificações manualmente.
              </p>
            </div>
            
            <div className="p-4 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
              <h4 className="font-medium mb-2">Como interpretar os relatórios de desempenho?</h4>
              <p className="text-sm">
                Os relatórios de desempenho apresentam métricas-chave sobre o funcionamento da plataforma.
                Valores em vermelho indicam problemas que exigem atenção, amarelo indica alertas e verde
                indica funcionamento normal. Clique em qualquer métrica para ver detalhes históricos e
                tendências. Utilize os filtros disponíveis para focar em períodos ou aspectos específicos.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Recursos Adicionais</h3>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Manual Técnico Completo</h4>
                <p className="text-sm text-muted-foreground">
                  Documentação detalhada sobre todos os aspectos técnicos da plataforma.
                </p>
                <Button variant="outline" size="sm" className="mt-2 gap-2 w-full">
                  <Download size={14} />
                  Download PDF
                </Button>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Guia de Solução de Problemas</h4>
                <p className="text-sm text-muted-foreground">
                  Procedimentos para diagnosticar e resolver problemas comuns.
                </p>
                <Button variant="outline" size="sm" className="mt-2 gap-2 w-full">
                  <Download size={14} />
                  Download PDF
                </Button>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Vídeos de Treinamento</h4>
                <p className="text-sm text-muted-foreground">
                  Tutoriais em vídeo sobre como utilizar recursos avançados do sistema.
                </p>
                <Button variant="outline" size="sm" className="mt-2 gap-2 w-full">
                  <BookOpen size={14} />
                  Acessar Biblioteca
                </Button>
              </div>
              
              <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
                <h4 className="font-medium mb-1">Atualizações e Changelog</h4>
                <p className="text-sm text-muted-foreground">
                  Histórico de todas as mudanças e atualizações realizadas no sistema.
                </p>
                <Button variant="outline" size="sm" className="mt-2 gap-2 w-full">
                  <FileText size={14} />
                  Ver Histórico
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Filter content based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContent(docContent);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = docContent.filter(section => {
      // Check if title or any content includes the search query
      const titleMatch = section.title.toLowerCase().includes(query);
      // This is a simplified search - in a real app, you'd need to search through the JSX content
      return titleMatch;
    });
    
    setFilteredContent(filtered);
  }, [searchQuery]);
  
  // Handle printing the documentation
  const handlePrint = () => {
    toastInfo("Preparando impressão", "A documentação será preparada para impressão em uma nova janela.");
    window.print();
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        
        <div className="overflow-y-auto pb-20 fancy-scrollbar w-full">
          <div className="container px-4 py-8 mx-auto max-w-7xl">
            <DashboardHeader 
              title="Documentação do Sistema" 
              subtitle="Guia completo de administração da plataforma PremiAds" 
            />

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6"
            >
              <Card className="bg-galaxy-deepPurple border-galaxy-purple/30">
                <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-heading text-white">
                      Manual Técnico e Administrativo
                    </CardTitle>
                    <CardDescription>
                      Documentação abrangente sobre todos os aspectos da plataforma PremiAds
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
                      <Printer className="h-4 w-4" />
                      <span className="hidden sm:inline">Imprimir</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Baixar PDF</span>
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Pesquisar na documentação..."
                      className="pl-10 bg-galaxy-dark border-galaxy-purple/30"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Tabs
                    defaultValue="documentation"
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-2 w-full bg-galaxy-dark">
                      <TabsTrigger value="documentation">Documentação</TabsTrigger>
                      <TabsTrigger value="navigation">Índice</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="documentation" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Sidebar/Navigation */}
                        <div className="hidden md:block">
                          <div className="sticky top-4">
                            <div className="bg-galaxy-dark p-4 rounded-lg border border-galaxy-purple/30">
                              <h3 className="font-medium mb-4 text-white">Seções</h3>
                              <nav>
                                <ul className="space-y-1">
                                  {docSections.map((section) => (
                                    <li key={section.id}>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`w-full justify-start gap-2 text-left ${
                                          activeSection === section.id ? "bg-galaxy-purple/20 text-neon-cyan" : ""
                                        }`}
                                        onClick={() => setActiveSection(section.id)}
                                      >
                                        <section.icon className="h-4 w-4" />
                                        <span>{section.title}</span>
                                        {activeSection === section.id && (
                                          <ChevronRight className="h-4 w-4 ml-auto" />
                                        )}
                                      </Button>
                                    </li>
                                  ))}
                                </ul>
                              </nav>
                            </div>
                          </div>
                        </div>
                        
                        {/* Main Content */}
                        <div className="md:col-span-3">
                          <ScrollArea className="h-[calc(100vh-280px)] pr-4">
                            {filteredContent.length > 0 ? (
                              <div className="space-y-8">
                                {filteredContent.map((section) => (
                                  <div 
                                    key={section.id} 
                                    id={section.id}
                                    className={activeSection === section.id ? "" : ""}
                                  >
                                    <div className="flex items-center gap-2 mb-4">
                                      {docSections.find(s => s.id === section.id)?.icon && (
                                        <div className="p-2 rounded-lg bg-galaxy-purple/20">
                                          {React.createElement(docSections.find(s => s.id === section.id)?.icon as any, { size: 20 })}
                                        </div>
                                      )}
                                      <h2 className="text-xl font-semibold">{section.title}</h2>
                                    </div>
                                    <div className="pl-3 border-l-2 border-galaxy-purple/30">
                                      {section.content}
                                    </div>
                                    <Separator className="mt-8 bg-galaxy-purple/30" />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-12">
                                <p className="text-muted-foreground mb-4">Nenhum resultado encontrado para "{searchQuery}"</p>
                                <Button
                                  variant="outline"
                                  onClick={() => setSearchQuery("")}
                                >
                                  Limpar pesquisa
                                </Button>
                              </div>
                            )}
                          </ScrollArea>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="navigation" className="mt-4">
                      <div className="bg-galaxy-dark p-6 rounded-lg border border-galaxy-purple/30">
                        <h3 className="font-medium mb-6 text-lg">Índice da Documentação</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          {docSections.map((section) => (
                            <Button
                              key={section.id}
                              variant="outline"
                              className="flex justify-start items-center gap-3 h-auto py-4 px-4 bg-galaxy-deepPurple/20"
                              onClick={() => {
                                setActiveSection(section.id);
                                const tabsElement = document.querySelector('[data-state="active"][value="documentation"]');
                                if (!tabsElement) {
                                  const tabTrigger = document.querySelector('button[value="documentation"]');
                                  if (tabTrigger) {
                                    (tabTrigger as HTMLButtonElement).click();
                                  }
                                }
                                setTimeout(() => {
                                  const sectionElement = document.getElementById(section.id);
                                  if (sectionElement) {
                                    sectionElement.scrollIntoView({ behavior: 'smooth' });
                                  }
                                }, 100);
                              }}
                            >
                              <div className="p-2 rounded-lg bg-galaxy-purple/20 text-neon-cyan">
                                <section.icon className="h-5 w-5" />
                              </div>
                              <div className="flex flex-col text-left">
                                <span>{section.title}</span>
                                <span className="text-xs text-muted-foreground">{docContent.find(c => c.id === section.id)?.title}</span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DocumentationPage;
