
import { memo } from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullscreen?: boolean;
  message?: string;
}

const LoadingSpinner = ({ 
  size = 'md', 
  fullscreen = true,
  message = "Carregando..." 
}: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  const containerClass = fullscreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark bg-opacity-80"
    : "flex items-center justify-center";
  
  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="relative">
          <motion.div
            className={`${sizes[size]} border-4 border-t-neon-cyan border-galaxy-purple rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className={`absolute inset-0 border-4 border-transparent border-t-neon-pink rounded-full`}
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ margin: '25%' }}
          />
        </div>
        
        {message && (
          <motion.p
            className="mt-4 text-sm font-medium text-gray-300"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default memo(LoadingSpinner);
