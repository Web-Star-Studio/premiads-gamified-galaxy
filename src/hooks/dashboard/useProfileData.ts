import { supabase } from "@/integrations/supabase/client";
import { useQuery, QueryKey } from "@tanstack/react-query";
import { UserProfile } from "@/types/auth"; // Assuming UserProfile type exists from your project structure
// import { Session } from "@supabase/supabase-js"; // Not directly used in function signatures now

// Function to get the current session and user ID
async function getCurrentUserId(): Promise<string | null> {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.error("Error getting session:", sessionError);
    return null;
  }
  if (!session) {
    return null;
  }
  return session.user.id;
}

// Function to fetch profile data
async function fetchProfileDataByUserId(userId: string): Promise<UserProfile | null> {
  // No need to check !userId here, as useQuery's 'enabled' option handles it
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, user_type, active, avatar_url, points, credits, profile_completed")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile data for user:", userId, error);
    throw new Error(`Failed to fetch profile for user ${userId}: ${error.message}`);
  }
  return data as UserProfile;
}

// Define QueryKey types for better type safety
type CurrentUserIdKey = readonly ['currentUserId'];
type ProfileQueryKey = readonly ['profile', string | undefined];

/**
 * Hook to fetch the current authenticated user's profile data using React Query.
 */
export function useProfileData() {
  const { data: userId, isLoading: isLoadingUserId } = useQuery<string | null, Error, string | null, CurrentUserIdKey>({
    queryKey: ['currentUserId'], 
    queryFn: getCurrentUserId,
    staleTime: Infinity, 
    gcTime: Infinity,
  });

  return useQuery<UserProfile | null, Error, UserProfile | null, ProfileQueryKey>({
    queryKey: ['profile', userId], 
    queryFn: () => {
      if (!userId) return Promise.resolve(null); 
      return fetchProfileDataByUserId(userId!);
    },
    enabled: !!userId && !isLoadingUserId, 
    staleTime: 1000 * 60 * 1, // 1 minute stale time
  });
}
