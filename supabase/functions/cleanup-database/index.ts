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

    // Only admin can run this function
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Authentication required')
    }
    
    // Check if user is admin
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single()
      
    if (profileError) throw profileError
    
    if (profileData?.user_type !== 'admin') {
      throw new Error('Admin privileges required')
    }
    
    // Clear test data from tables
    await supabase.from('submissions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // Delete the mission_submissions table if it exists (we'll use submissions instead)
    await supabase.rpc('drop_table_if_exists', { table_name: 'mission_submissions' })
    
    await supabase.from('missions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // Remove test users (but keep admins)
    const { data: testUsers, error: testUsersError } = await supabase
      .from('profiles')
      .select('id, user_type')
      .neq('user_type', 'admin')
      
    if (testUsersError) throw testUsersError
    
    for (const testUser of testUsers || []) {
      await supabase.auth.admin.deleteUser(testUser.id)
    }

    return new Response(JSON.stringify({ 
      message: 'Database cleaned up successfully',
      removedUsers: testUsers?.length || 0
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
      status: 200
    })
  } catch (error) {
    console.error('Error cleaning up database:', error)
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
