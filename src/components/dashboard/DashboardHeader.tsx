
import { motion } from "framer-motion";
import { Home, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NotificationCenter from "@/components/client/NotificationCenter";

interface DashboardHeaderProps {
  userName: string;
  streak?: number;
}

const DashboardHeader = ({ userName, streak = 0 }: DashboardHeaderProps) => (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
            <Home className="w-5 h-5" />
          </Button>
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold md:text-3xl font-heading">
            Bem-vindo de volta, <span className="neon-text-cyan">{userName}</span>!
          </h1>
          {streak > 0 && (
            <p className="text-sm text-gray-400">
              Seu streak atual: <span className="text-neon-pink font-semibold">{streak} dias</span>
            </p>
          )}
        </motion.div>
      </div>
      
      <div className="flex items-center gap-2">
        <NotificationCenter />
        
        <Link to="/cliente/perfil">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </header>
  );

export default DashboardHeader;
