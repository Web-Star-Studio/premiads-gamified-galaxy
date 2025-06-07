
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PerformanceMonitor } from '@/utils/performance-monitor';

/**
 * Componente para debugar e monitorar performance das otimizações RLS
 * Apenas para desenvolvimento
 */
export function PerformanceDebugger() {
  const [stats, setStats] = useState<Record<string, any>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const interval = setInterval(() => {
      setStats(PerformanceMonitor.getAllStats());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-white/90 backdrop-blur-sm"
        >
          📊 Performance
        </Button>
      </div>
    );
  }

  const getPerformanceBadge = (avg: number) => {
    if (avg < 50) return <Badge className="bg-green-500">Excelente</Badge>;
    if (avg < 100) return <Badge className="bg-yellow-500">Bom</Badge>;
    if (avg < 200) return <Badge className="bg-orange-500">Regular</Badge>;
    return <Badge className="bg-red-500">Lento</Badge>;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Performance Monitor</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  PerformanceMonitor.logPerformanceReport();
                }}
              >
                Log
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  PerformanceMonitor.clear();
                  setStats({});
                }}
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
              >
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 max-h-96 overflow-y-auto">
          {Object.keys(stats).length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma medição ainda...</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats).map(([label, stat]) => (
                <div key={label} className="border-b pb-2 last:border-b-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{label}</span>
                    {getPerformanceBadge(stat.average)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Média: {stat.average}ms</div>
                    <div>Mediana: {stat.median}ms</div>
                    <div>Min: {stat.min}ms</div>
                    <div>Max: {stat.max}ms</div>
                    <div className="col-span-2">Execuções: {stat.count}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
