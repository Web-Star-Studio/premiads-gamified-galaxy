
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
  Home, 
  FileText, 
  Users, 
  Gift, 
  User, 
  Settings, 
  LogOut, 
  ChevronLeft,
  Wallet,
  Star,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useSidebar } from "@/hooks/use-sidebar";
import { useMediaQuery } from "@/hooks/use-mobile";

export const ClientSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { setOpen } = useSidebar();
  
  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile, setOpen]);
  
  // Get user info from context or props
  // Don't use useClientDashboard here since we don't want to make API calls twice
  const userName = localStorage.getItem("userName") || "Usuário";
  const userPoints = parseInt(localStorage.getItem("userPoints") || "0");
  const userStreak = parseInt(localStorage.getItem("userStreak") || "0");
  
  // Get the first letter of the user name for the avatar fallback
  const userInitial = userName?.charAt(0) || "U";
  
  // Create navigation items
  const navigationItems = [
    {
      title: "Dashboard",
      url: "/cliente",
      icon: Home,
    },
    {
      title: "Missões",
      url: "/cliente/missoes",
      icon: FileText,
    },
    {
      title: "Indicações",
      url: "/cliente/indicacoes",
      icon: Users,
    },
    {
      title: "Sorteios",
      url: "/cliente/sorteios",
      icon: Gift,
    },
    {
      title: "Cashback",
      url: "/cashback",
      icon: DollarSign,
    },
    {
      title: "Perfil",
      url: "/cliente/perfil",
      icon: User,
    },
  ];

  return (
    <Sidebar 
      className="border-r border-white/5 bg-gradient-to-b from-galaxy-dark to-galaxy-deepPurple"
      variant="sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="flex items-center justify-between p-4 pt-6 bg-gradient-to-r from-galaxy-purple/20 to-galaxy-blue/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-galaxy-purple flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">P</span>
          </div>
          <div className="text-lg font-bold font-heading neon-text-cyan">PremiAds</div>
        </div>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 p-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 my-2 hover:bg-white/10 transition-colors">
            <Avatar className="h-11 w-11 border-2 border-neon-cyan shadow-lg shadow-neon-cyan/20">
              <AvatarFallback className="bg-gradient-to-br from-galaxy-blue to-galaxy-purple text-white font-semibold">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium truncate">{userName}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Wallet className="w-3 h-3 text-neon-cyan" /> {userPoints} pontos
              </span>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 px-3 py-2">Menu</SidebarGroupLabel>
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
                        "w-full justify-start gap-2 h-10 px-3 text-base rounded-xl",
                        location.pathname === item.url ? 
                          "bg-blue-purple-gradient text-white" : 
                          "hover:bg-white/5"
                      )}
                      onClick={() => navigate(item.url)}
                    >
                      <item.icon className={location.pathname === item.url ? "text-white" : "text-gray-400"} />
                      <span>{item.title}</span>
                      {item.title === "Sorteios" && (
                        <span className="ml-auto px-2 py-0.5 text-xs bg-neon-pink/20 text-neon-pink rounded-full font-semibold">
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

        <div className="p-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 mt-6">
          <h4 className="text-xs font-semibold text-gray-400 mb-3">Estatísticas</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Streak</span>
                <span className="text-sm text-neon-pink flex items-center">
                  <Star className="w-4 h-4 mr-1" /> {userStreak} dias
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-neon-pink to-galaxy-purple" 
                  style={{ width: `${Math.min(userStreak * 10, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Nível</span>
                <span className="text-sm text-neon-cyan">Iniciante</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-neon-cyan to-galaxy-blue" 
                  style={{ width: "35%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-3 mt-auto border-t border-white/5">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ClientSidebar;
