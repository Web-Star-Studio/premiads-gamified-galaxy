import { supabase } from '@/integrations/supabase/client';

// Tipos de Ação para a Edge Function
export type ModerationAction =
  | "ADVERTISER_APPROVE_FIRST_INSTANCE"
  | "ADVERTISER_REJECT_TO_SECOND_INSTANCE"
  | "ADMIN_REJECT"
  | "ADMIN_RETURN_TO_ADVERTISER"
  | "ADVERTISER_APPROVE_SECOND_INSTANCE"
  | "ADVERTISER_REJECT_SECOND_INSTANCE";

export type ValidationStage = 'advertiser_first' | 'admin' | 'advertiser_second';

// Mantendo a interface de entrada similar para menor refatoração nos componentes
export interface ModerateMissionSubmissionInput {
  submissionId: string;
  // approverId: string; // Não mais enviado diretamente para a Edge Function, pois é obtido do JWT
  decision: 'approve' | 'reject';
  stage: ValidationStage;
  feedback?: string; // Mantido na interface, mas não usado na chamada da Edge Function por enquanto
}

// Interface de resposta da Edge Function (simplificada)
export interface ModerateMissionSubmissionResponse {
  success: boolean;
  message?: string; // Mensagem de sucesso ou erro da Edge Function
  error?: string; // Para compatibilidade com a estrutura anterior, mas message deve ser priorizado
}

function getModerationAction(decision: 'approve' | 'reject', stage: ValidationStage): ModerationAction | null {
  if (stage === 'advertiser_first') {
    return decision === 'approve' ? 'ADVERTISER_APPROVE_FIRST_INSTANCE' : 'ADVERTISER_REJECT_TO_SECOND_INSTANCE';
  }
  if (stage === 'admin') {
    // No fluxo atual, admin aprovar significa "retornar ao anunciante" para nova avaliação do anunciante
    return decision === 'approve' ? 'ADMIN_RETURN_TO_ADVERTISER' : 'ADMIN_REJECT';
  }
  if (stage === 'advertiser_second') {
    return decision === 'approve' ? 'ADVERTISER_APPROVE_SECOND_INSTANCE' : 'ADVERTISER_REJECT_SECOND_INSTANCE';
  }
  console.warn(`Combinação não mapeada de decision/stage: ${decision}/${stage}`);
  return null;
}

/**
 * Função auxiliar para chamar a Edge Function de completar referência
 */
async function callCompleteReferralFunction(submissionId: string): Promise<void> {
  try {
    // Buscar dados da submissão para obter o user_id
    const { data: submission, error: submissionError } = await supabase
      .from('mission_submissions')
      .select('user_id')
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      console.error('Erro ao buscar submissão para processar referência:', submissionError);
      return;
    }

    // Chamar Edge Function para processar referência
    const { error } = await supabase.functions.invoke('complete-referral', {
      body: { userId: submission.user_id }
    });

    if (error) {
      console.error('Erro ao processar referência:', error);
    } else {
      console.log('Referência processada com sucesso para usuário:', submission.user_id);
    }
  } catch (error) {
    console.error('Erro inesperado ao processar referência:', error);
  }
}

/**
 * Função auxiliar que faz a chamada real para a Edge Function
 */
async function callModerationEdgeFunction(
  action: ModerationAction,
  submissionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Calling Edge Function 'moderate-mission-submission' with action: ${action}, submission_id: ${submissionId}`);
    
    const { data, error } = await supabase.functions.invoke('moderate-mission-submission', {
      body: { submission_id: submissionId, action }
    });

    if (error) {
      console.log('Edge Function invocation error:', error);
      
      // For approval actions, try the fallback function
      if (action === 'ADVERTISER_APPROVE_FIRST_INSTANCE' || action === 'ADVERTISER_APPROVE_SECOND_INSTANCE') {
        console.log('Trying fallback mission-approval-fix function...');
        
        const { data: fallbackData, error: fallbackError } = await supabase.functions.invoke('mission-approval-fix', {
          body: { submission_id: submissionId }
        });

        if (fallbackError) {
          console.log('Fallback function also failed:', fallbackError);
          return { success: false, error: fallbackError.message };
        }

        if (fallbackData?.success) {
          console.log('Fallback function succeeded:', fallbackData);
          return { success: true };
        }
      }
      
      return { success: false, error: error.message };
    }

    if (data?.success) {
      return { success: true };
    } else {
      return { success: false, error: data?.error || 'Unknown error occurred' };
    }
  } catch (err: any) {
    console.error('Error in callModerationEdgeFunction:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Modera uma submissão de missão chamando a Edge Function `moderate-mission-submission`.
 * A assinatura da função exportada é mantida como `finalizeMissionSubmission` para retrocompatibilidade.
 */
async function moderateMissionSubmissionInternal({
  submissionId,
  decision,
  stage,
  // feedback // O feedback não é usado na chamada atual da Edge Function por enquanto
}: ModerateMissionSubmissionInput): Promise<ModerateMissionSubmissionResponse> {
  const action = getModerationAction(decision, stage);

  if (!action) {
    const errorMessage = `Ação de moderação inválida para stage: ${stage} e decision: ${decision}`;
    console.error(errorMessage);
    return { success: false, error: errorMessage, message: errorMessage };
  }

  try {
    const { success, error } = await callModerationEdgeFunction(action, submissionId);

    if (success) {
      // Se a submissão foi aprovada, chamar a Edge Function para processar referência
      if (action === 'ADVERTISER_APPROVE_FIRST_INSTANCE' || action === 'ADVERTISER_APPROVE_SECOND_INSTANCE') {
        await callCompleteReferralFunction(submissionId);
      }
      
      return { success: true, message: 'Ação de moderação processada com sucesso.' };
    } else {
      return { success: false, error: error, message: error };
    }
  } catch (error: any) {
    console.error('Erro inesperado ao moderar submissão:', error);
    return { success: false, error: error.message, message: error.message };
  }
}

// Renomeando a função exportada para manter a compatibilidade de importação
// A interface de entrada também precisa ser exportada com o nome esperado se os componentes a usam.
export type { ModerateMissionSubmissionInput as FinalizeMissionSubmissionInput };
export type { ModerateMissionSubmissionResponse as FinalizeMissionSubmissionResponse };
export { moderateMissionSubmissionInternal as finalizeMissionSubmission };
