
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Profile {
  id: string;
  user_type: string;
}



async function getUserProfile(supabase: SupabaseClient, userId: string): Promise<Profile | null> {
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
}



serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("unlock-crm-details: Function invoked.");
    
    const supabaseAdminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
       auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
    });
    
    const userAuthHeader = req.headers.get("Authorization")!;
    const jwt = userAuthHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdminClient.auth.getUser(jwt);

    if (userError || !user) {
      console.error("unlock-crm-details: Auth error:", userError);
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const advertiserId = user.id;
    console.log(`unlock-crm-details: Authenticated advertiser ID: ${advertiserId}`);

    const { mission_id } = await req.json();
    if (!mission_id) {
      console.error("unlock-crm-details: Missing mission_id");
      return new Response(JSON.stringify({ error: "Missing mission_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`unlock-crm-details: Processing unlock request for mission: ${mission_id}`);

    const advertiserProfile = await getUserProfile(supabaseAdminClient, advertiserId);
    if (!advertiserProfile || advertiserProfile.user_type !== "advertiser") {
      console.error(`unlock-crm-details: Permission denied for user ${advertiserId}. User type: ${advertiserProfile?.user_type}`);
      return new Response(JSON.stringify({ error: "Permission denied. Only advertisers can unlock details." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verificar se a missão pertence ao anunciante
    const { data: mission, error: missionError } = await supabaseAdminClient
      .from("missions")
      .select("id, title, advertiser_id")
      .eq("id", mission_id)
      .eq("advertiser_id", advertiserId)
      .single();

    if (missionError || !mission) {
      console.error("unlock-crm-details: Mission not found or not owned by advertiser:", missionError);
      return new Response(JSON.stringify({ error: "Missão não encontrada ou não pertence ao anunciante" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Chamar função RPC para desbloqueio
    console.log(`unlock-crm-details: Calling RPC function for mission: ${mission_id}`);

    const { data: result, error: rpcError } = await supabaseAdminClient.rpc("unlock_crm_mission_details", {
      p_advertiser_id: advertiserId,
      p_mission_id: mission_id,
    });

    if (rpcError) {
      console.error("unlock-crm-details: RPC error (unlock_crm_mission_details):", rpcError);
      const errorMessage = rpcError.message.includes("rifas suficientes") 
        ? "Você não possui rifas suficientes." 
        : "Falha ao desbloquear detalhes.";
      const errorStatus = rpcError.message.includes("rifas suficientes") ? 402 : 500;

      return new Response(JSON.stringify({ error: errorMessage, details: rpcError.message }), {
        status: errorStatus,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`unlock-crm-details: Successfully unlocked details for mission ${mission_id}. Result:`, result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("unlock-crm-details: Unhandled error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
