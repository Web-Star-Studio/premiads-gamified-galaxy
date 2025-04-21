
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://wvhgfxeqrjavxlzvxqqh.supabase.co";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      } 
    });
  }
  
  // Verify JWT token (requires auth)
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing authorization header" }),
      { 
        status: 401, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }
    
    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();
      
    if (profileError) throw profileError;
    
    if (profile.user_type !== 'admin') {
      return new Response(
        JSON.stringify({ error: "Only admins can run database cleanup" }),
        { 
          status: 403, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }
    
    console.log("Starting database cleanup process");
    
    // Parse request body
    const { dryRun = true } = await req.json().catch(() => ({}));
    
    let results = {
      completedRaffles: 0,
      expiredMissions: 0,
      dryRun: dryRun
    };
    
    // 1. Clean up completed raffles
    const { data: completedRaffles, error: rafflesError } = await supabase
      .from('raffles')
      .select('id')
      .eq('status', 'completed')
      .lt('end_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      
    if (rafflesError) throw rafflesError;
    
    if (completedRaffles && completedRaffles.length > 0) {
      console.log(`Found ${completedRaffles.length} old completed raffles to archive`);
      results.completedRaffles = completedRaffles.length;
      
      if (!dryRun) {
        // Archive the raffles
        const { error: updateError } = await supabase
          .from('raffles')
          .update({ status: 'archived' })
          .in('id', completedRaffles.map(r => r.id));
          
        if (updateError) throw updateError;
      }
    }
    
    // 2. Clean up expired missions
    const { data: expiredMissions, error: missionsError } = await supabase
      .from('missions')
      .select('id')
      .eq('is_active', true)
      .lt('end_date', new Date().toISOString());
      
    if (missionsError) throw missionsError;
    
    if (expiredMissions && expiredMissions.length > 0) {
      console.log(`Found ${expiredMissions.length} expired missions to deactivate`);
      results.expiredMissions = expiredMissions.length;
      
      if (!dryRun) {
        // Deactivate the missions
        const { error: updateError } = await supabase
          .from('missions')
          .update({ is_active: false })
          .in('id', expiredMissions.map(m => m.id));
          
        if (updateError) throw updateError;
      }
    }
    
    // Return results
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Database cleanup ${dryRun ? '(dry run)' : ''} completed successfully`,
        results
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error("Error in cleanup-database function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal server error during database cleanup"
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
});
