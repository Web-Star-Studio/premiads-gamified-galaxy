
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Search, CheckCircle, Award, BarChart3, Rocket, Trophy } from "lucide-react";

const HowItWorks = () => {
  const { userType } = useUser();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3
  });

  // Dados específicos para cada tipo de usuário
  const steps = userType === "participante" ? [
    {
      title: "Selecione Missões",
      description: "Escolha entre diversas missões patrocinadas por marcas incríveis.",
      icon: <Search className="w-10 h-10 text-neon-cyan" />,
      color: "cyan"
    }, 
    {
      title: "Complete & Ganhe",
      description: "Complete as tarefas e ganhe pontos, badges e recompensas exclusivas.",
      icon: <CheckCircle className="w-10 h-10 text-neon-pink" />,
      color: "pink"
    }, 
    {
      title: "Concorra em Sorteios",
      description: "Use seus pontos acumulados para participar de sorteios de prêmios incríveis.",
      icon: <Trophy className="w-10 h-10 text-neon-lime" />,
      color: "lime"
    }
  ] : [
    {
      title: "Crie Campanhas",
      description: "Estruture missões gamificadas que engajam seu público de forma divertida.",
      icon: <Rocket className="w-10 h-10 text-neon-cyan" />,
      color: "cyan"
    }, 
    {
      title: "Aprove & Lance",
      description: "Revise o conteúdo, defina recompensas e publique para sua audiência.",
      icon: <CheckCircle className="w-10 h-10 text-neon-pink" />,
      color: "pink"
    }, 
    {
      title: "Analise Resultados",
      description: "Acompanhe métricas de engajamento, conversão e ROI em tempo real.",
      icon: <BarChart3 className="w-10 h-10 text-neon-lime" />,
      color: "lime"
    }
  ];

  return (
    <section id="como-funciona" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full border border-galaxy-purple/50 bg-galaxy-deepPurple/50"
          >
            Processo Simples
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Como Funciona
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            {userType === "participante" 
              ? "Em apenas três passos simples, você estará concorrendo a prêmios incríveis." 
              : "Três passos para criar campanhas gamificadas que impulsionam seu negócio."
            }
          </motion.p>
        </div>

        <motion.div 
          ref={ref} 
          className="grid md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 relative overflow-hidden transition-all duration-300 hover:translate-y-[-8px]"
            >
              <div className={`w-14 h-14 flex items-center justify-center rounded-full bg-${step.color}/10 mb-6`}>
                {step.icon}
              </div>
              
              <h3 className={`text-xl font-bold mb-3 text-${step.color}`}>
                {step.title}
              </h3>
              
              <p className="text-gray-300">
                {step.description}
              </p>
              
              <div className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full opacity-10 bg-gradient-to-tr from-white/5 to-white/20"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
