
import { memo } from "react";
import { motion } from "framer-motion";

const LoadingSpinner = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark bg-opacity-80">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div 
          className="w-12 h-12 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin"
          aria-label="Loading"
        />
      </motion.div>
    </div>
  );

export default memo(LoadingSpinner);
