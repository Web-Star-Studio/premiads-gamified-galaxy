
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
          description: "Ganhe tickets surpresa e abra caixas de recompensas cheias de prêmios inesperados!",
          icon: <Gift size={36} className="text-neon-pink" />,
        },
        {
          title: "Desafios Diários com Streaks",
          description: "Complete desafios diários e mantenha sequências para ganhar bônus crescentes.",
          icon: <Medal size={36} className="text-neon-lime" />,
        },
        {
          title: "Badges Raros & Loja de Itens",
          description: "Colecione emblemas exclusivos e troque seus tickets por itens na loja virtual.",
          icon: <Star size={36} className="text-neon-cyan" />,
        },
      ]
    : [
        {
          title: "Automação de Engajamento",
          description: "Configure campanhas automatizadas que mantêm seu público engajado e interagindo com sua marca.",
          icon: <Gauge size={36} className="text-neon-pink" />,
        },
        {
          title: "Relatórios em Tempo Real",
          description: "Acompanhe o desempenho das campanhas com relatórios detalhados e visualizações em tempo real.",
          icon: <BarChart size={36} className="text-neon-lime" />,
        },
        {
          title: "ROI Otimizado & Benchmarking",
          description: "Compare resultados entre campanhas e otimize seu investimento para máximo retorno.",
          icon: <DollarSign size={36} className="text-neon-cyan" />,
        },
      ];

  return (
    <section id="beneficios" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold inline-block neon-text-pink mb-4">
            Benefícios
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {userType === "participante"
              ? "Descubra todas as vantagens de participar das nossas missões gamificadas."
              : "Conheça as vantagens de criar campanhas gamificadas para sua marca."}
          </p>
        </div>

        <motion.div
          ref={ref}
          className="grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="glass-panel p-8 hover:shadow-[0_0_20px_rgba(155,135,245,0.2)] transition-all duration-300"
            >
              <div className="mb-6 w-16 h-16 rounded-full flex items-center justify-center glass-panel">
                {benefit.icon}
              </div>

              <h3 className="text-xl font-bold mb-3 font-orbitron">
                {benefit.title}
              </h3>

              <p className="text-gray-300">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            <a
              href={userType === "participante" ? "/cliente" : "/anunciante"}
              className="neon-button inline-block"
            >
              {userType === "participante" ? "Conquistar Benefícios" : "Potencializar Meu Negócio"}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
