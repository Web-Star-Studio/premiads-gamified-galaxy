import { serve } from 'https://deno.land/std@0.201.0/http/server.ts'
import Stripe from 'npm:stripe'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

const supabase = createClient(supabaseUrl, supabaseKey)
const stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' })

serve(async (req) => {
  const buf = await req.arrayBuffer()
  const sig = req.headers.get('stripe-signature')!
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature error', err)
    return new Response('Invalid signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const purchaseId = session.metadata?.rifa_purchase_id
    if (purchaseId) {
      const { error } = await supabase.rpc('confirm_rifa_purchase', { p_purchase_id: purchaseId })
      if (error) console.error('RPC error:', error)
    }
  }

  return new Response('OK', { status: 200 })
}) 