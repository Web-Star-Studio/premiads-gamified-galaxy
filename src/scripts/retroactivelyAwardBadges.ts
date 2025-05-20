
/**
 * This script can be run to retroactively process badge awards for approved
 * submissions that don't have badges yet.
 * 
 * NOTE: This should be run by an administrator or developer either:
 * 1. In browser console while authenticated as admin
 * 2. In a Node.js environment with Supabase API key
 */

import { supabase } from "@/integrations/supabase/client";

export async function retroactivelyAwardBadges() {
  try {
    // Call the database function that processes badges for all approved submissions
    // This will trigger a custom database function that we defined in the migration
    const { data, error } = await supabase.rpc('retroactively_award_badges');
    
    if (error) {
      console.error("Error retroactively awarding badges:", error);
      return { success: false, error: error.message };
    }

    // Refresh all badge data
    await supabase.auth.refreshSession();
    
    return { 
      success: true, 
      message: "Successfully processed retroactive badge awards" 
    };
  } catch (err: any) {
    console.error("Error in retroactivelyAwardBadges:", err);
    return { success: false, error: err.message };
  }
}

// Execute the function if called directly
if (typeof window !== 'undefined') {
  // Browser environment
  (window as any).retroactivelyAwardBadges = retroactivelyAwardBadges;
  console.log("retroactivelyAwardBadges function available in window scope.");
}
