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
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });

    // Get user from auth header
    const userAuthHeader = req.headers.get("Authorization")!;
    const jwt = userAuthHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { submission_id } = await req.json();

    if (!submission_id) {
      return new Response(JSON.stringify({ error: "Missing submission_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get submission details with mission cashback data
    const { data: submission, error: submissionError } = await supabase
      .from('mission_submissions')
      .select(`
        *,
        missions!inner(rifas, cashback_amount_per_raffle, cashback_reward)
      `)
      .eq('id', submission_id)
      .single();

    if (submissionError || !submission) {
      return new Response(JSON.stringify({ error: "Submission not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get current user profile data (rifas and cashback_balance)
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('rifas, cashback_balance')
      .eq('id', submission.user_id)
      .single();

    if (profileError) {
      return new Response(JSON.stringify({ error: "User profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rifasToAdd = submission.missions.rifas || 0;
    const cashbackPerRifa = parseFloat(submission.missions.cashback_amount_per_raffle || '0');
    const cashbackToAdd = rifasToAdd * cashbackPerRifa; // Cálculo dinâmico: rifas * valor por rifa
    
    const currentRifas = userProfile.rifas || 0;
    const currentCashback = parseFloat(userProfile.cashback_balance || '0');
    const newRifasBalance = currentRifas + rifasToAdd;
    const newCashbackBalance = currentCashback + cashbackToAdd;

    // Start transaction-like updates
    const { error: updateSubmissionError } = await supabase
      .from('mission_submissions')
      .update({
        status: 'approved',
        second_instance_status: 'approved',
        review_stage: 'completed',
        validated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', submission_id);

    if (updateSubmissionError) {
      throw new Error(`Failed to update submission: ${updateSubmissionError.message}`);
    }

    // Update user rifas and cashback balance
    const { error: updateUserError } = await supabase
      .from('profiles')
      .update({
        rifas: newRifasBalance,
        cashback_balance: newCashbackBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', submission.user_id);

    if (updateUserError) {
      throw new Error(`Failed to update user profile: ${updateUserError.message}`);
    }

    // Insert rifas transaction record
    const { error: transactionError } = await supabase
      .from('rifas_transactions')
      .insert({
        id: crypto.randomUUID(),
        user_id: submission.user_id,
        mission_id: submission.mission_id,
        submission_id: submission_id,
        transaction_type: 'earned',
        amount: rifasToAdd,
        description: 'Rifas ganhas por completar missão aprovada',
        created_at: new Date().toISOString()
      });

    if (transactionError) {
      console.warn(`Warning: Failed to create rifas transaction: ${transactionError.message}`);
      // Don't fail the whole operation for this
    }

    // Record mission reward in mission_rewards table for tracking
    const { error: rewardError } = await supabase
      .from('mission_rewards')
      .insert({
        id: crypto.randomUUID(),
        user_id: submission.user_id,
        mission_id: submission.mission_id,
        submission_id: submission_id,
        rifas_earned: rifasToAdd,
        cashback_earned: cashbackToAdd,
        rewarded_at: new Date().toISOString()
      });

    if (rewardError) {
      console.warn(`Warning: Failed to create mission reward record: ${rewardError.message}`);
      // Don't fail the whole operation for this
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Submission approved successfully",
      rifas_added: rifasToAdd,
      cashback_added: cashbackToAdd,
      new_rifas_balance: newRifasBalance,
      new_cashback_balance: newCashbackBalance
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}); 