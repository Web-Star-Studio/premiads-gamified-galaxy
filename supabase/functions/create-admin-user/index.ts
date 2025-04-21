
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

    // First check if user already exists
    const { data: existingUser, error: checkError } = await supabase.auth.admin.getUserByEmail(email)
    
    if (checkError && checkError.message !== 'User not found') {
      throw checkError
    }
    
    if (existingUser) {
      // User exists, check if they are already an admin
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', existingUser.id)
        .single()
      
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError
      }
      
      if (existingProfile?.user_type === 'admin') {
        return new Response(JSON.stringify({ 
          message: 'User already exists as admin',
          userId: existingUser.id 
        }), {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
          status: 200
        })
      }
      
      // Update the user to be an admin
      const { error: updateError } = await supabase.rpc(
        'update_user_type',
        { 
          user_id: existingUser.id,
          new_type: 'admin',
          mark_completed: true
        }
      )
      
      if (updateError) throw updateError
      
      return new Response(JSON.stringify({ 
        message: 'User successfully updated to admin',
        userId: existingUser.id 
      }), {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200
      })
    }

    // Create new admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        user_type: 'admin'
      }
    })

    if (error) throw error

    // Create profile with admin role using RPC instead of direct table access
    const { error: profileError } = await supabase.rpc(
      'create_user_profile',
      {
        user_id: data.user?.id,
        full_name: fullName,
        user_type: 'admin',
        mark_completed: true
      }
    )

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
    console.error('Error creating/updating admin user:', error)
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
