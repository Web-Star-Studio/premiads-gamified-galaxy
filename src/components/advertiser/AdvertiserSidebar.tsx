import { useState, useEffect } from "react";
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
  FileText,
  BarChart3,
  Wallet,
  User,
  Settings,
  LogOut,
  BellRing,
  BadgePlus,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useMediaQuery } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { signOutAndCleanup } from "@/utils/auth"; // <--- Import robust logout

export const AdvertiserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { setOpen, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile, setOpen]);

  const userName = localStorage.getItem("userName") || "Anunciante";
  const userCredits = parseInt(localStorage.getItem("userCredits") || "0");
  const userInitial = userName?.charAt(0) || "A";

  const navigationItems = [
    { title: "Dashboard", url: "/anunciante", icon: LayoutDashboard },
    { title: "Campanhas", url: "/anunciante/campanhas", icon: FileText },
    { title: "Nova Campanha", url: "/anunciante/nova-campanha", icon: BadgePlus },
    { title: "Moderação", url: "/anunciante/moderacao", icon: Shield },
    { title: "Análises", url: "/anunciante/analises", icon: BarChart3 },
    { title: "Créditos", url: "/anunciante/creditos", icon: Wallet },
    { title: "Notificações", url: "/anunciante/notificacoes", icon: BellRing },
    { title: "Perfil", url: "/anunciante/perfil", icon: User },
    { title: "Configurações", url: "/anunciante/configuracoes", icon: Settings },
  ];

  // Use global handler for logout
  const handleLogout = async () => {
    await signOutAndCleanup();
  };

  
  return (
    <Sidebar
      className="border-r border-galaxy-purple/30 bg-galaxy-dark"
      variant="sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="flex items-center justify-between p-4 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-galaxy-purple flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <div className={cn("text-lg font-bold font-heading neon-text-cyan transition-opacity duration-200", 
            isCollapsed ? "opacity-0" : "opacity-100")}>
            PremiAds
          </div>
        </div>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <div className="mb-6">
          <div className={cn("flex items-center gap-3 p-3 rounded-lg bg-galaxy-deepPurple/30 my-2",
            isCollapsed ? "justify-center" : "")}>
            <Avatar className="h-10 w-10 border-2 border-neon-cyan flex-shrink-0">
              <AvatarFallback className="bg-galaxy-purple text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col transition-opacity duration-200", 
              isCollapsed ? "hidden" : "")}>
              <span className="font-medium truncate">{userName}</span>
              <span className="text-xs text-muted-foreground">{userCredits} créditos</span>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={cn("transition-opacity duration-200", 
            isCollapsed ? "sr-only" : "")}>
            Menu
          </SidebarGroupLabel>
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
                      className={cn(
                        "w-full justify-start gap-2 h-10 px-3 text-base",
                        location.pathname === item.url ? "bg-galaxy-purple/20" : ""
                      )}
                      onClick={() => navigate(item.url)}
                    >
                      <item.icon className={location.pathname === item.url ? "text-neon-cyan" : ""} />
                      <span className={cn("transition-opacity duration-200", 
                        isCollapsed ? "opacity-0 w-0 p-0 overflow-hidden" : "opacity-100")}>
                        {item.title}
                      </span>
                      {item.title === "Moderação" && !isCollapsed && (
                        <span className="ml-auto px-2 py-0.5 text-xs bg-neon-cyan/20 text-neon-cyan rounded-full font-semibold">
                          Novo
                        </span>
                      )}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={cn("transition-opacity duration-200", 
            isCollapsed ? "sr-only" : "")}>
            Status
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className={cn("space-y-2 px-2", isCollapsed ? "hidden" : "")}>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Créditos</span>
                <span className="text-sm text-neon-cyan flex items-center">
                  <Wallet className="w-4 h-4 mr-1" /> {userCredits}
                </span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full text-gray-400 hover:text-white", 
            isCollapsed ? "justify-center px-0" : "justify-start gap-2"
          )}
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className={cn("transition-opacity duration-200", 
            isCollapsed ? "hidden" : "")}>
            Sair
          </span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdvertiserSidebar;
