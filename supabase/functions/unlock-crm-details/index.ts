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

async function checkIfParticipantAlreadyUnlocked(
  supabase: SupabaseClient, 
  advertiserId: string, 
  participantId: string,
  missionId: string
): Promise<boolean> {
  console.log(`unlock-crm-details: Checking if participant ${participantId} already unlocked for advertiser ${advertiserId} in mission ${missionId}`);
  
  // Usar a tabela específica para desbloqueios por participante
  const { data, error } = await supabase
    .from("advertiser_participant_unlocks")
    .select("id")
    .eq("advertiser_id", advertiserId)
    .eq("participant_id", participantId)
    .eq("mission_id", missionId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error("unlock-crm-details: Error checking previous unlock:", error);
    return false;
  }

  const hasUnlocked = !!data;
  console.log(`unlock-crm-details: Participant unlock status: ${hasUnlocked} for participant ${participantId}`);
  return hasUnlocked;
}

async function debitRifasAndRegisterUnlock(
  supabase: SupabaseClient,
  advertiserId: string,
  participantId: string,
  missionId: string
): Promise<{ success: boolean; error?: string }> {
  console.log(`unlock-crm-details: Starting rifa debit and unlock registration for advertiser ${advertiserId}, participant ${participantId}, mission ${missionId}`);

  try {
    // Verificar saldo de rifas do anunciante
    const { data: advertiserProfile, error: profileError } = await supabase
      .from("profiles")
      .select("rifas")
      .eq("id", advertiserId)
      .single();

    if (profileError) {
      console.error("unlock-crm-details: Error fetching advertiser profile:", profileError);
      return { success: false, error: "Erro ao verificar saldo de rifas" };
    }

    const currentRifas = advertiserProfile?.rifas || 0;
    const requiredRifas = 2;

    if (currentRifas < requiredRifas) {
      console.log(`unlock-crm-details: Insufficient rifas. Current: ${currentRifas}, Required: ${requiredRifas}`);
      return { success: false, error: "Saldo insuficiente de rifas" };
    }

    // Debitar rifas usando transação
    const { error: debitError } = await supabase
      .from("profiles")
      .update({ 
        rifas: currentRifas - requiredRifas 
      })
      .eq("id", advertiserId);

    if (debitError) {
      console.error("unlock-crm-details: Error debiting rifas:", debitError);
      return { success: false, error: "Erro ao debitar rifas" };
    }

    // Registrar transação de rifas
    const { error: transactionError } = await supabase
      .from("rifas_transactions")
      .insert({
        user_id: advertiserId,
        mission_id: missionId,
        transaction_type: "spent",
        amount: requiredRifas,
        description: `Desbloqueio de dados demográficos do participante ${participantId}`
      });

    if (transactionError) {
      console.warn("unlock-crm-details: Error logging rifa transaction:", transactionError);
      // Não falha a operação por causa do log
    }

    // Registrar o desbloqueio específico do participante
    const { error: unlockError } = await supabase
      .from("advertiser_participant_unlocks")
      .insert({
        advertiser_id: advertiserId,
        participant_id: participantId,
        mission_id: missionId,
        rifas_cost: requiredRifas,
        unlocked_at: new Date().toISOString()
      });

    if (unlockError) {
      console.error("unlock-crm-details: Error registering unlock:", unlockError);
      // Tentar reverter o débito de rifas
      await supabase
        .from("profiles")
        .update({ 
          rifas: currentRifas 
        })
        .eq("id", advertiserId);
      
      return { success: false, error: "Erro ao registrar desbloqueio" };
    }

    console.log(`unlock-crm-details: Successfully processed unlock for advertiser ${advertiserId}, participant ${participantId}. ${requiredRifas} rifas debited.`);
    return { success: true };

  } catch (error) {
    console.error("unlock-crm-details: Unexpected error in debitRifasAndRegisterUnlock:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("unlock-crm-details: Function invoked for participant unlock.");
    
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

    const body = await req.json();
    console.log("unlock-crm-details: Request body:", JSON.stringify(body));
    
    const { participantId, missionId } = body;
    console.log(`unlock-crm-details: Extracted params - participantId: ${participantId}, missionId: ${missionId}`);
    
    if (!participantId || !missionId) {
      console.error(`unlock-crm-details: Missing params - participantId: ${participantId}, missionId: ${missionId}`);
      return new Response(JSON.stringify({ 
        error: "Missing participantId or missionId",
        received: { participantId, missionId }
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`unlock-crm-details: Processing unlock request for participant: ${participantId} in mission: ${missionId}`);

    const advertiserProfile = await getUserProfile(supabaseAdminClient, advertiserId);
    if (!advertiserProfile || (advertiserProfile.user_type !== "advertiser" && advertiserProfile.user_type !== "anunciante")) {
      console.error(`unlock-crm-details: Permission denied for user ${advertiserId}. User type: ${advertiserProfile?.user_type}`);
      return new Response(JSON.stringify({ error: "Permission denied. Only advertisers can unlock details." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verificar se este participante já foi desbloqueado anteriormente
    const alreadyUnlocked = await checkIfParticipantAlreadyUnlocked(supabaseAdminClient, advertiserId, participantId, missionId);
    
    if (alreadyUnlocked) {
      console.log(`unlock-crm-details: Participant ${participantId} already unlocked for advertiser ${advertiserId} in mission ${missionId}. No rifa consumption needed.`);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Dados deste participante já estavam desbloqueados. Nenhuma rifa foi consumida.",
        already_unlocked: true
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Proceder com o desbloqueio que consome rifas
    console.log(`unlock-crm-details: Proceeding with unlock that will consume rifas for advertiser ${advertiserId} and participant ${participantId}`);

    const result = await debitRifasAndRegisterUnlock(supabaseAdminClient, advertiserId, participantId, missionId);

    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: result.error?.includes("insuficiente") ? 402 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`unlock-crm-details: Successfully unlocked participant ${participantId} for advertiser ${advertiserId}. 2 rifas consumed.`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Dados do participante desbloqueados. 2 rifas consumidas.",
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
