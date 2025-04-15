
import { motion } from "framer-motion";
import { Bell, Home, User, PieChart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  return (
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
            Olá, <span className="neon-text-pink">{userName}</span>!
          </h1>
          <p className="text-sm text-gray-400">
            Painel de Gestão de Campanhas | <span className="text-neon-cyan">350 créditos</span>
          </p>
        </motion.div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-neon-pink rounded-full"></span>
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <PieChart className="w-5 h-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
