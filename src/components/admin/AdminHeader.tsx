
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useMediaQuery } from "@/hooks/use-mobile";
import { DrawerMenu } from "@/components/ui/drawer-menu";
import { motion } from "framer-motion";
import { Menu, Shield, Bell, LogOut } from "lucide-react";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [scrolled, setScrolled] = useState(false);
  
  // Menu items for the drawer menu
  const menuItems = [
    { label: "Painel Master", href: "/admin" },
    { label: "Sorteios", href: "/admin/sorteios" },
    { label: "Usuários", href: "/admin/usuarios" },
    { label: "Acesso", href: "/admin/acesso" },
    { label: "Regras", href: "/admin/regras" },
    { label: "Monitoramento", href: "/admin/monitoramento" },
    { label: "Relatórios", href: "/admin/relatorios" },
    { label: "Notificações", href: "/admin/notificacoes" },
    { label: "Configurações", href: "/admin/configuracoes" },
  ];
  
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
          
          <Link to="/" className="text-xl font-bold font-heading neon-text-pink flex items-center">
            <Shield size={20} className="mr-2" />
            <span>Admin</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Link to="/admin/notificacoes">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-neon-cyan rounded-full"></span>
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => navigate("/")}
          >
            <LogOut size={20} />
          </Button>
          
          <Link to="/admin/perfil" className="hidden md:flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-neon-pink/30">
              <AvatarFallback className="bg-galaxy-deepPurple text-white text-sm">
                A
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Administrador</span>
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

export default AdminHeader;
