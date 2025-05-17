
import { Mission } from '@/hooks/useMissionsTypes';

// Campaign is now an alias for the Mission type from the backend
export type Campaign = Mission;

// No mock data; missions are fetched in real-time
export const mockCampaigns: Campaign[] = [];
