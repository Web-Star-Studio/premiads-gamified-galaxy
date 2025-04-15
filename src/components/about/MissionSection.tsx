
import { motion } from "framer-motion";

const MissionSection = () => {
  return (
    <section className="py-16 bg-galaxy-deepPurple/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Nossa Missão
          </h2>
          <div className="glass-panel p-8 rounded-lg">
            <p className="text-gray-300 text-lg leading-relaxed">
              A PremiAds nasceu com a missão de revolucionar o marketing digital, criando uma plataforma onde anunciantes, parceiros e consumidores podem interagir de forma gamificada e mutuamente benéfica.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;
