
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Shield,
  DatabaseZap,
  Bell,
  BarChart4,
  Ticket,
  FileText
} from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar";
import NavigationItem, { NavigationItemProps } from "./NavigationItem";

export const NavigationItems = () => {
  // Navigation items with descriptive properties
  const navigationItems: NavigationItemProps[] = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      description: "Visão geral do sistema"
    },
    {
      title: "Usuários",
      url: "/admin/usuarios",
      icon: Users,
      description: "Gerenciamento de usuários"
    },
    {
      title: "Acesso",
      url: "/admin/acesso",
      icon: Shield,
      description: "Controle de permissões"
    },
    {
      title: "Regras",
      url: "/admin/regras",
      icon: FileText,
      description: "Configurações de regras"
    },
    {
      title: "Monitoramento",
      url: "/admin/monitoramento",
      icon: DatabaseZap,
      description: "Status do sistema"
    },
    {
      title: "Relatórios",
      url: "/admin/relatorios",
      icon: BarChart4,
      description: "Análise de dados"
    },
    {
      title: "Sorteios",
      url: "/admin/sorteios",
      icon: Ticket,
      description: "Gestão de sorteios"
    },
    {
      title: "Notificações",
      url: "/admin/notificacoes",
      icon: Bell,
      description: "Gerenciar notificações"
    },
    {
      title: "Configurações",
      url: "/admin/configuracoes",
      icon: Settings,
      description: "Configurações do sistema"
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Sistema</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <NavigationItem 
              key={item.title} 
              title={item.title} 
              url={item.url} 
              icon={item.icon} 
              description={item.description} 
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default NavigationItems;
