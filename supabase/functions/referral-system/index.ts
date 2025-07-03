import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReferralRequest {
  action: 'process_signup' | 'process_mission_completion' | 'validate_code' | 'get_stats' | 'generate_codes_for_existing_users' | 'get_user_code'
  userId?: string
  referralCode?: string
  submissionId?: string
}

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, userId, referralCode }: ReferralRequest = await req.json()

    if (!action) {
      return createErrorResponse('Ação é obrigatória', 400)
    }

    switch (action) {
      case 'process_signup':
        return await processSignupReferral(supabase, userId!, referralCode!)
      
      case 'process_mission_completion':
        return await processMissionCompletion(supabase, userId!)
      
      case 'validate_code':
        return await validateReferralCode(supabase, referralCode!)
      
      case 'get_stats':
        return await getReferralStats(supabase, userId!)
      
      case 'generate_codes_for_existing_users':
        return await generateCodesForExistingUsers(supabase)
      
      case 'get_user_code':
        return await getUserCode(supabase, { user_id: userId! })
      
      default:
        return createErrorResponse('Ação inválida', 400)
    }
  } catch (error: any) {
    console.error('Erro inesperado no servidor:', error)
    return createErrorResponse(error?.message ?? 'Erro desconhecido no servidor', 500)
  }
})

// Processar indicação durante signup
async function processSignupReferral(supabase: any, userId: string, referralCode: string): Promise<Response> {
  try {
    if (!userId || !referralCode) {
      return createErrorResponse('userId e referralCode são obrigatórios', 400)
    }

    const cleanCode = String(referralCode).trim().toUpperCase()

    // 1. Validar código de referência
    const { data: validationData, error: validationError } = await supabase.rpc('validate_referral_code_direct', {
      input_code: cleanCode,
    })

    if (validationError || !validationData || validationData.length === 0) {
      return createErrorResponse('Código de referência inválido ou inativo', 400)
    }

    const ownerId: string = validationData[0].participante_id as string

    // 2. Verificar auto-referência
    if (ownerId === userId) {
      return createErrorResponse('Você não pode usar seu próprio código', 400)
    }

    // 3. Verificar se já existe indicação para este usuário
    const { data: existingIndicacao } = await supabase
      .from('indicacoes')
      .select('id')
      .eq('convidado_id', userId)
      .maybeSingle()

    if (existingIndicacao) {
      return createSuccessResponse('Indicação já existente para este usuário')
    }

    // 4. Buscar referencia_id do código
    const { data: referencia } = await supabase
      .from('referencias')
      .select('id')
      .eq('codigo', cleanCode)
      .maybeSingle()

    if (!referencia) {
      return createErrorResponse('Referência não encontrada', 400)
    }

    // 5. Criar indicação pendente
    const { error: indicacaoError } = await supabase
      .from('indicacoes')
      .insert({
        referencia_id: referencia.id,
        convidado_id: userId,
        status: 'pendente',
      })

    if (indicacaoError) {
      console.error('Erro ao inserir indicação:', indicacaoError)
      return createErrorResponse('Erro ao registrar indicação', 500)
    }

    // 6. Conceder 50 rifas de bônus ao novo usuário
    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .select('rifas')
      .eq('id', userId)
      .maybeSingle()

    if (profileErr) {
      console.error('Erro ao buscar perfil:', profileErr)
    }

    const currentRifas = profileData?.rifas ?? 0

    const { error: bonusError } = await supabase
      .from('profiles')
      .update({ rifas: currentRifas + 50, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (bonusError) {
      console.error('Erro ao aplicar bônus:', bonusError)
    }

    // 7. Registrar transação
    await supabase
      .from('rifas_transactions')
      .insert({
        user_id: userId,
        transaction_type: 'bonus',
        amount: 50,
        description: 'Bônus de boas-vindas por usar código de referência'
      })

    return createSuccessResponse('Indicação registrada e bônus aplicado', { bonus_rifas: 50 })
  } catch (error: any) {
    console.error('Erro ao processar signup:', error)
    return createErrorResponse(error?.message ?? 'Erro interno', 500)
  }
}

// Processar conclusão de missão (primeira missão do usuário)
async function processMissionCompletion(supabase: any, userId: string): Promise<Response> {
  try {
    if (!userId) {
      return createErrorResponse('userId é obrigatório', 400)
    }

    // 1. Verificar se é a primeira missão aprovada do usuário
    const { data: submissions, error: submissionError } = await supabase
      .from('mission_submissions')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'approved')

    if (submissionError) {
      throw submissionError
    }

    // Se não for a primeira missão, não faz nada
    if (!submissions || submissions.length !== 1) {
      return createSuccessResponse('Não é a primeira missão completa')
    }

    // 2. Buscar indicação pendente para este usuário
    const { data: indicacao, error: indicacaoError } = await supabase
      .from('indicacoes')
      .select('id, referencia_id')
      .eq('convidado_id', userId)
      .eq('status', 'pendente')
      .maybeSingle()

    if (indicacaoError) {
      throw indicacaoError
    }

    if (!indicacao) {
      return createSuccessResponse('Nenhuma indicação pendente encontrada')
    }

    // 3. Atualizar status da indicação para completo
    const { error: updateError } = await supabase
      .from('indicacoes')
      .update({ status: 'completo' })
      .eq('id', indicacao.id)

    if (updateError) {
      throw updateError
    }

    // 4. Buscar o participante referenciador
    const { data: referencia, error: referenciaError } = await supabase
      .from('referencias')
      .select('participante_id')
      .eq('id', indicacao.referencia_id)
      .single()

    if (referenciaError) {
      throw referenciaError
    }

    // 5. Conceder 200 rifas ao referenciador
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('rifas')
      .eq('id', referencia.participante_id)
      .single()

    if (profileError) {
      throw profileError
    }

    const currentRifas = currentProfile?.rifas || 0
    const { error: rewardError } = await supabase
      .from('profiles')
      .update({ 
        rifas: currentRifas + 200,
        updated_at: new Date().toISOString()
      })
      .eq('id', referencia.participante_id)

    if (rewardError) {
      console.error('Erro ao dar recompensa ao referenciador:', rewardError)
    }

    // 6. Registrar transação
    await supabase
      .from('rifas_transactions')
      .insert({
        user_id: referencia.participante_id,
        transaction_type: 'bonus',
        amount: 200,
        description: 'Recompensa por indicação completa'
      })

    // 7. Verificar e gerar recompensas baseadas em marcos
    await checkAndGenerateRewards(supabase, indicacao.referencia_id)

    return createSuccessResponse('Indicação completada, recompensa de 200 rifas concedida e marcos processados')
  } catch (error: any) {
    console.error('Erro ao processar missão:', error)
    return createErrorResponse(error?.message ?? 'Erro interno', 500)
  }
}

// Validar código de referência
async function validateReferralCode(supabase: any, code: string): Promise<Response> {
  try {
    if (!code || !String(code).trim()) {
      return createErrorResponse('Código é obrigatório', 400)
    }

    const cleanCode = String(code).trim().toUpperCase()

    const { data: validationData, error: validationError } = await supabase.rpc('validate_referral_code_direct', {
      input_code: cleanCode,
    })

    if (validationError) {
      console.error('Erro na RPC validate_referral_code_direct:', validationError)
      return createErrorResponse('Erro de banco de dados ao validar o código.', 500)
    }
    
    if (!validationData || validationData.length === 0) {
      return createErrorResponse('Código de referência inválido ou inativo', 400)
    }

    const ownerId: string = validationData[0].participante_id as string
    const ownerName: string = validationData[0].full_name as string

    return createSuccessResponse('Código válido', { 
      valid: true,
      ownerId,
      ownerName
    })
  } catch (error: any) {
    console.error('Erro inesperado ao validar código:', error)
    return createErrorResponse(error?.message ?? 'Erro interno desconhecido', 500)
  }
}

// Buscar estatísticas de indicação
async function getReferralStats(supabase: any, userId: string): Promise<Response> {
  try {
    if (!userId) {
      return createErrorResponse('userId é obrigatório', 400)
    }

    // Buscar referência do usuário
    const { data: userRef, error: refError } = await supabase
      .from('referencias')
      .select('id')
      .eq('participante_id', userId)
      .maybeSingle()

    if (refError) throw refError

    if (!userRef) {
      return createSuccessResponse('Estatísticas encontradas', {
        totalConvites: 0,
        pendentes: 0,
        registrados: 0,
        pontosGanhos: 0
      })
    }

    // Buscar indicações
    const { data: indicacoes, error: indError } = await supabase
      .from('indicacoes')
      .select('status')
      .eq('referencia_id', userRef.id)

    if (indError) throw indError

    const totalConvites = indicacoes?.length || 0
    const pendentes = indicacoes?.filter(i => i.status === 'pendente').length || 0
    const registrados = indicacoes?.filter(i => i.status === 'completo').length || 0
    const pontosGanhos = registrados * 200

    return createSuccessResponse('Estatísticas encontradas', {
      totalConvites,
      pendentes,
      registrados,
      pontosGanhos
    })
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error)
    return createErrorResponse(error?.message ?? 'Erro interno', 500)
  }
}

// Verificar e gerar recompensas baseadas em marcos
async function checkAndGenerateRewards(supabase: any, referenciaId: string) {
  try {
    // Contar indicações completas
    const { data: indicacoes, error } = await supabase
      .from('indicacoes')
      .select('id')
      .eq('referencia_id', referenciaId)
      .eq('status', 'completo')

    if (error) throw error

    const totalCompletas = indicacoes?.length || 0

    // Verificar se já foi gerada recompensa para 3 amigos
    if (totalCompletas >= 3) {
      const { data: existing3 } = await supabase
        .from('recompensas_indicacao')
        .select('id')
        .eq('referencia_id', referenciaId)
        .eq('tipo', 'bonus_3_amigos')
        .maybeSingle()

      if (!existing3) {
        await supabase
          .from('recompensas_indicacao')
          .insert({
            referencia_id: referenciaId,
            tipo: 'bonus_3_amigos',
            valor: 500,
            status: 'disponivel'
          })
      }
    }

    // Verificar se já foi gerada recompensa para 5 amigos
    if (totalCompletas >= 5) {
      const { data: existing5 } = await supabase
        .from('recompensas_indicacao')
        .select('id')
        .eq('referencia_id', referenciaId)
        .eq('tipo', 'bonus_5_amigos')
        .maybeSingle()

      if (!existing5) {
        await supabase
          .from('recompensas_indicacao')
          .insert({
            referencia_id: referenciaId,
            tipo: 'bonus_5_amigos',
            valor: 1000,
            status: 'disponivel'
          })
      }
    }

    // Gerar bilhetes extras (3 bilhetes por indicação completa)
    await supabase
      .from('recompensas_indicacao')
      .insert({
        referencia_id: referenciaId,
        tipo: 'bilhetes_extras',
        valor: 3,
        status: 'disponivel'
      })

  } catch (error) {
    console.error('Erro ao verificar recompensas:', error)
  }
}

// Helpers
function createSuccessResponse(message: string, data?: any): Response {
  return new Response(
    JSON.stringify({ success: true, message, data }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

function createErrorResponse(error: string, status: number = 500): Response {
  return new Response(
    JSON.stringify({ success: false, error }),
    { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function generateCodesForExistingUsers(supabaseClient: any) {
  try {
    // Get users without referral codes
    const { data: usersWithoutCodes, error: usersError } = await supabaseClient
      .from('profiles')
      .select(`
        id,
        full_name,
        user_type,
        active,
        referencias!inner(codigo)
      `)
      .eq('user_type', 'participante')
      .eq('active', true)
      .is('referencias.codigo', null)

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch users without codes' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Alternative query to get users without codes
    const { data: allUsers, error: allUsersError } = await supabaseClient
      .from('profiles')
      .select('id, full_name, user_type, active')
      .eq('user_type', 'participante')
      .eq('active', true)

    if (allUsersError) {
      console.error('Error fetching all users:', allUsersError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch users' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get existing codes
    const { data: existingCodes, error: codesError } = await supabaseClient
      .from('referencias')
      .select('participante_id, codigo')

    if (codesError) {
      console.error('Error fetching existing codes:', codesError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch existing codes' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Filter users who don't have codes
    const existingUserIds = new Set(existingCodes?.map(c => c.participante_id) || [])
    const usersNeedingCodes = allUsers?.filter(user => !existingUserIds.has(user.id)) || []

    console.log(`Found ${usersNeedingCodes.length} users needing codes`)

    if (usersNeedingCodes.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'All users already have referral codes',
          created_codes: 0 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get existing code strings to avoid duplicates
    const existingCodeStrings = new Set(existingCodes?.map(c => c.codigo) || [])

    const newCodes = []

    for (const user of usersNeedingCodes) {
      let baseCode = generateCodeFromName(user.full_name)
      let finalCode = baseCode
      let counter = 1

      // Ensure uniqueness
      while (existingCodeStrings.has(finalCode)) {
        finalCode = `${baseCode}${counter}`
        counter++
      }

      existingCodeStrings.add(finalCode)

      newCodes.push({
        participante_id: user.id,
        codigo: finalCode,
        ativo: true,
        created_at: new Date().toISOString()
      })
    }

    // Insert new codes
    const { data: insertedCodes, error: insertError } = await supabaseClient
      .from('referencias')
      .insert(newCodes)
      .select()

    if (insertError) {
      console.error('Error inserting codes:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create referral codes' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Created ${newCodes.length} referral codes`,
        created_codes: newCodes.length,
        codes: newCodes.map(c => ({ user_id: c.participante_id, code: c.codigo }))
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in generateCodesForExistingUsers:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function getUserCode(supabaseClient: any, { user_id }: { user_id: string }) {
  try {
    const { data: referralCode, error } = await supabaseClient
      .from('referencias')
      .select('codigo, ativo')
      .eq('participante_id', user_id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user code:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        code: referralCode?.codigo || null,
        active: referralCode?.ativo || false
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in getUserCode:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

function generateCodeFromName(fullName: string): string {
  if (!fullName || fullName.trim() === '') {
    return `USER${Date.now()}2025`
  }

  // Remove special characters and spaces, convert to uppercase
  const cleanName = fullName
    .trim()
    .replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, '') // Remove special chars except accented letters
    .replace(/\s+/g, '') // Remove spaces
    .toUpperCase()
    .substring(0, 15) // Limit length

  // If name becomes empty after cleaning, use fallback
  if (cleanName === '') {
    return `USER${Date.now()}2025`
  }

  return `${cleanName}2025`
}
