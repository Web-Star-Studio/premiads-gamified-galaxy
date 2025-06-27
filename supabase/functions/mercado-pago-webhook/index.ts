import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Configuração do Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

serve(async (req) => {
  console.log('Mercado Pago webhook called:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  })

  // Handle CORS for preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verificar assinatura do webhook (segurança)
    const signature = req.headers.get('x-signature')
    const webhookSecret = Deno.env.get('MERCADO_PAGO_WEBHOOK_SECRET_TEST') || Deno.env.get('MERCADO_PAGO_WEBHOOK_SECRET_PROD')
    
    // Parse do body da requisição
    let body
    let bodyText: string
    
    try {
      bodyText = await req.text()
      
      // Verificar assinatura se configurada
      if (webhookSecret && signature) {
        console.log('Verifying webhook signature...')
        
        // Verificar se a assinatura é válida usando HMAC SHA256
        const encoder = new TextEncoder()
        const keyData = encoder.encode(webhookSecret)
        
        const key = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        )
        
        const expectedSignature = await crypto.subtle.sign(
          'HMAC',
          key,
          encoder.encode(bodyText)
        )
        
        const expectedHex = Array.from(new Uint8Array(expectedSignature))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
        
        // Extrair apenas o hash da assinatura (remover prefixo se houver)
        const receivedSignature = signature.includes('=') ? signature.split('=')[1] : signature
        
        if (expectedHex !== receivedSignature) {
          console.warn('Invalid webhook signature received')
          return new Response(
            JSON.stringify({ error: 'Invalid signature' }),
            { 
              status: 401, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        
        console.log('Webhook signature verified successfully ✅')
      } else {
        console.warn('⚠️ Webhook secret not configured or signature not provided - proceeding without verification')
      }
      
      // Parse do JSON após verificação
      body = JSON.parse(bodyText)
      console.log('Webhook body received:', body)
      
    } catch (parseError) {
      console.error('Error parsing webhook body:', parseError)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verificar se é notificação de pagamento do Mercado Pago
    if (body.type !== 'payment') {
      console.log('Webhook type not payment, ignoring:', body.type)
      return new Response(
        JSON.stringify({ message: 'Webhook received but not a payment notification' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      console.error('No payment ID in webhook data')
      return new Response(
        JSON.stringify({ error: 'No payment ID provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Processing payment notification for payment ID:', paymentId)

    // Obter detalhes do pagamento do Mercado Pago
    const mpAccessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    if (!mpAccessToken) {
      console.error('MERCADO_PAGO_ACCESS_TOKEN not configured')
      return new Response(
        JSON.stringify({ error: 'Mercado Pago token not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Buscar informações do pagamento na API do Mercado Pago
    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${mpAccessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!paymentResponse.ok) {
      console.error('Error fetching payment from Mercado Pago:', {
        status: paymentResponse.status,
        statusText: paymentResponse.statusText
      })
      return new Response(
        JSON.stringify({ error: 'Failed to fetch payment details' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const paymentData = await paymentResponse.json()
    console.log('Payment data from Mercado Pago:', {
      id: paymentData.id,
      status: paymentData.status,
      external_reference: paymentData.external_reference,
      transaction_amount: paymentData.transaction_amount
    })

    // Obter o ID da compra da referência externa
    const purchaseId = paymentData.external_reference
    if (!purchaseId) {
      console.error('No external_reference (purchase_id) in payment data')
      return new Response(
        JSON.stringify({ error: 'No purchase ID in payment external reference' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verificar se a compra existe
    const { data: purchase, error: purchaseError } = await supabase
      .from('rifa_purchases')
      .select('*')
      .eq('id', purchaseId)
      .single()

    if (purchaseError || !purchase) {
      console.error('Purchase not found:', { purchaseId, error: purchaseError })
      return new Response(
        JSON.stringify({ error: 'Purchase not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Purchase found:', {
      id: purchase.id,
      status: purchase.status,
      user_id: purchase.user_id,
      total_rifas: purchase.total_rifas
    })

    // Processar baseado no status do pagamento
    let newStatus = purchase.status
    
    if (paymentData.status === 'approved') {
      newStatus = 'confirmed'
      console.log('Payment approved, confirming purchase')
      
      // Usar a função centralizada para atualizar status e adicionar rifas
      const updateResponse = await fetch(`${supabaseUrl}/functions/v1/update-rifa-purchase-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({
          purchase_id: purchaseId,
          new_status: 'confirmed'
        })
      })

      if (!updateResponse.ok) {
        const updateError = await updateResponse.text()
        console.error('Failed to update purchase status:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to update purchase status' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const updateResult = await updateResponse.json()
      console.log('Purchase updated successfully:', updateResult)

    } else if (paymentData.status === 'rejected' || paymentData.status === 'cancelled') {
      newStatus = 'failed'
      console.log('Payment rejected/cancelled, marking purchase as failed')
      
      // Atualizar apenas o status para falha
      const { error: updateError } = await supabase
        .from('rifa_purchases')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', purchaseId)

      if (updateError) {
        console.error('Error updating purchase to failed:', updateError)
      }

    } else {
      console.log('Payment status not final, no action needed:', paymentData.status)
    }

    // Atualizar o payment_id se necessário
    if (purchase.payment_id !== paymentData.id) {
      await supabase
        .from('rifa_purchases')
        .update({ payment_id: paymentData.id })
        .eq('id', purchaseId)
    }

    console.log('Webhook processed successfully')
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully',
        purchase_id: purchaseId,
        payment_status: paymentData.status,
        new_purchase_status: newStatus
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unhandled webhook error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 