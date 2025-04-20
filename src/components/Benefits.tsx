
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Gift, Medal, Star, Gauge, BarChart, DollarSign } from "lucide-react";

const Benefits = () => {
  const { userType } = useUser();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const benefits = userType === "participante"
    ? [
        {
          title: "Pontos Aleatórios & Loot Boxes",
          description: "Ganhe pontos surpresa e abra caixas de recompensas cheias de prêmios inesperados!",
          icon: <Gift size={30} className="text-neon-pink" />,
        },
        {
          title: "Desafios Diários com Streaks",
          description: "Complete desafios diários e mantenha sequências para ganhar bônus crescentes.",
          icon: <Medal size={30} className="text-neon-lime" />,
        },
        {
          title: "Badges Raros & Loja de Itens",
          description: "Colecione emblemas exclusivos e troque seus pontos por itens na loja virtual.",
          icon: <Star size={30} className="text-neon-cyan" />,
        },
      ]
    : [
        {
          title: "Automação de Engajamento",
          description: "Configure campanhas automatizadas que mantêm seu público engajado e interagindo com sua marca.",
          icon: <Gauge size={30} className="text-neon-pink" />,
        },
        {
          title: "Relatórios em Tempo Real",
          description: "Acompanhe o desempenho das campanhas com relatórios detalhados e visualizações em tempo real.",
          icon: <BarChart size={30} className="text-neon-lime" />,
        },
        {
          title: "ROI Otimizado & Benchmarking",
          description: "Compare resultados entre campanhas e otimize seu investimento para máximo retorno.",
          icon: <DollarSign size={30} className="text-neon-cyan" />,
        },
      ];

  return (
    <section id="beneficios" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full border border-galaxy-purple/50 bg-galaxy-deepPurple/50"
          >
            Por que escolher
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Benefícios Exclusivos
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            {userType === "participante"
              ? "Descubra todas as vantagens de participar das nossas missões gamificadas."
              : "Conheça as vantagens de criar campanhas gamificadas para sua marca."}
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          className="grid md:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 relative overflow-hidden transition-all duration-300 hover:translate-y-[-8px]"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 mb-6">
                {benefit.icon}
              </div>

              <h3 className="text-xl font-bold mb-3">
                {benefit.title}
              </h3>

              <p className="text-gray-300">
                {benefit.description}
              </p>
              
              <div className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full opacity-10 bg-gradient-to-tr from-white/5 to-white/20"></div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <a
            href={userType === "participante" ? "/cliente" : "/anunciante"}
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-neon-cyan text-galaxy-dark font-medium hover:bg-neon-cyan/90 transition-colors"
          >
            {userType === "participante" ? "Conquistar Benefícios" : "Potencializar Meu Negócio"}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
