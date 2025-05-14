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
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
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
    // Iniciar uma transação para atualizar o status da submissão e criar um log
    const { data: submission, error: submissionError } = await client
      .from('mission_submissions')
      .update({
        status: result === 'aprovado' ? 'aprovado' : isAdmin ? 'descartado' : 'segunda_instancia',
        validated_by: validatedBy,
        admin_validated: isAdmin,
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select()
      .single();
    
    if (submissionError) throw submissionError;
    
    // Criar log de validação
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
    
    return submission;
  },

  // Tokens de usuário
  getUserTokens: async (userId: string) => {
    const client = await getSupabaseClient();
    const { data, error } = await client
      .from('user_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // Ignora erro "não encontrado"
      throw error;
    }
    
    return data || { user_id: userId, total_tokens: 0, used_tokens: 0 };
  },

  addTokens: async (userId: string, amount: number) => {
    const client = await getSupabaseClient();
    // Primeiro, tentar obter os tokens existentes
    const { data: existingTokens, error: fetchError } = await client
      .from('user_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }
    
    if (existingTokens) {
      // Atualizar tokens existentes
      const { data, error } = await client
        .from('user_tokens')
        .update({ 
          total_tokens: existingTokens.total_tokens + amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Criar novo registro de tokens
      const { data, error } = await client
        .from('user_tokens')
        .insert([{
          user_id: userId,
          total_tokens: amount,
          used_tokens: 0
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
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
