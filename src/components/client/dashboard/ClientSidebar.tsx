
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
      className="border-r border-galaxy-purple/30 bg-galaxy-dark"
      variant="sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="flex items-center justify-between p-4 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-galaxy-purple flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <div className="text-lg font-bold font-heading neon-text-cyan">PremiAds</div>
        </div>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <div className="mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-galaxy-deepPurple/30 my-2">
            <Avatar className="h-10 w-10 border-2 border-neon-cyan">
              <AvatarFallback className="bg-galaxy-purple text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium truncate">{userName}</span>
              <span className="text-xs text-muted-foreground">{userPoints} pontos</span>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
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
                      <item.icon className={location.pathname === item.url ? "text-neon-cyan" : ""} />
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Estatísticas</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2 px-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Streak</span>
                <span className="text-sm text-neon-pink flex items-center">
                  <Star className="w-4 h-4 mr-1" /> {userStreak} dias
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pontos</span>
                <span className="text-sm text-neon-cyan flex items-center">
                  <Wallet className="w-4 h-4 mr-1" /> {userPoints}
                </span>
              </div>
            </div>
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

export default ClientSidebar;
