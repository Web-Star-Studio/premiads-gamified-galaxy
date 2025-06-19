import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });

    // Get user from auth header
    const userAuthHeader = req.headers.get("authorization");
    if (!userAuthHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Authorization header missing or invalid" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = userAuthHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdminClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const advertiserId = user.id;
    console.log(`unlock-crm-details: Processing request for advertiser ${advertiserId}`);

    // Parse request body
    const { mission_id } = await req.json();

    if (!mission_id) {
      return new Response(JSON.stringify({ error: "mission_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify that the mission belongs to the advertiser
    const { data: mission, error: missionError } = await supabaseAdminClient
      .from("missions")
      .select("id, title, advertiser_id")
      .eq("id", mission_id)
      .eq("advertiser_id", advertiserId)
      .single();

    if (missionError || !mission) {
      return new Response(JSON.stringify({ error: "Mission not found or doesn't belong to advertiser" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if already unlocked
    const { data: existingUnlock } = await supabaseAdminClient
      .from("advertiser_crm_unlocks")
      .select("*")
      .eq("advertiser_id", advertiserId)
      .eq("mission_id", mission_id)
      .single();

    if (existingUnlock) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Dados já estavam desbloqueados. Nenhuma rifa foi consumida.",
        already_unlocked: true
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get advertiser profile to check rifas
    const { data: advertiserProfile, error: profileError } = await supabaseAdminClient
      .from("profiles")
      .select("rifas")
      .eq("id", advertiserId)
      .single();

    if (profileError || !advertiserProfile) {
      return new Response(JSON.stringify({ error: "Advertiser profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const currentRifas = advertiserProfile.rifas || 0;
    const rifasCost = 2;

    if (currentRifas < rifasCost) {
      return new Response(JSON.stringify({ 
        error: `Rifas insuficientes. Você tem ${currentRifas} rifas, mas precisa de ${rifasCost} rifas para desbloquear os dados desta campanha.` 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Start transaction - deduct rifas and create unlock record
    const { error: deductError } = await supabaseAdminClient
      .from("profiles")
      .update({ rifas: currentRifas - rifasCost })
      .eq("id", advertiserId);

    if (deductError) {
      console.error("unlock-crm-details: Error deducting rifas:", deductError);
      return new Response(JSON.stringify({ error: "Error deducting rifas" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create unlock record
    const { error: unlockError } = await supabaseAdminClient
      .from("advertiser_crm_unlocks")
      .insert({
        advertiser_id: advertiserId,
        mission_id: mission_id,
        rifas_cost: rifasCost
      });

    if (unlockError) {
      console.error("unlock-crm-details: Error creating unlock record:", unlockError);
      
      // Rollback rifas deduction
      await supabaseAdminClient
        .from("profiles")
        .update({ rifas: currentRifas })
        .eq("id", advertiserId);

      return new Response(JSON.stringify({ error: "Error creating unlock record" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log transaction
    const { error: transactionError } = await supabaseAdminClient
      .from("rifas_transactions")
      .insert({
        user_id: advertiserId,
        type: "debit",
        amount: rifasCost,
        description: `Desbloqueio de dados CRM - Campanha: ${mission.title}`,
        metadata: {
          mission_id: mission_id,
          mission_title: mission.title,
          transaction_type: "crm_unlock"
        }
      });

    if (transactionError) {
      console.error("unlock-crm-details: Error logging transaction:", transactionError);
    }

    console.log(`unlock-crm-details: Successfully unlocked data for mission ${mission_id}. Deducted ${rifasCost} rifas from advertiser ${advertiserId}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Dados desbloqueados com sucesso! ${rifasCost} rifas foram debitadas da sua conta.`,
      rifas_deducted: rifasCost,
      remaining_rifas: currentRifas - rifasCost
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("unlock-crm-details: Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}); 