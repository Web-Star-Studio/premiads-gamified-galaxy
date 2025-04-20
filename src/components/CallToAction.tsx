
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  const { userType } = useUser();

  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-galaxy-dark to-galaxy-deepPurple z-0"></div>
      <div className="absolute inset-0 opacity-20 z-0">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-galaxy-purple/30 filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-neon-cyan/30 filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {userType === "participante" ? (
                <>Pronto para <span className="text-neon-cyan">ganhar prêmios</span>?</>
              ) : (
                <>Transforme seu <span className="text-neon-cyan">engajamento</span> hoje</>
              )}
            </h2>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {userType === "participante" ? (
                "Comece sua jornada de missões e recompensas agora mesmo e desbloqueie prêmios incríveis!"
              ) : (
                "Crie sua primeira campanha hoje e veja os resultados transformarem seu negócio!"
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-neon-cyan hover:bg-neon-cyan/90 text-galaxy-dark font-medium text-base"
                onClick={() => {
                  window.location.href = userType === "participante" 
                    ? "/cliente" 
                    : "/anunciante";
                }}
              >
                {userType === "participante" ? "Começar Agora" : "Criar Campanha"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 hover:bg-white/5 text-base"
              >
                Fale Conosco
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
