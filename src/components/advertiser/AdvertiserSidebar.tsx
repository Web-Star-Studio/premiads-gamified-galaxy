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
  Shield,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useMediaQuery } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { CreditsDisplay } from "@/components/credits/credits-display";

export const AdvertiserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { setOpen, state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile, setOpen]);
  
  // Get user info from context or props
  const userName = user?.user_metadata?.name || localStorage.getItem("userName") || "Anunciante";
  
  // Get the first letter of the user name for the avatar fallback
  const userInitial = userName?.charAt(0) || "A";
  
  // Create navigation items with routes matching the AdvertiserRoutes.tsx paths
  const navigationItems = [
    {
      title: "Dashboard",
      url: "/anunciante",
      icon: LayoutDashboard,
    },
    {
      title: "Campanhas",
      url: "/anunciante/campanhas",
      icon: FileText,
    },
    {
      title: "Cashbacks",
      url: "/anunciante/cashbacks",
      icon: Wallet,
    },
    {
      title: "Moderação",
      url: "/anunciante/moderacao",
      icon: Shield,
    },
    {
      title: "Análises",
      url: "/anunciante/analises",
      icon: BarChart3,
    },
    {
      title: "CRM",
      url: "/anunciante/crm",
      icon: Users,
    },
    {
      title: "Créditos",
      url: "/anunciante/creditos",
      icon: Wallet,
    },
    {
      title: "Notificações",
      url: "/anunciante/notificacoes",
      icon: BellRing,
    },
    {
      title: "Perfil",
      url: "/anunciante/perfil",
      icon: User,
    },
    {
      title: "Configurações",
      url: "/anunciante/configuracoes",
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
              <CreditsDisplay className="text-xs text-muted-foreground" />
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
                  <Wallet className="w-4 h-4 mr-1" />
                  <CreditsDisplay showLabel={false} />
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
          onClick={signOut}
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
