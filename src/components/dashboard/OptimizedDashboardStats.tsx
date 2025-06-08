
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useOptimizedStats } from '@/hooks/core/useOptimizedStats';
import { Trophy, Coins, Target, TrendingUp } from 'lucide-react';

export const OptimizedDashboardStats = React.memo(() => {
  const { data: stats, isLoading } = useOptimizedStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Rifas',
      value: stats.rifas || 0,
      icon: Coins,
      color: 'text-yellow-400'
    },
    {
      title: 'Cashback',
      value: `R$ ${(stats.cashback_balance || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      title: 'Missões Completas',
      value: stats.missions_completed || 0,
      icon: Target,
      color: 'text-blue-400'
    },
    {
      title: 'Total Ganho',
      value: stats.total_earned_rifas || 0,
      icon: Trophy,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="glass-panel border-galaxy-purple/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});

OptimizedDashboardStats.displayName = 'OptimizedDashboardStats';
