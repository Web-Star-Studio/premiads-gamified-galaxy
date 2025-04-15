
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Shield,
  DatabaseZap,
  Bell,
  BarChart4,
  Ticket,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  
  // Create navigation items
  const navigationItems = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Usuários",
      url: "/admin/usuarios",
      icon: Users,
    },
    {
      title: "Acesso",
      url: "/admin/acesso",
      icon: Shield,
    },
    {
      title: "Regras",
      url: "/admin/regras",
      icon: FileText,
    },
    {
      title: "Monitoramento",
      url: "/admin/monitoramento",
      icon: DatabaseZap,
    },
    {
      title: "Relatórios",
      url: "/admin/relatorios",
      icon: BarChart4,
    },
    {
      title: "Sorteios",
      url: "/admin/sorteios",
      icon: Ticket,
    },
    {
      title: "Notificações",
      url: "/admin/notificacoes",
      icon: Bell,
    },
    {
      title: "Configurações",
      url: "/admin/configuracoes",
      icon: Settings,
    },
  ];

  return (
    <Sidebar 
      className="border-r border-galaxy-purple/30 bg-galaxy-dark"
      variant="sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="flex items-center justify-between p-4 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-galaxy-purple flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <div className="text-lg font-bold font-heading neon-text-pink">Admin</div>
        </div>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <div className="mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-galaxy-deepPurple/30 my-2">
            <Avatar className="h-10 w-10 border-2 border-neon-pink">
              <AvatarFallback className="bg-galaxy-purple text-white">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium truncate">Administrador</span>
              <span className="text-xs text-muted-foreground">Acesso total</span>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={location.pathname === item.url}
                    asChild
                    tooltip={item.title}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 h-10 px-3 text-base"
                      onClick={() => navigate(item.url)}
                    >
                      <item.icon className={location.pathname === item.url ? "text-neon-pink" : ""} />
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-gray-400 hover:text-white"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
