
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Search, CheckCircle, Award, BarChart3, Rocket, Trophy } from "lucide-react";

const HowItWorks = () => {
  const { userType } = useUser();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Dados específicos para cada tipo de usuário
  const steps = userType === "participante" 
    ? [
        {
          title: "Selecione Missões",
          description: "Escolha entre diversas missões patrocinadas por marcas incríveis.",
          icon: <Search className="w-12 h-12 text-neon-cyan" />,
          color: "cyan"
        },
        {
          title: "Complete & Ganhe",
          description: "Complete as tarefas e ganhe pontos, badges e recompensas exclusivas.",
          icon: <CheckCircle className="w-12 h-12 text-neon-pink" />,
          color: "pink"
        },
        {
          title: "Concorra em Sorteios",
          description: "Use seus pontos acumulados para participar de sorteios de prêmios incríveis.",
          icon: <Trophy className="w-12 h-12 text-neon-lime" />,
          color: "lime"
        }
      ]
    : [
        {
          title: "Crie Campanhas",
          description: "Estruture missões gamificadas que engajam seu público de forma divertida.",
          icon: <Rocket className="w-12 h-12 text-neon-cyan" />,
          color: "cyan"
        },
        {
          title: "Aprove & Lance",
          description: "Revise o conteúdo, defina recompensas e publique para sua audiência.",
          icon: <CheckCircle className="w-12 h-12 text-neon-pink" />,
          color: "pink"
        },
        {
          title: "Analise Resultados",
          description: "Acompanhe métricas de engajamento, conversão e ROI em tempo real.",
          icon: <BarChart3 className="w-12 h-12 text-neon-lime" />,
          color: "lime"
        }
      ];

  return (
    <section id="como-funciona" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold inline-block neon-text-cyan mb-4">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {userType === "participante" 
              ? "Em apenas três passos simples, você estará concorrendo a prêmios incríveis." 
              : "Três passos para criar campanhas gamificadas que impulsionam seu negócio."}
          </p>
        </div>

        <motion.div 
          ref={ref}
          className="grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.2 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="glass-panel p-8 relative overflow-hidden group"
            >
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-purple-glow opacity-30 rounded-full group-hover:scale-150 transition-transform duration-700" />
              
              <div className={`w-16 h-16 flex items-center justify-center rounded-xl mb-6 glass-panel neon-border border-neon-${step.color}`}>
                {step.icon}
              </div>
              
              <h3 className={`text-2xl font-bold mb-4 neon-text-${step.color}`}>
                {step.title}
              </h3>
              
              <p className="text-gray-300">
                {step.description}
              </p>
              
              <div className="absolute top-1/2 right-6 opacity-10 text-8xl font-orbitron">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
