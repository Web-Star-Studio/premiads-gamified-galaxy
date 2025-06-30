
import React from 'react';
import { lazyImport, withSuspense } from '@/utils/performance';

// Lazy load heavy dashboard components
export const LazyMissionsCarousel = lazyImport(() => 
  import('@/components/dashboard/MissionsCarousel')
);

export const LazyActiveMissions = lazyImport(() => 
  import('@/components/dashboard/ActiveMissions')
);

export const LazyEngagementCharts = lazyImport(() => 
  import('@/components/advertiser/EngagementCharts')
);

export const LazyCashbackMarketplace = lazyImport(() => 
  import('@/pages/CashbackMarketplace')
);

export const LazyAdvertiserDashboard = lazyImport(() => 
  import('@/pages/AdvertiserDashboard')
);

// Lazy load modal/dialog components
export const LazyMissionDialog = lazyImport(() => 
  import('@/components/client/missions/MissionDialog')
);

export const LazyCashbackForm = lazyImport(() => 
  import('@/features/anunciante-cashbacks/CashbackForm')
);

// Wrapped components with Suspense
export const SuspenseMissionsCarousel = withSuspense(
  LazyMissionsCarousel,
  <div className="animate-pulse bg-galaxy-deepPurple/20 h-48 rounded-lg" />
);

export const SuspenseActiveMissions = withSuspense(
  LazyActiveMissions,
  <div className="animate-pulse bg-galaxy-deepPurple/20 h-64 rounded-lg" />
);

export const SuspenseEngagementCharts = withSuspense(
  LazyEngagementCharts,
  <div className="animate-pulse bg-galaxy-deepPurple/20 h-80 rounded-lg" />
);

export const SuspenseMissionDialog = withSuspense(
  LazyMissionDialog,
  <div className="animate-pulse bg-galaxy-deepPurple/20 h-96 rounded-lg" />
);
