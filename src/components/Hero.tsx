
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const { userType, userName } = useUser();

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-galaxy-dark to-galaxy-deepPurple z-0"></div>
      <div className="absolute inset-0 opacity-20 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-galaxy-purple/20 filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-neon-cyan/20 filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full border border-galaxy-purple/50 bg-galaxy-deepPurple/50"
            >
              {userType === "participante" ? "Recompensas Exclusivas" : "Soluções para Empresas"}
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              {userType === "participante" ? (
                <>Ganhe <span className="text-neon-cyan">prêmios</span> de forma <span className="text-neon-pink">divertida</span></>
              ) : (
                <>Engaje seu <span className="text-neon-cyan">público</span> com <span className="text-neon-pink">gamificação</span></>
              )}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl"
            >
              {userType === "participante" ? (
                "Participe de desafios divertidos, acumule pontos e troque por prêmios exclusivos das suas marcas favoritas."
              ) : (
                "Aumente o engajamento e a retenção de clientes com campanhas gamificadas que geram resultados mensuráveis."
              )}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button 
                size="lg" 
                className="bg-neon-cyan hover:bg-neon-cyan/90 text-galaxy-dark font-medium text-base"
                onClick={() => {
                  window.location.href = userType === "participante" ? "/cliente" : "/anunciante";
                }}
              >
                {userType === "participante" ? "Começar Agora" : "Criar Campanha"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 hover:bg-white/5 text-base"
                onClick={() => {
                  const section = document.getElementById("como-funciona");
                  section?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Saiba Mais
              </Button>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 mt-10 md:mt-0"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 rounded-2xl blur-lg opacity-70"></div>
              <div className="glass-panel rounded-2xl overflow-hidden p-2 relative">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="PremiAds Platform" 
                  className="w-full h-auto rounded-xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-neon-cyan/20 rounded-full blur-xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
