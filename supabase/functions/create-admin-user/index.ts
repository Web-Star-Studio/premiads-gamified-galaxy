
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
  
  try {
    const { email, password, fullName, adminKey } = await req.json();
    
    // Validate required fields
    if (!email || !password || !fullName || !adminKey) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }
    
    // Check admin creation key from environment variable
    const expectedAdminKey = Deno.env.get("ADMIN_CREATION_KEY");
    if (!expectedAdminKey || adminKey !== expectedAdminKey) {
      console.error("Invalid admin creation key provided");
      return new Response(
        JSON.stringify({ error: "Invalid admin key" }),
        { 
          status: 403, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }
    
    console.log(`Creating admin user for: ${email}`);
    
    // Create user with admin role
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        user_type: "admin"
      }
    });
    
    if (createError) throw createError;
    
    if (!userData.user) {
      throw new Error("Failed to create user");
    }
    
    console.log(`User created with ID: ${userData.user.id}`);
    
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userData.user.id)
      .single();
      
    if (!existingProfile) {
      // Create profile
      console.log(`Creating admin profile for user: ${userData.user.id}`);
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userData.user.id,
          full_name: fullName,
          user_type: "admin",
          profile_completed: true,
          email_notifications: true,
          push_notifications: true,
          points: 0,
          credits: 0
        });
        
      if (profileError) throw profileError;
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin user created successfully",
        userId: userData.user.id
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error("Error creating admin user:", error);
    
    // Handle duplicate email error specifically
    if (error.message?.includes("duplicate key")) {
      return new Response(
        JSON.stringify({ error: "Email already exists" }),
        { 
          status: 409, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to create admin user"
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
