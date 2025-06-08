
import React from 'react';
import { usePerformanceOptimized } from '@/hooks/core/usePerformanceOptimized';

interface OptimizedPerformanceProviderProps {
  children: React.ReactNode;
}

export const OptimizedPerformanceProvider: React.FC<OptimizedPerformanceProviderProps> = ({ 
  children 
}) => {
  // Inicializar otimizações globais
  usePerformanceOptimized();

  return <>{children}</>;
};
