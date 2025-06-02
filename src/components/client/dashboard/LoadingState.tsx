
import React from 'react';
import { motion } from "framer-motion";

const LoadingState = () => (
    <div className="min-h-screen bg-galaxy-dark flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="w-12 h-12 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin"></div>
      </motion.div>
    </div>
  );

export default LoadingState;
