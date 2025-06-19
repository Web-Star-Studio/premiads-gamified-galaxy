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

    // Get submission details
    const { data: submission, error: submissionError } = await supabase
      .from('mission_submissions')
      .select(`
        *,
        missions!inner(rifas, cashback_reward)
      `)
      .eq('id', submission_id)
      .single();

    if (submissionError || !submission) {
      return new Response(JSON.stringify({ error: "Submission not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get current user rifas
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('rifas')
      .eq('id', submission.user_id)
      .single();

    if (profileError) {
      return new Response(JSON.stringify({ error: "User profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rifasToAdd = submission.missions.rifas || 0;
    const cashbackToAdd = parseFloat(submission.missions.cashback_reward || '0');
    const currentRifas = userProfile.rifas || 0;
    const newRifasBalance = currentRifas + rifasToAdd;

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

    // Update user rifas
    const { error: updateUserError } = await supabase
      .from('profiles')
      .update({
        rifas: newRifasBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', submission.user_id);

    if (updateUserError) {
      throw new Error(`Failed to update user rifas: ${updateUserError.message}`);
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

    // TODO: Handle cashback if needed
    if (cashbackToAdd > 0) {
      console.log(`Cashback to be added: ${cashbackToAdd} - implement cashback logic here`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Submission approved successfully",
      rifas_added: rifasToAdd,
      new_rifas_balance: newRifasBalance
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