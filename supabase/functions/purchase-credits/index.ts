// @ts-nocheck
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { supabaseConfig, stripeConfig, corsHeaders } from '../_shared/config.ts'
import { z } from 'https://esm.sh/zod@3.23.8'
import Stripe from 'https://esm.sh/stripe@12.17.0'

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
    
    // Initialize Stripe
    const stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: stripeConfig.apiVersion,
    })
    
    // Parse request body
    let body
    try {
      body = await req.json()
    } catch (err) {
      console.error('JSON parse error:', err)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON', details: err.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const parseResult = purchaseRequestSchema.safeParse(body)
    
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
    
    const { userId, packageId, customAmount, customPrice, paymentProvider, paymentMethod } = parseResult.data
    
    // Ensure the authenticated user matches the requested userId
    if (user.id !== userId) {
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
      // Fetch existing rifa package
      const { data: pkg, error: pkgError } = await supabase
        .from('rifa_packages')
        .select('*')
        .eq('id', packageId)
        .eq('active', true)
        .single()
      
      if (pkgError || !pkg) {
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
    } else if (customAmount) {
      // Calculate custom package
      const { data: packages, error: pkgsError } = await supabase
        .from('rifa_packages')
        .select('*')
        .eq('active', true)
        .order('rifas_amount', { ascending: true })
      
      if (pkgsError || !packages || packages.length === 0) {
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
    } else {
      return new Response(
        JSON.stringify({ error: 'Pacote ou quantidade personalizada não especificada' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
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
    
    // Handle payment based on provider
    let paymentData
    
    if (paymentProvider === 'mercado_pago') {
      // Simulated Mercado Pago integration
      paymentData = {
        payment_id: `mp-${Date.now()}`,
        payment_url: `https://mercadopago.com/checkout/${purchase.id}`,
        qr_code: paymentMethod === 'pix' ? 'data:image/png;base64,mockQrCode' : null,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      }
    } else if (paymentProvider === 'stripe') {
      try {
        // Get user information for Stripe customer
        const { data: userProfile, error: userError } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', userId)
          .single()
          
        if (userError || !userProfile) {
          throw new Error('User profile not found')
        }
        
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
        } else {
          customerId = customers.stripe_id
        }
        
        // Create payment session based on payment method
        if (paymentMethod === 'credit_card' || paymentMethod === 'debit') {
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
        } else if (paymentMethod === 'pix') {
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
    
    // Update purchase with payment ID
    await supabase
      .from('rifa_purchases')
      .update({ payment_id: paymentData.payment_id })
      .eq('id', purchase.id)
    
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