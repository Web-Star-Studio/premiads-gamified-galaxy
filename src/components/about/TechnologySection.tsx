
import { motion } from "framer-motion";

const TechnologySection = () => {
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
            Nossa Tecnologia
          </h2>
          <div className="glass-panel p-8 rounded-lg">
            <p className="text-gray-300 text-lg leading-relaxed">
              Utilizamos tecnologia de ponta para criar uma plataforma segura, intuitiva e eficiente, garantindo a melhor experiência para todos os nossos usuários.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnologySection;
