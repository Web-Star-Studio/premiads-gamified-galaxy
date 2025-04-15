
import { MotionProps } from "framer-motion";

// Common animation variants for reuse
export const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: { 
      duration: 0.2,
      ease: "easeIn"  
    }
  }
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { 
      duration: 0.2,
      ease: "easeIn"  
    }
  }
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Common motion props for components
export const fadeInMotionProps: MotionProps = {
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  variants: fadeInVariants
};

export const scaleInMotionProps: MotionProps = {
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  variants: scaleInVariants
};

export const containerMotionProps: MotionProps = {
  initial: "hidden",
  animate: "visible",
  variants: containerVariants
};
