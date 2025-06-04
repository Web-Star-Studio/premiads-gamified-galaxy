import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS for preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    const { purchase_id, new_status } = await req.json()

    if (!purchase_id || !new_status) {
      return new Response(
        JSON.stringify({ error: 'Missing purchase_id or new_status' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update purchase status
    const { data: purchase, error: updateError } = await supabase
      .from('rifa_purchases')
      .update({ status: new_status })
      .eq('id', purchase_id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating purchase status:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update purchase status', details: updateError }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // If confirmed, add rifas to user balance
    if (new_status === 'confirmed') {
      const { error: addRifasError } = await supabase.rpc('add_user_rifas', {
        user_id: purchase.user_id,
        amount: purchase.total_rifas
      })

      if (addRifasError) {
        console.error('Error adding rifas to user:', addRifasError)
        return new Response(
          JSON.stringify({ error: 'Failed to add rifas to user', details: addRifasError }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        purchase,
        message: `Purchase status updated to ${new_status}`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unhandled error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 