
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Supabase environment variables are not set')
    }

    const supabase = createClient(
      supabaseUrl, 
      supabaseServiceRoleKey
    )

    const { email, password, fullName } = await req.json()

    // Create user with admin role
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: 'admin'
        }
      }
    })

    if (error) throw error

    // Create profile with admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user?.id,
        full_name: fullName,
        user_type: 'admin',
        profile_completed: true
      })

    if (profileError) throw profileError

    return new Response(JSON.stringify({ 
      message: 'Admin user created successfully',
      userId: data.user?.id 
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
      status: 400
    })
  }
})
