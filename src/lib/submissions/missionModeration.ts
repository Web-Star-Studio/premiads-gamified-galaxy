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
 * Modera uma submissão de missão chamando a Edge Function `moderate-mission-submission`.
 * A assinatura da função exportada é mantida como `finalizeMissionSubmission` para retrocompatibilidade.
 */
async function moderateMissionSubmissionInternal({
  submissionId,
  decision,
  stage,
  // feedback // O feedback não é usado na chamada atual da Edge Function
}: ModerateMissionSubmissionInput): Promise<ModerateMissionSubmissionResponse> {
  const action = getModerationAction(decision, stage);

  if (!action) {
    const errorMessage = `Ação de moderação inválida para stage: ${stage} e decision: ${decision}`;
    console.error(errorMessage);
    return { success: false, error: errorMessage, message: errorMessage };
  }

  try {
    console.log(`Calling Edge Function 'moderate-mission-submission' with action: ${action}, submission_id: ${submissionId}`);
    const { data, error: functionError } = await supabase.functions.invoke('moderate-mission-submission', {
      body: {
        submission_id: submissionId,
        action: action,
      },
    });

    if (functionError) {
      console.error('Edge Function invocation error:', functionError);
      const errorContext = (functionError as any).context;
      const errorMessage = errorContext?.error?.message || functionError.message || "Erro ao invocar a função de moderação.";
      return { success: false, error: errorMessage, message: errorMessage };
    }
    
    // A Edge Function retorna { success: true, message: "..." } ou { error: "..." } no corpo 'data'
    if (data && data.error) {
        console.error('Error from Edge Function logic:', data.error);
        return { success: false, error: data.error, message: data.error };
    }

    if (data && data.success) {
        return {
            success: true,
            message: data.message || 'Ação de moderação processada com sucesso.',
        };
    }
    
    // Caso inesperado onde não há erro explícito mas também não há sucesso claro
    console.warn('Edge Function response did not indicate clear success or failure:', data);
    return { success: false, error: 'Resposta inesperada da função de moderação.', message: 'Resposta inesperada da função de moderação.' };

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
