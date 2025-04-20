
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

interface CallToActionProps {
  onGetStartedClick?: () => void;
}

const CallToAction = ({ onGetStartedClick }: CallToActionProps) => {
  const { userType, isAuthenticated } = useUser();
  const navigate = useNavigate();
  
  const handleButtonClick = () => {
    if (isAuthenticated) {
      const dashboard = userType === "participante" ? "/cliente" : "/anunciante";
      navigate(dashboard);
    } else {
      onGetStartedClick?.();
    }
  };

  return (
    <section className="py-16 relative overflow-hidden" id="cta">
      {/* Background glow */}
      <div className="absolute inset-0 bg-galaxy-purple/10 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="container mx-auto px-4 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6 neon-text-gradient">
          Comece Sua Jornada de <span className="text-neon-cyan">Gamificação</span> Hoje!
        </h2>
        
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          {userType === "participante" 
            ? "Junte-se à nossa comunidade e comece a ganhar prêmios com missões divertidas!"
            : "Transforme sua estratégia de marketing e engaje seu público de forma inovadora!"}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            className="btn-glow text-lg py-6 px-8"
            onClick={handleButtonClick}
          >
            {isAuthenticated 
              ? (userType === "participante" ? "Ir para Missões" : "Acessar Painel") 
              : "Começar Agora"}
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CallToAction;
