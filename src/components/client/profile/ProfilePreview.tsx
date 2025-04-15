
import { User, Settings, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";

const ProfilePreview = () => {
  const { userName } = useUser();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel p-6 mt-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">Seu Perfil</h2>
        <User className="w-5 h-5 text-neon-pink" />
      </div>
      
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-16 rounded-full bg-galaxy-deepPurple flex items-center justify-center border border-neon-cyan/30">
          <span className="text-2xl font-heading text-neon-cyan">{userName.charAt(0).toUpperCase()}</span>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">{userName}</h3>
          <p className="text-sm text-gray-400">Participante desde Abril 2025</p>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full justify-between mt-2 border-galaxy-purple/30 hover:bg-galaxy-deepPurple/50"
        onClick={() => navigate("/cliente/perfil")}
      >
        <div className="flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          <span>Gerenciar Perfil</span>
        </div>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default ProfilePreview;
