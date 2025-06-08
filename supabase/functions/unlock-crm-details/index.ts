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
    const supabaseAdminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
       auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
    });
    
    const userAuthHeader = req.headers.get("Authorization")!;
    const jwt = userAuthHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdminClient.auth.getUser(jwt);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const advertiserId = user.id;

    const { participant_id } = await req.json();
    if (!participant_id) {
      return new Response(JSON.stringify({ error: "Missing participant_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const advertiserProfile = await getUserProfile(supabaseAdminClient, advertiserId);
    if (!advertiserProfile || advertiserProfile.user_type !== "advertiser") {
      return new Response(JSON.stringify({ error: "Permission denied. Only advertisers can unlock details." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rpcParams: { [key: string]: string } = {
      p_advertiser_id: advertiserId,
      p_participant_id: participant_id,
    };

    const { error: rpcError } = await supabaseAdminClient.rpc("unlock_crm_participant_details", rpcParams);

    if (rpcError) {
      console.error("RPC error (unlock_crm_participant_details):", rpcError);
      const errorMessage = rpcError.message.includes("não possui rifas suficientes") 
        ? "Você não possui rifas suficientes." 
        : "Falha ao desbloquear detalhes.";
      const errorStatus = rpcError.message.includes("não possui rifas suficientes") ? 402 : 500;

      return new Response(JSON.stringify({ error: errorMessage, details: rpcError.message }), {
        status: errorStatus,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, message: "Detalhes do participante desbloqueados. 1 rifa consumida." }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
