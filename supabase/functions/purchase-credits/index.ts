import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { corsHeaders } from '../_shared/cors.ts'
import { z } from 'https://esm.sh/zod@3.23.8'

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Parse request body
    const body = await req.json()
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
    
    // Fetch package or calculate custom package
    let packageData
    
    if (packageId) {
      // Fetch existing package
      const { data: pkg, error: pkgError } = await supabase
        .from('credit_packages')
        .select('*')
        .eq('id', packageId)
        .eq('active', true)
        .single()
      
      if (pkgError || !pkg) {
        return new Response(
          JSON.stringify({ error: 'Pacote não encontrado ou inativo' }), 
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      packageData = pkg
    } else if (customAmount) {
      // Calculate custom package
      // Find the appropriate bonus tier based on amount
      const { data: packages, error: pkgsError } = await supabase
        .from('credit_packages')
        .select('*')
        .eq('active', true)
        .order('base', { ascending: true })
      
      if (pkgsError || !packages || packages.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Erro ao calcular pacote personalizado' }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      // Find the appropriate bonus tier
      let bonus = 0
      for (const pkg of packages) {
        if (customAmount >= pkg.base) {
          // Calculate bonus percentage
          const bonusPercentage = pkg.bonus / pkg.base
          bonus = Math.floor(customAmount * bonusPercentage)
        }
      }
      
      // Calculate price based on amount (10 credits = R$1.00)
      const price = customPrice || (customAmount / 10)
      
      packageData = {
        id: null,
        base: customAmount,
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
      .from('credit_purchases')
      .insert({
        user_id: userId,
        package_id: packageData.id,
        base: packageData.base,
        bonus: packageData.bonus,
        total_credits: packageData.base + packageData.bonus,
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
        JSON.stringify({ error: 'Erro ao registrar compra' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // In a real implementation, we would call the payment provider's API here
    // For now, we'll simulate a successful payment initiation
    
    // Generate a mock payment URL and ID based on the provider
    let paymentData
    if (paymentProvider === 'mercado_pago') {
      paymentData = {
        payment_id: `mp-${Date.now()}`,
        payment_url: `https://mercadopago.com/checkout/${purchase.id}`,
        qr_code: paymentMethod === 'pix' ? 'data:image/png;base64,mockQrCode' : null,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      }
    } else {
      paymentData = {
        payment_id: `stripe-${Date.now()}`,
        payment_url: `https://stripe.com/checkout/${purchase.id}`,
        session_id: `cs_${Date.now()}`,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      }
    }
    
    // Update purchase with payment ID
    await supabase
      .from('credit_purchases')
      .update({ payment_id: paymentData.payment_id })
      .eq('id', purchase.id)
    
    // Return payment info
    return new Response(
      JSON.stringify({
        success: true,
        purchase_id: purchase.id,
        payment: paymentData,
        package: {
          base: packageData.base,
          bonus: packageData.bonus,
          total: packageData.base + packageData.bonus,
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
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 