
/**
 * Monitor de performance para medir o impacto das otimizações RLS
 */
export class PerformanceMonitor {
  private static measurements: Map<string, number[]> = new Map();

  static startMeasurement(label: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.measurements.has(label)) {
        this.measurements.set(label, []);
      }
      
      this.measurements.get(label)!.push(duration);
      
      console.log(`⚡ Performance: ${label} took ${duration.toFixed(2)}ms`);
    };
  }

  static async measureAsync<T>(label: string, operation: () => Promise<T>): Promise<T> {
    const stopMeasurement = this.startMeasurement(label);
    
    try {
      const result = await operation();
      stopMeasurement();
      return result;
    } catch (error) {
      stopMeasurement();
      throw error;
    }
  }

  static getStats(label: string) {
    const measurements = this.measurements.get(label);
    if (!measurements || measurements.length === 0) {
      return null;
    }

    const sorted = [...measurements].sort((a, b) => a - b);
    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);

    return {
      count: measurements.length,
      average: Number(avg.toFixed(2)),
      median: Number(median.toFixed(2)),
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2))
    };
  }

  static getAllStats() {
    const stats: Record<string, any> = {};
    
    for (const [label] of this.measurements) {
      stats[label] = this.getStats(label);
    }
    
    return stats;
  }

  static logPerformanceReport() {
    console.group('📊 Performance Report');
    
    const allStats = this.getAllStats();
    
    Object.entries(allStats).forEach(([label, stats]) => {
      if (stats) {
        console.log(`${label}:`, stats);
      }
    });
    
    console.groupEnd();
  }

  static clear() {
    this.measurements.clear();
  }
}

// Wrapper para monitorar queries do Supabase
export function withPerformanceMonitoring<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  label: string
): T {
  return (async (...args: any[]) => {
    return PerformanceMonitor.measureAsync(label, () => fn(...args));
  }) as T;
}
