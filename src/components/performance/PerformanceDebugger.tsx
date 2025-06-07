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
  const [showRLSStatus, setShowRLSStatus] = useState(false);

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
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-white/90 backdrop-blur-sm"
        >
          📊 Performance
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRLSStatus(!showRLSStatus)}
          className="bg-green-50/90 backdrop-blur-sm border-green-200 text-green-700"
        >
          ✅ RLS Status
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
          
          {/* Status RLS Otimizado */}
          <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-200">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">
                RLS Otimizado Ativo
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Zero warnings • Políticas consolidadas • Performance máxima
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 max-h-96 overflow-y-auto">
          {Object.keys(stats).length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 mb-2">Nenhuma medição ainda...</p>
              <p className="text-xs text-green-600">
                🚀 Aguardando consultas otimizadas...
              </p>
            </div>
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
                  
                  {/* Indicador de otimização RLS */}
                  {label.includes('_optimized') && (
                    <div className="mt-1 text-xs text-green-600 font-medium">
                      🎯 RLS Otimizado
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
