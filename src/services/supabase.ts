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

  validateSubmission: async (
    submissionId: string, 
    validatedBy: string, 
    result: 'aprovado' | 'rejeitado', 
    isAdmin: boolean = false,
    notes?: string
  ) => {
    const client = await getSupabaseClient();
    
    try {
      const { data: submissionData, error: getError } = await client
        .from('mission_submissions')
        .select('mission_id, user_id, status') // mission_id, user_id still needed for context if any further action depends on them
        .eq('id', submissionId)
        .single();
        
      if (getError) throw getError;
      
      let newStatus;
      if (result === 'aprovado') {
        newStatus = 'approved';
      } else if (result === 'rejeitado') {
        if (isAdmin) {
          newStatus = 'rejected';
        } else {
          newStatus = 'segunda_instancia';
        }
      }
      
      console.log(`Atualizando submissão ${submissionId} para status: ${newStatus}`);
      
      const { data: submission, error: submissionError } = await client
        .from('mission_submissions')
        .update({
          status: newStatus,
          validated_by: validatedBy,
          admin_validated: isAdmin,
          feedback: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId)
        .select()
        .single();
      
      if (submissionError) throw submissionError;
      
      const { error: logError } = await client
        .from('mission_validation_logs')
        .insert([{
          submission_id: submissionId,
          validated_by: validatedBy,
          is_admin: isAdmin,
          result,
          notes
        }]);
      
      if (logError) throw logError;
      
      // REMOVED: Direct point and reward awarding logic.
      // This should be handled by calling the 'finalize_submission' RPC
      // at the appropriate point in the application flow.
      // If this validateSubmission call IS that appropriate point for certain roles/stages,
      // then this function should be refactored to call the RPC.
      
      return submission;
    } catch (error) {
      console.error('Error validating submission:', error);
      throw error;
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

    // The `reward_participant_for_submission` SQL function (called by `finalize_submission` RPC)
    // already handles updating `profiles.credits` atomically.
    // If tokens need to be added outside of mission rewards, a dedicated RPC for incrementing credits is better.
    // For now, let's assume token addition is primarily through mission rewards via finalize_submission.
    // This function as-is uses a non-atomic read-then-write and might be redundant.

    // Option 1: Call a new RPC (e.g., 'increment_credits') - PREFERRED for general use
    // const { data, error } = await client.rpc('increment_user_credits', { p_user_id: userId, p_amount: amount });
    // if (error) throw error;
    // return data; // Adjust return shape as needed

    // Option 2: Keep existing logic but acknowledge it's not ideal (NOT RECOMMENDED for new changes)
    // For demonstration, I will comment out the direct update and log a warning.
    console.warn("missionService.addTokens: This function directly updates credits and might be redundant or non-atomic. Consider using an RPC for atomic credit updates if needed outside mission finalization.");
    const { data: profileData, error: profileError } = await client
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .maybeSingle();
    if (profileError) throw profileError;
    const newTotal = (Number(profileData?.credits) || 0) + amount;
    // const { data, error } = await client
    //   .from('profiles')
    //   .update({ credits: newTotal, updated_at: new Date().toISOString() })
    //   .eq('id', userId)
    //   .select()
    //   .single();
    // if (error) throw error;
    // return { user_id: userId, total_tokens: newTotal, used_tokens: 0 }; // Original return shape
    
    // For now, returning a placeholder or erroring might be safer if this path is unintended.
    // This signifies that the function needs a proper RPC or should not be used for profile updates.
    return { user_id: userId, total_tokens: newTotal, used_tokens: 0, warning: "Token update bypassed pending RPC implementation" };
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
