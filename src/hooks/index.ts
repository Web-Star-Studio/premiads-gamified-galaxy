
// Authentication hooks
export { useAuth } from './useAuth';
export { useAuthMethods } from './useAuthMethods';
export { useAuthRedirection } from './useAuthRedirection';
export { useAuthSession } from './useAuthSession';

// UI hooks
export { useIsMobile, useMediaQuery } from './use-mobile';
export { useSounds } from './use-sounds';
export { useToast } from './use-toast';

// Feature hooks
export { useClientDashboard } from './useClientDashboard';
export { useMissions } from './useMissions';
export { 
  missionTypeLabels,
  missionTypeDescriptions,
  getMissionTypeDescription, 
  getMissionIcon,
  filterMissionsByType,
  getMissionDifficulty,
  getEstimatedTime,
  useMissionTypes
} from './useMissionsTypes';
// Re-export types with the correct syntax for isolatedModules
export type { MissionType } from './useMissionsTypes';
export { useReferrals } from './useReferrals';
export { useCashbackMarketplace } from './cashback';

// Mission-specific hooks
export * from './missions/useMissionFilters';
export * from './missions/useMissionSubmit';
export * from './missions/useMissionsFetch';
export * from './missions/types';

// Admin hooks
export * from './admin';
