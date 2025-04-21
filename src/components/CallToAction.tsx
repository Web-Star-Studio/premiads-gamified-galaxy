
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Particles from "./Particles";

const CallToAction = () => {
  const { userType } = useUser();

  const openWhatsApp = () => {
    const phoneNumber = "5581985595912";
    const message = encodeURIComponent("Olá, gostaria de saber mais sobre o PremiAds!");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <section id="cta" className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <Particles count={30} />
      
      <div className="absolute inset-0 bg-purple-glow opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="glass-panel p-6 sm:p-8 md:p-12 max-w-5xl mx-auto rounded-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-neon-cyan opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-neon-pink opacity-10 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-6 sm:mb-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
              >
                {userType === "participante" ? (
                  <>Pronto para <span className="neon-text-cyan">ganhar prêmios</span> enquanto se diverte?</>
                ) : (
                  <>Pronto para <span className="neon-text-cyan">revolucionar</span> seu engajamento?</>
                )}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
              >
                {userType === "participante" ? (
                  "Junte-se agora à PremiAds e comece sua jornada de missões e recompensas!"
                ) : (
                  "Crie sua primeira campanha hoje e veja os resultados transformarem seu negócio!"
                )}
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                className="neon-button text-base sm:text-lg py-2 sm:py-3 md:py-4"
                onClick={() => {
                  window.location.href = userType === "participante" 
                    ? "/cliente" 
                    : "/anunciante";
                }}
              >
                {userType === "participante" ? "Ver Missões Agora" : "Criar Campanha"}
              </Button>
              
              <Button
                variant="outline"
                className="bg-transparent border-white/20 hover:bg-white/5 text-base sm:text-lg py-2 sm:py-3 md:py-4"
                onClick={openWhatsApp}
              >
                Fale com um Especialista
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

