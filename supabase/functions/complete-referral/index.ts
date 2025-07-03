import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verificar se este é o primeiro sucesso do usuário (primeira missão completa)
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
      return new Response(
        JSON.stringify({ message: 'Não é a primeira missão completa' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Buscar indicação pendente para este usuário
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
      return new Response(
        JSON.stringify({ message: 'Nenhuma indicação pendente encontrada' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Atualizar status da indicação para completo
    const { error: updateError } = await supabase
      .from('indicacoes')
      .update({ status: 'completo' })
      .eq('id', indicacao.id)

    if (updateError) {
      throw updateError
    }

    // NOVO: Buscar o ID do participante referenciador para dar a recompensa
    const { data: referencia, error: referenciaError } = await supabase
      .from('referencias')
      .select('participante_id')
      .eq('id', indicacao.referencia_id)
      .single()

    if (referenciaError) {
      throw referenciaError
    }

    // NOVO: Award 200 rifas (points) to the referrer
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
      // Continue execution even if this fails, but log the error
    }

    // Verificar e gerar recompensas baseadas em marcos
    await checkAndGenerateRewards(supabase, indicacao.referencia_id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Indicação atualizada, recompensa de 200 rifas concedida e marcos processados' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro ao processar indicação:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Função para verificar e gerar recompensas baseadas em marcos
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