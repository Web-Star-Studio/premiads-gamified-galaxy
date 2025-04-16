
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonLoadingSpinnerProps {
  className?: string;
  color?: 'default' | 'white' | 'cyan' | 'pink';
  size?: 'sm' | 'md' | 'lg';
}

const ButtonLoadingSpinner: React.FC<ButtonLoadingSpinnerProps> = ({ 
  className, 
  color = 'default',
  size = 'md'
}) => {
  const colorVariants = {
    default: 'border-t-white/20 border-primary/80',
    white: 'border-t-white/20 border-white',
    cyan: 'border-t-white/20 border-neon-cyan',
    pink: 'border-t-white/20 border-neon-pink'
  };
  
  const sizeVariants = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };
  
  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        'absolute top-0 left-0 right-0 bottom-0 animate-spin',
        sizeVariants[size]
      )}>
        <div className={cn(
          'w-full h-full rounded-full border-2',
          colorVariants[color]
        )} />
      </div>
      <div className={cn(
        'absolute top-0 left-0 right-0 bottom-0 animate-pulse delay-150',
        sizeVariants[size]
      )}>
        <div className={cn(
          'w-full h-full rounded-full border-2 border-transparent border-t-primary/40',
          colorVariants[color]
        )} style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  );
};

export default ButtonLoadingSpinner;
