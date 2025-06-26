// @ts-nocheck
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { z } from 'https://esm.sh/zod@3.23.8'
import Stripe from 'https://esm.sh/stripe@12.17.0'

// CORS headers inline to avoid import issues
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configuration inline to avoid import issues
const supabaseConfig = {
  url: Deno.env.get('SUPABASE_URL') || '',
  serviceRoleKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
  anonKey: Deno.env.get('SUPABASE_ANON_KEY') || '',
}

const stripeConfig = {
  secretKey: Deno.env.get('STRIPE_SECRET_KEY') || '',
  webhookSecret: Deno.env.get('STRIPE_WEBHOOK_SECRET') || '',
  apiVersion: '2023-10-16' as const,
}

// Define schema for purchase request
const purchaseSchema = z.object({
  userId: z.string().uuid(),
  packageId: z.string().uuid().optional(),
  customAmount: z.number().min(500).max(10000).optional(),
  customPrice: z.number().optional(),
  paymentProvider: z.enum(['mercado_pago', 'stripe']),
  paymentMethod: z.enum(['pix', 'credit_card', 'boleto', 'debit']),
})

// Ensure at least one of packageId or customAmount is provided
const purchaseRequestSchema = purchaseSchema.refine(
  data => data.packageId !== undefined || data.customAmount !== undefined,
  { message: 'Either packageId or customAmount must be provided' }
)

serve(async (req) => {
  console.log('Purchase credits function called:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  })

  // Handle CORS for preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request')
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    console.log('Starting purchase process...')

    // Validate environment variables
    if (!supabaseConfig.url || !supabaseConfig.serviceRoleKey) {
      console.error('Missing Supabase configuration')
      return new Response(
        JSON.stringify({ error: 'Configuração do servidor incompleta' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!stripeConfig.secretKey) {
      console.error('Missing Stripe configuration')
      return new Response(
        JSON.stringify({ error: 'Configuração do Stripe incompleta' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client
    const supabase = createClient(
      supabaseConfig.url,
      supabaseConfig.serviceRoleKey
    )
    
    console.log('Supabase client created')

    // Check for authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.log('No authorization header')
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
    console.log('Verifying JWT token...')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Token de autenticação inválido', details: authError?.message }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    console.log('User authenticated:', user.id)

    // Initialize Stripe
    console.log('Initializing Stripe...')
    const stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: stripeConfig.apiVersion,
    })
    
    // Parse request body
    let body
    try {
      body = await req.json()
      console.log('Request body parsed:', body)
    } catch (err) {
      console.error('JSON parse error:', err)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON', details: err.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const parseResult = purchaseRequestSchema.safeParse(body)
    
    if (!parseResult.success) {
      console.error('Validation error:', parseResult.error)
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
    
    const { userId, packageId, customAmount, customPrice, paymentProvider, paymentMethod } = parseResult.data
    
    console.log('Parsed data:', { userId, packageId, customAmount, paymentProvider, paymentMethod })

    // Ensure the authenticated user matches the requested userId
    if (user.id !== userId) {
      console.error('User ID mismatch:', { authUserId: user.id, requestUserId: userId })
      return new Response(
        JSON.stringify({ error: 'Não autorizado. ID de usuário não corresponde ao token.' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Fetch package or calculate custom package
    let packageData
    
    if (packageId) {
      console.log('Fetching package:', packageId)
      // Fetch existing rifa package
      const { data: pkg, error: pkgError } = await supabase
        .from('rifa_packages')
        .select('*')
        .eq('id', packageId)
        .eq('active', true)
        .single()
      
      if (pkgError || !pkg) {
        console.error('Package fetch error:', pkgError)
        return new Response(
          JSON.stringify({ error: 'Pacote não encontrado ou inativo', details: pkgError }), 
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      packageData = {
        id: pkg.id,
        rifas_amount: pkg.rifas_amount,
        bonus: pkg.rifas_bonus,
        price: pkg.price,
        validity_months: pkg.validity_months,
      }
      
      console.log('Package data:', packageData)
    } else if (customAmount) {
      console.log('Calculating custom package for amount:', customAmount)
      // Calculate custom package
      const { data: packages, error: pkgsError } = await supabase
        .from('rifa_packages')
        .select('*')
        .eq('active', true)
        .order('rifas_amount', { ascending: true })
      
      if (pkgsError || !packages || packages.length === 0) {
        console.error('Packages fetch error:', pkgsError)
        return new Response(
          JSON.stringify({ error: 'Erro ao calcular pacote personalizado', details: pkgsError }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      // Find the appropriate bonus tier
      let bonus = 0
      for (const pkg of packages) {
        if (customAmount >= pkg.rifas_amount) {
          // Calculate bonus percentage
          const bonusPercentage = pkg.rifas_bonus / pkg.rifas_amount
          bonus = Math.floor(customAmount * bonusPercentage)
        }
      }
      
      // Calculate price based on amount (100 rifas = R$5.00)
      const price = customPrice || (customAmount * 0.05)
      
      packageData = {
        id: null,
        rifas_amount: customAmount,
        bonus,
        price,
        validity_months: 12,
      }
      
      console.log('Custom package data:', packageData)
    } else {
      return new Response(
        JSON.stringify({ error: 'Pacote ou quantidade personalizada não especificada' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    console.log('Creating purchase record...')
    // Create purchase record (pending)
    const { data: purchase, error: purchaseError } = await supabase
      .from('rifa_purchases')
      .insert({
        user_id: userId,
        rifa_package_id: packageData.id,
        base: packageData.rifas_amount,
        bonus: packageData.bonus,
        total_rifas: packageData.rifas_amount + packageData.bonus,
        price: packageData.price,
        status: 'pending',
        payment_method: paymentMethod,
        payment_provider: paymentProvider,
      })
      .select()
      .single()
    
    if (purchaseError) {
      console.error('Error creating purchase record:', purchaseError)
      return new Response(
        JSON.stringify({ error: 'Erro ao registrar compra', details: purchaseError }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    console.log('Purchase record created:', purchase.id)

    // Handle payment based on provider
    let paymentData
    
    if (paymentProvider === 'mercado_pago') {
      console.log('Processing Mercado Pago payment...')
      // Simulated Mercado Pago integration
      paymentData = {
        payment_id: `mp-${Date.now()}`,
        payment_url: `https://mercadopago.com/checkout/${purchase.id}`,
        qr_code: paymentMethod === 'pix' ? 'data:image/png;base64,mockQrCode' : null,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      }
    } else if (paymentProvider === 'stripe') {
      console.log('Processing Stripe payment...')
      try {
        // Get user information for Stripe customer
        const { data: userProfile, error: userError } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', userId)
          .single()
          
        if (userError || !userProfile) {
          console.error('User profile error:', userError)
          throw new Error('User profile not found')
        }
        
        console.log('User profile found:', userProfile.email)

        // Create or retrieve Stripe customer
        const { data: customers, error: customerError } = await supabase
          .from('stripe_customers')
          .select('stripe_id')
          .eq('user_id', userId)
          .maybeSingle()
          
        let customerId
        
        if (customerError) {
          console.error('Error fetching customer:', customerError)
        }
        
        if (!customers?.stripe_id) {
          console.log('Creating new Stripe customer...')
          // Create new customer
          const customer = await stripe.customers.create({
            email: userProfile.email,
            name: userProfile.full_name,
            metadata: {
              user_id: userId
            }
          })
          
          // Store customer ID
          await supabase
            .from('stripe_customers')
            .insert({
              user_id: userId,
              stripe_id: customer.id
            })
            
          customerId = customer.id
          console.log('New Stripe customer created:', customerId)
        } else {
          customerId = customers.stripe_id
          console.log('Existing Stripe customer found:', customerId)
        }
        
        // Create payment session based on payment method
        if (paymentMethod === 'credit_card' || paymentMethod === 'debit') {
          console.log('Creating Stripe checkout session...')
          // Create Stripe Checkout session
          const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: [paymentMethod === 'credit_card' ? 'card' : 'card'],
            line_items: [
              {
                price_data: {
                  currency: 'brl',
                  product_data: {
                    name: `${packageData.rifas_amount} rifas + ${packageData.bonus} bônus`,
                    description: 'Rifas para sua conta PremiAds',
                  },
                  unit_amount: Math.round(packageData.price * 100), // Stripe uses cents
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: `${req.headers.get('origin') || 'https://premiads.com'}/anunciante/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin') || 'https://premiads.com'}/anunciante/creditos`,
            metadata: {
              purchase_id: purchase.id,
              rifa_purchase_id: purchase.id,
            },
          })
          
          paymentData = {
            payment_id: session.id,
            payment_url: session.url,
            session_id: session.id,
            expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
          }
          
          console.log('Checkout session created:', session.id)
        } else if (paymentMethod === 'pix') {
          console.log('Creating PIX payment intent...')
          // Create a PaymentIntent for PIX
          const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(packageData.price * 100),
            currency: 'brl',
            payment_method_types: ['pix'],
            customer: customerId,
            metadata: {
              purchase_id: purchase.id,
              rifa_purchase_id: purchase.id,
            },
          })
          
          // Get PIX details
          const pixDetails = paymentIntent.next_action?.display_bank_transfer_instructions
          
          paymentData = {
            payment_id: paymentIntent.id,
            payment_url: null,
            pix_qr_code: pixDetails?.hosted_instructions_url || null,
            pix_code: pixDetails?.financial_address || null,
            expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
          }
          
          console.log('PIX payment intent created:', paymentIntent.id)
        } else {
          throw new Error(`Payment method ${paymentMethod} not supported for Stripe`)
        }
      } catch (stripeError) {
        console.error('Stripe error:', stripeError)
        
        // Update purchase status to failed
        await supabase
          .from('rifa_purchases')
          .update({ status: 'failed' })
          .eq('id', purchase.id)
          
        return new Response(
          JSON.stringify({ 
            error: 'Erro ao processar pagamento com Stripe',
            details: stripeError.message
          }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    } else {
      return new Response(
        JSON.stringify({ error: `Provedor de pagamento não suportado: ${paymentProvider}` }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    console.log('Updating purchase with payment ID...')
    // Update purchase with payment ID
    await supabase
      .from('rifa_purchases')
      .update({ payment_id: paymentData.payment_id })
      .eq('id', purchase.id)
    
    console.log('Purchase process completed successfully')
    // Return payment info
    return new Response(
      JSON.stringify({
        success: true,
        purchase_id: purchase.id,
        payment: paymentData,
        package: {
          base: packageData.rifas_amount,
          bonus: packageData.bonus,
          total: packageData.rifas_amount + packageData.bonus,
          price: packageData.price,
        }
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