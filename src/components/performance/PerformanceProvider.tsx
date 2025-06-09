
import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { PerformanceMonitor } from '@/utils/performance-monitor';

interface PerformanceContextType {
  measureOperation: <T>(label: string, operation: () => Promise<T>) => Promise<T>;
  startMeasurement: (label: string) => () => void;
  getStats: (label: string) => any;
  logReport: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  const measureOperation = useCallback(async <T,>(
    label: string, 
    operation: () => Promise<T>
  ): Promise<T> => {
    return PerformanceMonitor.measureAsync(label, operation);
  }, []);

  const startMeasurement = useCallback((label: string) => {
    return PerformanceMonitor.startMeasurement(label);
  }, []);

  const getStats = useCallback((label: string) => {
    return PerformanceMonitor.getStats(label);
  }, []);

  const logReport = useCallback(() => {
    PerformanceMonitor.logPerformanceReport();
  }, []);

  const contextValue = useMemo(() => ({
    measureOperation,
    startMeasurement,
    getStats,
    logReport
  }), [measureOperation, startMeasurement, getStats, logReport]);

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};
