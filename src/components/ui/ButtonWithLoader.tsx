
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import ButtonLoadingSpinner from './ButtonLoadingSpinner';
import { motion } from 'framer-motion';

interface ButtonWithLoaderProps extends ButtonProps {
  isLoading: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

const ButtonWithLoader: React.FC<ButtonWithLoaderProps> = ({
  children,
  isLoading,
  loadingText,
  icon,
  disabled,
  variant = 'default',
  size = 'default',
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={isLoading || disabled}
      {...props}
    >
      <motion.div 
        className="flex items-center justify-center gap-2"
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: isLoading ? 0.8 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {isLoading ? (
          <>
            <ButtonLoadingSpinner 
              color={variant === 'default' ? 'default' : 'white'} 
              size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'} 
            />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {icon && <span className="mr-1">{icon}</span>}
            {children}
          </>
        )}
      </motion.div>
    </Button>
  );
};

export default ButtonWithLoader;
