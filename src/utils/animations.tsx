
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Common animation variants
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2 } }
};

export const slideInRightVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
};

export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: { opacity: 0 }
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
};

// Animation wrappers
interface MotionWrapperProps {
  children: React.ReactNode;
  variant?: 'fade' | 'slideUp' | 'slideRight' | 'scale' | 'stagger';
  delay?: number;
  className?: string;
}

export const MotionWrapper: React.FC<MotionWrapperProps> = ({ 
  children, 
  variant = 'fade',
  delay = 0,
  className 
}) => {
  const variants = {
    fade: fadeInVariants,
    slideUp: slideUpVariants,
    slideRight: slideInRightVariants,
    scale: scaleVariants,
    stagger: staggerContainerVariants
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants[variant]}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Page transition component
interface PageTransitionProps {
  children: React.ReactNode;
  location: string; // Use current route as key for AnimatePresence
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, location }) => (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeInVariants}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );

// Stagger item component
interface StaggerItemProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({ children, index = 0, className }) => (
    <motion.div
      variants={staggerItemVariants}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
