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

// Helper function to check if user can perform advertiser actions
function canPerformAdvertiserActions(userType: string): boolean {
  return userType === 'anunciante' || userType === 'admin';
}

// Helper function to process referral completion
async function processReferralCompletion(supabase: SupabaseClient, userId: string) {
  try {
    console.log('Processando indicação para usuário:', userId);
    
    // Buscar indicação pendente para este usuário
    const { data: indicacao, error: indicacaoError } = await supabase
      .from('indicacoes')
      .select(`
        id,
        referencia_id,
        referencias:referencia_id (
          participante_id
        )
      `)
      .eq('convidado_id', userId)
      .eq('status', 'pendente')
      .maybeSingle();

    if (indicacaoError) {
      console.error('Erro ao buscar indicação:', indicacaoError);
      return;
    }

    if (!indicacao) {
      console.log('Nenhuma indicação pendente encontrada para:', userId);
      return;
    }

    // Atualizar status da indicação para completo
    const { error: updateError } = await supabase
      .from('indicacoes')
      .update({ status: 'completo' })
      .eq('id', indicacao.id);

    if (updateError) {
      console.error('Erro ao atualizar status da indicação:', updateError);
      return;
    }

    // Dar recompensa ao referenciador (200 rifas)
    const referenciadorId = (indicacao.referencias as any)?.participante_id;
    if (referenciadorId) {
      // Buscar rifas atuais do referenciador
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('rifas')
        .eq('id', referenciadorId)
        .single();

      if (!profileError && profile) {
        const novasRifas = (profile.rifas || 0) + 200;
        
        // Atualizar rifas
        const { error: updateRifasError } = await supabase
          .from('profiles')
          .update({ rifas: novasRifas })
          .eq('id', referenciadorId);

        if (!updateRifasError) {
          // Registrar transação
          await supabase
            .from('rifas_transactions')
            .insert({
              user_id: referenciadorId,
              transaction_type: 'bonus',
              amount: 200,
              description: 'Bônus por indicação completa'
            });

          console.log('Recompensa de referência aplicada:', referenciadorId, '- Nova quantidade de rifas:', novasRifas);
        } else {
          console.error('Erro ao atualizar rifas do referenciador:', updateRifasError);
        }
      } else {
        console.error('Erro ao buscar perfil do referenciador:', profileError);
      }
    }
  } catch (error) {
    console.error('Erro ao processar indicação:', error);
  }
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

    const userAuthHeader = req.headers.get("Authorization")!;
    const jwt = userAuthHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdminClient.auth.getUser(jwt);

    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;
    console.log(`moderate-mission-submission: Authenticated user ID: ${userId}`);

    const requestBody = await req.json();
    console.log("moderate-mission-submission: Request body:", JSON.stringify(requestBody));
    const { submission_id, action } = requestBody;
    if (!submission_id || !action) {
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
          throw new Error("Permission denied: User is not an 'anunciante' or 'admin' for this action.");
        }
        rpcName = "approve_submission_first_instance";
        rpcParams.p_advertiser_id = userId;
        break;
      case "ADVERTISER_REJECT_TO_SECOND_INSTANCE":
        if (!canPerformAdvertiserActions(userProfile.user_type?.trim())) {
          console.error(`Permission check failed for action '${action}': Expected 'anunciante' or 'admin', got '[${userProfile.user_type?.trim()}]' for user ID ${userId}`);
          throw new Error("Permission denied: User is not an 'anunciante' or 'admin' for this action.");
        }
        rpcName = "reject_submission_to_second_instance";
        rpcParams.p_advertiser_id = userId;
        break;
      case "ADMIN_REJECT":
        if (!userProfile.user_type || userProfile.user_type.trim() !== "admin") {
          console.error(`Permission check failed for action '${action}': Expected 'admin', got '[${userProfile.user_type?.trim()}]' for user ID ${userId}`);
          throw new Error("Permission denied: User is not an 'admin' or user_type is invalid for this action.");
        }
        rpcName = "admin_reject_submission";
        rpcParams.p_admin_id = userId;
        break;
      case "ADMIN_RETURN_TO_ADVERTISER":
        if (!userProfile.user_type || userProfile.user_type.trim() !== "admin") {
          console.error(`Permission check failed for action '${action}': Expected 'admin', got '[${userProfile.user_type?.trim()}]' for user ID ${userId}`);
          throw new Error("Permission denied: User is not an 'admin' or user_type is invalid for this action.");
        }
        rpcName = "admin_return_submission_to_advertiser";
        rpcParams.p_admin_id = userId;
        break;
      case "ADVERTISER_APPROVE_SECOND_INSTANCE":
        if (!canPerformAdvertiserActions(userProfile.user_type?.trim())) {
          console.error(`Permission check failed for action '${action}': Expected 'anunciante' or 'admin', got '[${userProfile.user_type?.trim()}]' for user ID ${userId}`);
          throw new Error("Permission denied: User is not an 'anunciante' or 'admin' for this action.");
        }
        rpcName = "approve_submission_second_instance";
        rpcParams.p_advertiser_id = userId;
        break;
      case "ADVERTISER_REJECT_SECOND_INSTANCE":
        if (!canPerformAdvertiserActions(userProfile.user_type?.trim())) {
          console.error(`Permission check failed for action '${action}': Expected 'anunciante' or 'admin', got '[${userProfile.user_type?.trim()}]' for user ID ${userId}`);
          throw new Error("Permission denied: User is not an 'anunciante' or 'admin' for this action.");
        }
        rpcName = "reject_submission_second_instance";
        rpcParams.p_advertiser_id = userId;
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    console.log(`moderate-mission-submission: Attempting RPC call '${rpcName}' with params:`, JSON.stringify(rpcParams));
    const { data: rpcData, error: rpcError } = await supabaseAdminClient.rpc(rpcName, rpcParams);
    console.log(`moderate-mission-submission: RPC call '${rpcName}' completed. Data:`, JSON.stringify(rpcData), "Error:", JSON.stringify(rpcError));

    if (rpcError) {
      console.error(`RPC error (${rpcName}):`, rpcError);
      return new Response(JSON.stringify({ error: rpcError.message || "Failed to moderate submission" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

<<<<<<< HEAD
=======
    // Processar indicação se a ação for de aprovação
    if (action === "ADVERTISER_APPROVE_FIRST_INSTANCE" || action === "ADVERTISER_APPROVE_SECOND_INSTANCE") {
      // Buscar dados da submissão para obter o user_id
      const { data: submission, error: submissionError } = await supabaseAdminClient
        .from('mission_submissions')
        .select('user_id')
        .eq('id', submission_id)
        .single();

      if (!submissionError && submission) {
        await processReferralCompletion(supabaseAdminClient, submission.user_id);
      }
    }

>>>>>>> ff71f6e (BACKUP-REVERT-FROM-MAIN)
    return new Response(JSON.stringify({ success: true, message: `Action ${action} performed successfully.` }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("moderate-mission-submission: Unhandled error:", error, "Error stringified:", JSON.stringify(error));
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
