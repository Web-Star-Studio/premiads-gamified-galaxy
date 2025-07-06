import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Ajuste para seu domínio de produção
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Profile {
  id: string;
  user_type: string; // 'anunciante', 'admin', 'participante'
}

async function getUserProfile(supabase: SupabaseClient, userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, user_type")
      .eq("id", userId)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    return data as Profile;
  } catch (error) {
    console.error("Exception fetching user profile:", error);
    return null;
  }
}

// Helper function to check if user can perform advertiser actions
function canPerformAdvertiserActions(userType: string): boolean {
  return userType === 'anunciante' || userType === 'admin';
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("moderate-mission-submission: Function invoked.");
    console.log("moderate-mission-submission: SUPABASE_URL available:", !!SUPABASE_URL);
    console.log("moderate-mission-submission: SUPABASE_SERVICE_ROLE_KEY available:", !!SUPABASE_SERVICE_ROLE_KEY);

    const supabaseAdminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });
    console.log("moderate-mission-submission: Supabase admin client initialized.");

    const userAuthHeader = req.headers.get("Authorization");
    if (!userAuthHeader) {
      console.error("No authorization header provided");
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const jwt = userAuthHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdminClient.auth.getUser(jwt);

    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Authentication failed", details: userError?.message }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;
    console.log(`moderate-mission-submission: Authenticated user ID: ${userId}`);

    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("moderate-mission-submission: Request body:", JSON.stringify(requestBody));
    const { submission_id, action } = requestBody;
    
    if (!submission_id || !action) {
      console.error("Missing required fields:", { submission_id, action });
      return new Response(JSON.stringify({ error: "Missing submission_id or action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userProfile = await getUserProfile(supabaseAdminClient, userId);
    if (!userProfile) {
      console.error(`moderate-mission-submission: User profile not found for user ID: ${userId}`);
      return new Response(JSON.stringify({ error: "User profile not found" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.log(`moderate-mission-submission: User profile fetched: ${JSON.stringify(userProfile)}`);

    let rpcName = "";
    const rpcParams: { [key: string]: string } = { p_submission_id: submission_id };

    switch (action) {
      case "ADVERTISER_APPROVE_FIRST_INSTANCE":
        if (!canPerformAdvertiserActions(userProfile.user_type?.trim())) {
          console.error(`Permission check failed for action '${action}': Expected 'anunciante' or 'admin', got '[${userProfile.user_type?.trim()}]' for user ID ${userId}`);
          return new Response(JSON.stringify({ error: "Permission denied: User is not an 'anunciante' or 'admin' for this action." }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        rpcName = "approve_submission_first_instance";
        rpcParams.p_advertiser_id = userId;
        break;
      case "ADVERTISER_REJECT_TO_SECOND_INSTANCE":
        if (!canPerformAdvertiserActions(userProfile.user_type?.trim())) {
          console.error(`Permission check failed for action '${action}': Expected 'anunciante' or 'admin', got '[${userProfile.user_type?.trim()}]' for user ID ${userId}`);
          return new Response(JSON.stringify({ error: "Permission denied: User is not an 'anunciante' or 'admin' for this action." }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        rpcName = "reject_submission_to_second_instance";
        rpcParams.p_advertiser_id = userId;
        break;
      case "ADMIN_REJECT":
        if (!userProfile.user_type || userProfile.user_type.trim() !== "admin") {
          console.error(`Permission check failed for action '${action}': Expected 'admin', got '[${userProfile.user_type?.trim()}]' for user ID ${userId}`);
          return new Response(JSON.stringify({ error: "Permission denied: User is not an 'admin' or user_type is invalid for this action." }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        rpcName = "admin_reject_submission";
        rpcParams.p_admin_id = userId;
        break;
      case "ADMIN_RETURN_TO_ADVERTISER":
        if (!userProfile.user_type || userProfile.user_type.trim() !== "admin") {
          console.error(`Permission check failed for action '${action}': Expected 'admin', got '[${userProfile.user_type?.trim()}]' for user ID ${userId}`);
          return new Response(JSON.stringify({ error: "Permission denied: User is not an 'admin' or user_type is invalid for this action." }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        rpcName = "admin_return_submission_to_advertiser";
        rpcParams.p_admin_id = userId;
        break;
      case "ADVERTISER_APPROVE_SECOND_INSTANCE":
        if (!canPerformAdvertiserActions(userProfile.user_type?.trim())) {
          console.error(`Permission check failed for action '${action}': Expected 'anunciante' or 'admin', got '[${userProfile.user_type?.trim()}]' for user ID ${userId}`);
          return new Response(JSON.stringify({ error: "Permission denied: User is not an 'anunciante' or 'admin' for this action." }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        rpcName = "approve_submission_second_instance";
        rpcParams.p_advertiser_id = userId;
        break;
      case "ADVERTISER_REJECT_SECOND_INSTANCE":
        if (!canPerformAdvertiserActions(userProfile.user_type?.trim())) {
          console.error(`Permission check failed for action '${action}': Expected 'anunciante' or 'admin', got '[${userProfile.user_type?.trim()}]' for user ID ${userId}`);
          return new Response(JSON.stringify({ error: "Permission denied: User is not an 'anunciante' or 'admin' for this action." }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        rpcName = "reject_submission_second_instance";
        rpcParams.p_advertiser_id = userId;
        break;
      default:
        console.error(`Invalid action provided: ${action}`);
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    console.log(`moderate-mission-submission: Attempting RPC call '${rpcName}' with params:`, JSON.stringify(rpcParams));
    
    try {
      const { data: rpcData, error: rpcError } = await supabaseAdminClient.rpc(rpcName, rpcParams);
      console.log(`moderate-mission-submission: RPC call '${rpcName}' completed. Data:`, JSON.stringify(rpcData), "Error:", JSON.stringify(rpcError));

      if (rpcError) {
        console.error(`RPC error (${rpcName}):`, rpcError);
        return new Response(JSON.stringify({ 
          error: rpcError.message || "Failed to moderate submission",
          details: rpcError,
          rpc_name: rpcName,
          rpc_params: rpcParams
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: `Action ${action} performed successfully.`,
        rpc_name: rpcName,
        data: rpcData
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (rpcException) {
      console.error(`RPC exception (${rpcName}):`, rpcException);
      return new Response(JSON.stringify({ 
        error: "RPC call failed",
        details: rpcException.message,
        rpc_name: rpcName,
        rpc_params: rpcParams
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    console.error("moderate-mission-submission: Unhandled error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Internal server error",
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
