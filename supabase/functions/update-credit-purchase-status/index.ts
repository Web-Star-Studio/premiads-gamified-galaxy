import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { supabaseConfig, corsHeaders } from '../_shared/config.ts'

serve(async (req) => {
  // Make sure to handle OPTIONS for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }

  try {
    console.log("update-credit-purchase-status function called")
    
    const supabase = createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey)
    
    // Parse and validate request
    const body = await req.json()
    const { purchase_id, new_status } = body
    
    console.log("Request body:", { purchase_id, new_status })

    if (!purchase_id || !['confirmed', 'failed'].includes(new_status)) {
      console.log("Invalid input data")
      return new Response(JSON.stringify({ 
        error: 'Dados inválidos',
        success: false
      }), { 
        status: 400, 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }

    // Only update if still pending
    const { data: purchase, error } = await supabase
      .from('credit_purchases')
      .select('*')
      .eq('id', purchase_id)
      .eq('status', 'pending')
      .single()

    // If no pending purchase found, treat as already processed (idempotent)
    if (error || !purchase) {
      console.log("No pending purchase found (already processed). Returning success.", error)
      return new Response(JSON.stringify({
        success: true,
        purchase_id,
        message: 'Compra já processada'
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }
    
    console.log("Found purchase, current status:", purchase.status)

    // Update status
    const { error: updateError } = await supabase
      .from('credit_purchases')
      .update({ status: new_status, updated_at: new Date().toISOString() })
      .eq('id', purchase_id)
    
    if (updateError) {
      console.log("Error updating purchase:", updateError)
      return new Response(JSON.stringify({ 
        error: 'Error updating purchase status', 
        success: false,
        details: updateError
      }), { 
        status: 500, 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }
    
    console.log("Updated purchase status to:", new_status)

    // If confirmed, increment credits
    if (new_status === 'confirmed') {
      console.log(`Adding ${purchase.total_credits} credits to user ${purchase.user_id}`)
      
      const { error: creditError } = await supabase.rpc('increment_user_credits', {
        user_id: purchase.user_id,
        credits_to_add: purchase.total_credits
      })
      
      if (creditError) {
        console.log("Error incrementing credits:", creditError)
        return new Response(JSON.stringify({ 
          error: 'Error incrementing credits', 
          success: false,
          details: creditError
        }), { 
          status: 500, 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        })
      }
      
      // Log activity
      try {
        console.log("Logging activity")
        await supabase.from('activity_log').insert({
          user_id: purchase.user_id,
          action: 'credit_purchase',
          details: {
            credits: purchase.total_credits,
            price: purchase.price,
            payment_method: purchase.payment_provider
          }
        })
      } catch (logError) {
        console.log("Error logging activity:", logError)
      }
    }
    
    console.log("Operation completed successfully")

    return new Response(JSON.stringify({ 
      success: true,
      purchase_id,
      new_status,
      message: 'Status updated successfully' 
    }), { 
      status: 200, 
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  } catch (err) {
    console.error("Unhandled error:", err)
    return new Response(JSON.stringify({ 
      error: err.message,
      success: false 
    }), { 
      status: 500, 
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
}) 