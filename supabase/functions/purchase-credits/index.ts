// @ts-nocheck
console.log('STARTING purchase-credits function v3') // Canary log

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import Stripe from 'npm:stripe@15.12.0' // Using modern npm specifier for better compatibility

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

// Removed Zod schema validation in favor of more flexible manual validation

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
    
    // IMPROVED VALIDATION - more flexible and with better error handling
    const { userId, packageId, customAmount, customPrice, paymentProvider, paymentMethod } = body
    
    console.log('Raw body data:', { userId, packageId, customAmount, paymentProvider, paymentMethod })
    
    // Validate required fields with better error messages
    if (!userId || typeof userId !== 'string') {
      console.error('Invalid userId:', userId)
      return new Response(
        JSON.stringify({ error: 'userId é obrigatório e deve ser uma string válida' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!paymentProvider || !['mercado_pago', 'stripe'].includes(paymentProvider)) {
      console.error('Invalid paymentProvider:', paymentProvider)
      return new Response(
        JSON.stringify({ 
          error: 'paymentProvider deve ser "mercado_pago" ou "stripe"',
          received: paymentProvider,
          valid_options: ['mercado_pago', 'stripe']
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!paymentMethod || !['pix', 'credit_card', 'boleto', 'debit'].includes(paymentMethod)) {
      console.error('Invalid paymentMethod:', paymentMethod)
      return new Response(
        JSON.stringify({ 
          error: 'paymentMethod deve ser um dos valores válidos',
          received: paymentMethod,
          valid_options: ['pix', 'credit_card', 'boleto', 'debit']
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!packageId && !customAmount) {
      console.error('Missing packageId and customAmount')
      return new Response(
        JSON.stringify({ error: 'packageId ou customAmount deve ser fornecido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    console.log('Validation passed, proceeding with purchase...')

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
      paymentData = await handleMercadoPagoPayment(req, purchase, packageData, supabase)
    } else if (paymentProvider === 'stripe') {
      paymentData = await handleStripePayment(req, purchase, packageData, supabase)
    } else {
      return new Response(
        JSON.stringify({ error: `Provedor de pagamento não suportado: ${paymentProvider}` }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check for errors returned from handlers
    if (paymentData.error) {
      return new Response(
        JSON.stringify({
          error: paymentData.error,
          details: paymentData.details,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
    console.error('Unhandled error in purchase-credits function:', error)
    return new Response(
      JSON.stringify({
        error: 'Erro interno do servidor',
        details: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

// --- HELPER FUNCTIONS ---

async function handleMercadoPagoPayment(req, purchase, packageData, supabase) {
  console.log('Processing Mercado Pago payment...')
  const mpAccessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
  const origin = req.headers.get('origin') || 'https://premiads.com'

  // Usar URL de produção para callback em desenvolvimento
  const successUrl = origin.includes('localhost') || origin.includes('192.168')
    ? 'https://premiads.com/anunciante/pagamento-sucesso'
    : `${origin}/anunciante/pagamento-sucesso`

  if (!mpAccessToken) {
    console.warn('MERCADO_PAGO_ACCESS_TOKEN não configurado, usando fallback mock.')
    return {
      payment_id: `mp-dev-${Date.now()}`,
      payment_url: `${req.headers.get('origin') || 'https://premiads.com'}/anunciante/pagamento-mock?purchase_id=${purchase.id}`,
    }
  }

  try {
    const preferenceData = {
      items: [{
        id: purchase.id,
        title: `${packageData.rifas_amount} rifas + ${packageData.bonus} bônus`,
        description: `Pacote de rifas para campanha publicitária`,
        quantity: 1,
        currency_id: 'BRL',
        unit_price: Number(packageData.price.toFixed(2)),
      }],
      payer: {
        email: 'test_user_123456@testuser.com', // E-mail de teste obrigatório
      },
      back_urls: {
        success: successUrl,
        failure: `${origin}/anunciante/creditos?error=mp_payment_failed`,
        pending: `${origin}/anunciante/creditos?status=mp_pending`,
      },
      external_reference: purchase.id,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercado-pago-webhook`,
      statement_descriptor: 'PREMIADS',
    }

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mpAccessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': purchase.id,
      },
      body: JSON.stringify(preferenceData),
    })

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text()
      logError('Mercado Pago API error:', new Error(`API Error ${mpResponse.status}: ${errorText}`))
      throw new Error(`API Error ${mpResponse.status}: ${errorText}`)
    }

    const mpResult = await mpResponse.json()
    console.log('Mercado Pago preference created:', mpResult.id)

    return {
      payment_id: mpResult.id,
      payment_url: mpResult.init_point,
    }
  } catch (mpError) {
    logError('Mercado Pago integration error:', mpError)
    await supabase
      .from('rifa_purchases')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', purchase.id)
    return {
      error: 'Erro na integração com Mercado Pago',
      details: mpError.message,
    }
  }
}

async function handleStripePayment(req, purchase, packageData, supabase) {
  console.log('Processing Stripe payment...')
  try {
    const stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: stripeConfig.apiVersion,
    })

    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', purchase.user_id)
      .single()

    if (userError || !userProfile) throw new Error('User profile not found')

    let customerId
    const { data: existingCustomer } = await supabase
      .from('stripe_customers')
      .select('stripe_id')
      .eq('user_id', purchase.user_id)
      .maybeSingle()

    if (existingCustomer?.stripe_id) {
      customerId = existingCustomer.stripe_id
    } else {
      const customer = await stripe.customers.create({
        email: userProfile.email,
        name: userProfile.full_name,
        metadata: { user_id: purchase.user_id },
      })
      await supabase
        .from('stripe_customers')
        .insert({ user_id: purchase.user_id, stripe_id: customer.id })
      customerId = customer.id
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: {
            name: `${packageData.rifas_amount} rifas + ${packageData.bonus} bônus`,
          },
          unit_amount: Math.round(packageData.price * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.get('origin') || ''}/anunciante/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin') || ''}/anunciante/creditos`,
      metadata: { purchase_id: purchase.id },
    })

    return {
      payment_id: session.id,
      payment_url: session.url,
    }
  } catch (stripeError) {
    console.error('Stripe error:', stripeError)
    await supabase
      .from('rifa_purchases')
      .update({ status: 'failed' })
      .eq('id', purchase.id)
    return {
      error: 'Erro ao processar pagamento com Stripe',
      details: stripeError.message,
    }
  }
}

// Adicionando uma função de log para facilitar a depuração
function logError(message, error) {
  console.error(message, {
    errorMessage: error.message,
    errorStack: error.stack,
    errorCause: error.cause,
  });
} 