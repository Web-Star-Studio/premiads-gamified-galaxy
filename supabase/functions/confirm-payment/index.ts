import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { supabaseConfig, stripeConfig, corsHeaders } from '../_shared/config.ts'
import Stripe from 'https://esm.sh/stripe@12.17.0'

// Define validation for request body
const validateRequest = (body: any) => {
  const requiredFields = ['purchase_id', 'payment_id', 'status', 'provider']
  const missingFields = requiredFields.filter(field => !body[field])
  
  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`
    }
  }
  
  if (!['confirmed', 'failed'].includes(body.status)) {
    return {
      valid: false,
      error: 'Status deve ser "confirmed" ou "failed"'
    }
  }
  
  if (!['stripe', 'mercado_pago'].includes(body.provider)) {
    return {
      valid: false,
      error: 'Provedor deve ser "stripe" ou "mercado_pago"'
    }
  }
  
  return { valid: true }
}

serve(async (req) => {
  // Handle CORS for preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Create Supabase client
    const supabase = createClient(
      supabaseConfig.url,
      supabaseConfig.serviceRoleKey
    )
    
    // Initialize Stripe for webhook verification
    const stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: stripeConfig.apiVersion,
    })
    
    // Check if this is a Stripe webhook
    const signature = req.headers.get('stripe-signature')
    
    if (signature) {
      // This is a Stripe webhook
      const webhookSecret = stripeConfig.webhookSecret
      const body = await req.text()
      
      try {
        const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        
        // Handle different event types
        if (event.type === 'checkout.session.completed') {
          const session = event.data.object
          
          // Get purchase ID from metadata
          const purchaseId = session.metadata?.purchase_id
          
          if (!purchaseId) {
            throw new Error('Purchase ID not found in session metadata')
          }
          
          // Update purchase status
          const { error: updateError } = await supabase
            .from('credit_purchases')
            .update({
              status: 'confirmed',
              updated_at: new Date().toISOString()
            })
            .eq('id', purchaseId)
            .eq('status', 'pending')
          
          if (updateError) {
            throw new Error(`Failed to update purchase: ${updateError.message}`)
          }
          
          // Get purchase details
          const { data: purchase, error: purchaseError } = await supabase
            .from('credit_purchases')
            .select('*')
            .eq('id', purchaseId)
            .single()
          
          if (purchaseError || !purchase) {
            throw new Error('Purchase not found')
          }
          
          // Add credits to user's account
          const { error: creditError } = await supabase.rpc(
            'increment_user_credits',
            { 
              user_id: purchase.user_id, 
              credits_to_add: purchase.total_credits 
            }
          )
          
          if (creditError) {
            throw new Error(`Failed to add credits: ${creditError.message}`)
          }
          
          // Add to activity log
          try {
            await supabase
              .from('activity_log')
              .insert({
                user_id: purchase.user_id,
                action: 'credit_purchase',
                details: {
                  credits: purchase.total_credits,
                  price: purchase.price,
                  payment_method: purchase.payment_method
                }
              })
          } catch (logError) {
            console.warn('Could not add to activity log:', logError)
          }
        } else if (event.type === 'payment_intent.payment_failed') {
          const paymentIntent = event.data.object
          
          // Get purchase ID from metadata
          const purchaseId = paymentIntent.metadata?.purchase_id
          
          if (purchaseId) {
            // Update purchase status
            await supabase
              .from('credit_purchases')
              .update({
                status: 'failed',
                updated_at: new Date().toISOString()
              })
              .eq('id', purchaseId)
              .eq('status', 'pending')
          }
        }
        
        // Return success response for webhook
        return new Response(JSON.stringify({ received: true }), { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
        
      } catch (webhookError) {
        console.error('Webhook error:', webhookError)
        return new Response(
          JSON.stringify({ error: `Webhook Error: ${webhookError.message}` }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }
    
    // If not a webhook, verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado. Token de autenticação ausente.' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Verify JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token de autenticação inválido', details: authError?.message }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // If not a webhook, handle manual confirmation
    const body = await req.json()
    const validation = validateRequest(body)
    
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    const { purchase_id, payment_id, status, provider } = body
    
    // Verify the purchase exists and is pending
    const { data: purchase, error: purchaseError } = await supabase
      .from('credit_purchases')
      .select('*')
      .eq('id', purchase_id)
      .eq('payment_provider', provider)
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
    
    // Ensure the authenticated user matches the purchase user_id
    if (user.id !== purchase.user_id) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado. Usuário não corresponde à compra.' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    if (purchase.status !== 'pending') {
      return new Response(
        JSON.stringify({ error: `Compra já está com status ${purchase.status}` }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // For Stripe, verify the payment with the API
    if (provider === 'stripe') {
      try {
        // Check if this is a checkout session or payment intent
        if (payment_id.startsWith('cs_')) {
          const session = await stripe.checkout.sessions.retrieve(payment_id)
          
          if (session.payment_status !== 'paid') {
            return new Response(
              JSON.stringify({ error: 'Pagamento não confirmado no Stripe' }), 
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }
        } else if (payment_id.startsWith('pi_')) {
          const paymentIntent = await stripe.paymentIntents.retrieve(payment_id)
          
          if (paymentIntent.status !== 'succeeded') {
            return new Response(
              JSON.stringify({ error: 'Pagamento não confirmado no Stripe' }), 
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }
        }
      } catch (stripeError) {
        console.error('Stripe verification error:', stripeError)
        return new Response(
          JSON.stringify({ error: 'Erro ao verificar pagamento no Stripe' }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
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
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 