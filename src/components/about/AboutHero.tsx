
import { motion } from "framer-motion";
import { fadeInVariants } from "@/utils/animation";

const AboutHero = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-galaxy-gradient z-0"></div>
      <div className="absolute inset-0 bg-purple-glow opacity-30 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Sobre a <span className="text-white">Premi</span>
            <span className="text-neon-cyan">Ads</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Transformando a publicidade em uma experiência gamificada e recompensadora.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
