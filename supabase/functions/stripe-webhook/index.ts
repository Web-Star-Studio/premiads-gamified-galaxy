import { serve } from 'https://deno.land/std@0.201.0/http/server.ts'
import Stripe from 'npm:stripe'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

const supabase = createClient(supabaseUrl, supabaseKey)
const stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' })

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
    const buf = await req.arrayBuffer()
    const sig = req.headers.get('stripe-signature')!
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
    } catch (err) {
      console.error('Webhook signature error', err)
      return new Response('Invalid signature', { status: 400, headers: corsHeaders })
    }

    console.log('Received Stripe event:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Session metadata:', session.metadata)
      
      // Try both metadata fields for compatibility
      const purchaseId = session.metadata?.rifa_purchase_id || session.metadata?.purchase_id
      
      if (purchaseId) {
        console.log('Confirming purchase:', purchaseId)
        
        const { error } = await supabase.rpc('confirm_rifa_purchase', { 
          p_purchase_id: purchaseId 
        })
        
        if (error) {
          console.error('RPC error:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to confirm purchase', details: error }), 
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        
        console.log('Purchase confirmed successfully:', purchaseId)
      } else {
        console.warn('No purchase_id found in session metadata')
      }
    }

    return new Response('OK', { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 