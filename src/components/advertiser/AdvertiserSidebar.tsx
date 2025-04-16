
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import { 
  LayoutDashboard, 
  Flag, 
  CheckCircle, 
  Wallet, 
  UserCircle,
  ChevronRight
} from "lucide-react";

const AdvertiserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { playSound } = useSounds();
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/anunciante",
    },
    {
      title: "Campanhas",
      icon: <Flag className="h-5 w-5" />,
      path: "/anunciante/campanhas",
    },
    {
      title: "Moderação",
      icon: <CheckCircle className="h-5 w-5" />,
      path: "/anunciante/moderacao",
    },
    {
      title: "Créditos",
      icon: <Wallet className="h-5 w-5" />,
      path: "/anunciante/creditos",
    },
    {
      title: "Perfil",
      icon: <UserCircle className="h-5 w-5" />,
      path: "/anunciante/perfil",
    },
  ];

  const handleNavigation = (path: string) => {
    playSound("pop");
    navigate(path);
  };

  return (
    <div className="h-full w-64 bg-galaxy-darkPurple border-r border-galaxy-purple/20 p-4">
      <div className="space-y-1">
        {menuItems.map((item) => {
          const isActive = 
            (item.path === "/anunciante" && location.pathname === "/anunciante") || 
            (item.path !== "/anunciante" && location.pathname.startsWith(item.path));
            
          return (
            <motion.button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? "bg-galaxy-purple/20 text-neon-cyan"
                  : "text-gray-300 hover:bg-galaxy-purple/10 hover:text-white"
              }`}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="font-medium">{item.title}</span>
              </div>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4 text-neon-cyan" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default AdvertiserSidebar;
