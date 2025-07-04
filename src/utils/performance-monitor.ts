// Performance monitoring utilities
class PerformanceMonitor {
  private static measurements: Map<string, number[]> = new Map();
  private static pendingMeasurements: Map<string, number> = new Map();

  static startMeasurement(label: string): () => void {
    const startTime = performance.now();
    this.pendingMeasurements.set(label, startTime);
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.recordMeasurement(label, duration);
      this.pendingMeasurements.delete(label);
    };
  }

  static async measureAsync<T>(
    label: string, 
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await operation();
      const endTime = performance.now();
      this.recordMeasurement(label, endTime - startTime);
      return result;
    } catch (error) {
      const endTime = performance.now();
      this.recordMeasurement(`${label}_error`, endTime - startTime);
      throw error;
    }
  }

  static recordMeasurement(label: string, duration: number): void {
    if (!this.measurements.has(label)) {
      this.measurements.set(label, []);
    }
    
    const measurements = this.measurements.get(label)!;
    measurements.push(duration);
    
    // Keep only last 100 measurements
    if (measurements.length > 100) {
      measurements.shift();
    }
    
    console.log(`⚡ ${label}: ${duration.toFixed(2)}ms`);
  }

  static getStats(label: string) {
    const measurements = this.measurements.get(label) || [];
    if (measurements.length === 0) return null;

    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);
    
    return { avg, min, max, count: measurements.length };
  }

  static getAllStats() {
    const result: Record<string, any> = {};
    
    for (const [label, measurements] of this.measurements.entries()) {
      if (measurements.length === 0) continue;
      
      const sorted = [...measurements].sort((a, b) => a - b);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const sum = sorted.reduce((a, b) => a + b, 0);
      const average = sum / sorted.length;
      const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
        
      result[label] = {
        min,
        max,
        average,
        median,
        count: measurements.length
      };
    }
    
    return result;
  }

  static logPerformanceReport(): void {
    console.group('⚡ Performance Report');
    
    for (const [label, measurements] of this.measurements.entries()) {
      const stats = this.getStats(label);
      if (stats) {
        console.log(`${label}:`, {
          average: `${stats.avg.toFixed(2)}ms`,
          min: `${stats.min.toFixed(2)}ms`,
          max: `${stats.max.toFixed(2)}ms`,
          samples: stats.count
        });
      }
    }
    
    console.groupEnd();
  }

  static clear(): void {
    this.clearMeasurements();
  }

  static clearMeasurements(): void {
    this.measurements.clear();
    this.pendingMeasurements.clear();
  }
}

// Higher-order function to wrap async operations with performance monitoring
export function withPerformanceMonitoring<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  label: string
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return PerformanceMonitor.measureAsync(label, () => fn(...args)) as ReturnType<T>;
  };
}

export { PerformanceMonitor };
