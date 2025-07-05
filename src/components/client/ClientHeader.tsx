
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useMediaQuery } from "@/hooks/use-mobile";
import { DrawerMenu } from "@/components/ui/drawer-menu";
import { DownloadButton } from "@/components/ui/download-button";
import { motion } from "framer-motion";
import { Menu, User, Home, Bell } from "lucide-react";

const ClientHeader = () => {
  const { userName } = useUserProfile();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [scrolled, setScrolled] = useState(false);
  
  // Menu items for the drawer menu
  const menuItems = [
    { label: "Dashboard", href: "/cliente" },
    { label: "Missões", href: "/cliente/missoes" },
    { label: "Indicações", href: "/cliente/indicacoes" },
    { label: "Sorteios", href: "/cliente/sorteios" },
    { label: "Cashback", href: "/cashback" },
    { label: "Perfil", href: "/cliente/perfil" },
  ];
  
  // Get the first letter of user's name for avatar
  const userInitial = userName?.charAt(0) || "U";
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);
  
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-40 py-2 transition-all duration-300 ${
        scrolled ? "bg-galaxy-dark/80 backdrop-blur-md shadow-lg" : "bg-galaxy-dark/60"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </Button>
          )}
          
          <Link to="/" className="text-xl font-bold font-heading neon-text-cyan flex items-center">
            <span className="text-white">Premi</span>Ads
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <DownloadButton 
            variant="ghost" 
            size="sm" 
            className="hidden md:flex"
          />
          
          <Link to="/cliente/notificacoes">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-neon-pink rounded-full"></span>
            </Button>
          </Link>
          
          <Link to="/cliente/perfil" className="hidden md:flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-neon-cyan/30">
              <AvatarFallback className="bg-galaxy-purple text-white text-sm">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{userName}</span>
          </Link>
          
          {/* Use drawer menu for mobile */}
          <DrawerMenu 
            items={menuItems}
            ctaButton={{
              label: "Sair",
              href: "/",
              onClick: () => {
                // Handle logout here if needed
                navigate("/");
              }
            }}
          />
        </div>
      </div>
    </motion.header>
  );
};

export default ClientHeader;
