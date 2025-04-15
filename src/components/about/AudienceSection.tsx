
import { motion } from "framer-motion";

const AudienceSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-panel p-8 rounded-lg"
          >
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-neon-cyan">
              Para Anunciantes
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Oferecemos uma forma inovadora de engajar consumidores através de missões interativas, gerando leads qualificados e fornecendo métricas detalhadas sobre suas campanhas.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-panel p-8 rounded-lg"
          >
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-neon-pink">
              Para Consumidores
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Criamos um ambiente divertido onde os usuários podem completar missões, ganhar pontos e concorrer a prêmios enquanto interagem com marcas de seu interesse.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
