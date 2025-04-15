
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface ClientDashboardHeaderProps {
  title: string;
  description?: string;
  userName: string;
  showBackButton?: boolean;
  backTo?: string;
}

const ClientDashboardHeader = ({
  title,
  description,
  userName,
  showBackButton = false,
  backTo = "/"
}: ClientDashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="absolute top-0 left-0 w-full h-40 bg-purple-glow opacity-10 blur-3xl -z-10"></div>
      
      <div className="flex items-center justify-between">
        <div>
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(backTo)}
              className="mb-4 text-neon-cyan hover:text-neon-cyan/80 hover:bg-galaxy-deepPurple/30 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar
            </Button>
          )}
          <h1 className="text-2xl md:text-3xl font-heading neon-text-cyan">{title}</h1>
          {description && (
            <p className="mt-2 text-gray-400 max-w-2xl">{description}</p>
          )}
        </div>
        
        <div className="text-right hidden md:block">
          <div className="text-sm text-gray-400">Bem-vindo(a),</div>
          <div className="text-xl font-heading">{userName || "Visitante"}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientDashboardHeader;
