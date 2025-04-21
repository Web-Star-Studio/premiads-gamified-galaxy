
import React from "react";
import NavigationItem from "./NavigationItem";
import { 
  Home, Users, Ticket, FileText, Shield, BarChart, Settings, Bell, 
  Eye, Book, Scale, Database
} from "lucide-react";

export const NavigationItems = () => {
  return (
    <div className="space-y-1">
      <NavigationItem title="Dashboard" url="/admin" icon={Home} description="Visão geral do sistema" />
      <NavigationItem title="Usuários" url="/admin/users" icon={Users} description="Gerenciamento de usuários" />
      <NavigationItem title="Sorteios" url="/admin/lottery" icon={Ticket} description="Gerenciamento de sorteios" />
      <NavigationItem title="Moderação" url="/admin/moderation" icon={Eye} description="Moderação de conteúdo" />
      <NavigationItem title="Regras" url="/admin/rules" icon={Scale} description="Configuração de regras" />
      <NavigationItem title="Relatórios" url="/admin/reports" icon={BarChart} description="Relatórios e estatísticas" />
      <NavigationItem title="Monitoramento" url="/admin/monitoring" icon={Shield} description="Monitoramento do sistema" />
      <NavigationItem title="Notificações" url="/admin/notifications" icon={Bell} description="Gerenciamento de notificações" />
      <NavigationItem title="Controle de Acesso" url="/admin/access" icon={Shield} description="Controle de acesso ao sistema" />
      <NavigationItem title="Documentação" url="/admin/documentation" icon={Book} description="Documentação do sistema" />
      <NavigationItem title="Configurações" url="/admin/settings" icon={Settings} description="Configurações do sistema" />
      <NavigationItem title="Limpeza" url="/admin/cleanup" icon={Database} description="Limpeza e manutenção do banco de dados" />
    </div>
  );
};

export default NavigationItems;
