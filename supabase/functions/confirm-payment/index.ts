import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { corsHeaders } from '../_shared/cors.ts'
import { z } from 'https://esm.sh/zod@3.23.8'

// Define schema for payment confirmation
const confirmationSchema = z.object({
  purchase_id: z.string().uuid(),
  payment_id: z.string(),
  status: z.enum(['confirmed', 'failed']),
  provider: z.enum(['mercado_pago', 'stripe']),
})

serve(async (req) => {
  // Handle CORS for preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Parse request body
    const body = await req.json()
    const parseResult = confirmationSchema.safeParse(body)
    
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Dados inválidos', 
          details: parseResult.error.format() 
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    const { purchase_id, payment_id, status, provider } = parseResult.data
    
    // Get purchase details
    const { data: purchase, error: purchaseError } = await supabase
      .from('credit_purchases')
      .select('*')
      .eq('id', purchase_id)
      .eq('payment_id', payment_id)
      .single()
    
    if (purchaseError || !purchase) {
      return new Response(
        JSON.stringify({ error: 'Compra não encontrada' }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Verify that the purchase is in pending status
    if (purchase.status !== 'pending') {
      return new Response(
        JSON.stringify({ error: 'Status da compra não permite confirmação' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Update purchase status
    const { error: updateError } = await supabase
      .from('credit_purchases')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', purchase_id)
    
    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Erro ao atualizar status da compra' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // If payment confirmed, add credits to user's account
    if (status === 'confirmed') {
      // Calculate total credits
      const totalCredits = purchase.total_credits
      
      // Call RPC function to increment user credits
      const { error: creditError } = await supabase.rpc(
        'increment_user_credits',
        { 
          user_id: purchase.user_id, 
          credits_to_add: totalCredits 
        }
      )
      
      if (creditError) {
        console.error('Error incrementing credits:', creditError)
        return new Response(
          JSON.stringify({ error: 'Erro ao adicionar créditos' }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      // Add to activity log (if such a table exists)
      try {
        await supabase
          .from('activity_log')
          .insert({
            user_id: purchase.user_id,
            action: 'credit_purchase',
            details: {
              credits: totalCredits,
              price: purchase.price,
              payment_method: purchase.payment_method
            }
          })
      } catch (error) {
        // Non-critical error, just log it
        console.warn('Could not add to activity log:', error)
      }
    }
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        status,
        purchase_id,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
    
  } catch (error) {
    console.error('Unhandled error:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 