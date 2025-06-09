import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Edge function that runs on a schedule to check raffle deadlines
// and automatically draw raffles that have reached their end date
Deno.serve(async (req: Request) => {
  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Execute the check_raffle_deadlines function
    const { data, error } = await supabase.rpc('check_raffle_deadlines');
    
    if (error) throw error;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Raffle deadlines checked successfully' 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error checking raffle deadlines:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
