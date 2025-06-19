
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

interface ProfileView {
  advertiser_id: string;
  participant_id: string;
  unlocked_details: boolean;
  rifa_consumed_for_unlock: boolean;
  viewed_at: string;
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

async function checkIfAlreadyUnlocked(
  supabase: SupabaseClient, 
  advertiserId: string, 
  participantId: string
): Promise<ProfileView | null> {
  console.log(`unlock-crm-details: Checking if already unlocked for advertiser ${advertiserId} and participant ${participantId}`);
  
  const { data, error } = await supabase
    .from("advertiser_profile_views")
    .select("advertiser_id, participant_id, unlocked_details, rifa_consumed_for_unlock, viewed_at")
    .eq("advertiser_id", advertiserId)
    .eq("participant_id", participantId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found - not unlocked yet
      console.log("unlock-crm-details: No previous unlock record found");
      return null;
    }
    console.error("unlock-crm-details: Error checking previous unlock:", error);
    return null;
  }

  console.log(`unlock-crm-details: Found previous unlock record:`, data);
  return data as ProfileView;
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

    const { participant_id } = await req.json();
    if (!participant_id) {
      console.error("unlock-crm-details: Missing participant_id");
      return new Response(JSON.stringify({ error: "Missing participant_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`unlock-crm-details: Processing unlock request for participant: ${participant_id}`);

    const advertiserProfile = await getUserProfile(supabaseAdminClient, advertiserId);
    if (!advertiserProfile || advertiserProfile.user_type !== "advertiser") {
      console.error(`unlock-crm-details: Permission denied for user ${advertiserId}. User type: ${advertiserProfile?.user_type}`);
      return new Response(JSON.stringify({ error: "Permission denied. Only advertisers can unlock details." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verificar se os detalhes já foram desbloqueados anteriormente
    const existingUnlock = await checkIfAlreadyUnlocked(supabaseAdminClient, advertiserId, participant_id);
    
    if (existingUnlock && existingUnlock.unlocked_details) {
      console.log(`unlock-crm-details: Details already unlocked for advertiser ${advertiserId} and participant ${participant_id}. No rifa consumption needed.`);
      
      // Atualizar apenas a data de visualização, sem consumir rifa
      const { error: updateError } = await supabaseAdminClient
        .from("advertiser_profile_views")
        .update({ viewed_at: new Date().toISOString() })
        .eq("advertiser_id", advertiserId)
        .eq("participant_id", participant_id);

      if (updateError) {
        console.error("unlock-crm-details: Error updating view timestamp:", updateError);
      } else {
        console.log("unlock-crm-details: Updated view timestamp successfully");
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: "Detalhes já estavam desbloqueados. Nenhuma rifa foi consumida.",
        already_unlocked: true
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Se não foi desbloqueado antes, proceder com o desbloqueio que consome rifa
    console.log(`unlock-crm-details: Proceeding with unlock that will consume rifa for advertiser ${advertiserId} and participant ${participant_id}`);

    const rpcParams: { [key: string]: string } = {
      p_advertiser_id: advertiserId,
      p_participant_id: participant_id,
    };

    const { error: rpcError } = await supabaseAdminClient.rpc("unlock_crm_participant_details", rpcParams);

    if (rpcError) {
      console.error("unlock-crm-details: RPC error (unlock_crm_participant_details):", rpcError);
      const errorMessage = rpcError.message.includes("não possui rifas suficientes") 
        ? "Você não possui rifas suficientes." 
        : "Falha ao desbloquear detalhes.";
      const errorStatus = rpcError.message.includes("não possui rifas suficientes") ? 402 : 500;

      return new Response(JSON.stringify({ error: errorMessage, details: rpcError.message }), {
        status: errorStatus,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`unlock-crm-details: Successfully unlocked details for advertiser ${advertiserId} and participant ${participant_id}. 1 rifa consumed.`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Detalhes do participante desbloqueados. 1 rifa consumida.",
      already_unlocked: false
    }), {
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
