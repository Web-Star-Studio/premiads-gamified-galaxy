
import React from 'react';
import { motion } from 'framer-motion';
import { OptimizedDashboardStats } from '@/components/dashboard/OptimizedDashboardStats';
import { OptimizedMissionsCarousel } from '@/components/dashboard/OptimizedMissionsCarousel';
import { RecentRewardsSection } from '@/components/client/dashboard/RecentRewardsSection';
import { useOptimizedUserData } from '@/hooks/core/useOptimizedUserData';
import { useRealtimeOptimized } from '@/hooks/core/useRealtimeOptimized';
import { Skeleton } from '@/components/ui/skeleton';

export const OptimizedDashboard = React.memo(() => {
  const { data: userData, isLoading } = useOptimizedUserData();
  
  // Habilitar realtime otimizado apenas para este dashboard
  useRealtimeOptimized();

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const profile = userData?.profile;
  const totalBadges = userData?.total_badges || 0;
  const completedMissions = userData?.completed_missions_count || 0;

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-2xl font-bold text-white">
          Olá, {profile?.full_name || 'Participante'}! 👋
        </h1>
        <p className="text-gray-400">
          Você tem {totalBadges} badges e completou{' '}
          {completedMissions} missões
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <OptimizedDashboardStats />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <OptimizedMissionsCarousel />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <RecentRewardsSection />
      </motion.div>
    </div>
  );
});

OptimizedDashboard.displayName = 'OptimizedDashboard';
