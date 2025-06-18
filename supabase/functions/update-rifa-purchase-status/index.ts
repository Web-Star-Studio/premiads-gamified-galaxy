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

    console.log(`Processing purchase ${purchase_id} with status ${new_status}`)

    // Check if purchase exists and current status
    const { data: currentPurchase, error: fetchError } = await supabase
      .from('rifa_purchases')
      .select('*')
      .eq('id', purchase_id)
      .single()

    if (fetchError || !currentPurchase) {
      console.error('Error fetching purchase:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Purchase not found', details: fetchError }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Current purchase data:', currentPurchase)

    // If already confirmed, don't process again
    if (currentPurchase.status === 'confirmed' && new_status === 'confirmed') {
      return new Response(
        JSON.stringify({ 
          success: true,
          purchase: currentPurchase,
          message: 'Purchase already confirmed'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // If confirming, update both purchase and user profile
    if (new_status === 'confirmed') {
      console.log('Confirming purchase and updating user rifas')
      
      // Use transaction to ensure atomicity
      const { error: transactionError } = await supabase.rpc('sql', {
        query: `
          BEGIN;
          
          -- Update purchase status
          UPDATE rifa_purchases 
          SET status = 'confirmed',
              confirmed_at = COALESCE(confirmed_at, NOW()),
              updated_at = NOW()
          WHERE id = $1 AND status <> 'confirmed';
          
          -- Update user rifas
          UPDATE profiles 
          SET rifas = COALESCE(rifas, 0) + (
            SELECT total_rifas 
            FROM rifa_purchases 
            WHERE id = $1
          ),
          updated_at = NOW()
          WHERE id = (
            SELECT user_id 
            FROM rifa_purchases 
            WHERE id = $1
          );
          
          COMMIT;
        `,
        params: [purchase_id]
      })

      if (transactionError) {
        console.error('Transaction error:', transactionError)
        
        // Fallback: try step by step
        console.log('Trying fallback approach...')
        
        // First update the purchase
        const { error: updatePurchaseError } = await supabase
          .from('rifa_purchases')
          .update({ 
            status: 'confirmed',
            confirmed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', purchase_id)
          .eq('status', 'pending')

        if (updatePurchaseError) {
          console.error('Error updating purchase:', updatePurchaseError)
        } else {
          console.log('Purchase status updated successfully')
        }

        // Then update the user's rifas
        const { data: userProfile, error: profileFetchError } = await supabase
          .from('profiles')
          .select('rifas')
          .eq('id', currentPurchase.user_id)
          .single()

        if (profileFetchError) {
          console.error('Error fetching user profile:', profileFetchError)
        } else {
          const currentRifas = userProfile?.rifas || 0
          const newRifas = currentRifas + currentPurchase.total_rifas
          
          console.log(`Updating user rifas: ${currentRifas} + ${currentPurchase.total_rifas} = ${newRifas}`)
          
          const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({ 
              rifas: newRifas,
              updated_at: new Date().toISOString()
            })
            .eq('id', currentPurchase.user_id)

          if (updateProfileError) {
            console.error('Error updating user rifas:', updateProfileError)
          } else {
            console.log('User rifas updated successfully')
          }
        }
      } else {
        console.log('Transaction completed successfully')
      }
    } else {
      // For other status updates, just update the status
      const { error: updateError } = await supabase
        .from('rifa_purchases')
        .update({ 
          status: new_status,
          updated_at: new Date().toISOString()
        })
        .eq('id', purchase_id)

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
    }

    // Fetch updated purchase data
    const { data: updatedPurchase } = await supabase
      .from('rifa_purchases')
      .select('*')
      .eq('id', purchase_id)
      .single()

    // Fetch updated user profile
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('rifas')
      .eq('id', currentPurchase.user_id)
      .single()

    console.log('Final purchase data:', updatedPurchase)
    console.log('Final user rifas:', updatedProfile?.rifas)

    return new Response(
      JSON.stringify({ 
        success: true,
        purchase: updatedPurchase,
        user_rifas: updatedProfile?.rifas,
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