
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
  
  try {
    console.log("Starting raffle deadline check function");
    
    // 1. Find active raffles that reached min_points but don't have min_points_reached_at set
    const { data: rafflesReachingMinPoints, error: mpError } = await supabase
      .from("raffles")
      .select("id, title, min_points, points_per_number, numbers_total")
      .eq("status", "active")
      .is("min_points_reached_at", null)
      .eq("is_auto_scheduled", true);
      
    if (mpError) throw mpError;
    
    console.log(`Found ${rafflesReachingMinPoints?.length || 0} raffles to check for min points threshold`);
    
    // For each raffle, check if they've reached min_points
    for (const raffle of rafflesReachingMinPoints || []) {
      // Count sold numbers
      const { count: soldNumbers, error: countError } = await supabase
        .from("raffle_numbers")
        .select("*", { count: "exact", head: true })
        .eq("raffle_id", raffle.id);
        
      if (countError) {
        console.error(`Error counting sold numbers for raffle ${raffle.id}:`, countError);
        continue;
      }
      
      const pointsCollected = (soldNumbers || 0) * raffle.points_per_number;
      console.log(`Raffle ${raffle.id} has collected ${pointsCollected} points, needs ${raffle.min_points}`);
      
      // If min_points reached, set min_points_reached_at and draw_date (48h later)
      if (pointsCollected >= raffle.min_points) {
        const now = new Date();
        const drawDate = new Date(now);
        drawDate.setHours(drawDate.getHours() + 48);
        
        const { error: updateError } = await supabase
          .from("raffles")
          .update({
            min_points_reached_at: now.toISOString(),
            draw_date: drawDate.toISOString(),
          })
          .eq("id", raffle.id);
          
        if (updateError) {
          console.error(`Error updating raffle ${raffle.id}:`, updateError);
          continue;
        }
        
        console.log(`Raffle ${raffle.id} has reached min points. Draw scheduled for ${drawDate.toISOString()}`);
      }
    }
    
    // 2. Execute raffles that have reached their draw_date
    const { data: completedRaffles, error: crError } = await supabase
      .rpc("auto_execute_raffles");
      
    if (crError) {
      console.error("Error executing completed raffles:", crError);
    } else {
      console.log("Auto-executed raffles completed successfully");
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Raffle deadlines checked successfully" 
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error("Error in check-raffle-deadlines function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
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
