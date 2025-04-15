
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Particles from "./Particles";

const Hero = () => {
  const { userType, userName } = useUser();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="min-h-screen pt-20 sm:pt-24 md:pt-28 pb-10 relative flex items-center">
      <Particles count={40} />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            {userType === "participante" ? (
              <>
                Bem-vindo, <span className="neon-text-cyan">{userName || "Visitante"}!</span>
                <br />Pronto para ganhar <span className="neon-text-lime">prêmios</span>?
              </>
            ) : (
              <>
                Olá, <span className="neon-text-cyan">{userName || "Empresa"}!</span>
                <br />Pronto para <span className="neon-text-lime">engajar</span> seu público?
              </>
            )}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto"
          >
            {userType === "participante" ? (
              "Complete missões, acumule pontos e concorra a prêmios incríveis em nossa plataforma gamificada."
            ) : (
              "Crie campanhas interativas que engajam e recompensam seus clientes de forma inovadora."
            )}
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button 
              className="neon-button text-base sm:text-lg py-2 sm:py-3 md:py-4" 
              onClick={() => {
                const section = document.getElementById("como-funciona");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {userType === "participante" ? "Descobrir Missões" : "Criar Campanha"}
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-transparent border-neon-pink text-white hover:bg-neon-pink/10 text-base sm:text-lg py-2 sm:py-3 md:py-4"
            >
              Fale com um Especialista
            </Button>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-8 sm:mt-10 md:mt-12 pt-8 sm:pt-10 md:pt-12 relative hidden sm:block"
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24">
              <svg viewBox="0 0 24 24" className="animate-bounce text-neon-cyan w-8 h-8 mx-auto">
                <path
                  fill="currentColor"
                  d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
