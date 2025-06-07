import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './config';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { 
  Mission, 
  MissionSubmission, 
  UserTokens,
  ValidationLog,
  MissionReward
} from '@/types/missions';
import { withPerformanceMonitoring } from '@/utils/performance-monitor';

// Usando a instância otimizada
const supabaseInstance = supabaseClient;

// Valores constantes para evitar problemas de CORS
const SUPABASE_URL = "https://zfryjwaeojccskfiibtq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmcnlqd2Flb2pjY3NrZmlpYnRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNzA1MDAsImV4cCI6MjA2MDg0NjUwMH0.tgN7P0_QIgNu1ezptyJIKtYGRyOJSxV_skDn0WrVlN8";

// Função para obter o cliente Supabase - apenas retorna a instância existente
export const getSupabaseClient = async () => supabaseInstance;

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

// Atualizar para usar serviços RLS otimizados
export { RLSOptimizedService } from './rls-optimized';

// Atualizar missionService com performance otimizada pós-RLS
export const missionService = {
  supabase,
  
  // Missões com RLS otimizado e performance máxima
  getMissions: withPerformanceMonitoring(async (status?: string) => {
    const client = await getSupabaseClient();
    let query = client.from('missions').select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    // RLS otimizado - sem necessidade de filtros manuais adicionais
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }, 'getMissions_optimized'),

  getMissionById: withPerformanceMonitoring(async (id: string) => {
    const client = await getSupabaseClient();
    const { data, error } = await client
      .from('missions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }, 'getMissionById_optimized'),

  createMission: withPerformanceMonitoring(async (mission: Mission) => {
    const client = await getSupabaseClient();
    try {
      const { id, ...missionWithoutId } = mission; 
      
      const { data, error } = await client
        .from('missions')
        .insert([missionWithoutId])
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') {
          console.warn('Erro de chave duplicada, tentando abordagem alternativa...');
          
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
  }, 'createMission'),

  updateMissionStatus: withPerformanceMonitoring(async (id: string, status: string) => {
    const client = await getSupabaseClient();
    const { data, error } = await client
      .from('missions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }, 'updateMissionStatus'),

  // Submissões com RLS consolidado e performance máxima
  getSubmissions: withPerformanceMonitoring(async (filters: { mission_id?: string; user_id?: string; status?: string }) => {
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
    
    // RLS otimizado automaticamente filtra baseado nas políticas consolidadas
    const { data, error } = await query.order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }, 'getSubmissions_optimized'),

  createSubmission: withPerformanceMonitoring(async (submission: MissionSubmission) => {
    const client = await getSupabaseClient();
    const { data, error } = await client
      .from('mission_submissions')
      .insert([submission])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }, 'createSubmission'),

  validateSubmission: withPerformanceMonitoring(async ({
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
  }) => {
    console.log(`Validando submissão ${submissionId} com resultado: ${result}`);

    const client = await getSupabaseClient();

    try {
      const { data: submissionData, error: getError } = await client
        .from('mission_submissions')
        .select('mission_id, user_id, status')
        .eq('id', submissionId)
        .single();
        
      if (getError) throw getError;
      
      const updatePayload: any = {
        validated_by: validatedBy,
        updated_at: new Date().toISOString()
      };
      
      if (result === 'aprovado') {
        updatePayload.status = 'approved';
        updatePayload.review_stage = 'finalized';
      } else if (result === 'rejeitado') {
        if (isAdmin) {
          updatePayload.status = 'rejected';
        } else {
          updatePayload.status = 'second_instance_pending';
        }
      } else if (result === 'segunda_instancia') {
        updatePayload.status = 'second_instance_pending';
        updatePayload.review_stage = 'second_instance';
        updatePayload.second_instance = true;
      }

      console.log(`Atualizando submissão ${submissionId} para status: ${updatePayload.status}`, updatePayload);
      
      const { data: submission, error: submissionError } = await client
        .from('mission_submissions')
        .update(updatePayload)
        .eq('id', submissionId)
        .select()
        .single();
      
      if (submissionError) throw submissionError;
      
      const validationLog = {
        submission_id: submissionId,
        validated_by: validatedBy,
        is_admin: isAdmin,
        result,
        notes
      };
      
      const { error: logError } = await client
        .from('mission_validation_logs')
        .insert(validationLog);

      if (logError) throw logError;
      
      return submission;
    } catch (error) {
      console.error('Error validating submission:', error);
      return { 
        success: false, 
        error 
      };
    }
  }, 'validateSubmission'),

  // Tokens de usuário com RLS otimizado
  getUserTokens: withPerformanceMonitoring(async (userId: string) => {
    const client = await getSupabaseClient();
    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('rifas')
      .eq('id', userId)
      .maybeSingle();
    if (profileError) throw profileError;
    const total = Number((profile as any)?.rifas) || 0;
    return { user_id: userId, total_tokens: total, used_tokens: 0 };
  }, 'getUserTokens_optimized'),

  addTokens: withPerformanceMonitoring(async (userId: string, amount: number) => {
    const client = await getSupabaseClient();
    const { data, error } = await client
      .from('profiles')
      .update({ rifas: amount })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }, 'addTokens')
};
