import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './config';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { 
  Mission, 
  MissionSubmission, 
  UserTokens,
  ValidationLog,
  MissionReward
} from '@/hooks/useMissionsTypes';

// Inicialização lazy do cliente - usando a instância existente
let supabaseInstance = supabaseClient;

// Valores constantes para evitar problemas de CORS
const SUPABASE_URL = "https://zfryjwaeojccskfiibtq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmcnlqd2Flb2pjY3NrZmlpYnRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNzA1MDAsImV4cCI6MjA2MDg0NjUwMH0.tgN7P0_QIgNu1ezptyJIKtYGRyOJSxV_skDn0WrVlN8";

// Valores padrão para compatibilidade com código existente
// Permite inicialização mesmo se a configuração não estiver disponível imediatamente
const defaultUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const defaultKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

// Função para obter o cliente Supabase - apenas retorna a instância existente
export const getSupabaseClient = async () => {
  return supabaseInstance;
};

// Exporta a mesma instância para uso em todo o aplicativo
export const supabase = supabaseInstance;

// Re-export types
export type { 
  Mission, 
  MissionSubmission, 
  UserTokens,
  ValidationLog,
  MissionReward
};

// Definição de tipos
// export interface Mission {
//   id?: string;
//   title: string;
//   description: string;
//   requirements?: string;
//   type: 'formulario' | 'foto' | 'video' | 'check-in' | 'redes_sociais' | 'cupom' | 'pesquisa' | 'avaliacao';
//   target_audience?: string;
//   points_range: { min: number; max: number };
//   created_by: string;
//   cost_in_tokens: number;
//   status: 'ativa' | 'pendente' | 'encerrada';
//   expires_at?: string;
//   created_at?: string;
//   updated_at?: string;
// }

// export interface MissionSubmission {
//   id?: string;
//   user_id: string;
//   mission_id: string;
//   proof_url?: string[];
//   proof_text?: string;
//   status: 'pendente' | 'aprovado' | 'rejeitado' | 'segunda_instancia' | 'descartado';
//   validated_by?: string;
//   admin_validated?: boolean;
//   created_at?: string;
//   updated_at?: string;
// }

// export interface UserTokens {
//   id?: string;
//   user_id: string;
//   total_tokens: number;
//   used_tokens: number;
//   created_at?: string;
//   updated_at?: string;
// }

// export interface ValidationLog {
//   id?: string;
//   submission_id: string;
//   validated_by: string;
//   is_admin: boolean;
//   result: 'aprovado' | 'rejeitado';
//   notes?: string;
//   created_at?: string;
// }

// export interface MissionReward {
//   id?: string;
//   user_id: string;
//   mission_id: string;
//   submission_id: string;
//   points_earned: number;
//   rewarded_at?: string;
// }

// Serviço de missões - versão atualizada para usar getSupabaseClient
export const missionService = {
  // Referência ao cliente Supabase para ser utilizada em outros componentes
  supabase,
  
  // Missões
  getMissions: async (status?: string) => {
    const client = await getSupabaseClient();
    const query = client.from('missions').select('*');
    
    if (status) {
      query.eq('status', status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getMissionById: async (id: string) => {
    const client = await getSupabaseClient();
    const { data, error } = await client
      .from('missions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  createMission: async (mission: Mission) => {
    const client = await getSupabaseClient();
    try {
      // Remover o campo id para deixar o Supabase gerar automaticamente
      const { id, ...missionWithoutId } = mission; 
      
      const { data, error } = await client
        .from('missions') // Usar a tabela correta de acordo com a aplicação
        .insert([missionWithoutId])
        .select()
        .single();
      
      if (error) {
        // Se for um erro de chave duplicada, tenta novamente com outro approach
        if (error.code === '23505') { // código para violação de unique constraint
          console.warn('Erro de chave duplicada, tentando abordagem alternativa...');
          
          // Realizar uma inserção com um ID específico maior que o máximo atual
          const { data: maxIdData } = await client
            .from('missions')
            .select('id')
            .order('id', { ascending: false })
            .limit(1);
          
          const nextId = maxIdData && maxIdData.length > 0 
            ? Number(maxIdData[0].id) + 1 
            : 1;
          
          const { data: retryData, error: retryError } = await client
            .from('missions')
            .insert([{ ...missionWithoutId, id: String(nextId) }])
            .select()
            .single();
          
          if (retryError) throw retryError;
          return retryData;
        }
        
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Erro ao criar missão:', error);
      throw error;
    }
  },

  updateMissionStatus: async (id: string, status: string) => {
    const client = await getSupabaseClient();
    const { data, error } = await client
      .from('missions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Submissões
  getSubmissions: async (filters: { mission_id?: string; user_id?: string; status?: string }) => {
    const client = await getSupabaseClient();
    let query = client.from('mission_submissions').select('*, missions(title)');
    
    if (filters.mission_id) {
      query = query.eq('mission_id', filters.mission_id);
    }
    
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    const { data, error } = await query.order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  createSubmission: async (submission: MissionSubmission) => {
    const client = await getSupabaseClient();
    const { data, error } = await client
      .from('mission_submissions')
      .insert([submission])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Validates a mission submission by setting its status and other attributes.
   */
  async validateSubmission({
    submissionId,
    validatedBy,
    result,
    isAdmin = false,
    notes = '',
  }: {
    submissionId: string;
    validatedBy: string;
    result: 'aprovado' | 'rejeitado' | 'segunda_instancia';
    isAdmin?: boolean;
    notes?: string;
  }) {
    console.log(`Validando submissão ${submissionId} com resultado: ${result}`);

    const client = await getSupabaseClient();

    try {
      // Get submission info first
      const { data: subInfo, error: subError } = await client
        .from('mission_submissions')
        .select('mission_id,user_id,status')
        .eq('id', submissionId)
        .single();

      if (subError) throw subError;
      
      console.log(`Submission info:`, subInfo);
      
      // Map result to status and other properties
      const payload: Record<string, any> = {
        validated_by: validatedBy,
        feedback: notes || null,
        updated_at: new Date().toISOString()
      };

      // Set status based on the result
      if (result === 'aprovado') {
        payload.status = 'approved';
        payload.review_stage = 'finalized';
      } else if (result === 'rejeitado') {
        if (!isAdmin) {
          payload.status = 'second_instance_pending';
          payload.review_stage = 'second_instance';
        } else {
          payload.status = 'rejected';
          payload.review_stage = 'finalized';
        }
      } else if (result === 'segunda_instancia') {
        payload.status = 'second_instance_pending';
        payload.review_stage = 'second_instance';
      }

      console.log(`Atualizando submissão ${submissionId} para status: ${payload.status}`, payload);
      
      // Update the submission
      const { data: submission, error: updateError } = await client
        .from('mission_submissions')
        .update(payload)
        .eq('id', submissionId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Save to validation log
      const validationLog = {
        submission_id: submissionId,
        validated_by: validatedBy,
        result: result,
        is_admin: isAdmin,
        notes: notes || null,
        created_at: new Date().toISOString()
      };

      const { error: logError } = await client
        .from('mission_validation_logs')
        .insert(validationLog);

      if (logError) throw logError;

      // Se foi aprovado, tenta executar a atualização manualmente E chama o RPC
      if (payload.status === 'approved') {
        try {
          console.log('Submissão aprovada, atualizando pontos e status da missão...');
          
          // 1. Chama RPC de recompensa
          await client.rpc('reward_participant_for_submission', { 
            submission_id: submissionId 
          });
          console.log('RPC reward_participant_for_submission executado');
          
          // 2. Como fallback, faz manualmente caso a RPC falhe
          const { data: missionData } = await client
            .from('missions')
            .select('points,id')
            .eq('id', subInfo.mission_id)
            .single();
          
          if (missionData?.points) {
            // Atualiza o status da missão
            await client
              .from('missions')
              .update({
                status: 'ativa',
                updated_at: new Date().toISOString()
              })
              .eq('id', subInfo.mission_id);
            
            // Atualiza os pontos do usuário - primeiro busca pontos atuais
            // Primeiro busca os pontos atuais
            const { data: profileData } = await client
              .from('profiles')
              .select('points')
              .eq('id', subInfo.user_id)
              .single();
              
            // Depois atualiza com os novos pontos
            const currentPoints = profileData?.points || 0;
            const newPoints = currentPoints + missionData.points;
            
            await client
              .from('profiles')
              .update({
                points: newPoints,
                updated_at: new Date().toISOString()
              })
              .eq('id', subInfo.user_id);
              
            console.log(`Pontos atualizados: ${currentPoints} -> ${newPoints}`);
            
            // Registra a recompensa
            const existingReward = await client
              .from('mission_rewards')
              .select('id')
              .eq('submission_id', submissionId)
              .maybeSingle();
            
            if (!existingReward.data) {
              await client
                .from('mission_rewards')
                .insert({
                  user_id: subInfo.user_id,
                  mission_id: subInfo.mission_id,
                  submission_id: submissionId,
                  points_earned: missionData.points,
                  rewarded_at: new Date().toISOString()
                });
              
              console.log(`Pontos (${missionData.points}) adicionados manualmente para o usuário ${subInfo.user_id}`);
            }
          }
        } catch (err) {
          console.error('Erro ao processar recompensa:', err);
          // Continuamos mesmo com erro na recompensa
        }
      }

      return { 
        success: true, 
        data: submission 
      };
    } catch (error) {
      console.error('Error validating submission:', error);
      return { 
        success: false, 
        error 
      };
    }
  },

  // Tokens de usuário (agora centralizados em profiles)
  getUserTokens: async (userId: string) => {
    const client = await getSupabaseClient();
    // Busca créditos diretamente no perfil do usuário
    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .maybeSingle();
    if (profileError) throw profileError;
    const total = Number(profile?.credits) || 0;
    // Retorna no shape esperado para compatibilidade
    return { user_id: userId, total_tokens: total, used_tokens: 0 };
  },

  addTokens: async (userId: string, amount: number) => {
    const client = await getSupabaseClient();
    // Atualiza o saldo de créditos no perfil
    const { data: profileData, error: profileError } = await client
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .maybeSingle();
    if (profileError) throw profileError;
    const newTotal = (Number(profileData?.credits) || 0) + amount;
    const { data, error } = await client
      .from('profiles')
      .update({ credits: newTotal, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return { user_id: userId, total_tokens: newTotal, used_tokens: 0 };
  },

  // Recompensas
  getMissionRewards: async (userId: string) => {
    const client = await getSupabaseClient();
    const { data, error } = await client
      .from('mission_rewards')
      .select('*, missions(title)')
      .eq('user_id', userId)
      .order('rewarded_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Estatísticas
  getAdvertiserStats: async (userId: string) => {
    const client = await getSupabaseClient();
    // Total de missões ativas
    const { data: activeMissions, error: activeMissionsError } = await client
      .from('missions')
      .select('id')
      .eq('created_by', userId)
      .eq('status', 'ativa');
    
    if (activeMissionsError) throw activeMissionsError;
    
    // Total de submissões
    const { data: submissions, error: submissionsError } = await client
      .from('mission_submissions')
      .select('id, status, mission_id')
      .in('mission_id', activeMissions?.map(m => m.id) || []);
    
    if (submissionsError) throw submissionsError;
    
    // Total de submissões aprovadas
    const approvedSubmissions = submissions?.filter(s => s.status === 'aprovado') || [];
    
    // Taxa de conclusão
    const completionRate = submissions?.length 
      ? (approvedSubmissions.length / submissions.length) * 100 
      : 0;
    
    return {
      activeMissionsCount: activeMissions?.length || 0,
      totalSubmissions: submissions?.length || 0,
      approvedSubmissions: approvedSubmissions.length,
      completionRate
    };
  }
};
