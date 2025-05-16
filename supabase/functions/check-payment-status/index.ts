import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { supabaseConfig, stripeConfig, corsHeaders } from '../_shared/config.ts'
import Stripe from 'https://esm.sh/stripe@12.17.0'

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
    
    // Initialize Stripe
    const stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: stripeConfig.apiVersion,
    })
    
    // Check for authentication
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
    
    // Parse request body
    const body = await req.json()
    const { session_id } = body
    
    if (!session_id) {
      return new Response(
        JSON.stringify({ error: 'ID de sessão não fornecido' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    console.log(`Checking payment status for session: ${session_id}`)
    
    try {
      // Check if this is a checkout session
      if (session_id.startsWith('cs_')) {
        // Retrieve the checkout session
        const session = await stripe.checkout.sessions.retrieve(session_id)
        
        console.log(`Session status: ${session.payment_status}`)
        
        // Get purchase ID from metadata
        const purchaseId = session.metadata?.purchase_id
        
        if (!purchaseId) {
          console.warn(`No purchase_id found in session metadata for ${session_id}`)
        } else {
          // Ensure the purchase is associated with the authenticated user
          const { data: purchase, error: purchaseError } = await supabase
            .from('credit_purchases')
            .select('user_id, status')
            .eq('id', purchaseId)
            .single()
          
          if (purchaseError || !purchase) {
            console.error(`Purchase not found for ID ${purchaseId}:`, purchaseError)
          } else if (purchase.user_id !== user.id) {
            return new Response(
              JSON.stringify({ error: 'Não autorizado. Usuário não corresponde à compra.' }),
              { 
                status: 403, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }
          
          // If the purchase is already confirmed, no need to update
          if (purchase.status === 'confirmed') {
            return new Response(
              JSON.stringify({ 
                status: session.payment_status,
                purchase_status: purchase.status,
                purchase_id: purchaseId,
                session_id
              }),
              { 
                status: 200, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }
          
          // If payment is complete but purchase is still pending, update it
          if (session.payment_status === 'paid' && purchase.status === 'pending') {
            console.log(`Updating purchase ${purchaseId} status to confirmed`)
            
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
              console.error(`Failed to update purchase ${purchaseId}:`, updateError)
              return new Response(
                JSON.stringify({ 
                  error: `Failed to update purchase: ${updateError.message}`,
                  status: session.payment_status,
                  purchase_id: purchaseId,
                  session_id
                }),
                { 
                  status: 500, 
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
                }
              )
            }
            
            // Get purchase details for credit increment
            const { data: purchaseDetails, error: detailsError } = await supabase
              .from('credit_purchases')
              .select('*')
              .eq('id', purchaseId)
              .single()
            
            if (detailsError || !purchaseDetails) {
              console.error(`Failed to get purchase details for ${purchaseId}:`, detailsError)
            } else {
              // Add credits to user's account
              const { error: creditError } = await supabase.rpc(
                'increment_user_credits',
                { 
                  user_id: purchaseDetails.user_id, 
                  credits_to_add: purchaseDetails.total_credits 
                }
              )
              
              if (creditError) {
                console.error(`Failed to add credits to user ${purchaseDetails.user_id}:`, creditError)
              } else {
                // Add to activity log
                try {
                  await supabase
                    .from('activity_log')
                    .insert({
                      user_id: purchaseDetails.user_id,
                      action: 'credit_purchase',
                      details: {
                        credits: purchaseDetails.total_credits,
                        price: purchaseDetails.price,
                        payment_method: purchaseDetails.payment_method
                      }
                    })
                } catch (logError) {
                  console.warn('Could not add to activity log:', logError)
                }
              }
            }
          }
        }
        
        return new Response(
          JSON.stringify({ 
            status: session.payment_status,
            purchase_id: purchaseId,
            session_id
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      } 
      // Check if this is a payment intent
      else if (session_id.startsWith('pi_')) {
        const paymentIntent = await stripe.paymentIntents.retrieve(session_id)
        
        console.log(`Payment intent status: ${paymentIntent.status}`)
        
        return new Response(
          JSON.stringify({ 
            status: paymentIntent.status,
            session_id
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      } 
      // Unknown ID format
      else {
        return new Response(
          JSON.stringify({ error: 'Formato de ID desconhecido' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    } catch (stripeError) {
      console.error('Stripe error:', stripeError)
      return new Response(
        JSON.stringify({ error: `Erro ao verificar pagamento: ${stripeError.message}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
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