
import { motion } from "framer-motion";

const LoadingState = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
        <h2 className="text-xl font-heading neon-text-pink">Carregando painel de gestão...</h2>
      </motion.div>
    </div>
  );
};

export default LoadingState;
